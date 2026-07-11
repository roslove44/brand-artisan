import type { ReactNode } from "react";
import type { Template } from "../../template";

// Banner de profil perso LinkedIn (FR), variante v2 : 1584x396 (4:1).
// Concept : le nom "ROSTAND" en monumental, grave en fond (bas opacite),
// debordant des deux bords -> le nom est le decor. Un seul point focal : le
// titre en blanc, bloc cale a droite. Bas-gauche laisse sombre et vide -> la
// photo de profil (cercle ~x49-305, y214-396) s'y pose sans gener.
// padding-right ~110px : marge anti-crop mobile pour le bloc cale a droite.
const SIZE = { width: 1584, height: 396, scale: 2 };
const PAD_RIGHT = Math.round((1584 * 55) / 790); // ~110

// Palette charte Rostand Migan, contreparties mode sombre (brand.md §1).
const INK = "#f8fafc"; // encre claire — titre, focal (slate-50)
const ACCENT = "#60a5fa"; // accent unique — .dev, glow, motif (blue-400)
const GEIST = "Geist";

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				position: "relative",
				overflow: "hidden",
				backgroundColor: "#060911",
				backgroundImage: "linear-gradient(135deg, #070b15 0%, #0a1326 58%, #0a1b3a 100%)",
				paddingRight: PAD_RIGHT,
			}}
		>
			{/* Nom monumental grave en fond, deborde des deux bords (nom = decor) */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: GEIST,
					fontWeight: 700,
					fontSize: 320,
					letterSpacing: -8,
					lineHeight: 1,
					whiteSpace: "nowrap",
					color: "rgba(96,165,250,0.10)",
				}}
			>
				ROSTAND
			</div>

			{/* Glow bleu cote droit, lumiere dirigee derriere le bloc */}
			<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 82% 50%, rgba(37,99,235,0.34), rgba(6,9,17,0) 55%)" }} />

			{/* Bloc focal, cale a droite */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
				{/* Signature : le wordmark rostand.dev */}
				<div style={{ display: "flex", fontFamily: GEIST, fontWeight: 700, fontSize: 30, lineHeight: 1, letterSpacing: -0.5 }}>
					<span style={{ color: INK }}>rostand</span>
					<span style={{ color: ACCENT }}>.dev</span>
				</div>

				{/* Titre — point focal, contraste de valeur (blanc sur sombre) */}
				<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 26, fontFamily: GEIST, fontWeight: 700, fontSize: 58, lineHeight: 1.02, letterSpacing: -1.5, color: INK }}>
					<span style={{ display: "flex" }}>Développeur Full Stack</span>
					<span style={{ display: "flex" }}>&amp; Comptable</span>
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Banner LinkedIn Rostand Migan (FR) — v2", render } satisfies Template;
