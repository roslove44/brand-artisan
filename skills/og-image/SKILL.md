---
name: og-image
description: Creates an Open Graph image (social share preview) optimized for BrandArtisan. Use when the user wants an "og image", a "share image", or an "Open Graph / Twitter / LinkedIn / Discord" preview for a project. Produces a 1200x630 .tsx template aligned with the brand guidelines, rendered as a light PNG through the project's Satori engine. Requires a project with its brand.md in place.
---

# og-image: optimized Open Graph image

Goal: produce the **PNG asset** of a share image (1200×630), through the
project's pipeline (Satori -> resvg), aligned with the guidelines. BrandArtisan
generates **the image only**; the `og:`/`twitter:` tags live on the site that
hosts it.

This is a specialization of `new-template` with the OG constraints hard-coded.
Same conventions: the `Template` contract (from `brand-artisan`), assets through
`brand()`, fonts discovered in `fonts/`, `export default ... satisfies Template`.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist before you
start. Do not begin until it does:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- If the guidelines or the project are missing -> **STOP**: ask the user to run
  `/new-project <project>` first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- `<name>` is a kebab-case slug, default `og` (or `og-<page>` if there are
  several previews). Check that `templates/<project>/<name>.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette (hex), type, which logo variant to
  use depending on the background, and the **don'ts**.
- Read `brands/<project>/project.md` if it exists: set the **tone** and the
  **claims** (don't invent figures or promises). If absent -> ask for the tone
  and the message rather than guessing.
- Ask for the **message**: short headline + tagline (1 sentence). No paragraph.

## 2. OG constraints (to respect in the template)

- **Exact size 1200×630** (1.91:1 ratio). The standard recognized by Facebook,
  LinkedIn, Slack, Discord and X. Do not deviate; absolute minimum 600×315.
- **Opaque background**, never transparency: the platforms compose the image over
  varied backgrounds.
- **Safe area** of roughly 80 px of margin: keep the logo and the text towards
  the center. The corners can be cropped or rounded (Discord, X), so nothing
  important goes in them.
- **Legible when small**: the preview often displays about 400 px wide on mobile.
  Large headline (~60–90 px), short tagline, strong contrast. Mental test: still
  legible once shrunk to 400 px wide.
- **Light weight**: aim for **< 300 KB**. Beyond that, some consumers (WhatsApp
  in particular) do not generate the preview. The engine's flat rendering is
  naturally light: favor the mark as an **SVG data-URI** (as `og.tsx` does),
  avoid embedding large raster PNGs, and **don't inflate with `scale`**: leaving
  `scale` out (= 1) is enough at 1200×630 for OG.
- **PNG**: that is the engine's output, ideal for crisp text.

## 3. Write the template

`templates/<project>/<name>.tsx`, with colors as constants taken from the
guidelines (invent nothing). Skeleton:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark (SVG/PNG)

const SIZE = { width: 1200, height: 630 }; // OG standard, no scale

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

// const markSvg = await readFile(brand("<project>/favicon/icon.svg"));

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
      {/* logo + large headline + short tagline, strong contrast */}
    </div>
  );
}

export default { size: SIZE, title: "<Human title>", render } satisfies Template;
```

Keep the code minimal (principle #2): factor out a background effect locally
only if it repeats.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check the PNG: **dimensions 1200×630**, opaque background, **weight < 300 KB**
  (beyond that, warn and lighten: drop a heavy raster, lower a `scale`).
- Preview: `npm run dev` then `/<project>/<name>`; check legibility by mentally
  shrinking to about 400 px.

**Success criterion**: a 1200×630 PNG, opaque, under 300 KB, legible when small,
and using only the colors and type from `brand.md` except where the user says
otherwise.
