import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

// Post X paysage 16:9 (convention ; X ne documente pas les dims des images de tweet).
const SIZE = { width: 1600, height: 900 };

// Palette charte ComptaOpen (brands/comptaopen/brand.md).
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400
const PAPER = "#f8fafc"; // slate-50
const MUTED = "#cbd5e1"; // slate-300

const cornerBase: CSSProperties = { position: "absolute", width: 40, height: 40 };
const cornerStroke = "2px solid rgba(248,250,252,0.28)";

const markSvg = await readFile(brand("comptaopen/favicon/icon.svg"));
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
				padding: 90, // zone de securite
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(150deg, ${INK} 0%, #122a6b 58%, ${BLUE} 125%)`,
			}}
		>
			{/* Glow radial bleu */}
			<div
				style={{
					position: "absolute",
					top: 0, right: 0, bottom: 0, left: 0,
					backgroundImage: "radial-gradient(circle at 38% 45%, rgba(96,165,250,0.20), rgba(15,23,42,0) 62%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 52, left: 52, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 52, right: 52, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 52, left: 52, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 52, right: 52, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Header : wordmark + badge lancement */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<img src={markSrc} width={66} height={66} alt="" style={{ marginRight: 20 }} />
					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 42, letterSpacing: -1, lineHeight: 1 }}>
						<span style={{ color: PAPER }}>Compta</span>
						<span style={{ color: BLUE_LIGHT }}>Open</span>
					</div>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						paddingTop: 12,
						paddingBottom: 12,
						paddingLeft: 24,
						paddingRight: 24,
						borderRadius: 999,
						border: "1.5px solid rgba(96,165,250,0.55)",
						fontFamily: "Sora",
						fontWeight: 700,
						fontSize: 26,
						letterSpacing: 4,
						color: BLUE_LIGHT,
					}}
				>
					LANCEMENT
				</div>
			</div>

			{/* Bloc central : titre + accroche */}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", flexDirection: "column", fontFamily: "Sora", fontWeight: 700, fontSize: 118, letterSpacing: -4, lineHeight: 1.03, color: PAPER }}>
					<span style={{ display: "flex" }}>Le savoir comptable</span>
					<span style={{ display: "flex", color: BLUE_LIGHT }}>sort de l'ombre.</span>
				</div>
				<div
					style={{
						display: "flex",
						marginTop: 34,
						fontFamily: "Sora",
						fontWeight: 500,
						fontSize: 40,
						color: MUTED,
						lineHeight: 1.35,
						maxWidth: 1180,
					}}
				>
					ComptaOpen est en ligne : articles, outils gratuits et communauté, pour tous.
				</div>
			</div>

			{/* Footer : URL */}
			<div style={{ display: "flex" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						paddingTop: 22,
						paddingBottom: 22,
						paddingLeft: 44,
						paddingRight: 44,
						borderRadius: 999,
						backgroundColor: PAPER,
						fontFamily: "Sora",
						fontWeight: 700,
						fontSize: 40,
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

export default { size: SIZE, title: "Post X lancement ComptaOpen", render } satisfies Template;
