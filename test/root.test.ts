import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, parse } from "node:path";
import { findRoot } from "../src/root";

// realpath : sur macOS, mkdtemp renvoie /var/... la ou findRoot remonte
// /private/var/..., et la comparaison de chemins echouerait sans rapport.
const BASE = realpathSync(mkdtempSync(join(tmpdir(), "brand-artisan-root-")));
after(() => rmSync(BASE, { recursive: true, force: true }));

// Cree <BASE>/<nom>/<sous-chemin> et pose un package.json dans chaque dossier cite.
function tree(name: string, deep: string, ...withPackage: string[]): string {
	const dir = join(BASE, name);
	mkdirSync(join(dir, deep), { recursive: true });
	for (const p of withPackage) writeFileSync(join(dir, p, "package.json"), "{}");
	return dir;
}

test("findRoot : remonte jusqu'au package.json depuis un sous-dossier profond", () => {
	const dir = tree("profond", join("a", "b", "c"), ".");
	assert.equal(findRoot(join(dir, "a", "b", "c")), dir);
});

test("findRoot : s'arrete au package.json le plus proche, pas au plus haut", () => {
	const dir = tree("imbrique", join("sub", "x"), ".", "sub");
	assert.equal(findRoot(join(dir, "sub", "x")), join(dir, "sub"));
});

test("findRoot : sans package.json en remontant, erreur explicite", () => {
	// Racine du systeme de fichiers ("/" ou "C:\\") : aucun projet au-dessus.
	assert.throws(() => findRoot(parse(process.cwd()).root), /Aucun package\.json/);
});
