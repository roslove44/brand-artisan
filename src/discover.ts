import { readdir, readFile, stat } from "node:fs/promises";
import type { Template } from "./template";
import { root } from "./root";
import { clean } from "./utils";

// Auto-decouverte par le filesystem, sans registre a maintenir : un dossier = un
// projet, un .tsx = une image. templates/ vit a la racine du projet, hors de
// src/, parce que c'est du contenu et pas du moteur.
const TEMPLATES = root("templates/");

async function exists(url: URL): Promise<boolean> {
	try {
		await stat(url);
		return true;
	} catch {
		return false;
	}
}

export async function resolve(relPath: string): Promise<"dir" | "image" | null> {
	const rel = clean(relPath);
	if (rel === "") return "dir";
	if (await exists(new URL(`${rel}/`, TEMPLATES))) return "dir";
	if (await exists(new URL(`${rel}.tsx`, TEMPLATES))) return "image";
	return null;
}

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

// Sert de cle de cache aux vignettes.
export async function modified(relPath: string): Promise<number> {
	const s = await stat(new URL(`${clean(relPath)}.tsx`, TEMPLATES));
	return s.mtimeMs;
}

// --- Sortie de la toolchain de marque ---------------------------------------
// out/<projet>/brand/ contient des fichiers deja produits, pas des templates :
// on les expose tels quels, pour les relire avant promotion vers brands/. Le
// dossier est ephemere et souvent absent, d'ou le null partout plutot qu'une
// exception.
const OUT = root("out/");
export const BRAND_OUT = "brand";

function outUrl(relPath: string): URL | null {
	const [project, folder, ...rest] = clean(relPath).split("/");
	if (!project || folder !== BRAND_OUT) return null;
	return new URL([project, BRAND_OUT, ...rest].join("/"), OUT);
}

export async function outResolve(relPath: string): Promise<"dir" | "file" | null> {
	const url = outUrl(relPath);
	if (!url) return null;
	try {
		return (await stat(url)).isDirectory() ? "dir" : "file";
	} catch {
		return null;
	}
}

export const hasBrandOut = async (project: string) => (await outResolve(`${project}/${BRAND_OUT}`)) === "dir";

export async function outList(relPath: string): Promise<{ dirs: string[]; files: string[] }> {
	const url = outUrl(relPath);
	const entries = url ? await readdir(url, { withFileTypes: true }) : [];
	const dirs: string[] = [];
	const files: string[] = [];
	for (const e of entries) (e.isDirectory() ? dirs : files).push(e.name);
	return { dirs: dirs.sort(), files: files.sort() };
}

export const outRead = (relPath: string) => readFile(outUrl(relPath)!);

/** Charge le default export de <relPath>.tsx. `fresh` cache-bust, pour le hot-reload en dev. */
export async function load(relPath: string, fresh = false): Promise<Template> {
	const url = new URL(`${clean(relPath)}.tsx`, TEMPLATES);
	const spec = fresh ? `${url.href}?t=${Date.now()}` : url.href;
	const mod = await import(spec);
	return mod.default as Template;
}
