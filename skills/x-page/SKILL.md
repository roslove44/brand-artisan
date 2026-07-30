---
name: x-page
description: Creates the X / Twitter profile visuals (profile photo and header / banner) at X's official dimensions. Use when the user wants an "X/Twitter profile photo", a "Twitter header", an "X banner" or "the X avatar" for a project. Produces one or two .tsx templates at the sizes X imposes (profile 400x400, header 1500x500), aligned with the brand guidelines, rendered as PNGs through the project's engine. Requires a project with its brand.md in place.
---

# x-page: X / Twitter profile visuals

Goal: produce the **PNG assets** of an X (Twitter) profile at the **official**
dimensions (source: X help, "customize your profile"), aligned with the
guidelines. Two possible visuals, independent of each other:

- **profile photo**: the brand, 400×400, cropped to a circle;
- **header / banner**: 1500×500 (3:1).

This is a specialization of `new-template` with the X constraints hard-coded. Same
conventions: the `Template` contract, assets through `brand()`, fonts discovered
in `fonts/`, `export default ... satisfies Template`.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which visual(s)?** Ask: profile, header, or both.
- Default slugs: `x-profile` (400×400), `x-header` (1500×500). Check that the
  target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette, type, the **logo / favicon variants**
  and their rules depending on the background, and the **don'ts**.
- If the project already holds a `.tsx`, read it as a style reference.

## 2. X constraints (to respect)

| Visual | Size | Ratio | Notes |
|---|---|---|---|
| Profile photo | **400×400** | 1:1 | cropped to a **circle** |
| Header / banner | **1500×500** | 3:1 | cropped on mobile (the edges) |

- **Format**: PNG or JPG. **Opaque** background. X documents no maximum weight for
  these two visuals (the official 5 MB applies to tweet images).
- **Profile**: square, **brand centered**, nothing important in the corners
  (displayed as a circle). 400×400 is the official size; `scale: 2` is advised for
  crispness. For an organization, prefer the **mark alone / the favicon** over the
  wordmark, which is illegible when small. Follow brand.md.
- **Header (1500×500)**: on mobile, X **crops the sides**, so keep the important
  content centered, with comfortable side margins.
- **Dead zone bottom left (profile photo)**: on the profile page, the avatar covers
  the bottom left of the header, so any text or logo falling there is **hidden**.
  Leave it clear: left margin **~2.5 %** of the width, box **~23 % W × ~35 % H**
  anchored bottom left. On 1500×500: roughly **x 38→388, y 325→500**.

## 3. Write the template(s)

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines (invent nothing). Pick `SIZE` according to the visual:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark

// Pick according to the visual:
const SIZE = { width: 400, height: 400 };   // Profile 1:1 (scale:2 advised)
// const SIZE = { width: 1500, height: 500 };  // Header 3:1

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* brand centered (profile) OR lockup + standfirst centered (header) */}
		</div>
	);
}

export default { size: SIZE, title: "<Human title>", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> the "missing font" appendix in `new-template`, never
silently.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check each PNG: **exact dimensions** (400×400 / 1500×500), opaque background.
- Profile: check the **circular crop** (nothing in the corners).
- Header: nothing important in the **bottom-left corner** (profile photo) nor too
  close to the **side edges** (mobile crop).
- Preview: `npm run dev` then `/<project>/<slug>`.

**Success criterion**: PNGs at X's exact dimensions, opaque, brand centered and
legible for the profile, safe area respected for the header, and using only colors
and type from `brand.md`.
