import { createServer } from "node:http";
import { toPng } from "./render";
import { resolve, list, load, modified, outResolve, outList, outRead, hasBrandOut, BRAND_OUT } from "./discover";
import { resolveTitle } from "./template";
import { capitalize, last, slug, clean, ext, pixelSize } from "./utils";
import { listingPage, previewPage, VIEWS, type Entry, type View } from "./ui/pages";

const PORT = 4000;

const MIME: Record<string, string> = {
	svg: "image/svg+xml",
	png: "image/png",
	ico: "image/x-icon",
};

// Clé = chemin + largeur + mtime du .tsx, donc invalidées à l'édition.
const thumbs = new Map<string, Buffer>();

// Satori à la taille native du template, puis downscale resvg : la vignette reste nette.
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

// 0x0 si le format n'est pas mesurable : le fichier reste affichable.
async function fileEntry(rel: string, name: string): Promise<Entry> {
	const kind = ext(name);
	const { width, height } = pixelSize(await outRead(rel), kind);
	return { kind: "image", name, rel, title: name, width, height, ext: kind };
}

// Un template cassé reste listé, marqué broken.
async function imageEntry(rel: string, name: string): Promise<Entry> {
	try {
		const tpl = await load(rel, true);
		return { kind: "image", name, rel, title: resolveTitle(tpl, name), width: tpl.size.width, height: tpl.size.height };
	} catch {
		return { kind: "image", name, rel, title: capitalize(name), width: 0, height: 0, broken: true };
	}
}

// Serveur de dev : l'arborescence de templates/ est navigable, façon Finder.
//   /                     -> racine (projets)
//   /calame               -> listing du projet (?view=icons|list|gallery)
//   /calame/og            -> page d'aperçu
//   /calame/og?raw        -> PNG brut, utilisable comme src
//   /calame/og?thumb=280  -> vignette PNG
//   ?w=1245&h=527         -> override de la taille sur l'aperçu
//   /calame/brand/…       -> sortie de la toolchain (out/<projet>/brand/), servie
//                            telle quelle ; dossier masqué s'il n'existe pas
const server = createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
		const relPath = clean(decodeURIComponent(url.pathname));
		const kind = await resolve(relPath);
		const outKind = kind === null ? await outResolve(relPath) : null;

		if (kind === null && outKind === null) {
			res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
			res.end(`Introuvable : "/${relPath}".`);
			return;
		}

		const view: View = (VIEWS as readonly string[]).includes(url.searchParams.get("view") ?? "")
			? (url.searchParams.get("view") as View)
			: "icons";
		const join = (name: string) => [relPath, name].filter(Boolean).join("/");

		if (kind === "dir" || outKind === "dir") {
			const { projects, images } = kind === "dir" ? await list(relPath) : { projects: [], images: [] };
			const { dirs, files } = outKind === "dir" ? await outList(relPath) : { dirs: [], files: [] };
			const isProject = kind === "dir" && relPath !== "" && !relPath.includes("/");
			const tool = isProject && (await hasBrandOut(relPath)) ? [BRAND_OUT] : [];
			const favorites = relPath === "" ? projects : (await list("")).projects;
			const entries: Entry[] = [
				...[...projects, ...tool, ...dirs].map((p): Entry => ({ kind: "dir", name: p, rel: join(p) })),
				...(await Promise.all(images.map((i) => imageEntry(join(i), i)))),
				...(await Promise.all(files.map((f) => fileEntry(join(f), f)))),
			];
			res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
			res.end(listingPage({ relPath, view, entries, favorites }));
			return;
		}

		// Servi tel quel, jamais repassé par Satori.
		if (outKind === "file") {
			const name = last(relPath);
			const kindExt = ext(name);
			const data = await outRead(relPath);
			if (url.searchParams.has("raw") || url.searchParams.has("thumb")) {
				res.writeHead(200, { "content-type": MIME[kindExt] ?? "application/octet-stream", "cache-control": "no-store" });
				res.end(data);
				return;
			}
			const parent = relPath.split("/").slice(0, -1).join("/");
			const siblings = (await outList(parent)).files;
			const idx = siblings.indexOf(name);
			const sib = (i: number) => `/${[parent, siblings[i]].filter(Boolean).join("/")}`;
			res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
			res.end(
				previewPage({
					relPath,
					title: name,
					...pixelSize(data, kindExt),
					imgSrc: `/${relPath}?raw`,
					favorites: (await list("")).projects,
					ext: kindExt,
					nav: {
						prev: idx > 0 ? sib(idx - 1) : null,
						next: idx >= 0 && idx < siblings.length - 1 ? sib(idx + 1) : null,
						index: idx,
						count: siblings.length,
					},
				}),
			);
			return;
		}

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

		// Nom de fichier = titre normalisé, pour "enregistrer sous".
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

		const parent = relPath.split("/").slice(0, -1).join("/");
		const siblings = (await list(parent)).images;
		const idx = siblings.indexOf(last(relPath));
		const sib = (i: number) => `/${[parent, siblings[i]].filter(Boolean).join("/")}`;
		const nav = {
			prev: idx > 0 ? sib(idx - 1) : null,
			next: idx >= 0 && idx < siblings.length - 1 ? sib(idx + 1) : null,
			index: idx,
			count: siblings.length,
		};

		res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
		res.end(previewPage({ relPath, title, width, height, imgSrc, favorites, nav }));
	} catch (err) {
		res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
		res.end(String(err));
	}
});

server.listen(PORT, () => console.log(`▶ Rendu sur http://localhost:${PORT}`));
