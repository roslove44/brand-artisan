"""Instanciation d'une police variable et extraction de glyphes en chemins SVG."""

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen


def load_instanced(font_path, axes):
    """Charge une police variable instanciee a `axes` (ex. {"wght": 700}).

    Renvoie (glyphset, cmap, hmtx) prets a composer un logotype.
    """
    f = TTFont(str(font_path))
    instantiateVariableFont(f, axes, inplace=True)
    return f.getGlyphSet(), f.getBestCmap(), f["hmtx"].metrics


def glyph_path(glyphset, name):
    """Renvoie (commandes SVG `d`, bounds) d'un glyphe. bounds vaut None si vide."""
    pen = SVGPathPen(glyphset)
    glyphset[name].draw(pen)
    bp = BoundsPen(glyphset)
    glyphset[name].draw(bp)
    return pen.getCommands(), bp.bounds
