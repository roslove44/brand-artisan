import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, subStyle, markSrc, PAPER, BLUE_LIGHT } from "./theme";

// Carte 2 : probleme. Le cout cache de la dispersion.
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
					<span style={{ display: "flex" }}>Le savoir fiscal</span>
					<span style={{ display: "flex" }}>est éparpillé.</span>
				</div>
				<div style={subStyle}>
					Une information fiable, locale et à jour reste difficile à trouver, et votre voix se perd dans la masse.
				</div>
			</div>

			<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
				<div style={{ display: "flex", width: "50%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
