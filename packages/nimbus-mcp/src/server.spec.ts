import { describe, it, expect } from "vitest";
import { createTestClient } from "./test-utils.js";

/**
 * Integration tests for the Nimbus MCP server infrastructure.
 *
 * Tests initialize handshake and tool-list structure. Assertions intentionally
 * avoid specific tool names so adding new tools never breaks these tests.
 * For individual tool behavior, see src/tools/*.spec.ts.
 */

describe("MCP server — initialize handshake", () => {
  it("responds to initialize with server info and capabilities", async () => {
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
