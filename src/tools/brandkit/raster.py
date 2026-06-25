"""Rasterisation SVG -> PNG via skia, et builder .ico via Pillow."""

import io
import skia
from PIL import Image


def render_svg(svg_path, surface_w, surface_h, container_w, container_h, white_bg=False):
    """Rend un fichier SVG en image PIL RGBA de taille surface_w x surface_h.

    Le SVG est mis en page dans un conteneur de container_w x container_h unites
    utilisateur, puis mis a l'echelle pour remplir la surface.
    - favicon : render_svg(px, px, vb, vb)            -> scale px/vb
    - logo    : render_svg(nw, nh, nw, nh) puis resize -> rendu natif sans crop
    """
    dom = skia.SVGDOM.MakeFromStream(skia.FILEStream(str(svg_path)))
    surface = skia.Surface(int(surface_w), int(surface_h))
    with surface as canvas:
        if white_bg:
            canvas.clear(skia.ColorWHITE)
        canvas.scale(surface_w / container_w, surface_h / container_h)
        dom.setContainerSize(skia.Size(container_w, container_h))
        dom.render(canvas)
    png = bytes(surface.makeImageSnapshot().encodeToData())
    return Image.open(io.BytesIO(png)).convert("RGBA")


def make_ico(svg_path, ico_path, sizes, render_px=256, container=100):
    """Ecrit un .ico multi-resolution depuis un rendu net du SVG."""
    img = render_svg(svg_path, render_px, render_px, container, container)
    img.save(str(ico_path), sizes=sizes)
