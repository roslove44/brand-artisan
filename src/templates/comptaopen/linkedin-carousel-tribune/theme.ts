import { readFile } from "node:fs/promises";
import type { CSSProperties } from "react";
import { asset } from "../../../assets";

// Charte partagee par les cartes du carousel ad LinkedIn. TS pur (pas de JSX) :
// la decouverte ne charge que les .tsx, donc ce fichier est ignore comme template.
export const SIZE = { width: 1080, height: 1080 }; // carousel ad LinkedIn, 1:1
export const TOTAL = 4;

// Palette charte ComptaOpen (assets/comptaopen/brand.md).
export const INK = "#0f172a"; // slate-900
export const BLUE = "#1d4ed8"; // blue-700
export const BLUE_LIGHT = "#60a5fa"; // blue-400
export const PAPER = "#f8fafc"; // slate-50
export const MUTED = "#cbd5e1"; // slate-300

export const markSvg = await readFile(asset("comptaopen/favicon/icon.svg"));
export const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

export const frame: CSSProperties = {
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	position: "relative",
	overflow: "hidden",
	padding: 90, // zone de securite
	backgroundColor: INK, // fond opaque
	backgroundImage: `linear-gradient(160deg, ${INK} 0%, #122a6b 60%, ${BLUE} 135%)`,
};

export const headerRow: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };
export const wordmarkText: CSSProperties = { display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 34, letterSpacing: -1, lineHeight: 1 };
export const indexText: CSSProperties = { display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 30, letterSpacing: 2, color: MUTED };
export const titleStyle: CSSProperties = { display: "flex", flexDirection: "column", fontFamily: "Sora", fontWeight: 700, fontSize: 92, letterSpacing: -3, lineHeight: 1.05, color: PAPER };
export const subStyle: CSSProperties = { display: "flex", marginTop: 34, fontFamily: "Sora", fontWeight: 500, fontSize: 40, lineHeight: 1.35, color: MUTED, maxWidth: 800 };
