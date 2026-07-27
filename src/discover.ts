import { readdir, readFile, stat } from "node:fs/promises";
import type { Template } from "./template";
import { root } from "./root";
import { clean } from "./utils";

// Auto-decouverte par le filesystem : un dossier = un projet/groupe, un .tsx = une image.
// Pas de registre a maintenir : on depose un fichier, il apparait.
// templates/ vit a la racine du projet, hors de src/ : c'est du contenu, pas du moteur.
const TEMPLATES = root("templates/");

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

// --- Sortie de la toolchain Python -----------------------------------------
// out/<projet>/withtool/ contient des fichiers deja produits (SVG, PNG, .ico),
// pas des templates : on les expose tels quels, comme un dossier "withtool" du
// projet, pour les relire avant promotion vers brands/. Dossier ephemere et
// souvent absent : tout ici renvoie null plutot que de lever.
const OUT = root("out/");
export const WITHTOOL = "withtool";

// "<projet>/withtool/<reste>" -> URL dans out/. null si le chemin ne vise pas withtool.
function outUrl(relPath: string): URL | null {
	const [project, folder, ...rest] = clean(relPath).split("/");
	if (!project || folder !== WITHTOOL) return null;
	return new URL([project, WITHTOOL, ...rest].join("/"), OUT);
}

// "dir", "file", ou null si hors withtool / inexistant.
export async function outResolve(relPath: string): Promise<"dir" | "file" | null> {
	const url = outUrl(relPath);
	if (!url) return null;
	try {
		return (await stat(url)).isDirectory() ? "dir" : "file";
	} catch {
		return null;
	}
}

// Le projet a-t-il une sortie d'outil a montrer ?
export const hasWithtool = async (project: string) => (await outResolve(`${project}/${WITHTOOL}`)) === "dir";

// Enfants d'un dossier de withtool : sous-dossiers et fichiers, tries.
export async function outList(relPath: string): Promise<{ dirs: string[]; files: string[] }> {
	const url = outUrl(relPath);
	const entries = url ? await readdir(url, { withFileTypes: true }) : [];
	const dirs: string[] = [];
	const files: string[] = [];
	for (const e of entries) (e.isDirectory() ? dirs : files).push(e.name);
	return { dirs: dirs.sort(), files: files.sort() };
}

// Octets bruts d'un fichier de withtool.
export const outRead = (relPath: string) => readFile(outUrl(relPath)!);

// Charge le default export de <relPath>.tsx. fresh = cache-bust (hot-reload en dev).
export async function load(relPath: string, fresh = false): Promise<Template> {
	const url = new URL(`${clean(relPath)}.tsx`, TEMPLATES);
	const spec = fresh ? `${url.href}?t=${Date.now()}` : url.href;
	const mod = await import(spec);
	return mod.default as Template;
}
