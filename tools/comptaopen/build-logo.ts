/**
 * Genere le logotype ComptaOpen (toutes variantes SVG + PNG).
 *
 * Particularite de cette marque : le "O" n'est pas un glyphe mais deux arcs
 * traces a la main (bracket), inseres entre "COMPTA" et "PEN".
 * Sortie : out/comptaopen/brand/logo/, a promouvoir vers
 * brands/comptaopen/logo/ apres revue.
 * Lancer : npx tsx tools/comptaopen/build-logo.ts
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadInstanced, renderSvg } from "brand-artisan/brandkit";
import { root } from "brand-artisan";

const OUT = fileURLToPath(root("out/comptaopen/brand/logo/"));
const FONT = fileURLToPath(root("tools/comptaopen/_sora.ttf"));
mkdirSync(OUT, { recursive: true });

const INK = "#0f172a";
const BLUE = "#1d4ed8";
const LIGHT = "#f8fafc";
const LIGHT_BLUE = "#60a5fa";
const WHITE = "#ffffff";
const CAP_TOP = 751.5, LS = -30, O_MARGIN = 20, O_BOX = 865, BASE = CAP_TOP, PAD = 48;

const bracket = (c: string) =>
	`<path d="M257.25 82 A350.5 350.5 0 0 0 257.25 689" fill="none" stroke="${c}" ` +
	'stroke-width="164" stroke-linecap="round"/>' +
	`<path d="M607.75 82 A350.5 350.5 0 0 1 607.75 689" fill="none" stroke="${c}" ` +
	'stroke-width="164" stroke-linecap="round"/>';

const glyph = loadInstanced(FONT, { wght: 700 });

let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
const addInk = (x0: number, x1: number, y0: number, y1: number) => {
	minx = Math.min(minx, x0);
	maxx = Math.max(maxx, x1);
	miny = Math.min(miny, y0);
	maxy = Math.max(maxy, y1);
};

const items: { d: string; x: number; role: "compta" | "open" }[] = [];
let pen = 0;

function place(s: string, role: "compta" | "open") {
	for (const ch of s) {
		const { d, advance, bbox } = glyph(ch);
		if (d.trim()) {
			items.push({ d, x: pen, role });
			addInk(pen + bbox.minX, pen + bbox.maxX, BASE - bbox.maxY, BASE - bbox.minY);
		}
		pen += advance + LS;
	}
}

place("COMPTA", "compta");
pen += O_MARGIN;
const bracketX = pen;
addInk(bracketX, bracketX + O_BOX, 0, 771);
pen += O_BOX + O_MARGIN + LS;
place("PEN", "open");

const VBX = minx - PAD, VBY = miny - PAD;
const VBW = maxx - minx + 2 * PAD, VBH = maxy - miny + 2 * PAD;

const build = (comptaC: string, openC: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VBX.toFixed(2)} ${VBY.toFixed(2)} ${VBW.toFixed(2)} ${VBH.toFixed(2)}" ` +
	`width="${VBW.toFixed(0)}" height="${VBH.toFixed(0)}" role="img" aria-label="ComptaOpen">` +
	items
		.map(({ d, x, role }) => `<g fill="${role === "compta" ? comptaC : openC}" transform="translate(${x.toFixed(2)},${BASE}) scale(1,-1)"><path d="${d}"/></g>`)
		.join("") +
	`<g transform="translate(${bracketX.toFixed(2)},0)">${bracket(openC)}</g>` +
	"</svg>";

const variants: Record<string, string> = {
	"logo.svg": build(INK, BLUE),
	"logo-dark.svg": build(LIGHT, LIGHT_BLUE),
	"logo-mono.svg": build("currentColor", "currentColor"),
	"logo-mono-white.svg": build(WHITE, WHITE),
	"logo-mono-dark.svg": build(INK, INK),
};
for (const [name, svg] of Object.entries(variants)) writeFileSync(`${OUT}${name}`, svg, "utf8");

const raster = (svgName: string, out: string, { white = false, height = 360 } = {}) =>
	writeFileSync(`${OUT}${out}`, renderSvg(variants[svgName], { height }, white ? "#ffffff" : undefined));

raster("logo.svg", "logo.png");
raster("logo.svg", "logo-white.png", { white: true });
raster("logo-dark.svg", "logo-dark.png"); // transparent, couleurs claires (fond sombre)

console.log(`viewBox ${VBW.toFixed(0)}x${VBH.toFixed(0)}  aspect ${(VBW / VBH).toFixed(2)}`);
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
