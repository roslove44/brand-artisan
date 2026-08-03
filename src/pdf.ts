import { PDFDocument } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { list, load, resolve } from "./discover";
import { toPng } from "./render";
import { root } from "./root";
import { clean } from "./utils";

const OUT = root("out/");

type Slide = { name: string; width: number; height: number };

const ratio = (s: Slide) => Math.round((s.width / s.height) * 1000);

/**
 * LinkedIn prend le ratio du document sur sa premiere page : une carte au ratio
 * different y sortirait letterboxee. L'erreur ne se voit qu'a l'upload, donc on
 * refuse d'assembler plutot que de livrer un PDF bancal. La taille, elle, peut
 * varier (une carte en scale 2 garde son ratio).
 */
export function checkRatios(slides: Slide[]): void {
	const [first] = slides;
	const odd = slides.find((s) => ratio(s) !== ratio(first));
	if (odd) {
		throw new Error(
			`Mixed ratios: ${odd.name} is ${odd.width}x${odd.height}, ${first.name} is ${first.width}x${first.height}. Every page must share the same ratio.`,
		);
	}
}

/**
 * Assemble les .tsx d'un dossier en un PDF, une carte par page. C'est le seul
 * carrousel organique du fil LinkedIn : un post document, ou LinkedIn pagine le
 * PDF en cartes qui defilent. Une serie de PNG postee telle quelle donne une
 * mosaique, pas un carrousel.
 *
 * L'ordre des pages est celui de `list`, donc naturel : card-2 avant card-10.
 */
export async function toPdf(relPath: string): Promise<string> {
	const rel = clean(relPath);
	if ((await resolve(rel)) !== "dir") throw new Error(`No templates/${rel}/ folder: the PDF is assembled from a folder of slides.`);

	const { images } = await list(rel);
	if (images.length === 0) throw new Error(`templates/${rel}/ holds no .tsx: nothing to assemble.`);

	// Tout charger avant de rendre : le controle de ratio doit echouer tout de
	// suite, pas apres huit rendus.
	const cards = await Promise.all(images.map(async (name) => ({ name, tpl: await load(`${rel}/${name}`) })));
	checkRatios(cards.map(({ name, tpl }) => ({ name, ...tpl.size })));

	const doc = await PDFDocument.create();
	for (const { tpl } of cards) {
		const png = await doc.embedPng(await toPng(tpl.render(), tpl.size));
		// Page a la taille exacte de l'image : aucun recadrage a lui imposer.
		doc.addPage([png.width, png.height]).drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
	}

	const file = fileURLToPath(new URL(`${rel}.pdf`, OUT));
	await mkdir(dirname(file), { recursive: true });
	await writeFile(file, await doc.save());
	return file;
}
