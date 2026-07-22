import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { writeFile, rm, mkdtemp } from "node:fs/promises";
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

  it("includes a get_component hint with the Nimbus equivalent name", async () => {
    const result = await callMigrate({ componentName: "PrimaryButton" });
    const data = JSON.parse(getText(result));

    expect(data.hint).toContain("get_component");
    expect(data.hint).toContain("Button");
  });

  it("resolves a component via case-insensitive fallback", async () => {
    const result = await callMigrate({ componentName: "primarybutton" });
    const data = JSON.parse(getText(result));

    expect(result.isError).toBeUndefined();
    expect(data.uiKitName).toBe("PrimaryButton");
    expect(data.nimbusEquivalent).toBe("Button");
  });

  it("returns error for unknown component", async () => {
    const result = await callMigrate({
      componentName: "NonExistentComponent",
    });
    expect(result.isError).toBe(true);
    expect(getText(result)).toContain("NonExistentComponent");
  });

  it("includes a high-confidence suggestion when unknown component has a close Nimbus match", async () => {
    const result = await callMigrate({
      componentName: "SearchTextInput",
    });
    const data = JSON.parse(getText(result));

    expect(result.isError).toBeUndefined();
    expect(data.uiKitName).toBe("SearchTextInput");
    expect(data.suggestion).toBeDefined();
    expect(data.suggestion.name).toBe("SearchInput");
    expect(data.suggestion.confidence).toBe("high");
    expect(data.hint).toContain("get_component");
  });

  it("includes a medium-confidence suggestion via fuzzy match", async () => {
    // "Acordion" is a typo of "Accordion" — no exact substring match,
    // but within Levenshtein distance 1 of the Nimbus component name.
    const result = await callMigrate({
      componentName: "Acordion",
    });
    const data = JSON.parse(getText(result));

    expect(result.isError).toBeUndefined();
    expect(data.uiKitName).toBe("Acordion");
    expect(data.suggestion).toBeDefined();
    expect(data.suggestion.name).toBe("Accordion");
    expect(data.suggestion.confidence).toBe("medium");
  });

  it("does not return high-confidence suggestions for all-generic-word names", async () => {
    // "TextButton" is composed entirely of generic UI words — any match
    // should be medium confidence at best, not high.
    const result = await callMigrate({
      componentName: "TextButton",
    });

    if (!result.isError) {
      const data = JSON.parse(getText(result));
      expect(data.suggestion?.confidence).not.toBe("high");
    }
  });

  it("returns error with no suggestion for truly unknown component", async () => {
    const result = await callMigrate({
      componentName: "ZzzNonExistentWidget",
    });
    expect(result.isError).toBe(true);
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
      await rm(tmpDir, { recursive: true });
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
    const unmappedNames = data.unmapped.map((u: { name: string }) => u.name);
    expect(unmappedNames).not.toContain("Spacings");
    expect(unmappedNames).not.toContain("Text");
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
  });

  it("skips import type statements", async () => {
    const typeOnlyFile = join(tmpDir, "type-only.tsx");
    await writeFile(
      typeOnlyFile,
      `
import type { PrimaryButton } from '@commercetools-uikit/buttons';
import type TextInput from '@commercetools-uikit/text-input';
import type { Card } from '@commercetools-frontend/ui-kit';
import { LoadingSpinner } from '@commercetools-uikit/loading-spinner';

export const MyComponent = () => <div />;
`
    );

    const result = await callMigrate({ filePath: typeOnlyFile });
    const data = JSON.parse(getText(result));

    expect(data.mappings.length).toBe(1);
    expect(data.mappings[0].uiKitName).toBe("LoadingSpinner");
  });

  it("extracts the original name from aliased imports", async () => {
    const aliasFile = join(tmpDir, "aliased.tsx");
    await writeFile(
      aliasFile,
      `
import { PrimaryButton as PB, SecondaryButton as SB } from '@commercetools-uikit/buttons';

export const MyComponent = () => <div />;
`
    );

    const result = await callMigrate({ filePath: aliasFile });
    const data = JSON.parse(getText(result));

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("PrimaryButton");
    expect(names).toContain("SecondaryButton");
  });

  it("extracts default import from combined default + named type imports", async () => {
    const combinedFile = join(tmpDir, "combined-import.tsx");
    await writeFile(
      combinedFile,
      `
import FieldErrors, {
  type TFieldErrors,
  type TFieldErrorsProps,
} from '@commercetools-uikit/field-errors';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';

export const MyComponent = () => <div />;
`
    );

    const result = await callMigrate({ filePath: combinedFile });
    const data = JSON.parse(getText(result));

    const names = data.mappings.map((m: { uiKitName: string }) => m.uiKitName);
    expect(names).toContain("FieldErrors");
    expect(names).toContain("CollapsiblePanel");
    // Type-only named imports should not appear
    const unmappedNames = data.unmapped.map((u: { name: string }) => u.name);
    expect(unmappedNames).not.toContain("TFieldErrors");
    expect(unmappedNames).not.toContain("TFieldErrorsProps");
  });

  it("returns unmapped components as objects with suggestions when available", async () => {
    const suggestionFile = join(tmpDir, "suggestion-test.tsx");
    await writeFile(
      suggestionFile,
      `
import SearchTextInput from '@commercetools-uikit/search-text-input';
import { PrimaryButton } from '@commercetools-uikit/buttons';

export const MyComponent = () => <div />;
`
    );

    const result = await callMigrate({ filePath: suggestionFile });
    const data = JSON.parse(getText(result));

    // PrimaryButton should be in mappings (it has a migration rule)
    const mappedNames = data.mappings.map(
      (m: { uiKitName: string }) => m.uiKitName
    );
    expect(mappedNames).toContain("PrimaryButton");

    // SearchTextInput should be unmapped with a suggestion
    expect(data.unmapped).toBeInstanceOf(Array);
    expect(data.unmapped.length).toBe(1);
    expect(data.unmapped[0].name).toBe("SearchTextInput");
    expect(data.unmapped[0].suggestion).toBeDefined();
    expect(data.unmapped[0].suggestion.name).toBe("SearchInput");
    expect(data.unmapped[0].suggestion.confidence).toBe("high");
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

describe("migrate_from_uikit — propMappings", () => {
  it("includes propMappings in the result for entries that have them", async () => {
    const result = await callMigrate({ componentName: "PrimaryButton" });
    const data = JSON.parse(getText(result));

    expect(data.propMappings).toBeInstanceOf(Array);
    expect(data.propMappings.length).toBeGreaterThan(0);

    const labelMapping = data.propMappings.find(
      (m: { uiKitProp: string }) => m.uiKitProp === "label"
    );
    expect(labelMapping).toBeDefined();
    expect(labelMapping.nimbusProp).toBeNull();
    expect(labelMapping.changeType).toBe("structural");
  });

  it("omits propMappings for entries without them", async () => {
    const result = await callMigrate({ componentName: "Avatar" });
    const data = JSON.parse(getText(result));

    expect(data.propMappings).toBeUndefined();
  });

  it("includes propMappings with value mappings for Stamp → Badge", async () => {
    const result = await callMigrate({ componentName: "Stamp" });
    const data = JSON.parse(getText(result));

    expect(data.propMappings).toBeInstanceOf(Array);
    const toneMapping = data.propMappings.find(
      (m: { uiKitProp: string }) => m.uiKitProp === "tone"
    );
    expect(toneMapping.nimbusProp).toBe("colorPalette");
    expect(toneMapping.changeType).toBe("value-mapping");
    expect(toneMapping.valueMapping).toBeInstanceOf(Array);
    expect(toneMapping.valueMapping.length).toBeGreaterThan(0);
  });
});

describe("migrate_from_uikit — iconWrapper", () => {
  it("includes iconWrapper for Icon Library with component, importPath, and defaultProps", async () => {
    const result = await callMigrate({ componentName: "Icon Library" });
    const data = JSON.parse(getText(result));

    expect(data.iconWrapper).toBeDefined();
    expect(data.iconWrapper.component).toBe("Icon");
    expect(data.iconWrapper.importPath).toBe("@commercetools/nimbus");
    expect(data.iconWrapper.defaultProps).toBeDefined();
    expect(data.iconWrapper.defaultProps.size).toBe("2xs");
    expect(data.iconWrapper.defaultProps.color).toBe("neutral.11");
  });

  it("includes iconWrapper for CustomIcon", async () => {
    const result = await callMigrate({ componentName: "CustomIcon" });
    const data = JSON.parse(getText(result));

    expect(data.iconWrapper).toBeDefined();
    expect(data.iconWrapper.component).toBe("Icon");
    expect(data.iconWrapper.importPath).toBe("@commercetools/nimbus");
  });

  it("includes sizeMapping in iconWrapper with UIKit-to-Nimbus size translations for Icon Library", async () => {
    const result = await callMigrate({ componentName: "Icon Library" });
    const data = JSON.parse(getText(result));

    expect(data.iconWrapper.sizeMapping).toBeDefined();
    expect(data.iconWrapper.sizeMapping).toEqual([
      { from: "small", to: "2xs" },
      { from: "medium", to: "xs" },
      { from: "big", to: "md" },
      { from: "10", to: "2xs" },
      { from: "20", to: "xs" },
      { from: "30", to: "sm" },
      { from: "40", to: "md" },
    ]);
  });

  it("uses numeric sizes (not deprecated aliases) for CustomIcon sizeMapping", async () => {
    const result = await callMigrate({ componentName: "CustomIcon" });
    const data = JSON.parse(getText(result));

    expect(data.iconWrapper.sizeMapping).toEqual([
      { from: "10", to: "2xs" },
      { from: "20", to: "xs" },
      { from: "30", to: "sm" },
      { from: "40", to: "md" },
    ]);
  });

  it("does not include iconWrapper for non-icon components", async () => {
    const result = await callMigrate({ componentName: "PrimaryButton" });
    const data = JSON.parse(getText(result));

    expect(data.iconWrapper).toBeUndefined();
  });

  it("mentions the Icon wrapper pattern in notes for Icon Library", async () => {
    const result = await callMigrate({ componentName: "Icon Library" });
    const data = JSON.parse(getText(result));

    expect(data.notes).toContain("<Icon as={");
  });
});
