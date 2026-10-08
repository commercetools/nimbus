# Design: Virtualizer component

## Context

React Aria's `Virtualizer` (react-aria-components 1.21.1) renders no DOM
element. It only provides two contexts — `isVirtualized: true` plus the layout,
and the layout options — and the wrapped collection (ListBox, GridList, Table)
renders the scroll container
(`react-aria-components/dist/private/Virtualizer.mjs`). Inside the collection,
React Aria's `CollectionRoot`:

- calls `layout.useLayoutOptions?.()` and merges the result **over** the
  `layoutOptions` prop: `{...layoutOptions, ...layoutOptions2}`;
- runs with `allowsWindowScrolling: true`, so a collection without its own
  bounded height scrolls with its nearest scrolling ancestor;
- renders each item inside a `<div role="presentation">` with
  `position: absolute`
  (`react-aria/dist/private/virtualizer/VirtualizerItem.mjs`).

React Aria Components' `TableLayout` and `GridLayout` use that hook: the table
returns `columnWidths` from the column-resize context, the grid returns
`direction` from `useLocale()`
(`react-aria-components/dist/private/TableLayout.mjs:20-28`,
`GridLayout.mjs:20-28`). `ListLayout` is re-exported from `react-stately`
unchanged (`dist/types/exports/index.d.ts:87`).

The scroll view sets inline `padding: 0` ("Padding will be done in JS layout",
`ScrollView.mjs:249`), and CSS `gap` has no effect on absolutely positioned
items. A Nimbus collection therefore loses its recipe padding and gap when
virtualized, unless the layout supplies them.

`ListLayout` and `GridLayout` mark every item `allowOverflow = true`
(`react-stately/dist/private/layout/ListLayout.mjs:218`, `GridLayout.mjs:106`),
so item wrappers use `overflow: visible` and outside focus rings are not clipped
by the wrapper.

Row sizes: when a fixed `rowSize` is set, rows use it and are not measured.
Otherwise each row starts with `estimatedRowSize` (48px if unset), is marked
estimated, and is measured after it renders; it is re-estimated when the
container width or the item changes (`ListLayout.mjs:335-351`, measurement in
`useVirtualizerItem.mjs:41`). With `shouldObserveItemSize`, a `ResizeObserver`
re-measures an item when it changes size (`useVirtualizerItem.mjs:47-60`).

Option names differ between layouts: `ListLayout` reads `rowSize ?? rowHeight`
and marks `rowHeight` as deprecated, while `TableLayout` only has `rowHeight`
(`ListLayout.d.ts:66`, `TableLayout.d.ts:8`).

All Nimbus size tokens are pixel values: `theme-tokens.ts` contains no `rem`,
and text style `md` is `fontSize: "16px", lineHeight: "22px"`
(`packages/tokens/src/generated/chakra/theme-tokens.ts`). ListBox item labels
can wrap: the recipe sets no `white-space` rule
(`packages/nimbus/src/components/list-box/list-box.recipe.ts`).

The motivating consumers and the ticket context are in `proposal.md`.

## Goals / Non-Goals

**Goals:**

- Consumers virtualize any supporting Nimbus collection with one prop, the same
  way on every collection.
- One generic, internal `Virtualizer` engine with list, grid and table layouts,
  which every Nimbus collection reuses.
- A Nimbus API that hides React Aria layout classes and option names.
- Rows never overlap or clip under browser zoom, text spacing overrides, larger
  fonts, wrapping labels or custom item content.
- ListBox as the first collection that supports it, ready for ComboBox and
  Select to reuse (FEC-1147, FEC-1148).

**Non-Goals:**

- A public `Virtualizer` component (Decision 10). Styled GridList (FEC-1140),
  DataTable virtualization (FEC-1145), ComboBox and Select virtualization
  (FEC-1147, FEC-1148).
- `WaterfallLayout`, horizontal list orientation, and custom consumer layouts.
- Reducing the cost of building the collection: React Aria still builds the
  whole collection in JavaScript (`CollectionBuilder.mjs:231`); virtualization
  only removes DOM and browser layout work. The timing story (Decision 12) shows
  how much remains.

## Decisions

### Decision 1 — A Nimbus component, not a re-export

`Virtualizer` is an internal Nimbus component that wraps React Aria's
`Virtualizer`.

- **Alternative: re-export React Aria's `Virtualizer` and layouts** (the
  ticket's original wording). Rejected: every consumer would have to repeat the
  style workarounds (the docs search already does:
  `style={{ overflow: "visible", display: "block", padding: 0 }}` in
  `app-nav-bar-search.tsx:338-342`), and React Aria renames would become Nimbus
  breaking changes. Consumers also never use React Aria directly (Decision 10).

The component renders no DOM element, so it has no recipe and no slots.

### Decision 2 — Consumers turn virtualization on at the collection

Every supporting Nimbus collection exposes two optional root props:

```tsx
<ListBox.Root isVirtualized virtualizerOptions={{ estimatedRowHeight: 56 }} />
// later, same contract:
<ComboBox.Root isVirtualized />
<DataTable isVirtualized />
```

- `isVirtualized` follows Nimbus boolean naming (`isDisabled`, `isInvalid`).
- `virtualizerOptions` avoids `layoutOptions`, because React Aria's `ListBox`
  already has a `layout` prop (`"stack" | "grid"`, `ListBox.mjs:241`).

The collection renders the `Virtualizer` itself. It knows where its list sits
(for example inside a ComboBox popover), which defaults fit its `size` and
`variant`, and which element bounds its height.

- **Alternative: consumers wrap the collection in `<Virtualizer>`.** Rejected:
  an extra import, and for compound components the consumer must know the inner
  structure (where `ComboBox.ListBox` sits inside `ComboBox.Popover`).

### Decision 3 — List, grid and table layouts, all internal

```ts
type VirtualizerProps =
  | {
      layout?: "list";
      layoutOptions?: VirtualizerListLayoutOptions;
      children: ReactNode;
    }
  | {
      layout: "grid";
      layoutOptions?: VirtualizerGridLayoutOptions;
      children: ReactNode;
    }
  | {
      layout: "table";
      layoutOptions?: VirtualizerTableLayoutOptions;
      children: ReactNode;
    };
```

ListBox uses the list layout. GridList (FEC-1140) and DataTable (FEC-1145) will
use the grid and table layouts. Of these types, only
`VirtualizerListLayoutOptions` is exported, because it types ListBox's
`virtualizerOptions`; the grid and table option types are exported when a
collection with that layout gets `virtualizerOptions`.

### Decision 4 — Collections pass merged options; no layout subclasses

The collection merges the consumer's `virtualizerOptions` over its own defaults
and passes the result as `layoutOptions` to the Nimbus `Virtualizer`. The
`Virtualizer` maps the names and passes them to React Aria's `layoutOptions`
prop, with the React Aria Components layout class (`ListLayout`, `GridLayout`,
`TableLayout`) used as-is.

Because React Aria merges each layout's own `useLayoutOptions()` result over the
`layoutOptions` prop, `columnWidths` (table) and `direction` (grid) keep working
without any Nimbus code, as long as Nimbus never sets those keys.

In ListBox, the `Virtualizer` wraps the root slot, because it renders no DOM
element and cannot be the child of an `asChild` slot:
`<Virtualizer><ListBoxRootSlot asChild><RaListBox /></ListBoxRootSlot></Virtualizer>`.
`isVirtualized` and `virtualizerOptions` are not forwarded to React Aria.

- **Alternative: layout subclasses whose `useLayoutOptions()` read collection
  defaults from context** (the previous design). Rejected: it depends on
  `LayoutOptionsDelegate`, which is not exported from the package entry, and the
  subclasses must call `super` correctly to keep column widths and direction.
  With the collection rendering the `Virtualizer`, the defaults are already
  available where the `Virtualizer` is rendered.

### Decision 5 — Merge and mapping rules

- A shared helper merges options: consumer `virtualizerOptions` over collection
  defaults. React Aria defaults apply to anything neither sets.
- A consumer `rowHeight` makes rows fixed and unmeasured, because a fixed size
  always wins in `ListLayout`. This is the opt-in for uniform single-line
  content (Decision 8).
- Mapping happens only for the list layout: `rowHeight` → `rowSize`,
  `estimatedRowHeight` → `estimatedRowSize`, `headingHeight` → `headingSize`,
  `estimatedHeadingHeight` → `estimatedHeadingSize`, `loaderHeight` →
  `loaderSize`. Table and grid names pass through.
- The merge and the mapping are pure functions with unit tests, so a React Aria
  upgrade that renames options fails a test instead of failing silently.

### Decision 6 — Spacing tokens converted to pixels

`gap` and `padding` accept a spacing token key or a number. Token keys are
resolved through `themeTokens` from `@commercetools/nimbus-tokens`, which the
theme already imports at runtime
(`packages/nimbus/src/theme/tokens/spacing.ts`). Token values are pixel strings
(spacing `100` is `"4px"`). An unknown token is a TypeScript error and, at
runtime, falls back to React Aria's default with a development warning.

### Decision 7 — Styles by data attribute; misuse warnings

A virtualized collection sets `data-virtualized` on its root, and its recipe
keys virtualized styles on that attribute. The collection knows its state from
its own `isVirtualized` prop. The attribute is a documented, tested contract,
because GridList, ComboBox, Select and DataTable will use the same pattern.

Development warning: `virtualizerOptions` without `isVirtualized` warns that the
options have no effect.

- **Alternative: a recipe variant `virtualized`.** Rejected: recipe variants
  become public props, and this state is set through `isVirtualized`.

### Decision 8 — Estimated, measured row heights by default

The component must work when the user zooms the browser, overrides text spacing,
or uses larger text. Four options were compared:

| Option                                                                    | Page zoom             | Text spacing override (WCAG 1.4.12)                                        | Wrapping labels, descriptions, custom content | Home/End precision                                                  |
| ------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| A. Fixed heights from tokens                                              | Works (tokens are px) | Breaks: line height 1.5 × 16px = 24px exceeds the 22px token, rows overlap | Breaks                                        | Exact                                                               |
| **B. Estimated heights from tokens + measurement + re-measure on resize** | Works                 | Works                                                                      | Works                                         | Exact for rendered rows; small correction when an estimate is wrong |
| C. Fixed heights + single-line truncation                                 | Works                 | Breaks (line height)                                                       | Works, but hides text                         | Exact                                                               |
| D. Measure one probe row at runtime, use it as fixed                      | Works                 | Works if applied globally                                                  | Breaks                                        | Exact                                                               |

**Chosen: B.** ListBox supplies `estimatedRowHeight`, `estimatedHeadingHeight`
and a loader height derived from its recipe tokens. For example, a single-line
`sm` row is `4px + 22px + 4px = 30px` (padding `100`, text style `sm` line
height) and an `md` row is `8px + 22px + 8px = 38px`. React Aria measures every
rendered row. The Nimbus `Virtualizer` always sets `shouldObserveItemSize`, so a
row that changes size after its first measurement is measured again.

When the estimate equals the real height — the common case of single-line items
at default settings — nothing shifts. When it is wrong, the scroll size corrects
as rows are measured. A story quantifies this correction.

Fixed heights (option A) remain available through `rowHeight` for uniform
single-line content where exact scroll positions matter more. The docs state
that fixed heights break under text spacing overrides and wrapping.

### Decision 9 — Grid and table layouts proven with plain React Aria collections

Nimbus has no GridList yet, and DataTable virtualization is FEC-1145. Internal
stories for the grid and table layouts use unstyled React Aria `GridList` and
`Table`, including a resizable table and a right-to-left grid, to prove that
column widths and direction survive the Nimbus options. They do not prove
DataTable's styling (sticky columns, recipe selectors for `table`, `tr` and
`td`, which no longer match when React Aria renders `div` elements); that is
FEC-1145.

### Decision 10 — Internal component; consumers use the collection prop

The `Virtualizer` component is **not exported**. Consumers only use Nimbus
components, never React Aria directly, so the only way to virtualize is the
`isVirtualized` prop of a Nimbus collection. The package exports one related
type, `VirtualizerListLayoutOptions`, which types `virtualizerOptions`.

The decision followed task 8.3: Nimbus bundles its own copy of React Aria
(externalization is on hold, `packages/nimbus/vite.config.ts:130-134`). A public
`Virtualizer` from the built package would provide its contexts from that
bundled copy, and a React Aria collection from the consumer's own
`react-aria-components` would never see it: in the built-bundle test, a wrapped
React Aria `ListBox` rendered all 10,000 options.

`isVirtualized` and `virtualizerOptions` are documented as experimental in the
ListBox documentation. The Virtualizer has no documentation page of its own; its
stories live under "Components/Virtualizer (internal)" for maintainers.

- **Alternative: export it, marked Experimental** (the earlier decision).
  Rejected: it cannot work with a consumer's own React Aria components, and
  consumers do not use React Aria components directly.
- **Alternative: externalize React Aria in the Nimbus build.** Rejected for this
  change: a cross-cutting build change that is deliberately on hold, and
  unnecessary once the component is internal.

### Decision 11 — Unbounded collections scroll with their parent; no warning

React Aria runs the virtualizer with `allowsWindowScrolling: true` and
intersects the collection with the browser window: "This allows virtualized
components unbounded height but still virtualize when scrolled with page"
(`react-aria/dist/private/virtualizer/ScrollView.mjs`, `updateVisibleRect`). A
collection without a bounded height therefore still renders only about one
window of items; it grows to its full height and scrolls with its parent or the
page. The docs search relies on this (`app-nav-bar-search.tsx`, a `ScrollArea`
parent scrolls an unbounded `ListBox`).

React Aria does not make the collection a scroll container. A collection with a
height but without `overflow: auto` does not scroll itself; the page scrolls
instead (found while writing the Virtualizer stories: the list's rectangle moved
319,000px up the page). Custom collections must set both a bounded height and
`overflow: auto`.

`ListBox` `variant="card"` is bounded and scrolls by its recipe
(`maxHeight: "40svh"`, `overflowY: "auto"`); `plain` scrolls with its parent.
The first documentation example shows a bounded height, and the docs explain the
unbounded behaviour. Each future collection must make its own scroll container
`overflow: auto`.

- **Alternative: a development warning when nothing is virtualized.** Rejected:
  with window intersection this case does not occur, so the warning would never
  fire.
- **Alternative: a warning when the page scrolls the collection.** Rejected:
  full-page lists are a valid use, and the warning would be noise.

### Decision 12 — Timing story to compare before and after

A story records, with `performance.now()`, the time to mount and the time to
first paint for a ListBox with 500 and 10,000 options, with and without
`isVirtualized`, and shows the numbers on screen. It also records the scroll
correction with estimated heights (Decision 8). The results are written into
this document after implementation. The story is not a CI gate: timings in
headless CI are not stable enough for a threshold.

**Results** (`list-box.timing.stories.tsx`, `pnpm test:dev`, headless Chromium,
source files not the built bundle, one developer laptop, three runs;
milliseconds from render start, median of the three):

| Case                            | Commit | Next paint | Options in DOM |
| ------------------------------- | ------ | ---------- | -------------- |
| 500 options, not virtualized    | 65.9   | 271.1      | 500            |
| 500 options, virtualized        | 21.0   | 32.8       | 8              |
| 10,000 options, not virtualized | 337.6  | 2,473.5    | 10,000         |
| 10,000 options, virtualized     | 401.8  | 419.9      | 8              |

- 500 options paint about 8 times faster (271 → 33 ms).
- 10,000 options paint about 6 times faster (2,474 → 420 ms), but still take
  about 400 ms: that is React Aria building the whole collection in JavaScript,
  which virtualization does not remove (see Non-Goals). For lists of that size a
  search or filter field is still the better experience.

**Scroll correction** (`VirtualizationScrollCorrection`, 500 options, scroll
height before and after scrolling through the whole list):

- Single-line options: 21,012 px → 21,012 px. The estimate matches, nothing
  shifts. The story asserts this.
- Every third label wrapping onto several lines: 21,144 px → 28,360 px. The
  scrollbar thumb shrinks by about a third while scrolling. Consumers with
  mostly multi-line options can pass a larger `estimatedRowHeight`.

### Decision 13 — ComboBox spike story (not shipped)

A story renders the current ComboBox list virtualized with 500 options to
answer, before FEC-1147: which element scrolls inside the popover, who bounds
its height, and where `ComboBox.Root` should render the `Virtualizer`. ComboBox
renders React Aria's `ListBox` directly (`combobox.listbox.tsx:2`). The story is
excluded from the published Storybook and from Chromatic, and its findings are
added to FEC-1147.

**Findings** (`combobox.virtualizer-spike.stories.tsx`, 500 options, passes):

1. The `ComboBox.ListBox` element is the scroll container (`overflowY: auto`).
2. The ComboBox recipe bounds its height (`listBox` slot, `maxH: "40svh"`), so
   consumers do not need to set one.
3. Filtering and keyboard navigation keep working: typing "Project 42" leaves
   the 10 matching options, and ArrowUp reaches the last one.
4. `ComboBox.Root isVirtualized` can therefore render the `Virtualizer` around
   its list inside the popover, as ListBox does. The `listBox` slot sets
   `gap: "100"` and `padding: "200"` in CSS, which have no effect when
   virtualized; FEC-1147 must move them into the layout defaults, as this change
   does for ListBox.

### Decision 14 — Deterministic tests

- Every virtualized story has a fixed width and height in pixels.
- Play functions wait with `waitFor` and `findBy*`, never with fixed timeouts;
  the first render can have no visible items until `ResizeObserver` reports the
  size.
- Scroll assertions use `scrollTop` and `scrollHeight` instead of animation.
- Typeahead types the full string in one `userEvent.keyboard` call.
- Height comparisons allow ±1px for subpixel rounding.
- Stories with 10,000 items disable Chromatic snapshots; one small story per
  size is snapshotted for visual regression.

## Risks / Trade-offs

- [React Aria merges its own `useLayoutOptions()` result over our options] →
  Nimbus never sets `columnWidths` or `direction`; the internal resizable-table
  and right-to-left stories fail if this changes.
- [Each collection must implement the contract] → The contract is one spec
  requirement, one merge helper, and one documented attribute; later tickets
  reuse them.
- [Estimated heights shift the scroll size while rows are measured] → Estimates
  come from the same tokens as the recipe, so single-line rows match. The timing
  story quantifies the shift; fixed heights stay available as opt-in.
- [`shouldObserveItemSize` adds a `ResizeObserver` per rendered row] → Only
  rendered rows (tens, not thousands) are observed. The timing story covers the
  cost.
- [React Aria's `ResizeObserver` watches only the item's direct children]
  (comment in `useVirtualizerItem.mjs:43-46`) → Changes deep inside an item that
  do not resize its direct children are not detected. ListBox items are shallow;
  documented for custom content.
- [Collection building still costs time for very large lists] → The timing story
  makes this visible; documented as a limit.
- [Browser find (Ctrl+F) does not reach off-screen items] → Documented, with a
  recommendation to add a search or filter field.
- [Section spacing differs from the non-virtualized ListBox] → `ListLayout`
  applies one `gap` between all rows, including section headers. The story
  compares both modes; if the difference is visible, ListBox adjusts section
  header spacing in its virtualized styles, or a list layout subclass adds
  section spacing in `buildSection`.
- [Bundle size grows] → Measured before and after with `pnpm check:bundle-size`:
  `@commercetools/nimbus` dist 20,985.0 KB → 21,582.9 KB (+2.8%, within policy).
  Most of it is source maps and the CommonJS copy; the ESM chunk a consumer
  loads (`internal-virtualizer`) is 62 KB minified. It is loaded only by
  components that import it. It includes the grid and table layouts, which no
  shipped component uses yet.

## Migration Plan

Additive change; no migration. Non-virtualized ListBox rendering is unchanged.
Rollback: remove the `virtualizer` folder and its type export, and revert the
ListBox root, types and recipe changes.

## Implementation Findings

- **Positions inside sections (React Aria limitation).** In a virtualized
  ListBox with sections, `aria-posinset` is the option's index inside its
  section, counting the section header, and `aria-setsize` counts the whole list
  (`listbox/useOption.mjs:52-55`). The first option of every section is
  announced as "2 of 1000". The story `VirtualizedWithSections` records this
  behaviour and fails if React Aria changes it. Documented as a known
  limitation; worth reporting upstream.
- **A bundled React Aria copy.** The public `Virtualizer` did not virtualize a
  consumer's own React Aria `ListBox` in the built bundle, because Nimbus
  bundles React Aria. This led to Decision 10 (internal component).
- **Wrapping a Nimbus collection in a `Virtualizer` loops.** Without the
  collection's virtualized styles and defaults, React reports "Maximum update
  depth exceeded". With the component internal, consumers cannot do this, so
  Nimbus adds no guard for it; collections must use `isVirtualized` internally
  too.
- **Focus ring at the scroll edge.** Keyboard focus scrolls the focused row
  flush with the scroll container's edge, cutting off the outside focus ring.
  React Aria's `scrollIntoView` respects CSS `scroll-padding`
  (`utils/scrollIntoView.mjs:38-41`), so the virtualized ListBox root sets
  `scrollPaddingBlock: "200"`.
- **Test environment.** React Stately renders every item when `NODE_ENV` is
  `"test"` unless `process.env.VIRT_ON` is set
  (`react-stately/dist/private/virtualizer/Virtualizer.mjs`,
  `getVisibleLayoutInfos`); in the browser test run the unreplaced `process`
  throws. `.storybook/main.ts` defines `process.env.VIRT_ON`, so the stories
  test real virtualized rendering.
- **Scrolling disables pointer events.** While the list scrolls, React Aria sets
  `pointer-events: none` on the content. Play functions that click after a
  keyboard scroll wait for it to end.
