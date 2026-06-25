import { test } from "node:test";
import assert from "node:assert/strict";
import { esc, capitalize, clean, last, slug } from "../src/utils";

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
