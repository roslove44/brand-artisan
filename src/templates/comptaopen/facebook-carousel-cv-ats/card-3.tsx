import type { ReactNode } from "react";
import type { Template } from "../../../template";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, subStyle, markSrc, PAPER, BLUE_LIGHT } from "./theme";

// Carte 3 — solution. ComptaOpen resout le probleme pose en carte 2.
function render(): ReactNode {
	return (
		<div style={frame}>
			<div style={headerRow}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<img src={markSrc} width={56} height={56} alt="" style={{ marginRight: 18 }} />
					<div style={wordmarkText}>
						<span style={{ color: PAPER }}>Compta</span>
						<span style={{ color: BLUE_LIGHT }}>Open</span>
					</div>
				</div>
				<div style={indexText}>03 / 04</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={titleStyle}>
					<span style={{ display: "flex" }}>Un CV taillé</span>
					<span style={{ display: "flex", color: BLUE_LIGHT }}>pour passer.</span>
				</div>
				<div style={subStyle}>
					ComptaOpen structure votre CV pour les ATS : sections lisibles, bons mots-clés, format propre.
				</div>
			</div>

			<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
				<div style={{ display: "flex", width: "75%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
