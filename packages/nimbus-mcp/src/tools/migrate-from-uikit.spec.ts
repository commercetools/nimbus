import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFile, unlink, mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";

/**
 * Behavioral tests for the migrate_from_uikit tool.
 *
 * Tests cover:
 * - componentName mode: single component lookup
 * - filePath mode: extract imports from a file and batch-lookup
 * - Error cases: missing params, unknown components
 */

let client: Client;
let close: () => Promise<void>;

beforeAll(async () => {
  const ctx = createTestClient();
  await ctx.connect();
  client = ctx.client;
  close = ctx.close;
});

afterAll(() => close());

async function callMigrate(args: Record<string, unknown>): Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}> {
  return client.callTool({
    name: "migrate_from_uikit",
    arguments: args,
  }) as Promise<{
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  }>;
}

function getText(result: {
  content: Array<{ type: string; text: string }>;
}): string {
  return result.content.find((c) => c.type === "text")?.text ?? "";
}

describe("migrate_from_uikit — componentName mode", () => {
  it("returns migration data for PrimaryButton", async () => {
    const result = await callMigrate({ componentName: "PrimaryButton" });
    const data = JSON.parse(getText(result));

    expect(data.uiKitName).toBe("PrimaryButton");
    expect(data.nimbusEquivalent).toBe("Button");
    expect(data.importPath).toBe("@commercetools/nimbus");
    expect(data.mappingType).toBe("variant");
    expect(data.notes).toBeTruthy();
    expect(data.breakingChanges).toBeInstanceOf(Array);
    expect(data.breakingChanges.length).toBeGreaterThan(0);
  });

  it("returns migration data for FlatButton", async () => {
    const result = await callMigrate({ componentName: "FlatButton" });
    const data = JSON.parse(getText(result));

    expect(data.uiKitName).toBe("FlatButton");
    expect(data.nimbusEquivalent).toBe("Button");
    expect(data.mappingType).toBe("variant");
  });

  it("returns all sub-component mappings for a compound root like Spacings", async () => {
    const result = await callMigrate({ componentName: "Spacings" });
    const data = JSON.parse(getText(result));

    expect(data.compoundRoot).toBe("Spacings");
    expect(data.mappings).toBeInstanceOf(Array);
    expect(data.mappings.length).toBeGreaterThanOrEqual(4);

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("Spacings.Stack");
    expect(names).toContain("Spacings.Inline");
    expect(names).toContain("Spacings.Inset");
  });

  it("returns all sub-component mappings for a compound root like Text", async () => {
    const result = await callMigrate({ componentName: "Text" });
    const data = JSON.parse(getText(result));

    expect(data.compoundRoot).toBe("Text");
    expect(data.mappings.length).toBeGreaterThanOrEqual(5);

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("Text.Body");
    expect(names).toContain("Text.Headline");
  });

  it("includes a search_icons hint for icon-related components", async () => {
    const result = await callMigrate({ componentName: "CustomIcon" });
    const data = JSON.parse(getText(result));

    expect(data.hint).toContain("search_icons");
  });

  it("includes a search_icons hint for Icon Library", async () => {
    const result = await callMigrate({ componentName: "Icon Library" });
    const data = JSON.parse(getText(result));

    expect(data.hint).toContain("search_icons");
  });

  it("includes a get_tokens hint for token-related components", async () => {
    const result = await callMigrate({
      componentName: "Constraints.Horizontal",
    });
    const data = JSON.parse(getText(result));

    expect(data.hint).toContain("get_tokens");
  });

  it("includes a get_component hint for standard component mappings", async () => {
    const result = await callMigrate({ componentName: "PrimaryButton" });
    const data = JSON.parse(getText(result));

    expect(data.hint).toContain("get_component");
  });

  it("returns error for unknown component", async () => {
    const result = await callMigrate({
      componentName: "NonExistentComponent",
    });
    expect(result.isError).toBe(true);
    expect(getText(result)).toContain("NonExistentComponent");
  });
});

describe("migrate_from_uikit — filePath mode", () => {
  let tmpDir: string;
  let tmpFile: string;

  beforeAll(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), "nimbus-mcp-test-"));
    tmpFile = join(tmpDir, "test-component.tsx");
    await writeFile(
      tmpFile,
      `
import { PrimaryButton } from '@commercetools-uikit/buttons';
import TextInput from '@commercetools-uikit/text-input';
import { LoadingSpinner } from '@commercetools-uikit/loading-spinner';
import React from 'react';

export const MyComponent = () => <div />;
`
    );
  });

  afterAll(async () => {
    try {
      await unlink(tmpFile);
    } catch {
      // ignore cleanup errors
    }
  });

  it("extracts UI Kit imports and returns mappings", async () => {
    const result = await callMigrate({ filePath: tmpFile });
    const data = JSON.parse(getText(result));

    expect(data.filePath).toBe(tmpFile);
    expect(data.mappings).toBeInstanceOf(Array);
    expect(data.mappings.length).toBe(3);

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("PrimaryButton");
    expect(names).toContain("TextInput");
    expect(names).toContain("LoadingSpinner");
  });

  it("extracts barrel imports from @commercetools-frontend/ui-kit", async () => {
    const barrelFile = join(tmpDir, "barrel-import.tsx");
    await writeFile(
      barrelFile,
      `
import { Spacings, Grid, Card, Text } from '@commercetools-frontend/ui-kit';
import React from 'react';

export const MyComponent = () => (
  <Spacings.Stack>
    <Card>
      <Text.Body>Hello</Text.Body>
    </Card>
  </Spacings.Stack>
);
`
    );

    const result = await callMigrate({ filePath: barrelFile });
    const data = JSON.parse(getText(result));

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("Card");
    expect(names).toContain("Grid");
    // Only the sub-components actually used in the file should appear
    expect(names).toContain("Spacings.Stack");
    expect(names).not.toContain("Spacings.Inline");
    expect(names).not.toContain("Spacings.Inset");
    expect(names).toContain("Text.Body");
    expect(names).not.toContain("Text.Headline");
    // The root names themselves should not appear as unmapped
    expect(data.unmapped).not.toContain("Spacings");
    expect(data.unmapped).not.toContain("Text");

    await unlink(barrelFile);
  });

  it("returns all sub-components when none are explicitly used in the file", async () => {
    const barrelFile = join(tmpDir, "barrel-no-usage.tsx");
    await writeFile(
      barrelFile,
      `
import { Spacings } from '@commercetools-frontend/ui-kit';

// Spacings is imported but no specific sub-component usage is detectable
export const spacing = Spacings;
`
    );

    const result = await callMigrate({ filePath: barrelFile });
    const data = JSON.parse(getText(result));

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    // Falls back to all sub-components since none were detected
    expect(names).toContain("Spacings.Stack");
    expect(names).toContain("Spacings.Inline");
    expect(names).toContain("Spacings.Inset");

    await unlink(barrelFile);
  });

  it("returns error for non-existent file", async () => {
    const result = await callMigrate({
      filePath: "/tmp/does-not-exist.tsx",
    });
    expect(result.isError).toBe(true);
  });
});

describe("migrate_from_uikit — validation", () => {
  it("returns error when neither param is provided", async () => {
    const result = await callMigrate({});
    expect(result.isError).toBe(true);
  });
});
