---
name: Toast
category: Feedback
status: beta
summary: A brief, polite confirmation of something the person just did — one live region per page, MembranePalette.toast() or a data-mp-toast button, auto-dismissed unless it's an error.
exempt: data-leaving
---

# Toast

Toasts confirm an action that already happened ("Draft saved", "Link copied"). They are announced politely, never steal focus, and leave on their own — so they must never carry the only copy of something the person needs. Anything that needs a decision is a [Dialog](../dialog/README.md); anything that explains state on the page is an [Alert](../alert/README.md).

## Showing a toast

`components/membrane.js` exposes one function and one declarative hook:

```text
MembranePalette.toast({ title: 'Draft saved', body: 'Last edit 2 minutes ago.', tone: 'success' });
// options: title (required), body, tone: 'info' | 'success' | 'warning' | 'error', timeout (ms; 0 = stays)

<button class="mp-button" data-mp-toast="Link copied" data-mp-toast-tone="success">Copy link</button>
```

It creates the `.mp-toast-region` live region on first use. Toasts stay 6 seconds (longer while hovered or focused); **errors stay until dismissed**, so nobody misses them. They enter with `--transition-enter` and leave with the faster `--transition-exit` — `membrane.js` sets the runtime-only `data-leaving` attribute during the exit; never author it.

## Examples

### Tones

```html
<div class="mp-toast-region" data-placement="inline" aria-live="polite">
  <div class="mp-toast" data-tone="success">
    <div class="mp-toast__content"><p class="mp-toast__title">Draft saved</p><p>Last edit 2 minutes ago.</p></div>
    <button class="mp-toast__close" type="button" aria-label="Dismiss">×</button>
  </div>
  <div class="mp-toast">
    <div class="mp-toast__content"><p class="mp-toast__title">Workshop shared</p><p>Ana can now edit the syllabus.</p></div>
    <button class="mp-toast__close" type="button" aria-label="Dismiss">×</button>
  </div>
  <div class="mp-toast" data-tone="warning">
    <div class="mp-toast__content"><p class="mp-toast__title">Working offline</p><p>Changes will sync when you reconnect.</p></div>
    <button class="mp-toast__close" type="button" aria-label="Dismiss">×</button>
  </div>
  <div class="mp-toast" data-tone="error" role="alert">
    <div class="mp-toast__content"><p class="mp-toast__title">Couldn't publish</p><p>The cohort is full. Nothing was lost.</p></div>
    <button class="mp-toast__close" type="button" aria-label="Dismiss">×</button>
  </div>
</div>
```

### Triggered by a button

```html
<div class="mp-cluster">
  <button class="mp-button" type="button" data-variant="secondary" data-mp-toast="Link copied" data-mp-toast-body="Paste it anywhere." data-mp-toast-tone="success">Copy link</button>
  <button class="mp-button" type="button" data-variant="ghost" data-mp-toast="Couldn't reach the server" data-mp-toast-tone="error">Simulate an error</button>
</div>
```

## Accessibility

- The region is a polite live region; error toasts use `role="alert"`.
- Toasts never take focus. Errors persist until dismissed; others pause their timer while hovered or focused (WCAG 2.2.1).
- The close button needs `aria-label="Dismiss"`; it's 36px, above the 24px minimum.
- Don't put the only route to an action in a toast — it may be gone before someone reaches it.

## API

<!-- GENERATED:API -->
_Generated from `toast.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-toast-region` | root |
| `.mp-toast` | root |
| `.mp-toast__content` | part of `.mp-toast` |
| `.mp-toast__title` | part of `.mp-toast` |
| `.mp-toast__close` | part of `.mp-toast` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-leaving` | boolean — presence enables it |
| `data-tone` | `success` · `warning` · `error` |
| `data-placement` | `inline` |

**States styled** — `:focus-visible` `:hover`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-toast-accent` | `var(--color-info)` |
| `--mp-toast-title` | `var(--color-text-primary)` |

**Design tokens consumed** — `--border-default` `--border-width-thick` `--color-bg-elevated` `--color-bg-hover` `--color-error` `--color-error-text` `--color-info` `--color-success` `--color-success-text` `--color-text-primary` `--color-text-secondary` `--color-warning` `--color-warning-text` `--elevation-overlay` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-small` `--radius-full` `--radius-md` `--size-control-sm` `--space-1` `--space-2` `--space-3` `--space-4` `--space-6` `--text-body` `--text-small` `--transition-enter` `--transition-exit` `--weight-semibold` `--z-toast`
<!-- /GENERATED:API -->
