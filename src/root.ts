import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

// Racine du projet, reference de brands/, templates/, fonts/ et out/.
//
// Pourquoi pas import.meta.url : le moteur est installe dans le node_modules/
// d'un autre projet, donc s'ancrer sur son propre emplacement viserait
// l'interieur de node_modules et non le projet de l'utilisateur. Remonter depuis
// le cwd tolere en plus l'appel depuis un sous-dossier.
export function findRoot(from: string): string {
	for (let dir = from; ; dir = dirname(dir)) {
		if (existsSync(join(dir, "package.json"))) return dir;
		if (dirname(dir) === dir) throw new Error(`Aucun package.json en remontant depuis "${from}" : lancer la commande depuis un projet.`);
	}
}

const ROOT = new URL(`${pathToFileURL(findRoot(process.cwd())).href}/`);

/** root("templates/") -> URL absolue, prete pour readdir/readFile. */
export const root = (path: string) => new URL(path, ROOT);
