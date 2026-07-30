---
name: facebook-page
description: Creates the visuals for a Facebook Page (profile photo = the brand, and cover photo) at Facebook's official dimensions. Use when the user wants a "Facebook profile photo", a "Facebook cover", a "Facebook page banner" or "the FB page logo" for a project. Produces one or two .tsx templates at the sizes Facebook imposes (profile 320x320, cover 851x315), aligned with the brand guidelines, rendered as PNGs through the project's engine. Requires a project with its brand.md in place.
---

# facebook-page: visuals for a Facebook Page

Goal: produce the **PNG assets** of a Facebook Page at the **official**
dimensions (source: Facebook help page 125379114252045), aligned with the
guidelines. Two possible visuals, independent of each other:

- **profile photo**: for an organization, this is the **brand** (320x320, cropped
  to a circle by Facebook);
- **cover photo**: the Page's tall banner (851x315).

This is a specialization of `new-template` with the Facebook constraints
hard-coded. Same conventions: the `Template` contract (from `brand-artisan`),
assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist before you
start:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which visual(s)?** Ask: profile, cover, or both. Don't guess if the user did
  not say.
- Default slugs: `facebook-profile` (320x320) and `facebook-cover` (851x315).
  Check that the target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette (hex), type, the **logo / favicon
  variants** and their rules depending on the background, and the **don'ts**.
- If the project already holds a `.tsx`, read it as a style reference and match
  its conventions (colors as constants, background effects kept local).

## 2. Facebook constraints (to respect in the template)

Facebook's **official** dimensions (do not deviate):

### Profile photo
- **Size 320x320** (square) for optimal quality. `scale: 2` is possible for a
  crisper render (Facebook resamples anyway).
- **Cropped to a circle** by Facebook: the visual is square but displays round.
  **Nothing important in the corners** (they get cut). Opaque **full-bleed**
  background, brand **centered**.
- It displays small (176 px on desktop, 196 px on mobile, 36 px on basic mobiles):
  for an organization, use the **mark alone / the favicon**, **not the full
  wordmark**, which would become illegible. Follow brand.md for the variant and
  the background.

### Cover photo
- **Size 851x315** (recommended, sRGB). Absolute minimum 400x150. Don't go below
  it.
- **Safe area**: the center. Facebook crops the **sides on mobile** (a 2.4:1
  format, so roughly 48 px trimmed from each side) and the **desktop** display is
  16:9. Keep text and logo inside, with a side margin of at least **~60 px**.
- **Dead zone bottom left (profile photo)**: on the page, the avatar covers the
  bottom left of the cover, so any text or logo falling there is **hidden**. Leave
  it clear: left margin **~2.5 %** of the width, box **~11 % W × ~23 % H** anchored
  bottom left. On 851×315: roughly **x 22→116, y 243→315**.
- **Opaque background**, never transparency.

### Format and weight (both)
- **PNG**: Facebook recommends PNG as soon as there is a logo or text (crisper
  than JPG), which is exactly what the engine outputs.
- **< 100 KB** for the cover (faster loading). Flat rendering is naturally light:
  favor the mark as an **SVG data-URI**, avoid embedding a large raster PNG, don't
  inflate with `scale`.

## 3. Write the template(s)

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines (invent nothing). Keep the code minimal (principle #2).

### Profile (skeleton)

```tsx
import { readFile } from "node:fs/promises";
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";

const SIZE = { width: 320, height: 320 }; // FB profile, cropped to a circle (scale:2 possible)

// <Project> guideline palette (from brands/<project>/brand.md).
const BRAND = "#......";

// A mark suited to a small round display (the favicon), not the wordmark.
const markSvg = await readFile(brand("<project>/favicon/icon.svg"));
const markSrc = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: BRAND, // opaque full-bleed background (the circle)
			}}
		>
			{/* mark centered, nothing in the corners (outside the circle) */}
			<img src={markSrc} width={188} height={188} alt="" />
		</div>
	);
}

export default { size: SIZE, title: "<Project> Facebook profile photo", render } satisfies Template;
```

### Cover (skeleton)

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark

const SIZE = { width: 851, height: 315 }; // FB cover (recommended)

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

// Safe area: ~60px side margin (2.4:1 mobile crop), bottom-left corner left clear
// (the profile photo covers it).
const SAFE_X = 60;

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				paddingTop: 40,
				paddingBottom: 40,
				paddingLeft: 200, // leaves the bottom-left corner to the profile photo
				paddingRight: SAFE_X,
				backgroundColor: INK, // opaque background
			}}
		>
			{/* logo + short standfirst, inside the safe area */}
		</div>
	);
}

export default { size: SIZE, title: "<Project> Facebook cover", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> follow the "missing font" appendix in `new-template`,
never silently.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check each PNG: **exact dimensions** (320x320 / 851x315), opaque background,
  **< 100 KB** for the cover.
- Profile: mentally check the **circular crop** (nothing important in the corners)
  and legibility at about 36 px.
- Cover: check that nothing important sits in the **bottom-left corner** or in the
  **~60 px side margins**.
- Preview: `npm run dev` then `/<project>/<slug>`.

**Success criterion**: PNGs at Facebook's exact dimensions, opaque, cover under
100 KB, brand (not wordmark) legible when small for the profile, safe area
respected for the cover, and using only colors and type from `brand.md`.

## Appendix: putting the visuals on the Page

Out of the repo's scope (BrandArtisan only makes the image). On the Facebook side:
- Profile photo: Page settings -> Profile photo; check the round rendering and the
  crop it proposes.
- Cover photo: add the banner; Facebook offers to reposition it; confirm that the
  text stays visible on mobile (the sides) and that the profile photo hides
  nothing important in the bottom left.
