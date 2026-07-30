---
name: facebook-post
description: Creates a Facebook post image (feed post, poster, simple ad visual) at Meta's dimensions, in the chosen orientation. Use when the user wants a "Facebook image", a "Facebook post", a "poster", an "ad visual" or a "publication" for a project. Asks for the orientation (portrait by default, square, landscape) and produces a .tsx template at the right ratio, aligned with the brand guidelines, rendered as a PNG through the project's engine. Requires a project with its brand.md in place.
---

# facebook-post: Facebook post image

Goal: produce the **PNG asset** of a Facebook post image (a feed publication, a
poster, a simple ad visual), at the chosen **Meta ratio**, aligned with the
guidelines.

This is a specialization of `new-template` with the Facebook constraints
hard-coded. Same conventions: the `Template` contract (from `brand-artisan`),
assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`.

> **Status of the dimensions.** Meta publishes **no** dimension spec for *organic
> posts*: the figures below come from the **Ads Manager** specs (Ads Guide +
> placement pages). Since the feed's rendering engine is the same, that is the
> best available reference. The **ratios** are official Meta; for **landscape**,
> the pixel figures are a convention (Meta documents no resolution for that
> ratio).

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which orientation?** Ask. **Default: portrait** (4:5, the best performer in
  the feed). Otherwise square (1:1) or landscape (1.91:1).
- Default slug `facebook-post` (or `facebook-post-<orientation>` if there are
  several variants). Check that the target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette (hex), type, logo variants depending
  on the background, and the **don'ts**.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** (don't invent figures or promises). If absent -> ask for the tone and
  the message rather than guessing.
- Ask for the **message**: short headline + standfirst (1 sentence). No paragraph.
- If the project already holds a `.tsx`, read it as a style reference.

## 2. Facebook constraints (to respect in the template)

### Dimensions per orientation

| Orientation | Size (px) | Ratio | Status |
|---|---|---|---|
| **Portrait** (default) | **1440x1800** | 4:5 | Meta target resolution (min 1080x1350) |
| **Square** | **1080x1080** | 1:1 | Official Meta minimum |
| **Landscape** | **1080x566** | 1.91:1 | Official ratio; convention pixels (alt 1200x628) |

- **Don't use 16:9** in landscape: it is **not** supported in the Facebook Feed.
  The supported landscape is **1.91:1**.
- Official minimum width: **600 px**. Don't go below it.
- `scale: 2` is possible for a crisper render; unnecessary at the sizes above.

### Layout

- **Opaque background**, never transparency.
- **Safe area** of roughly 80 px of margin: keep the logo and the text towards the
  center, since the feed may crop slightly and round the corners depending on
  context.
- **Legible when small**: the feed often displays narrow on mobile. Large headline,
  short standfirst, strong contrast.
- Meta's old **20 % text rule** is **gone**: there is no text limit, but keep the
  poster airy and legible.

### Format and weight

- **PNG** (or JPG): the engine outputs PNG, crisp for text and logos.
- Meta's maximum weight: **30 MB**. Flat rendering is nowhere near that limit,
  so there is nothing particular to optimize.

## 3. Write the template

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines (invent nothing). Pick `SIZE` according to the orientation. Skeleton:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark (SVG/PNG)

// Pick according to the orientation:
const SIZE = { width: 1440, height: 1800 }; // Portrait 4:5 (default)
// const SIZE = { width: 1080, height: 1080 }; // Square 1:1
// const SIZE = { width: 1080, height: 566 };  // Landscape 1.91:1

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

function render(): ReactNode {
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: 80, // safe area
				backgroundColor: INK, // opaque background
			}}
		>
			{/* logo + large headline + short standfirst, strong contrast */}
		</div>
	);
}

export default { size: SIZE, title: "<Project> Facebook post", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> follow the "missing font" appendix in `new-template`,
never silently. Keep the code minimal (principle #2).

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check the PNG: **exact dimensions** for the orientation, opaque background,
  correct ratio (4:5 / 1:1 / 1.91:1).
- Preview: `npm run dev` then `/<project>/<slug>`; check legibility shrunk to the
  width of a mobile feed.

**Success criterion**: a PNG at Meta's dimensions for the chosen orientation,
opaque, legible when small, and using only colors and type from `brand.md`.
