import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1080, height: 1080 }; // carre, format d'affiche

// Palette charte Calame (brands/calame/brand.md).
const INK = "#1c1917"; // stone-900
const MUTED = "#78716c"; // stone-500
const PAPER = "#fafaf9"; // stone-50

const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const logoSrc = await uri("calame/logo/logo.svg");

// Concept : la page. Toute la masse en bas, le vide en haut, comme un texte qui
// commence au bas d'un feuillet encore blanc. Pas de mark en fond ici, l'OG tient
// deja ce role : la composition vient du contraste d'echelle (96 contre 30) et de
// la tension entre le bloc et le vide, rien d'autre. Un seul accent, dans le
// logotype.
function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				padding: 96,
				backgroundColor: PAPER,
			}}
		>
			<img src={logoSrc} height={40} alt="calame" />

			<div style={{ display: "flex", flex: 1 }} />

			<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 96, lineHeight: 1.05, letterSpacing: -2.5, color: INK }}>
				Relire à la machine
			</div>

			<div style={{ display: "flex", marginTop: 32, maxWidth: 760, fontFamily: "Geist", fontWeight: 400, fontSize: 30, lineHeight: 1.4, color: MUTED }}>
				Calame signale ce qui a changé dans le code sans l’être dans la doc.
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Carte carrée Calame", render } satisfies Template;
