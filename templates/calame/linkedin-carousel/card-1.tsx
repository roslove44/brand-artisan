import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, spacer, headline, standfirst, track, fill, logoWhiteSrc, LOGO_H } from "./theme";

// The hook: the only slide seen before the swipe. It states the problem, and
// nothing else. The stroke has barely started.
function render(): ReactNode {
	return (
		<div style={frame}>
			<img src={logoWhiteSrc} height={LOGO_H} alt="calame" />
			<div style={spacer} />
			<div style={headline}>Docs run after the code</div>
			<div style={standfirst}>Always one commit behind.</div>
			<div style={track}>
				<div style={fill(1)} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
