/**
 * Genere le logotype Rostand Migan : wordmark "rostand.dev" (variantes SVG + PNG).
 *
 * Le wordmark est compose en Geist 700, decoupe en deux registres de couleur :
 * "rostand" en encre, ".dev" en accent bleu (la TLD mise en avant).
 * Sortie : out/rostand-migan/brand/logo/, a promouvoir vers
 * brands/rostand-migan/logo/ apres revue.
 * Lancer : npx tsx tools/rostand-migan/build-logo.ts
 */
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadInstanced, renderSvg } from "brand-artisan/brandkit";
import { root } from "brand-artisan";

const OUT = fileURLToPath(root("out/rostand-migan/brand/logo/"));
const FONT = fileURLToPath(root("tools/rostand-migan/_geist.ttf"));
mkdirSync(OUT, { recursive: true });

const INK = "#111827";
const BLUE = "#2563eb"; // fond clair
const LIGHT = "#f8fafc";
const LIGHT_BLUE = "#60a5fa"; // fond sombre (Tailwind slate-50 / blue-400)
const WHITE = "#ffffff";
const LS = 0.0; // tracking (unites police) ; Geist est deja bien cale
const BASE = 1000.0; // repere de baseline pour le flip Y (annule par le viewBox)
const PAD = 60; // marge autour de l'encre, en unites police

const glyph = loadInstanced(FONT, { wght: 700 });

let minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
const items: { d: string; x: number; role: "name" | "tld" }[] = [];
let pen = 0;

function place(s: string, role: "name" | "tld") {
	for (const ch of s) {
		const { d, advance, bbox } = glyph(ch);
		if (d.trim() && bbox.maxX > bbox.minX) {
			items.push({ d, x: pen, role });
			minx = Math.min(minx, pen + bbox.minX);
			maxx = Math.max(maxx, pen + bbox.maxX);
			miny = Math.min(miny, BASE - bbox.maxY);
			maxy = Math.max(maxy, BASE - bbox.minY);
		}
		pen += advance + LS;
	}
}

place("rostand", "name"); // encre
place(".dev", "tld"); // accent bleu (le point compris)

const VBX = minx - PAD, VBY = miny - PAD;
const VBW = maxx - minx + 2 * PAD, VBH = maxy - miny + 2 * PAD;

const build = (nameC: string, tldC: string) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VBX.toFixed(2)} ${VBY.toFixed(2)} ${VBW.toFixed(2)} ${VBH.toFixed(2)}" ` +
	`width="${VBW.toFixed(0)}" height="${VBH.toFixed(0)}" role="img" aria-label="rostand.dev">` +
	items
		.map(({ d, x, role }) => `<g fill="${role === "name" ? nameC : tldC}" transform="translate(${x.toFixed(2)},${BASE}) scale(1,-1)"><path d="${d}"/></g>`)
		.join("") +
	"</svg>";

const variants: Record<string, string> = {
	"logo.svg": build(INK, BLUE),
	"logo-dark.svg": build(LIGHT, LIGHT_BLUE),
	"logo-mono.svg": build("currentColor", "currentColor"),
	"logo-mono-white.svg": build(WHITE, WHITE),
	"logo-mono-dark.svg": build(INK, INK),
};
for (const [name, svg] of Object.entries(variants)) writeFileSync(`${OUT}${name}`, svg, "utf8");

// resvg met le vecteur a l'echelle : rendu direct a la hauteur voulue, sans
// passer par la reduction d'un rendu plus grand.
const raster = (svgName: string, out: string, { white = false, height = 240 } = {}) =>
	writeFileSync(`${OUT}${out}`, renderSvg(variants[svgName], { height }, white ? "#ffffff" : undefined));

raster("logo.svg", "logo.png");
raster("logo.svg", "logo-white.png", { white: true });
raster("logo-dark.svg", "logo-dark.png"); // transparent, couleurs claires (fond sombre)

console.log(`viewBox ${VBW.toFixed(0)}x${VBH.toFixed(0)}  aspect ${(VBW / VBH).toFixed(2)}`);
console.log("out:", OUT);
console.log("files:", readdirSync(OUT).sort().join(", "));
