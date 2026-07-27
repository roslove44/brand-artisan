"""Genere le favicon Rostand Migan : monogramme RM (icones + apple-icon + .ico).

Le mark est le monogramme RM en Geist 700, centre sur une tuile. Sortie :
out/rostand-migan/withtool/favicon/ (a promouvoir vers
brands/rostand-migan/favicon/ apres revue). Pour ecrire directement dans les
assets, changer OUT_BASE ci-dessous.
"""

import sys
import pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]  # tools/rostand-migan -> racine du depot
sys.path.insert(0, str(ROOT / "src"))  # -> import brandkit
from brandkit import load_instanced, glyph_path, render_svg, make_ico

OUT_BASE = ROOT / "out" / "rostand-migan" / "withtool"  # -> "brands" / "rostand-migan" pour ecrire en place
OUT = OUT_BASE / "favicon"
OUT.mkdir(parents=True, exist_ok=True)
FONT = HERE / "_geist.ttf"

BLUE = "#2563eb"; WHITE = "#ffffff"
LS = 0.0          # tracking entre R et M (unites police)
BOX = 62.0        # cote de la zone occupee par le monogramme dans la tuile 100x100

# --- Compose le monogramme RM en chemins Geist 700, en coordonnees police (Y up) ---
gs, cmap, hmtx = load_instanced(FONT, {"wght": 700})

glyphs = []  # (d, pen_x)
x = 0.0
minx = 1e9; maxx = -1e9; miny = 1e9; maxy = -1e9
for ch in "RM":
    name = cmap[ord(ch)]
    d, bounds = glyph_path(gs, name)
    gx0, gy0, gx1, gy1 = bounds
    glyphs.append((d, x))
    minx = min(minx, x + gx0); maxx = max(maxx, x + gx1)
    miny = min(miny, gy0); maxy = max(maxy, gy1)
    x += hmtx[name][0] + LS

W = maxx - minx; H = maxy - miny
cx = (minx + maxx) / 2; cy = (miny + maxy) / 2
k = BOX / max(W, H)  # echelle uniforme pour tenir dans BOX, centre en (50,50)

INNER = "".join(f'<g transform="translate({gx:.2f},0)"><path d="{d}"/></g>' for d, gx in glyphs)

def mono(c):
    # translate(50,50) place le centre du mark au centre de la tuile ; scale(k,-k)
    # met a l'echelle et inverse l'axe Y (police Y-up -> SVG Y-down).
    return (f'<g fill="{c}" transform="translate(50,50) scale({k:.5f},{-k:.5f}) '
            f'translate({-cx:.3f},{-cy:.3f})">{INNER}</g>')

SVG_OPEN = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
            'role="img" aria-label="Rostand Migan">')

# Tuile bleue + RM blanc (favicon principal).
ICON = SVG_OPEN + f'<rect width="100" height="100" rx="22" fill="{BLUE}"/>' + mono(WHITE) + '</svg>'
ICON_SQUARE = SVG_OPEN + f'<rect width="100" height="100" fill="{BLUE}"/>' + mono(WHITE) + '</svg>'

# Variantes sans tuile. Mark sur transparent : bleu pour fonds clairs, blanc pour
# fonds sombres. Blanc opaque (rounded / square) : RM bleu.
ICON_MARK = SVG_OPEN + mono(BLUE) + '</svg>'                                                       # transparent, RM bleu
ICON_WHITE_MARK = SVG_OPEN + mono(WHITE) + '</svg>'                                                # transparent, RM blanc
ICON_WHITE = SVG_OPEN + f'<rect width="100" height="100" rx="22" fill="{WHITE}"/>' + mono(BLUE) + '</svg>'  # blanc rounded
ICON_WHITE_SQUARE = SVG_OPEN + f'<rect width="100" height="100" fill="{WHITE}"/>' + mono(BLUE) + '</svg>'   # blanc square

(OUT / "icon.svg").write_text(ICON, encoding="utf-8")
(OUT / "icon-square.svg").write_text(ICON_SQUARE, encoding="utf-8")
(OUT / "icon-mark.svg").write_text(ICON_MARK, encoding="utf-8")
(OUT / "icon-white-mark.svg").write_text(ICON_WHITE_MARK, encoding="utf-8")
(OUT / "icon-white.svg").write_text(ICON_WHITE, encoding="utf-8")
(OUT / "icon-white-square.svg").write_text(ICON_WHITE_SQUARE, encoding="utf-8")

def render(svg_name, px, out, vb=100):
    # vecteurs mis a l'echelle de la resolution cible -> net, centre, sans crop
    render_svg(OUT / svg_name, px, px, vb, vb).save(str(OUT / out), "PNG")

for n in (16, 32, 48, 64, 180, 192, 512):
    render("icon.svg", n, f"icon-{n}.png")
render("icon-square.svg", 180, "apple-icon.png")

make_ico(OUT / "icon.svg", OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# validation sur le favicon 32px : coin = tuile bleue, centre = trait blanc d'une lettre
im = Image.open(OUT / "icon-32.png").convert("RGBA")
print("monogram scale k:", round(k, 4), "| W/H police:", round(W), round(H))
print("corner(2,2)   :", im.getpixel((2, 2)), "(tuile bleue)")
print("center(16,16) :", im.getpixel((16, 16)), "(trait du M, blanc attendu)")
print("out:", OUT)
print("files:", sorted(p.name for p in OUT.iterdir()))
