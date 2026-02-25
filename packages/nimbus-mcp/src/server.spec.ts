import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "./server.js";

/**
 * Integration tests for the Nimbus MCP server.
 *
 * These tests run the server in-process using InMemoryTransport so no
 * child-process spawning or stdio wiring is needed. Add new tools freely —
 * the tool-list tests only assert structure and cardinality, never specific
 * tool names, so they won't break when new tools are registered.
 */

function createTestClient() {
  const server = createServer();
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  return {
    server,
    client,
    clientTransport,
    serverTransport,
    async connect() {
      await server.connect(serverTransport);
      await client.connect(clientTransport);
    },
    async close() {
      await client.close();
    },
  };
}

describe("MCP server — initialize handshake", () => {
  it("responds to initialize with server info and capabilities", async () => {
    // client.connect() performs the initialize handshake automatically
    const ctx = createTestClient();
    await ctx.connect();

    const serverVersion = ctx.client.getServerVersion();
    expect(serverVersion).toBeDefined();
    expect(serverVersion?.name).toBe("nimbus-mcp");
    expect(serverVersion?.version).toMatch(/^\d+\.\d+\.\d+$/);

    const capabilities = ctx.client.getServerCapabilities();
    expect(capabilities).toBeDefined();
    expect(capabilities?.tools).toBeDefined();

    await ctx.close();
  });
});

describe("MCP server — tools/list", () => {
  it("returns a non-empty array of tools", async () => {
    const ctx = createTestClient();
    await ctx.connect();

    const { tools } = await ctx.client.listTools();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeGreaterThan(0);

    await ctx.close();
  });

  it("every tool has a name, description, and inputSchema", async () => {
    const ctx = createTestClient();
    await ctx.connect();

    const { tools } = await ctx.client.listTools();
    for (const tool of tools) {
      expect(typeof tool.name).toBe("string");
      expect(tool.name.length).toBeGreaterThan(0);
      expect(tool.description).toBeDefined();
      expect(tool.description!.length).toBeGreaterThan(0);
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
    }

    await ctx.close();
  });
});
