---
name: Field
category: Forms
status: stable
summary: Wraps one form control with its label, hint and error message; Fieldset groups related controls under a legend.
---

# Field

A field is the unit of a form: **label → control → hint or error**. The wrapper only handles spacing and type; the relationships come from HTML attributes, which is what screen readers actually read.

## When to use

- Every text input, select and textarea gets a `.mp-field`.
- Radio groups and checkbox lists get a `<fieldset class="mp-fieldset">` with a `<legend>`.

## Examples

### Label, hint and required marker

```html
<div class="mp-field">
  <label class="mp-field__label" for="field-email">Email<span class="mp-field__required" aria-hidden="true">*</span></label>
  <input class="mp-input" id="field-email" type="email" autocomplete="email" required aria-describedby="field-email-hint">
  <p class="mp-field__hint" id="field-email-hint">We'll only use it to send the workshop materials.</p>
</div>
```

### Error state

```html
<div class="mp-field">
  <label class="mp-field__label" for="field-handle">GitHub handle<span class="mp-field__optional">(optional)</span></label>
  <input class="mp-input" id="field-handle" type="text" value="id cesares" aria-invalid="true" aria-describedby="field-handle-error">
  <p class="mp-field__error" id="field-handle-error">Handles can't contain spaces — try "idcesares".</p>
</div>
```

### Fieldset

```html
<fieldset class="mp-fieldset">
  <legend class="mp-fieldset__legend">Preferred format</legend>
  <label class="mp-choice"><input class="mp-radio" type="radio" name="field-format" checked> In person</label>
  <label class="mp-choice"><input class="mp-radio" type="radio" name="field-format"> Online</label>
</fieldset>
```

## Accessibility

- `<label for>` must match the control's `id`. Placeholder text is **not** a label.
- Connect hints and errors with `aria-describedby` (space-separate multiple ids).
- Mark invalid controls with `aria-invalid="true"` — that attribute is what turns the border red, so the visual and the semantics can't disagree.
- The required asterisk is `aria-hidden`; the `required` attribute on the control is what assistive tech announces.
- Write error messages that say how to fix it, in the brand voice: specific, warm, no blame.

## API

<!-- GENERATED:API -->
_Generated from `field.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-field` | root |
| `.mp-fieldset` | root |
| `.mp-field__label` | part of `.mp-field` |
| `.mp-fieldset__legend` | part of `.mp-fieldset` |
| `.mp-field__required` | part of `.mp-field` |
| `.mp-field__optional` | part of `.mp-field` |
| `.mp-field__hint` | part of `.mp-field` |
| `.mp-field__error` | part of `.mp-field` |

**Design tokens consumed** — `--color-error-text` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--font-sans` `--leading-small` `--space-1` `--space-2` `--text-small` `--weight-medium` `--weight-regular`
<!-- /GENERATED:API -->
