import { test } from "node:test";
import assert from "node:assert/strict";
import { esc, capitalize, clean, last, slug, ext, pixelSize } from "../src/utils";

test("slug : accents, casse et separateurs -> nom de fichier", () => {
	assert.equal(slug("Couverture sociale ComptaOpen"), "couverture-sociale-comptaopen");
	assert.equal(slug("  Été 2024 !! "), "ete-2024");
	assert.equal(slug("a/b_c"), "a-b-c");
});

test("esc : echappe les caracteres HTML sensibles", () => {
	assert.equal(esc(`<a href="x">&`), "&lt;a href=&quot;x&quot;&gt;&amp;");
});

test("capitalize : premiere lettre en majuscule", () => {
	assert.equal(capitalize("cover"), "Cover");
	assert.equal(capitalize(""), "");
});

test("clean : retire les slashes de bord, garde l'interne", () => {
	assert.equal(clean("/comptaopen/cover/"), "comptaopen/cover");
	assert.equal(clean("//a//"), "a");
});

test("last : dernier segment du chemin", () => {
	assert.equal(last("comptaopen/cover"), "cover");
	assert.equal(last(""), "");
});

test("ext : extension en minuscules, sans le point", () => {
	assert.equal(ext("logo.SVG"), "svg");
	assert.equal(ext("favicon.ico"), "ico");
	assert.equal(ext("icon-16.png"), "png");
});

test("pixelSize : dimensions lues dans l'en-tete du fichier", () => {
	// PNG : largeur et hauteur en big endian dans le chunk IHDR (octets 16 a 23).
	const png = Buffer.alloc(24);
	png.writeUInt32BE(512, 16);
	png.writeUInt32BE(256, 20);
	assert.deepEqual(pixelSize(png, "png"), { width: 512, height: 256 });

	// ICO : octets 6 et 7, ou 0 signifie 256.
	const ico = Buffer.alloc(8);
	ico[6] = 48;
	ico[7] = 0;
	assert.deepEqual(pixelSize(ico, "ico"), { width: 48, height: 256 });

	// SVG : viewBox en priorite, width/height a defaut.
	const box = Buffer.from(`<svg xmlns="..." viewBox="0 0 7446 867">`);
	assert.deepEqual(pixelSize(box, "svg"), { width: 7446, height: 867 });
	const attrs = Buffer.from(`<svg width="120" height="40">`);
	assert.deepEqual(pixelSize(attrs, "svg"), { width: 120, height: 40 });

	// Format inconnu ou en-tete trop court : 0x0, l'appelant se rabat sur le cadre.
	assert.deepEqual(pixelSize(Buffer.alloc(4), "png"), { width: 0, height: 0 });
	assert.deepEqual(pixelSize(Buffer.from("x"), "webp"), { width: 0, height: 0 });
});
