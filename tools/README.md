# tools: the brand toolchain

Generates a project's **brand assets** (logo, favicon and their variants). A
separate world from the composition engine: here you **produce** the files in
`brands/<project>/logo` and `/favicon`; the engine **consumes** them through
`brand()`.

## Layout

```
src/brandkit.ts        shared foundation (font -> outlines, SVG -> PNG, .ico)
tools/
  <project>/           one brand's scripts, colors and geometry hard-coded
    build-logo.ts
    build-favicon.ts
    _sora.ttf          optional: a source font not shared through fonts/
```

The foundation is generic, so it lives with the engine in `src/`. Per-brand
scripts are **content**, so they live here. A brand's colors and geometry belong
in its own scripts, never in `brandkit.ts`.

## What the foundation gives you

| Function | Role |
|---|---|
| `loadInstanced(font, axes)` | Loads a font, instanced on its axes if variable, and exposes each glyph: SVG outline, advance, bounding box. |
| `renderSvg(svg, size, background?)` | Rasterizes to PNG at a given width or height. The vector is scaled, nothing is cropped. |
| `renderPixels(svg, size)` | Same render, as raw RGBA pixels, for a script's color checks. |
| `makeIco(images)` | Writes a multi-resolution `.ico`: header, directory, PNGs appended. |

## Running

From any folder in the project:

```bash
npx tsx tools/calame/build-logo.ts     # -> out/calame/brand/logo/
npx tsx tools/calame/build-favicon.ts  # -> out/calame/brand/favicon/
```

A brand may add scripts beyond these two. Each `brand.md` lists its own in its
Regeneration section.

## Output and promotion

Scripts write to **`out/<project>/brand/`**, which git ignores: committed assets
are never overwritten blind. The tree there mirrors `brands/<project>/` exactly,
so **promoting** an approved file is a plain copy.

`npm run dev` serves that output for review, the project gaining a `brand` folder
next to its visuals (`http://localhost:4000/<project>/brand`).

To regenerate in place instead, point a script's `OUT` at `brands/<project>`.

## Tests

`test/brandkit.test.ts` covers the foundation: render scaling, optional
background, `.ico` structure, glyph extraction. Per-brand scripts are not
covered, since CI must not depend on which brands the repo happens to hold.

## Adding a brand

Create `tools/<project>/` with its scripts, taking `calame/` as the model, reuse
`src/brandkit.ts` for the plumbing, and keep colors and geometry local.
