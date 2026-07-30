import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1200, height: 630 }; // OG standard, pas de scale

// Palette charte Calame (brands/calame/brand.md).
const INK = "#1c1917"; // stone-900
const MUTED = "#78716c"; // stone-500
const PAPER = "#fafaf9"; // stone-50

// Mark et logotype en data-URI : chemin eprouve, et l'OG reste leger.
const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const markSrc = await uri("calame/favicon/icon-mark.svg");
const logoSrc = await uri("calame/logo/logo.svg");

// Le mark deborde en haut a droite : on n'en voit que le geste qui traverse,
// pas l'objet. Il donne la diagonale sans disputer le titre.
const MARK = 1000;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				position: "relative",
				overflow: "hidden",
				backgroundColor: PAPER, // fond opaque, exige par les plateformes
			}}
		>
			<img src={markSrc} width={MARK} height={MARK} alt="" style={{ position: "absolute", right: -420, top: -140 }} />

			<div style={{ display: "flex", flexDirection: "column", paddingLeft: 88, width: 700 }}>
				<img src={logoSrc} height={38} alt="calame" style={{ marginBottom: 46 }} />

				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 70, lineHeight: 1.08, letterSpacing: -1.5, color: INK }}>
					Écrire pendant qu’on construit
				</div>

				<div style={{ display: "flex", marginTop: 28, fontFamily: "Geist", fontWeight: 400, fontSize: 26, lineHeight: 1.4, color: MUTED }}>
					Une seule version, dans le dépôt.
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Aperçu de partage Calame", render } satisfies Template;
