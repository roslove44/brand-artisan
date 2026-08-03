/**
 * Appele par bin/brand-artisan.js, qui a deja enregistre tsx : a partir d'ici,
 * .ts et .tsx sont lisibles, templates du projet compris.
 *
 * dev et build sont des modules a effet : les importer suffit a les lancer.
 */
import { report } from "./colors";

const USAGE = `brand-artisan <command>

  dev                       render server at http://localhost:4000
  build                     renders the whole templates/ tree into out/
  pdf <folder>              assembles a folder of slides into a PDF (LinkedIn document post)
  colors <image> [count]    an image's palette (.png, .jpg, .svg), sorted by pixel count

The skills install separately, per agent: npx skills add roslove44/brand-artisan -s "*" -y
`;

const [command, ...rest] = process.argv.slice(2);

switch (command) {
	case "dev":
		await import("./serve");
		break;
	case "build":
		await import("./build");
		break;
	case "pdf": {
		const [dir] = rest;
		if (!dir) {
			console.error("Usage: brand-artisan pdf <project>/<folder-of-slides>");
			process.exit(1);
		}
		const { toPdf } = await import("./pdf");
		console.log(`✓ ${await toPdf(dir)}`);
		break;
	}
	case "colors": {
		const [file, top] = rest;
		if (!file) {
			console.error("Usage: brand-artisan colors <image.png|jpg|svg> [number of colors]");
			process.exit(1);
		}
		report(file, Number(top) || undefined);
		break;
	}
	default:
		console.error(command ? `Unknown command: "${command}".\n\n${USAGE}` : USAGE);
		process.exit(1);
}
