/**
 * Preuve que le paquet est installable et utilisable : empaquette le depot,
 * l'installe dans un projet vierge, et y rend un visuel. C'est le seul controle
 * qui exerce le moteur depuis node_modules, la ou vivent les vraies erreurs de
 * packaging (chemins qui visent l'interieur du moteur, export manquant).
 *
 * Hors de `npm test` (fichier sans .test.ts) : il installe depuis le reseau et
 * dure une minute. Lancer : npm run test:consumer
 */
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { root } from "../src/root";

const REPO = fileURLToPath(root("."));
const WORK = mkdtempSync(join(tmpdir(), "brand-artisan-consumer-"));
const APP = join(WORK, "app");

const run = (cmd: string, cwd: string) => execSync(cmd, { cwd, stdio: "pipe", encoding: "utf8" });
const step = (msg: string) => console.log(`  ${msg}`);

// Le projet genere devra porter ces deux reglages : sans "react-jsx" le JSX
// retombe sur la transformation classique (React is not defined), sans
// skipLibCheck @types/node ne typecheck pas seul.
const TSCONFIG = {
	compilerOptions: {
		target: "ES2022",
		module: "ESNext",
		moduleResolution: "bundler",
		jsx: "react-jsx",
		strict: true,
		skipLibCheck: true,
		noEmit: true,
	},
	include: ["templates", "build.ts"],
};

const TEMPLATE = `import { brand, type Template } from "brand-artisan";

export const MARK = brand("demo/mark.svg");

export default {
	size: { width: 1200, height: 630 },
	title: "Projet consommateur",
	render: () => (
		<div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#111827", color: "#f8fafc", fontFamily: "Geist", fontSize: 64 }}>
			depuis node_modules
		</div>
	),
} satisfies Template;
`;

const BUILD = `import { renderToFile } from "brand-artisan";
import tpl, { MARK } from "./templates/demo/og";

console.log(await renderToFile(tpl.render(), { ...tpl.size, out: "demo/og" }));
console.log(MARK.href);
`;

try {
	step("empaquetage du depot");
	const tgz = run(`npm pack --pack-destination "${WORK}"`, REPO).trim().split(/\r?\n/).pop()!;

	step(`projet vierge + installation de ${tgz}`);
	mkdirSync(APP);
	run("npm init -y", APP);
	run("npm pkg set type=module", APP);
	run(`npm i "${join(WORK, tgz)}" react tsx --no-audit --no-fund`, APP);
	run("npm i -D @types/node @types/react --no-audit --no-fund", APP);

	step("contenu du projet : une police, un asset, un template, un build");
	mkdirSync(join(APP, "fonts"), { recursive: true });
	mkdirSync(join(APP, "brands", "demo"), { recursive: true });
	mkdirSync(join(APP, "templates", "demo"), { recursive: true });
	cpSync(join(REPO, "fonts", "Geist-700.ttf"), join(APP, "fonts", "Geist-700.ttf"));
	writeFileSync(join(APP, "brands", "demo", "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
	writeFileSync(join(APP, "templates", "demo", "og.tsx"), TEMPLATE);
	writeFileSync(join(APP, "build.ts"), BUILD);
	writeFileSync(join(APP, "tsconfig.json"), `${JSON.stringify(TSCONFIG, null, 2)}\n`);

	step("typecheck du projet consommateur");
	run("npx tsc --noEmit", APP);

	step("rendu");
	const [png, mark] = run("npx tsx build.ts", APP).trim().split(/\r?\n/);

	// Le PNG sort chez le consommateur, a la taille demandee.
	assert.equal(png, join(APP, "out", "demo", "og.png"), "le PNG doit sortir dans le out/ du projet");
	const bytes = readFileSync(png);
	assert.ok(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "en-tete PNG");
	assert.deepEqual({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }, { width: 1200, height: 630 });

	// brand() vise la marque du consommateur, jamais l'interieur du moteur.
	assert.ok(mark.startsWith(pathToFileURL(APP).href), `brand() doit viser le projet, obtenu : ${mark}`);
	assert.ok(!mark.includes("node_modules"), "brand() ne doit pas viser l'interieur du moteur");

	console.log(`\nOK : paquet installable, ${bytes.length} octets de PNG rendus depuis node_modules.`);
} finally {
	rmSync(WORK, { recursive: true, force: true });
}
