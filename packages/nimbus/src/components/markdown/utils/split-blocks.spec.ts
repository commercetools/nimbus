import { describe, it, expect } from "vitest";
import { splitMarkdownIntoBlocks } from "./split-blocks";

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

  it("splits a heading that immediately follows a list into its own block", () => {
    const blocks = splitMarkdownIntoBlocks("- one\n- two\n## Heading");
    expect(blocks).toEqual(["- one\n- two", "## Heading"]);
  });

  it("splits a fence that immediately follows a list into its own block", () => {
    const blocks = splitMarkdownIntoBlocks("- one\n```\ncode\n```");
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toBe("- one");
    expect(blocks[1]).toContain("code");
  });

  it("does not close a longer opening fence on a shorter fence line", () => {
    const src = "`````\n```\nnested\n```\n`````\n\nAfter";
    const blocks = splitMarkdownIntoBlocks(src);
    expect(blocks).toHaveLength(2);
    expect(blocks[0].startsWith("`````")).toBe(true);
    expect(blocks[0]).toContain("nested");
    expect(blocks[1]).toBe("After");
  });

  it("reparses only the final block as a stream grows (prefix is stable)", () => {
    const a = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrow");
    const b = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrowing more");
    expect(b.slice(0, 2)).toEqual(a.slice(0, 2));
    expect(b[2]).not.toEqual(a[2]);
  });

  describe("custom component tag regions", () => {
    const names = new Set(["Callout", "Card"]);

    it("keeps a paired block-level region in one block", () => {
      const src = '<Callout tone="info">\n\nInner **text**.\n\n</Callout>';
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks).toHaveLength(1);
      expect(blocks[0]).toContain("<Callout");
      expect(blocks[0]).toContain("</Callout>");
    });

    it("keeps nested same-name regions together (depth counting)", () => {
      const src = "<Card>\n\n<Card>\n\ninner\n\n</Card>\n\n</Card>";
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks).toHaveLength(1);
    });

    it("keeps an unclosed region's tail in one growing block (mid-stream)", () => {
      const src = '<Callout tone="info">\n\nStreaming **in**';
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks).toHaveLength(1);
      expect(blocks[0]).toContain("Streaming");
    });

    it("does not treat self-closing tags as a region", () => {
      const src = '<Card id="x" />\n\nAfter.';
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks).toEqual(['<Card id="x" />', "After."]);
    });

    it("does not start a region for an unregistered tag", () => {
      const src = "<Unknown>\n\ntext\n\n</Unknown>";
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks.length).toBeGreaterThan(1);
    });

    it("keeps a custom tag inside a fenced code block literal (fence wins)", () => {
      const src = "```\n<Callout>\n</Callout>\n```";
      const blocks = splitMarkdownIntoBlocks(src, names);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].startsWith("```")).toBe(true);
    });

    it("behaves exactly as before when no names are passed", () => {
      const src = "<Callout>\n\ntext\n\n</Callout>";
      expect(splitMarkdownIntoBlocks(src)).toEqual(
        splitMarkdownIntoBlocks(src, new Set())
      );
    });
  });
});
