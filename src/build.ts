import { renderToFile } from "./render";
import { list, load } from "./discover";
import { resolveTitle } from "./template";
import { slug } from "./utils";

// Export fichier : parcourt l'arborescence de templates/ et ecrit chaque PNG dans
// out/, sous le dossier du projet, nomme d'apres le titre normalise (meme regle que
// le telechargement du serveur) : out/comptaopen/couverture-sociale-comptaopen.png.
async function walk(relPath: string): Promise<void> {
	const { projects, images } = await list(relPath);
	for (const img of images) {
		const path = [relPath, img].filter(Boolean).join("/");
		const tpl = await load(path);
		const out = [relPath, slug(resolveTitle(tpl, img))].filter(Boolean).join("/");
		await renderToFile(tpl.render(), { ...tpl.size, out });
		console.log(`✓ out/${out}.png`);
	}
	for (const proj of projects) {
		await walk([relPath, proj].filter(Boolean).join("/"));
	}
}

await walk("");
