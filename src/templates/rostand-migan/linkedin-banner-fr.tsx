import type { ReactNode } from "react";
import type { Template } from "../../template";

// Banner de profil perso LinkedIn (FR) : 1584x396 (4:1). Compo : tout sombre,
// SANS fenetre (juste le texte du terminal), bloc cale full-right. Le bas-gauche
// reste vide et sombre -> la photo de profil (cercle ~x49-305, y214-396) s'y pose
// sans gener. padding-right = proportion 25/790 de la largeur (~50px).
const SIZE = { width: 1584, height: 396 };
const PAD_RIGHT = Math.round((1584 * 25) / 790); // ~50

const BLUE = "#60a5fa"; // accent — chemin du prompt, sortie
const GREEN = "#7ee787"; // valeur (produit)
const TEXT = "#e2e8f0"; // commande
const SOFT = "#cbd5e1"; // sortie
const DESC = "#94a3b8"; // description — slate-400, contraste AA meme sur le glow (>= 4.5)
const MUTED = "#64748b"; // separateurs ~ uniquement (decoratif, exempte WCAG)

const MONO = "Geist Mono";
const line = { display: "flex", fontFamily: MONO, fontWeight: 400 as const, fontSize: 28, lineHeight: 1, color: SOFT };

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
			{/* Glow bleu cote droit, derriere le texte */}
			<div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 82% 50%, rgba(37,99,235,0.34), rgba(6,9,17,0) 55%)" }} />

			{/* Texte du terminal, sans chrome */}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", fontFamily: MONO, fontWeight: 600, fontSize: 28, lineHeight: 1 }}>
					<span style={{ color: BLUE }}>rostand.dev</span>
					<span style={{ color: MUTED }}>&nbsp;~&nbsp;</span>
					<span style={{ color: GREEN }}>%&nbsp;</span>
					<span style={{ color: TEXT }}>whoami</span>
				</div>
				<div style={{ ...line, marginTop: 18 }}>
					<span style={{ color: BLUE }}>&gt;&nbsp;</span>
					Développeur Full Stack & Comptable
				</div>
				<div style={{ ...line, marginTop: 14 }}>
					<span style={{ color: BLUE }}>&gt;&nbsp;</span>
					<span>Je construis actuellement&nbsp;</span>
					<span style={{ color: GREEN }}>ComptaOpen</span>
				</div>
				<div style={{ ...line, marginTop: 14 }}>
					<span style={{ color: BLUE }}>&gt;&nbsp;</span>
					<span style={{ color: DESC }}>la compta en accès libre au Bénin</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", marginTop: 22, fontFamily: MONO, fontWeight: 600, fontSize: 28, lineHeight: 1 }}>
					<span style={{ color: BLUE }}>rostand.dev</span>
					<span style={{ color: MUTED }}>&nbsp;~&nbsp;</span>
					<span style={{ color: GREEN }}>%</span>
					<div style={{ display: "flex", width: 14, height: 26, marginLeft: 12, backgroundColor: BLUE }} />
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Banner LinkedIn Rostand Migan (FR)", render } satisfies Template;
