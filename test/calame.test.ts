/**
 * Calame existe en double : à la racine, comme marque de référence du dépôt, et
 * dans `create/template/`, comme squelette livré par le générateur. Un paquet
 * npm ne pouvant pas référencer de fichiers hors de son dossier, la duplication
 * n'est pas évitable — la dérive silencieuse, si.
 *
 * Sens de la comparaison : **tout ce que le squelette livre doit être identique
 * à la racine**. L'inverse n'est pas vrai, la racine porte des visuels en plus
 * (`banner`, `card`) pour donner au build une vraie couverture, là où le projet
 * généré reste minimal avec son seul OG.
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

// Ce que les deux copies partagent : la charte et ses assets, la toolchain, et
// l'OG. Les autres visuels de la racine ne sont pas concernés.
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
