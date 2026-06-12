## Context

See `proposal.md` (RFC) for full motivation and API design. This document
covers implementation-level technical decisions.

React Aria Components v1.12+ ships two primitives Nimbus has not adopted:

- **Autocomplete** — wraps any text input + any collection component. Provides
  client-side filtering via a `filter` prop, virtual focus (arrow keys navigate
  the collection while the input retains DOM focus), and async loading (omit
  `filter`, control `inputValue`/`onInputChange` externally). Works with
  ListBox, GridList, Menu, Tree, Table, TagGroup.
- **Virtualizer** — wraps any collection component. Positions items via a
  `Layout` object (ListLayout, GridLayout, WaterfallLayout, TableLayout). Only
  renders items visible in the scroll viewport.

Both are compositional — they wrap child components via context, not props.
Autocomplete connects an input to a collection across arbitrary DOM boundaries
(e.g. a Popover between them). Virtualizer takes over CSS positioning for its
child collection.

The existing ComboBox.Root (~1590 lines) reimplements filtering, virtual focus,
and keyboard navigation that Autocomplete now provides. The rewrite replaces
those ~700 lines with `<Autocomplete>` as a child wrapper.

## Goals / Non-Goals

**Goals:**

- Ship ListBox, GridList, Autocomplete, Virtualizer as standalone Nimbus
  components with recipes, slots, types, stories, and docs.
- Rewrite ComboBox on Autocomplete so it accepts any collection child.
- Rewrite Select to compose standalone ListBox; support optional Autocomplete.
- Unify D&D as `dragAndDropHooks` on ListBox, GridList, Tree, DataTable.
- Add Virtualizer support (stories + docs) for ListBox, GridList, Tree,
  DataTable.
- Deprecate DraggableList.
- Preserve all existing ComboBox and Select public APIs.

**Non-Goals:**

- No changes to Menu internals (Menu uses RAC's own `Menu` primitive, not
  ListBox). Autocomplete + Menu composition is documented as a recipe, not a
  Menu API change.
- No changes to TagGroup.
- No custom Layout implementations. Nimbus re-exports RAC's built-in layouts.
- No server-side virtualization or infinite scroll primitive (consumers wire
  `useAsyncList` themselves).

## Decisions

### D1. Autocomplete replaces ComboBox's filtering + keyboard engine

ComboBox.Root currently owns: `useListState`, custom filtering, a 140-line
`handleInputKeyDown` switch, virtual focus management, and collection-specific
context distribution. All of this is what RAC's `Autocomplete` does generically
for any collection.

The rewrite places `<Autocomplete>` inside ComboBox.Root, wrapping the trigger
input and whatever collection is in the popover. ComboBox.Root retains only:
trigger/popover open/close, selection display (input text for single-select,
TagGroup for multi-select), clear button, async loading orchestration, and
custom option creation.

**Why:** ~700 lines of ComboBox.Root become unnecessary. The remaining ~400-500
lines of unique ComboBox behavior (trigger display, multi-select tags, async,
custom options) are genuinely component-specific and stay.

### D2. Autocomplete spans outside the Popover

```tsx
<ComboBox.Root>
  <Autocomplete filter={contains}>
    <ComboBox.Trigger />        {/* contains the input */}
    <ComboBox.Popover>
      <ListBox.Root>...</ListBox.Root>  {/* collection inside popover */}
    </ComboBox.Popover>
  </Autocomplete>
</ComboBox.Root>
```

Autocomplete connects input → collection via React Aria context, which crosses
the Popover boundary. The Popover only wraps the collection for overlay
positioning.

**Why:** This is how RAC's own ComboBox and Select examples work. The input
stays in the trigger (outside the popover), the collection is inside the
popover, and Autocomplete bridges them contextually.

### D3. ListBox and GridList as Tier 3 compound components

Both follow the standard Nimbus compound pattern with `.Root`, `.Item`,
`.Section` (ListBox only). Each has its own:

- Recipe (slot recipe with size variants matching existing component sizes)
- Slots (root, item, section header)
- Types (four-layer: recipe → slot → helper → main props)
- Stories (all visual states + play functions for interaction testing)
- barrel export

**Why:** Tier 3 is the right level — multiple coordinated parts with a Root,
but no complex generics or helper components beyond items and sections.

### D4. Virtualizer as a re-export wrapper

Nimbus's Virtualizer component is a thin styled wrapper that re-exports RAC's
`Virtualizer` and the layout classes (`ListLayout`, `GridLayout`,
`WaterfallLayout`, `TableLayout`). No custom layouts.

**Why:** RAC's Virtualizer handles all the hard work (intersection observation,
DOM recycling, position calculation). Nimbus adds Chakra styling integration
and ensures the Virtualizer plays well with Nimbus recipes. Custom layouts are
out of scope — RAC's four layouts cover all current use cases.

### D5. DraggableList maps to GridList + useDragAndDrop

The current DraggableList wraps RAC's GridList with `useDragAndDrop` and
`useListData` baked in. The replacement:

- `GridList.Root` replaces `DraggableList.Root`
- `GridList.Item` replaces `DraggableList.Item`
- Consumer calls `useDragAndDrop` themselves and passes `dragAndDropHooks`
- Consumer calls `useListData` themselves if they want managed list state

This matches how Tree and DataTable handle D&D.

**Why:** One D&D pattern across the system. The consumer has full control over
D&D configuration (drag preview, drop targets, reorder logic) instead of
DraggableList's opinionated defaults.

### D6. Select gains optional Autocomplete for searchable select

Select's public API is unchanged for the default case. For searchable select,
consumers wrap the options in `<Autocomplete>` inside the popover:

```tsx
<Select.Popover>
  <Autocomplete filter={contains}>
    <SearchField />
    <Select.Options>...</Select.Options>
  </Autocomplete>
</Select.Popover>
```

**Why:** This matches RAC's own pattern (see RAC Autocomplete docs, Select
example). No special Select API needed — Autocomplete is compositional.

### D7. ComboBox backwards compatibility via aliases

`ComboBox.ListBox` and `ComboBox.Option` are retained as aliases for
`ListBox.Root` and `ListBox.Item` (with ComboBox-specific context wiring).
Existing consumer code that uses the ComboBox namespace continues to work.

New collection types use their own namespaces directly:
`<Tree.Root>`, `<GridList.Root>` inside the ComboBox popover.

**Why:** Backwards compatibility with zero migration cost for existing consumers.
New capabilities use the natural namespace of the collection component.

## Risks / Trade-offs

- **Autocomplete RC status.** RAC Autocomplete was RC as of v1.12.0. Need to
  verify it handles all of ComboBox's edge cases: async debouncing, controlled
  input sync, custom option creation callbacks, multi-select with TagGroup. →
  Run ComboBox's full story test suite against the Autocomplete-based rewrite
  before shipping.
- **ComboBox rewrite regression risk.** The current Root handles many subtle
  behaviors (collection population detection, input/selection sync on mount,
  clear button focus management, scroll-to-close). Each needs explicit
  verification. → Preserve and run every existing story test.
- **Virtualizer + recipe interaction.** Virtualizer takes over CSS positioning.
  Recipe styles that depend on flexbox/grid layout may conflict. → Test each
  collection + Virtualizer combination; document any recipe overrides needed.
- **Bundle size for non-users.** Virtualizer and Autocomplete are new imports.
  → Both are tree-shakeable. Only consumers who import them pay the cost.
