import os
import skia
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "logo")
os.makedirs(OUT, exist_ok=True)
FONT = os.path.join(HERE, "_sora.ttf")

INK = "#0f172a"; BLUE = "#1d4ed8"
LIGHT = "#f8fafc"; LIGHT_BLUE = "#60a5fa"; WHITE = "#ffffff"
CAP_TOP = 751.5; LS = -30; O_MARGIN = 20; O_BOX = 865; BASE = CAP_TOP; PAD = 48

BRACKET = (
    '<path d="M257.25 82 A350.5 350.5 0 0 0 257.25 689" fill="none" stroke="{c}" '
    'stroke-width="164" stroke-linecap="round"/>'
    '<path d="M607.75 82 A350.5 350.5 0 0 1 607.75 689" fill="none" stroke="{c}" '
    'stroke-width="164" stroke-linecap="round"/>'
)

f = TTFont(FONT)
instantiateVariableFont(f, {"wght": 700}, inplace=True)
gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"].metrics

minx = 1e9; maxx = -1e9; miny = 1e9; maxy = -1e9
def add_ink(x0, x1, y0, y1):
    global minx, maxx, miny, maxy
    minx = min(minx, x0); maxx = max(maxx, x1); miny = min(miny, y0); maxy = max(maxy, y1)

items = []  # (d, x, role)
x = 0.0
def place(s, role):
    global x
    for ch in s:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs); gs[name].draw(pen)
        bp = BoundsPen(gs); gs[name].draw(bp)
        d = pen.getCommands()
        if d.strip():
            items.append((d, x, role))
            gx0, gy0, gx1, gy1 = bp.bounds
            add_ink(x + gx0, x + gx1, BASE - gy1, BASE - gy0)
        x += hmtx[name][0] + LS

place("COMPTA", "compta")
x += O_MARGIN; bracket_x = x
add_ink(bracket_x, bracket_x + O_BOX, 0, 771)
x += O_BOX + O_MARGIN + LS
place("PEN", "open")

VBX = minx - PAD; VBY = miny - PAD; VBW = (maxx - minx) + 2 * PAD; VBH = (maxy - miny) + 2 * PAD

def build(compta_c, open_c):
    g = []
    for d, xx, role in items:
        c = compta_c if role == "compta" else open_c
        g.append(f'<g fill="{c}" transform="translate({xx:.2f},{BASE}) scale(1,-1)"><path d="{d}"/></g>')
    g.append(f'<g transform="translate({bracket_x:.2f},0)">{BRACKET.format(c=open_c)}</g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VBX:.2f} {VBY:.2f} {VBW:.2f} {VBH:.2f}" '
            f'width="{VBW:.0f}" height="{VBH:.0f}" role="img" aria-label="ComptaOpen">' + "".join(g) + "</svg>")

variants = {
    "logo.svg": build(INK, BLUE),
    "logo-dark.svg": build(LIGHT, LIGHT_BLUE),
    "logo-mono.svg": build("currentColor", "currentColor"),
    "logo-mono-white.svg": build(WHITE, WHITE),
    "logo-mono-dark.svg": build(INK, INK),
}
for fn, svg in variants.items():
    with open(os.path.join(OUT, fn), "w", encoding="utf-8") as fh:
        fh.write(svg)

def raster(svg_name, out, white=False, height=360):
    # render at the viewBox's NATIVE size so nothing is cropped, then downscale
    dom = skia.SVGDOM.MakeFromStream(skia.FILEStream(os.path.join(OUT, svg_name)))
    nw, nh = int(round(VBW)), int(round(VBH))
    surf = skia.Surface(nw, nh)
    with surf as canvas:
        if white:
            canvas.clear(skia.ColorWHITE)
        dom.setContainerSize(skia.Size(nw, nh))
        dom.render(canvas)
    tmp = os.path.join(OUT, "_native.png")
    surf.makeImageSnapshot().save(tmp, skia.kPNG)
    target_w = int(round(height * (VBW / VBH)))
    Image.open(tmp).convert("RGBA").resize((target_w, height), Image.LANCZOS).save(os.path.join(OUT, out))
    os.remove(tmp)

raster("logo.svg", "logo.png")
raster("logo.svg", "logo-white.png", white=True)
raster("logo-dark.svg", "logo-dark.png")     # transparent, light colors (place on dark)
print(f"viewBox {VBW:.0f}x{VBH:.0f}  aspect {VBW/VBH:.2f}")
print("files:", sorted(os.listdir(OUT)))
