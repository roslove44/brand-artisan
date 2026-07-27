/**
 * Commandes de `brand-artisan`. Appele par bin/brand-artisan.js, qui a deja
 * enregistre tsx : a partir d'ici, .ts et .tsx sont lisibles, y compris les
 * templates du projet charges a l'execution.
 *
 * dev et build sont des modules a effet : les importer suffit a les lancer.
 */
import { cpSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { report } from "./colors";
import { root } from "./root";

const USAGE = `brand-artisan <commande>

  dev                       serveur de rendu sur http://localhost:4000
  build                     rend toute l'arborescence de templates/ dans out/
  colors <image> [nombre]   palette d'une image (.png, .jpg, .svg), triee par effectif
  skills sync               (re)pose les skills du moteur dans .claude/skills/
`;

// Les skills decrivent les conventions du moteur : elles doivent suivre sa
// version, pas celle du jour ou le projet a ete cree. On les recopie depuis le
// paquet installe, ce qui rend `npm update` suivi d'un sync suffisant.
function syncSkills(): void {
	const from = fileURLToPath(new URL("../.claude/skills/", import.meta.url));
	const to = fileURLToPath(root(".claude/skills/"));
	cpSync(from, to, { recursive: true });
	console.log(`${readdirSync(from).length} skills posees dans .claude/skills/ (les fichiers de meme nom sont ecrases).`);
}

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
	case "skills":
		if (rest[0] !== "sync") {
			console.error("Usage : brand-artisan skills sync");
			process.exit(1);
		}
		syncSkills();
		break;
	default:
		console.error(command ? `Commande inconnue : "${command}".\n\n${USAGE}` : USAGE);
		process.exit(1);
}
