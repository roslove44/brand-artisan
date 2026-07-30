---
name: linkedin-page
description: Creates the visuals for a LinkedIn profile or Page (profile photo, personal banner, company logo, company cover) at LinkedIn's official dimensions. Use when the user wants a "LinkedIn profile photo", a "LinkedIn banner", a "company page banner", a "LinkedIn page logo" or a "LinkedIn cover" for a project. Produces one or more .tsx templates at the sizes LinkedIn imposes, aligned with the brand guidelines, rendered as PNGs through the project's engine. Requires a project with its brand.md in place.
---

# linkedin-page: visuals for a LinkedIn profile / Page

Goal: produce the **PNG assets** of a personal profile or a LinkedIn company
Page, at the **official** dimensions (source: LinkedIn help a563309 / a568217 /
a549049), aligned with the guidelines. Four possible visuals, independent of each
other:

- **profile photo** (personal): the brand, 400×400, cropped to a circle;
- **personal banner**: the profile background, 1584×396 (4:1);
- **company logo** (Page): 400×400;
- **company cover** (Page): the tall banner, 4200×700 (6:1).

This is a specialization of `new-template` with the LinkedIn constraints
hard-coded. Same conventions: the `Template` contract (from `brand-artisan`),
assets through `brand()`, fonts discovered in `fonts/`,
`export default ... satisfies Template`.

## 0. Prerequisites (blocking)

The chain **project -> template folder -> guidelines** must exist:

- Resolve `<project>` (from the arguments, otherwise ask).
- Check `templates/<project>/` **and** `brands/<project>/brand.md`.
- Missing guidelines or project -> **STOP**: ask for `/new-project <project>`
  first. No visual without guidelines (CLAUDE.md rule).

## 1. Frame it

- **Which visual(s)?** Ask: profile, personal banner, company logo, company
  cover. Don't guess.
- Default slugs: `linkedin-profile`, `linkedin-banner`, `linkedin-logo`,
  `linkedin-cover`. Check that the target `.tsx` does not exist.
- Read `brands/<project>/brand.md`: palette, type, the **logo / favicon
  variants** and their rules depending on the background, and the **don'ts**.
- If the project already holds a `.tsx`, read it as a style reference.

## 2. LinkedIn constraints (to respect)

| Visual | Size | Ratio | Weight | Notes |
|---|---|---|---|---|
| Profile photo | **400×400** (min) | 1:1 | ≤ 8 MB | cropped to a **circle** |
| Personal banner | **1584×396** | 4:1 | ≤ 8 MB | profile photo **bottom left** |
| Company logo | **400×400** | 1:1 | ≤ 3 MB | placed on white if transparent |
| Company cover | **4200×700** | 6:1 | ≤ 3 MB | may be cropped to fit |

- **Format**: PNG or JPG. **Opaque** background (our rendering is never
  transparent).
- **Profile & logo**: square, **brand centered**, nothing important in the corners
  (the profile is displayed as a circle). 400×400 is the **minimum**: `scale: 2`
  is advised for a crisp render. For an organization, prefer the **mark alone /
  the favicon** over the full wordmark, which is illegible when small. Follow
  brand.md.
- **Dead zone bottom left (avatar / logo)**: on the page, the profile photo
  (personal) or the logo (company) covers the bottom left of the cover, so any
  text or logo falling there is **hidden**. **The same proportions** apply in both
  cases (left margin **~3.1 %** of the width, box **~16 % W × ~46 % H** anchored
  bottom left); only the **shape of the mask** changes: a **circle**
  (rounded-full) for personal, a **square** for company.
  - Personal banner 1584×396: roughly **x 49→305, y 214→396** (round mask).
  - Company cover 4200×700: roughly **x 130→808, y 378→700** (square mask).
- **Company cover**: LinkedIn may also **crop** it depending on the screen, so
  keep the rest of the content **centered**, with wide margins.

## 3. Write the template(s)

`templates/<project>/<slug>.tsx`, with colors as constants taken from the
guidelines (invent nothing). Keep the code minimal (principle #2). Pick `SIZE`
according to the visual:

```tsx
import type { ReactNode } from "react";
import { brand, type Template } from "brand-artisan";
// import { readFile } from "node:fs/promises"; // if you load the mark

// Pick according to the visual:
const SIZE = { width: 400, height: 400 };   // Profile / logo (scale:2 advised)
// const SIZE = { width: 1584, height: 396 };  // Personal banner 4:1
// const SIZE = { width: 4200, height: 700 };  // Company cover 6:1

// <Project> guideline palette (from brands/<project>/brand.md).
const INK = "#......";

function render(): ReactNode {
	return (
		<div style={{ width: "100%", height: "100%", display: "flex", /* ... */ backgroundColor: INK }}>
			{/* brand centered (profile/logo) OR logo + standfirst in the safe area (banner/cover) */}
		</div>
	);
}

export default { size: SIZE, title: "<Human title>", render } satisfies Template;
```

Shared conventions: assets through `brand("<project>/...")`, fonts discovered in
`fonts/`; a missing font -> the "missing font" appendix in `new-template`, never
silently.

## 4. Verify

- `npm run typecheck` -> green.
- `npm run build` -> writes `out/<project>/<slug>.png`.
- Check each PNG: **exact dimensions** for the visual, opaque background, weight
  under the limit (≤ 8 MB personal, ≤ 3 MB company, trivial with flat rendering).
- Profile/logo: check the **circular crop** (nothing in the corners).
- Banner: nothing important in the **bottom left corner** (profile photo).
- Company cover: content **centered** (cropping is possible).
- Preview: `npm run dev` then `/<project>/<slug>`.

**Success criterion**: PNGs at LinkedIn's exact dimensions, opaque, brand
centered and legible for profile/logo, safe area respected for banner/cover, and
using only colors and type from `brand.md`.
