import { readdir, stat } from "node:fs/promises";
import type { Template } from "./template";
import { clean } from "./utils";

// Auto-decouverte par le filesystem : un dossier = un projet/groupe, un .tsx = une image.
// Pas de registre a maintenir : on depose un fichier, il apparait.
const TEMPLATES = new URL("./templates/", import.meta.url);

async function exists(url: URL): Promise<boolean> {
	try {
		await stat(url);
		return true;
	} catch {
		return false;
	}
}

// "dir" si relPath est un dossier (projet), "image" si <relPath>.tsx existe, sinon null.
export async function resolve(relPath: string): Promise<"dir" | "image" | null> {
	const rel = clean(relPath);
	if (rel === "") return "dir";
	if (await exists(new URL(`${rel}/`, TEMPLATES))) return "dir";
	if (await exists(new URL(`${rel}.tsx`, TEMPLATES))) return "image";
	return null;
}

// Enfants d'un noeud : sous-dossiers (projets) et .tsx (images), tries.
export async function list(relPath: string): Promise<{ projects: string[]; images: string[] }> {
	const rel = clean(relPath);
	const dir = rel === "" ? TEMPLATES : new URL(`${rel}/`, TEMPLATES);
	const entries = await readdir(dir, { withFileTypes: true });
	const projects: string[] = [];
	const images: string[] = [];
	for (const e of entries) {
		if (e.isDirectory()) projects.push(e.name);
		else if (e.name.endsWith(".tsx")) images.push(e.name.slice(0, -4));
	}
	return { projects: projects.sort(), images: images.sort() };
}

// Date de modification du .tsx d'une image (sert de clé de cache aux vignettes).
export async function modified(relPath: string): Promise<number> {
	const s = await stat(new URL(`${clean(relPath)}.tsx`, TEMPLATES));
	return s.mtimeMs;
}

// Charge le default export de <relPath>.tsx. fresh = cache-bust (hot-reload en dev).
export async function load(relPath: string, fresh = false): Promise<Template> {
	const url = new URL(`${clean(relPath)}.tsx`, TEMPLATES);
	const spec = fresh ? `${url.href}?t=${Date.now()}` : url.href;
	const mod = await import(spec);
	return mod.default as Template;
}
