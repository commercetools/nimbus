# @commercetools/nimbus-mcp

MCP (Model Context Protocol) server for the
[Nimbus](https://nimbus-documentation.vercel.app/home) design system. Exposes
Nimbus component documentation, design tokens, and icons as tools that AI
assistants (Claude, etc.) can call.

## Usage

### With Claude Code

The recommended way to add the server is via the CLI:

```bash
claude mcp add -s user nimbus-mcp npx -- -y @commercetools/nimbus-mcp
```

This writes the server config to `~/.claude.json` and makes it available in all
sessions. Alternatively, add a `nimbus` entry to your project's `.mcp.json` so
every team member on the repo gets the server automatically:

```json
{
  "mcpServers": {
    "nimbus": {
      "command": "npx",
      "args": ["-y", "@commercetools/nimbus-mcp"]
    }
  }
}
```

### With Claude Desktop

Add the server to your Claude Desktop config
(`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "nimbus": {
      "command": "npx",
      "args": ["-y", "@commercetools/nimbus-mcp"]
    }
  }
}
```

### Running directly

```bash
npx @commercetools/nimbus-mcp
```

## Available Tools

| Tool                 | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| `list_components`    | Returns names and descriptions of all Nimbus components and patterns                   |
| `get_component`      | Returns detailed info about a component or pattern (metadata, props, recipe, docs)     |
| `search_docs`        | Full-text search across all Nimbus documentation pages                                 |
| `get_docs_page`      | Returns the full content of a documentation page by route path (from `search_docs`)    |
| `search_icons`       | Fuzzy-search Nimbus icons by name or keyword                                           |
| `get_tokens`         | Returns design tokens — list categories, browse by category, or reverse-lookup a value |
| `migrate_from_uikit` | Returns migration mappings from UI Kit components to Nimbus equivalents                |

## Development

### Setup

This package lives in the Nimbus monorepo. From the repo root:

```bash
pnpm install
```

### Building

```bash
pnpm --filter @commercetools/nimbus-mcp build
```

### Running from source

Requires a prebuild to copy docs data, generate the icon catalog, and generate
token data first:

```bash
pnpm --filter @commercetools/nimbus-mcp prebuild
pnpm --filter @commercetools/nimbus-mcp catalog:icons
pnpm --filter @commercetools/nimbus-mcp build:tokens
pnpm --filter @commercetools/nimbus-mcp dev
```

### Testing

```bash
# Unit specs for this package (in-process server, no build needed)
pnpm vitest run --project=nimbus-mcp

# Run all monorepo tests (includes nimbus-mcp)
pnpm test
```

### Tool evals

`evals/cases/<tool>.json` holds deterministic cases for every registered tool.
The runner (`evals/run.eval.spec.ts`) spawns the **built** `dist/index.js` over
stdio, exactly as an editor would, calls each case's input and checks its
expectations. CI runs this as a blocking step after the build
(`Nimbus MCP tool evals` in `build-and-test.yml`).

```bash
pnpm --filter @commercetools/nimbus-mcp build   # evals need dist/
pnpm --filter @commercetools/nimbus-mcp eval

# Re-run one case
pnpm --filter @commercetools/nimbus-mcp eval -t "deep-implementation-term"
```

A run writes `evals/.report/scorecard.json` (gitignored) with pass/fail and
p50/max response chars and ms per tool, and appends the same table to the GitHub
job summary when `GITHUB_STEP_SUMMARY` is set.

#### Adding a case

Append to the tool's file. `id` must be unique within the file, `input` is sent
verbatim as the tool arguments, and `expect` uses only these keys (a typo fails
the run at load time, naming the file, case and key):

| Key           | Checks                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `isError`     | The MCP `isError` flag (`undefined` counts as `false`)                                                                                          |
| `contains`    | String or array; each must appear in the raw response text                                                                                      |
| `notContains` | String or array; none may appear in the raw response text                                                                                       |
| `maxChars`    | Response text length is at most this                                                                                                            |
| `field`       | `{ "<path>": value }`; each JSON path deep-equals the value (`[0].matchedView`, `results[2].name`)                                              |
| `rankWithin`  | `{ path?, field, value, k, also? }`; an element with `field = value` is within the first `k`; `also` adds `field: value` checks on that element |
| `absent`      | `{ path?, field, value }`; no element matches                                                                                                   |
| `length`      | `{ path?, min?, max? }`; array length bounds                                                                                                    |

`path` on the array matchers names the array inside the response; omit it when
the response root is the array. Prefer stable identifiers (routes, export names,
prop names) and bounds over prose, so a docs edit does not break a case.

The coverage check fails if a registered tool has fewer than three cases, if a
case file names a tool the server no longer registers, or if two cases share an
id.

### Manual smoke test

After building, send raw JSON-RPC messages via stdin:

```bash
# initialize handshake
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  | node dist/index.js

# list tools
printf \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' \
  | node dist/index.js
```

## Adding a New Tool

1. Create `src/tools/my-tool.ts` exporting a `registerMyTool(server: McpServer)`
   function:

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerMyTool(server: McpServer): void {
  server.registerTool(
    "my_tool",
    {
      title: "My Tool",
      description: "What this tool does.",
      inputSchema: {
        query: z.string().describe("The query to run"),
      },
    },
    async ({ query }) => {
      return {
        content: [{ type: "text" as const, text: `Result for: ${query}` }],
      };
    }
  );
}
```

2. Import and call `registerMyTool(server)` in `src/server.ts`.
3. Add `evals/cases/my_tool.json` with at least three cases (see
   [Tool evals](#tool-evals)); the eval coverage check fails without it.

## Data & Build Pipeline

The MCP server reads generated docs data (route manifest, search index, types,
and per-component route JSON) from `data/docs/` inside the package directory.

### How data gets into `data/docs/`

The package has a **prebuild** step, an **icon catalog** step, and a **token
flattener** step that run automatically before `tsup`:

```
pnpm build  →  pnpm prebuild  →  build-icon-catalog.ts  →  build-token-data.ts  →  tsup
                    │                       │                        │
                    ▼                       ▼                        ▼
            scripts/prebuild.mjs    scripts/build-icon-catalog.ts   src/processors/build-token-data.ts
                    │                       │                        │
                    ▼                       ▼                        ▼
            scripts/copy-docs-data.mjs   data/icons.json          data/tokens.json
                    │
    copies apps/docs/src/data/ → data/docs/
```

The prebuild orchestrator (`scripts/prebuild.mjs`) runs an array of steps in
order. Currently the only step is `copy-docs-data`, which copies
`route-manifest.json`, `search-index.json`, `routes/`, and `types/` from the
docs app into `data/docs/`. New prebuild steps can be added to the array.

After prebuild, `build-icon-catalog.ts` scans `packages/nimbus-icons/src/` and
generates `data/icons.json` — a searchable catalog of all icon names,
categories, import paths, and normalized keywords. This can also be run
standalone via `pnpm --filter @commercetools/nimbus-mcp catalog:icons`.

Then, `build-token-data.ts` reads the raw tokens and writes a flattened
`data/tokens.json` with all tokens, a by-category index, and a reverse-lookup
map. This can also be run standalone via
`pnpm --filter @commercetools/nimbus-mcp build:tokens`.

The `data/` directory is gitignored — it is always regenerated at build time.

### Build order (CI and local)

```
tokens → packages (excl. mcp) → docs-data → mcp (prebuild + tsup)
```

The root `build:docs-data` script runs only the docs data generation (not the
full Vite app build), keeping CI fast. The full `pnpm build` runs the complete
docs build which also produces the data files.

Tools that depend on docs data return a graceful error message if data files are
not present.
