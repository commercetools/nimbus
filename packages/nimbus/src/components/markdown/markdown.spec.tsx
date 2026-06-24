import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { NimbusProvider, Markdown } from "@commercetools/nimbus";
import {
  getNodeText,
  isExternalUrl,
  splitMarkdownIntoBlocks,
  getHeadingLevels,
  findHeadingLevelSkips,
} from "./markdown.utils";

describe("markdown utils — isExternalUrl", () => {
  it("treats absolute http(s) and protocol-relative URLs as external", () => {
    expect(isExternalUrl("https://example.com")).toBe(true);
    expect(isExternalUrl("http://example.com")).toBe(true);
    expect(isExternalUrl("//cdn.example.com/x")).toBe(true);
  });
  it("treats relative and in-page links as internal", () => {
    expect(isExternalUrl("/docs")).toBe(false);
    expect(isExternalUrl("#section")).toBe(false);
    expect(isExternalUrl("mailto:a@b.com")).toBe(false);
    expect(isExternalUrl(undefined)).toBe(false);
  });
});

describe("markdown utils — getNodeText", () => {
  it("recursively concatenates text from a hast node", () => {
    const node = {
      type: "element",
      tagName: "li",
      children: [
        { type: "text", value: "Buy " },
        {
          type: "element",
          tagName: "strong",
          children: [{ type: "text", value: "milk" }],
        },
      ],
    };
    expect(getNodeText(node)).toBe("Buy milk");
  });
});

describe("markdown utils — splitMarkdownIntoBlocks", () => {
  it("splits paragraphs and headings into separate blocks", () => {
    const blocks = splitMarkdownIntoBlocks(
      "# Title\n\nFirst paragraph.\n\nSecond paragraph."
    );
    expect(blocks).toEqual([
      "# Title",
      "First paragraph.",
      "Second paragraph.",
    ]);
  });

  it("never splits inside a fenced code block", () => {
    const src = "Before\n\n```ts\nconst a = 1;\n\nconst b = 2;\n```\n\nAfter";
    const blocks = splitMarkdownIntoBlocks(src);
    expect(blocks).toHaveLength(3);
    expect(blocks[1]).toContain("const a = 1;");
    expect(blocks[1]).toContain("const b = 2;");
    expect(blocks[1].startsWith("```")).toBe(true);
  });

  it("keeps a loose list together as one block", () => {
    const src = "- one\n\n- two\n\n- three";
    const blocks = splitMarkdownIntoBlocks(src);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain("- one");
    expect(blocks[0]).toContain("- three");
  });

  it("reparses only the final block as a stream grows (prefix is stable)", () => {
    const a = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrow");
    const b = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrowing more");
    expect(b.slice(0, 2)).toEqual(a.slice(0, 2));
    expect(b[2]).not.toEqual(a[2]);
  });
});

describe("markdown utils — heading level detection", () => {
  it("collects ATX heading levels, ignoring fenced code", () => {
    const src = "# A\n\n```\n## not a heading\n```\n\n### C";
    expect(getHeadingLevels(src)).toEqual([1, 3]);
  });
  it("flags level skips", () => {
    expect(findHeadingLevelSkips([1, 3])).toEqual([{ from: 1, to: 3 }]);
    expect(findHeadingLevelSkips([1, 2, 3])).toEqual([]);
    expect(findHeadingLevelSkips([2, 2, 4])).toEqual([{ from: 2, to: 4 }]);
  });
});

describe("Markdown — development-mode warnings", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns when author markdown skips a heading level", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>{"# Title\n\n### Skipped to three"}</Markdown>
      </NimbusProvider>
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Heading level skip")
    );
  });

  it("warns when an image is missing alt text", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>{"![](https://cdn.example.com/x.png)"}</Markdown>
      </NimbusProvider>
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("missing alt text")
    );
  });

  it("does not warn for a well-formed document", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NimbusProvider>
        <Markdown>
          {"# Title\n\n## Section\n\n![a cat](https://cdn.example.com/cat.png)"}
        </Markdown>
      </NimbusProvider>
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
