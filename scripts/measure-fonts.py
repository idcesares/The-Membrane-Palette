"""Measure the self-hosted fonts and write metric-matched fallback overrides
into fonts/fonts.json.

A fallback face (e.g. "Instrument Sans Fallback" = local Arial with
size-adjust / ascent-override / descent-override / line-gap-override) takes up
the same space as the web font. With font-display: swap the page then barely
shifts when the real font arrives.

Not part of the build (it needs Python): run it after changing a font file.

    python3 -m venv .venv && .venv/bin/pip install "fonttools[woff]"
    .venv/bin/python scripts/measure-fonts.py
"""
import json
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "fonts" / "fonts.json"

# English letter frequencies, the same idea as Capsize's xWidthAvg: the
# average advance of running text, not of the whole character set.
FREQ = {
    " ": 0.1918, "e": 0.0981, "t": 0.0727, "a": 0.0656, "o": 0.0602, "i": 0.0560,
    "n": 0.0558, "s": 0.0508, "r": 0.0490, "h": 0.0458, "l": 0.0328, "d": 0.0313,
    "c": 0.0254, "u": 0.0222, "m": 0.0201, "f": 0.0174, "p": 0.0168, "g": 0.0151,
    "w": 0.0145, "y": 0.0140, "b": 0.0119, "v": 0.0080, "k": 0.0060, "x": 0.0015,
    "j": 0.0012, "q": 0.0010, "z": 0.0007,
}

# System fallbacks, measured from their metric-compatible Liberation clones
# (Liberation Serif = Times New Roman, Sans = Arial, Mono = Courier New), so
# one set of overrides fits Windows, macOS and most Linux installs.
FALLBACKS = {
    "Times New Roman": {"upm": 2048, "avg": 810.7},
    "Arial": {"upm": 2048, "avg": 895.0},
    "Courier New": {"upm": 2048, "avg": 1229.0},
}


def average_width(font):
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    total = sum(FREQ.values())
    return sum(hmtx[cmap[ord(c)]][0] * w for c, w in FREQ.items()) / total


def pct(value):
    return f"{value * 100:.2f}%"


def main():
    config = json.loads(SOURCE.read_text())
    for family in config["families"]:
        # Measure the latin roman file at the weight (and optical size) the
        # family is mostly set in, so the fallback matches the common case.
        file = next(f for f in family["faces"] if f["style"] == "normal" and f["subset"] == "latin")["file"]
        font = TTFont(ROOT / "fonts" / file)
        if "fvar" in font:
            font = instantiateVariableFont(font, family["measureAt"])
        upm = font["head"].unitsPerEm
        hhea = font["hhea"]
        fallback = FALLBACKS[family["fallback"]["local"][0]]
        size_adjust = (average_width(font) / upm) / (fallback["avg"] / fallback["upm"])
        family["fallback"]["overrides"] = {
            "size-adjust": pct(size_adjust),
            "ascent-override": pct(hhea.ascent / upm / size_adjust),
            "descent-override": pct(abs(hhea.descent) / upm / size_adjust),
            "line-gap-override": pct(hhea.lineGap / upm / size_adjust),
        }
        print(f"{family['family']}: {family['fallback']['overrides']}")
    SOURCE.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
