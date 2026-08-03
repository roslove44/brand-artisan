# BrandArtisan

![JSX in, image out. One .tsx file, one image: Open Graph, social posts, banners, carousels.](https://raw.githubusercontent.com/roslove44/brand-artisan/main/.github/assets/github-social-preview.png)

[![npm](https://img.shields.io/npm/v/brand-artisan)](https://www.npmjs.com/package/brand-artisan)
[![CI](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml/badge.svg)](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml)
[![license MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/roslove44/brand-artisan/blob/main/LICENSE)

> 🇫🇷 Version française : [README.fr.md](https://github.com/roslove44/brand-artisan/blob/main/README.fr.md)

**If you can write a React component, you already know how to make your visuals.**
BrandArtisan turns JSX into PNGs: Open Graph images for your site, LinkedIn,
Facebook and X posts and banners, carousels. No Figma, no browser, no server:
your visuals are code, versioned with everything else.

```tsx
import type { Template } from "brand-artisan";

function render() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#0e1a2b" }}>
      {/* your layout, in flexbox */}
    </div>
  );
}

export default { size: { width: 1200, height: 630 }, title: "Site OG", render } satisfies Template;
```

Under the hood, it is the `next/og` engine (Satori + resvg) taken out of its
Next wrapper: JSX → SVG → PNG. `react` only provides the JSX runtime; there is
no `react-dom` and no client-side rendering.

## Getting started

Prerequisite: **Node.js ≥ 22**. Nothing else.

```bash
npx create-brand-artisan my-visuals
cd my-visuals
npm run dev      # browsable preview at http://localhost:4000
npm run build    # exports the PNGs to out/
```

The generated project contains **only your brand**: guidelines (`brands/`),
visuals (`templates/`), asset scripts (`tools/`), fonts (`fonts/`). The engine
lives in `node_modules` and updates with `npm update`. A complete example ships
with it (Calame, a fictional brand): the first command produces an image before
you have written anything.

## Writing a visual

A `.tsx` file under `templates/<project>/` = one image. It default-exports a
`Template` (see above); discovery is automatic, there is no registry to edit.
In dev, every visual gets its own URL, like Next routes:

```text
http://localhost:4000/                   → lists the projects
http://localhost:4000/calame/og          → preview page (re-rendered on each refresh)
http://localhost:4000/calame/og?raw      → the raw PNG
http://localhost:4000/calame/deck?pdf    → a folder's assembled PDF, once built
```

`npm run build` exports everything to `out/<project>/`, ready to upload.

Three Satori rules to know:

- **Any element with several children must be `display: flex`**: the number one
  cause of render errors.
- **Fonts are explicit**: drop `<Family>-<weight>.ttf` into `fonts/`
  (e.g. `Sora-700.ttf`), that is all it takes to register one.
- Images are embedded as data URIs (`<img src="data:image/svg+xml;base64,…">`),
  not by file path.

## Carousels: a folder of slides, one PDF

A carousel is a subfolder of cards sharing a theme, one `.tsx` per slide:

```text
templates/calame/linkedin-carousel/
  theme.ts      shared palette and layout (pure TS, not discovered)
  card-1.tsx    one slide = one PNG, and one page of the PDF
  card-2.tsx
  …
```

`npm run build` renders each slide to its own PNG, which is what a carousel
**ad** takes (Campaign Manager, one image per card). An **organic** LinkedIn
carousel is another animal: the swipeable carousel of the feed is a *document
post*, and what you upload is a single PDF that LinkedIn paginates into slides.
The same images attached directly to a post come out as a mosaic of thumbnails,
not a carousel.

```bash
npm run pdf -- calame/linkedin-carousel    # → out/calame/linkedin-carousel.pdf
```

One slide per page, each page at its slide's exact size, in natural order
(`card-2` before `card-10`). The command refuses to assemble slides of mixed
ratios: LinkedIn takes the whole document's ratio from its first page, so a
stray page would come out letterboxed. In dev, a folder's page offers its PDF
as soon as it exists, and flags it *out of date* when a slide is more recent.

## One project = one set of guidelines

Each brand is a project: its reference in `brands/<project>/` (`brand.md`:
palette, logo, typography; `project.md`: tone, audience, claims), its visuals
in `templates/<project>/`. **`brand.md` is blocking**: no visual without
guidelines; this is what keeps humans and AI alike from inventing colors or
recomposing a logo by eye.

A separate toolchain (`tools/<project>/`) generates the assets rendering cannot
produce: an SVG logotype traced from the font's glyphs, multi-size favicons,
`.ico`. Details:
[`tools/README.md`](https://github.com/roslove44/brand-artisan/blob/main/tools/README.md).

## With an AI agent

BrandArtisan ships **skills** that encode each platform's official dimensions,
safe zones, and the "nothing outside the guidelines" discipline. They install
into whichever agent you use:

```bash
npx skills add roslove44/brand-artisan -s "*" -y
```

`-s "*" -y` takes the whole set and installs into the agents found on your
machine; drop the flags to choose both from a list. The
[`skills` CLI](https://github.com/vercel-labs/skills) knows where Claude Code,
Cursor, Copilot and twenty-odd other agents keep theirs. Rerun the command to
update; a teammate runs it once to get the same set.
Claude Code users can instead add this repository as a plugin marketplace:
`/plugin marketplace add roslove44/brand-artisan`.

These skills read the files you point them at, SVG markup included, and run the
project's own commands. `import-reference` reaches furthest, since its input
comes from outside the project: it treats file content as data to measure, never
as instructions.

```text
/new-project my-brand        sets up the guidelines (brand.md) through an interview
/import-reference            derives the guidelines from your existing visuals, measured to the pixel
/og-image my-brand           1200×630 Open Graph image
/linkedin-post, /facebook-post, /x-post…    visuals to each platform's specs
/campaign my-brand           multi-platform kit from a single brief
/brand-assets my-brand       generates logo, favicon and their variants
```

The agent reads your guidelines, asks the missing questions, and produces
verifiable `.tsx` files (`npm run typecheck`, `npm run build`). Everything can
still be done by hand: AI is an accelerator, not a requirement.

## The CLI

```text
brand-artisan dev                       render server at http://localhost:4000
brand-artisan build                     exports templates/ to out/
brand-artisan pdf <folder>              assembles a folder of slides into a PDF (LinkedIn document post)
brand-artisan colors <image> [count]    an image's palette, measured rather than guessed
```

Commands work from any subfolder of the project. Skills are not part of the
engine: they install per agent (see [With an AI agent](#with-an-ai-agent)) and
`npx skills update` refreshes them.

## The API

```ts
import { brand, root, toPng, renderToFile, type Template } from "brand-artisan";
```

| Export | Role |
| --- | --- |
| `type Template` | A visual's contract: `{ size: { width, height, scale? }, title?, render }`. `scale: 2` for retina. |
| `brand(path)` | Absolute URL to `brands/<path>`, ready for `readFile`. E.g. `brand("calame/logo/logo.svg")`. |
| `root(path)` | Absolute URL resolved from the project root (the nearest `package.json` folder). |
| `toPng(node, size)` | JSX → PNG (`Buffer`). |
| `renderToFile(node, size & { out })` | Same, but writes `out/<out>.png` and returns the path. |

Two subpaths for brand tooling: `brand-artisan/brandkit` (glyph outlines,
SVG → PNG, `.ico`) and `brand-artisan/colors` (palette and painted-area
measurement).

## Contributing

Setup, repo commands, test safety net and conventions:
[`CONTRIBUTING.md`](https://github.com/roslove44/brand-artisan/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/roslove44/brand-artisan/blob/main/LICENSE), with one
exception: the **fonts** in `fonts/` are under the SIL Open Font License 1.1
([`fonts/NOTICE.md`](https://github.com/roslove44/brand-artisan/blob/main/fonts/NOTICE.md)).
Calame, the repository's demonstration brand, is covered by MIT like everything
else: it is fictional, and it is there to be a starting point.
