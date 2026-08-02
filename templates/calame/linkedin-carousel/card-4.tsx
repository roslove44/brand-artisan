import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, spacer, headline, standfirst, track, fill, logoWhiteSrc, LOGO_H } from "./theme";

// Last of the three moves: nothing to maintain between writing and publishing.
function render(): ReactNode {
	return (
		<div style={frame}>
			<img src={logoWhiteSrc} height={LOGO_H} alt="calame" />
			<div style={spacer} />
			<div style={headline}>Publish with no step</div>
			<div style={standfirst}>The published version is the default branch. No chain to keep alive.</div>
			<div style={track}>
				<div style={fill(4)} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
