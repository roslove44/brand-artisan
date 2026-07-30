---
name: campaign
description: Orchestrates the production of a coherent visual kit across several platforms from a single brief. Use when the user wants "a campaign", "the same thing on Facebook/LinkedIn/X", "a visual kit", "all the visuals for a launch" or "the same announcement on every network". Runs the interview once, consolidates the message from project.md, then delegates to the platform skills (facebook-*, linkedin-*, x-*, og-image). Requires a project with its brand.md (and ideally its project.md) in place.
---

# campaign: a multi-platform visual kit

Goal: produce a **coherent set** of visuals for **several platforms** from **a
single brief**. This skill does not create the images itself: it **runs the
interview once**, consolidates the message, then **delegates** to the platform
skills. It is the conductor; the building blocks stay `og-image`, `facebook-*`,
`linkedin-*`, `x-*`.

> **Guardrail: do not duplicate.** This skill **never** restates a platform's
> dimensions, ratios or constraints: it hands off to the skill concerned and lets
> it apply its own specs. Its own scope is the **brief** and the **coherence** of
> the whole.

## 0. Prerequisites (blocking)

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
  Missing -> **STOP**: `/new-project <project>` first (CLAUDE.md rule).
- Read `brands/<project>/brand.md` (visual identity) **and**
  `brands/<project>/project.md` (substance, voice, claims). `project.md` is the
  foundation of the brief: if it is missing, ask for the tone and the claims
  rather than inventing them.

## 1. Interview (the heart of it: get the best out of the user)

Run it once, leaning on `project.md` so you propose rather than make them guess:

1. **Goal** of the campaign: a launch, promoting a tool, an announcement,
   hiring, an event… (a clear goal means a clear message).
2. **Target platforms**: Facebook, LinkedIn, X, generic OG (and combinations).
3. **Formats wanted** per platform: profile/header, post, carousel, or leave each
   platform skill's defaults.
4. **Key message**: propose **2-3 angles** drawn from `project.md` (the real
   product, the value proposition), then have them **pick and refine**. Never
   invent a figure or a promise outside `project.md`.
5. **Carousel mechanics** if there are any: a story, one card per product, a top
   N, a tutorial, before/after (see the `*-carousel` skills).

Present the choices that are missing, don't settle them in silence (CLAUDE.md
principle #1).

## 2. Consolidated brief

Write a single **master message** (headline + standfirst), then its **tone
variation per platform**: same substance, adapted register. Default landmark (to
be adjusted against `project.md`):

| Platform | Register |
|---|---|
| **LinkedIn** | Professional, added value (insight, business benefit) |
| **X** | Direct, punchy, concise |
| **Facebook** | Accessible, general audience |
| **OG** (sharing) | Neutral, descriptive, straight to the point |

The master message and all its variations stay within the claims **authorized**
by `project.md`.

## 3. Fan-out: delegate to the platform skills

For each (platform, format) pair retained, apply the **matching skill**, passing
it the **already adapted message** and the project. Don't re-frame the
dimensions: the platform skill takes care of that.

| Need | Skill to apply |
|---|---|
| Generic share preview | `og-image` |
| Facebook profile / banner | `facebook-page` |
| Facebook post | `facebook-post` |
| Facebook carousel | `facebook-carousel` |
| LinkedIn profile / banner | `linkedin-page` |
| LinkedIn post | `linkedin-post` |
| LinkedIn carousel | `linkedin-carousel` |
| X profile / header | `x-page` |
| X post | `x-post` |
| X carousel | `x-carousel` |

Cross-platform coherence (`campaign`'s own job):

- **The same master message** everywhere, only the tone and the framing change.
- **The same visual choices** where it makes sense (the same light or dark
  background, the same logo variant), within what `brand.md` allows.
- Coherent slugs: prefix with the campaign where useful (e.g.
  `launch-facebook-post`, `launch-x-post`) to group the output.

## 4. Verify and recap

- `npm run typecheck` -> green; `npm run build` -> writes every PNG.
- Check **each** visual against its platform skill's criterion (dimensions,
  weight, opaque background).
- **Coherence of the kit**: read the whole set side by side; message aligned, tone
  adapted with no break in the brand, claims conforming to `project.md`.
- **Recap**: list the PNGs produced **per platform**, and restate the master
  message you settled on.

**Success criterion**: a multi-platform kit where every visual respects its
platform's specs (delegated), carried by **one coherent master message** varied
by tone, and **entirely anchored in `brand.md` and `project.md`**.
