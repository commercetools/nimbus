# Design: ListBox

This records the decisions behind the ListBox variant set and their evidence.
Two sources ground it: the variant research
(`docs/research/list-box-variants.research.md`, 22 sources, 24 verified claims)
and an inspection of Nimbus's own Select / ComboBox / Menu / Popover code (file
paths cited inline). React Aria version in the repo: `react-aria-components@1.20.0`.

## Decision 1 — One component, not an embedded-only variant

React Aria reuses the same `ListBox` as the popup content of Select, ComboBox,
and Autocomplete ("Select reuses the ListBox component"; "`ComboBox` reuses the
`ListBox` component" — React Aria docs). Nimbus already proves this locally:
`select/components/select.options.tsx` and `combobox/components/combobox.list-box.tsx`
each wrap `RaListBox` independently. We therefore build **one** `ListBox`,
styled to read well both standalone and inside an overlay, rather than two
shapes.

## Decision 2 — Selection affordance is mode-driven (single = highlight, multiple = checkbox)

**Inspection result (Q1):** every existing Nimbus list uses a **full-row
background highlight** for single-select, not a checkmark:

- `select/select.recipe.tsx` option slot: `&[aria-selected="true"] { bg: primary.3 }`,
  `&[data-focused="true"] { bg: primary.2 }`; `select.option.tsx` renders no icon.
- `menu/menu.recipe.tsx` item slot: `&[data-selected] { bg: primary.3 }`,
  hover/focus `bg: primary.2`.
- `combobox/combobox.recipe.ts` mirrors Select for single-select; a leading
  checkbox + `Check` glyph appears **only** in multiple mode
  (`combobox.option.tsx`: `renderProps.selectionMode === "multiple"`), styled by
  spreading the Checkbox recipe's `indicator`.

The research confirms this is the correct convention and, importantly, that
multi-select does **not** universally require a checkbox — React Aria's own
multi-select contact-list uses a plain highlight ("often used when checkboxes in
each row are not desired"). But since ListBox must be able to back
Select/ComboBox/Menu, we adopt their convention as the default:

- **single-select** → full-row highlight (`selected` = `primary.3`, `focused` =
  `primary.2`), no icon.
- **multiple-select** → leading checkbox indicator (reusing the Checkbox
  recipe), and the resting row highlight is suppressed (as ComboBox does). A
  selected row still shows the ordinary hover/focus highlight, since the
  checkbox — not the row background — carries the selection signal.
- **single-select, selected + hovered/focused** → the selection highlight must
  never weaken. The combined state mixes the _same_ selected color toward higher
  contrast against the page background, rather than falling back to the lighter
  hover token, so a hovered/focused selected row stays clearly selected. The mix
  is **mode-aware** because the `primary` ramp flips direction between themes
  (light: higher steps darker against a white bg; dark: higher steps lighter
  against a near-black bg), so it mixes toward `black` in light and `white` in
  dark — a single-direction mix would invert in one mode. Light is the
  _unconditional_ default with `_dark` as an override (not two `_light`/`_dark`
  branches): Chakra's colour-mode conditions compile to ancestor-class
  selectors, so a two-branch form emits nothing when no `.light`/`.dark` class
  is on an ancestor (first paint, or rendered outside the colour-mode provider)
  and the row would fall back to the plain hover color. (A token step such as
  `primary.4` would be directionally safe in both modes by construction and
  avoids `color-mix`'s browser floor; revisit at the #1950 migration.)

**Phase-3 migration heads-up.** `primary.3`/`primary.4` do not mean the same
thing across the selectable-list family: ListBox uses `primary.3` = selected /
`primary.2` = hover; DataTable uses `primary.3` = hover / `primary.4` = selected;
Select/ComboBox currently paint selected+hover at `primary.2` (hover wins). When
Select/ComboBox are rewired onto ListBox (Phase 3) they will inherit ListBox's
stronger combined state — an improvement, but a visible change to two shipping
components that should get designer sign-off on which step means "selected"
before it lands.

Encoded in the recipe via a `selectionMode` variant reacting to React Aria's
`[data-selection-mode="single|multiple"]` and `[data-selected]` item state.
We standardise on the **render-prop attribute `[data-selected]`** (matches Menu
and RA 1.20.0's `ListBoxItem` output) rather than Select/ComboBox's older
`[aria-selected="true"]`. An explicit `checkmark` affordance override is noted
as a future extension, not built in v1, to stay consistent with the rest of
Nimbus.

Note: RA 1.20.0 has **no `SelectionIndicator` component** (that is a newer
Spectrum-2 addition). The multi-select checkbox is rendered from the item's
`isSelected` render prop, exactly as `combobox.option.tsx` already does.

## Decision 3 — Container is a variant on ListBox, not inherited from Popover

**Inspection result (Q2):** there is no shared card the list can lean on. None
of Select/ComboBox/Menu routes its dropdown through the shared Nimbus `Popover`;
each re-declares its own surface. Select puts the entire card (bg, `borderRadius:
200`, `boxShadow: 5`, `maxHeight: 40svh`, `overflowY: auto`, thin scrollbar,
`p: 200`) on the ListBox `options` slot itself (`select.recipe.tsx`).

So a standalone ListBox must carry its own surface, and an embedded one must be
able to drop it (the popover already provides the card). Decision:

- `variant="card"` (default) — bordered/elevated surface mirroring Select's
  `options` slot: `bg`, `borderRadius: 200`, `boxShadow: 5`, `maxHeight: 40svh`,
  `overflowY: auto`, thin scrollbar, `p: 200`.
- `variant="plain"` — no surface, no shadow, no max-height; a bare list for
  embedding inside an already-carded popover.

## Decision 4 — Rich item content via slots (cheap, RA-native)

Every mature system models an item as slots: leading icon/avatar, primary label
+ secondary description, trailing meta/action, section header (Primer
ActionList, MUI List). React Aria's `ListBoxItem` already exposes
`<Text slot="label">` / `<Text slot="description">`, and `ListBoxSection` +
`Header`. ListBox provides recipe slots for `itemLabel`, `itemDescription`,
`itemLeading` (media), `itemTrailing`, `itemIndicator` (multi checkbox),
`section`, and `sectionHeader`. Simple string children remain the common case.

## Decision 5 — Empty / loading / disabled states

**Inspection result (Q3):**

- **Disabled** is solid and consistent: `layerStyle: "disabled"` (opacity 0.5,
  `cursor: not-allowed`, `theme/layer-styles.ts`). ListBox reuses it, keyed on
  `[data-disabled]`.
- **Empty** is a gap: only ComboBox has one, as a raw React Aria
  `renderEmptyState` string carrying a `TODO: verify wording and styling`
  comment; Select and Menu have none. ListBox adds a **styled `emptyState`
  slot** and a localized default message (`Nimbus.ListBox.emptyState`,
  "No options available"), overridable via `renderEmptyState`.
- **In-list loading** is a gap: loading only ever appears as a trigger spinner.
  ListBox adds a styled `loader` slot rendered through React Aria's
  `ListBoxLoadMoreItem` (`isLoading`) for async/infinite lists.

## Variants — summary

| Variant | Values | Default | Priority | Source |
| --- | --- | --- | --- | --- |
| `size` | shared Nimbus size scale | (scale default) | Essential | Ticket + research |
| `variant` | `card` \| `plain` | `card` | Essential | Inspection Q2 |
| selection affordance | mode-driven (highlight \| checkbox) | by `selectionMode` | Essential | Inspection Q1 + research |
| `density` | ~~`comfortable` \| `compact`~~ | — | **Deferred (not in v1)** | Research (MUI/Primer) |

**Density deferred from v1.** The research rated `density` a _nice-to-have_ on
thin evidence — only MUI + Primer supported it; Spectrum 2, Carbon, Fluent 2,
Material 3, Base UI and shadcn yielded no confirmed claims (see
`docs/research/list-box-variants.research.md`). No existing Nimbus component
combines a `size` and a `density` axis (data-table has density only; Select /
ComboBox / Menu have size only), so shipping both here would have doubled the
vertical-rhythm matrix for a low-evidence axis. In v1 `size` owns the row rhythm
(distinct per-size inline/block padding and height). Revisit `density` as a
follow-up if a data-dense consumer need materialises.

## Component / recipe shape

- Chakra `defineSlotRecipe` (multi-slot), registered as `nimbusListBox` in
  `theme/slot-recipes/index.ts` (identifier-safe key; build-theme-typings fails
  silently on a bad key). The slots file uses
  `createSlotRecipeContext({ key: "nimbusListBox" })` — the key must match.
- Slots → React Aria parts (modelled on `select.options.tsx` /
  `combobox.list-box.tsx`, using the `asChild` slot-wrapper pattern):
  - `root` → `RaListBox` (also the card surface)
  - `item` → `RaListBoxItem`
  - `itemIndicator` / `itemLeading` / `itemLabel` / `itemDescription` /
    `itemTrailing` → layout wrappers inside the item
  - `section` → `RaListBoxSection`; `sectionHeader` → `RaHeader`
  - `emptyState`, `loader` → non-RA wrappers
- React Aria state consumed via data-attribute selectors:
  `[data-selected]`, `[data-focused]`, `[data-focus-visible]`,
  `[data-disabled]`, `[data-selection-mode]`, `[data-empty]`,
  `[data-drop-target]`, `[data-dragging]`.

## Explicitly NOT building blocks

Nimbus's existing `List`, `Item`, and `ItemGroup` are presentational primitives
(`<ul>/<li>`, plain `<div>` rows) with no React Aria collection, selection, or
focus management (`item.tsx`: "Presentational by default"). They are **not**
used here. The reusable listbox building blocks are React Aria's
`ListBox`/`ListBoxItem`/`ListBoxSection`, already wrapped by Select and ComboBox.

## Known gotcha to avoid

`combobox.recipe.ts`'s `selectionMode.multiple` variant targets an `options` key
that is not a declared slot (the declared slot is `listBox`), so that block is a
silent no-op. Do not copy it verbatim; target real slot keys.
