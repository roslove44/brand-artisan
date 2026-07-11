import type { ReactNode } from "react";
import type { Template } from "../../template";

// Banner de profil perso LinkedIn (FR), variante v3 : 1584x396 (4:1).
// Composition dérivée d'une référence fournie (import-reference, flux B) :
// le nom en monumental **outline** qui déborde des bords (le nom est le décor),
// un seul glow bleu qui monte du haut-gauche, bloc focal à droite du centre
// (chip stack + titre en deux lignes), signature wordmark en haut à gauche,
// barre d'accent au bord droit. Habillage 100 % charte (brand.md, mode sombre).
// Bas-gauche laissé vide : la photo de profil (cercle ~x49-305, y214-396) s'y pose.
const SIZE = { width: 1584, height: 396, scale: 2 };
const PAD_RIGHT = Math.round((1584 * 55) / 790); // ~110, marge anti-crop mobile

// Palette charte Rostand Migan, contreparties mode sombre (brand.md §1).
const INK = "#f8fafc"; // encre claire : titre, focal (slate-50)
const ACCENT = "#60a5fa"; // accent clair : .dev, outline, glow (blue-400)
const ACCENT_DEEP = "#2563eb"; // accent plein : chip, barre (blue-600)
const NIGHT = "#060911"; // fond nuit (repris du banner v2)
const GEIST = "Geist";
const GEIST_MONO = "Geist Mono";

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				position: "relative",
				overflow: "hidden",
				backgroundColor: NIGHT,
			}}
		>
			{/* Nom monumental en outline, débordant des deux bords : le nom est le décor.
			    Sous les glows, pour que la lumière baigne les lettres. */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: GEIST,
					fontWeight: 700,
					fontSize: 216,
					letterSpacing: -6,
					lineHeight: 1,
					whiteSpace: "nowrap",
					// Fill couleur du fond : Satori ne rend pas les glyphes à fill transparent.
					color: NIGHT,
					WebkitTextStrokeWidth: "2px",
					WebkitTextStrokeColor: "rgba(96,165,250,0.34)",
				}}
			>
				ROSTAND MIGAN
			</div>

			{/* Glow bleu : une seule source de lumière, du haut-gauche vers le centre */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundImage: "radial-gradient(circle at 26% -12%, rgba(37,99,235,0.50), rgba(6,9,17,0) 52%)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundImage: "radial-gradient(circle at 97% 110%, rgba(37,99,235,0.22), rgba(6,9,17,0) 38%)",
				}}
			/>

			{/* Signature : le wordmark rostand.dev, haut-gauche (hors zone avatar) */}
			<div
				style={{
					position: "absolute",
					top: 34,
					left: 48,
					display: "flex",
					fontFamily: GEIST,
					fontWeight: 700,
					fontSize: 28,
					lineHeight: 1,
					letterSpacing: -0.5,
				}}
			>
				<span style={{ color: INK }}>rostand</span>
				<span style={{ color: ACCENT }}>.dev</span>
			</div>

			{/* Bloc focal : chip stack + titre, à droite du centre (avatar à gauche) */}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					right: PAD_RIGHT,
					width: 760,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						backgroundColor: ACCENT_DEEP,
						color: INK,
						fontFamily: GEIST_MONO,
						fontWeight: 600,
						fontSize: 21,
						letterSpacing: 3,
						padding: "9px 22px",
					}}
				>
					SYMFONY · NEXT.JS · GO
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						marginTop: 20,
						fontFamily: GEIST,
						fontWeight: 700,
						fontSize: 84,
						lineHeight: 1.02,
						letterSpacing: -2,
						color: INK,
						textAlign: "center",
					}}
				>
					<span style={{ display: "flex" }}>DÉVELOPPEUR</span>
					<span style={{ display: "flex" }}>&amp; FONDATEUR</span>
				</div>
			</div>

			{/* Barre d'accent au bord droit, seul autre moment de bleu plein */}
			<div
				style={{
					position: "absolute",
					right: 0,
					top: 74,
					bottom: 74,
					width: 12,
					backgroundColor: ACCENT_DEEP,
				}}
			/>
		</div>
	);
}

export default { size: SIZE, title: "Banner LinkedIn Rostand Migan (FR) v3", render } satisfies Template;
