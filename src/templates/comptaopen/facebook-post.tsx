import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// Post Facebook portrait 4:5 (resolution cible Meta).
const SIZE = { width: 1440, height: 1800 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md).
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400 (Open / accent sur fond sombre)
const PAPER = "#f8fafc"; // slate-50
const MUTED = "#cbd5e1"; // slate-300 (accroche)

const cornerBase: CSSProperties = { position: "absolute", width: 44, height: 44 };
const cornerStroke = "2px solid rgba(248,250,252,0.28)";

// Bracket-O (tuile bleue, bracket blanc) en data-URI (chemin eprouve, comme cover.tsx).
const markSvg = await readFile(asset("comptaopen/favicon/icon.svg"));
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				position: "relative",
				overflow: "hidden",
				padding: 120, // zone de securite
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(160deg, ${INK} 0%, #122a6b 60%, ${BLUE} 125%)`,
			}}
		>
			{/* Glow radial bleu */}
			<div
				style={{
					position: "absolute",
					top: 0, right: 0, bottom: 0, left: 0,
					backgroundImage: "radial-gradient(circle at 50% 38%, rgba(96,165,250,0.20), rgba(15,23,42,0) 60%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 64, left: 64, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 64, right: 64, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 64, left: 64, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 64, right: 64, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Header : wordmark */}
			<div style={{ display: "flex", alignItems: "center" }}>
				<img src={markSrc} width={84} height={84} alt="" style={{ marginRight: 26 }} />
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 58, letterSpacing: -1.5, lineHeight: 1 }}>
					<span style={{ color: PAPER }}>Compta</span>
					<span style={{ color: BLUE_LIGHT }}>Open</span>
				</div>
			</div>

			{/* Bloc central : titre + accroche */}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", flexDirection: "column", fontFamily: "Sora", fontWeight: 700, fontSize: 150, letterSpacing: -5, lineHeight: 1.02, color: PAPER }}>
					<span style={{ display: "flex" }}>La compta béninoise,</span>
					<span style={{ display: "flex", color: BLUE_LIGHT }}>enfin claire</span>
				</div>
				<div
					style={{
						display: "flex",
						marginTop: 44,
						fontFamily: "Sora",
						fontWeight: 500,
						fontSize: 54,
						color: MUTED,
						lineHeight: 1.35,
						maxWidth: 1040,
					}}
				>
					Articles, outils gratuits et entraide, au même endroit.
				</div>
			</div>

			{/* Footer : CTA */}
			<div style={{ display: "flex" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						paddingTop: 26,
						paddingBottom: 26,
						paddingLeft: 48,
						paddingRight: 48,
						borderRadius: 999,
						backgroundColor: PAPER,
						fontFamily: "Sora",
						fontWeight: 700,
						fontSize: 46,
						letterSpacing: -0.5,
						color: INK,
					}}
				>
					comptaopen.com
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Post Facebook ComptaOpen", render } satisfies Template;
