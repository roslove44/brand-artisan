import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import type { ReactNode } from "react";
import { asset } from "./assets";

// Satori n'accede a aucune police systeme : on les fournit explicitement.
const fonts = [
	{ name: "Sora", weight: 700 as const, style: "normal" as const, data: await readFile(asset("fonts/Sora-700.ttf")) },
	{ name: "Sora", weight: 500 as const, style: "normal" as const, data: await readFile(asset("fonts/Sora-500.ttf")) },
	{ name: "Geist", weight: 700 as const, style: "normal" as const, data: await readFile(asset("fonts/Geist-700.ttf")) },
	{ name: "Geist", weight: 600 as const, style: "normal" as const, data: await readFile(asset("fonts/Geist-600.ttf")) },
	{ name: "Geist", weight: 400 as const, style: "normal" as const, data: await readFile(asset("fonts/Geist-400.ttf")) },
	{ name: "Geist Mono", weight: 600 as const, style: "normal" as const, data: await readFile(asset("fonts/GeistMono-600.ttf")) },
	{ name: "Geist Mono", weight: 400 as const, style: "normal" as const, data: await readFile(asset("fonts/GeistMono-400.ttf")) },
];

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
