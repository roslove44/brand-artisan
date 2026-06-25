import type { ReactNode } from "react";
import type { Template } from "../../../template";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, subStyle, markSrc, PAPER, BLUE_LIGHT } from "./theme";

// Carte 3 — solution. ComptaOpen centralise ce que la carte 2 disperse.
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
					<span style={{ display: "flex" }}>Un seul hub,</span>
					<span style={{ display: "flex", color: BLUE_LIGHT }}>tout au clair.</span>
				</div>
				<div style={subStyle}>
					ComptaOpen réunit votre comptabilité et votre fiscalité au même endroit, à jour et accessibles.
				</div>
			</div>

			<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
				<div style={{ display: "flex", width: "75%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
