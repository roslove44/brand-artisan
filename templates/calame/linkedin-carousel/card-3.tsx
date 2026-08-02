import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, spacer, headline, standfirst, track, fill, logoWhiteSrc, LOGO_H } from "./theme";

// The claimed differentiator, at the middle of the series: the drift is caught
// by the machine, not six months later.
function render(): ReactNode {
	return (
		<div style={frame}>
			<img src={logoWhiteSrc} height={LOGO_H} alt="calame" />
			<div style={spacer} />
			<div style={headline}>Proof by machine</div>
			<div style={standfirst}>Calame flags what changed in the code without changing in the docs.</div>
			<div style={track}>
				<div style={fill(3)} />
			</div>
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
