---
name: linkedin-carousel
description: Creates the cards of a LinkedIn carousel ad (Campaign Manager) at LinkedIn's dimensions, as a series of coherent 1:1 visuals. Use when the user wants a "LinkedIn carousel", a "LinkedIn carousel ad" or "several cards that swipe" for a LinkedIn project. Produces N .tsx templates (one card = one PNG, 1:1 ratio) in a dedicated subfolder, sharing a common theme, aligned with brand.md. Requires a project with its brand.md in place.
---

# linkedin-carousel: cards for a LinkedIn carousel ad

Goal: produce the **PNG assets of the N cards** of a LinkedIn **carousel ad**
(Campaign Manager / Sponsored Content), in **1:1** format, coherent with each
other and aligned with the guidelines. A carousel is not N independent images: it
is a **series** that tells something. Coherence across cards is the heart of the
deliverable.

This is a specialization of `new-template`. Same conventions: the `Template`
contract, assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`. Same model as `facebook-carousel`.

> **Carousel ad ≠ organic carousel.** What you produce here are the **1:1 image
> cards** of a *carousel ad* (advertising, Campaign Manager). The **organic**
> "carousel" in the LinkedIn feed is a **multi-page document (PDF)**, not a series
> of images: **out of scope** for this engine (which outputs PNG).

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it (ask, don't guess)

- **Name of the carousel**: a kebab-case slug, default `linkedin-carousel`. It is
  the **subfolder** `templates/<project>/<name>/`. Check that it does not exist.
- **Narrative mechanic** (see §3): a story, one card per product, a top N, a
  tutorial, before/after. It dictates the design.
- **Number of cards**: 2 to 10, **sweet spot 3-5**.
- **Content of each card**: a short message + its role (hook, development, CTA).
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**. If
  the project already holds a `.tsx`, read it as a reference.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** of the cards (don't invent figures or promises). If absent -> ask for
  the tone and the message rather than guessing.

## 2. LinkedIn constraints (to respect)

| Point | Value | Status |
|---|---|---|
| Number of cards | 2 to 10 (sweet spot 3-5) | Official LinkedIn |
| Ratio | **1:1 only** | Official LinkedIn |
| Size / card | **1080x1080** (max 4320x4320) | Official LinkedIn |
| Format | JPG or PNG (non-animated GIF) | Official LinkedIn |
| Weight / card | ≤ 10 MB | Official LinkedIn |
| Headline / card | ≤ 45 characters | Official LinkedIn |

- **1:1 is mandatory**: no 4:5 or 9:16 in a LinkedIn carousel ad (this differs
  from Facebook). Every card at the same format.
- The **intro text** and the headlines/links are set in Campaign Manager, **not in
  the image**: one idea per card.

## 3. The spirit: arrange it so it lands

### Narrative mechanics (pick ONE)
- **Sequential story**: hook -> problem -> solution -> proof -> CTA.
- **One card = one product / one offer**: each card legible on its own, constant
  background and position.
- **Top N / tips**: card 1 = the title, cards 2..N = one item each, the last = the
  CTA. Number the cards.
- **Step-by-step tutorial**: one step per card, each visual self-supporting.
- **Before / after**: strong contrast between the first and the last card.

### Card 1 = the hook
It is the only one fully visible before the swipe: **a single message**, strong
contrast, one element that creates curiosity. Don't explain everything here.

### Coherence across cards (the heart of it)
Identical palette and type; **the logo in a fixed, discreet position**; constant
placements; a **visual through-line** (a color or a progress marker); each card
legible on its own.

### LinkedIn tone
A **professional** audience: a register of added value (an insight, a data point,
a business benefit, proof), a measured CTA. Avoid the "aggressive promo" tone.

### Rising CTA
Soft at the start, **conversion on the last card**. Each card has its own link in
Campaign Manager.

## 4. Write the cards

Structure: **one subfolder per carousel**, **one `.tsx` per card**, plus a shared
`theme.ts`.

```
templates/<project>/<name>/
  theme.ts        <- shared palette + layout (pure TS, NO JSX)
  card-1.tsx      <- one card = one PNG (1080x1080)
  card-2.tsx
  card-3.tsx
```

- **`theme.ts` factors out the coherence** (palette, `SIZE`, margins). **Pure TS
  with no JSX**: discovery only loads `.tsx` files, so `theme.ts` is ignored.
  **Do not** create a frame component as a `.tsx` in this folder: it would be
  discovered as a fake card and break the build. The little bit of frame JSX gets
  repeated in each card.
- **Naming and order**: the sort is **lexical**, so `card-10` comes before
  `card-2`. From 10 cards on, **pad** them: `card-01` … `card-10`.
- Colors from `theme.ts`, assets through `brand("<project>/...")`, fonts
  discovered in `fonts/`; a missing font -> the "missing font" appendix in
  `new-template`, never silently.

### `theme.ts` (skeleton)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // LinkedIn carousel ad, 1:1
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
- Check **each** PNG: **1080×1080** (1:1 throughout), opaque background, ≤ 10 MB
  (trivial with flat rendering).
- Check the **visual coherence** (palette, type, logo, through-line) and that
  **each card is legible on its own**.
- Preview: `npm run dev` then `/<project>/<name>`.

**Success criterion**: N cards (2-10) at 1:1 1080×1080, opaque, visually coherent,
card 1 catchy, the last card carrying the CTA, professional in tone, and using
only colors and type from `brand.md`.
