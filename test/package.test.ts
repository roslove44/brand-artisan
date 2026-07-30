/**
 * Invariants d'empaquetage, dans le trou que `npm pack` laisse : pack n'applique
 * aucune normalisation au package.json, seule `npm publish` le fait. Un tarball
 * verifie en local, installe et rendu par test:consumer, peut donc encore etre
 * corrige en silence a la publication.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { root } from "../src/root";

const MANIFESTS = ["package.json", "create/package.json"];

const read = (path: string) => JSON.parse(readFileSync(fileURLToPath(root(path)), "utf8")) as { bin?: Record<string, string> };

// `npm publish` rejette un chemin de bin prefixe par "./" : il le reecrit de
// force et previent par un "was invalid and removed" qui laisse croire que la
// commande a disparu du paquet. Rien n'est perdu, mais la forme canonique evite
// de dependre d'une auto-correction. Ne pas etendre la regle a `exports`, ou le
// "./" est au contraire exige par la specification.
test("package : les chemins de bin sont relatifs sans prefixe ./", () => {
	const fautifs = MANIFESTS.flatMap((file) =>
		Object.entries(read(file).bin ?? {})
			.filter(([, path]) => path.startsWith("./"))
			.map(([name, path]) => `${file} : bin["${name}"] = "${path}"`),
	);
	assert.deepEqual(fautifs, []);
});
