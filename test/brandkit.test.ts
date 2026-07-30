import { test } from "node:test";
import assert from "node:assert/strict";
import { loadInstanced, makeIco, renderPixels, renderSvg } from "../src/brandkit";
import { root } from "../src/root";
import { fileURLToPath } from "node:url";

// Carre rouge centre, dans un viewBox de 100x100 unites utilisateur.
const SQUARE =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" fill="#ff0000"/></svg>';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

// La boite englobante porte la mise a l'echelle : un pixel central garde sa
// couleur quel que soit le facteur, ses bords non.
function inkBox({ data, width }: { data: Buffer; width: number }) {
	let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
	for (let i = 0; i < data.length; i += 4) {
		if (data[i + 3] === 0) continue;
		const x = (i / 4) % width;
		const y = Math.floor(i / 4 / width);
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	}
	return { minX, minY, maxX, maxY };
}

const near = (got: number, want: number, label: string) =>
	assert.ok(Math.abs(got - want) <= 1, `${label} : ${got}, attendu ~${want}`);

test("renderSvg : rend un PNG a la largeur demandee", () => {
	const png = renderSvg(SQUARE, { width: 64 });
	assert.ok(png.subarray(0, 8).equals(PNG_MAGIC), "l'en-tete PNG est attendu");
	assert.deepEqual(pngSize(png), { width: 64, height: 64 });
});

test("renderSvg : la hauteur demandee fixe l'echelle, le ratio est conserve", () => {
	assert.deepEqual(pngSize(renderSvg(SQUARE, { height: 40 })), { width: 40, height: 40 });
});

test("renderSvg : le vecteur est mis a l'echelle, pas rogne", () => {
	// Le rect va de 20 a 80 unites : 12,8 a 51,2 px une fois ramene a 64.
	const box = inkBox(renderPixels(SQUARE, { width: 64 }));
	near(box.minX, 13, "bord gauche");
	near(box.minY, 13, "bord haut");
	near(box.maxX, 51, "bord droit");
	near(box.maxY, 51, "bord bas");
});

test("renderSvg : fond optionnel, sinon transparent", () => {
	const transparent = renderPixels(SQUARE, { width: 64 });
	assert.equal(transparent.at(2, 2)[3], 0, "sans fond, le coin est transparent");
	// Le fond passe a resvg n'apparait pas dans les pixels bruts : on le verifie
	// sur le poids du PNG, qui chute quand tout est opaque et uni.
	const withBg = renderSvg(SQUARE, { width: 64 }, "#ffffff");
	assert.ok(withBg.subarray(0, 8).equals(PNG_MAGIC));
	assert.notEqual(withBg.length, renderSvg(SQUARE, { width: 64 }).length);
});

test("makeIco : en-tete, repertoire et decalages coherents", () => {
	const images = [16, 32, 48].map((size) => ({ size, data: renderSvg(SQUARE, { width: size }) }));
	const ico = makeIco(images);

	assert.equal(ico.readUInt16LE(0), 0, "octets reserves");
	assert.equal(ico.readUInt16LE(2), 1, "type 1 = icone");
	assert.equal(ico.readUInt16LE(4), 3, "trois images");

	let expected = 6 + 16 * 3;
	for (const [i, { size, data }] of images.entries()) {
		const e = 6 + 16 * i;
		assert.equal(ico.readUInt8(e), size, `largeur de l'entree ${i}`);
		assert.equal(ico.readUInt8(e + 1), size, `hauteur de l'entree ${i}`);
		assert.equal(ico.readUInt16LE(e + 6), 32, "32 bits par pixel");
		assert.equal(ico.readUInt32LE(e + 8), data.length, `poids de l'image ${i}`);
		assert.equal(ico.readUInt32LE(e + 12), expected, `decalage de l'image ${i}`);
		assert.ok(ico.subarray(expected, expected + 8).equals(PNG_MAGIC));
		expected += data.length;
	}
	assert.equal(ico.length, expected, "aucun octet en trop");
});

test("makeIco : 256 px se code par un zero, comme l'exige le format", () => {
	const ico = makeIco([{ size: 256, data: renderSvg(SQUARE, { width: 256 }) }]);
	assert.equal(ico.readUInt8(6), 0);
	assert.equal(ico.readUInt8(7), 0);
});

test("loadInstanced : contours, chasse entiere et glyphe vide", () => {
	const glyph = loadInstanced(fileURLToPath(root("fonts/Geist-700.ttf")), { wght: 700 });

	const a = glyph("A");
	assert.ok(a.d.startsWith("M"), a.d.slice(0, 20));
	assert.ok(a.bbox.maxX > a.bbox.minX && a.bbox.maxY > a.bbox.minY, "le A a une surface");
	assert.equal(a.advance, Math.round(a.advance), "la chasse d'une statique est entiere");

	// L'espace n'a pas de trace mais avance quand meme.
	const space = glyph(" ");
	assert.equal(space.d, "");
	assert.ok(space.advance > 0);
});
