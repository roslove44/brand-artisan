import { PDFDocument } from "pdf-lib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { list, load, resolve } from "./discover";
import { toPng } from "./render";
import { root } from "./root";
import { clean } from "./utils";

const OUT = root("out/");

/**
 * Assemble les .tsx d'un dossier en un PDF, une carte par page. C'est le seul
 * carrousel organique du fil LinkedIn : un post document, ou LinkedIn pagine le
 * PDF en cartes qui defilent. Une serie de PNG postee telle quelle donne une
 * mosaique, pas un carrousel.
 *
 * L'ordre des pages est celui de `list`, donc lexical : au-dela de 9 cartes,
 * numeroter card-01 pour que card-10 ne passe pas avant card-2.
 */
export async function toPdf(relPath: string): Promise<string> {
	const rel = clean(relPath);
	if ((await resolve(rel)) !== "dir") throw new Error(`Aucun dossier templates/${rel}/ : le PDF s'assemble depuis un dossier de cartes.`);

	const { images } = await list(rel);
	if (images.length === 0) throw new Error(`templates/${rel}/ ne contient aucun .tsx : rien a assembler.`);

	const doc = await PDFDocument.create();
	for (const name of images) {
		const tpl = await load(`${rel}/${name}`);
		const png = await doc.embedPng(await toPng(tpl.render(), tpl.size));
		// Page a la taille exacte de l'image : LinkedIn deduit le ratio du
		// document de sa premiere page, donc pas de recadrage a lui imposer.
		doc.addPage([png.width, png.height]).drawImage(png, { x: 0, y: 0, width: png.width, height: png.height });
	}

	const file = fileURLToPath(new URL(`${rel}.pdf`, OUT));
	await mkdir(dirname(file), { recursive: true });
	await writeFile(file, await doc.save());
	return file;
}
