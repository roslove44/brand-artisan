/**
 * Le seul controle qui exerce le moteur depuis node_modules, la ou vivent les
 * erreurs de packaging : chemins qui visent l'interieur du moteur, export ou
 * fichier manquant du tarball, bin qui ne demarre pas.
 *
 * Le projet d'essai n'installe que le paquet, react devant arriver seul par la
 * peer dependency. Hors de `npm test`, car il installe depuis le reseau.
 */
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { root } from "../src/root";

const REPO = fileURLToPath(root("."));
const WORK = mkdtempSync(join(tmpdir(), "brand-artisan-consumer-"));
const APP = join(WORK, "app");

const run = (cmd: string, cwd = APP) => execSync(cmd, { cwd, stdio: "pipe", encoding: "utf8" });
const step = (msg: string) => console.log(`  ${msg}`);

// Sans "react-jsx" le JSX retombe sur la transformation classique (React is not
// defined) ; sans skipLibCheck, @types/node ne typecheck pas seul.
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
	include: ["templates", "check.ts"],
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

try {
	step("empaquetage du depot");
	const tgz = run(`npm pack --pack-destination "${WORK}"`, REPO).trim().split(/\r?\n/).pop()!;

	step(`projet vierge + installation de ${tgz}, sans rien d'autre`);
	mkdirSync(APP);
	run("npm init -y");
	run("npm pkg set type=module");
	run(`npm i "${join(WORK, tgz)}" --no-audit --no-fund`);
	assert.ok(existsSync(join(APP, "node_modules", "react")), "react doit arriver par la peer dependency");
	assert.ok(existsSync(join(APP, "node_modules", "tsx")), "tsx doit arriver par les dependances du moteur");

	step("contenu du projet : une police, un asset, un template");
	mkdirSync(join(APP, "fonts"), { recursive: true });
	mkdirSync(join(APP, "brands", "demo"), { recursive: true });
	mkdirSync(join(APP, "templates", "demo"), { recursive: true });
	cpSync(join(REPO, "fonts", "Geist-700.ttf"), join(APP, "fonts", "Geist-700.ttf"));
	writeFileSync(join(APP, "brands", "demo", "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
	writeFileSync(join(APP, "templates", "demo", "og.tsx"), TEMPLATE);
	writeFileSync(join(APP, "check.ts"), 'import { MARK } from "./templates/demo/og";\nconsole.log(MARK.href);\n');
	writeFileSync(join(APP, "tsconfig.json"), `${JSON.stringify(TSCONFIG, null, 2)}\n`);

	// Le paquet livrant du .ts, tsc suit les sources du moteur : le consommateur a
	// donc besoin des types de nos dependances. C'est le prix du .ts livre.
	step("typecheck du projet consommateur");
	run("npm i -D typescript @types/node @types/react --no-audit --no-fund");
	run("npx tsc --noEmit");

	step("brand-artisan build");
	const lines = run("npx brand-artisan build").trim().split(/\r?\n/);
	assert.equal(lines.length, 1, `un seul visuel attendu, obtenu : ${lines.join(" | ")}`);
	const png = join(APP, ...lines[0].replace(/^\W+\s*/, "").split("/"));

	const bytes = readFileSync(png);
	assert.ok(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "en-tete PNG");
	assert.deepEqual({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }, { width: 1200, height: 630 });

	step("brand-artisan colors");
	const palette = run(`npx brand-artisan colors "${png}" 3`);
	assert.match(palette, /1200x630/);
	assert.match(palette, /#[0-9a-f]{6}/, "au moins une couleur relevee");

	// brand() vise la marque du consommateur, jamais l'interieur du moteur.
	step("resolution de brand()");
	const mark = run("npx tsx check.ts").trim();
	assert.ok(mark.startsWith(pathToFileURL(APP).href), `brand() doit viser le projet, obtenu : ${mark}`);
	assert.ok(!mark.includes("node_modules"), "brand() ne doit pas viser l'interieur du moteur");

	console.log(`\nOK : installe depuis le seul tarball, CLI fonctionnelle, ${bytes.length} octets de PNG rendus.`);
} finally {
	rmSync(WORK, { recursive: true, force: true });
}
