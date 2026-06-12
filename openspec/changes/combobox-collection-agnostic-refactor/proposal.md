# RFC: Collection Primitives & Compositional Architecture (Nimbus 4.0)

**Status:** Draft
**Author:** Byron Wall
**Date:** 2026-06-12

## Summary

Introduce standalone collection primitives (ListBox, GridList, Autocomplete,
Virtualizer), rewrite ComboBox and Select as thin compositional layers on top of
them, unify drag-and-drop as an opt-in prop across all collection components,
and add virtualization support to every relevant component. Deprecate
DraggableList.

## Motivation

Nimbus has no standalone collection primitives. This creates compounding
problems:

1. **ListBox is trapped inside ComboBox and Select.** Consumers who need a
   standalone selection list, settings panel, or sidebar nav have no Nimbus
   component to reach for. The same ListBox code is duplicated across both
   components with slightly different wrappers.

2. **GridList is trapped inside DraggableList.** The only way to get a grid-based
   list is through DraggableList, which hard-wires drag-and-drop into the
   component. Consumers who want a GridList without D&D, or who want D&D on a
   ListBox or Tree, are stuck.

3. **Drag-and-drop is inconsistent.** DataTable and Tree accept an opt-in
   `dragAndDropHooks` prop (React Aria's standard pattern). DraggableList bakes
   D&D into the component itself. Consumers learn two D&D models.

4. **ComboBox is a monolith.** The Root component is ~1590 lines, hard-coupled
   to ListBox-specific state hooks and contexts. It cannot render a Tree or
   GridList in its popover. It reimplements filtering, virtual focus, and
   keyboard navigation that React Aria's `Autocomplete` primitive now provides
   out of the box.

5. **No virtualization.** None of Nimbus's collection components support
   virtualized rendering. Consumers with large datasets (1000+ items) hit
   performance walls.

6. **No filtering primitive.** ComboBox owns all filtering logic internally.
   Consumers who want a searchable Menu, filterable ListBox, or command palette
   have to build it from scratch.

React Aria Components now ships `Autocomplete` (compositional
filtering/virtual-focus for any collection) and `Virtualizer` (layout-based
virtualization for any collection). These are the missing primitives Nimbus needs
to solve all six problems at once.

## Design

### Compositional Architecture

The core idea: instead of monolithic components that embed their own collection
rendering, Nimbus provides standalone primitives that compose freely.

```
┌─────────────────────────────────────────────────────────┐
│                    Composition Layer                      │
│  ComboBox = Trigger + Popover + Autocomplete + Collection│
│  Select   = Trigger + Popover + [Autocomplete] + ListBox │
│  CommandPalette = Dialog + Autocomplete + Menu            │
└────────────────────────┬────────────────────────────────┘
                         │ composes
┌────────────────────────┴────────────────────────────────┐
│                   Behavior Primitives                    │
│  Autocomplete — filtering + virtual focus for any input  │
│                 + any collection                         │
│  Virtualizer  — layout-based virtualization for any      │
│                 collection (List, Grid, Waterfall, Table) │
└────────────────────────┬────────────────────────────────┘
                         │ wraps
┌────────────────────────┴────────────────────────────────┐
│                 Collection Primitives                    │
│  ListBox  — flat/sectioned list, selection, D&D          │
│  GridList — grid list, selection, D&D                    │
│  Tree     — hierarchical, expand/collapse, D&D (exists)  │
│  DataTable — tabular data, sorting, D&D (exists)         │
└─────────────────────────────────────────────────────────┘
```

Every collection primitive accepts `dragAndDropHooks` as an opt-in prop. Every
collection primitive can be wrapped in `<Virtualizer>`. Every collection
primitive can be wrapped in `<Autocomplete>` for filtering. These compose
orthogonally — a consumer can use any combination:

```tsx
<Autocomplete filter={contains}>
  <SearchField />
  <Virtualizer layout={ListLayout}>
    <ListBox dragAndDropHooks={hooks} items={items}>
      {item => <ListBox.Item>{item.name}</ListBox.Item>}
    </ListBox>
  </Virtualizer>
</Autocomplete>
```

### New Components

#### ListBox

Standalone selection list extracted from ComboBox/Select internals. Tier 3
compound component.

```tsx
// Standalone usage
<ListBox.Root selectionMode="multiple" items={items}>
  <ListBox.Section title="Fruits">
    <ListBox.Item>Apple</ListBox.Item>
    <ListBox.Item>Banana</ListBox.Item>
  </ListBox.Section>
</ListBox.Root>

// With drag-and-drop
<ListBox.Root dragAndDropHooks={hooks} items={items}>
  {item => <ListBox.Item>{item.name}</ListBox.Item>}
</ListBox.Root>

// Virtualized
<Virtualizer layout={ListLayout} layoutOptions={{ rowSize: 40 }}>
  <ListBox.Root items={thousandsOfItems}>
    {item => <ListBox.Item>{item.name}</ListBox.Item>}
  </ListBox.Root>
</Virtualizer>
```

Sub-components: `ListBox.Root`, `ListBox.Item`, `ListBox.Section`.

#### GridList

Standalone grid-based list. Tier 3 compound component.

```tsx
// Standalone usage
<GridList.Root selectionMode="multiple" items={items}>
  {item => (
    <GridList.Item>
      <img src={item.image} />
      <Text>{item.title}</Text>
    </GridList.Item>
  )}
</GridList.Root>

// With drag-and-drop (replaces DraggableList)
<GridList.Root dragAndDropHooks={hooks} items={items}>
  {item => <GridList.Item>{item.name}</GridList.Item>}
</GridList.Root>

// Virtualized grid layout
<Virtualizer layout={GridLayout} layoutOptions={{ minItemSize: { width: 200, height: 200 } }}>
  <GridList.Root layout="grid" items={thousandsOfItems}>
    {item => <GridList.Item>{item.title}</GridList.Item>}
  </GridList.Root>
</Virtualizer>

// Virtualized waterfall layout
<Virtualizer layout={WaterfallLayout}>
  <GridList.Root layout="grid" items={images}>
    {item => <GridList.Item>{item.title}</GridList.Item>}
  </GridList.Root>
</Virtualizer>
```

Sub-components: `GridList.Root`, `GridList.Item`.

Layouts: `GridLayout` (equal-size grid), `WaterfallLayout` (variable-height
masonry). Both re-exported from React Aria.

#### Autocomplete

Compositional filtering primitive. Wraps any text input + any collection
component. Handles filtering and virtual focus (arrow key navigation in the
collection while the input retains DOM focus).

```tsx
// Filterable ListBox
<Autocomplete filter={contains}>
  <SearchField placeholder="Filter..." />
  <ListBox.Root selectionMode="multiple">
    <ListBox.Item>Apple</ListBox.Item>
    <ListBox.Item>Banana</ListBox.Item>
  </ListBox.Root>
</Autocomplete>

// Searchable Menu (command palette)
<Autocomplete filter={contains}>
  <SearchField placeholder="Search commands..." />
  <Menu.Content>
    <Menu.Item>Create file</Menu.Item>
    <Menu.Item>Open folder</Menu.Item>
  </Menu.Content>
</Autocomplete>

// Async loading (no filter prop — items are server-controlled)
<Autocomplete inputValue={list.filterText} onInputChange={list.setFilterText}>
  <SearchField placeholder="Search..." />
  <ListBox.Root items={list.items}>
    {item => <ListBox.Item>{item.name}</ListBox.Item>}
  </ListBox.Root>
</Autocomplete>
```

Autocomplete is not a visual component — it provides no DOM of its own. It
connects an input to a collection via React Aria context, regardless of
intervening DOM boundaries (e.g. a Popover between input and list).

#### Virtualizer

Layout-based virtualization wrapper. Only renders visible items to the DOM.

```tsx
// List virtualization
<Virtualizer layout={ListLayout} layoutOptions={{ rowSize: 48 }}>
  <ListBox.Root items={items}>{...}</ListBox.Root>
</Virtualizer>

// Grid virtualization
<Virtualizer layout={GridLayout} layoutOptions={{ minItemSize: { width: 200, height: 200 } }}>
  <GridList.Root layout="grid" items={items}>{...}</GridList.Root>
</Virtualizer>

// Table virtualization
<Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 48 }}>
  <DataTable items={rows}>{...}</DataTable>
</Virtualizer>

// Tree virtualization
<Virtualizer layout={ListLayout} layoutOptions={{ estimatedRowSize: 36 }}>
  <Tree.Root items={treeData}>{...}</Tree.Root>
</Virtualizer>
```

Layout options and layout classes are re-exported from React Aria:
`ListLayout`, `GridLayout`, `WaterfallLayout`, `TableLayout`.

### Rewritten Components

#### ComboBox

Rewritten as a thin composition of Autocomplete + Popover + any collection.
The current ~1590-line monolith is replaced by a component that owns only:

- Trigger display (selected value text, multi-select tags, clear button)
- Popover management (open/close, positioning)
- Selection state forwarding

Filtering, virtual focus, and keyboard navigation are delegated to Autocomplete.
The collection renderer is the consumer's choice.

```tsx
// Default (ListBox) — backwards compatible
<ComboBox.Root items={items} onSelectionChange={handleSelect}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <ComboBox.ListBox>
      {item => <ComboBox.Option>{item.name}</ComboBox.Option>}
    </ComboBox.ListBox>
  </ComboBox.Popover>
</ComboBox.Root>

// Tree collection
<ComboBox.Root items={treeData} onSelectionChange={handleSelect}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <Tree.Root>{renderTreeNode}</Tree.Root>
  </ComboBox.Popover>
</ComboBox.Root>

// GridList collection
<ComboBox.Root items={gridItems} onSelectionChange={handleSelect}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <GridList.Root>{item => <GridList.Item>{item.name}</GridList.Item>}</GridList.Root>
  </ComboBox.Popover>
</ComboBox.Root>

// Virtualized ComboBox
<ComboBox.Root items={thousandsOfItems} onSelectionChange={handleSelect}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <Virtualizer layout={ListLayout}>
      <ComboBox.ListBox>
        {item => <ComboBox.Option>{item.name}</ComboBox.Option>}
      </ComboBox.ListBox>
    </Virtualizer>
  </ComboBox.Popover>
</ComboBox.Root>
```

Internally, ComboBox.Root wraps its children in `<Autocomplete>`, connecting the
trigger's input to whatever collection is inside the popover.

All existing ComboBox features are preserved: single/multi-select, async
loading, custom options, sections, TagGroup for multi-select tags, clear button,
controlled/uncontrolled modes, validation, form integration.

#### Select

Rewritten to compose the standalone ListBox internally. Optionally wraps in
Autocomplete for searchable select (matching RAC's pattern).

```tsx
// Standard Select (unchanged API)
<Select.Root onSelectionChange={handleSelect}>
  <Select.Trigger />
  <Select.Popover>
    <Select.Options items={items}>
      {item => <Select.Option>{item.name}</Select.Option>}
    </Select.Options>
  </Select.Popover>
</Select.Root>

// Searchable Select (new capability)
<Select.Root onSelectionChange={handleSelect}>
  <Select.Trigger />
  <Select.Popover>
    <Autocomplete filter={contains}>
      <SearchField placeholder="Search..." />
      <Select.Options items={items}>
        {item => <Select.Option>{item.name}</Select.Option>}
      </Select.Options>
    </Autocomplete>
  </Select.Popover>
</Select.Root>
```

### Enhanced Components

#### DataTable

Add Virtualizer support for large datasets:

```tsx
<Virtualizer layout={TableLayout} layoutOptions={{ rowHeight: 48 }}>
  <DataTable items={thousandsOfRows} columns={columns}>
    {row => <DataTable.Row>{...}</DataTable.Row>}
  </DataTable>
</Virtualizer>
```

DataTable already accepts `dragAndDropHooks` — no change needed there.

#### Tree

Already standalone with `dragAndDropHooks` (branch `FEC-985-create-tree-component`).
Add Virtualizer support:

```tsx
<Virtualizer layout={ListLayout} layoutOptions={{ estimatedRowSize: 36 }}>
  <Tree.Root items={largeTree}>
    {renderTreeNode}
  </Tree.Root>
</Virtualizer>
```

### Deprecated Components

#### DraggableList

**BREAKING.** Deprecated in favor of GridList + `dragAndDropHooks`.

```tsx
// Before (DraggableList)
<DraggableList.Root items={items} onReorder={handleReorder}>
  <DraggableList.Item>{...}</DraggableList.Item>
</DraggableList.Root>

// After (GridList + dragAndDropHooks)
<GridList.Root dragAndDropHooks={hooks} items={items}>
  {item => <GridList.Item>{item.name}</GridList.Item>}
</GridList.Root>
```

Migration path:
1. Phase 1: Ship GridList, add deprecation warnings to DraggableList
2. Phase 2: Remove DraggableList in a subsequent major release

### Capability Matrix

| Component | Standalone | D&D | Virtualizable | Autocomplete | Layouts |
|-----------|-----------|-----|---------------|--------------|---------|
| **ListBox** | NEW | `dragAndDropHooks` | ListLayout | yes | vertical, horizontal |
| **GridList** | NEW | `dragAndDropHooks` | GridLayout, WaterfallLayout | yes | grid, waterfall |
| **Tree** | exists | `dragAndDropHooks` | ListLayout | yes | vertical |
| **DataTable** | exists | `dragAndDropHooks` | TableLayout | yes | tabular |
| **ComboBox** | rewritten | via collection | via Virtualizer child | built-in (Autocomplete) | via collection |
| **Select** | rewritten | n/a | via Virtualizer child | opt-in (Autocomplete) | via collection |
| **DraggableList** | DEPRECATED | baked in | no | no | — |

### Dependency Graph

```
react-aria-components
  ├── Autocomplete
  ├── Virtualizer + Layouts (ListLayout, GridLayout, WaterfallLayout, TableLayout)
  ├── ListBox (RAC)
  ├── GridList (RAC)
  ├── Tree (RAC)
  └── Table (RAC)

nimbus collection primitives (wrap RAC with recipes + slots)
  ├── ListBox      (wraps RAC ListBox)
  ├── GridList     (wraps RAC GridList)
  ├── Autocomplete (wraps RAC Autocomplete)
  └── Virtualizer  (re-exports RAC Virtualizer + Layouts)

nimbus composites (compose primitives)
  ├── ComboBox  = Autocomplete + Popover + any collection
  ├── Select    = Popover + ListBox [+ Autocomplete]
  └── Tree, DataTable (enhanced with Virtualizer support)
```

## New UI Patterns

The compositional architecture unlocks patterns that are impossible or require
building from scratch today. Every pattern below is a composition of the same
primitives — no special-case code needed.

### Search + Collection

**Command Palette** — `Dialog + Autocomplete + Menu`
VS Code / Linear ⌘K pattern. Filter actions by typing, keyboard navigate
results, sections for grouping. ~30 lines of composition.

```tsx
<DialogTrigger>
  <Button>Open Command Palette</Button>
  <Modal>
    <Dialog>
      <Autocomplete filter={contains}>
        <SearchField placeholder="Search commands..." />
        <Menu.Content>
          <Menu.Section title="File">
            <Menu.Item>New File</Menu.Item>
            <Menu.Item>Open Folder</Menu.Item>
          </Menu.Section>
          <Menu.Section title="Edit">
            <Menu.Item>Undo</Menu.Item>
            <Menu.Item>Redo</Menu.Item>
          </Menu.Section>
        </Menu.Content>
      </Autocomplete>
    </Dialog>
  </Modal>
</DialogTrigger>
```

**Searchable Select** — `Select + Autocomplete + ListBox`
Country/state picker with 200+ options. Type to filter inside the dropdown.

```tsx
<Select.Root>
  <Select.Trigger />
  <Select.Popover>
    <Autocomplete filter={contains}>
      <SearchField placeholder="Search countries..." />
      <Select.Options items={countries}>
        {c => <Select.Option>{c.name}</Select.Option>}
      </Select.Options>
    </Autocomplete>
  </Select.Popover>
</Select.Root>
```

**Filterable Sidebar Nav** — `Autocomplete + Tree`
File explorer / docs nav where typing filters the tree, preserving ancestor
chains for context. VS Code explorer filter, Notion page search.

**Searchable Data Table** — `Autocomplete + DataTable`
Type to filter rows instantly. No custom filter logic needed.

**Filterable Tag Cloud** — `Autocomplete + TagGroup`
Filter and select from a large set of tags. RAC Autocomplete supports TagGroup
directly.

### Virtualization

**Virtualized ComboBox** — `ComboBox + Virtualizer + ListBox`
Dropdown with 10,000+ options. Only visible items render. Today ComboBox renders
every item to the DOM.

```tsx
<ComboBox.Root items={tenThousandItems}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <Virtualizer layout={ListLayout} layoutOptions={{ rowSize: 40 }}>
      <ComboBox.ListBox>
        {item => <ComboBox.Option>{item.name}</ComboBox.Option>}
      </ComboBox.ListBox>
    </Virtualizer>
  </ComboBox.Popover>
</ComboBox.Root>
```

**Virtualized Data Table** — `Virtualizer(TableLayout) + DataTable`
Thousands of rows with sorting, selection, column resizing — only visible rows
rendered. The #1 performance request.

**Virtualized Tree** — `Virtualizer(ListLayout) + Tree`
Large file trees, org charts. Expand/collapse preserved, only visible nodes
render.

**Photo Gallery** — `Virtualizer(WaterfallLayout) + GridList`
Pinterest-style masonry. Variable-height images, virtualized scrolling, keyboard
selection. Today this requires a third-party library.

**Album Grid** — `Virtualizer(GridLayout) + GridList`
Equal-size card grid. Responsive columns based on container width. Keyboard nav,
selection, virtualized.

**Horizontal Carousel** — `Virtualizer(ListLayout, horizontal) + ListBox`
Horizontally scrollable virtualized list. Image strip, timeline, media carousel.

### Drag-and-Drop

**Transfer List** — `ListBox + ListBox + dragAndDropHooks`
Two side-by-side lists. Drag items between "available" and "selected". Common in
permission/role UIs. Today only possible with DraggableList (GridList only).

```tsx
<Flex gap="400">
  <ListBox.Root dragAndDropHooks={sourceHooks} items={available}>
    {item => <ListBox.Item>{item.name}</ListBox.Item>}
  </ListBox.Root>
  <ListBox.Root dragAndDropHooks={targetHooks} items={selected}>
    {item => <ListBox.Item>{item.name}</ListBox.Item>}
  </ListBox.Root>
</Flex>
```

**Kanban Board** — `Multiple GridList + dragAndDropHooks`
Cross-list drag between columns. Each column is a GridList with D&D.

**Sortable List with Search** — `Autocomplete + ListBox + dragAndDropHooks`
Filter items by typing, then reorder via drag. Admin panels, priority queues.

**Cross-Collection Transfer** — `ListBox ↔ GridList + dragAndDropHooks`
Drag from a list into a grid. RAC D&D is interoperable across collection types.

### Compound Compositions

**Tree ComboBox** — `ComboBox + Autocomplete + Tree`
The original motivating use case. Hierarchical suggestions in a combobox popover.
Type to filter the tree, expand/collapse branches, select a node.

```tsx
<ComboBox.Root onSelectionChange={handleSelect}>
  <ComboBox.Trigger />
  <ComboBox.Popover>
    <Tree.Root items={categoryTree}>
      {renderTreeNode}
    </Tree.Root>
  </ComboBox.Popover>
</ComboBox.Root>
```

**Grid Picker** — `ComboBox + Autocomplete + GridList`
Emoji picker, icon picker, color swatch picker. Type to search, visual grid in
the popover.

**Virtualized Searchable Tree ComboBox** — all four primitives composed:
`ComboBox + Autocomplete + Virtualizer + Tree`
Large hierarchical dataset, filtered by typing, virtualized rendering, in a
popover.

**D&D Resizable Masonry Grid** — `Virtualizer(WaterfallLayout) + GridList + dragAndDropHooks`
Pinterest board editor, photo album organizer. Variable-height cards in a
masonry layout, drag to reorder, virtualized for thousands of items. Container
resizes responsively and WaterfallLayout recalculates columns automatically.

```tsx
<Virtualizer layout={WaterfallLayout} layoutOptions={{ minItemSize: { width: 200, height: 100 } }}>
  <GridList.Root layout="grid" dragAndDropHooks={hooks} items={cards}>
    {card => (
      <GridList.Item textValue={card.title}>
        <img src={card.image} style={{ aspectRatio: card.aspectRatio }} />
        <Text>{card.title}</Text>
      </GridList.Item>
    )}
  </GridList.Root>
</Virtualizer>
```

**Photo Picker** — `Autocomplete + Virtualizer(WaterfallLayout) + GridList + dragAndDropHooks`
Search images, masonry layout, select multiple, reorder selection via drag.

**Resource Browser Dialog** — `Dialog + Autocomplete + Virtualizer + Tree`
Modal for browsing a large resource hierarchy. "Insert link" / "attach file"
pattern.

### Splitter + Region Compositions

The recently shipped Splitter (resizable two-pane layouts) and Region (named
content projection) compose with the collection primitives to enable rich
workspace layouts.

**Master-Detail with Filterable Tree** — `Splitter + Autocomplete + Tree + Region`
Left pane: filterable tree nav. Right pane: detail view projected via Region.
Select a tree node, detail renders in the main pane. Splitter lets the user
resize the nav.

```tsx
<Splitter.Root>
  <Splitter.Aside>
    <Autocomplete filter={contains}>
      <SearchField placeholder="Filter resources..." />
      <Tree.Root items={resources} onSelectionChange={key => setSelected(key)}>
        {renderNode}
      </Tree.Root>
    </Autocomplete>
  </Splitter.Aside>
  <Splitter.Handle />
  <Splitter.Main>
    <Region name="detail">
      <DetailView resourceId={selected} />
    </Region>
  </Splitter.Main>
</Splitter.Root>
```

**Three-Pane Workspace** — `Nested Splitter + Region + Virtualizer + DataTable`
Outlook/IDE layout. Outer splitter: sidebar nav + main area. Inner splitter:
list + detail. Virtualized data table in the list pane. Region for the detail
pane so different contexts can project content.

**Inline Editing Data Table** — `DataTable + Virtualizer + ComboBox(Tree)`
Spreadsheet-style editing. Click a cell to enter edit mode. Category cells open
a Tree ComboBox with hierarchical autosuggest — the original motivating use case
from this RFC. Session-weighted ordering promotes recently-used categories to
the top. A toggle lets the user hide/show the suggestion popover entirely.
Virtualized for large datasets.

**Resizable Kanban** — `Splitter + Multiple GridList + dragAndDropHooks`
Each Splitter pane is a Kanban column (GridList with D&D). Columns are
resizable. Drag cards between columns.

**Product Catalog Browser** — `Splitter + Autocomplete + Tree + Virtualizer(WaterfallLayout) + GridList`
Left: category tree with search. Right: product grid (waterfall layout,
virtualized) filtered by selected category. Splitter-resizable panes.

**Command Palette with Context** — `Dialog + Autocomplete + Menu + Region`
Global ⌘K command palette. Region lets different views register their own
contextual actions into the palette.

### What's Not Possible Today

| Pattern | Requires | Today |
|---|---|---|
| Command palette | Autocomplete + Menu | Build from scratch |
| Searchable select | Autocomplete + ListBox | Not possible |
| Virtualized anything | Virtualizer | Not possible |
| ListBox D&D | ListBox + dragAndDropHooks | Only GridList via DraggableList |
| Tree in ComboBox | ComboBox + Tree | Not possible |
| Grid in ComboBox | ComboBox + GridList | Not possible |
| Filterable standalone list | Autocomplete + ListBox | Not possible |
| Cross-collection D&D | Any + dragAndDropHooks | Only within DraggableList |
| Masonry grid | Virtualizer(Waterfall) + GridList | Third-party library |
| Horizontal virtualized list | Virtualizer(List, horiz) + ListBox | Not possible |
| D&D masonry grid | Virtualizer(Waterfall) + GridList + D&D | Not possible |
| Transfer list | 2× ListBox + D&D | Not possible |

## Reference Application: MC Categories App Remake

The proof-of-concept is a remake of the Merchant Center categories application
(`apps/categories-app`) built entirely on Nimbus 4.0 primitives with live
commercetools data via the GraphQL API. The categories app is the ideal
showcase because it naturally exercises every new primitive:

| Feature | Primitives Used |
|---|---|
| Category tree navigation | `Tree + Autocomplete + Virtualizer(ListLayout)` |
| Parent category picker | `ComboBox + Tree` (hierarchical autosuggest with session-weighted ordering) |
| Category search | `Autocomplete` (async, hits ct Category query) |
| Category list/table view | `Virtualizer(TableLayout) + DataTable` |
| Category reordering | `Tree + dragAndDropHooks` |
| Master-detail layout | `Splitter + Region` |
| Category detail editing | Inline fields with `ComboBox(Tree)` for parent reassignment |
| Product assignment | `Transfer List (ListBox + ListBox + dragAndDropHooks)` |
| Product preview grid | `Virtualizer(WaterfallLayout) + GridList` |
| Command palette | `Dialog + Autocomplete + Menu` — ⌘K to search/jump/create |

### Layout

```
┌──────────────────────────────────────────────────────────┐
│ Top Bar: Search (Autocomplete) │ ⌘K │ Theme Toggle      │
├──────────┬───────────────────────────────────────────────┤
│ Category │                                               │
│ Tree     │  Detail (Region)                              │
│          │  ┌─────────────────────────────────────────┐  │
│ Filterable│  │ Category Name (inline edit)             │  │
│ via      │  │ Parent: [Tree ComboBox autosuggest]     │  │
│ Autocomplete│ Slug, Description (inline edit)         │  │
│          │  │                                         │  │
│ D&D to   │  │ ── Assigned Products ──────────────── │  │
│ reorder  │  │ Virtualized GridList (waterfall)        │  │
│          │  │ D&D to reorder product display order    │  │
│ Virtualized │                                         │  │
│ for large│  └─────────────────────────────────────────┘  │
│ trees    │                                               │
├──────────┤◄── Splitter.Handle (resizable) ──►            │
└──────────┴───────────────────────────────────────────────┘
```

### SSR + Theming

Integrates the SSR branch (`bw/ssr-goal-experiment`) for server-rendered
initial shell and the theming branch (`bw/themeing-goal-experiment`) for
runtime theme customization. Theme toggle in the top bar switches light/dark
via the nimbus theme generator.

## Migration

### Breaking Changes

1. **DraggableList deprecated.** Consumers migrate to
   `GridList + dragAndDropHooks`. The DraggableList component is retained with
   runtime deprecation warnings during the migration period, then removed.

2. **ComboBox internal restructure.** The public API is preserved, but consumers
   who reach into ComboBox internals (undocumented contexts, internal component
   imports) may break. The official compound component API
   (`ComboBox.Root`, `ComboBox.Trigger`, `ComboBox.Popover`, `ComboBox.ListBox`,
   `ComboBox.Option`, `ComboBox.Section`) is maintained.

3. **Select internal restructure.** Same as ComboBox — public API preserved,
   internals may change.

### Migration Phases

**Phase 1 — Additive (minor release candidate):**
Ship ListBox, GridList, Autocomplete, Virtualizer as standalone components. No
existing APIs change. Consumers can start using them immediately.

**Phase 2 — Rewrite (4.0 release):**
Rewrite ComboBox and Select on top of the new primitives. Mark DraggableList
deprecated. Add Virtualizer support to DataTable and Tree. Existing public APIs
maintained. Internal restructure may break undocumented usage.

**Phase 3 — Cleanup (post-4.0):**
Remove DraggableList. Remove legacy ComboBox/Select internal code if any was
retained for compatibility.

## Risks & Trade-offs

- **ComboBox rewrite scope.** The current 1590-line Root has accumulated many
  edge-case behaviors (async debouncing, custom option creation, controlled
  input/selection sync, collection population detection). These all need to be
  preserved or cleanly delegated to Autocomplete. Risk of regression is real. →
  Mitigation: comprehensive story test coverage before and after rewrite.

- **Autocomplete maturity.** React Aria's Autocomplete was marked RC in v1.12.0
  (mid-2025). It may still have edge cases. → Mitigation: verify against
  Nimbus's ComboBox test suite before committing to the rewrite.

- **Bundle size.** Adding Virtualizer and Autocomplete as dependencies increases
  the package size for consumers who don't use them. → Mitigation: both are
  tree-shakeable. Consumers who don't import them pay nothing.

- **DraggableList migration burden.** Consumers must rewrite DraggableList
  usage. → Mitigation: the migration is mechanical (swap component, pass hooks),
  provide a codemod or migration guide.

- **Virtualization + Autocomplete interaction.** Filtering a virtualized list
  means the Virtualizer must re-layout when items change. React Aria handles
  this, but it's a complex interaction path. → Mitigation: test the combination
  explicitly in stories.

## Open Questions

1. Should ListBox and GridList have independent recipes or share a base recipe
   with variants? (Leaning independent — different layout needs.)

2. Should ComboBox.ListBox / ComboBox.Option remain as convenience aliases for
   ListBox.Root / ListBox.Item, or should consumers use the ListBox namespace
   directly inside ComboBox? (Leaning: keep aliases for backwards compatibility.)

3. What is the minimum React Aria Components version required? Virtualizer and
   Autocomplete need >= 1.12.0. Tree needs >= 1.7.0.

4. Should Nimbus re-export the Layout classes (ListLayout, GridLayout, etc.)
   from its own package, or require consumers to import from
   `react-aria-components/Virtualizer`?

5. How should DataTable's existing column-level virtualization (if any) interact
   with the new Virtualizer wrapper?
