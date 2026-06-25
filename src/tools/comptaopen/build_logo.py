"""Genere le logotype ComptaOpen (toutes variantes SVG + PNG) via brandkit.

Sortie : out/comptaopen/withtool/logo/ (artefacts a promouvoir vers
assets/comptaopen/logo/ apres revue). Pour ecrire directement dans les assets,
changer OUT_BASE ci-dessous.
"""

import sys
import pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))  # src/tools -> import brandkit
from brandkit import load_instanced, glyph_path, render_svg

ROOT = HERE.parents[2]  # src/tools/comptaopen -> repo root
OUT_BASE = ROOT / "out" / "comptaopen" / "withtool"  # -> "assets" / "comptaopen" pour ecrire en place
OUT = OUT_BASE / "logo"
OUT.mkdir(parents=True, exist_ok=True)
FONT = HERE / "_sora.ttf"

INK = "#0f172a"; BLUE = "#1d4ed8"
LIGHT = "#f8fafc"; LIGHT_BLUE = "#60a5fa"; WHITE = "#ffffff"
CAP_TOP = 751.5; LS = -30; O_MARGIN = 20; O_BOX = 865; BASE = CAP_TOP; PAD = 48

BRACKET = (
    '<path d="M257.25 82 A350.5 350.5 0 0 0 257.25 689" fill="none" stroke="{c}" '
    'stroke-width="164" stroke-linecap="round"/>'
    '<path d="M607.75 82 A350.5 350.5 0 0 1 607.75 689" fill="none" stroke="{c}" '
    'stroke-width="164" stroke-linecap="round"/>'
)

gs, cmap, hmtx = load_instanced(FONT, {"wght": 700})

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
        d, bounds = glyph_path(gs, name)
        if d.strip():
            items.append((d, x, role))
            gx0, gy0, gx1, gy1 = bounds
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
    (OUT / fn).write_text(svg, encoding="utf-8")

def raster(svg_name, out, white=False, height=360):
    # rendu a la taille NATIVE du viewBox (rien n'est rogne), puis downscale LANCZOS
    nw, nh = int(round(VBW)), int(round(VBH))
    img = render_svg(OUT / svg_name, nw, nh, nw, nh, white_bg=white)
    target_w = int(round(height * (VBW / VBH)))
    img.resize((target_w, height), Image.LANCZOS).save(str(OUT / out))

raster("logo.svg", "logo.png")
raster("logo.svg", "logo-white.png", white=True)
raster("logo-dark.svg", "logo-dark.png")     # transparent, couleurs claires (a poser sur fond sombre)
print(f"viewBox {VBW:.0f}x{VBH:.0f}  aspect {VBW/VBH:.2f}")
print("out:", OUT)
print("files:", sorted(p.name for p in OUT.iterdir()))
