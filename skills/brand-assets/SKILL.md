---
name: brand-assets
description: Generates or regenerates a project's brand assets (logo, favicon and their variants) through the brand toolchain, faithfully. Use when the user wants to "regenerate the logo / the favicon", "add an icon or logo variant", "a new brand variant", or "set up a project's brand toolchain". Works in tools/<project>/ reusing brand-artisan/brandkit, outputs to out/<project>/brand/ and then gets promoted to brands/<project>/. Requires a project with its brand.md in place.
---

# brand-assets: generating brand assets

Goal: produce or evolve a project's **brand files** (logo, favicon, icons, OAuth
variants and so on) with the **brand toolchain**, **faithfully** to what already
exists. This is a separate world from the TS/Satori engine: here you **produce**
the files that `brands/<project>/logo` and `/favicon` contain; the engine
consumes them through `brand()`.

> **Env and commands: see [`tools/README.md`](../../tools/README.md).**
> This skill does not duplicate the launch commands (`npx tsx tools/…`).
> It encodes **how to do it well**.

## 0. Prerequisites (blocking)

- Resolve `<project>`. Check `brands/<project>/brand.md` (colors, geometry,
  rules). Missing guidelines -> **STOP**: `/new-project <project>` first.

## 1. Frame it

Three cases:
- **Regenerate** an existing asset (the guidelines or the geometry changed).
- **Add a variant** of an existing asset (new color, background, size, e.g. the
  `oauth-120-*` files).
- **Start a new brand** (create `tools/<project>/`, see the appendix).

## 2. The discipline of faithful reproduction (the heart of it)

**Never guess the geometry of an existing asset. Inspect it first.** For each
reference file, read off the palette:

```bash
npx brand-artisan colors brands/<project>/logo/logo.png
```

It gives the **dimensions** and the **palette** sorted by pixel count: the first
block is the background (transparent? opaque white?), the following ones the inks
and accents. For an element's scale and margins, `boundingBox(decode(file))` from
`brand-artisan/colors` returns the box of what is painted
(`{ x, y, width, height }`, or `null` if everything is transparent). Don't
hand-write a pixel walk: the function is there and it is tested.

A real example (the OAuth variants): the palette revealed that `mark-white` was
**blue arcs on a white background** (not white arcs), and the bounding box gave
the exact scale of the bracket-O inside the frame. That is what keeps a visual
from being "roughly right".

## 3. Build

In `tools/<project>/` (never anywhere else):

- **Reuse `brand-artisan/brandkit`** for the generic plumbing:
  - `renderSvg(svg, { width } | { height }, background?)`: SVG -> PNG,
  - `renderPixels(svg, size)`: the same pixels as RGBA, for the checks,
  - `makeIco(images)`: multi-resolution `.ico`,
  - `loadInstanced(font, axes)`: access to the glyphs (outline, advance, bbox).
- **Keep local** (in the brand's own script) the **colors**, the **geometry**
  (paths, viewBox) and the **layout**, never in `brandkit.ts`.
- If some new generic plumbing would serve every brand, add it to `brandkit.ts`
  (and **update `tools/README.md` in mirror**).
- The output goes to **`out/<project>/brand/`** through the script's `OUT`
  constant. Don't write directly into `brands/` (see §5).

## 4. Validate

Compare every regenerated file (in `out/<project>/brand/`) with its reference (in
`brands/<project>/`): **dimensions**, **bounding box** and **palette** must
match (slight edge antialiasing differences are acceptable; a difference in
color, size or framing is not). Also run the built-in pixel validation where it
exists (the favicon prints a 32 px check).

## 5. Promote

`out/<project>/brand/` is **ephemeral** (the `out/` folder is gitignored). After
a visual review and validation, **copy** the approved files into
`brands/<project>/logo/` or `/favicon/`, then **update `brand.md`** if the list
of variants changes (placement, new variants).

**Success criterion**: the regenerated assets are faithful (dimensions, bounding
box and palette conform), produced by a script that reuses `brandkit.ts`, and
promoted into `brands/<project>/` with an up-to-date `brand.md`.

## Appendix: starting a new brand

1. Create `tools/<project>/`; take inspiration from `tools/calame/`
   (`build-logo.ts`, `build-favicon.ts`).
2. Drop the source font in it if needed (e.g. `_geist.ttf`).
3. Import the foundation: `import { … } from "brand-artisan/brandkit"`. Colors
   and geometry come from `brand.md`, never invented.
4. `OUT` -> `out/<project>/brand/`. Check, validate, promote.
