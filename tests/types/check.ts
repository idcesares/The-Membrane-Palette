// Compile-time test of the generated components/membrane.d.ts
// (npm run lint:types). Each @ts-expect-error line must fail to compile;
// if the types ever stop rejecting it, tsc reports the unused directive.
import type { MpAttrs, MpClass, MpStyle, MpToken } from "../../components/membrane.d.ts";

const ok: MpAttrs<"button"> = { "data-variant": "secondary", "data-size": "sm", "data-icon-only": true };
const okCombo: MpAttrs<"combobox"> = {};
const cls: MpClass = "mp-combobox__option";
const token: MpToken = "--color-text-primary";
const style: MpStyle = { "--mp-button-bg": "var(--color-action-secondary)" };
window.MembranePalette?.toast({ title: "Saved", tone: "success" });

// @ts-expect-error — "primary" is the default: the CSS has no such value
const bad: MpAttrs<"button"> = { "data-variant": "primary" };
// @ts-expect-error — false would render data-icon-only="false", which still matches
const badBool: MpAttrs<"button"> = { "data-icon-only": false };
// @ts-expect-error — Tier 1 primitives are not public tokens
const prim: MpToken = "--color-terracotta";
// @ts-expect-error — deprecated alias
const dep: MpToken = "--text-sm";
// @ts-expect-error — no such class
const typo: MpClass = "mp-buton";
// @ts-expect-error — toast tone is a closed set
window.MembranePalette?.toast({ title: "x", tone: "danger" });

export { ok, okCombo, cls, token, style, bad, badBool, prim, dep, typo };
