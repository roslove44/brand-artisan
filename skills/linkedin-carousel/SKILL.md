---
name: linkedin-carousel
description: Creates the slides of a LinkedIn carousel, both kinds. Use when the user wants a "LinkedIn carousel", a "LinkedIn document post", a "LinkedIn PDF carousel", a "LinkedIn carousel ad" or "several slides that swipe" for a LinkedIn project. Two paths, and the choice is asked rather than assumed. Either an organic document post (slides assembled into a PDF, what LinkedIn actually paginates as a swipeable carousel in the feed), or a carousel ad in Campaign Manager (1:1 PNG cards). Produces N .tsx templates in a dedicated subfolder sharing a common theme, plus the PDF for the organic path. Requires a project with its brand.md in place.
---

# linkedin-carousel: slides for a LinkedIn carousel

Goal: produce the **N slides** of a LinkedIn carousel, coherent with each other
and aligned with the guidelines. A carousel is not N independent images: it is a
**series** that tells something. Coherence across slides is the heart of the
deliverable.

This is a specialization of `new-template`. Same conventions: the `Template`
contract, assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Which carousel? (blocking, ask first)

**"LinkedIn carousel" covers two unrelated formats.** Settle it before anything
else: it decides the ratio, the number of slides, the amount of text and the
deliverable. Don't pick in silence (CLAUDE.md principle #1).

| | **A. Document post** (organic) | **B. Carousel ad** (Campaign Manager) |
|---|---|---|
| Where | The regular feed, from a profile or a page | Sponsored Content, paid |
| What you upload | **one PDF**, LinkedIn paginates it | **N separate images** |
| Deliverable | `out/<project>/<name>.pdf` | `out/<project>/<name>/card-*.png` |
| Default ratio | **4:5, 1080×1350** | **1:1, 1080×1080** (only ratio allowed) |

**Ask, with A pre-selected.** "I want a LinkedIn carousel" for a post, a tip
series, a mini-guide is path A nine times out of ten: put the question so that it
settles in one word ("Document post, the organic one? Or a Campaign Manager
carousel ad?"), never so that it reads as a quiz.

**Unless the request already settled it.** "carousel ad", "for Campaign Manager",
"sponsored", a budget -> path B. "document post", "PDF carousel" -> path A.
Nothing left to ask then: state the path being taken and move on.

> **Posting the PNGs is not path A.** Several images attached to a LinkedIn post
> come out as a **mosaic** of thumbnails, not as slides you swipe. The swipeable
> carousel in the feed **is** the document viewer, and it only accepts a
> document. Hence the PDF: the engine renders the slides, then assembles them.

## 2. Constraints (to respect)

### Path A, document post

| Point | Value | Status |
|---|---|---|
| File | **PDF** (also PPT, PPTX, DOC, DOCX) | Official LinkedIn |
| Weight | ≤ 100 MB | Official LinkedIn |
| Pages | ≤ 300 | Official LinkedIn |
| Number of slides | **3 to 10** | Usage |
| Ratio | **4:5 (1080×1350)**, or 1:1 (1080×1080) | Usage |

- **PDF over the Office formats**: it is the one LinkedIn converts most
  reliably, and the one the engine produces.
- **4:5 by default**: portrait takes the most vertical space in the feed, which
  buys dwell time. 1:1 is legitimate, just smaller on mobile.
- **Same size for every slide**: LinkedIn takes the ratio of the whole document
  from its first page, so a stray page gets letterboxed.
- **A document post is read on a phone**: the 1080 px width lands around 400 px
  wide. Body text under ~32 px in the template becomes unreadable there. Keep
  the headline large and the body short.
- The post's **text** goes in the LinkedIn post, **not** in the slides.

### Path B, carousel ad

| Point | Value | Status |
|---|---|---|
| Number of cards | 2 to 10 (sweet spot 3-5) | Official LinkedIn |
| Ratio | **1:1 only** | Official LinkedIn |
| Size / card | **1080×1080** (max 4320×4320) | Official LinkedIn |
| Format | JPG or PNG (non-animated GIF) | Official LinkedIn |
| Weight / card | ≤ 10 MB | Official LinkedIn |
| Headline / card | ≤ 45 characters | Official LinkedIn |

- **1:1 is mandatory**: no 4:5 or 9:16 in a LinkedIn carousel ad (this differs
  from Facebook). Every card at the same format.
- The **intro text** and the headlines/links are set in Campaign Manager, **not
  in the image**: one idea per card.

## 3. Frame it (ask, don't guess)

- **Name of the carousel**: a kebab-case slug, default `linkedin-carousel`. It
  is the **subfolder** `templates/<project>/<name>/`. Check it does not exist.
- **Narrative mechanic** (see §4): a story, one slide per product, a top N, a
  tutorial, before/after. It dictates the design.
- **Number of slides**, per the table above.
- **Content of each slide**: a short message + its role (hook, development, CTA).
- Read `brands/<project>/brand.md`: palette, type, logo variants, **don'ts**. If
  the project already holds a `.tsx`, read it as a reference.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** (don't invent figures or promises). If absent -> ask for the tone
  and the message rather than guessing.

## 4. The spirit: arrange it so it lands

### Narrative mechanics (pick ONE)
- **Sequential story**: hook -> problem -> solution -> proof -> CTA.
- **One slide = one product / one offer**: each slide legible on its own,
  constant background and position.
- **Top N / tips**: slide 1 = the title, slides 2..N = one item each, the last =
  the CTA. Number the slides.
- **Step-by-step tutorial**: one step per slide, each visual self-supporting.
- **Before / after**: strong contrast between the first and the last slide.

### Slide 1 = the hook
It is the only one fully visible before the swipe: **a single message**, strong
contrast, one element that creates curiosity. Don't explain everything here.

### Coherence across slides (the heart of it)
Identical palette and type; **the logo in a fixed, discreet position**; constant
placements; a **visual through-line** (a color or a progress marker); each slide
legible on its own.

### LinkedIn tone
A **professional** audience: a register of added value (an insight, a data point,
a business benefit, proof), a measured CTA. Avoid the "aggressive promo" tone.

### Rising CTA
Soft at the start, **conversion on the last slide**. On path A the last slide
carries the whole call to action, since a document post has no per-slide link;
on path B each card has its own link in Campaign Manager.

## 5. Write the slides

Structure: **one subfolder per carousel**, **one `.tsx` per slide**, plus a
shared `theme.ts`.

```
templates/<project>/<name>/
  theme.ts        <- shared palette + layout (pure TS, NO JSX)
  card-1.tsx      <- one slide = one PNG, and one PDF page on path A
  card-2.tsx
  card-3.tsx
```

- **`theme.ts` factors out the coherence** (palette, `SIZE`, margins). **Pure TS
  with no JSX**: discovery only loads `.tsx` files, so `theme.ts` is ignored.
  **Do not** create a frame component as a `.tsx` in this folder: it would be
  discovered as a fake slide and land in the PDF. The little bit of frame JSX
  gets repeated in each slide.
- **Naming and order**: file order sets the **page order of the PDF**, and the
  sort is natural, so `card-2` comes before `card-10`. Number the slides plainly,
  no padding needed.
- Colors from `theme.ts`, assets through `brand("<project>/...")`, fonts
  discovered in `fonts/`; a missing font -> the "missing font" appendix in
  `new-template`, never silently.

### `theme.ts` (skeleton)

```ts
import type { CSSProperties } from "react";

export const SIZE = { width: 1080, height: 1350 }; // document post, 4:5 (ad: 1080x1080)
export const TOTAL = 5; // number of slides (index + progress)

// <Project> guideline palette (from brands/<project>/brand.md).
export const INK = "#......";
export const ACCENT = "#......";
export const PAPER = "#......";

// Frame shared by every slide: same background, same safe area.
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
			{/* logo in a fixed position (same corner on every slide) */}
			{/* the hook: a single message, strong contrast */}
			{/* progress marker (e.g. 1/5) */}
		</div>
	);
}

export default { size: SIZE, render } satisfies Template;
```

(With no `title`, the PNG comes out under the file's name:
`out/<project>/<name>/card-1.png`.)

## 6. Assemble and verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<name>/card-*.png`.
- **Path A only**, assemble the document:

  ```bash
  npm run pdf -- <project>/<name>     # -> out/<project>/<name>.pdf
  ```

  One slide = one page, each page at the slide's exact size. The command
  re-renders the slides itself, so it stays right even if `build` was not run,
  and it **refuses to assemble** if one slide has a different ratio from the
  first, since that page would come out letterboxed in the feed.
- Check the pages: the **expected count**, the **order**, an opaque background,
  ≤ 100 MB (trivial with flat rendering).
- Check the **visual coherence** (palette, type, logo, through-line) and that
  **each slide is legible on its own**, body text included, at phone size.
- Preview the slides: `npm run dev` then `/<project>/<name>`. The folder's page
  carries a **PDF** button as soon as the document exists, and labels it *out
  of date* when a slide is more recent than it.

## 7. Hand it over (the files are not the delivery)

Rendering the slides is not finishing the job. Left to themselves, users upload
the PNGs, because that is what a folder of images invites, and LinkedIn answers
with a mosaic of thumbnails. **Never sign off on path A with "the cards are
ready in `out/`".** Close with a short handover, in your own words, carrying
three things:

- **The file to upload.** Path A, `out/<project>/<name>.pdf`, and it alone,
  through *Add a document* in the post editor. Path B, the N PNGs, one per card,
  in Campaign Manager.
- **Why, in one line.** LinkedIn paginates a document into slides you swipe; a
  batch of images is laid out as a mosaic. Say it once, plainly. This is the
  part that gets missed, so it belongs in the handover and not in a footnote.
- **What the PNGs are still for**, on path A. They stay in
  `out/<project>/<name>/` and get reused on their own (an illustration, a post
  image). They just are not the LinkedIn deliverable.

**The PDF goes stale.** Editing one slide, adding one, renaming one, all leave
the PDF behind. Re-run `npm run pdf -- <project>/<name>` and hand over the new
one, without re-explaining the whole recipe. Same thing for a carousel folder
that predates the PDF path, `build` alone never produced one.

**Success criterion**: on path A, a PDF of 3-10 pages at a constant ratio,
paginated in the intended order, slide 1 catchy and the last slide carrying the
CTA, **handed over as the thing to upload**. On path B, 2-10 cards at 1:1
1080×1080, opaque, visually coherent. In both cases a professional tone, and
only colors and type from `brand.md`.
