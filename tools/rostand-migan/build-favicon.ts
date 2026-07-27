/**
 * Genere le favicon Rostand Migan : monogramme RM (icones + apple-icon + .ico).
 *
 * Le mark est le monogramme RM en Geist 700, centre sur une tuile.
 * Sortie : out/rostand-migan/brand/favicon/, a promouvoir vers
 * brands/rostand-migan/favicon/ apres revue.
 * Lancer : npx tsx tools/rostand-migan/build-favicon.ts
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadInstanced, makeIco, renderPixels, renderSvg } from "brand-artisan/brandkit";
import { root } from "brand-artisan";

const OUT = fileURLToPath(root("out/rostand-migan/brand/favicon/"));
const FONT = fileURLToPath(root("tools/rostand-migan/_geist.ttf"));
mkdirSync(OUT, { recursive: true });

const BLUE = "#2563eb";
const WHITE = "#ffffff";
const LS = 0.0; // tracking entre R et M (unites police)
const BOX = 62.0; // cote de la zone occupee par le monogramme dans la tuile 100x100

// --- Compose le monogramme RM en chemins Geist 700, coordonnees police (Y up) ---
const glyph = loadInstanced(FONT, { wght: 700 });

const glyphs: { d: string; x: number }[] = [];
let pen = 0;
let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
for (const ch of "RM") {
	const { d, advance, bbox } = glyph(ch);
	glyphs.push({ d, x: pen });
	minx = Math.min(minx, pen + bbox.minX);
	maxx = Math.max(maxx, pen + bbox.maxX);
	miny = Math.min(miny, bbox.minY);
	maxy = Math.max(maxy, bbox.maxY);
	pen += advance + LS;
}

const W = maxx - minx, H = maxy - miny;
const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2;
const k = BOX / Math.max(W, H); // echelle uniforme pour tenir dans BOX, centre en (50,50)

const INNER = glyphs.map(({ d, x }) => `<g transform="translate(${x.toFixed(2)},0)"><path d="${d}"/></g>`).join("");

// translate(50,50) place le centre du mark au centre de la tuile ; scale(k,-k)
// met a l'echelle et inverse l'axe Y (police Y-up -> SVG Y-down).
const mono = (c: string) =>
	`<g fill="${c}" transform="translate(50,50) scale(${k.toFixed(5)},${(-k).toFixed(5)}) ` +
	`translate(${(-cx).toFixed(3)},${(-cy).toFixed(3)})">${INNER}</g>`;

const SVG_OPEN =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Rostand Migan">';

const svgs: Record<string, string> = {
	// Tuile bleue + RM blanc (favicon principal).
	"icon.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="${BLUE}"/>${mono(WHITE)}</svg>`,
	"icon-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="${BLUE}"/>${mono(WHITE)}</svg>`,
	// Variantes sans tuile : bleu pour fonds clairs, blanc pour fonds sombres.
	"icon-mark.svg": `${SVG_OPEN}${mono(BLUE)}</svg>`,
	"icon-white-mark.svg": `${SVG_OPEN}${mono(WHITE)}</svg>`,
	// Blanc opaque (rounded / square) : RM bleu.
	"icon-white.svg": `${SVG_OPEN}<rect width="100" height="100" rx="22" fill="${WHITE}"/>${mono(BLUE)}</svg>`,
	"icon-white-square.svg": `${SVG_OPEN}<rect width="100" height="100" fill="${WHITE}"/>${mono(BLUE)}</svg>`,
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

// Validation sur le favicon 32px : coin = tuile bleue, centre = trait blanc.
const px = renderPixels(svgs["icon.svg"], { width: 32 });
console.log(`monogram scale k: ${k.toFixed(4)} | W/H police: ${Math.round(W)} ${Math.round(H)}`);
console.log("corner(2,2)   :", px.at(2, 2), "(tuile bleue)");
console.log("center(16,16) :", px.at(16, 16), "(trait du M, blanc attendu)");
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
