/**
 * Calame existe en double, à la racine et dans `create/template/` : un paquet npm
 * ne peut pas référencer de fichiers hors de son dossier. La duplication n'est
 * pas évitable, la dérive silencieuse si.
 *
 * Le sens compte : tout ce que le squelette livre doit être identique à la
 * racine, pas l'inverse. La racine porte `banner` et `card` en plus, pour donner
 * au build une vraie couverture, là où le projet généré garde son seul OG.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { root } from "../src/root";

const SKELETON = fileURLToPath(root("create/template/"));
const ROOT = fileURLToPath(root("."));

// Ce que les deux copies partagent ; les autres visuels de la racine sont hors sujet.
const SHARED_DIRS = ["brands/calame", "tools/calame"];
const SHARED_FILES = ["templates/calame/og.tsx"];

const walk = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

const hash = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");

test("calame : le squelette et la racine portent les mêmes fichiers, au hachage", () => {
	const files = [...SHARED_DIRS.flatMap((d) => walk(join(SKELETON, d))).map((f) => relative(SKELETON, f)), ...SHARED_FILES];

	// Sans ce garde-fou, un dossier renommé ferait passer le test sur zéro fichier.
	assert.ok(files.length > 10, `la charte et ses assets sont attendus, ${files.length} fichier(s) trouvé(s)`);

	const divergents = files.filter((rel) => hash(join(SKELETON, rel)) !== hash(join(ROOT, rel)));
	assert.deepEqual(divergents, [], "à corriger dans les deux copies, racine et create/template/");
});
