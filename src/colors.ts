/**
 * Mesure des couleurs d'une image, pour deriver une charte depuis les exemples
 * de l'utilisateur (skill import-reference) plutot que de les deviner a l'oeil.
 */
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { PNG } from "pngjs";
import { decode as decodeJpeg } from "jpeg-js";
import { Resvg } from "@resvg/resvg-js";

export type Pixels = { data: Buffer; width: number; height: number };

/** Decode PNG, JPEG ou SVG (rasterise par resvg) en pixels RGBA. */
export function decode(file: string): Pixels {
	const kind = extname(file).toLowerCase();
	if (![".png", ".jpg", ".jpeg", ".svg"].includes(kind)) {
		throw new Error(`Format non gere : "${basename(file)}". Attendu : .png, .jpg, .jpeg ou .svg.`);
	}
	const bytes = readFileSync(file);
	if (kind === ".png") {
		const png = PNG.sync.read(bytes);
		return { data: png.data, width: png.width, height: png.height };
	}
	if (kind === ".jpg" || kind === ".jpeg") {
		const jpg = decodeJpeg(bytes, { useTArray: true });
		return { data: Buffer.from(jpg.data), width: jpg.width, height: jpg.height };
	}
	const svg = new Resvg(bytes.toString("utf8")).render(); // seul cas restant
	return { data: svg.pixels, width: svg.width, height: svg.height };
}

export type Swatch = { hex: string; count: number; share: number };

const hex = (r: number, g: number, b: number, a: number) =>
	`#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}${a === 255 ? "" : a.toString(16).padStart(2, "0")}`;

/**
 * Couleurs presentes, triees par effectif decroissant. `unique` dit combien il y
 * en a au total : au-dela de quelques centaines, l'image est une photo ou un
 * degrade, et les blocs voisins relevent de l'anticrenelage.
 */
export function palette({ data }: Pixels, top = 12): { unique: number; total: number; colors: Swatch[] } {
	const counts = new Map<number, number>();
	for (let i = 0; i < data.length; i += 4) {
		const key = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}
	const total = data.length / 4;
	const colors = [...counts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, top)
		.map(([key, count]) => ({
			hex: hex((key >>> 24) & 255, (key >>> 16) & 255, (key >>> 8) & 255, key & 255),
			count,
			share: count / total,
		}));
	return { unique: counts.size, total, colors };
}

export type Box = { x: number; y: number; width: number; height: number };

/**
 * Boite englobante des pixels non totalement transparents, pour mesurer le
 * cadrage d'un element dans son canevas. `null` si rien n'est peint ; sur une
 * image a fond opaque, la boite est l'image entiere, ce qui est correct.
 */
export function boundingBox({ data, width, height }: Pixels): Box | null {
	let minX = width;
	let minY = height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (data[(y * width + x) * 4 + 3] === 0) continue;
			if (x < minX) minX = x;
			if (x > maxX) maxX = x;
			if (y < minY) minY = y;
			if (y > maxY) maxY = y;
		}
	}
	return maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Releve lisible en console : dimensions puis palette triee. Sert a la CLI. */
export function report(file: string, top = 12): void {
	const px = decode(file);
	const { unique, colors } = palette(px, top);
	console.log(`${basename(file)} : ${px.width}x${px.height}, ${unique} couleurs distinctes`);
	for (const c of colors) console.log(`  ${c.hex.padEnd(10)} ${(c.share * 100).toFixed(2).padStart(6)} %  (${c.count} px)`);
}
