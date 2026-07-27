"""Genere le favicon ComptaOpen (icones + apple-icon + favicon.ico) via brandkit.

Sortie : out/comptaopen/withtool/favicon/ (artefacts a promouvoir vers
brands/comptaopen/favicon/ apres revue). Pour ecrire directement dans les
assets, changer OUT_BASE ci-dessous.
"""

import sys
import pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))  # src/tools -> import brandkit
from brandkit import render_svg, make_ico

ROOT = HERE.parents[2]  # src/tools/comptaopen -> repo root
OUT_BASE = ROOT / "out" / "comptaopen" / "withtool"  # -> "brands" / "comptaopen" pour ecrire en place
OUT = OUT_BASE / "favicon"
OUT.mkdir(parents=True, exist_ok=True)

# Les deux arcs du bracket-O, couleur parametrable (blanc sur tuile, bleu en mark).
def arcs(c="#fff"):
    return (
        f'<path d="M62.97 27.54 A25.93 25.93 0 0 1 62.97 72.46" fill="none" stroke="{c}" '
        'stroke-width="12.13" stroke-linecap="round"/>'
        f'<path d="M37.03 27.54 A25.93 25.93 0 0 0 37.03 72.46" fill="none" stroke="{c}" '
        'stroke-width="12.13" stroke-linecap="round"/>'
    )

SVG_OPEN = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
            'role="img" aria-label="ComptaOpen">')

# Tuile bleue + bracket blanc (favicon principal).
ICON = SVG_OPEN + '<rect width="100" height="100" rx="22" fill="#1d4ed8"/>' + arcs() + '</svg>'
ICON_SQUARE = SVG_OPEN + '<rect width="100" height="100" fill="#1d4ed8"/>' + arcs() + '</svg>'

# Variantes sans tuile. Mark sur transparent : bleu pour fonds clairs, blanc pour
# fonds sombres. Blanc opaque (rounded / square) : bracket bleu.
ICON_MARK = SVG_OPEN + arcs("#1d4ed8") + '</svg>'                                                  # transparent, bracket bleu
ICON_WHITE_MARK = SVG_OPEN + arcs("#ffffff") + '</svg>'                                            # transparent, bracket blanc
ICON_WHITE = SVG_OPEN + '<rect width="100" height="100" rx="22" fill="#ffffff"/>' + arcs("#1d4ed8") + '</svg>'   # blanc rounded
ICON_WHITE_SQUARE = SVG_OPEN + '<rect width="100" height="100" fill="#ffffff"/>' + arcs("#1d4ed8") + '</svg>'    # blanc square

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

# validation sur le favicon 32px
im = Image.open(OUT / "icon-32.png").convert("RGBA")
print("corner(1,1)   :", im.getpixel((1, 1)), "(transparent)")
print("left arc(6,16):", im.getpixel((6, 16)), "(blanc)")
print("center(16,16) :", im.getpixel((16, 16)), "(bleu, gap)")
print("right arc(26,16):", im.getpixel((26, 16)), "(blanc)")
print("out:", OUT)
