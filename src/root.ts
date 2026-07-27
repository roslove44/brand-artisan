import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

// Racine du projet : le dossier qui porte le package.json, trouve en remontant
// depuis le repertoire courant. C'est la reference de tous les dossiers de
// contenu (brands/, templates/, fonts/, out/).
//
// Pourquoi pas import.meta.url : le moteur est destine a etre installe dans le
// node_modules/ d'un autre projet. S'ancrer sur son propre emplacement viserait
// alors l'interieur de node_modules, pas le projet de l'utilisateur. Remonter
// depuis le cwd donne aussi la tolerance a l'appel depuis un sous-dossier.
export function findRoot(from: string): string {
	for (let dir = from; ; dir = dirname(dir)) {
		if (existsSync(join(dir, "package.json"))) return dir;
		if (dirname(dir) === dir) throw new Error(`Aucun package.json en remontant depuis "${from}" : lancer la commande depuis un projet.`);
	}
}

const ROOT = new URL(`${pathToFileURL(findRoot(process.cwd())).href}/`);

// root("templates/") -> URL absolue vers le dossier, prete pour readdir/readFile.
export const root = (path: string) => new URL(path, ROOT);
