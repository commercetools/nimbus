/**
 * MCP client factory for eval tests.
 *
 * Creates a local (workspace) client by default. When the `nimbus-mcp-published`
 * alias is installed, also supports creating a client against the published
 * npm version for A/B comparison.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

// Local workspace version — always available
import { createServer } from "@commercetools/nimbus-mcp";

export interface EvalClient {
  label: string;
  client: Client;
  connect: () => Promise<void>;
  close: () => Promise<void>;
}

/** Creates an eval client connected to the local (workspace) MCP server. */
export function createLocalClient(): EvalClient {
  const server = createServer();
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client(
    { name: "eval-local", version: "1.0.0" },
    { capabilities: {} }
  );

  return {
    label: "local",
    client,
    async connect() {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
    },
    async close() {
      await client.close();
    },
  };
}

/**
 * Attempts to create an eval client from the published npm package
 * (installed as `nimbus-mcp-published` alias). Returns null if not installed.
 */
export async function createPublishedClient(): Promise<EvalClient | null> {
  try {
    // Dynamic import — fails gracefully if the alias isn't installed
    const { createServer: createPublishedServer } = await import(
      // @ts-expect-error — alias may not be installed
      "nimbus-mcp-published"
    );

    const server = createPublishedServer();
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    const client = new Client(
      { name: "eval-published", version: "1.0.0" },
      { capabilities: {} }
    );

    return {
      label: "published",
      client,
      async connect() {
        await server.connect(serverTransport);
        await client.connect(clientTransport);
      },
      async close() {
        await client.close();
      },
    };
  } catch {
    return null;
  }
}
