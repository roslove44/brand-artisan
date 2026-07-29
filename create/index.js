#!/usr/bin/env node
/**
 * create-brand-artisan : pose un projet de visuels pret a rendre.
 *
 * Le squelette n'est pas vide : il embarque Calame, une marque de demonstration
 * complete (charte, assets, toolchain, un visuel). Un `npm run build` juste
 * apres la creation produit donc une image, ce qui vaut mieux qu'un depot qui
 * ne montre rien. Elle se remplace par `/new-project`.
 *
 * JavaScript pur et sans dependance : c'est un script qu'on lance une fois, il
 * n'a aucune raison d'exiger une chaine de build.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const TEMPLATE = join(HERE, "template");
const SKILLS_CMD = `npx skills add roslove44/brand-artisan -s "*"`;
const { version } = JSON.parse(readFileSync(join(HERE, "package.json"), "utf8"));

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
	console.log("Usage : npx create-brand-artisan [dossier] [--no-install]");
	process.exit(0);
}

const install = !args.includes("--no-install");
const target = resolve(args.find((a) => !a.startsWith("--")) ?? ".");

// Nom de paquet valide tire du dossier : minuscules, le reste en tirets.
const name = basename(target).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "visuels";

mkdirSync(target, { recursive: true });
const occupants = readdirSync(target).filter((f) => f !== ".git");
if (occupants.length > 0) {
	console.error(`"${target}" n'est pas vide (${occupants.length} entrees). Choisir un dossier neuf.`);
	process.exit(1);
}

cpSync(TEMPLATE, target, { recursive: true });
// Deux fichiers voyagent sous un nom neutre et le retrouvent ici :
//  - .gitignore, parce que npm renomme en .npmignore tout .gitignore publie ;
//  - tsconfig.json, pour qu'il ne devienne pas le tsconfig le plus proche des
//    fichiers du squelette dans le depot de BrandArtisan (l'editeur y verrait
//    des erreurs fantomes, faute de node_modules a cote).
renameSync(join(target, "gitignore"), join(target, ".gitignore"));
renameSync(join(target, "_tsconfig.json"), join(target, "tsconfig.json"));

const pkg = join(target, "package.json");
writeFileSync(pkg, readFileSync(pkg, "utf8").replace("__NAME__", name).replace("__SPEC__", `^${version}`));

console.log(`Projet "${name}" cree dans ${target}`);

/**
 * Les skills ne voyagent pas dans le moteur : chaque agent IA a ses propres
 * dossiers, et `npx skills` connait leur table mieux que nous. On propose donc
 * l'installation sans jamais la forcer.
 *
 * Question posee seulement si quelqu'un peut repondre : sous test:generator, en
 * CI ou sous un agent, stdin n'est pas un terminal et l'etape est sautee. Un
 * echec est sans consequence, les skills instruisent l'agent et le projet rend
 * sans elles.
 */
async function proposeSkills(cwd) {
	if (!process.stdin.isTTY) return;
	const { createInterface } = await import("node:readline/promises");
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	const answer = await rl.question("\nInstaller les skills dans votre agent IA ? [O/n] ");
	rl.close();
	if (/^n/i.test(answer.trim())) {
		console.log(`A relancer quand vous voulez : ${SKILLS_CMD}`);
		return;
	}
	try {
		execSync(SKILLS_CMD, { cwd, stdio: "inherit" });
	} catch {
		console.log(`Skills non installees. A relancer : ${SKILLS_CMD}`);
	}
}

if (install) {
	execSync("npm install", { cwd: target, stdio: "inherit" });
	await proposeSkills(target);
	console.log(`\nPret. Ensuite :\n  cd ${basename(target)}\n  npm run build     # rend l'exemple Calame dans out/\n  npm run dev       # serveur de rendu sur http://localhost:4000`);
} else {
	console.log(`\nEnsuite :\n  cd ${basename(target)}\n  npm install\n  ${SKILLS_CMD}\n  npm run build`);
}
