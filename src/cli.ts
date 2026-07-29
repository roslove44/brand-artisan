/**
 * Commandes de `brand-artisan`. Appele par bin/brand-artisan.js, qui a deja
 * enregistre tsx : a partir d'ici, .ts et .tsx sont lisibles, y compris les
 * templates du projet charges a l'execution.
 *
 * dev et build sont des modules a effet : les importer suffit a les lancer.
 */
import { report } from "./colors";

const USAGE = `brand-artisan <commande>

  dev                       serveur de rendu sur http://localhost:4000
  build                     rend toute l'arborescence de templates/ dans out/
  colors <image> [nombre]   palette d'une image (.png, .jpg, .svg), triee par effectif

Les skills s'installent a part, selon l'agent : npx skills add roslove44/brand-artisan
`;

const [command, ...rest] = process.argv.slice(2);

switch (command) {
	case "dev":
		await import("./serve");
		break;
	case "build":
		await import("./build");
		break;
	case "colors": {
		const [file, top] = rest;
		if (!file) {
			console.error("Usage : brand-artisan colors <image.png|jpg|svg> [nombre de couleurs]");
			process.exit(1);
		}
		report(file, Number(top) || undefined);
		break;
	}
	default:
		console.error(command ? `Commande inconnue : "${command}".\n\n${USAGE}` : USAGE);
		process.exit(1);
}
