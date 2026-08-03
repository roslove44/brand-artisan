---
name: facebook-carousel
description: Creates the cards of a Facebook carousel ad at Meta's dimensions, as a series of coherent visuals. Use when the user wants a "Facebook carousel", a "carousel ad" or "several cards that swipe" for a project. Produces N .tsx templates (one card = one PNG) in a dedicated subfolder, sharing a common theme, aligned with brand.md. Requires a project with its brand.md in place.
---

# facebook-carousel: cards for a Facebook carousel

Goal: produce the **PNG assets of the N cards** of a Facebook carousel ad, at the
chosen **Meta ratio**, **coherent with each other** and aligned with the
guidelines. A carousel is not N independent images: it is a **series** that tells
something. Coherence across cards is the heart of the deliverable.

This is a specialization of `new-template`. Same conventions: the `Template`
contract (from `brand-artisan`), assets through `brand()`, fonts discovered in
`fonts/`, `export default ... satisfies Template`.

> **Status of the dimensions.** The specs come from Meta's **Ads Manager** (Ads
> Guide + the carousel help pages); there is no organic post spec. The ratios are
> official Meta; the "1080×1080" is a convention (Meta documents 1024×1024 as the
> recommended minimum at 1:1).

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it (ask, don't guess)

- **Name of the carousel**: a kebab-case slug, default `carousel`. It is the
  **subfolder** `templates/<project>/<name>/`. Check that it does not exist.
- **Narrative mechanic** (see §3): a story, one card per product, a top N, a
  tutorial, before/after, or seamless. It dictates the whole design.
- **Number of cards**: 2 to 10, **sweet spot 3-5**. If a card adds nothing, drop
  it.
- **Ratio**: default **1:1 (1080×1080)**. Otherwise 4:5 (1080×1350) or 9:16
  (1080×1920). **The same for every card** (mandatory).
- **Content of each card**: a short message + its role in the series (hook,
  development, CTA). Plus the final **CTA**.
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**. If
  the project already holds a `.tsx`, read it as a reference.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** of the cards (don't invent figures or promises). If absent -> ask for
  the tone and the message rather than guessing.

## 2. Facebook constraints (to respect)

| Point | Value | Status |
|---|---|---|
| Number of cards | 2 to 10 (sweet spot 3-5) | Official Meta |
| Ratio (identical throughout) | 1:1, 4:5 or 9:16 (3 % tolerance) | Official Meta |
| Size 1:1 | **1080x1080** (Meta recommended min 1024) | Convention / Meta |
| Size 4:5 | 1080x1350 | Official Meta |
| Size 9:16 | 1080x1920 | Official Meta |
| Format | PNG or JPG | Official Meta |
| Weight / image | ≤ 30 MB (aim for < 1 MB) | Official Meta |
| Headline / card | ≤ 40 chars (≤ 25 to avoid truncation) | Official Meta |
| Primary text | ≤ 125 chars (lives **outside the image**) | Official Meta |

- **The same ratio on every card**: mixing 1:1 and 4:5 is not supported.
- The **primary text** and the **headline/link** are set in Ads Manager, **not in
  the image**: don't write everything into the visual.
- The old **20 % text rule** was dropped (2021), but an overloaded card is still
  illegible on mobile: **one idea per card**.

## 3. The spirit: arrange it so it lands

### Narrative mechanics (pick ONE)
- **Sequential story**: hook -> problem -> solution -> proof -> CTA. Each card
  moves the story forward.
- **One card = one product**: a catalog, a range, variants. Constant product
  position and background; each card legible on its own.
- **Top N / tips**: card 1 = the title of the list, cards 2..N = one item each,
  the last = the CTA. Number the cards.
- **Step-by-step tutorial**: one step per card, each visual self-supporting
  (understandable without reading the text).
- **Before / after**: strong contrast between the first and the last card.
- **Seamless (panoramic)**: see the dedicated warning below.

### Card 1 = the hook (decisive)
It is the only one visible before the first swipe. **A single message**, 3-5
words, strong contrast, one element that creates curiosity (a figure with no
context, a visual that "spills over", a question). Don't explain everything here:
that kills the swipe.

### Coherence across cards (the heart of it)
- **Identical palette and type** on every card (a single accent that varies if
  needed).
- **The logo in a fixed, discreet position** (the same corner throughout), never
  as the centerpiece: enlarging it on every card is a common mistake.
- **Constant placements**: if the headline is at the bottom, it is always at the
  bottom.
- **A visual through-line**: an element or a color that links the cards; a shade
  that evolves from card to card signals the progression.
- **Each card legible on its own** (a user can enter in the middle).

### Rising CTA
Soft at the start ("Find out more"), direct next, **conversion on the last card**
("Request a quote"). Each card has its own link in Meta.

### Mistakes to avoid
Card 1 too explanatory; cards siloed with no through-line; repeating the same
message; text too dense; mixing ratios; logo too big.

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

- **`theme.ts` factors out the coherence**: palette taken from the guidelines,
  ratio/SIZE, margins. **Pure TS with no JSX**: discovery only loads `.tsx` files,
  so `theme.ts` is ignored as a template. **Do not** create a frame component as a
  `.tsx` in this folder: it would be discovered as a fake card and break the
  build. The coherence travels through the constants; the little bit of frame JSX
  gets repeated in each card (they differ anyway).
- **Naming and order**: the sort is **natural**, so `card-2` comes before
  `card-10`. Number the cards plainly, no padding needed.
- Colors as constants (from `theme.ts`), assets through
  `brand("<project>/...")`, fonts discovered in `fonts/`; a missing font -> the
  "missing font" appendix in `new-template`, never silently.

### `theme.ts` (skeleton)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1080 }; // 1:1 carousel

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
	padding: 96, // safe area (~10%)
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
			{/* progress marker (e.g. 1/3) */}
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
```

(With no `title`, the PNG comes out under the file's name:
`out/<project>/<name>/card-1.png`.)

### Warning: seamless mode (panoramic)

Facebook inserts **gutters** (a border plus a shadow) between the cards, so a
panoramic image is **never** perfectly continuous on screen. If the user wants
seamless with this model (N files):
- Design a mural of `N×1080 × 1080` in your head, and **offset the background** by
  `-1080*(i-1)` px in card `i` (each card renders its own slice).
- **No critical element** (text, a face, the logo) within about **100 px** of a
  left or right edge: the gutter would cut it.
- In Ads Manager, **turn off automatic optimization** ("show the best-performing
  cards first") and upload **left to right**, otherwise Meta reorders them and
  destroys the mural.
Seamless is demanding: by default, prefer a per-card mechanic (product, story, top
N) that tolerates the gutters.

## 5. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<name>/card-*.png`.
- Check **each** PNG: exact dimensions for the chosen ratio, **the same ratio
  throughout**, opaque background.
- Check the **visual coherence** across the series (palette, type, logo position,
  through-line) and that **each card is legible on its own**.
- Preview: `npm run dev` then `/<project>/<name>` (lists the carousel's cards).

**Success criterion**: N cards (2-10) at the same Meta ratio, opaque, visually
coherent, card 1 catchy, the last card carrying the CTA, and using only colors and
type from `brand.md`.
