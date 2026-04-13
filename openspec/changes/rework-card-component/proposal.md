# Proposal: Rework Card Component

## Summary

Rework the Card component to fix architectural flaws, align with Nimbus compound
component conventions, and add missing sub-components. The current
implementation uses a unique context-registration pattern (useState + useEffect
to register JSX from children into parent state) that no other Nimbus component
uses and that introduces re-render risks. This proposal replaces it with direct
rendering (matching Dialog, DefaultPage, Accordion, etc.), renames Content to
Body for Nimbus naming consistency, adds a Footer sub-component, and moves
padding logic to CSS-only slot styling.

## Motivation

1. **Context registration anti-pattern**: CardHeader and CardContent return
   `null` and use `useEffect` to register JSX into parent state. The effect
   dependencies include `styleProps` and `functionalProps` which are new objects
   every render, creating infinite re-render risk. Every other compound
   component in Nimbus renders children directly.

2. **Missing Footer**: Every major UI library (Chakra v3, MUI, shadcn, React
   Bootstrap) and Nimbus compound components (Dialog, DefaultPage) provide a
   footer region. Card lacks one.

3. **Naming inconsistency**: Nimbus convention is "Content" for outer structural
   containers (Dialog.Content, Drawer.Content) and "Body" for main content areas
   (Dialog.Body, Drawer.Body). Card.Content is doing the Body job.

4. **Non-standard variant props**: Card uses `cardPadding`, `borderStyle`,
   `elevation`, and `backgroundStyle` instead of the standard Nimbus `variant`
   and `size` props. Every other Nimbus component (Button, Badge, Alert, Tabs,
   etc.) uses `variant` for visual treatment and `size` for dimensional scaling.
   The four separate visual props create a combinatorial explosion (12
   permutations) that should be collapsed into curated `variant` presets.

5. **Hardcoded gap**: The internal Stack with `gap="200"` is not configurable.
   Consumers cannot fine-tune spacing between card sections.

6. **`display: inline-flex`**: Unusual default for a card container. Cards
   typically fill available width.

7. **Empty slot styles**: Header and Content slots are declared but have zero
   styles in the recipe, making the slot system pointless for these parts.

## Impact

- **Breaking change**: `Card.Content` renamed to `Card.Body`. Card is not yet in
  consumer use, so impact is zero.
- **Breaking change**: `cardPadding`, `borderStyle`, `elevation`,
  `backgroundStyle` replaced by standard `variant` and `size` props.
- **Additive**: `Card.Footer` new sub-component.
- **Internal**: Architecture simplification (context registration removed),
  recipe restructured for CSS-only padding distribution.

## Scope

- Affected spec: `nimbus-card`
- Files changed: `card.tsx`, `card.types.ts`, `card.recipe.ts`, `card.slots.tsx`,
  `components/card.root.tsx`, `components/card.header.tsx`,
  `components/card.content.tsx` (renamed to card.body.tsx),
  new `components/card.footer.tsx`, `components/index.ts`,
  `card.stories.tsx`, `card.docs.spec.tsx`, `card/index.ts`
- Theme registration: slot-recipes/index.ts (slot name update)

## Design Decisions

### Direct rendering over context registration

Every other Nimbus compound component (Dialog, DefaultPage, Accordion,
PageContent) renders children directly via slot components. The Card's
context-registration pattern was meant to enforce Header-before-Content ordering
regardless of JSX placement, but this guarantee adds complexity without clear
consumer value. Removing it aligns Card with the rest of the library.

### CSS-only padding distribution

Move padding from Root to individual slots using `:first-child` / `:last-child`
pseudo-selectors (Chakra `_first` / `_last` conditions). This ensures correct
top/bottom padding regardless of which combination of Header/Body/Footer is
present, with no runtime logic.

### Standard `variant` and `size` props

Nimbus convention: `variant` controls visual treatment (border, shadow,
background), `size` controls dimensions (padding, gap, font). Card's four
separate props (`cardPadding`, `borderStyle`, `elevation`, `backgroundStyle`)
are replaced by:

**`size`** (sm | md | lg, default: md) — replaces `cardPadding`:
- Controls padding on slots and gap between children
- sm: padding 200, gap 100
- md: padding 400, gap 200
- lg: padding 600, gap 400

**`variant`** (outlined | elevated | filled | plain, default: outlined) —
replaces `borderStyle` + `elevation` + `backgroundStyle`:
- `outlined`: border solid-25 + colorPalette.3, default bg, no shadow (current default)
- `elevated`: no border, shadow level 1, default bg
- `filled`: no border, no shadow, colorPalette.2 muted bg
- `plain`: no border, no shadow, default bg (minimal)

This eliminates the 12-permutation combinatorial explosion and gives consumers
the same vocabulary used by Button, Alert, Badge, Tabs, and every other Nimbus
component.

### Gap tied to size variant

Instead of a hardcoded `gap="200"`, the Root flex gap scales with the `size`
variant. This keeps proportional spacing without adding a new prop.

### display: flex (not inline-flex)

Cards are block-level containers. `flex` with `flexDirection: column` gives
natural full-width behavior while maintaining flex layout for internal spacing
via `gap`.
