"""Genere le logotype Rostand Migan : wordmark "rostand.dev" (variantes SVG + PNG).

Le wordmark est compose en Geist 700, decoupe en deux registres de couleur :
"rostand" en encre, ".dev" en accent bleu (la TLD mise en avant). Sortie :
out/rostand-migan/withtool/logo/ (a promouvoir vers brands/rostand-migan/logo/
apres revue). Pour ecrire directement dans les assets, changer OUT_BASE.
"""

import sys
import pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]  # tools/rostand-migan -> racine du depot
sys.path.insert(0, str(ROOT / "src"))  # -> import brandkit
from brandkit import load_instanced, glyph_path, render_svg

OUT_BASE = ROOT / "out" / "rostand-migan" / "withtool"  # -> "brands" / "rostand-migan" pour ecrire en place
OUT = OUT_BASE / "logo"
OUT.mkdir(parents=True, exist_ok=True)
FONT = HERE / "_geist.ttf"

INK = "#111827"; BLUE = "#2563eb"                 # fond clair
LIGHT = "#f8fafc"; LIGHT_BLUE = "#60a5fa"         # fond sombre (Tailwind slate-50 / blue-400)
WHITE = "#ffffff"
LS = 0.0          # tracking (unites police) ; Geist est deja bien cale
BASE = 1000.0     # repere de baseline pour le flip Y (valeur arbitraire, annulee par le viewBox)
PAD = 60          # marge autour de l'encre, en unites police

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
        if d.strip() and bounds is not None:
            items.append((d, x, role))
            gx0, gy0, gx1, gy1 = bounds
            add_ink(x + gx0, x + gx1, BASE - gy1, BASE - gy0)
        x += hmtx[name][0] + LS

place("rostand", "name")   # encre
place(".dev", "tld")       # accent bleu (le point compris)

VBX = minx - PAD; VBY = miny - PAD; VBW = (maxx - minx) + 2 * PAD; VBH = (maxy - miny) + 2 * PAD

def build(name_c, tld_c):
    g = []
    for d, xx, role in items:
        c = name_c if role == "name" else tld_c
        g.append(f'<g fill="{c}" transform="translate({xx:.2f},{BASE}) scale(1,-1)"><path d="{d}"/></g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VBX:.2f} {VBY:.2f} {VBW:.2f} {VBH:.2f}" '
            f'width="{VBW:.0f}" height="{VBH:.0f}" role="img" aria-label="rostand.dev">' + "".join(g) + "</svg>")

variants = {
    "logo.svg": build(INK, BLUE),
    "logo-dark.svg": build(LIGHT, LIGHT_BLUE),
    "logo-mono.svg": build("currentColor", "currentColor"),
    "logo-mono-white.svg": build(WHITE, WHITE),
    "logo-mono-dark.svg": build(INK, INK),
}
for fn, svg in variants.items():
    (OUT / fn).write_text(svg, encoding="utf-8")

def raster(svg_name, out, white=False, height=240):
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
