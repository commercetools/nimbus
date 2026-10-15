import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { EvalToolResponse } from "../src/types.js";

export const PACKAGE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  ".."
);
const DIST_ENTRY = resolve(PACKAGE_ROOT, "dist/index.js");

export const BUILD_HINT =
  "Build @commercetools/nimbus-mcp first (pnpm --filter @commercetools/nimbus-mcp build)";

/**
 * Spawns the built server over stdio, the same way an editor would, so the
 * evals exercise the shipped bundle and its copied data rather than src/.
 */
export async function connectEvalClient(): Promise<{
  client: Client;
  close: () => Promise<void>;
}> {
  if (!existsSync(DIST_ENTRY)) {
    throw new Error(`${DIST_ENTRY} not found. ${BUILD_HINT}`);
  }
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [DIST_ENTRY],
    cwd: PACKAGE_ROOT,
    // Let a server crash print its stack into the (CI) log instead of a bare "connection closed".
    stderr: "inherit",
  });
  const client = new Client(
    { name: "nimbus-mcp-evals", version: "1.0.0" },
    { capabilities: {} }
  );
  await client.connect(transport);
  return { client, close: () => client.close() };
}

/** Calls a tool and flattens the MCP envelope to the text matchers consume. */
export async function callTool(
  client: Client,
  name: string,
  args: Record<string, unknown>
): Promise<EvalToolResponse> {
  const result = await client.callTool({ name, arguments: args });
  const content = result.content as Array<{ type: string; text?: string }>;
  const text = content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
  return { text, isError: result.isError === true ? true : undefined };
}
