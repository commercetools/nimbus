# Change: Add the Item component

## Why

Nimbus has containers for **vertical** content (`Card`) and for **interactive,
selectable** collections (`List`, `Menu`), but no primitive for the most common
shape in dense product UI: a **horizontal content row** — leading media, a
title/description column, and trailing actions. Consumers rebuild this layout ad
hoc (settings rows, notification entries, file/resource rows, summary rows),
each with slightly different spacing and alignment.

shadcn's React Aria `Item` is a well-shaped reference for exactly this row
primitive. Its React Aria variant integrates the framework in a single, precise
way: the row is a plain `<div>` and **upgrades to an accessible link only when an
`href` is present** (`const Element = "href" in props ? Link : "div"`). It never
becomes a button and never owns selection — those concerns belong to nested
`Button`s and to `List`/`Menu` respectively. That restraint is the right model
for Nimbus and is the crux of this proposal.

We adopt the shadcn anatomy in full (10 parts) and retrofit it to Nimbus
conventions: a Chakra v3 slot recipe, the `useLink` react-aria hook (the same
primitive Nimbus's own `Link` uses), and the compound `Item.*` namespace API
that mirrors `Card`.

## What Changes

**Component:** `Item` (Tier 3 compound).
**Package:** `@commercetools/nimbus`.
**Category:** Layout / Data display.

### 1. Compound anatomy — two peer components

shadcn's parts split cleanly along a structural line: the parts that live
*inside* a row share a styling context and belong to a compound `Item`; the
parts that *wrap* rows (`ItemGroup`, `ItemSeparator`) are parents of the row and
cannot share its context, so they are a separate peer component `ItemGroup`.
This mirrors the Nimbus convention (e.g. `ChatMessage` vs `ChatMessageList`) and
the documented compound-component rules.

`Item` publishes a slot-recipe styling context that every in-row part reads,
mirroring `Card`'s compound (dot-notation) form:

```tsx
<ItemGroup.Root>
  <Item.Root href="/settings/profile">
    <Item.Media variant="icon"><PersonIcon /></Item.Media>
    <Item.Content>
      <Item.Title>Profile</Item.Title>
      <Item.Description>Name, avatar, and contact details</Item.Description>
    </Item.Content>
    <Item.Actions>
      <IconButton aria-label="Open"><ChevronRightIcon /></IconButton>
    </Item.Actions>
  </Item.Root>
  <ItemGroup.Separator />
  <Item.Root>…</Item.Root>
</ItemGroup.Root>
```

- **`Item`** parts (share the row context): `Item.Root`, `Item.Header`,
  `Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`,
  `Item.Actions`, `Item.Footer`. `Header`/`Footer` are optional bands
  above/below the media+content+actions row.
- **`ItemGroup`** (standalone peer that wraps rows): `ItemGroup.Root` (vertical
  stack) and `ItemGroup.Separator` (divider between rows).

### 2. Interactivity — link-upgrade only

`Item.Root` renders a `<div>` by default. When `href` (plus optional link props:
`target`, `rel`, routing props, `onPress`/`onClick`) is passed, it renders as an
`<a>` whose accessible link behavior comes from the **`useLink` hook** from
`react-aria` — the same primitive `Nimbus`'s `Link` uses internally. Item is
**not** wrapped in Nimbus `<Link>` (whose own recipe would fight Item's);
Item's recipe stays authoritative on appearance while `useLink` supplies
keyboard, focus, and press semantics. Hover / focus-visible states are driven by
the recipe.

There is deliberately **no** button (`onPress`-as-button) mode and **no**
selectable mode:

- A row-as-button is semantically wrong (it announces the entire title +
  description + media subtree as one control) and **invalidates the nested
  action buttons** the component is designed to hold (`<button>` inside
  `<button>`). Real actions live as `Button`/`IconButton` in `Item.Actions`.
- Selection is `List`/`Menu`'s responsibility; duplicating it here would fork
  that logic.

### 3. Styling — one slot recipe, tokens only

A single Chakra `defineSlotRecipe` keyed `nimbusItem` (className `nimbus-item`)
with a slot per part. Design tokens only (spacing, colors, radii, typography) —
no hard-coded values. Registered as `nimbusItem` in
`src/theme/slot-recipes/index.ts`.

- **`Item.Root`** axes: `variant` = `plain | outline | subtle` (default `plain`);
  `size` = `xs | sm | md` (default `md`).
- **`Item.Media`** axis: `variant` = `default | icon | image`.

Naming note: `outline` and `subtle` are used deliberately. They match the
Nimbus-wide variant vocabulary (`button`, `avatar`, `code`, `toast` all use
`subtle`); `Card`'s `outlined`/`muted` spelling is the outlier and is **not**
changed by this proposal.

### 4. Accessibility (WCAG 2.1 AA)

`Item.Group` exposes `role="list"` (and rows read as its items); a link-mode
`Item.Root` is a real, keyboard-focusable `<a>` with a recipe-driven
focus-visible ring; `Item.Media` is treated as decorative unless the consumer
names it; nested action buttons retain an independent focus order distinct from
the row link.

## Out of scope

- **Button / pressable row mode** and **selectable / multi-select rows** —
  intentionally excluded (see §2); served by nested `Button`s and by
  `List`/`Menu`.
- **Changing `Card`'s `outlined`/`muted` variant names** to match `outline`/
  `subtle` — separate scope.
- **A batteries-included icon/avatar inside `Item.Media`** — `Media` is a layout
  slot; the consumer supplies the `Icon`/`Avatar`/`Image`.

## Rejected alternatives

- **`onPress` button mode on `Item.Root`** — rejected: semantically wrong for a
  multi-part content row and invalidates the nested `Item.Actions` buttons.
- **Wrapping the row in Nimbus `<Link>`** — rejected: the `Link` recipe
  (font color, underline) would conflict with Item's recipe; reusing the
  `useLink` hook keeps Item's styling authoritative.
- **Dropping `Header`/`Footer` for a leaner surface** — rejected: the user chose
  full shadcn parity so consumers can add per-row header/footer bands.

## Impact

- **Two new capabilities: `nimbus-item` and `nimbus-item-group`.**
- **New component** `packages/nimbus/src/components/item/` — namespace object,
  per-part files under `components/`, types, recipe, slots, stories, docs.
- **New component** `packages/nimbus/src/components/item-group/` — the standalone
  `ItemGroup` peer (Root + Separator), its own types, recipe, slots, stories,
  docs.
- **Recipes** registered as `nimbusItem` and `nimbusItemGroup` in the theme.
  `nimbusItem`: `variant` (`plain`/`outline`/`subtle`) + `size`
  (`xs`/`sm`/`md`) on the root, media `variant` (`default`/`icon`/`image`) via a
  `data-variant` attribute. `nimbusItemGroup`: `root` + `separator` slots.
- **Barrel exports** `Item`, `ItemGroup`, and their public types from
  `@commercetools/nimbus`.
- Lifecycle **Beta**; noted in the changeset.
- Figma Code Connect deferred (no Figma design source; designed from the shadcn
  React Aria reference).
- No tokens-package changes.
