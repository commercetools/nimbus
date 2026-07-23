# @commercetools/nimbus-mcp

## 3.3.0

### Minor Changes

- [#1755](https://github.com/commercetools/nimbus/pull/1755)
  [`b2eec53`](https://github.com/commercetools/nimbus/commit/b2eec53145f163a535cfe616b2896ebca5146f3e)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - **get_docs_page**: new
  MCP tool that returns the full content of a Nimbus documentation page by its
  route path. Accepts an optional `section` parameter to retrieve a single tab
  view (e.g. "dev", "guidelines", "a11y") from tabbed pages. Use `search_docs`
  first to discover page paths, then `get_docs_page` to read the full content.

- [#1802](https://github.com/commercetools/nimbus/pull/1802)
  [`afbde43`](https://github.com/commercetools/nimbus/commit/afbde4350abff92a3d65c64048df2311f66dbdd6)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - `migrate_from_uikit`:
  Icon migration responses now include an `iconWrapper` field with the `Icon`
  wrapper component, its import path, default size/color props, and a
  UIKit-to-Nimbus size mapping (deprecated aliases `small`→`2xs`, `medium`→`xs`,
  `big`→`md` and numeric sizes `10`→`2xs`, `20`→`xs`, `30`→`sm`, `40`→`md`).
  This ensures migrated icons use `<Icon as={SvgName} />` with proper
  design-system sizing and color tokens instead of bare icon components.

- [#1748](https://github.com/commercetools/nimbus/pull/1748)
  [`88884fc`](https://github.com/commercetools/nimbus/commit/88884fc5d869b984a3b4f96e65b1882605c4f717)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - **migrate_from_uikit**:
  unmapped components now include catalog suggestions.

  When a UI Kit component has no explicit migration rule, the tool searches the
  Nimbus component catalog and returns a `suggestion` with the likely Nimbus
  equivalent and a confidence level (`high` or `medium`). The `unmapped` array
  in file-mode responses changes from `string[]` to `UnmappedComponent[]`
  objects. In component-name mode, unrecognized names now return a suggestion
  result instead of an error when a catalog match is found.

- [#1747](https://github.com/commercetools/nimbus/pull/1747)
  [`a5d1865`](https://github.com/commercetools/nimbus/commit/a5d18650e7b42e197284722f673f42bfdb99ab9b)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - **migrate_from_uikit**:
  structured `propMappings` with build-time type validation.

  Migration entries now include an optional `propMappings` array with explicit
  prop-level translations — prop renames, value mappings, structural changes,
  and removals — validated at build time against the live Nimbus and UIKit type
  data. The tool result includes `propMappings` when available, giving consumers
  structured data alongside the existing `notes` and `breakingChanges` prose.

  - 59 of 80 entries populated (remaining 21 have no prop-level changes).
  - Fixes incorrect data: Badge now uses `colorPalette` (not `tone`),
    `Card.Body` (not `Card.Content`), and several other UIKit prop name
    corrections caught by the new validation.

- [#1803](https://github.com/commercetools/nimbus/pull/1803)
  [`4c6f241`](https://github.com/commercetools/nimbus/commit/4c6f2416f7e13b340099924e309c2e99b058c341)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - `migrate_from_uikit`:
  responses now include two new optional fields when applicable:

  - `propMigrations`: flags slot-prop-to-children collapse patterns (e.g., Stamp
    `label`/`icon` props become Badge `children`).
  - `codeReduction`: flags patterns where migration deletes significant code
    (e.g., DataTable's built-in selection replaces custom selection column
    files).

### Patch Changes

- [#1806](https://github.com/commercetools/nimbus/pull/1806)
  [`2d35deb`](https://github.com/commercetools/nimbus/commit/2d35deb58e04607996852af9139e523049d70bcb)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Add structured
  migration guidance fields (`propShapeTransforms`, `callbackAdapters`,
  `typeNotes`) to `migrate_from_uikit`. Populated for DataTable (column generic
  typing, sort callback, Selection type) and backfilled across SelectInput,
  NumberInput, MoneyInput, DateInput, DateTimeInput, DateRangeInput, TimeInput,
  CheckboxInput, ToggleInput, LocalizedTextInput, LocalizedMultilineTextInput,
  LocalizedMoneyInput, LocalizedRichTextInput, Tag, CollapsiblePanel, and
  DropdownMenu — documenting callback signature changes and type-level migration
  requirements for each.

## 3.2.0

## 3.1.0

## 3.0.0

## 2.10.0

### Minor Changes

- [#1268](https://github.com/commercetools/nimbus/pull/1268)
  [`2d65817`](https://github.com/commercetools/nimbus/commit/2d65817215467512bda78d4c0c032f88ee8b4bbf)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Prepare
  Nimbus MCP for publishing on NPM

### Patch Changes

- [#1379](https://github.com/commercetools/nimbus/pull/1379)
  [`5327b74`](https://github.com/commercetools/nimbus/commit/5327b74734dd65616cc75ebef006cc3c8ddf3c24)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Pin nimbus-mcp package
  version to be fixed at package version of other repo packages (matching main
  nimbus package version)

## 2.10.0

### Minor Changes

- [#1268](https://github.com/commercetools/nimbus/pull/1268)
  [`2d65817`](https://github.com/commercetools/nimbus/commit/2d65817215467512bda78d4c0c032f88ee8b4bbf)
  Thanks [@tylermorrisford](https://github.com/tylermorrisford)! - Prepare
  Nimbus MCP for publishing on NPM

### Patch Changes

- [#1379](https://github.com/commercetools/nimbus/pull/1379)
  [`5327b74`](https://github.com/commercetools/nimbus/commit/5327b74734dd65616cc75ebef006cc3c8ddf3c24)
  Thanks [@ByronDWall](https://github.com/ByronDWall)! - Pin nimbus-mcp package
  version to be fixed at package version of other repo packages (matching main
  nimbus package version)
