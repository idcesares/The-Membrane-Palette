/**
 * WCAG 2.x contrast math, shared by the token gate (scripts/build-tokens.mjs)
 * and the component-token gate (scripts/build-components.mjs), so both
 * measure a pair the same way.
 */

/** Parse a #RRGGBB or rgb()/rgba() literal; null for anything else. */
export function parseColor(str) {
  const hex = str.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] };
  }
  return null;
}

export const srgbToLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

/** WCAG relative luminance of an opaque sRGB color. */
export function luminance({ r, g, b }) {
  const [R, G, B] = [r, g, b].map((v) => srgbToLinear(v / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Composite a possibly translucent color over an opaque backdrop. */
export function composite(fg, bg) {
  if (fg.a === 1) return fg;
  const mix = (f, b) => Math.round(f * fg.a + b * (1 - fg.a));
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 };
}

/**
 * Contrast ratio of fg on bg. A translucent bg is composited over the opaque
 * backdrop first; a translucent fg is then composited over that result.
 */
export function contrast(fgStr, bgStr, backdropStr) {
  let bg = parseColor(bgStr);
  if (bg.a !== 1) bg = composite(bg, parseColor(backdropStr));
  const fg = composite(parseColor(fgStr), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
