import type { CSSProperties } from "react";
import { readFile } from "node:fs/promises";
import { brand } from "brand-artisan";

// Pure TS, no JSX: discovery only loads .tsx, so this file is not mistaken for a
// slide. It holds what the five slides must share to read as one series.

export const SIZE = { width: 1080, height: 1350 }; // LinkedIn document post, 4:5
export const TOTAL = 5;
const PAD = 90; // safe area, the whole series breathes on the same margin
const COLUMN = SIZE.width - PAD * 2;

// Calame palette, dark background variant (brands/calame/brand.md). Dark ground
// on purpose: a 4:5 block of ink stops the scroll where paper would melt into
// the feed.
export const GROUND = "#1c1917"; // stone-900
export const LIGHT = "#fafaf9"; // stone-50, the light ink the guidelines require on dark
export const ACCENT = "#fb923c"; // orange-400, the lightened accent for dark grounds
// The guidelines give no muted tone for a dark ground, and #78716c is too weak
// on ink (banner.tsx says as much): the light ink, held back.
export const SOFT = "rgba(250, 250, 249, 0.72)";
const TRACK = "rgba(250, 250, 249, 0.16)";

export const LOGO_H = 30;

const uri = async (path: string) => `data:image/svg+xml;base64,${(await readFile(brand(path))).toString("base64")}`;
// The white variant on every slide: the single accent belongs to the stroke.
export const logoWhiteSrc = await uri("calame/logo/logo-mono-white.svg");

export const frame: CSSProperties = {
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	padding: PAD,
	backgroundColor: GROUND, // opaque, identical on every slide
};

// All the mass at the bottom: the top of the slide stays empty, like a sheet
// written from the foot up.
export const spacer: CSSProperties = { display: "flex", flex: 1 };

export const headline: CSSProperties = {
	display: "flex",
	maxWidth: 860,
	fontFamily: "Sora",
	fontWeight: 700,
	fontSize: 96,
	lineHeight: 1.05,
	letterSpacing: -2.5,
	color: LIGHT,
};

export const standfirst: CSSProperties = {
	display: "flex",
	marginTop: 28,
	maxWidth: 780,
	fontFamily: "Geist",
	fontWeight: 400,
	fontSize: 34, // a document post is read on a phone: below ~32 px it stops being legible
	lineHeight: 1.4,
	color: SOFT,
};

// The stroke that runs through the series: it advances one fifth per slide, and
// its travelled segment is the single accent moment allowed by the guidelines.
export const track: CSSProperties = {
	display: "flex",
	marginTop: 140, // pins the stroke to the bottom edge and lifts the text off it
	width: COLUMN,
	height: 2,
	backgroundColor: TRACK,
};

export const fill = (step: number): CSSProperties => ({
	display: "flex",
	width: (COLUMN * step) / TOTAL,
	height: 2,
	backgroundColor: ACCENT,
});
