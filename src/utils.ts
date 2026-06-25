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
