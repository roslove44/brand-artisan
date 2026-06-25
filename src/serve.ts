import { createServer } from "node:http";
import { toPng } from "./render";
import { resolve, list, load } from "./discover";
import { esc, capitalize, last } from "./utils";

const PORT = 4000;
const PROJECT_NAME = "OgArtisan";

// Titre de page image : "Cover | OgArtisan · 1500×500".
function buildTitle(name: string, width: number, height: number, separator = "|"): string {
	return `${capitalize(name)} ${separator} ${PROJECT_NAME} · ${width}×${height}`;
}

// Fil d'ariane : OgArtisan / comptaopen / cover (le dernier segment n'est pas un lien).
function breadcrumb(relPath: string): string {
	const segs = relPath ? relPath.split("/") : [];
	const crumbs = [`<a href="/">${esc(PROJECT_NAME)}</a>`];
	let acc = "";
	segs.forEach((s, i) => {
		acc = acc ? `${acc}/${s}` : s;
		crumbs.push(i === segs.length - 1 ? esc(s) : `<a href="/${esc(acc)}">${esc(s)}</a>`);
	});
	return `<nav>${crumbs.join(" / ")}</nav>`;
}

function shell(title: string, body: string): string {
	return `<!doctype html>
<html lang="fr">
	<head>
		<meta charset="utf-8" />
		<title>${esc(title)}</title>
		<style>
			body {
				margin: 0;
				min-height: 100vh;
				box-sizing: border-box;
				padding: 48px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 20px;
				background: #0f172a;
				color: #f8fafc;
				font-family: system-ui, sans-serif;
			}
			a { color: #60a5fa; text-decoration: none; }
			a:hover { text-decoration: underline; }
			nav { font-size: 13px; color: #cbd5e1; }
			h1 { margin: 0; font-size: 22px; font-weight: 700; }
			ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; min-width: 280px; }
			li { background: #1e293b; border-radius: 8px; }
			li a { display: flex; justify-content: space-between; padding: 12px 16px; }
			.kind { color: #64748b; font-size: 12px; }
			img { max-width: 92vw; height: auto; border-radius: 8px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
			figcaption { color: #cbd5e1; font-size: 14px; }
		</style>
	</head>
	<body>
${body}
	</body>
</html>
`;
}

// Page de listing : sous-projets puis images, en liens.
function listingPage(relPath: string, projects: string[], images: string[]): string {
	const heading = relPath ? capitalize(last(relPath)) : PROJECT_NAME;
	const title = relPath ? `${heading} | ${PROJECT_NAME}` : PROJECT_NAME;
	const href = (child: string) => "/" + [relPath, child].filter(Boolean).join("/");
	const li = (label: string, kind: string, target: string) =>
		`<li><a href="${esc(target)}"><span>${esc(label)}</span><span class="kind">${kind}</span></a></li>`;
	const items = [
		...projects.map((p) => li(`${p}/`, "projet", href(p))),
		...images.map((i) => li(i, "image", href(i))),
	];
	const listHtml = items.length ? `<ul>${items.join("")}</ul>` : `<p class="kind">Aucun visuel ici.</p>`;
	return shell(title, `\t\t${breadcrumb(relPath)}\n\t\t<h1>${esc(heading)}</h1>\n\t\t${listHtml}`);
}

// Page de preview d'une image : titre parlant + <img alt> (miroir d'une og:image).
function previewPage(relPath: string, width: number, height: number, alt: string, imgSrc: string): string {
	const body = `\t\t${breadcrumb(relPath)}
		<img src="${esc(imgSrc)}" alt="${esc(alt)}" width="${width}" height="${height}" />
		<figcaption>${esc(capitalize(last(relPath)))} · ${width}×${height}</figcaption>`;
	return shell(buildTitle(last(relPath), width, height), body);
}

// Serveur de dev : l'arborescence de templates/ est navigable.
//   /                    -> liste les projets
//   /comptaopen          -> liste images + sous-projets
//   /comptaopen/cover    -> page de preview (titre + alt)
//   /comptaopen/cover?raw -> PNG brut (utilisable comme src)
//   ?w=1245&h=527        -> override de la taille
const server = createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
		const relPath = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, "");
		const kind = await resolve(relPath);

		if (kind === null) {
			res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
			res.end(`Introuvable : "/${relPath}".`);
			return;
		}

		if (kind === "dir") {
			const { projects, images } = await list(relPath);
			res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
			res.end(listingPage(relPath, projects, images));
			return;
		}

		const tpl = await load(relPath, true);
		const width = Number(url.searchParams.get("w")) || tpl.size.width;
		const height = Number(url.searchParams.get("h")) || tpl.size.height;

		// ?raw -> PNG brut ; sinon -> page de preview qui pointe vers ?raw.
		if (url.searchParams.has("raw")) {
			const png = await toPng(tpl.render(), { width, height });
			res.writeHead(200, { "content-type": "image/png", "cache-control": "no-store" });
			res.end(png);
			return;
		}

		url.searchParams.set("raw", "");
		const imgSrc = `${url.pathname}?${url.searchParams.toString()}`;
		res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
		res.end(previewPage(relPath, width, height, tpl.alt, imgSrc));
	} catch (err) {
		res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
		res.end(String(err));
	}
});

server.listen(PORT, () => console.log(`▶ Rendu sur http://localhost:${PORT}`));
