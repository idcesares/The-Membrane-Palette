---
name: Tabs
category: Navigation
status: stable
summary: WAI-ARIA tabs — underline or pill (segmented) style; aria-selected drives the visuals, membrane.js adds click and arrow-key behavior.
---

# Tabs

Switch between views of related content without leaving the page. The visual state is driven entirely by `aria-selected`, so the markup and what screen readers hear can't disagree. Load `components/membrane.js` for behavior (click, Arrow/Home/End keys, RTL); without it, tabs render but don't switch.

## When not to use

- Navigating between pages → links in a [Navbar](../navbar/README.md).
- Content users need to compare side by side → show it all.

## Examples

### Underline tabs

```html
<div class="mp-tabs">
  <div class="mp-tabs__list" role="tablist" aria-label="Install options">
    <button class="mp-tabs__tab" type="button" role="tab" id="tabs-cdn" aria-controls="tabs-cdn-panel" aria-selected="true">CDN</button>
    <button class="mp-tabs__tab" type="button" role="tab" id="tabs-copy" aria-controls="tabs-copy-panel" aria-selected="false" tabindex="-1">Copy files</button>
    <button class="mp-tabs__tab" type="button" role="tab" id="tabs-fork" aria-controls="tabs-fork-panel" aria-selected="false" tabindex="-1">Fork</button>
  </div>
  <div class="mp-tabs__panel" role="tabpanel" id="tabs-cdn-panel" aria-labelledby="tabs-cdn" tabindex="0"><p class="type-small">One <code class="mp-code">&lt;link&gt;</code> to <code class="mp-code">membrane.css</code> on jsDelivr.</p></div>
  <div class="mp-tabs__panel" role="tabpanel" id="tabs-copy-panel" aria-labelledby="tabs-copy" tabindex="0" hidden><p class="type-small">Download the three CSS files into your project.</p></div>
  <div class="mp-tabs__panel" role="tabpanel" id="tabs-fork-panel" aria-labelledby="tabs-fork" tabindex="0" hidden><p class="type-small">Edit the JSON source and run the build.</p></div>
</div>
```

### Pill tabs

```html
<div class="mp-tabs" data-variant="pill">
  <div class="mp-tabs__list" role="tablist" aria-label="Theme preview">
    <button class="mp-tabs__tab" type="button" role="tab" id="tabs-light" aria-controls="tabs-light-panel" aria-selected="true">Light</button>
    <button class="mp-tabs__tab" type="button" role="tab" id="tabs-dark" aria-controls="tabs-dark-panel" aria-selected="false" tabindex="-1">Dark</button>
  </div>
  <div class="mp-tabs__panel" role="tabpanel" id="tabs-light-panel" aria-labelledby="tabs-light" tabindex="0"><p class="type-small">Warm cream, terracotta emphasis.</p></div>
  <div class="mp-tabs__panel" role="tabpanel" id="tabs-dark-panel" aria-labelledby="tabs-dark" tabindex="0" hidden><p class="type-small">Charcoal depth, lightened accents.</p></div>
</div>
```

## Accessibility

- Required wiring: `role="tablist"` (with `aria-label`), `role="tab"` + `aria-controls` + `aria-selected`, `role="tabpanel"` + `aria-labelledby`; unselected tabs have `tabindex="-1"` and their panels `hidden`.
- Keyboard (via `membrane.js`): Tab enters the list on the selected tab; ←/→ move and select (mirrored in RTL); Home/End jump; Tab again moves into the panel.

## API

<!-- GENERATED:API -->
_Generated from `tabs.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-tabs` | root |
| `.mp-tabs__list` | part of `.mp-tabs` |
| `.mp-tabs__tab` | part of `.mp-tabs` |
| `.mp-tabs__panel` | part of `.mp-tabs` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `pill` |

**States styled** — `:focus-visible` `:hover` `[aria-selected="true"]`

**Design tokens consumed** — `--border-default` `--border-width-medium` `--border-width-thin` `--color-action-primary` `--color-bg-hover` `--color-bg-primary` `--color-bg-tertiary` `--color-text-primary` `--color-text-secondary` `--elevation-raised` `--focus-ring` `--focus-ring-offset` `--font-sans` `--radius-full` `--radius-sm` `--size-control-md` `--size-control-sm` `--size-touch-target` `--space-1` `--space-2` `--space-4` `--text-small` `--transition-fast` `--transition-state` `--weight-medium`
<!-- /GENERATED:API -->
