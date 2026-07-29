/**
 * Les skills se publient a part du moteur (`npx skills add`), donc rien d'autre
 * ne les valide : ni le typecheck, ni le build, ni le rendu. Ce controle est
 * leur seul filet.
 *
 * Il existe parce que les deux lecteurs de frontmatter echouent en silence :
 * celui de Claude Code se rabat sur le titre du corps, et une skill perd alors
 * ses declencheurs sans que rien ne casse ; celui de skills.sh saute le fichier
 * avec un warning noye dans sa sortie. C'est arrive une fois, sur une
 * description contenant « : » (typographie francaise), invisible pendant des
 * mois.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { root } from "../src/root";

const SKILLS = fileURLToPath(root("skills/"));
const NAME_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Un scalaire YAML non quote ne peut pas contenir « : » (indicateur de mapping)
// ni commencer par un caractere de structure (bloc, ancre, alias, flow, tag).
const COLON = /:(\s|$)/;
const INDICATOR = /^[[\]{}#&*!|>%@`]/;

// Lu comme un parseur YAML strict le lirait : cles de premier niveau seulement,
// valeur brute laissee telle quelle, guillemets compris. Les fins de ligne sont
// normalisees parce que le depot melange CRLF et LF, et que les deux lecteurs
// reels acceptent les deux.
function parse(content: string) {
	const raw = content.replaceAll("\r\n", "\n");
	const end = raw.startsWith("---\n") ? raw.indexOf("\n---\n", 4) : -1;
	const fields = new Map<string, string>();
	if (end === -1) return { closed: false, fields, body: "" };
	for (const line of raw.slice(4, end).split("\n")) {
		if (/^\s/.test(line)) continue;
		const colon = line.indexOf(":");
		if (colon !== -1) fields.set(line.slice(0, colon).trim(), line.slice(colon + 1).trim());
	}
	return { closed: true, fields, body: raw.slice(end + 5).trim() };
}

function unsafeForYaml(value: string): boolean {
	const quoted = /^".*"$/.test(value) || /^'.*'$/.test(value);
	return !quoted && (COLON.test(value) || INDICATOR.test(value));
}

const dirs = readdirSync(SKILLS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const skills = dirs.map((name) => {
	const file = join(SKILLS, name, "SKILL.md");
	return { name, ...parse(existsSync(file) ? readFileSync(file, "utf8") : "") };
});

// Un dossier sans SKILL.md n'est pas une skill : il est ignore a l'installation,
// donc absent chez l'utilisateur sans le moindre message.
test("skills : chaque dossier porte son SKILL.md, ferme par ---", () => {
	assert.ok(skills.length > 0, `aucune skill trouvee dans ${SKILLS}`);
	assert.deepEqual(skills.filter((s) => !s.closed).map((s) => s.name), [], "SKILL.md absent, ou frontmatter non ferme");
});

test("skills : name present, au format, et egal a son dossier", () => {
	const wrong = skills.filter((s) => s.fields.get("name") !== s.name || !NAME_FORMAT.test(s.name));
	assert.deepEqual(wrong.map((s) => `${s.name} (name: ${s.fields.get("name")})`), [], "name doit valoir le nom du dossier, en minuscules et tirets");
});

// La description est ce qui declenche l'invocation : sans elle, la skill existe
// mais l'agent ne sait pas quand s'en servir.
test("skills : description presente, sous 1024 caracteres, avec son declencheur", () => {
	const problems = skills.flatMap((s) => {
		const d = s.fields.get("description") ?? "";
		if (d === "") return [`${s.name} : description absente ou vide`];
		if (d.length > 1024) return [`${s.name} : ${d.length} caracteres (max 1024)`];
		if (!/[AÀ] utiliser (quand|si)\b/.test(d)) return [`${s.name} : pas de « A utiliser quand… »`];
		return [];
	});
	assert.deepEqual(problems, []);
});

test("skills : frontmatter lisible par un parseur YAML strict", () => {
	const broken = skills.flatMap((s) =>
		[...s.fields].filter(([, value]) => unsafeForYaml(value)).map(([key]) => `${s.name} : « ${key} » contient « : » ou commence par un indicateur YAML (quoter la valeur, ou la reformuler)`),
	);
	assert.deepEqual(broken, []);
});

test("skills : corps non vide apres le frontmatter", () => {
	assert.deepEqual(skills.filter((s) => s.body === "").map((s) => s.name), [], "une skill sans instructions n'apprend rien a l'agent");
});

// Le plugin Claude Code expose le dossier entier, pas une liste : il n'y a donc
// aucune liste a maintenir en double. Reste a garantir que le chemin existe,
// sinon le plugin s'installe vide, sans erreur.
test("skills : marketplace.json pointe sur un dossier de skills reel", () => {
	const file = fileURLToPath(root(".claude-plugin/marketplace.json"));
	const marketplace = JSON.parse(readFileSync(file, "utf8")) as { plugins: { name: string; skills: string[] }[] };
	const missing = marketplace.plugins.flatMap((p) => p.skills.filter((s) => !existsSync(fileURLToPath(root(s)))).map((s) => `${p.name} : ${s}`));
	assert.deepEqual(missing, []);
});
