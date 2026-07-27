"""Rend les icones ComptaOpen en PNG 120px pour les ecrans de consentement Google OAuth.

Source : les `icon*.svg` produits par build_favicon.py
         (out/comptaopen/withtool/favicon/) -> lancer build_favicon.py d'abord.
Sortie : out/comptaopen/withtool/favicon/oauth/ (120x120, taille recommandee par Google).
"""

import sys
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]  # tools/comptaopen -> racine du depot
sys.path.insert(0, str(ROOT / "src"))  # -> import brandkit
from brandkit import render_svg

SRC = ROOT / "out" / "comptaopen" / "withtool" / "favicon"
OUT = SRC / "oauth"
OUT.mkdir(parents=True, exist_ok=True)

SIZE = 120  # taille recommandee par Google pour le logo OAuth

svgs = sorted(SRC.glob("icon*.svg"))
if not svgs:
    sys.exit(f"Aucun icon*.svg dans {SRC} : lancer build_favicon.py d'abord.")

for svg in svgs:
    out = OUT / f"{svg.stem}-{SIZE}.png"  # ex. icon-square.svg -> icon-square-120.png
    render_svg(svg, SIZE, SIZE, 100, 100).save(str(out), "PNG")
    print("->", out.name)
print("out:", OUT)
