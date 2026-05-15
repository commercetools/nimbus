## Context

The original Card component used a context-registration pattern in which
`CardHeader` and `CardContent` returned `null` and used `useEffect` to register
their JSX into parent state, which was then re-emitted by `Card.Root` in a
fixed order. No other Nimbus compound component used this pattern, and the
effect's dependency list (`styleProps`, `functionalProps`) contained newly
allocated objects on every render, creating an infinite re-render hazard. The
component also exposed four orthogonal visual props (`cardPadding`,
`borderStyle`, `elevation`, `backgroundStyle`), diverging from the standard
`variant` / `size` axes used across the rest of the library. Slots were
declared but empty, `display: inline-flex` produced unusual container sizing,
and a `Card.Footer` region — present in every comparable UI library — was
missing.

## Approach

Card is rebuilt as a plain compound component matching the Dialog / DefaultPage
pattern: `Card.Root` renders `children` directly through a flex column, and
`Card.Header`, `Card.Body`, `Card.Footer` are thin passthrough slot wrappers.
`Card.Content` is renamed to `Card.Body` to match the rest of Nimbus
(Dialog.Body, Drawer.Body). The four legacy visual props collapse into a
standard `variant` enum and a `size` enum. `variant` is intentionally widened
to all eight kebab-case permutations of the three independent visual axes
designers expose in Figma (`outlined`, `elevated`, `muted`), so every cell of
the 2×2×2 matrix is reachable through a single prop. `size` (`sm` | `md` | `lg`)
sets a `--card-spacing` CSS variable that drives all slot padding, replacing
the hardcoded `gap="200"`. Padding lives on the slots, not on Root; adjacent
sibling selectors (`.nimbus-card__header + .nimbus-card__body`, etc.) collapse
redundant top padding so any combination of slots produces correct spacing
with zero runtime logic, and a `:not(:has(...))` selector restores padding on
Root for free-form (slot-less) content. Accessibility is wired through
`useSlotId` plus a React Aria `Provider` exposing `HeadingContext` and
`TextContext` slots, so consumers who place `<Heading slot="title">` or
`<Text slot="description">` automatically get `aria-labelledby` /
`aria-describedby` on the card — without forcing a landmark `role`.

## Alternatives Considered

- **Keep curated variant names (`outlined`, `elevated`, `filled`, `plain`)** —
  rejected once the Figma surface confirmed three independent axes; curated
  names hid four of the eight valid cells.
- **Per-axis boolean/enum props (`outlined`, `elevated`, `background`)** —
  rejected to keep the prop surface consistent with every other Nimbus
  component (`variant` + `size` only).
- **Runtime detection of present slots to distribute padding from Root** —
  rejected in favor of pure CSS adjacent-sibling selectors driven by Chakra's
  generated slot class names.

## Risks / Trade-offs

- Breaking API change: `Card.Content` → `Card.Body`, and the four legacy
  visual props are removed. Card had not shipped to consumers yet, so the blast
  radius is zero.
- Padding relies on Chakra-generated class names matching
  `nimbus-card__{slot}`; if the recipe's `className` or slot keys ever drift,
  the adjacent-sibling collapsing silently breaks. The selectors are commented
  in the recipe to flag the dependency.
- Slot-based ARIA wiring is opt-in via React Aria slot props — consumers who
  do not use `slot="title"` / `slot="description"` get a plain `<div>` with no
  implicit role, which is intentional but means landmark behavior must be set
  explicitly on `Card.Root` when desired.
