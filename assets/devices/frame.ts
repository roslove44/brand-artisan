import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { root } from "brand-artisan";
import { devices, type DeviceSlug } from "./catalog";

// Loads a device frame, ready to drop into a template.

export type Frame = {
	/** The frame as a data URI: Satori has no filesystem access. */
	src: string;
	width: number;
	height: number;
	/** Screen area, already scaled to the requested width. */
	screen: { x: number; y: number; width: number; height: number; radius: number };
	name: string;
};

/**
 * Scales a device to `width`, screen coordinates included.
 *
 * The frame is cut out on the outside, but its screen is BLACK AND OPAQUE:
 * draw the frame first, then the artwork ON TOP at `screen`, with
 * `borderRadius: screen.radius`. Anything placed underneath stays hidden, and
 * the notch ends up covered, as it would on a real screenshot.
 *
 * `radius` falls back to 0 when the catalog holds none: round by eye instead of
 * trusting it. See NOTICE.md for a full example.
 */
export async function frame(slug: DeviceSlug, width: number): Promise<Frame> {
	const d = devices[slug];
	const k = width / d.image.width;
	const png = await readFile(fileURLToPath(root(`assets/devices/${slug}/device.png`)));
	return {
		src: `data:image/png;base64,${png.toString("base64")}`,
		width: Math.round(width),
		height: Math.round(d.image.height * k),
		screen: {
			x: Math.round(d.screen.x * k),
			y: Math.round(d.screen.y * k),
			width: Math.round(d.screen.width * k),
			height: Math.round(d.screen.height * k),
			radius: Math.round((d.screen.radius ?? 0) * k),
		},
		name: d.name,
	};
}

export { devices, type DeviceSlug };
