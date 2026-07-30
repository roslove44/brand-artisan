---
name: linkedin-post
description: Creates a LinkedIn post image at LinkedIn's dimensions, in the chosen orientation. Use when the user wants a "LinkedIn image", a "LinkedIn post", a "LinkedIn visual" or a "LinkedIn publication" for a project. Asks for the orientation (portrait by default, square, landscape) and produces a .tsx template at the right ratio, aligned with the brand guidelines, rendered as a PNG through the project's engine. Requires a project with its brand.md in place.
---

# linkedin-post: LinkedIn post image

Goal: produce the **PNG asset** of a LinkedIn post image, at the chosen **ratio**,
aligned with the guidelines.

This is a specialization of `new-template` with the LinkedIn constraints
hard-coded. Same conventions: the `Template` contract (from `brand-artisan`),
assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`.

> **Status of the dimensions.** LinkedIn only officially documents one visual, at
> **1200×627 (1.91:1)**, for the **link** preview on Pages. For an image posted
> directly, LinkedIn publishes **no** dimensions: the **1080×1080 square** and the
> **1080×1350 portrait** are **conventions** (carried over from the advertising
> specs), not from the organic documentation.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which orientation?** Ask. **Default: portrait** (4:5, takes the most height
  in the feed). Otherwise square (1:1) or landscape (1.91:1).
- Default slug `linkedin-post` (or `linkedin-post-<orientation>` if there are
  several). Check that the target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** (don't invent figures or promises). If absent -> ask for the tone and
  the message rather than guessing.
- Ask for the **message**: short headline + standfirst (1 sentence). No paragraph.
- If the project already holds a `.tsx`, read it as a style reference.

## 2. LinkedIn constraints (to respect)

| Orientation | Size (px) | Ratio | Status |
|---|---|---|---|
| **Portrait** (default) | **1080x1350** | 4:5 | Convention (ads specs) |
| **Square** | **1080x1080** | 1:1 | Convention (ads specs) |
| **Landscape** | **1200x627** | 1.91:1 | Official LinkedIn (link preview) |

- **Format**: PNG or JPG, **opaque** background.
- **The post's text** (body, link) lives **outside the image**, in the
  publication: don't write everything into the visual. **One idea per card.**
- **Legible when small**: the LinkedIn feed displays narrow on mobile. Large
  headline, short standfirst, strong contrast, **safe area of about 80 px**.
- **LinkedIn tone**: a professional audience. Favor a standfirst carrying added
  value (an insight, a data point, a business benefit) over an aggressive pitch.

## 3. Write the template

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines. Pick `SIZE` according to the orientation. Skeleton:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark

// Pick according to the orientation:
const SIZE = { width: 1080, height: 1350 }; // Portrait 4:5 (default)
// const SIZE = { width: 1080, height: 1080 }; // Square 1:1
// const SIZE = { width: 1200, height: 627 };  // Landscape 1.91:1

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

export default { size: SIZE, title: "<Project> LinkedIn post", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> the "missing font" appendix in `new-template`, never
silently. Keep the code minimal.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check the PNG: **exact dimensions** for the orientation, opaque background,
  correct ratio (4:5 / 1:1 / 1.91:1).
- Preview: `npm run dev` then `/<project>/<slug>`; check legibility shrunk to the
  width of a mobile feed.

**Success criterion**: a PNG at the dimensions of the chosen orientation, opaque,
legible when small, professional in tone, and using only colors and type from
`brand.md`.
