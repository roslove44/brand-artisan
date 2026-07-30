/**
 * brandkit : socle partage de la toolchain de marque. La geometrie et les
 * couleurs propres a une marque vivent dans ses scripts (tools/<projet>/).
 */
import { openSync, type BBOX, type Font } from "fontkit";
import { Resvg } from "@resvg/resvg-js";

export type Ink = { d: string; advance: number; bbox: BBOX };

/**
 * Charge une police instanciee a `axes` (ex. { wght: 700 }) et renvoie un
 * accesseur de glyphe par caractere. Une police statique est prise telle quelle,
 * `axes` etant alors sans objet.
 *
 * `path.bbox` et non `glyph.bbox` : le premier calcule les bornes reelles du
 * trace, le second celles declarees dans la table glyf, arrondies a l'entier.
 * Sur Sora, le "C" fait 751.5 de haut, declare 752. La chasse, elle, est bien
 * entiere : instancier une variable produit une statique, dont la table hmtx ne
 * stocke que des entiers.
 */
export function loadInstanced(fontPath: string, axes: Record<string, number>): (ch: string) => Ink {
	const file = openSync(fontPath) as Font;
	const font = Object.keys(file.variationAxes ?? {}).length > 0 ? file.getVariation(axes) : file;
	return (ch) => {
		const g = font.glyphForCodePoint(ch.codePointAt(0)!);
		return { d: g.path.toSVG(), advance: Math.round(g.advanceWidth), bbox: g.path.bbox };
	};
}

type Fit = { width: number } | { height: number };

const options = (fit: Fit, background?: string) => ({
	fitTo: "width" in fit ? { mode: "width" as const, value: fit.width } : { mode: "height" as const, value: fit.height },
	...(background ? { background } : {}),
});

/** Rend un SVG a la taille voulue : resvg met le vecteur a l'echelle avant de rasteriser. */
export const renderSvg = (svg: string, fit: Fit, background?: string): Buffer =>
	new Resvg(svg, options(fit, background)).render().asPng();

/** Meme rendu, en pixels RGBA bruts. */
export function renderPixels(svg: string, fit: Fit): { data: Buffer; width: number; at: (x: number, y: number) => number[] } {
	const img = new Resvg(svg, options(fit)).render();
	const data = img.pixels;
	const width = img.width;
	return { data, width, at: (x, y) => [...data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)] };
}

/** Ecrit un .ico multi-resolution, dont les images sont des PNG. */
export function makeIco(images: { size: number; data: Buffer }[]): Buffer {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(1, 2); // type 1 = icone
	header.writeUInt16LE(images.length, 4);

	const dir: Buffer[] = [];
	let offset = 6 + 16 * images.length;
	for (const { size, data } of images) {
		const e = Buffer.alloc(16);
		e.writeUInt8(size >= 256 ? 0 : size, 0); // largeur, 0 signifie 256
		e.writeUInt8(size >= 256 ? 0 : size, 1); // hauteur
		e.writeUInt16LE(1, 4); // plans de couleur
		e.writeUInt16LE(32, 6); // bits par pixel
		e.writeUInt32LE(data.length, 8);
		e.writeUInt32LE(offset, 12);
		dir.push(e);
		offset += data.length;
	}
	return Buffer.concat([header, ...dir, ...images.map((i) => i.data)]);
}
