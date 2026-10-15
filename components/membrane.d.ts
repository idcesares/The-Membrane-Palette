/* ============================================================
   The Membrane Palette — TypeScript types
   Version 2.2.0

   GENERATED FILE — do not edit by hand.
   Source:          components/manifest.json (from the component CSS)
   Regenerate with: npm run build:components

   Types only, no runtime. They let a framework catch an option the
   CSS doesn't implement (data-variant="primary") at compile time:

     import type { MpAttrs } from "…/components/membrane.d.ts";
     const save: MpAttrs<"button"> = { "data-variant": "secondary" };
     <button className="mp-button" {...save}>Save</button>

   Boolean options are presence attributes: pass true (or "") to set
   them and leave them out to unset them. Never pass false, because a
   framework renders it as data-x="false" and the attribute still
   matches.
   ============================================================ */

/** Every component class (roots and parts). */
export type MpClass =
  | "mp-accordion" | "mp-accordion__content" | "mp-accordion__summary"
  | "mp-alert" | "mp-alert__actions" | "mp-alert__content"
  | "mp-alert__icon" | "mp-alert__title" | "mp-avatar"
  | "mp-avatar-group" | "mp-badge" | "mp-breadcrumb"
  | "mp-breadcrumb__item" | "mp-breadcrumb__link" | "mp-breadcrumb__list"
  | "mp-button" | "mp-card" | "mp-card__body"
  | "mp-card__footer" | "mp-card__link" | "mp-card__media"
  | "mp-card__overline" | "mp-card__title" | "mp-chart"
  | "mp-chart__bars" | "mp-chart__caption" | "mp-chart__fill"
  | "mp-chart__header" | "mp-chart__key" | "mp-chart__label"
  | "mp-chart__legend" | "mp-chart__row" | "mp-chart__title"
  | "mp-chart__track" | "mp-chart__value" | "mp-checkbox"
  | "mp-choice" | "mp-choice__description" | "mp-cluster"
  | "mp-code" | "mp-code-block" | "mp-code-block__header"
  | "mp-combobox" | "mp-combobox__empty" | "mp-combobox__hint"
  | "mp-combobox__input" | "mp-combobox__list" | "mp-combobox__option"
  | "mp-combobox__status" | "mp-container" | "mp-dialog"
  | "mp-dialog__body" | "mp-dialog__footer" | "mp-dialog__header"
  | "mp-dialog__title" | "mp-divider" | "mp-empty"
  | "mp-empty__actions" | "mp-empty__body" | "mp-empty__media"
  | "mp-empty__title" | "mp-field" | "mp-field__error"
  | "mp-field__hint" | "mp-field__label" | "mp-field__optional"
  | "mp-field__required" | "mp-fieldset" | "mp-fieldset__legend"
  | "mp-grid" | "mp-icon" | "mp-input"
  | "mp-kbd" | "mp-link" | "mp-menu"
  | "mp-menu__item" | "mp-menu__label" | "mp-menu__separator"
  | "mp-navbar" | "mp-navbar__actions" | "mp-navbar__brand"
  | "mp-navbar__inner" | "mp-navbar__link" | "mp-navbar__links"
  | "mp-navbar__nav" | "mp-pagination" | "mp-pagination__gap"
  | "mp-pagination__item" | "mp-pagination__link" | "mp-pagination__list"
  | "mp-progress" | "mp-prose" | "mp-quote"
  | "mp-quote__source" | "mp-quote__text" | "mp-radio"
  | "mp-section" | "mp-skeleton" | "mp-skip-link"
  | "mp-spinner" | "mp-stack" | "mp-stat"
  | "mp-stat__delta" | "mp-stat__label" | "mp-stat__value"
  | "mp-steps" | "mp-steps__description" | "mp-steps__item"
  | "mp-steps__label" | "mp-surface" | "mp-switch"
  | "mp-syntax-comment" | "mp-syntax-function" | "mp-syntax-keyword"
  | "mp-syntax-number" | "mp-syntax-string" | "mp-table"
  | "mp-table-wrap" | "mp-tabs" | "mp-tabs__list"
  | "mp-tabs__panel" | "mp-tabs__tab" | "mp-tag"
  | "mp-tag__remove" | "mp-text" | "mp-toast"
  | "mp-toast-region" | "mp-toast__close" | "mp-toast__content"
  | "mp-toast__title" | "mp-tooltip" | "mp-tooltip__content"
  | "mp-visually-hidden";

/** Layout — Container, Stack, Cluster, Grid, Section and Surface primitives that compose any page without custom layout CSS.
 *  Docs: components/layout/README.md */
export interface MpLayoutAttributes {
  "data-size"?: "sm" | "md" | "lg";
  "data-justify"?: "between" | "center" | "end";
  "data-align"?: "start" | "baseline";
  "data-min"?: "sm" | "lg";
  "data-gap"?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16";
  "data-tone"?: "secondary" | "elevated";
}

/** Text — Tone (muted, subtle, human, digital) and reading measure for running copy — combine with the .type-* size classes instead of writing inline color or max-width.
 *  Docs: components/text/README.md */
export interface MpTextAttributes {
  "data-tone"?: "muted" | "subtle" | "human" | "digital";
  "data-measure"?: true | "";
}

/** Prose — One class that styles long-form HTML — articles, Markdown output, CMS content — with the full typographic system.
 *  Docs: components/prose/README.md */
export interface MpProseAttributes {
  // No options: this component is styled by class and native state only.
}

/** Button — Pill-shaped action trigger. Primary is terracotta (one per view), secondary is a teal outline, ghost is quiet, danger is destructive.
 *  Docs: components/button/README.md */
export interface MpButtonAttributes {
  "data-variant"?: "secondary" | "ghost" | "danger";
  "data-size"?: "sm" | "lg";
  "data-icon-only"?: true | "";
  "data-full-width"?: true | "";
}

/** Link — Text links — inline, quiet and standalone call-to-action — plus the skip link every page should start with.
 *  Docs: components/link/README.md */
export interface MpLinkAttributes {
  "data-variant"?: "quiet" | "standalone";
}

/** Field — Wraps one form control with its label, hint and error message; Fieldset groups related controls under a legend.
 *  Docs: components/field/README.md */
export interface MpFieldAttributes {
  // No options: this component is styled by class and native state only.
}

/** Input — One class for text inputs, textareas and selects, with a ≥3:1 control boundary, visible focus ring, and invalid/disabled/read-only states.
 *  Docs: components/input/README.md */
export interface MpInputAttributes {
  "data-size"?: "sm" | "lg";
}

/** Combobox — A text input that suggests options as you type — accent-insensitive filtering, arrow-key navigation and a result count for screen readers, via membrane.js.
 *  Docs: components/combobox/README.md */
export interface MpComboboxAttributes {
  // No options: this component is styled by class and native state only.
}

/** Choice — Checkbox and radio controls drawn in the brand style, inside a clickable .mp-choice label row with optional description.
 *  Docs: components/choice/README.md */
export interface MpChoiceAttributes {
  // No options: this component is styled by class and native state only.
}

/** Switch — An on/off toggle for settings that take effect immediately — a native checkbox with role="switch".
 *  Docs: components/switch/README.md */
export interface MpSwitchAttributes {
  // No options: this component is styled by class and native state only.
}

/** Card — A contained unit — overline, serif title, body, footer, optional media — with standard, featured and flat variants and an accessible whole-card link.
 *  Docs: components/card/README.md */
export interface MpCardAttributes {
  "data-tone"?: "digital";
  "data-variant"?: "featured" | "flat";
}

/** Tag — A pill that names a topic or category, colored by register — human (terracotta), digital (teal) or neutral. Can be a link, a toggle, or removable.
 *  Docs: components/tag/README.md */
export interface MpTagAttributes {
  "data-tone"?: "human" | "digital";
}

/** Badge — A compact, uppercase, non-interactive label for status and metadata — info, success, warning, error, or a register tone.
 *  Docs: components/badge/README.md */
export interface MpBadgeAttributes {
  "data-tone"?: "info" | "success" | "warning" | "error" | "human" | "digital";
  "data-variant"?: "dot";
}

/** Avatar — A person as a warm-filtered photo or Fraunces initials; digital tone uses monospace for bots and systems. Groups overlap.
 *  Docs: components/avatar/README.md */
export interface MpAvatarAttributes {
  "data-size"?: "sm" | "lg" | "xl";
  "data-tone"?: "digital";
}

/** Quote — Blockquote with attribution in Fraunces italic; the pull variant renders the brand's signature phrases large and centered.
 *  Docs: components/quote/README.md */
export interface MpQuoteAttributes {
  "data-variant"?: "pull";
}

/** Code — Inline code, keyboard keys, and always-dark code blocks with gate-checked syntax colors that also style Prism and highlight.js output.
 *  Docs: components/code/README.md */
export interface MpCodeAttributes {
  // No options: this component is styled by class and native state only.
}

/** Divider — A fading hairline between sections — or a full-width solid rule inside panels. Prefer whitespace first.
 *  Docs: components/divider/README.md */
export interface MpDividerAttributes {
  "data-size"?: "sm" | "lg";
  "data-variant"?: "full";
}

/** Table — Data tables with a quiet uppercase header, tabular numerals, end-aligned numbers, compact/striped/interactive variants and a scrolling frame.
 *  Docs: components/table/README.md */
export interface MpTableAttributes {
  "data-align"?: "end";
  "data-density"?: "compact";
  "data-variant"?: "striped" | "interactive";
}

/** Stat — A headline metric — label, Fraunces numeral, and a delta whose arrow (trend) and color (sentiment) are set independently.
 *  Docs: components/stat/README.md */
export interface MpStatAttributes {
  "data-trend"?: "up" | "down";
  "data-sentiment"?: "positive" | "negative";
}

/** Chart — A figure shell (title, legend, caption) and a CSS bar list — single, multi-series or stacked — colored by the validated --color-chart-* palette, with every value printed.
 *  Docs: components/chart/README.md */
export interface MpChartAttributes {
  "data-series"?: "1" | "2" | "3" | "4" | "5" | "6";
}

/** Icon — Sizes and colors an inline line-icon SVG from the --size-icon-* tokens (20/24/32/48px) and the register/status text colors.
 *  Docs: components/icon/README.md */
export interface MpIconAttributes {
  "data-size"?: "sm" | "lg" | "xl";
  "data-tone"?: "human" | "digital" | "success" | "warning" | "error";
}

/** Alert — An inline message about state — info, success, warning, error — or a human-register editorial note, with optional icon and actions.
 *  Docs: components/alert/README.md */
export interface MpAlertAttributes {
  "data-tone"?: "success" | "warning" | "error" | "human";
}

/** Progress — Native <progress> bars (determinate or indeterminate, three sizes, register tones) and a spinner for short unmeasured waits.
 *  Docs: components/progress/README.md */
export interface MpProgressAttributes {
  "data-tone"?: "human" | "success";
  "data-size"?: "sm" | "lg";
}

/** Skeleton — Placeholder text lines, circles and blocks that hold a layout's shape while content loads; they pulse in place under reduced motion.
 *  Docs: components/skeleton/README.md */
export interface MpSkeletonAttributes {
  "data-variant"?: "text" | "circle" | "block";
}

/** Empty state — What a view shows before it has content — icon on a warm wash, Fraunces title, one sentence of guidance and the next action.
 *  Docs: components/empty-state/README.md */
export interface MpEmptyStateAttributes {
  "data-variant"?: "bordered";
}

/** Toast — A brief, polite confirmation of something the person just did — one live region per page, MembranePalette.toast() or a data-mp-toast button, auto-dismissed unless it's an error.
 *  Docs: components/toast/README.md */
export interface MpToastAttributes {
  "data-leaving"?: true | "";
  "data-tone"?: "success" | "warning" | "error";
  "data-placement"?: "inline";
}

/** Tooltip — A short inverse-colored hint shown on hover and keyboard focus — CSS-only, hoverable, Escape-dismissible with membrane.js.
 *  Docs: components/tooltip/README.md */
export interface MpTooltipAttributes {
  "data-dismissed"?: true | "";
  "data-placement"?: "bottom";
}

/** Dialog — A modal built on native <dialog> — focus trapping, Escape and the backdrop come from the browser; header, body and footer slots.
 *  Docs: components/dialog/README.md */
export interface MpDialogAttributes {
  "data-size"?: "sm" | "lg";
}

/** Navbar — Sticky translucent site header with brand, uppercase links (aria-current marks the active page) and an actions slot; collapses by its own width.
 *  Docs: components/navbar/README.md */
export interface MpNavbarAttributes {
  // No options: this component is styled by class and native state only.
}

/** Breadcrumb — The path from site root to the current page, as an ordered list with decorative separators and aria-current on the last item.
 *  Docs: components/breadcrumb/README.md */
export interface MpBreadcrumbAttributes {
  // No options: this component is styled by class and native state only.
}

/** Tabs — WAI-ARIA tabs — underline or pill (segmented) style; aria-selected drives the visuals, membrane.js adds click and arrow-key behavior.
 *  Docs: components/tabs/README.md */
export interface MpTabsAttributes {
  "data-variant"?: "pill";
}

/** Accordion — Expandable sections on native <details>/<summary> — no script, keyboard-ready, exclusive with a shared name, animated where supported.
 *  Docs: components/accordion/README.md */
export interface MpAccordionAttributes {
  // No options: this component is styled by class and native state only.
}

/** Pagination — Numbered page links with previous/next; aria-current marks the current page (teal pill), and narrow containers collapse to previous · current · next.
 *  Docs: components/pagination/README.md */
export interface MpPaginationAttributes {
  // No options: this component is styled by class and native state only.
}

/** Steps — Progress through an ordered sequence — course modules, onboarding, a multi-page form — vertical or horizontal, with complete, current and upcoming steps.
 *  Docs: components/steps/README.md */
export interface MpStepsAttributes {
  "data-status"?: "complete";
  "data-orientation"?: "horizontal";
}

/** Menu — A list of actions in a native popover — opened by a popovertarget button, light-dismissed by the browser, arrow-key navigable with membrane.js.
 *  Docs: components/menu/README.md */
export interface MpMenuAttributes {
  "data-tone"?: "danger";
}

/** Option attributes by component slug. */
export interface MpComponentAttributes {
  "layout": MpLayoutAttributes;
  "text": MpTextAttributes;
  "prose": MpProseAttributes;
  "button": MpButtonAttributes;
  "link": MpLinkAttributes;
  "field": MpFieldAttributes;
  "input": MpInputAttributes;
  "combobox": MpComboboxAttributes;
  "choice": MpChoiceAttributes;
  "switch": MpSwitchAttributes;
  "card": MpCardAttributes;
  "tag": MpTagAttributes;
  "badge": MpBadgeAttributes;
  "avatar": MpAvatarAttributes;
  "quote": MpQuoteAttributes;
  "code": MpCodeAttributes;
  "divider": MpDividerAttributes;
  "table": MpTableAttributes;
  "stat": MpStatAttributes;
  "chart": MpChartAttributes;
  "icon": MpIconAttributes;
  "alert": MpAlertAttributes;
  "progress": MpProgressAttributes;
  "skeleton": MpSkeletonAttributes;
  "empty-state": MpEmptyStateAttributes;
  "toast": MpToastAttributes;
  "tooltip": MpTooltipAttributes;
  "dialog": MpDialogAttributes;
  "navbar": MpNavbarAttributes;
  "breadcrumb": MpBreadcrumbAttributes;
  "tabs": MpTabsAttributes;
  "accordion": MpAccordionAttributes;
  "pagination": MpPaginationAttributes;
  "steps": MpStepsAttributes;
  "menu": MpMenuAttributes;
}

export type MpComponent = keyof MpComponentAttributes;

/** The option attributes one component accepts. */
export type MpAttrs<C extends MpComponent> = MpComponentAttributes[C];

/** Design tokens you may consume in your own CSS (semantic and scale
 *  tokens; Tier 1 primitives and deprecated aliases are left out). */
export type MpToken =
  | "--color-text-primary" | "--color-text-secondary" | "--color-text-tertiary"
  | "--color-text-accent" | "--color-text-on-accent" | "--color-bg-primary"
  | "--color-bg-secondary" | "--color-bg-tertiary" | "--color-border-default"
  | "--color-border-emphasis" | "--color-overlay-bg" | "--color-action-primary"
  | "--color-action-secondary" | "--color-focus" | "--color-success"
  | "--color-success-text" | "--color-warning" | "--color-warning-text"
  | "--color-error" | "--color-error-text" | "--color-info"
  | "--color-selection" | "--color-bg-elevated" | "--color-bg-inverse"
  | "--color-text-inverse" | "--color-bg-hover" | "--color-bg-active"
  | "--color-border-input" | "--color-action-primary-hover" | "--color-action-secondary-hover"
  | "--color-error-hover" | "--color-human-text" | "--color-human-bg"
  | "--color-digital-text" | "--color-digital-bg" | "--color-info-text"
  | "--color-success-bg" | "--color-warning-bg" | "--color-error-bg"
  | "--color-info-bg" | "--color-chart-1" | "--color-chart-2"
  | "--color-chart-3" | "--color-chart-4" | "--color-chart-5"
  | "--color-chart-6" | "--gradient-membrane" | "--gradient-warmth"
  | "--gradient-depth" | "--gradient-divider" | "--gradient-subtle"
  | "--bg-glow-terracotta" | "--bg-glow-teal" | "--bg-glow-sage"
  | "--bg-glow-focal" | "--bg-glow-focal-loaded" | "--code-bg"
  | "--code-text" | "--code-border" | "--code-keyword"
  | "--code-string" | "--code-function" | "--code-comment"
  | "--code-number" | "--font-serif" | "--font-sans"
  | "--font-mono" | "--text-display" | "--text-h1"
  | "--text-h2" | "--text-h3" | "--text-h4"
  | "--text-body-lg" | "--text-body" | "--text-small"
  | "--text-xs" | "--text-code" | "--leading-display"
  | "--leading-heading" | "--leading-subheading" | "--leading-body"
  | "--leading-body-lg" | "--leading-small" | "--leading-code"
  | "--leading-label" | "--tracking-display" | "--tracking-heading"
  | "--tracking-subheading" | "--tracking-body" | "--tracking-small"
  | "--tracking-label" | "--weight-regular" | "--weight-medium"
  | "--weight-semibold" | "--weight-bold" | "--space-1"
  | "--space-2" | "--space-3" | "--space-4"
  | "--space-5" | "--space-6" | "--space-8"
  | "--space-10" | "--space-12" | "--space-16"
  | "--space-20" | "--space-24" | "--space-32"
  | "--size-icon-sm" | "--size-icon-md" | "--size-icon-lg"
  | "--size-icon-xl" | "--size-touch-target" | "--size-control-sm"
  | "--size-control-md" | "--size-control-lg" | "--size-nav"
  | "--size-nav-mobile" | "--container-sm" | "--container-md"
  | "--container-lg" | "--container-xl" | "--container-full"
  | "--site-margin" | "--measure" | "--radius-sm"
  | "--radius-md" | "--radius-lg" | "--radius-xl"
  | "--radius-full" | "--border-width-thin" | "--border-width-medium"
  | "--border-width-thick" | "--border-default" | "--border-emphasis"
  | "--border-accent" | "--shadow-sm" | "--shadow-md"
  | "--shadow-lg" | "--shadow-glow-warm" | "--shadow-glow-teal"
  | "--elevation-raised" | "--elevation-overlay" | "--elevation-modal"
  | "--duration-fast" | "--duration-normal" | "--duration-slow"
  | "--duration-slower" | "--duration-loop" | "--ease-default"
  | "--ease-out" | "--ease-in" | "--ease-in-out"
  | "--ease-spring" | "--transition-fast" | "--transition-default"
  | "--transition-slow" | "--transition-enter" | "--transition-exit"
  | "--transition-state" | "--opacity-subtle" | "--opacity-light"
  | "--opacity-medium" | "--opacity-overlay" | "--opacity-heavy"
  | "--state-disabled-opacity" | "--z-base" | "--z-dropdown"
  | "--z-sticky" | "--z-nav" | "--z-overlay"
  | "--z-modal" | "--z-toast" | "--z-tooltip"
  | "--focus-ring" | "--focus-ring-offset" | "--blur-backdrop"
  | "--photo-warmth" | "--photo-border-radius" | "--photo-shadow"
  | "--photo-dim-dark";

/** Tier 3 component knobs, each declared on its component's root. */
export type MpKnob =
  | "--mp-alert-accent" | "--mp-alert-bg" | "--mp-alert-title"
  | "--mp-avatar-size" | "--mp-badge-bg" | "--mp-badge-fg"
  | "--mp-button-bg" | "--mp-button-bg-hover" | "--mp-button-border"
  | "--mp-button-fg" | "--mp-button-fg-hover" | "--mp-button-font-size"
  | "--mp-button-glow" | "--mp-button-height" | "--mp-button-padding"
  | "--mp-card-accent" | "--mp-card-bg" | "--mp-card-overline"
  | "--mp-card-padding" | "--mp-card-shadow" | "--mp-chart-bar"
  | "--mp-chart-color" | "--mp-chart-value" | "--mp-choice-size"
  | "--mp-combobox-max-height" | "--mp-container-max" | "--mp-dialog-width"
  | "--mp-divider-space" | "--mp-gap" | "--mp-grid-min"
  | "--mp-icon-size" | "--mp-input-border" | "--mp-input-height"
  | "--mp-input-padding" | "--mp-progress-height" | "--mp-progress-track"
  | "--mp-progress-value" | "--mp-section-space" | "--mp-skeleton-height"
  | "--mp-skeleton-width" | "--mp-spinner-size" | "--mp-steps-line"
  | "--mp-steps-marker" | "--mp-steps-ring" | "--mp-switch-height"
  | "--mp-switch-inset" | "--mp-switch-thumb" | "--mp-switch-travel"
  | "--mp-switch-width" | "--mp-table-cell-padding" | "--mp-table-max-height"
  | "--mp-tag-bg" | "--mp-tag-fg" | "--mp-toast-accent"
  | "--mp-toast-title" | "--mp-tooltip-gap";

/** A style object that can set knobs and read tokens:
 *  const style: MpStyle = { "--mp-button-bg": "var(--color-action-secondary)" }; */
export type MpStyle = { [K in MpKnob]?: `var(${MpToken})` | (string & {}) };

/** window.MembranePalette, present when components/membrane.js is loaded. */
export interface MpToastOptions {
  title: string;
  body?: string;
  tone?: "info" | "success" | "warning" | "error";
  /** Milliseconds; 0 keeps it until dismissed. Default 6000, errors 0. */
  timeout?: number;
}

export interface MembranePaletteApi {
  toast(options: MpToastOptions): { element: HTMLElement; dismiss(): void };
}

declare global {
  interface Window {
    MembranePalette?: MembranePaletteApi;
  }
}
