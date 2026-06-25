import { renderToFile } from "./render";
import { list, load } from "./discover";

// Export fichier : parcourt l'arborescence de templates/ et ecrit chaque PNG dans
// out/, en reflétant le chemin (out/comptaopen/cover.png).
async function walk(relPath: string): Promise<void> {
	const { projects, images } = await list(relPath);
	for (const img of images) {
		const path = [relPath, img].filter(Boolean).join("/");
		const tpl = await load(path);
		const file = await renderToFile(tpl.render(), { ...tpl.size, out: path });
		console.log(`✓ ${file}`);
	}
	for (const proj of projects) {
		await walk([relPath, proj].filter(Boolean).join("/"));
	}
}

await walk("");
