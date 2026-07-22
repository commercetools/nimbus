# nimbus-mcp Guidelines

## Code Organization

- **All TypeScript types MUST be defined in `src/types.ts`** — do not declare
  types inline in tool files or other modules; import from `src/types.ts`
  instead.

## AI Assistant Response Guidelines

- **Never pretty-print JSON** from MCP tool results. Keep JSON compact/minified
  when displaying or processing it — pretty-printed JSON is verbose and wastes
  context space.
- **Never return raw MDX content** from tool responses. Strip extra whitespace
  and unnecessary characters before returning — do not return MDX verbatim, for
  the same reason JSON must not be pretty-printed.

## Performance

- **Cache pre-computed data** — search uses pre-lowercased field maps and route
  view caches to avoid repeated work across queries. When adding new search
  functionality, prefer caching computed data at module level rather than
  recomputing per invocation.

## Migration Data (`propMappings`)

Migration entries in `src/data/uikit-migration.ts` can include a `propMappings`
array with structured prop-level translations (UIKit prop → Nimbus prop, value
mappings). These are validated at build time by
`scripts/validate-migration-data.ts` against both the live Nimbus type data in
`data/docs/types/` and the UIKit type declarations from
`@commercetools-frontend/ui-kit` (devDependency). The build fails if a
`nimbusProp` doesn't exist on the target component, a mapped value is invalid
for the prop's type union, or a `uiKitProp` doesn't exist on the source UIKit
component. UIKit validation covers function and class components; dotted
sub-components (e.g. `Text.Body`) are skipped.

When adding or editing migration entries, add `propMappings` for any prop-level
changes. Use `_component` as the `uiKitProp` for fixed values injected by the
component identity (e.g. `variant="solid"` for PrimaryButton).

## Migration Data (`iconWrapper`)

Icon-related entries can include an `iconWrapper` field (`IconWrapper` type in
`src/types.ts`) that tells the LLM to wrap bare icon imports in the Nimbus
`<Icon>` component. The field specifies the wrapper component name, import path,
default size/color props, and a `sizeMapping` array translating UIKit icon sizes
to Nimbus Icon recipe sizes. `sizeMapping.to` values are validated at build time
against the Nimbus Icon recipe sizes by `scripts/validate-migration-data.ts`.

To avoid duplication, `src/data/uikit-migration.ts` defines a shared
`ICON_WRAPPER_BASE` constant with the common component/importPath/defaultProps.
Each entry spreads this and adds its own `sizeMapping` — `CustomIcon` uses
numeric UIKit sizes (`10`–`40`) while `Icon Library` maps both deprecated
aliases (`small`/`medium`/`big`) and current numeric values.

## Build Scripts

See [`scripts/README.md`](./scripts/README.md) for documentation on the prebuild
scripts (`copy-docs-data`, `build-icon-catalog`, `build-token-data`,
`validate-migration-data`).

### Adding a new build script

1. **`scripts/my-script.ts`** — export a named async `fn(outDir?: string)` that
   writes to `data/` and logs output. Include a CLI guard
   (`process.argv[1].includes("my-script")`) so it can run via
   `tsx scripts/my-script.ts`.
2. **`scripts/prebuild.ts`** — add `{ name, fn }` to the `steps` array.
3. **`src/types.ts`** — define any output data interfaces here, not in the
   script.
4. **`scripts/README.md`** — add a row to the Files table.
