---
name: new-template
description: Scaffolds a new visual (.tsx) in an existing BrandArtisan project, aligned with its brand.md guidelines. Use when the user wants to create a new image/cover/banner/OG in a project ("new visual", "add a cover for X", "create the OG for Y"). Always reads brands/<project>/brand.md and refuses if it is missing.
---

# new-template: scaffolding a visual

Goal: create `templates/<project>/<name>.tsx` conforming to the `Template`
contract and **aligned with the project's guidelines**.

## 1. Resolve `<project>` and `<name>`

Take them from the arguments. Otherwise ask. `<name>` is a kebab-case slug (e.g.
`cover`, `og-home`, `linkedin-banner`). Check that
`templates/<project>/<name>.tsx` does not already exist.

## 2. Read the guidelines (blocking)

**Read `brands/<project>/brand.md`.** If the file does not exist -> **STOP**:
produce no visual, tell the user to run `/new-project <project>` first. That is
the CLAUDE.md rule, without exception.

While reading the guidelines, extract: the palette (roles + hex), type and
weights, logo/favicon variants and their rules, and the **don'ts**.

## 3. Build on what is there

If `templates/<project>/` already holds a `.tsx`, read it as a style reference
(e.g. `og.tsx`) and match its conventions. Otherwise start from the skeleton
below.

## 4. Frame the visual (ask, don't guess)

Ask the user for:

- **Dimensions** (px). Suggest a default for the use: OG ~1200×630, social cover
  ~1500×500, LinkedIn banner ~1584×396.
- **Message / content** (headline, tagline, elements). If
  `brands/<project>/project.md` exists, read it to set the tone and the claims
  (don't invent figures or promises); otherwise ask for the tone rather than
  guessing.
- **Which logo variant** to use (depending on the background, following the
  guideline rules).

If the brief has several possible readings -> present them, don't choose in
silence (CLAUDE.md principle #1).

## 5. Write the `.tsx`

Respect the `Template` contract (from `brand-artisan`) and the project's
conventions:

- Colors as **named constants taken from the guidelines**: don't invent hex.
- Fonts: those present in `fonts/`, discovered automatically by the engine. The
  file name gives the family and the weight (`GeistMono-600.ttf` -> family
  `Geist Mono`, weight 600). If the guidelines require another font that is
  absent from `fonts/`, follow the **Missing font** procedure below: never use
  one silently.
- Assets through `brand("<project>/...")` (never a path relative to the cwd, nor
  `../../..`).
- `scale` is optional in `size` if a retina render is wanted.
- Default export `satisfies Template`.

Starting skeleton:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if the visual loads an asset (SVG/PNG)

const SIZE = { width: 1200, height: 630 };

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

// Load assets at the top level (data-URI for SVG <img>).
// const markSvg = await readFile(brand("<project>/favicon/icon.svg"));

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* content aligned with the guidelines */}
		</div>
	);
}

export default { size: SIZE, title: "<Human title>", render } satisfies Template;
```

Keep the code minimal (principle #2): no abstraction for single-use code, no
helper nobody asked for. If a background effect (texture, glow) repeats, factor
it out locally as `banner.tsx` does with its rule.

Satori only covers a subset of CSS: read the **Satori pitfalls** appendix before
positioning layers or attempting a text effect.

## 6. Verify

- `npm run typecheck` -> green.
- Render: `npm run build` (writes the PNG) or point the user to `npm run dev`
  then `/<project>/<name>` for the preview.

**Success criterion**: the file typechecks, renders a PNG, and uses only colors
and type coming from `brand.md`.

## Appendix: Satori pitfalls

CSS properties that Satori ignores **silently** (no warning, the layer just
disappears or the effect does not happen):

- **`inset` does not exist.** A layer with `position: "absolute", inset: 0` is
  never rendered. Write the four properties instead:
  `top: 0, right: 0, bottom: 0, left: 0`.
- **`color: "transparent"` renders no glyph**, even combined with a
  `WebkitTextStroke`. For an outlined text effect, give the text a `color` equal
  to the background color: the stroke draws the outline, and the fill visually
  "punches out" the glyph.

## Appendix: missing font

If the guidelines require a font that is not in `fonts/`:

1. **Ask for permission** to fetch it: this is an outbound network action, never
   silent. Name the **source** and the **license** before downloading.
2. **Trustworthy source, ttf/otf format** (Satori does not read woff2): the raw
   `.ttf` from the official repo (`github.com/google/fonts`) or an
   `@fontsource/<font>` package. Most Google Fonts are OFL/Apache -> fine. A
   proprietary font or an ambiguous license -> **refuse** and ask the user to
   provide the file themselves.
3. **Download** to `fonts/<Family>-<weight>.ttf`, using `curl -L <url> -o ...`
   or `Invoke-WebRequest -OutFile`. WebFetch is not suitable (binary). The file
   name **is authoritative**: it determines the family the templates cite, in
   PascalCase (`GeistMono-600.ttf` -> `Geist Mono`, 600).
4. **Check the file**: non-zero size and a real font header (`.ttf` starts with
   `00 01 00 00`, OpenType with `OTTO`), not an HTML error page in disguise,
   which would crash Satori at runtime.
5. **Document the license**: drop its text into `fonts/` and add the matching
   row to the table in `fonts/NOTICE.md`. No code declaration is needed: the
   engine discovers the file at startup, provided its name follows the
   convention from step 3.
6. **Confirm before committing** the `.ttf` (a binary) with the user.

If the user refuses the download -> do not use the font; ask them to drop the
file into `fonts/`, or stay with a font already present in `fonts/`.
