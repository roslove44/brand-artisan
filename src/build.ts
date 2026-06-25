import { renderToFile } from "./render";
import { templates } from "./templates";

// Export fichier : rend tous les templates du registre dans out/.
for (const [name, tpl] of Object.entries(templates)) {
	const file = await renderToFile(tpl.node(), { width: tpl.width, height: tpl.height, out: name });
	console.log(`✓ ${file}`);
}
