import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, spacer, headline, standfirst, track, fill, logoWhiteSrc, LOGO_H } from "./theme";

// First of the three moves: where the writing happens.
function render(): ReactNode {
	return (
		<div style={frame}>
			<img src={logoWhiteSrc} height={LOGO_H} alt="calame" />
			<div style={spacer} />
			<div style={headline}>Write in the repo</div>
			<div style={standfirst}>Documentation sits next to the code, in Markdown, through the same reviews.</div>
			<div style={track}>
				<div style={fill(2)} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
