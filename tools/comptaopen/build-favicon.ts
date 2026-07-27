/**
 * Genere le favicon ComptaOpen (icones + apple-icon + favicon.ico).
 *
 * Aucune police ici : le mark est le bracket-O, deux arcs traces a la main.
 * Sortie : out/comptaopen/brand/favicon/, a promouvoir vers
 * brands/comptaopen/favicon/ apres revue.
 * Lancer : npx tsx tools/comptaopen/build-favicon.ts
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeIco, renderPixels, renderSvg } from "../../src/brandkit";
import { root } from "../../src/root";

const OUT = fileURLToPath(root("out/comptaopen/brand/favicon/"));
mkdirSync(OUT, { recursive: true });

// Les deux arcs du bracket-O, couleur parametrable (blanc sur tuile, bleu en mark).
const arcs = (c = "#fff") =>
	`<path d="M62.97 27.54 A25.93 25.93 0 0 1 62.97 72.46" fill="none" stroke="${c}" ` +
	'stroke-width="12.13" stroke-linecap="round"/>' +
	`<path d="M37.03 27.54 A25.93 25.93 0 0 0 37.03 72.46" fill="none" stroke="${c}" ` +
	'stroke-width="12.13" stroke-linecap="round"/>';

const SVG_OPEN =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="ComptaOpen">';

const svgs: Record<string, string> = {
	// Tuile bleue + bracket blanc (favicon principal).
	"icon.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="#1d4ed8"/>${arcs()}</svg>`,
	"icon-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="#1d4ed8"/>${arcs()}</svg>`,
	// Variantes sans tuile : bleu pour fonds clairs, blanc pour fonds sombres.
	"icon-mark.svg": `${SVG_OPEN}${arcs("#1d4ed8")}</svg>`,
	"icon-white-mark.svg": `${SVG_OPEN}${arcs("#ffffff")}</svg>`,
	// Blanc opaque (rounded / square) : bracket bleu.
	"icon-white.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="#ffffff"/>${arcs("#1d4ed8")}</svg>`,
	"icon-white-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="#ffffff"/>${arcs("#1d4ed8")}</svg>`,
};
for (const [name, svg] of Object.entries(svgs)) writeFileSync(`${OUT}${name}`, svg, "utf8");

// Vecteurs mis a l'echelle de la resolution cible -> net, centre, sans crop.
const render = (svgName: string, px: number, out: string) =>
	writeFileSync(`${OUT}${out}`, renderSvg(svgs[svgName], { width: px }));

for (const n of [16, 32, 48, 64, 180, 192, 512]) render("icon.svg", n, `icon-${n}.png`);
render("icon-square.svg", 180, "apple-icon.png");

writeFileSync(
	`${OUT}favicon.ico`,
	makeIco([16, 32, 48].map((size) => ({ size, data: renderSvg(svgs["icon.svg"], { width: size }) }))),
);

// Validation sur le favicon 32px.
const px = renderPixels(svgs["icon.svg"], { width: 32 });
console.log("corner(1,1)   :", px.at(1, 1), "(transparent)");
console.log("left arc(6,16):", px.at(6, 16), "(blanc)");
console.log("center(16,16) :", px.at(16, 16), "(bleu, gap)");
console.log("right arc(26,16):", px.at(26, 16), "(blanc)");
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
