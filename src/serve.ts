import { createServer } from "node:http";
import { toPng } from "./render";
import { resolve, list, load, modified } from "./discover";
import { resolveTitle } from "./template";
import { capitalize, last, slug, clean } from "./utils";
import { listingPage, previewPage, VIEWS, type Entry, type View } from "./ui/pages";

const PORT = 4000;

// Vignettes en mémoire, clé = chemin + largeur + mtime du .tsx (invalidées à l'édition).
const thumbs = new Map<string, Buffer>();

// Rend une vignette : Satori à la taille native du template, puis downscale resvg (net).
async function thumbnail(relPath: string, width: number): Promise<Buffer> {
	const key = `${relPath}@${width}:${await modified(relPath)}`;
	const hit = thumbs.get(key);
	if (hit) return hit;
	const tpl = await load(relPath, true);
	const png = await toPng(tpl.render(), { width: tpl.size.width, height: tpl.size.height, scale: width / tpl.size.width });
	for (const k of thumbs.keys()) if (k.startsWith(`${relPath}@${width}:`)) thumbs.delete(k);
	thumbs.set(key, png);
	return png;
}

// Métadonnées d'une image d'un listing ; un template cassé reste listé (broken).
async function imageEntry(rel: string, name: string): Promise<Entry> {
	try {
		const tpl = await load(rel, true);
		return { kind: "image", name, rel, title: resolveTitle(tpl, name), width: tpl.size.width, height: tpl.size.height };
	} catch {
		return { kind: "image", name, rel, title: capitalize(name), width: 0, height: 0, broken: true };
	}
}

// Serveur de dev : l'arborescence de templates/ est navigable, façon Finder.
//   /                      -> fenêtre sur la racine (projets)
//   /comptaopen            -> listing du projet (?view=icons|list|gallery)
//   /comptaopen/cover      -> page d'aperçu (titre + alt)
//   /comptaopen/cover?raw  -> PNG brut (utilisable comme src)
//   /comptaopen/cover?thumb=280 -> vignette PNG (cache mémoire)
//   ?w=1245&h=527          -> override de la taille sur l'aperçu
const server = createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
		const relPath = clean(decodeURIComponent(url.pathname));
		const kind = await resolve(relPath);

		if (kind === null) {
			res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
			res.end(`Introuvable : "/${relPath}".`);
			return;
		}

		if (kind === "dir") {
			const view: View = (VIEWS as readonly string[]).includes(url.searchParams.get("view") ?? "")
				? (url.searchParams.get("view") as View)
				: "icons";
			const { projects, images } = await list(relPath);
			const favorites = relPath === "" ? projects : (await list("")).projects;
			const join = (name: string) => [relPath, name].filter(Boolean).join("/");
			const entries: Entry[] = [
				...projects.map((p): Entry => ({ kind: "dir", name: p, rel: join(p) })),
				...(await Promise.all(images.map((i) => imageEntry(join(i), i)))),
			];
			res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
			res.end(listingPage({ relPath, view, entries, favorites }));
			return;
		}

		// ?thumb=<largeur> -> vignette PNG pour les vues icônes/liste/galerie.
		if (url.searchParams.has("thumb")) {
			const width = Math.min(Math.max(Number(url.searchParams.get("thumb")) || 280, 16), 1600);
			res.writeHead(200, { "content-type": "image/png", "cache-control": "no-store" });
			res.end(await thumbnail(relPath, width));
			return;
		}

		const tpl = await load(relPath, true);
		const width = Number(url.searchParams.get("w")) || tpl.size.width;
		const height = Number(url.searchParams.get("h")) || tpl.size.height;
		const title = resolveTitle(tpl, last(relPath));

		// ?raw -> PNG brut, nom de fichier = titre normalisé (pour "enregistrer sous").
		if (url.searchParams.has("raw")) {
			const png = await toPng(tpl.render(), { width, height, scale: tpl.size.scale });
			res.writeHead(200, {
				"content-type": "image/png",
				"content-disposition": `inline; filename="${slug(title)}.png"`,
				"cache-control": "no-store",
			});
			res.end(png);
			return;
		}

		url.searchParams.set("raw", "");
		const imgSrc = `${url.pathname}?${url.searchParams.toString()}`;
		const favorites = (await list("")).projects;
		res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
		res.end(previewPage({ relPath, title, width, height, imgSrc, favorites }));
	} catch (err) {
		res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
		res.end(String(err));
	}
});

server.listen(PORT, () => console.log(`▶ Rendu sur http://localhost:${PORT}`));
