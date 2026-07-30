import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { toPng } from "../src/render";

// Le plus petit visuel valide, et sans texte, donc independant des polices.
const square = () => createElement("div", { style: { width: "100%", height: "100%", backgroundColor: "#2563eb" } });

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Dimensions reelles du PNG, lues dans le chunk IHDR (octets 16 a 23, big endian).
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

test("toPng : la chaine JSX -> satori -> resvg produit un PNG a la taille exacte", async () => {
	const png = await toPng(square(), { width: 200, height: 100 });
	assert.ok(png.subarray(0, 8).equals(PNG_MAGIC), "l'en-tete PNG est attendu");
	assert.deepEqual(pngSize(png), { width: 200, height: 100 });
});

test("toPng : scale double la resolution de sortie sans changer le cadrage", async () => {
	const png = await toPng(square(), { width: 200, height: 100, scale: 2 });
	assert.deepEqual(pngSize(png), { width: 400, height: 200 });
});

// Les familles sont derivees du nom des fichiers de fonts/. Si la derivation
// cassait, Satori retomberait sur la meme police de secours pour les deux, et
// les deux rendus seraient identiques.
test("les familles de polices sont bien resolues depuis fonts/", async () => {
	const label = (fontFamily: string) =>
		createElement("div", { style: { width: "100%", height: "100%", fontSize: 40, fontFamily } }, "Aa Bb 123");
	const [mono, sora] = await Promise.all([
		toPng(label("Geist Mono"), { width: 400, height: 120 }),
		toPng(label("Sora"), { width: 400, height: 120 }),
	]);
	assert.ok(!mono.equals(sora), '"Geist Mono" et "Sora" doivent produire des rendus differents');
});
