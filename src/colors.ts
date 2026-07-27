/**
 * Mesure des couleurs d'une image, pour deriver une charte depuis les exemples
 * de l'utilisateur (skill import-reference) plutot que de les deviner a l'oeil.
 *
 * Remplace l'usage de Pillow : meme methode, compter les pixels par couleur et
 * trier par effectif decroissant. Le premier bloc est le fond, les suivants les
 * encres et accents.
 *
 * En ligne de commande : npx tsx src/colors.ts <image> [nombre de couleurs]
 */
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { pathToFileURL } from "node:url";
import { PNG } from "pngjs";
import { decode as decodeJpeg } from "jpeg-js";
import { Resvg } from "@resvg/resvg-js";

export type Pixels = { data: Buffer; width: number; height: number };

/** Decode PNG, JPEG ou SVG (rasterise par resvg) en pixels RGBA. */
export function decode(file: string): Pixels {
	// Le format se juge avant la lecture : un .webp doit dire "format non gere",
	// pas echouer plus loin dans un decodeur qui ne le concerne pas.
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

// Execution directe : npx tsx src/colors.ts <image> [top]
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const [file, top] = process.argv.slice(2);
	if (!file) {
		console.error("Usage : npx tsx src/colors.ts <image.png|jpg|svg> [nombre de couleurs]");
		process.exit(1);
	}
	const px = decode(file);
	const { unique, colors } = palette(px, Number(top) || 12);
	console.log(`${basename(file)} : ${px.width}x${px.height}, ${unique} couleurs distinctes`);
	for (const c of colors) console.log(`  ${c.hex.padEnd(10)} ${(c.share * 100).toFixed(2).padStart(6)} %  (${c.count} px)`);
}
