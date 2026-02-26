import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "./server.js";

/**
 * Creates a connected MCP client/server pair for in-process testing.
 * Uses InMemoryTransport so no child-process spawning or stdio is needed.
 *
 * Call `connect()` before making requests and `close()` when done.
 */
export function createTestClient() {
  const server = createServer();
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  return {
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
