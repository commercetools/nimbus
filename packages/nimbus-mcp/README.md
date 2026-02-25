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

| Tool              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `list_components` | Returns names and descriptions of all Nimbus components |

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

### Running from source (no build needed)

```bash
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

## Data Availability

The server has two runtime modes:

- **Monorepo mode** (detected automatically): reads live data from
  `apps/docs/src/data/`. Run `pnpm build:docs` first to generate these files.
- **Standalone mode** (npm package): reads from a bundled `data/` directory
  shipped with the package.

Tools that depend on docs data will return a graceful error message if data
files are not present.
