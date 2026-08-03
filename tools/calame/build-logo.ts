/**
 * Genere le logotype Calame : le mark suivi du wordmark "calame".
 *
 * Deux techniques en un fichier : le mot est compose depuis les glyphes de Sora
 * 700, le mark est la geometrie de build-favicon.ts, mise a l'echelle de la
 * hauteur du mot et posee a sa gauche.
 * Sortie : out/calame/brand/logo/, a promouvoir vers
 * brands/calame/logo/ apres revue.
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadInstanced, renderSvg } from "brand-artisan/brandkit";
import { root } from "brand-artisan";

const OUT = fileURLToPath(root("out/calame/brand/logo/"));
const FONT = fileURLToPath(root("fonts/Sora-700.ttf"));
mkdirSync(OUT, { recursive: true });

const INK = "#1c1917";
const ACCENT = "#c2410c"; // fond clair
const LIGHT = "#fafaf9";
const LIGHT_ACCENT = "#fb923c"; // fond sombre (Tailwind stone-50 / orange-400)
const PAPER = "#fafaf9";
const WHITE = "#ffffff";
const BASE = 1000.0; // repere de baseline pour le flip Y (annule par le viewBox)
const PAD = 60; // marge autour de l'encre, en unites police
const GAP = 0.34; // ecart mark <-> mot, en fraction de la hauteur du mot

// --- Le mot, compose depuis les glyphes ------------------------------------
const glyph = loadInstanced(FONT, { wght: 700 });

const items: { d: string; x: number }[] = [];
let pen = 0;
let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
for (const ch of "calame") {
	const { d, advance, bbox } = glyph(ch);
	if (d.trim() && bbox.maxX > bbox.minX) {
		items.push({ d, x: pen });
		minx = Math.min(minx, pen + bbox.minX);
		maxx = Math.max(maxx, pen + bbox.maxX);
		miny = Math.min(miny, BASE - bbox.maxY);
		maxy = Math.max(maxy, BASE - bbox.minY);
	}
	pen += advance;
}

// --- Le mark, cale sur la hauteur du mot ------------------------------------
// Le trait occupe 20..80 dans son carre de 100 : 60 unites, aussi large que haut.
const NIB = { d: "M20 80 H48 L80 22 L76 20 Z", from: 20, span: 60 };
const H = maxy - miny;
const k = H / NIB.span;
const markX = minx - H * GAP - H; // bord gauche du mark
const markShift = `translate(${(markX - NIB.from * k).toFixed(2)},${(miny - NIB.from * k).toFixed(2)}) scale(${k.toFixed(5)})`;

const VBX = markX - PAD, VBY = miny - PAD;
const VBW = maxx - markX + 2 * PAD, VBH = H + 2 * PAD;

const build = (word: string, mark: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VBX.toFixed(2)} ${VBY.toFixed(2)} ${VBW.toFixed(2)} ${VBH.toFixed(2)}" ` +
	`width="${VBW.toFixed(0)}" height="${VBH.toFixed(0)}" role="img" aria-label="calame">` +
	`<g fill="${mark}" transform="${markShift}"><path d="${NIB.d}"/></g>` +
	items
		.map(({ d, x }) => `<g fill="${word}" transform="translate(${x.toFixed(2)},${BASE}) scale(1,-1)"><path d="${d}"/></g>`)
		.join("") +
	"</svg>";

const variants: Record<string, string> = {
	"logo.svg": build(INK, ACCENT),
	"logo-dark.svg": build(LIGHT, LIGHT_ACCENT),
	"logo-mono.svg": build("currentColor", "currentColor"),
	"logo-mono-white.svg": build(WHITE, WHITE),
	"logo-mono-dark.svg": build(INK, INK),
};
for (const [name, svg] of Object.entries(variants)) writeFileSync(`${OUT}${name}`, svg, "utf8");

const raster = (svgName: string, out: string, { paper = false, height = 240 } = {}) =>
	writeFileSync(`${OUT}${out}`, renderSvg(variants[svgName], { height }, paper ? PAPER : undefined));

raster("logo.svg", "logo.png");
raster("logo.svg", "logo-white.png", { paper: true });
raster("logo-dark.svg", "logo-dark.png"); // transparent, couleurs claires (fond sombre)

console.log(`viewBox ${VBW.toFixed(0)}x${VBH.toFixed(0)}  aspect ${(VBW / VBH).toFixed(2)}`);
console.log(`mark: ${H.toFixed(0)} units tall, gap ${(H * GAP).toFixed(0)}`);
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
