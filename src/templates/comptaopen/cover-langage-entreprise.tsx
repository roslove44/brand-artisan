import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// Cover d'article 16:9 (1280x720) pour le site ComptaOpen.
// Article : « La comptabilite n'est pas une discipline isolee.
//            C'est le langage de toute l'entreprise. » (Rostand MIGAN).
const SIZE = { width: 1280, height: 720 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md). Fond sombre.
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400 (payoff sur fond sombre)
const PAPER = "#f8fafc"; // slate-50 (setup sur fond sombre)
const MUTED = "#cbd5e1"; // slate-300

// Trame papier registre : grille fine + 2 reglures de colonne (comme cover.tsx).
const GRID_STEP = 58;
const LINE = "rgba(248,250,252,0.05)";
const RULE = "rgba(96,165,250,0.13)";
const RULE_COLUMNS = new Set([6, 18]);

function gridLines(width: number, height: number): CSSProperties[] {
	const lines: CSSProperties[] = [];
	let i = 1;
	for (let x = GRID_STEP; x < width; x += GRID_STEP, i++) {
		const isRule = RULE_COLUMNS.has(i);
		lines.push({ position: "absolute", top: 0, bottom: 0, left: x, width: isRule ? 1.5 : 1, backgroundColor: isRule ? RULE : LINE });
	}
	for (let y = GRID_STEP; y < height; y += GRID_STEP) {
		lines.push({ position: "absolute", left: 0, right: 0, top: y, height: 1, backgroundColor: LINE });
	}
	return lines;
}

const cornerBase: CSSProperties = { position: "absolute", width: 30, height: 30 };
const cornerStroke = "1.5px solid rgba(248,250,252,0.26)";

// Bracket-O en data-URI (chemin eprouve, comme cover.tsx / next/og).
const markSvg = await readFile(asset("comptaopen/favicon/icon.svg"));
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

function render(): ReactNode {
	const { width, height } = SIZE;
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				overflow: "hidden",
				padding: 88,
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(135deg, ${INK} 0%, #122a6b 58%, ${BLUE} 125%)`,
			}}
		>
			{/* Trame registre */}
			{gridLines(width, height).map((style, i) => (
				<div key={i} style={style} />
			))}

			{/* Glow radial bleu, au-dessus de la trame */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 30% 48%, rgba(96,165,250,0.20), rgba(15,23,42,0) 60%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 40, left: 40, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 40, right: 40, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 40, left: 40, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 40, right: 40, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Header : wordmark + kicker dessous */}
			<div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<img src={markSrc} width={56} height={56} alt="" style={{ marginRight: 18 }} />
					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 38, letterSpacing: -1, lineHeight: 1 }}>
						<span style={{ color: PAPER }}>Compta</span>
						<span style={{ color: BLUE_LIGHT }}>Open</span>
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", marginTop: 24 }}>
					<div style={{ width: 34, height: 3, backgroundColor: BLUE_LIGHT, marginRight: 16 }} />
					<div style={{ display: "flex", fontFamily: "Geist Mono", fontWeight: 600, fontSize: 21, letterSpacing: 5, color: BLUE_LIGHT }}>
						ARTICLE
					</div>
				</div>
			</div>

			{/* Titre centré verticalement sur le reste de la page */}
			<div style={{ display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "center", position: "relative" }}>
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 70, letterSpacing: -2.5, lineHeight: 1.06, color: PAPER, maxWidth: 1000 }}>
					La comptabilité en tant que langage de toute l'entreprise.
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Cover article : Le langage de toute l'entreprise", render } satisfies Template;
