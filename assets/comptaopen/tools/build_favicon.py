import os
import skia
from PIL import Image

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "favicon")
os.makedirs(OUT, exist_ok=True)

ARCS = (
    '<path d="M62.97 27.54 A25.93 25.93 0 0 1 62.97 72.46" fill="none" stroke="#fff" '
    'stroke-width="12.13" stroke-linecap="round"/>'
    '<path d="M37.03 27.54 A25.93 25.93 0 0 0 37.03 72.46" fill="none" stroke="#fff" '
    'stroke-width="12.13" stroke-linecap="round"/>'
)
ICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
        'role="img" aria-label="ComptaOpen"><rect width="100" height="100" rx="22" fill="#1d4ed8"/>'
        + ARCS + '</svg>')
ICON_SQUARE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" '
               'role="img" aria-label="ComptaOpen"><rect width="100" height="100" fill="#1d4ed8"/>'
               + ARCS + '</svg>')

with open(os.path.join(OUT, "icon.svg"), "w", encoding="utf-8") as f: f.write(ICON)
with open(os.path.join(OUT, "icon-square.svg"), "w", encoding="utf-8") as f: f.write(ICON_SQUARE)

def render(svg_name, px, out, vb=100):
    # scale vectors to the target resolution -> crisp, centered, no crop
    dom = skia.SVGDOM.MakeFromStream(skia.FILEStream(os.path.join(OUT, svg_name)))
    surf = skia.Surface(px, px)
    with surf as canvas:
        canvas.scale(px / vb, px / vb)
        dom.setContainerSize(skia.Size(vb, vb))
        dom.render(canvas)
    surf.makeImageSnapshot().save(os.path.join(OUT, out), skia.kPNG)

for n in (16, 32, 48, 64, 180, 192, 512):
    render("icon.svg", n, f"icon-{n}.png")
render("icon-square.svg", 180, "apple-icon.png")

# favicon.ico (16/32/48) from a crisp 256 render
render("icon.svg", 256, "_ico.png")
Image.open(os.path.join(OUT, "_ico.png")).save(
    os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
os.remove(os.path.join(OUT, "_ico.png"))

# validation on the 32px favicon
im = Image.open(os.path.join(OUT, "icon-32.png")).convert("RGBA")
print("corner(1,1)   :", im.getpixel((1, 1)), "(transparent)")
print("left arc(6,16):", im.getpixel((6, 16)), "(blanc)")
print("center(16,16) :", im.getpixel((16, 16)), "(bleu, gap)")
print("right arc(26,16):", im.getpixel((26, 16)), "(blanc)")
