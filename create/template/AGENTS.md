# AGENTS.md

Instructions for any AI agent working in this project. It renders brand visuals:
JSX in, PNG out, through
[BrandArtisan](https://github.com/roslove44/brand-artisan).

## The blocking rule

**No visual without guidelines.** `brands/<project>/brand.md` holds the palette,
the typography and the logo. Read it before composing or editing anything, and
align on it. If it does not exist, stop and ask for it to be set up first: never
invent a color, substitute a font, or recompose a logo by eye.

`brands/<project>/project.md` holds the substance and the voice (pitch,
audience, tone, permitted claims). Read it before writing any text on a visual.
If it is missing, ask for the tone and the claims instead of guessing, and never
fabricate a figure or a promise.

## Calame is an example, not a model

`calame` ships with BrandArtisan as a worked example. Read its code to learn the
API (the `Template` contract, `brand()`, the `tools/` scripts); never carry its
palette, its type or its compositions into another brand. A new project starts
from its own `brand.md` and `project.md`.

## Where things live

| Path | Role |
| --- | --- |
| `brands/<project>/` | The guidelines, plus the brand assets consumed by `brand()`. |
| `templates/<project>/*.tsx` | One file = one image. Default-exports `{ size, title?, render }`. |
| `tools/<project>/*.ts` | Scripts that produce brand assets (logo, favicon, `.ico`). |
| `fonts/` | The fonts and their licenses. Satori reaches no system font. |
| `out/` | Generated PNGs. Never edited by hand, never committed. |

## Three Satori rules

- **Any element with several children must be `display: flex`.** This is the
  number one cause of render errors.
- **Fonts are explicit**: dropping a `<Family>-<weight>.ttf` into `fonts/` is
  what registers it. Nothing outside that folder is available.
- **Images are embedded as data URIs**, never referenced by file path.

## Verify, do not assume

`npm run typecheck`, then `npm run build`. A visual that renders is the only
proof that it works: the type checker cannot catch a Satori layout error, and a
broken layout fails at render time.

## How to work

- **Think first.** Several readings of a request: name them and ask, never pick
  one in silence. Unclear: stop and say what is unclear.
- **Simplest thing that works.** No unrequested feature, no abstraction for
  single-use code, no flexibility nobody asked for.
- **Surgical changes.** Touch only what the request needs. No drive-by
  refactor, no reformatting, no comment cleanup. Match the surrounding style.
- **Never change code you have not read.**
- **Be frank.** A simpler approach, a flaw in the brief, a bad idea: say it.
- **Ask before `git commit` or `git push`.** Neither happens without an
  explicit go-ahead, and a go-ahead to commit is not one to push.

## Compose, do not fill

A visual is not text on a background. One focal point, a strong contrast of
scale between title and kicker, deliberate empty space, a limited palette with a
single accent. Anything that does not serve the message comes out. All of it
inside the guidelines: the craft is in the composition, never in an invented
color.

## Skills

The recipes for each platform (Open Graph, LinkedIn, Facebook, X, carousels,
brand assets) ship as agent skills. If they are not installed yet:

```bash
npx skills add roslove44/brand-artisan -s "*" -y
```

They encode the official dimensions and safe zones, so prefer them over
reverse-engineering an existing template.
