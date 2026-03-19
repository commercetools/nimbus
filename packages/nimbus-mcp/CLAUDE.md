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

- **Cache Fuse instances** — any method that uses Fuse.js for fuzzy search MUST
  cache the `Fuse` instance (e.g., as a module-level variable or class field)
  rather than constructing a new one on every call. Rebuilding the index on each
  invocation is expensive and adds measurable latency to search tools.

## Build Scripts

See [`scripts/README.md`](./scripts/README.md) for documentation on the prebuild
scripts (`copy-docs-data`, `build-icon-catalog`, `build-token-data`).

### Adding a new build script

1. **`scripts/my-script.ts`** — export a named async `fn(outDir?: string)` that
   writes to `data/` and logs output. Include a CLI guard
   (`process.argv[1].includes("my-script")`) so it can run via
   `tsx scripts/my-script.ts`.
2. **`scripts/prebuild.ts`** — add `{ name, fn }` to the `steps` array.
3. **`src/types.ts`** — define any output data interfaces here, not in the
   script.
4. **`scripts/README.md`** — add a row to the Files table.
