import { createServer } from "node:http";
import { toPng } from "./render";
import { templates } from "./templates";

const PORT = 4000;

// Serveur de dev : rend chaque template a la volee, comme une route Next.
//   /cover               -> taille par defaut du template
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
		const png = await toPng(tpl.node(), { width, height });

		res.writeHead(200, { "content-type": "image/png", "cache-control": "no-store" });
		res.end(png);
	} catch (err) {
		res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
		res.end(String(err));
	}
});

server.listen(PORT, () => {
	console.log(`▶ Rendu sur http://localhost:${PORT}`);
	for (const name of Object.keys(templates)) console.log(`   http://localhost:${PORT}/${name}`);
});
