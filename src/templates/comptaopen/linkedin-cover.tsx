import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import type { Template } from "../../template";
import { asset } from "../../assets";

// Cover de Page entreprise LinkedIn : 4200x700 (6:1). LinkedIn peut rogner
// horizontalement/verticalement selon l'ecran -> contenu centre, marges larges.
const SIZE = { width: 4200, height: 700 };

// Palette charte ComptaOpen (assets/comptaopen/brand.md).
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400
const PAPER = "#f8fafc"; // slate-50
const MUTED = "#cbd5e1"; // slate-300

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
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				overflow: "hidden",
				backgroundColor: INK, // fond opaque
				backgroundImage: `linear-gradient(120deg, ${INK} 0%, #122a6b 55%, ${BLUE} 130%)`,
			}}
		>
			{/* Glow radial bleu */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.18), rgba(15,23,42,0) 60%)",
				}}
			/>

			{/* Lockup centre (zone sure : LinkedIn peut rogner les bords) */}
			<div style={{ display: "flex", alignItems: "center" }}>
				<img src={markSrc} width={120} height={120} alt="" style={{ marginRight: 40 }} />
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 118, letterSpacing: -3, lineHeight: 1 }}>
					<span style={{ color: PAPER }}>Compta</span>
					<span style={{ color: BLUE_LIGHT }}>Open</span>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					marginTop: 30,
					fontFamily: "Sora",
					fontWeight: 500,
					fontSize: 44,
					color: MUTED,
					letterSpacing: 0.5,
				}}
			>
				Le hub comptable et fiscal des professionnels au Bénin
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Cover LinkedIn ComptaOpen", render } satisfies Template;
