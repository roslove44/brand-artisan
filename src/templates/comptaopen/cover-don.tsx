import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// Couverture de partage social pour la page de don FedaPay (« Soutenir ComptaOpen »).
// Taille imposee par FedaPay : 1024x512 (ratio 2:1), PNG.
const SIZE = { width: 1024, height: 512 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md). Fond sombre.
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400 (accent sur fond sombre)
const PAPER = "#f8fafc"; // slate-50 (texte sur fond sombre)
const MUTED = "#cbd5e1"; // slate-300 (accroche)

// Trame papier registre : grille fine + 2 reglures de colonne (comme cover.tsx).
const GRID_STEP = 52;
const LINE = "rgba(248,250,252,0.05)";
const RULE = "rgba(96,165,250,0.13)";
const RULE_COLUMNS = new Set([5, 16]);

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

const cornerBase: CSSProperties = { position: "absolute", width: 26, height: 26 };
const cornerStroke = "1.5px solid rgba(248,250,252,0.26)";

// Bracket-O en data-URI (chemin eprouve, comme cover.tsx / next/og).
// Tuile bleue pour le wordmark, blanc seul pour le motif « ouverture » en fond.
const markSvg = await readFile(asset("comptaopen/favicon/icon.svg"));
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;
const whiteMarkSvg = await readFile(asset("comptaopen/favicon/icon-white-mark.svg"));
const whiteMarkSrc = `data:image/svg+xml;base64,${whiteMarkSvg.toString("base64")}`;

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
				padding: 60,
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(135deg, ${INK} 0%, #122a6b 60%, ${BLUE} 130%)`,
			}}
		>
			{/* Trame registre */}
			{gridLines(width, height).map((style, i) => (
				<div key={i} style={style} />
			))}

			{/* Bracket-O blanc, gros, en fond a droite : la parenthese « ouverte » que le don garde ouverte */}
			<img
				src={whiteMarkSrc}
				width={560}
				height={560}
				alt=""
				style={{ position: "absolute", top: -40, right: -150, opacity: 0.08 }}
			/>

			{/* Glow radial bleu, au-dessus de la trame */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 26% 52%, rgba(96,165,250,0.18), rgba(15,23,42,0) 62%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 32, left: 32, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 32, right: 32, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 32, left: 32, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 32, right: 32, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Header : wordmark + kicker */}
			<div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<img src={markSrc} width={44} height={44} alt="" style={{ marginRight: 16 }} />
					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 32, letterSpacing: -1, lineHeight: 1 }}>
						<span style={{ color: PAPER }}>Compta</span>
						<span style={{ color: BLUE_LIGHT }}>Open</span>
					</div>
				</div>
				<div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
					<div style={{ width: 30, height: 3, backgroundColor: BLUE_LIGHT, marginRight: 14 }} />
					<div style={{ display: "flex", fontFamily: "Geist Mono", fontWeight: 600, fontSize: 17, letterSpacing: 4, color: BLUE_LIGHT }}>
						SOUTENIR LE PROJET
					</div>
				</div>
			</div>

			{/* Titre + accroche, centres verticalement sur le reste */}
			<div style={{ display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "center", position: "relative" }}>
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 58, letterSpacing: -2, lineHeight: 1.05, color: PAPER, maxWidth: 760 }}>
					Gardons le savoir comptable libre.
				</div>
				<div style={{ display: "flex", marginTop: 22, fontFamily: "Sora", fontWeight: 500, fontSize: 24, lineHeight: 1.35, color: MUTED, maxWidth: 660 }}>
					Votre contribution finance l'hébergement, les contenus et les nouveaux outils gratuits.
				</div>
			</div>

			{/* Footer : payoff a gauche, URL a droite */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 500, fontSize: 21, color: PAPER }}>
					</div>
				</div>
				<div style={{ display: "flex", fontFamily: "Geist Mono", fontWeight: 400, fontSize: 18, letterSpacing: 1, color: MUTED }}>
					comptaopen.com
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Couverture don — Soutenir ComptaOpen", render } satisfies Template;
