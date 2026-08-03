---
name: x-carousel
description: Creates the cards of an X / Twitter carousel ad at X's dimensions, as a series of coherent visuals. Use when the user wants an "X carousel", a "Twitter carousel ad" or "several cards that swipe" for an X project. Produces N .tsx templates (one card = one PNG) in a dedicated subfolder, sharing a common theme, aligned with brand.md. Requires a project with its brand.md in place.
---

# x-carousel: cards for an X / Twitter carousel ad

Goal: produce the **PNG assets of the N cards** of an X **carousel ad** (X Ads),
at the chosen ratio, coherent with each other and aligned with the guidelines. A
carousel is not N independent images: it is a **series** that tells something.
Coherence across cards is the heart of the deliverable.

This is a specialization of `new-template`. Same conventions: the `Template`
contract, assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`. Same model as `facebook-carousel`.

> **Carousel ad.** X has no "organic carousel": a tweet only carries **1 to 4
> images** displayed as a mosaic (undocumented). What this skill produces are the
> **cards of an advertising carousel** (X Ads).

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it (ask, don't guess)

- **Name of the carousel**: a kebab-case slug, default `x-carousel`. It is the
  **subfolder** `templates/<project>/<name>/`. Check that it does not exist.
- **Ratio**: **1:1 (1080×1080)** or **1.91:1 (1200×628)**. **The same for every
  card** (mandatory).
- **Narrative mechanic** (see §3): a story, one card per product, a top N, a
  tutorial, before/after.
- **Number of cards**: **2 to 6** (X's limit).
- **Content of each card**: a short message + its role (hook, development, CTA).
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** of the cards (don't invent figures or promises). If absent -> ask for
  the tone and the message rather than guessing.
- If the project already holds a `.tsx`, read it as a reference.

## 2. X constraints (to respect)

| Point | Value | Status |
|---|---|---|
| Number of cards | **2 to 6** | Official X |
| Ratio | 1:1 **or** 1.91:1, **homogeneous** | Official X |
| Size 1:1 | **1080x1080** (X recommends 800x800) | Official X |
| Size 1.91:1 | **1200x628** (X recommends 800x418) | Official X |
| Format | PNG or JPG | Official X |
| Weight / card | ≤ 5 MB | Official X |

- **Homogeneous ratios**: mixing 1:1 and 1.91:1 in the same carousel is not
  allowed.
- The **tweet's text** and the card titles are set in X Ads, **not in the image**:
  one idea per card.

## 3. The spirit: arrange it so it lands

### Narrative mechanics (pick ONE)
- **Sequential story**: hook -> problem -> solution -> CTA.
- **One card = one product / one offer**: each card legible on its own.
- **Top N / tips**: card 1 = the title, cards 2..N = one item each, the last = the
  CTA.
- **Step-by-step tutorial**: one step per card, each visual self-supporting.
- **Before / after**: strong contrast between the first and the last card.

### Card 1 = the hook
It is the only one fully visible before the swipe: **a single message**, strong
contrast, one element that creates curiosity. Don't explain everything here.

### Coherence across cards (the heart of it)
Identical palette and type; **the logo in a fixed, discreet position**; constant
placements; a **visual through-line** (a color or a progress marker); each card
legible on its own.

### X tone
Direct, punchy, concise. A rising CTA: soft at the start, **conversion on the last
card**. Each card has its own link in X Ads.

## 4. Write the cards

Structure: **one subfolder per carousel**, **one `.tsx` per card**, plus a shared
`theme.ts`.

```
templates/<project>/<name>/
  theme.ts        <- shared palette + layout (pure TS, NO JSX)
  card-1.tsx      <- one card = one PNG
  card-2.tsx
  card-3.tsx
```

- **`theme.ts` factors out the coherence** (palette, `SIZE`, margins). **Pure TS
  with no JSX**: discovery only loads `.tsx` files, so `theme.ts` is ignored.
  **Do not** create a frame component as a `.tsx` in this folder: it would be
  discovered as a fake card and break the build.
- **Naming and order**: the sort is **natural**, so `card-2` would come before
  `card-10`. With 6 cards at most, `card-1` … `card-6`, no padding needed.
- Colors from `theme.ts`, assets through `brand("<project>/...")`, fonts
  discovered in `fonts/`; a missing font -> the "missing font" appendix in
  `new-template`, never silently.

### `theme.ts` (skeleton)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // 1:1 (or 1200x628 for 1.91:1)
export const TOTAL = 4; // number of cards (index + progress)

// <Project> guideline palette (from brands/<project>/brand.md).
export const INK = "#......";
export const ACCENT = "#......";
export const PAPER = "#......";

// Frame shared by every card: same background, same safe area.
export const frame: CSSProperties = {
	width: "100%",
	height: "100%",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	padding: 90, // safe area
	backgroundColor: INK, // opaque background, identical everywhere
};
```

### `card-1.tsx` (skeleton)

```tsx
import type { ReactNode } from "react";
import type { Template } from "brand-artisan";
import { SIZE, frame, PAPER, ACCENT } from "./theme";

function render(): ReactNode {
	return (
		<div style={frame}>
			{/* logo in a fixed position (same corner on every card) */}
			{/* the hook: a single message, strong contrast */}
			{/* progress marker (e.g. 1/4) */}
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
```

(With no `title`, the PNG comes out under the file's name:
`out/<project>/<name>/card-1.png`.)

## 5. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<name>/card-*.png`.
- Check **each** PNG: exact dimensions for the ratio, **the same ratio
  throughout**, opaque background, ≤ 5 MB (trivial with flat rendering).
- Check the **visual coherence** (palette, type, logo, through-line) and that
  **each card is legible on its own**.
- Preview: `npm run dev` then `/<project>/<name>`.

**Success criterion**: 2 to 6 cards at the same ratio (1:1 or 1.91:1), opaque,
visually coherent, card 1 catchy, the last card carrying the CTA, and using only
colors and type from `brand.md`.
