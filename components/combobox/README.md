---
name: Combobox
category: Forms
status: beta
summary: A text input that suggests options as you type — accent-insensitive filtering, arrow-key navigation and a result count for screen readers, via membrane.js.
---

# Combobox

For choosing one value from a list too long to scan: a country, a course, a topic out of fifty. Typing filters the list, ↑/↓ move through the matches and Enter picks one. The person can still type a value that isn't in the list, so it behaves like a text field with help rather than a closed `<select>`.

The input is a normal `.mp-input`, so it inherits sizes, focus, `aria-invalid` and `disabled`. `components/membrane.js` does the rest:

- filters as you type, ignoring case and accents ("educacao" finds "Educação");
- opens on typing, a click, ↓ or Alt+↓, and closes on Escape, Tab or when focus leaves;
- keeps `aria-expanded` and `aria-activedescendant` in sync, and marks the active option with `aria-selected="true"`, as the ARIA pattern specifies;
- writes the match count into the `.mp-combobox__status` live region;
- fires `input` and `change` on the field when an option is chosen.

Without the script it is a plain text input and the list stays hidden, so nothing breaks.

## When not to use

- Fewer than about 10 options, or the person must pick from the list → a `<select>` ([Input](../input/README.md)) or radios ([Choice](../choice/README.md)).
- Searching content (pages, articles) rather than choosing a value → a search field and a results page.
- No JavaScript at all on the page → `<input list>` with a `<datalist>`. It's native and unstyleable, but it works everywhere.

## Examples

### Topic

```html
<div class="mp-field">
  <label class="mp-field__label" for="combo-topic">Workshop topic</label>
  <div class="mp-combobox">
    <input class="mp-input mp-combobox__input" id="combo-topic" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combo-topic-list" aria-describedby="combo-topic-hint" autocomplete="off">
    <ul class="mp-combobox__list" id="combo-topic-list" role="listbox" aria-label="Topics" hidden>
      <li class="mp-combobox__option" id="combo-topic-1" role="option" aria-selected="false">AI literacy for educators</li>
      <li class="mp-combobox__option" id="combo-topic-2" role="option" aria-selected="false">Assessment design</li>
      <li class="mp-combobox__option" id="combo-topic-3" role="option" aria-selected="false">Educação e tecnologia</li>
      <li class="mp-combobox__option" id="combo-topic-4" role="option" aria-selected="false">Learning analytics</li>
      <li class="mp-combobox__option" id="combo-topic-5" role="option" aria-selected="false">Prompt craft</li>
      <li class="mp-combobox__option" id="combo-topic-6" role="option" aria-selected="false">Transformação digital</li>
    </ul>
    <p class="mp-combobox__empty" hidden>No topics match. You can still use what you typed.</p>
    <p class="mp-combobox__status" role="status"></p>
  </div>
  <p class="mp-field__hint" id="combo-topic-hint">Start typing, or press ↓ to see every topic.</p>
</div>
```

### With hints and an unavailable option

```html
<div class="mp-field">
  <label class="mp-field__label" for="combo-cohort">Cohort</label>
  <div class="mp-combobox">
    <input class="mp-input mp-combobox__input" id="combo-cohort" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="combo-cohort-list" autocomplete="off" placeholder="Rio, São Paulo, online…">
    <ul class="mp-combobox__list" id="combo-cohort-list" role="listbox" aria-label="Cohorts" hidden>
      <li class="mp-combobox__option" id="combo-cohort-1" role="option" aria-selected="false">Rio de Janeiro <span class="mp-combobox__hint">March</span></li>
      <li class="mp-combobox__option" id="combo-cohort-2" role="option" aria-selected="false">São Paulo <span class="mp-combobox__hint">April</span></li>
      <li class="mp-combobox__option" id="combo-cohort-3" role="option" aria-selected="false" aria-disabled="true">Belo Horizonte <span class="mp-combobox__hint">Full</span></li>
      <li class="mp-combobox__option" id="combo-cohort-4" role="option" aria-selected="false" data-mp-value="Online">Online, any time zone <span class="mp-combobox__hint">Rolling</span></li>
    </ul>
    <p class="mp-combobox__empty" hidden>No cohort matches.</p>
    <p class="mp-combobox__status" role="status"></p>
  </div>
</div>
```

## Accessibility

- Follows the WAI-ARIA *editable combobox with list autocomplete* pattern:
  - the input has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded` and `aria-controls`;
  - the list has `role="listbox"` and an `aria-label`;
  - each option has `role="option"` and a unique `id`.
- Focus never leaves the input. The active option is announced through `aria-activedescendant` and shown with a wash plus an inline-start bar, so color alone isn't the signal.
- The `.mp-combobox__status` region must be in the markup from the start; live regions added later aren't announced.
- `aria-disabled="true"` options stay visible, so the person learns they exist, but they can't be chosen. Put the reason in a `.mp-combobox__hint` ("Full").
- The chosen value is the option's text. To submit something else, put it in `data-mp-value` on the option.

## API

<!-- GENERATED:API -->
_Generated from `combobox.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-combobox` | root |
| `.mp-combobox__input` | part of `.mp-combobox` |
| `.mp-combobox__list` | part of `.mp-combobox` |
| `.mp-combobox__empty` | part of `.mp-combobox` |
| `.mp-combobox__option` | part of `.mp-combobox` |
| `.mp-combobox__hint` | part of `.mp-combobox` |
| `.mp-combobox__status` | part of `.mp-combobox` |

**States styled** — `:hover` `[aria-disabled="true"]` `[aria-expanded="true"]` `[aria-selected="true"]` `[hidden]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-combobox-max-height` | `16rem` |

**Design tokens consumed** — `--border-default` `--border-width-medium` `--border-width-thick` `--color-bg-active` `--color-bg-elevated` `--color-bg-hover` `--color-focus` `--color-text-primary` `--color-text-secondary` `--duration-fast` `--duration-normal` `--elevation-overlay` `--font-sans` `--radius-md` `--radius-sm` `--size-control-sm` `--size-touch-target` `--space-1` `--space-10` `--space-2` `--space-3` `--space-5` `--state-disabled-opacity` `--text-small` `--text-xs` `--transition-enter` `--transition-exit` `--z-dropdown`
<!-- /GENERATED:API -->
