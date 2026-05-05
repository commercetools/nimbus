---
"@commercetools/nimbus": minor
---

Rework Card component architecture and API.

**Breaking changes**

- `Card.Content` is renamed to `Card.Body`. Replace all usages.
- The four ad-hoc props `cardPadding`, `borderStyle`, `elevation`, and
  `backgroundStyle` are replaced by the standard Nimbus `variant` and `size`
  props.
  - `variant` (default `"outlined"`) — eight kebab-case names enumerating every
    combination of three independent visual axes: `outlined` (border),
    `elevated` (shadow), `muted` (background). Names list each enabled axis in
    the fixed order `outlined-elevated-muted` joined with `-`; the all-off case
    is `plain`. Full set:
    `"plain" | "outlined" | "elevated" | "outlined-elevated" | "muted" | "outlined-muted" | "elevated-muted" | "outlined-elevated-muted"`.
  - `size` (default `"md"`) — `"sm" | "md" | "lg"`, controlling internal padding
    via the `--card-spacing` CSS variable.

**New**

- `Card.Footer` slot for actions and metadata below the body.
- Slot-based ARIA labelling: placing `<Heading slot="title">` or
  `<Text slot="description">` inside a Card automatically wires
  `aria-labelledby` / `aria-describedby` on the root. The card itself stays a
  plain `<div>` — set `role` explicitly if a landmark role is needed.

**Internal**

- Replaces the previous context-registration pattern (children registering
  themselves with the parent via `useEffect`) with direct rendering. Eliminates
  the double-render cycle and Strict Mode incompatibility.
- Free-form Card.Root (no Header/Body/Footer slots) keeps `--card-spacing`
  padding via a CSS `:has()` selector, so direct children never render flush
  against the border.
