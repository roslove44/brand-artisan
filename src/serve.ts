import { createServer } from "node:http";
import { toPng } from "./render";
import { templates } from "./templates";

const PORT = 4000;
const PROJECT_NAME = "OgArtisan";

const esc = (s: string) =>
	s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Titre de page : "Cover | OgArtisan · 1500×500".
function buildTitle(name: string, width: number, height: number, separator = "|"): string {
	return `${capitalize(name)} ${separator} ${PROJECT_NAME} · ${width}×${height}`;
}

// Page de preview : <title> parlant + <img alt> (miroir de la page qui consomme une og:image).
function previewPage(name: string, width: number, height: number, alt: string, imgSrc: string): string {
	return `<!doctype html>
		<html lang="fr">
			<head>
				<meta charset="utf-8" />
				<title>${esc(buildTitle(name, width, height))}</title>
				<style>
					body {
						margin: 0;
						min-height: 100vh;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 16px;
						background: #0f172a;
						font-family: system-ui, sans-serif;
					}
					img {
						max-width: 92vw;
						height: auto;
						border-radius: 8px;
						box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
					}
					figcaption {
						color: #cbd5e1;
						font-size: 14px;
					}
				</style>
			</head>
			<body>
				<img src="${esc(imgSrc)}" alt="${esc(alt)}" width="${width}" height="${height}" />
				<figcaption>${esc(capitalize(name))} · ${width}×${height}</figcaption>
			</body>
		</html>
	`;
}

// Serveur de dev : rend chaque template a la volee, comme une route Next.
//   /cover               -> page de preview HTML (titre + alt)
//   /cover?raw           -> PNG brut (utilisable comme src)
//   /cover?w=1245&h=527  -> override de la taille en query
const server = createServer(async (req, res) => {
	try {
		const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
		const name = url.pathname.replace(/^\/+|\/+$/g, "") || "cover";
		const tpl = templates[name];

		if (!tpl) {
			res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
			res.end(`Template inconnu : "${name}". Disponibles : ${Object.keys(templates).join(", ")}`);
			return;
		}

		const width = Number(url.searchParams.get("w")) || tpl.width;
		const height = Number(url.searchParams.get("h")) || tpl.height;

		// ?raw -> PNG brut ; sinon -> page de preview qui pointe vers ?raw.
		if (url.searchParams.has("raw")) {
			const png = await toPng(tpl.node(), { width, height });
			res.writeHead(200, { "content-type": "image/png", "cache-control": "no-store" });
			res.end(png);
			return;
		}

		url.searchParams.set("raw", "");
		const imgSrc = `${url.pathname}?${url.searchParams.toString()}`;
		res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
		res.end(previewPage(name, width, height, tpl.alt, imgSrc));
	} catch (err) {
		res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
		res.end(String(err));
	}
});

server.listen(PORT, () => {
	console.log(`▶ Rendu sur http://localhost:${PORT}`);
	for (const name of Object.keys(templates)) console.log(`   http://localhost:${PORT}/${name}`);
});
