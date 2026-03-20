/**
 * Compare search_docs output between main and experiment branches.
 *
 * Usage:
 *   cd <worktree> && npx tsx packages/nimbus-mcp/compare-search.ts > results.json
 *
 * Run this in both the main worktree and the experiment worktree,
 * then diff the two JSON files.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const QUERIES = [
  // Exact component names
  "Button",
  "Select",
  "Menu",
  "DatePicker",
  "DataTable",
  "Pagination",
  "Toast",
  "Dialog",
  "Tooltip",
  // Multi-word
  "form validation",
  "color tokens",
  "spacing tokens",
  "dark mode",
  "keyboard navigation",
  // Props/API
  "ButtonProps",
  "onPress",
  "isDisabled",
  "onChange",
  // Content deep search
  "import Button from",
  "WCAG 2.1",
  "aria-label",
  "React Aria",
  // Edge cases
  "btn",
  "colours",
  "datepicker",
  "a]ccessibility",
  // Broad
  "component",
  "hook",
  "layout",
  "icon",
];

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "packages/nimbus-mcp/src/index.ts"],
  });

  const client = new Client({ name: "compare", version: "1.0.0" });
  await client.connect(transport);

  const results: Record<
    string,
    Array<{ title: string; path: string; matchedView?: string; snippet: string }>
  > = {};

  for (const query of QUERIES) {
    const result = await client.callTool({
      name: "search_docs",
      arguments: { query },
    });
    const text = (
      result.content as Array<{ type: string; text: string }>
    ).find((c) => c.type === "text")?.text;

    if (!text || text === "No matching documentation found.") {
      results[query] = [];
    } else {
      const parsed = JSON.parse(text);
      results[query] = parsed.map(
        (r: { title: string; path: string; matchedView?: string; snippet: string }) => ({
          title: r.title,
          path: r.path,
          matchedView: r.matchedView,
          snippet: r.snippet.slice(0, 100),
        })
      );
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await client.close();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
