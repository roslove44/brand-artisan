import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties } from "react";

// Couverture sociale panoramique ComptaOpen — visible sur /test-image.
// 1500x500 (3:1) = standard le plus propre cross-plateforme (header X, bannieres
// LinkedIn/Facebook recadrent autour d'un centre safe). Pour coller au format
// fourni au depart, passer SIZE a { width: 1245, height: 527 }.
const SIZE = { width: 1500, height: 500 };

// Palette charte.
const INK = "#0f172a"; // slate-900
const BLUE = "#1d4ed8"; // blue-700
const BLUE_LIGHT = "#60a5fa"; // blue-400 (Open sur fond sombre)
const PAPER = "#f8fafc"; // slate-50 (Compta sur fond sombre)
const MUTED = "#cbd5e1"; // slate-300 (tagline)

// --- Trame papier registre : grille fine ton sur ton + 2 reglures de colonne. ---
const GRID_STEP = 58;
const LINE = "rgba(248,250,252,0.055)";
const RULE = "rgba(96,165,250,0.14)"; // reglures de colonne, legerement bleutees
// Indices de colonnes (multiples de GRID_STEP) mis en valeur comme reglures de
// registre : ce sont des lignes de la trame, donc alignees par construction.
const RULE_COLUMNS = new Set([6, 20]);

function gridLines(): CSSProperties[] {
	const lines: CSSProperties[] = [];
	let i = 1;
	for (let x = GRID_STEP; x < SIZE.width; x += GRID_STEP, i++) {
		const isRule = RULE_COLUMNS.has(i);
		lines.push({ position: "absolute", top: 0, bottom: 0, left: x, width: isRule ? 1.5 : 1, backgroundColor: isRule ? RULE : LINE });
	}
	for (let y = GRID_STEP; y < SIZE.height; y += GRID_STEP) {
		lines.push({ position: "absolute", left: 0, right: 0, top: y, height: 1, backgroundColor: LINE });
	}
	return lines;
}

const cornerBase: CSSProperties = { position: "absolute", width: 28, height: 28 };
const cornerStroke = "1.5px solid rgba(248,250,252,0.28)";

export async function GET() {
	const [sora700, sora500, markSvg] = await Promise.all([
		readFile(join(process.cwd(), "src/assets/fonts/Sora-700.ttf")),
		readFile(join(process.cwd(), "src/assets/fonts/Sora-500.ttf")),
		readFile(join(process.cwd(), "src/app/icon.svg")),
	]);
	const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					overflow: "hidden",
					backgroundColor: INK,
					backgroundImage: `linear-gradient(135deg, ${INK} 0%, #122a6b 55%, ${BLUE} 120%)`,
				}}
			>
				{/* Trame registre (les reglures de colonne sont des lignes de la trame) */}
				{gridLines().map((style, i) => (
					<div key={i} style={style} />
				))}

				{/* Glow radial bleu (continuite avec l'OG), au-dessus de la trame */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"radial-gradient(circle at 50% 46%, rgba(96,165,250,0.22), rgba(15,23,42,0) 58%)",
					}}
				/>

				{/* Corner brackets (repris de l'OG) */}
				<div style={{ ...cornerBase, top: 36, left: 36, borderTop: cornerStroke, borderLeft: cornerStroke }} />
				<div style={{ ...cornerBase, top: 36, right: 36, borderTop: cornerStroke, borderRight: cornerStroke }} />
				<div style={{ ...cornerBase, bottom: 36, left: 36, borderBottom: cornerStroke, borderLeft: cornerStroke }} />
				<div style={{ ...cornerBase, bottom: 36, right: 36, borderBottom: cornerStroke, borderRight: cornerStroke }} />

				{/* Contenu centre */}
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10 }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 116,
							height: 116,
							borderRadius: 28,
							backgroundColor: "#ffffff",
							boxShadow: "0 24px 60px -16px rgba(96,165,250,0.55), 0 8px 28px rgba(15,23,42,0.45)",
							marginBottom: 34,
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={markSrc} width={92} height={92} alt="" />
					</div>

					<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 84, letterSpacing: -2, lineHeight: 1 }}>
						<span style={{ color: PAPER }}>Compta</span>
						<span style={{ color: BLUE_LIGHT }}>Open</span>
					</div>

					<div
						style={{
							display: "flex",
							marginTop: 22,
							fontFamily: "Sora",
							fontWeight: 500,
							fontSize: 27,
							color: MUTED,
							lineHeight: 1.3,
							textAlign: "center",
						}}
					>
						Le hub comptable et fiscal des professionnels au Bénin
					</div>
				</div>
			</div>
		),
		{
			...SIZE,
			fonts: [
				{ name: "Sora", data: sora700, style: "normal", weight: 700 },
				{ name: "Sora", data: sora500, style: "normal", weight: 500 },
			],
		},
	);
}
