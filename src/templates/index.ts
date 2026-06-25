import { readFile } from "node:fs/promises";
import type { ReactNode } from "react";
import { cover, COVER_SIZE } from "./cover";

// Le bracket-O est passe en data-URI (chemin eprouve : c'est ce que fait next/og).
const markSvg = await readFile("assets/comptaopen/favicon/icon.svg");
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

export type Template = { width: number; height: number; node: () => ReactNode };

// Registre des visuels : sert a la fois le serveur (dev) et l'export fichier (build).
export const templates: Record<string, Template> = {
	cover: { ...COVER_SIZE, node: () => cover({ markSrc }) },
};
