# BrandArtisan skills

Recipes for composing brand visuals as code: Open Graph images, LinkedIn,
Facebook and X posts, page art, carousels, plus logo and favicon generation.
JSX in, PNG out, no Figma and no browser.

**They need the engine.** These skills drive
[`brand-artisan`](https://www.npmjs.com/package/brand-artisan); on their own they
have nothing to render with.

```bash
npx create-brand-artisan my-visuals               # the project and the engine
npx skills add roslove44/brand-artisan -s "*" -y  # these skills, in your agent
```

## What they do

| Skill | Use it to |
| --- | --- |
| `new-project`, `import-reference` | Set up a brand's guidelines, by interview or measured from visuals you already have |
| `new-template` | Add any visual, aligned with those guidelines |
| `og-image` | 1200x630 share images |
| `linkedin-*`, `facebook-*`, `x-*` | Posts, page art and carousel cards at each platform's official sizes |
| `campaign` | One brief, a coherent kit across every platform |
| `brand-assets` | Logo, favicon and their variants, generated rather than drawn |

None of them will invent a color or a font. The project's `brand.md` is the
authority, and no visual gets composed without it.

## Working on them

This folder is the source; the agent directories are install output. Load your
working copy rather than `main` with `/plugin marketplace add ./`, and never
commit a copy under `.claude/skills/` or `.agents/skills/`.

`npm test` is their only safety net, since neither the type checker nor the build
ever sees them. Two rules it enforces, both learned the hard way:

- **The frontmatter must be valid YAML.** An unquoted scalar cannot contain a
  colon followed by a space, which French typography produces naturally. Both
  readers then fail silently: Claude Code falls back to the body's first
  heading, and the skills CLI skips the file.
- **The description is what triggers invocation.** It states what the skill does
  and when to reach for it, under 1024 characters.

A push to `main` reaches everyone who runs `skills add` or `skills update`, so
rewrite skills on a branch.
