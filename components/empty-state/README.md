---
name: Empty state
category: Feedback
status: stable
summary: What a view shows before it has content — icon on a warm wash, Fraunces title, one sentence of guidance and the next action.
---

# Empty state

An empty list is a teaching moment, not an error. The pattern is fixed: **what this place is for → why it's empty → the one thing to do next.** Write it in the brand voice — warm and concrete, never cute or apologetic.

## Examples

### First use

```html
<div class="mp-empty">
  <div class="mp-empty__media">
    <svg class="mp-icon" data-size="xl" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
  </div>
  <h3 class="mp-empty__title">Your reading list starts here</h3>
  <p class="mp-empty__body">Save essays and case studies while you browse — they'll wait for you here, in the order you saved them.</p>
  <div class="mp-empty__actions">
    <a class="mp-button" href="#components">Browse essays</a>
  </div>
</div>
```

### No results (bordered)

```html
<div class="mp-empty" data-variant="bordered">
  <h3 class="mp-empty__title">No workshops match "robotics"</h3>
  <p class="mp-empty__body">Try a broader word, or clear the filters to see everything that's open this term.</p>
  <div class="mp-empty__actions">
    <button class="mp-button" type="button" data-variant="secondary">Clear filters</button>
    <button class="mp-button" type="button" data-variant="ghost">Suggest a topic</button>
  </div>
</div>
```

## Accessibility

- Use a real heading at the right level for `.mp-empty__title`.
- When the empty state replaces results after a search, announce it: put it inside (or update) a `role="status"` region.
- The illustration is decorative (`aria-hidden="true"`).

## API

<!-- GENERATED:API -->
_Generated from `empty-state.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-empty` | root |
| `.mp-empty__media` | part of `.mp-empty` |
| `.mp-empty__title` | part of `.mp-empty` |
| `.mp-empty__body` | part of `.mp-empty` |
| `.mp-empty__actions` | part of `.mp-empty` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `bordered` |

**Design tokens consumed** — `--border-width-thin` `--color-border-emphasis` `--color-human-bg` `--color-human-text` `--color-text-primary` `--color-text-secondary` `--container-sm` `--font-sans` `--font-serif` `--leading-body` `--leading-subheading` `--radius-full` `--radius-lg` `--space-10` `--space-2` `--space-20` `--space-3` `--space-6` `--text-h3` `--tracking-subheading` `--weight-semibold`
<!-- /GENERATED:API -->
