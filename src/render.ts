import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { ReactNode } from "react";
import { asset } from "./assets";

// Satori n'accede a aucune police systeme : on charge celles deposees dans
// assets/fonts/. Convention de nom : <Famille>-<graisse>.ttf, la famille en
// PascalCase donnant le nom cite par les templates ("GeistMono-600.ttf" ->
// famille "Geist Mono", graisse 600). Deposer un fichier suffit a l'enregistrer.
const FONTS = asset("fonts/");
const FONT_FILE = /^(.+)-(\d{3})\.(?:ttf|otf)$/;

async function loadFonts(): Promise<Font[]> {
	const files = (await readdir(FONTS)).filter((f) => /\.(ttf|otf)$/.test(f));
	return Promise.all(
		files.map(async (file) => {
			const match = file.match(FONT_FILE);
			if (!match) throw new Error(`Police "${file}" hors convention <Famille>-<graisse>.ttf (voir assets/fonts/NOTICE.md).`);
			return {
				name: match[1].replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
				weight: Number(match[2]) as Font["weight"],
				style: "normal" as const,
				data: await readFile(new URL(file, FONTS)),
			};
		}),
	);
}

const fonts = await loadFonts();

type RenderSize = { width: number; height: number; scale?: number };

// JSX -> SVG (satori) -> PNG (resvg). scale = surechantillonnage (1 = taille exacte, 2 = retina).
export async function toPng(node: ReactNode, { width, height, scale = 1 }: RenderSize): Promise<Buffer> {
	const svg = await satori(node, { width, height, fonts });
	return new Resvg(svg, { fitTo: { mode: "width", value: Math.round(width * scale) } }).render().asPng();
}

// Variante qui ecrit le PNG sur disque (export final).
export async function renderToFile(node: ReactNode, { out, ...size }: RenderSize & { out: string }): Promise<string> {
	const png = await toPng(node, size);
	const file = join("out", `${out}.png`);
	await mkdir(dirname(file), { recursive: true });
	await writeFile(file, png);
	return file;
}
