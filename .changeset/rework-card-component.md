---
"@commercetools/nimbus": major
---

`Card`: reworked architecture and API.

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
- `Card.Root` is now a block-level `flex` container (previously `inline-flex`),
  filling available width by default.

**New**

- `Card.Footer` slot for actions and metadata below the body.
- Free-form `Card.Root` — when used without `Card.Header` / `Card.Body` /
  `Card.Footer`, padding now lives on the Root itself so arbitrary children
  never render flush against the border.
- Slot-based ARIA labelling: placing `<Heading slot="title">` or
  `<Text slot="description">` inside a Card automatically wires
  `aria-labelledby` / `aria-describedby` on the root. The card itself stays a
  plain `<div>` — set `role` explicitly if a landmark role is needed.

**Fixed**

- Card now renders correctly under React Strict Mode (the previous
  context-registration pattern caused a double-render cycle).
