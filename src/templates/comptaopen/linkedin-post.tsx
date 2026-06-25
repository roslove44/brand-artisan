import type { CSSProperties, ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// Post LinkedIn portrait 4:5 (convention ; LinkedIn ne documente que 1200x627).
const SIZE = { width: 1080, height: 1350 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md).
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400
const PAPER = "#f8fafc"; // slate-50
const MUTED = "#cbd5e1"; // slate-300

const cornerBase: CSSProperties = { position: "absolute", width: 40, height: 40 };
const cornerStroke = "2px solid rgba(248,250,252,0.28)";

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
				padding: 96, // zone de securite
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(160deg, ${INK} 0%, #122a6b 60%, ${BLUE} 130%)`,
			}}
		>
			{/* Glow radial bleu */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 50% 36%, rgba(96,165,250,0.20), rgba(15,23,42,0) 60%)",
				}}
			/>

			{/* Corner brackets */}
			<div style={{ ...cornerBase, top: 56, left: 56, borderTop: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, top: 56, right: 56, borderTop: cornerStroke, borderRight: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 56, left: 56, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
			<div style={{ ...cornerBase, bottom: 56, right: 56, borderBottom: cornerStroke, borderRight: cornerStroke }} />

			{/* Header : wordmark */}
			<div style={{ display: "flex", alignItems: "center" }}>
				<img src={markSrc} width={70} height={70} alt="" style={{ marginRight: 22 }} />
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 46, letterSpacing: -1, lineHeight: 1 }}>
					<span style={{ color: PAPER }}>Compta</span>
					<span style={{ color: BLUE_LIGHT }}>Open</span>
				</div>
			</div>

			{/* Bloc central : titre + accroche */}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", flexDirection: "column", fontFamily: "Sora", fontWeight: 700, fontSize: 112, letterSpacing: -4, lineHeight: 1.04, color: PAPER }}>
					<span style={{ display: "flex" }}>Pilotez votre</span>
					<span style={{ display: "flex", color: BLUE_LIGHT }}>fiscalité.</span>
					<span style={{ display: "flex" }}>Ne la subissez plus.</span>
				</div>
				<div
					style={{
						display: "flex",
						marginTop: 40,
						fontFamily: "Sora",
						fontWeight: 500,
						fontSize: 44,
						color: MUTED,
						lineHeight: 1.35,
						maxWidth: 820,
					}}
				>
					Factures, déclarations et échéances réunies dans un seul hub.
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
						paddingLeft: 50,
						paddingRight: 50,
						borderRadius: 999,
						backgroundColor: PAPER,
						fontFamily: "Sora",
						fontWeight: 700,
						fontSize: 44,
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

export default { size: SIZE, title: "Post LinkedIn ComptaOpen", render } satisfies Template;
