import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1080, height: 1080 }; // square, poster format

// Calame guideline palette (brands/calame/brand.md).
const INK = "#1c1917"; // stone-900
const MUTED = "#78716c"; // stone-500
const PAPER = "#fafaf9"; // stone-50

const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const logoSrc = await uri("calame/logo/logo.svg");

// Concept: the page. All the mass at the bottom, the emptiness at the top, like a
// text that starts at the foot of a still-blank sheet. No mark in the background
// here, the OG already plays that part: the composition comes from the scale
// contrast (96 against 30) and the tension between the block and the emptiness,
// nothing else. One single accent, in the logotype.
function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				padding: 96,
				backgroundColor: PAPER,
			}}
		>
			<img src={logoSrc} height={40} alt="calame" />

			<div style={{ display: "flex", flex: 1 }} />

			<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 96, lineHeight: 1.05, letterSpacing: -2.5, color: INK }}>
				Proof by machine
			</div>

			<div style={{ display: "flex", marginTop: 32, maxWidth: 760, fontFamily: "Geist", fontWeight: 400, fontSize: 30, lineHeight: 1.4, color: MUTED }}>
				Calame flags what changed in the code without changing in the docs.
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Calame square card", render } satisfies Template;
