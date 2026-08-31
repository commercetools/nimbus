import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@commercetools/nimbus-mcp";
import { writeFileSync } from "fs";
import { resolve } from "path";

const SCRATCHPAD =
  "/private/tmp/claude-502/-Users-byronwall-workspaces-ct-nimbus/e5afdf5b-b126-4d98-8836-7810a4d3620c/scratchpad";

async function main() {
  const server = createServer();
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const client = new Client(
    { name: "gen", version: "1.0.0" },
    { capabilities: {} }
  );
  await server.connect(st);
  await client.connect(ct);

  for (const [name, file] of [
    ["product-list-view", "src/fixtures/uikit/product-list-view.tsx"],
    ["product-detail-form", "src/fixtures/uikit/product-detail-form.tsx"],
    ["admin-settings-view", "src/fixtures/uikit/admin-settings-view.tsx"],
  ] as const) {
    const result = await client.callTool({
      name: "migrate_from_uikit",
      arguments: { filePath: resolve(file) },
    });
    const text =
      (result.content as Array<{ type: string; text: string }>).find(
        (c) => c.type === "text"
      )?.text ?? "";
    const outPath = `${SCRATCHPAD}/mcp-migration-${name}.json`;
    writeFileSync(outPath, JSON.stringify(JSON.parse(text), null, 2));
    console.log(`Wrote ${outPath} (${text.length} chars)`);
  }

  await client.close();
  process.exit(0);
}

main();
