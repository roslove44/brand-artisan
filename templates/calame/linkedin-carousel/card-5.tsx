import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, spacer, headline, track, fill, logoWhiteSrc } from "./theme";

// The close. A document post carries no link per slide, so the last one signs
// instead of selling: the hierarchy flips and the logotype takes over, at scale,
// from the small mark of the other slides. The stroke reaches the full width in
// the accent, which is where the series was heading, so the logotype stays in
// light ink: one single orange per visual, and it belongs to the stroke.
function render(): ReactNode {
	return (
		<div style={frame}>
			<div style={spacer} />
			<div style={headline}>Write while you build</div>
			<img src={logoWhiteSrc} height={46} alt="calame" style={{ marginTop: 46 }} />
			<div style={track}>
				<div style={fill(5)} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
