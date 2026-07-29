# create-brand-artisan

[![npm](https://img.shields.io/npm/v/create-brand-artisan)](https://www.npmjs.com/package/create-brand-artisan)
[![CI](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml/badge.svg)](https://github.com/roslove44/brand-artisan/actions/workflows/ci.yml)

Creates a [BrandArtisan](https://github.com/roslove44/brand-artisan) visuals
project, ready to render: you compose your images in JSX (OG images, LinkedIn,
Facebook and X posts and banners), the engine turns them into PNGs. No Figma,
no browser.

```bash
npx create-brand-artisan my-visuals
cd my-visuals
npm run build   # renders the bundled example to out/
npm run dev     # browsable preview at http://localhost:4000
```

The skeleton is not empty: it ships **Calame**, a complete fictional demo brand
(guidelines, voice, logo, favicon, toolchain, one visual). The first command
therefore produces an image before you have written anything. Replace Calame
with your brand, then delete it.

## What the command does

1. Copies the skeleton into the target folder, which must be empty: guidelines
   (`brands/`), visuals (`templates/`), asset scripts (`tools/`), fonts
   (`fonts/`).
2. Runs `npm install`: the
   [`brand-artisan`](https://www.npmjs.com/package/brand-artisan) engine lands
   in `node_modules`, like Next for a Next user. It updates with `npm update`;
   your project contains only your brand.
3. Offers to install the skills into your AI agent, whichever it is, with
   [`npx skills add roslove44/brand-artisan`](https://github.com/vercel-labs/skills):
   `/new-project`, `/og-image`, `/linkedin-post`, `/campagne`… to produce visuals
   aligned with your guidelines. Declining changes nothing about rendering.

Usage: `npx create-brand-artisan [folder] [--no-install]`. Without a folder,
the project is created in the current directory. `--no-install` copies the
files without running `npm install`.

The full documentation (CLI, template contract, API, brand toolchain, skills)
lives in the
[brand-artisan README](https://github.com/roslove44/brand-artisan#readme).

## License

MIT. The skeleton's fonts (`fonts/`) are under the SIL Open Font License 1.1;
see `fonts/NOTICE.md` in the generated project.
