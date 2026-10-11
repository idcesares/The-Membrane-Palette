"""Outline the brand marks (DESIGN-SYSTEM.md §10) to SVG paths in brand/.

The marks are set in Fraunces 700 with WONK=1 and shaped with HarfBuzz (real
kerning), then converted to plain paths. The SVGs need no font and render
identically everywhere. Colors are the Tier 1 primitives from
tokens/membrane.tokens.json.

Not part of the build: run it only when §10 changes. It needs the *full*
Fraunces variable font (with the WONK and SOFT axes), for example
fraunces-latin-full-normal.woff2 from @fontsource-variable/fraunces or
Fraunces[SOFT,WONK,opsz,wght].ttf from Google Fonts:

    python3 -m venv .venv && .venv/bin/pip install "fonttools[woff]" uharfbuzz
    .venv/bin/python scripts/render-brand-marks.py path/to/Fraunces-full.woff2
"""
import io
import json
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand"

tokens = json.loads((ROOT / "tokens" / "membrane.tokens.json").read_text())
COLOR = {k: v["$value"] for k, v in tokens["color"]["primitive"].items() if isinstance(v, dict) and "$value" in v}
TERRACOTTA, TEAL = COLOR["terracotta"], COLOR["teal"]
CREAM, CHARCOAL = COLOR["cream"], COLOR["charcoal"]

APOSTROPHE = "’"  # the typographic apostrophe in D’Césares


def instance(path, opsz):
    font = TTFont(path)
    font = instantiateVariableFont(font, {"wght": 700, "opsz": opsz, "WONK": 1, "SOFT": 0})
    buf = io.BytesIO()
    font.flavor = None
    font.save(buf)
    return font, buf.getvalue()


def shape(font, data, text, tracking_em=0.0):
    """Return [(glyph name, x offset)] and the advance width, in font units."""
    hb_font = hb.Font(hb.Face(data))
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    order = font.getGlyphOrder()
    upm = font["head"].unitsPerEm
    x, out = 0, []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((order[info.codepoint], x + pos.x_offset, pos.y_offset))
        x += pos.x_advance + tracking_em * upm
    return out, x


def outline(font, placed):
    """SVG path data per glyph (y flipped) and the union bounding box."""
    glyphs = font.getGlyphSet()
    paths, bounds = [], BoundsPen(glyphs)
    for name, x, y in placed:
        pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, -y)))
        glyphs[name].draw(TransformPen(bounds, (1, 0, 0, -1, x, -y)))
        paths.append(pen.getCommands())
    return paths, bounds.bounds


def svg(title, paths_and_fills, box, background=None, pad=0, radius=0):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    vb = f"{x0 - pad:.0f} {y0 - pad:.0f} {w + 2 * pad:.0f} {h + 2 * pad:.0f}"
    bg = ""
    if background:
        bg = f'\n  <rect x="{x0 - pad:.0f}" y="{y0 - pad:.0f}" width="{w + 2 * pad:.0f}" height="{h + 2 * pad:.0f}" rx="{radius:.0f}" fill="{background}"/>'
    body = "\n".join(f'  <path fill="{fill}" d="{d}"/>' for d, fill in paths_and_fills)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}">\n  <title>{title}</title>{bg}\n{body}\n</svg>\n'


def write(name, content):
    (OUT / name).write_text(content)
    print(f"✓ brand/{name}")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    OUT.mkdir(exist_ok=True)

    # Wordmarks: display optical size.
    font, data = instance(sys.argv[1], 144)
    for slug, text in [("wordmark", f"Isaac D{APOSTROPHE}Césares"), ("compact", f"D{APOSTROPHE}Césares")]:
        label = text.replace(APOSTROPHE, "'")
        placed, _ = shape(font, data, text)
        paths, box = outline(font, placed)
        merged = " ".join(paths)
        write(f"idcesares-logo-{slug}-primary.svg", svg(label, [(merged, CHARCOAL)], box))
        write(f"idcesares-logo-{slug}-reversed.svg", svg(label, [(merged, CREAM)], box))

    # Monogram: a sturdier optical size, since it is used small.
    font, data = instance(sys.argv[1], 48)
    placed, _ = shape(font, data, "dc", tracking_em=-0.05)
    (d_path, c_path), box = outline(font, placed)
    two_tone = [(d_path, TERRACOTTA), (c_path, TEAL)]
    write("idcesares-logo-monogram-primary.svg", svg("dc", two_tone, box))
    write("idcesares-logo-monogram-reversed.svg", svg("dc", [(d_path, CREAM), (c_path, CREAM)], box))

    # App icon / favicon: the monogram centered on a rounded square.
    x0, y0, x1, y1 = box
    side = max(x1 - x0, y1 - y0) * 1.5
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    square = (cx - side / 2, cy - side / 2, cx + side / 2, cy + side / 2)
    write("idcesares-icon-monogram-light.svg", svg("dc", two_tone, square, background=CREAM, radius=side * 0.2))
    write("idcesares-icon-monogram-dark.svg", svg("dc", [(d_path, CREAM), (c_path, CREAM)], square, background=CHARCOAL, radius=side * 0.2))


if __name__ == "__main__":
    main()
