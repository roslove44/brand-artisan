/**
 * Rend les icones ComptaOpen en PNG 120px pour les ecrans de consentement Google OAuth.
 *
 * Source : les icon*.svg produits par build-favicon.ts -> le lancer d'abord.
 * Sortie : out/comptaopen/brand/favicon/oauth/ (120x120, taille recommandee
 * par Google).
 * Lancer : npx tsx tools/comptaopen/build-oauth.ts
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderSvg } from "../../src/brandkit";
import { root } from "../../src/root";

const SRC = fileURLToPath(root("out/comptaopen/brand/favicon/"));
const OUT = `${SRC}oauth/`;

const SIZE = 120; // taille recommandee par Google pour le logo OAuth

const svgs = readdirSync(SRC)
	.filter((f) => f.startsWith("icon") && f.endsWith(".svg"))
	.sort();
if (svgs.length === 0) {
	console.error(`Aucun icon*.svg dans ${SRC} : lancer build-favicon.ts d'abord.`);
	process.exit(1);
}

mkdirSync(OUT, { recursive: true });
for (const svg of svgs) {
	const out = `${svg.slice(0, -4)}-${SIZE}.png`; // ex. icon-square.svg -> icon-square-120.png
	writeFileSync(`${OUT}${out}`, renderSvg(readFileSync(`${SRC}${svg}`, "utf8"), { width: SIZE }));
	console.log("->", out);
}
console.log("out:", OUT);
