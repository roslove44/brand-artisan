import type { ReactNode } from "react";
import type { Template } from "../../../src/template";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, subStyle, markSrc, PAPER, BLUE_LIGHT } from "./theme";

// Carte 2 : probleme. Fait avancer le recit : pourquoi un CV se fait recaler.
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
				<div style={indexText}>02 / 04</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={titleStyle}>
					<span style={{ display: "flex" }}>Avant l'humain,</span>
					<span style={{ display: "flex" }}>le filtre ATS.</span>
				</div>
				<div style={subStyle}>
					Les logiciels ATS trient les CV par mots-clés et format. Un CV mal structuré est écarté sans être lu.
				</div>
			</div>

			<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
				<div style={{ display: "flex", width: "50%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
