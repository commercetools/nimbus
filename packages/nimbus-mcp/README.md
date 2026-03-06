# @commercetools/nimbus-mcp

MCP (Model Context Protocol) server for the
[Nimbus](https://nimbus-documentation.vercel.app/home) design system. Exposes
Nimbus component documentation, design tokens, and icons as tools that AI
assistants (Claude, etc.) can call.

## Usage

### With Claude Code

Add the server to `~/.claude/mcp.json`:

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

| Tool              | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `list_components` | Returns names and descriptions of all Nimbus components and patterns               |
| `get_component`   | Returns detailed info about a component or pattern (metadata, props, recipe, docs) |

More tools are being added. See `src/tools/` for the full list.

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

Requires a prebuild to copy docs data and generate the icon catalog first:

```bash
pnpm --filter @commercetools/nimbus-mcp prebuild
pnpm --filter @commercetools/nimbus-mcp catalog:icons
pnpm --filter @commercetools/nimbus-mcp dev
```

### Testing

```bash
# Run tests for this package only
pnpm test packages/nimbus-mcp/src/server.spec.ts

# Run all monorepo tests (includes nimbus-mcp)
pnpm test
```

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

That's it — no other files need changing.

## Data & Build Pipeline

The MCP server reads generated docs data (route manifest, search index, types,
and per-component route JSON) from `data/docs/` inside the package directory.

### How data gets into `data/docs/`

The package has a **prebuild** step and an **icon catalog** step that run
automatically before `tsup`:

```
pnpm build  →  pnpm prebuild  →  build-icon-catalog.ts  →  tsup
                    │                       │
                    ▼                       ▼
            scripts/prebuild.mjs    scripts/build-icon-catalog.ts
                    │                       │
                    ▼                       ▼
            scripts/copy-docs-data.mjs   data/icons.json
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
