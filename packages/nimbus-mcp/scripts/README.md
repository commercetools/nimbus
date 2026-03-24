# nimbus-mcp build scripts

All scripts are TypeScript and run via `tsx`.

## Files

| File                    | Description                                                                 |
| ----------------------- | --------------------------------------------------------------------------- |
| `prebuild.ts`           | Orchestrator that runs all prebuild steps in sequence before `tsup` bundles |
| `copy-docs-data.ts`     | Copies generated docs data from `apps/docs/src/data` into `data/docs`       |
| `build-icon-catalog.ts` | Scans nimbus-icons and builds a searchable catalog at `data/icons.json`     |
| `build-token-data.ts`   | Flattens design tokens into `data/tokens.json` for runtime lookup           |
| `build-search-index.ts` | Augments search index with pre-lowered fields for faster runtime matching   |

## Running

```bash
# Run all prebuild steps (called automatically by `pnpm build`)
pnpm prebuild

# Run a single script directly
tsx scripts/build-icon-catalog.ts
tsx scripts/build-token-data.ts [--out <dir>]
```
