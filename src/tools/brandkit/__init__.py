"""brandkit — socle partage de la toolchain de marque OgArtisan.

Plomberie reutilisable (skia SVG -> PNG, builder .ico, instanciation de police
variable + extraction de glyphes). La geometrie et les couleurs propres a une
marque vivent dans ses scripts (src/tools/<projet>/), pas ici.
"""

from .raster import render_svg, make_ico
from .fonts import load_instanced, glyph_path

__all__ = ["render_svg", "make_ico", "load_instanced", "glyph_path"]
