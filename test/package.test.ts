/**
 * Le trou que `npm pack` laisse : il n'applique aucune normalisation au
 * package.json, seule `npm publish` le fait. Un tarball installe et rendu par
 * test:consumer peut donc encore etre corrige en silence a la publication.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { root } from "../src/root";

const MANIFESTS = ["package.json", "create/package.json"];

const read = (path: string) => JSON.parse(readFileSync(fileURLToPath(root(path)), "utf8")) as { bin?: Record<string, string> };

// `npm publish` reecrit de force un chemin de bin prefixe par "./", en prevenant
// par un "was invalid and removed" qui laisse croire que la commande a disparu.
// Ne pas etendre la regle a `exports`, ou la specification exige ce "./".
test("package : les chemins de bin sont relatifs sans prefixe ./", () => {
	const fautifs = MANIFESTS.flatMap((file) =>
		Object.entries(read(file).bin ?? {})
			.filter(([, path]) => path.startsWith("./"))
			.map(([name, path]) => `${file} : bin["${name}"] = "${path}"`),
	);
	assert.deepEqual(fautifs, []);
});
