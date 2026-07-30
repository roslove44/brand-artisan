import type { ReactNode } from "react";
import { readFile } from "node:fs/promises";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 1200, height: 630 }; // OG standard, no scale

// Calame guideline palette (brands/calame/brand.md).
const INK = "#1c1917"; // stone-900
const MUTED = "#78716c"; // stone-500
const PAPER = "#fafaf9"; // stone-50

// Mark and logotype as data-URIs: proven path, and the OG stays light.
const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
const markSrc = await uri("calame/favicon/icon-mark.svg");
const logoSrc = await uri("calame/logo/logo.svg");

// The mark bleeds off the top right: you see only the gesture crossing through,
// not the object. It gives the diagonal without fighting the headline.
const MARK = 1000;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				position: "relative",
				overflow: "hidden",
				backgroundColor: PAPER, // opaque background, required by the platforms
			}}
		>
			<img src={markSrc} width={MARK} height={MARK} alt="" style={{ position: "absolute", right: -420, top: -140 }} />

			<div style={{ display: "flex", flexDirection: "column", paddingLeft: 88, width: 700 }}>
				<img src={logoSrc} height={38} alt="calame" style={{ marginBottom: 46 }} />

				<div style={{ display: "flex", fontFamily: "Sora", fontWeight: 700, fontSize: 70, lineHeight: 1.08, letterSpacing: -1.5, color: INK }}>
					Write while you build
				</div>

				<div style={{ display: "flex", marginTop: 28, fontFamily: "Geist", fontWeight: 400, fontSize: 26, lineHeight: 1.4, color: MUTED }}>
					One version, in the repo.
				</div>
			</div>
		</div>
	);
}

export default { size: SIZE, title: "Calame share preview", render } satisfies Template;
