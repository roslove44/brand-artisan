# Fonts shipped with BrandArtisan

Satori does not access any system font: the files must be present in the
repository. These are **redistributed under the SIL Open Font License 1.1**,
whose text travels with the files as the OFL requires.

| File | Family | Authors | License | Source |
|---|---|---|---|---|
| `Geist-400.ttf`, `Geist-600.ttf`, `Geist-700.ttf` | Geist | The Geist Project Authors (Andrés Briganti, Mateo Zaragoza, Basement.studio, Vercel) | OFL 1.1, [`OFL-Geist.txt`](OFL-Geist.txt) | [vercel/geist-font](https://github.com/vercel/geist-font) |
| `GeistMono-400.ttf`, `GeistMono-600.ttf` | Geist Mono | same | OFL 1.1, [`OFL-Geist.txt`](OFL-Geist.txt) | [vercel/geist-font](https://github.com/vercel/geist-font) |
| `Sora-500.ttf`, `Sora-700.ttf` | Sora | The Sora Project Authors | OFL 1.1, [`OFL-Sora.txt`](OFL-Sora.txt) | [google/fonts](https://github.com/google/fonts/tree/main/ofl/sora) |

The Geist files are **statics instanced** from the original variable font; the
OFL covers these modified versions, provided the font's reserved name is not
reused for a modified version distributed under that name.

## Adding a font

Dropping the file here is all it takes: `src/render.ts` scans this folder at
startup, there is no declaration to write in the code. Four conditions:

1. **A license compatible with redistribution** (OFL, Apache 2.0, public
   domain). A font bought under a proprietary license does not get committed
   to a public repository: keep it out of the repo.
2. **`.ttf` or `.otf` format.** Satori does not read `woff2`.
3. **File name: `<Family>-<weight>.ttf`.** It is the source of truth; a file
   outside the convention fails the render at startup with an explicit
   message. The family is written in PascalCase and the words are split on
   read: `GeistMono-600.ttf` gives the family `Geist Mono` at weight 600,
   which is the exact name to use in a template's `fontFamily`. A name that
   already contains a space is kept as is (`DM Sans-400.ttf`).
4. **Drop the license text here** (`OFL-<Font>.txt` or equivalent) and add a
   row to the table above.

Only `.ttf` and `.otf` files are read: the license files in this folder are
ignored by the scan.
