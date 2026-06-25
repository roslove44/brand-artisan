import type { ReactNode } from "react";
import type { Template } from "../../../template";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, markSrc, PAPER, BLUE_LIGHT } from "./theme";

// Carte 1 — hook. Seule visible avant le swipe : un seul message, fort contraste.
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
				<div style={indexText}>01 / 04</div>
			</div>

			<div style={titleStyle}>
				<span style={{ display: "flex" }}>Et si un</span>
				<span style={{ display: "flex", color: BLUE_LIGHT }}>robot</span>
				<span style={{ display: "flex" }}>recalait votre CV ?</span>
			</div>

			<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
				<div style={{ display: "flex", width: "25%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
