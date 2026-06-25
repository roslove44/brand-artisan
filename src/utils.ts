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

// "Couverture sociale ComptaOpen" -> "couverture-sociale-comptaopen" (nom de fichier).
export const slug = (s: string) =>
	s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "") // retire les accents
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // non-alphanum -> tiret
		.replace(/^-+|-+$/g, ""); // trim des tirets
