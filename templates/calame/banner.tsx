import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1500, height: 500 }; // 3:1, generic header format

// Calame palette, dark background variant (brands/calame/brand.md).
const GROUND = "#1c1917"; // stone-900
const LIGHT = "#fafaf9"; // stone-50, the light ink the guidelines require on dark
const MUTED = "#78716c"; // stone-500, too weak for text here, kept for the rule

const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const logoSrc = await uri("calame/logo/logo-dark.svg"); // dark background -> lightened variant

// Concept: a banner carries the identity, not a message. Hierarchy inverted from
// the OG, so the logotype is the subject and the sentence whispers. The rule runs
// off to the right, "in the direction of writing", occupying the emptiness
// without adding a second accent.
function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				padding: "0 120px",
				backgroundColor: GROUND,
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
				<img src={logoSrc} height={96} alt="calame" />

				<div style={{ display: "flex", alignItems: "center", marginTop: 40 }}>
					<div style={{ display: "flex", fontFamily: "Geist", fontWeight: 400, fontSize: 30, color: LIGHT }}>The docs follow the code</div>
					<div style={{ display: "flex", flex: 1, height: 1, marginLeft: 32, backgroundColor: MUTED }} />
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Calame banner", render } satisfies Template;
