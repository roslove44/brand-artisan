---
name: x-post
description: Creates an image for an X / Twitter post (a tweet image) at X's ratios, in the chosen orientation. Use when the user wants an "X image", a "Twitter visual", a "tweet image" or an "X post" for a project. Asks for the orientation (16:9 landscape by default, square, portrait) and produces a .tsx template at the right ratio, aligned with the brand guidelines, rendered as a PNG through the project's engine. Requires a project with its brand.md in place.
---

# x-post: X / Twitter post image

Goal: produce the **PNG asset** of a tweet image, at the chosen **ratio**, aligned
with the guidelines.

This is a specialization of `new-template` with the X constraints hard-coded. Same
conventions: the `Template` contract, assets through `brand()`, fonts discovered
in `fonts/`, `export default ... satisfies Template`.

> **Status of the dimensions.** X documents **no dimensions** for organic tweet
> images; only the **weight (5 MB)** is official. The sizes below are
> **conventions** aligned with the ratios X lists for its advertising formats.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which orientation?** Ask. **Default: 16:9 landscape** (the classic format of
  the X feed). Otherwise square (1:1) or portrait (4:5).
- Default slug `x-post` (or `x-post-<orientation>` if there are several). Check
  that the target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** (don't invent figures or promises). If absent -> ask for the tone and
  the message rather than guessing.
- Ask for the **message**: short headline + standfirst (1 sentence). No paragraph.

## 2. X constraints (to respect)

| Orientation | Size (px) | Ratio | Status |
|---|---|---|---|
| **Landscape** (default) | **1600x900** | 16:9 | Convention (X ads ratio) |
| **Square** | **1080x1080** | 1:1 | Convention (X ads ratio) |
| **Portrait** | **1080x1350** | 4:5 | Convention (X ads ratio) |

- **Format**: PNG or JPG, **opaque** background, **≤ 5 MB** (the official limit
  for tweet images; trivial with flat rendering).
- The **tweet's text** lives outside the image, in the post: don't write
  everything into the visual. **One idea per image.**
- **Legible when small**: the X feed scrolls fast and narrow on mobile. Large
  headline, short standfirst, strong contrast, **safe area of about 80 px**.
- **X tone**: direct, punchy, concise. The feed rewards a sharp line.

## 3. Write the template

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines. Pick `SIZE` according to the orientation. Skeleton:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark

// Pick according to the orientation:
const SIZE = { width: 1600, height: 900 }; // Landscape 16:9 (default)
// const SIZE = { width: 1080, height: 1080 }; // Square 1:1
// const SIZE = { width: 1080, height: 1350 }; // Portrait 4:5

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

export default { size: SIZE, title: "<Project> X post", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> the "missing font" appendix in `new-template`, never
silently. Keep the code minimal.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check the PNG: **exact dimensions** for the orientation, opaque background,
  correct ratio (16:9 / 1:1 / 4:5).
- Preview: `npm run dev` then `/<project>/<slug>`; check legibility shrunk to the
  width of a mobile feed.

**Success criterion**: a PNG at the dimensions of the chosen orientation, opaque,
legible when small, punchy in tone, and using only colors and type from
`brand.md`.
