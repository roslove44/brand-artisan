# Visuals

A [BrandArtisan](https://github.com/roslove44/brand-artisan) visuals project:
images (Open Graph, posts, banners) composed in JSX and rendered to PNG.

```bash
npm run build   # renders everything in templates/ into out/
npm run dev     # preview server on http://localhost:4000
```

## What is in here

| Path | Role |
|---|---|
| `brands/<project>/brand.md` | **The guidelines, blocking**: palette, typography, logo. No visual is composed without it. |
| `brands/<project>/project.md` | Substance and voice: pitch, audience, tone, permitted claims. What the **wording** is based on. |
| `brands/<project>/logo`, `/favicon` | The brand assets, consumed by `brand()`. |
| `templates/<project>/*.tsx` | One file = one image. Default-exports `{ size, title?, render }`. |
| `tools/<project>/*.ts` | Scripts that **produce** brand assets (logo, favicon, `.ico`). |
| `fonts/` | The fonts, with their licenses ([`NOTICE.md`](fonts/NOTICE.md)). Satori reaches no system font. |
| `out/` | The generated PNGs. Ignored by git. |
| `AGENTS.md` | The rules an AI agent follows here. `CLAUDE.md` imports it. |

## Calame, the bundled example

`calame` is a **demo brand**: it does not exist. It is here so the first command
produces something, and to show what complete guidelines and a composed visual
look like. Read `brands/calame/brand.md`, then `templates/calame/og.tsx`.

Delete `brands/calame/`, `templates/calame/` and `tools/calame/` once you no
longer need them.

## Your brand

With an AI agent, the skills do the work:

```
/new-project my-brand      # writes brands/my-brand/brand.md (blocking) and project.md
/og-image my-brand         # a share image aligned with the guidelines
/linkedin-post my-brand    # same for LinkedIn, Facebook, X…
/brand-assets my-brand     # generates the logo and favicon through the toolchain
```

If you skipped them when the project was created, they install whenever you
like, into whichever agent you use:

```bash
npx skills add roslove44/brand-artisan -s "*" -y
```

`npx skills update` refreshes them afterwards.

## One thing in package.json

```json
"allowScripts": { "esbuild": false }
```

npm 12 blocks install scripts unless you allow them, and `esbuild` (reached
through the engine's TypeScript loader) ships one. It is not needed here: esbuild
delivers its platform binary through `optionalDependencies`, and rendering works
without the script. The line records that decision so npm stops asking.

It is your project, so it is your call. `npm install-scripts approve esbuild`
allows it instead, which is worth doing on a platform where the optional package
does not install.
