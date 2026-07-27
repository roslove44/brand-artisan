"""Tests du socle brandkit : la plomberie generique de la toolchain de marque.

Ne touche ni brands/ ni tools/ : ce qui est verifie ici, c'est le moteur, pas le
contenu. Les fixtures sont fabriquees a la volee, la seule ressource du depot
utilisee est une police de fonts/, qui appartient au moteur.

Non couvert : load_instanced, qui exige une police *variable*. Les seules du
depot vivent dans tools/<projet>/, donc dans le contenu d'une marque : les
utiliser recoupleraient ce test a un projet particulier. Le jour ou le socle
embarquera sa propre police variable, le trou se comblera ici.
"""

import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from brandkit import glyph_path, make_ico, render_svg  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from PIL import Image  # noqa: E402

# Carre rouge centre, dans un viewBox de 100x100 unites utilisateur.
SQUARE = (
    b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
    b'<rect x="20" y="20" width="60" height="60" fill="#ff0000"/></svg>'
)


class BrandkitTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = pathlib.Path(self.tmp.name)
        self.svg = self.dir / "square.svg"
        self.svg.write_bytes(SQUARE)
        self.addCleanup(self.tmp.cleanup)

    def assertBox(self, img, expected):
        """Boite englobante du dessin, a l'antialiasing pres (1 px de tolerance).

        C'est elle qui porte la mise a l'echelle : un pixel central reste de la
        meme couleur quel que soit le facteur, ses bords non.
        """
        box = img.getbbox()
        for got, want in zip(box, expected):
            self.assertLessEqual(abs(got - want), 1, f"boite {box}, attendue {expected}")

    def test_render_svg_met_a_l_echelle_du_conteneur(self):
        """64 px de surface pour 100 unites de conteneur : facteur 0,64."""
        img = render_svg(self.svg, 64, 64, 100, 100)
        self.assertEqual(img.size, (64, 64))
        self.assertEqual(img.mode, "RGBA")
        self.assertEqual(img.getpixel((32, 32)), (255, 0, 0, 255))
        self.assertEqual(img.getpixel((2, 2))[3], 0)
        # Le rect va de 20 a 80 unites : 12,8 a 51,2 px une fois mis a l'echelle.
        self.assertBox(img, (13, 13, 51, 51))

    def test_render_svg_fond_blanc_optionnel(self):
        img = render_svg(self.svg, 64, 64, 100, 100, white_bg=True)
        self.assertEqual(img.getpixel((2, 2)), (255, 255, 255, 255))
        self.assertEqual(img.getpixel((32, 32)), (255, 0, 0, 255))

    def test_render_svg_echelle_non_uniforme(self):
        """Surface 120x40 pour un conteneur 100x100 : x1,2 en largeur, x0,4 en hauteur."""
        img = render_svg(self.svg, 120, 40, 100, 100)
        self.assertEqual(img.size, (120, 40))
        # Le rect 20-80 devient 24-96 en x, 8-32 en y.
        self.assertBox(img, (24, 8, 96, 32))

    def test_make_ico_multi_resolution(self):
        ico = self.dir / "favicon.ico"
        make_ico(self.svg, ico, sizes=[(16, 16), (32, 32), (48, 48)])
        self.assertTrue(ico.exists() and ico.stat().st_size > 0)
        with Image.open(ico) as img:
            self.assertEqual(img.format, "ICO")
        # En-tete ICO : octets 4-5 = nombre d'images, octet 6 = largeur de la premiere.
        head = ico.read_bytes()[:8]
        self.assertEqual(int.from_bytes(head[4:6], "little"), 3)
        self.assertEqual(head[6], 16)

    def test_glyph_path_rend_les_commandes_et_les_bounds(self):
        font = TTFont(str(ROOT / "fonts" / "Geist-700.ttf"))
        glyphset, cmap = font.getGlyphSet(), font.getBestCmap()

        commands, bounds = glyph_path(glyphset, cmap[ord("A")])
        self.assertTrue(commands.startswith("M"), commands[:20])
        xmin, ymin, xmax, ymax = bounds
        self.assertLess(xmin, xmax)
        self.assertLess(ymin, ymax)

        # Glyphe vide : bounds None, comme documente.
        _, empty = glyph_path(glyphset, cmap[ord(" ")])
        self.assertIsNone(empty)


if __name__ == "__main__":
    unittest.main()
