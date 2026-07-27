/**
 * Deroule le parcours reel d'un utilisateur : empaqueter les deux paquets,
 * generer un projet avec create-brand-artisan, y installer le moteur, poser les
 * skills, et rendre. Ce que ce controle attrape et qu'aucun autre ne voit : un
 * fichier oublie dans le `files` du generateur, un placeholder non substitue, un
 * .gitignore reste sans son point, une skill absente du paquet.
 *
 * Le generateur est lance depuis le **tarball**, pas depuis create/ : c'est le
 * contenu publie qui est teste, pas celui du depot.
 *
 * Hors de `npm test` : installe depuis le reseau et dure une minute.
 * Lancer : npm run test:generator
 */
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { root } from "../src/root";

const REPO = fileURLToPath(root("."));
const WORK = mkdtempSync(join(tmpdir(), "brand-artisan-generator-"));
const LAUNCHER = join(WORK, "launcher");
const APP = join(WORK, "mes-visuels");

const run = (cmd: string, cwd: string) => execSync(cmd, { cwd, stdio: "pipe", encoding: "utf8" });
const step = (msg: string) => console.log(`  ${msg}`);
const pack = (dir: string) => join(WORK, run(`npm pack --pack-destination "${WORK}"`, dir).trim().split(/\r?\n/).pop()!);

try {
	step("empaquetage du moteur et du generateur");
	const engine = pack(REPO);
	const generator = pack(join(REPO, "create"));

	step("installation du generateur, tel qu'il sera publie");
	mkdirSync(LAUNCHER);
	run("npm init -y", LAUNCHER);
	run(`npm i "${generator}" --no-audit --no-fund`, LAUNCHER);

	step("generation du projet");
	run(`node "${join(LAUNCHER, "node_modules", "create-brand-artisan", "index.js")}" "${APP}" --no-install`, WORK);

	// Le squelette est complet et ses placeholders sont substitues.
	const pkg = JSON.parse(readFileSync(join(APP, "package.json"), "utf8"));
	assert.equal(pkg.name, "mes-visuels", "le nom du projet vient du dossier");
	assert.match(pkg.dependencies["brand-artisan"], /^\^\d+\.\d+\.\d+$/, "la version du moteur doit etre substituee");
	assert.ok(existsSync(join(APP, ".gitignore")), "gitignore doit retrouver son point");
	assert.ok(existsSync(join(APP, "tsconfig.json")), "_tsconfig.json doit retrouver son nom");
	assert.ok(!existsSync(join(APP, "_tsconfig.json")), "le nom de voyage ne doit pas rester");
	for (const f of ["brands/calame/brand.md", "brands/calame/project.md", "templates/calame/og.tsx", "tools/calame/build-logo.ts", "fonts/Sora-700.ttf", "fonts/NOTICE.md"]) {
		assert.ok(existsSync(join(APP, ...f.split("/"))), `${f} doit etre livre`);
	}

	step("installation du moteur, puis des outils de dev");
	run(`npm i "${engine}" --no-audit --no-fund`, APP);
	run("npm i --no-audit --no-fund", APP);

	step("brand-artisan skills sync");
	const synced = run("npx brand-artisan skills sync", APP);
	const skills = readdirSync(join(APP, ".claude", "skills"));
	assert.ok(skills.length >= 15, `au moins 15 skills attendues, ${skills.length} posees : ${synced.trim()}`);
	assert.ok(skills.includes("new-project") && skills.includes("og-image"), "les skills cles doivent etre la");

	step("npm run typecheck");
	run("npm run typecheck", APP);

	step("npm run build");
	const lines = run("npm run build", APP).trim().split(/\r?\n/).filter((l) => l.includes("out/"));
	assert.equal(lines.length, 1, `un seul visuel attendu, obtenu : ${lines.join(" | ")}`);
	const png = join(APP, ...lines[0].replace(/^\W+\s*/, "").split("/"));

	const bytes = readFileSync(png);
	assert.deepEqual({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }, { width: 1200, height: 630 });
	assert.ok(bytes.length < 300_000, `un OG doit rester sous 300 Ko, obtenu ${Math.round(bytes.length / 1024)} Ko`);

	// La toolchain de marque tourne aussi chez l'utilisateur.
	step("npx tsx tools/calame/build-favicon.ts");
	run("npx tsx tools/calame/build-favicon.ts", APP);
	assert.ok(existsSync(join(APP, "out", "calame", "brand", "favicon", "favicon.ico")), "la toolchain doit produire le .ico");

	console.log(`\nOK : projet genere, ${skills.length} skills posees, ${Math.round(bytes.length / 1024)} Ko de visuel rendus.`);
} finally {
	rmSync(WORK, { recursive: true, force: true });
}
