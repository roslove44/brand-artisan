"""Genere le favicon ComptaOpen (icones + apple-icon + favicon.ico) via brandkit.

Sortie : out/comptaopen/withtool/favicon/ (artefacts a promouvoir vers
assets/comptaopen/favicon/ apres revue). Pour ecrire directement dans les
assets, changer OUT_BASE ci-dessous.
"""

import sys
import pathlib
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))  # src/tools -> import brandkit
from brandkit import render_svg, make_ico

ROOT = HERE.parents[2]  # src/tools/comptaopen -> repo root
OUT_BASE = ROOT / "out" / "comptaopen" / "withtool"  # -> "assets" / "comptaopen" pour ecrire en place
OUT = OUT_BASE / "favicon"
OUT.mkdir(parents=True, exist_ok=True)

BLUE = "#1d4ed8"

# Les deux arcs du bracket-O, couleur parametrable (blanc sur tuile, bleu en mark).
def arcs(c="#fff"):
    return (
        f'<path d="M62.97 27.54 A25.93 25.93 0 0 1 62.97 72.46" fill="none" stroke="{c}" '
        'stroke-width="12.13" stroke-linecap="round"/>'
        f'<path d="M37.03 27.54 A25.93 25.93 0 0 0 37.03 72.46" fill="none" stroke="{c}" '
        'stroke-width="12.13" stroke-linecap="round"/>'
    )

ICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
        'role="img" aria-label="ComptaOpen"><rect width="100" height="100" rx="22" fill="#1d4ed8"/>'
        + arcs() + '</svg>')
ICON_SQUARE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
               'role="img" aria-label="ComptaOpen"><rect width="100" height="100" fill="#1d4ed8"/>'
               + arcs() + '</svg>')

(OUT / "icon.svg").write_text(ICON, encoding="utf-8")
(OUT / "icon-square.svg").write_text(ICON_SQUARE, encoding="utf-8")

def render(svg_name, px, out, vb=100):
    # vecteurs mis a l'echelle de la resolution cible -> net, centre, sans crop
    render_svg(OUT / svg_name, px, px, vb, vb).save(str(OUT / out), "PNG")

for n in (16, 32, 48, 64, 180, 192, 512):
    render("icon.svg", n, f"icon-{n}.png")
render("icon-square.svg", 180, "apple-icon.png")

make_ico(OUT / "icon.svg", OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# Declinaisons OAuth 120px : mark seul (arcs bleus), mark sur fond blanc, tuile.
# Le mark agrandit les arcs pour remplir le cadre : leur bbox @100 est
# [17.92, 82.08] x [21.42, 78.58] (centree 50,50). On mappe le centre sur (60,60)
# et on met a l'echelle 110/64.166 = 1.7144 dans un cadre de 120 (marge ~5px).
ARC_FILL = '<g transform="translate(60,60) scale(1.7144) translate(-50,-50)">' + arcs(BLUE) + '</g>'
OAUTH_MARK = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
              f'role="img" aria-label="ComptaOpen">{ARC_FILL}</svg>')
OAUTH_MARK_WHITE = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" '
                    f'role="img" aria-label="ComptaOpen"><rect width="120" height="120" fill="#ffffff"/>{ARC_FILL}</svg>')

def render_str(svg, out, vb=120):
    tmp = OUT / "_oauth_tmp.svg"
    tmp.write_text(svg, encoding="utf-8")
    render_svg(tmp, vb, vb, vb, vb).save(str(OUT / out), "PNG")
    tmp.unlink()

render_str(OAUTH_MARK, "oauth-120-mark.png")
render_str(OAUTH_MARK_WHITE, "oauth-120-mark-white.png")
render("icon.svg", 120, "oauth-120-tile.png")  # tuile bleue arrondie + arcs blancs

# validation sur le favicon 32px
im = Image.open(OUT / "icon-32.png").convert("RGBA")
print("corner(1,1)   :", im.getpixel((1, 1)), "(transparent)")
print("left arc(6,16):", im.getpixel((6, 16)), "(blanc)")
print("center(16,16) :", im.getpixel((16, 16)), "(bleu, gap)")
print("right arc(26,16):", im.getpixel((26, 16)), "(blanc)")
print("out:", OUT)
