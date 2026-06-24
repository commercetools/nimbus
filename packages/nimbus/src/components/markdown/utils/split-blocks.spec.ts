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

  it("reparses only the final block as a stream grows (prefix is stable)", () => {
    const a = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrow");
    const b = splitMarkdownIntoBlocks("# Title\n\nDone para.\n\nGrowing more");
    expect(b.slice(0, 2)).toEqual(a.slice(0, 2));
    expect(b[2]).not.toEqual(a[2]);
  });
});
