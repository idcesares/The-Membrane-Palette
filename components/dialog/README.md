---
name: Dialog
category: Feedback
status: stable
summary: A modal built on native <dialog> — focus trapping, Escape and the backdrop come from the browser; header, body and footer slots.
---

# Dialog

The native `<dialog>` element opened with `showModal()` traps focus, makes the page behind it inert, closes on Escape and restores focus on close. The component adds the elevated surface (`--color-bg-elevated`, which lightens in dark mode), the blurred scrim, and an entrance transition.

## Opening and closing

- **Invoker attributes** (no script): `<button commandfor="my-dialog" command="show-modal">` and `command="close"` inside. `components/membrane.js` polyfills these where the browser lacks them.
- **Script**: `document.getElementById('my-dialog').showModal()`.
- **Form**: a `<form method="dialog">` inside closes it on submit.
- `closedby="any"` also closes on a backdrop click (polyfilled by `membrane.js`).

## Examples

### Confirmation dialog

```html
<button class="mp-button" type="button" data-variant="secondary" commandfor="dialog-publish" command="show-modal">Publish workshop…</button>

<dialog class="mp-dialog" id="dialog-publish" data-size="sm" aria-labelledby="dialog-publish-title" closedby="any">
  <div class="mp-dialog__header">
    <h2 class="mp-dialog__title" id="dialog-publish-title">Publish this workshop?</h2>
    <button class="mp-button" type="button" data-variant="ghost" data-size="sm" data-icon-only aria-label="Close" commandfor="dialog-publish" command="close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="mp-dialog__body">
    <p>It becomes visible to all 3,214 educators in the community, and they'll get an email invitation.</p>
  </div>
  <div class="mp-dialog__footer">
    <button class="mp-button" type="button" data-variant="ghost" commandfor="dialog-publish" command="close">Not yet</button>
    <button class="mp-button" type="button" commandfor="dialog-publish" command="close">Publish</button>
  </div>
</dialog>
```

### Large reading dialog

```html
<button class="mp-button" type="button" data-variant="ghost" commandfor="dialog-syllabus" command="show-modal">Read the syllabus</button>

<dialog class="mp-dialog" id="dialog-syllabus" data-size="lg" aria-labelledby="dialog-syllabus-title" closedby="any">
  <div class="mp-dialog__header">
    <h2 class="mp-dialog__title" id="dialog-syllabus-title">AI Literacy I — syllabus</h2>
    <button class="mp-button" type="button" data-variant="ghost" data-size="sm" data-icon-only aria-label="Close" commandfor="dialog-syllabus" command="close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="mp-dialog__body mp-prose">
    <h3>Week 1 — Start from the classroom</h3>
    <p>Bring one real problem. We map it before we touch a tool.</p>
    <h3>Week 2 — How models actually work</h3>
    <p>Tokens, context, and why a confident answer can still be wrong.</p>
  </div>
  <div class="mp-dialog__footer">
    <button class="mp-button" type="button" commandfor="dialog-syllabus" command="close">Done</button>
  </div>
</dialog>
```

## Accessibility

- Always open with `showModal()` (or `command="show-modal"`), never by toggling the `open` attribute — only the modal path traps focus and makes the page inert.
- Label it with `aria-labelledby` pointing at the title.
- Put focus somewhere sensible: by default the first focusable element; add `autofocus` to the least destructive button for confirmations.
- The page behind an open modal stops scrolling.

## API

<!-- GENERATED:API -->
_Generated from `dialog.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-dialog` | root |
| `.mp-dialog__header` | part of `.mp-dialog` |
| `.mp-dialog__title` | part of `.mp-dialog` |
| `.mp-dialog__body` | part of `.mp-dialog` |
| `.mp-dialog__footer` | part of `.mp-dialog` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `lg` |

**States styled** — `:modal` `[open]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-dialog-width` | `35rem` |

**Design tokens consumed** — `--blur-backdrop` `--border-default` `--color-bg-elevated` `--color-overlay-bg` `--color-text-primary` `--color-text-secondary` `--duration-normal` `--elevation-modal` `--font-sans` `--font-serif` `--leading-body` `--leading-subheading` `--radius-xl` `--space-2` `--space-3` `--space-4` `--space-6` `--text-body` `--text-h3` `--tracking-subheading` `--transition-default` `--weight-semibold`
<!-- /GENERATED:API -->
