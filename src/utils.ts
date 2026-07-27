// Helpers purs (sans I/O) partages par le serveur et la decouverte.

// Echappe le texte injecte dans du HTML.
export const esc = (s: string) =>
	s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

// "cover" -> "Cover".
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Retire les slashes de debut/fin d'un chemin relatif.
export const clean = (relPath: string) => relPath.replace(/^\/+|\/+$/g, "");

// Dernier segment d'un chemin : "comptaopen/cover" -> "cover".
export const last = (relPath: string) => relPath.split("/").pop() ?? "";

// Extension en minuscules, sans le point : "logo.SVG" -> "svg".
export const ext = (name: string) => name.slice(name.lastIndexOf(".") + 1).toLowerCase();

// Dimensions d'un fichier image deja produit, lues dans son en-tete : chunk IHDR
// pour un PNG, viewBox (ou width/height) pour un SVG, repertoire d'icones pour un
// .ico. 0x0 si le format est inconnu ou l'en-tete illisible.
export function pixelSize(buf: Buffer, kind: string): { width: number; height: number } {
	if (kind === "png" && buf.length >= 24) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
	if (kind === "ico" && buf.length >= 8) return { width: buf[6] || 256, height: buf[7] || 256 };
	if (kind === "svg") {
		const head = buf.toString("utf8", 0, 2048);
		const box = head.match(/viewBox\s*=\s*["'][\d.eE+-]+[\s,]+[\d.eE+-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
		if (box) return { width: Math.round(Number(box[1])), height: Math.round(Number(box[2])) };
		const w = head.match(/\swidth\s*=\s*["']([\d.]+)/);
		const h = head.match(/\sheight\s*=\s*["']([\d.]+)/);
		if (w && h) return { width: Math.round(Number(w[1])), height: Math.round(Number(h[1])) };
	}
	return { width: 0, height: 0 };
}

// "Couverture sociale ComptaOpen" -> "couverture-sociale-comptaopen" (nom de fichier).
export const slug = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "") // retire les accents
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // non-alphanum -> tiret
		.replace(/^-+|-+$/g, ""); // trim des tirets
