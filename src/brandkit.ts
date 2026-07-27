/**
 * brandkit : socle partage de la toolchain de marque, version TypeScript.
 *
 * Miroir de src/brandkit/ (Python), meme plomberie et memes noms :
 *   fontTools -> fontkit  (instanciation d'une variable, contours, chasse)
 *   skia      -> resvg    (rasterisation, deja utilise par le moteur de rendu)
 *   Pillow    -> makeIco  (ecriture du conteneur .ico, ci-dessous)
 *
 * La geometrie et les couleurs propres a une marque vivent dans ses scripts
 * (tools/<projet>/), pas ici.
 */
import { openSync, type BBOX, type Font } from "fontkit";
import { Resvg } from "@resvg/resvg-js";

// Un glyphe pret a composer : son trace SVG, sa chasse, son encombrement.
export type Ink = { d: string; advance: number; bbox: BBOX };

/**
 * Charge une police instanciee a `axes` (ex. { wght: 700 }) et renvoie un
 * accesseur de glyphe par caractere. Remplace a lui seul le triplet
 * (glyphset, cmap, hmtx) de la version Python.
 *
 * Une police **statique** est prise telle quelle, `axes` etant alors sans objet :
 * toutes les marques n'ont pas une variable sous la main.
 *
 * Deux details qui font la difference entre "a peu pres pareil" et "identique" :
 *  - `path.bbox` et non `glyph.bbox` : le premier calcule les bornes reelles du
 *    trace, le second renvoie celles declarees dans la table glyf, arrondies a
 *    l'entier. Sur Sora, le "C" fait 751.5 de haut, declare 752.
 *  - chasse arrondie : instancier une variable produit une police statique, dont
 *    la table hmtx ne stocke que des entiers.
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

/**
 * Rend un SVG a la taille voulue. resvg met le vecteur a l'echelle avant de
 * rasteriser : contrairement a la version Python, pas de rendu en taille native
 * suivi d'un downscale LANCZOS.
 */
export const renderSvg = (svg: string, fit: Fit, background?: string): Buffer =>
	new Resvg(svg, options(fit, background)).render().asPng();

/** Meme rendu, mais en pixels RGBA bruts : sert aux controles de couleur. */
export function renderPixels(svg: string, fit: Fit): { data: Buffer; width: number; at: (x: number, y: number) => number[] } {
	const img = new Resvg(svg, options(fit)).render();
	const data = img.pixels;
	const width = img.width;
	return { data, width, at: (x, y) => [...data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)] };
}

/**
 * Ecrit un .ico multi-resolution. Le format n'est qu'un en-tete de 6 octets, un
 * repertoire de 16 octets par image, puis les images collees bout a bout. On y
 * met des PNG, acceptes depuis Windows Vista et par tous les navigateurs.
 */
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
