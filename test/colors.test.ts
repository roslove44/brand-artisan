import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PNG } from "pngjs";
import { decode, palette } from "../src/colors";

const dir = mkdtempSync(join(tmpdir(), "brandartisan-"));

// Damier deterministe : 3/4 de rouge opaque, 1/4 de bleu a moitie transparent.
function fixture(): string {
	const png = new PNG({ width: 8, height: 8 });
	for (let i = 0; i < png.data.length; i += 4) {
		const bleu = (i / 4) % 8 < 2; // les deux premieres colonnes
		png.data.set(bleu ? [0, 0, 255, 128] : [255, 0, 0, 255], i);
	}
	const file = join(dir, "damier.png");
	writeFileSync(file, PNG.sync.write(png));
	return file;
}

test("decode : un PNG revient en pixels RGBA a ses dimensions", () => {
	const px = decode(fixture());
	assert.deepEqual({ width: px.width, height: px.height }, { width: 8, height: 8 });
	assert.equal(px.data.length, 8 * 8 * 4);
});

test("palette : effectifs exacts, tries par dominance, alpha note au besoin", () => {
	const { unique, total, colors } = palette(decode(fixture()));
	assert.equal(unique, 2);
	assert.equal(total, 64);
	assert.deepEqual(colors, [
		{ hex: "#ff0000", count: 48, share: 0.75 },
		{ hex: "#0000ff80", count: 16, share: 0.25 },
	]);
});

test("palette : top limite le nombre de blocs rendus, pas le comptage", () => {
	const { unique, colors } = palette(decode(fixture()), 1);
	assert.equal(unique, 2, "toutes les couleurs restent comptees");
	assert.equal(colors.length, 1, "une seule est rendue");
	assert.equal(colors[0].hex, "#ff0000", "la dominante");
});

test("decode : un SVG passe par resvg", () => {
	const file = join(dir, "carre.svg");
	writeFileSync(file, '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10"><rect width="20" height="10" fill="#1d4ed8"/></svg>');
	const { colors, unique } = palette(decode(file));
	assert.equal(unique, 1);
	assert.deepEqual(colors[0], { hex: "#1d4ed8", count: 200, share: 1 });
});

test("decode : format inconnu -> message explicite", () => {
	assert.throws(() => decode(join(dir, "photo.webp")), /Format non gere.*photo\.webp/s);
});
