// Hook de resolution ESM du serveur de dev. En JavaScript, et sans import, pour
// la meme raison que bin/ : Node le charge dans le thread des hooks, ou tsx n'est
// pas actif. La racine de templates/ arrive donc par le `data` de register().
//
// load(_, fresh) cache-bust le template avec ?t=…, mais une resolution relative
// n'herite pas de la query : ses imports (constantes, tokens partages entre
// templates) restaient servis par le cache de modules, figes jusqu'au
// redemarrage du serveur. On propage la query a toute cible resolue sous
// templates/, et de proche en proche : le graphe entier du template est reevalue
// a chaque rendu. Hors de templates/ (react, le moteur, node_modules) rien ne
// bouge, ces modules-la n'ont pas a etre recharges.

let templates = "";

export function initialize(templatesUrl) {
	templates = templatesUrl;
}

export async function resolve(specifier, context, nextResolve) {
	const resolved = await nextResolve(specifier, context);
	const stamp = /\?t=\d+$/.exec(context.parentURL ?? "")?.[0];
	if (!stamp || !resolved.url.startsWith(templates) || resolved.url.includes("?")) return resolved;
	return { ...resolved, url: `${resolved.url}${stamp}` };
}
