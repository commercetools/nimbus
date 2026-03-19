# nimbus-mcp Guidelines

## Code Organization

- **All TypeScript types MUST be defined in `src/types.ts`** — do not declare
  types inline in tool files or other modules; import from `src/types.ts`
  instead.

## AI Assistant Response Guidelines

- **Never pretty-print JSON** from MCP tool results. Keep JSON compact/minified
  when displaying or processing it — pretty-printed JSON is verbose and wastes
  context space.

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
