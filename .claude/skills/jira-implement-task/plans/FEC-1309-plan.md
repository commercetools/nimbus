# FEC-1309: Surface @supportsStyleProps in nimbus-mcp responses

## Summary

Add a `styleProps` hint string to MCP tool responses when a component supports
Chakra style props, directing consuming LLMs to
`get_docs_page(path: "home/style-props")` for the full reference.

## Branch

`FEC-1309-style-props-mcp` (from `main`)

## Tasks

### Task 1: Type updates + data loader

**Files:**

- `packages/nimbus-mcp/src/types.ts`
- `packages/nimbus-mcp/src/data-loader.ts`

**Changes:**

- Add `supportsStyleProps?: boolean` to `TypeData`
- Add `styleProps?: string` to `ComponentMetadata`, `DocsPageResult`,
  `MigrateComponentResult`
- Add `StylePropsCategorySummary` and `StylePropsSummary` types
- Add `getStylePropsSummary` lazy loader to data-loader.ts

### Task 2: Prebuild script `build-style-props-summary.ts`

**Files:**

- `packages/nimbus-mcp/scripts/build-style-props-summary.ts` (new)
- `packages/nimbus-mcp/scripts/prebuild.ts` (add step)
- `packages/nimbus-mcp/scripts/README.md` (add row)

**Changes:**

- Reads `data/docs/routes/home-style-props-*.json` sub-page files
- Parses MDX table rows to extract prop names (backtick-quoted in first column)
- Writes `data/style-props-summary.json` with categories, paths, prop names
- Add to prebuild steps after copy-docs-data

### Task 3: Surface `styleProps` in `get_component`

**Files:**

- `packages/nimbus-mcp/src/tools/get-component.ts`
- `packages/nimbus-mcp/src/tools/get-component.spec.ts`

**Changes:**

- Define `STYLE_PROPS_HINT` constant
- Metadata response: load type data, add `styleProps` if `supportsStyleProps`
- Props response (single): add `styleProps` if `supportsStyleProps`
- Props response (compound): extend `aggregateSubComponentProps` to collect
  sub-component names that support style props, add richer hint

### Task 4: Surface `styleProps` in `get_docs_page`

**Files:**

- `packages/nimbus-mcp/src/tools/get-docs-page.ts`
- `packages/nimbus-mcp/src/tools/get-docs-page.spec.ts`

**Changes:**

- Style-props landing page: enrich with compact prop index from summary
- Component pages: add `styleProps` hint when type data has `supportsStyleProps`

### Task 5: Surface `styleProps` in `migrate_from_uikit`

**Files:**

- `packages/nimbus-mcp/src/tools/migrate-from-uikit.ts`
- `packages/nimbus-mcp/src/tools/migrate-from-uikit.spec.ts`

**Changes:**

- In `buildComponentResult`, load type data for Nimbus target when
  `importPath === "@commercetools/nimbus"` and `nimbusEquivalent` exists
- If `supportsStyleProps` is true, add `styleProps` hint
- Make `buildComponentResult` async

### Task 6: Full build verification

- Run `pnpm --filter @commercetools/nimbus-mcp build`
- Verify `data/style-props-summary.json` generated
- Run full test suite
