/**
 * Genere le favicon Calame : la plume taillee (icones + apple-icon + .ico).
 *
 * Aucune police ici : le mark est une geometrie a la main, un trait qui s'affine
 * de la base vers la pointe et penche dans le sens de l'ecriture.
 * Sortie : out/calame/brand/favicon/, a promouvoir vers
 * brands/calame/favicon/ apres revue.
 * Lancer : npx tsx tools/calame/build-favicon.ts
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { makeIco, renderPixels, renderSvg } from "brand-artisan/brandkit";
import { root } from "brand-artisan";

const OUT = fileURLToPath(root("out/calame/brand/favicon/"));
mkdirSync(OUT, { recursive: true });

const ACCENT = "#c2410c";
const PAPER = "#fafaf9";

// Le trait du calame, dans un carre de 100 : base large coupee a l'horizontale
// (28 unites), fuselage qui s'affine vers la pointe, biseau oblique de 4 unites
// au sommet. C'est le fuselage qui fait lire une plume plutot qu'un trait
// oblique quelconque. Centre sur (50,50).
const nib = (c: string) => `<path d="M20 80 H48 L80 22 L76 20 Z" fill="${c}"/>`;

const SVG_OPEN =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Calame">';

const svgs: Record<string, string> = {
	// Tuile accent + trait papier (favicon principal).
	"icon.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="${ACCENT}"/>${nib(PAPER)}</svg>`,
	"icon-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="${ACCENT}"/>${nib(PAPER)}</svg>`,
	// Variantes sans tuile : accent pour fonds clairs, papier pour fonds sombres.
	"icon-mark.svg": `${SVG_OPEN}${nib(ACCENT)}</svg>`,
	"icon-white-mark.svg": `${SVG_OPEN}${nib(PAPER)}</svg>`,
	// Papier opaque (rounded / square) : trait accent.
	"icon-white.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="${PAPER}"/>${nib(ACCENT)}</svg>`,
	"icon-white-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="${PAPER}"/>${nib(ACCENT)}</svg>`,
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

// Validation sur le favicon 32px : le trait traverse le centre, les coins hors
// trait restent sur la tuile accent.
const px = renderPixels(svgs["icon.svg"], { width: 32 });
console.log("coin(3,3)     :", px.at(3, 3), "(tuile accent)");
console.log("centre(16,16) :", px.at(16, 16), "(trait, papier attendu)");
console.log("bas droite(26,26):", px.at(26, 26), "(tuile accent, hors trait)");
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
