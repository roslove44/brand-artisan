import type { ReactNode } from "react";
import type { Template } from "../../../template";
import { SIZE, frame, headerRow, wordmarkText, indexText, titleStyle, markSrc, INK, PAPER, MUTED, BLUE_LIGHT } from "./theme";

// Carte 4 — CTA. Dernier moment : conversion, l'appel a l'action le plus fort.
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
				<div style={indexText}>04 / 04</div>
			</div>

			<div style={titleStyle}>
				<span style={{ display: "flex" }}>Décrochez</span>
				<span style={{ display: "flex" }}>l'entretien.</span>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 500, fontSize: 38, lineHeight: 1.3, color: MUTED, marginBottom: 26, maxWidth: 780 }}>
					CV ATS Friendly, disponible dès maintenant sur
				</div>
				<div style={{ display: "flex", marginBottom: 40 }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							paddingTop: 28,
							paddingBottom: 28,
							paddingLeft: 52,
							paddingRight: 52,
							borderRadius: 999,
							backgroundColor: PAPER,
							fontFamily: "Sora",
							fontWeight: 700,
							fontSize: 44,
							letterSpacing: -0.5,
							color: INK,
						}}
					>
						comptaopen.com
					</div>
				</div>
				<div style={{ display: "flex", width: "100%", height: 8, borderRadius: 999, backgroundColor: "rgba(248,250,252,0.16)" }}>
					<div style={{ display: "flex", width: "100%", borderRadius: 999, backgroundColor: BLUE_LIGHT }} />
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
