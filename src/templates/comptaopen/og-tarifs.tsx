import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// OG standard : 1200x630 (ratio 1.91:1), pas de scale (inutile a cette taille pour de l'OG).
const SIZE = { width: 1200, height: 630 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md). Fond clair -> texte en encre.
const INK = "#0f172a"; // slate-900 (COMPTA + titre)
const BLUE = "#1d4ed8"; // blue-700 (Open / accent)
const SLATE_100 = "#f8fafc"; // slate-50 (haut du fond)
const SLATE_200 = "#eef2f7"; // slate-50/100 (bas du fond)
const MUTED = "#64748b"; // slate-500 (tagline)

const cornerBase: CSSProperties = { position: "absolute", width: 30, height: 30 };
const cornerStroke = "1.5px solid rgba(15,23,42,0.18)";

// Bracket-O (tuile bleue, bracket blanc) en data-URI (chemin eprouve, comme cover.tsx / next/og).
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
				justifyContent: "center",
				position: "relative",
				overflow: "hidden",
				padding: 80, // zone de securite OG
				backgroundColor: SLATE_100, // fond opaque
				backgroundImage: `linear-gradient(135deg, ${SLATE_100} 0%, ${SLATE_200} 100%)`,
			}}
		>
			{/* Glow radial bleu, tres leger */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 50% 42%, rgba(29,78,216,0.07), rgba(241,245,249,0) 60%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 44, left: 44, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 44, right: 44, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 44, left: 44, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 44, right: 44, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Contenu */}
			<div style={{ display: "flex", flexDirection: "column" }}>
				{/* Wordmark : bracket-O (tuile bleue) + ComptaOpen */}
				<div style={{ display: "flex", alignItems: "center", marginBottom: 44 }}>
					<img
						src={markSrc}
						width={60}
						height={60}
						alt=""
						style={{ marginRight: 20, boxShadow: "0 14px 36px -12px rgba(29,78,216,0.45)" }}
					/>
					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 40, letterSpacing: -1, lineHeight: 1 }}>
						<span style={{ color: INK }}>Compta</span>
						<span style={{ color: BLUE }}>Open</span>
					</div>
				</div>

				{/* Titre */}
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 104, letterSpacing: -3, lineHeight: 1, color: INK }}>
					Nos tarifs
				</div>

				{/* Tagline */}
				<div
					style={{
						display: "flex",
						marginTop: 28,
						fontFamily: "Sora",
						fontWeight: 500,
						fontSize: 36,
						color: MUTED,
						lineHeight: 1.3,
						maxWidth: 880,
					}}
				>
					Gratuit pour tous, avancé pour les pros.
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "OG tarifs ComptaOpen", render } satisfies Template;
