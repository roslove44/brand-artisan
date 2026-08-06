# Device frames

Device shells (phones, tablets, laptops, TVs, a few industry terminals) for
placing a mockup inside a visual, with the exact coordinates of their screen.

## Rights

> The devices shown carry registered trademarks (Apple, Samsung, Google).
> Reusing them in published material is not covered by any license granted to
> this project. The `non-branded-android-smartphone` model is the only one with
> no visible brand.

## Choosing a model

72 models, each with a folder and a `catalog.ts` entry; the slug is the folder
name. Every entry carries a `category` (`smartphone`, `tablet`, `others`) and a
`brand`, enough to walk the catalog without reading it:

```ts
import { devices } from "../../assets/devices/frame";

const tablets = Object.entries(devices).filter(([, d]) => d.category === "tablet");
```

## Placing a frame

**Order matters.** The frame's panel is black and opaque: the frame **first**,
the visual **on top**. A visual placed underneath would not show through. The
notch then ends up covered, just as on a real screenshot.

```tsx
import { frame } from "../../assets/devices/frame";

const f = await frame("apple-iphone-15-pro-2023", 300);

// In the render:
<div style={{ display: "flex", position: "relative", width: f.width, height: f.height }}>
  <img src={f.src} width={f.width} height={f.height} alt=""
       style={{ position: "absolute", left: 0, top: 0 }} />
  <div
    style={{
      position: "absolute",
      left: f.screen.x, top: f.screen.y,
      width: f.screen.width, height: f.screen.height,
      borderRadius: f.screen.radius,
      display: "flex",
      // the visual goes here: flat color, gradient, or an <img> screenshot
    }}
  />
</div>
```

`frame(slug, width)` scales everything to the requested width, screen
coordinates included: nothing left to compute.

### Render the template at `scale: 2`

These PNGs are **palette-indexed** and their transparency only holds **4 to 16
alpha levels** depending on the model, where a smooth edge needs 256. Placed
small, they go through heavy downscaling (an 864 px phone rendered at 200 is
4.3x) and resvg subsamples: the outline breaks into stair steps and grey
speckle, very visible on the curved edges of a phone.

The remedy is one field:

```ts
const SIZE = { width: 1080, height: 1350, scale: 2 };
```

The engine then renders at 2160 px and the reduction is down to 2.2x. The edge
is clean again. Reserve this for visuals that contain a frame: a purely vector
template does not have the problem and has nothing to gain from it.

## Adding a model

The catalog and the folder contents mirror each other exactly, and holding that
agreement is the rule: a `device.png` without its entry has no screen
coordinates. Two steps, in this order.

1. **The frame.** Drop its `device.png` into `assets/devices/<slug>/`, cut out
   along the outside, screen empty.
2. **The measurements.** Add its entry to `catalog.ts`, read off the dark panel
   visible on the frame.

| Field | Meaning |
| --- | --- |
| `image` | dimensions of `device.png` |
| `viewport` | logical window size, in CSS px |
| `screen` | screen area **in image pixels**: `x`, `y`, `width`, `height` |
| `screen.radius` | corner radius, in image pixels, or `null` |

**`viewport` and `screen` are not in the same unit.** The first is the logical
page size, the second image pixels, and the frames are rendered at 2x: `screen`
is therefore twice `viewport` across the whole catalog. `screen` is what places
a visual; `viewport` only documents the simulated resolution. `radius` is `0` on
square screens (laptops, iMac), and `null` when no single radius stands out:
`frame` then falls back to 0, to be rounded by eye.

**Check rather than trust.** These numbers look plausible even when they are
wrong, and nothing in the code will contradict them. The check is one render:
place a bright flat color at `f.screen` over the frame, as in the example above,
then adjust until the color fills the panel without spilling onto the bezel and
its corners follow the rounding. That is also how `radius` is found: raise it
until the corners coincide. This check has already ruled out a dual-panel device
that a single rectangle could not represent; any model with an undetermined
`radius` deserves the same scrutiny.
