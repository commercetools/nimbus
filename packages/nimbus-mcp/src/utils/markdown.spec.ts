import { describe, it, expect } from "vitest";
import { stripMarkdown } from "./markdown.js";

describe("stripMarkdown", () => {
  // ---------------------------------------------------------------------------
  // Frontmatter
  // ---------------------------------------------------------------------------

  it("removes frontmatter block", () => {
    const input =
      "---\ntitle: Button\ndescription: A button component\n---\n\n# Button";
    expect(stripMarkdown(input)).toBe("Button");
  });

  it("does NOT strip --- section separators mid-document", () => {
    // The /m flag bug causes the frontmatter regex to eat mid-doc --- separators.
    // Fixed by removing the /m flag so ^ anchors to the true start of string only.
    const input = "Intro\n\n---\n\nMiddle content\n\n---\n\nEnd";
    const result = stripMarkdown(input);
    expect(result).toContain("Middle content");
  });

  // ---------------------------------------------------------------------------
  // JSX / HTML tags
  // ---------------------------------------------------------------------------

  it("removes self-closing JSX components", () => {
    expect(stripMarkdown('text\n<ComponentDemo prop="value" />\nmore')).toBe(
      "text\n\nmore"
    );
  });

  it("removes JSX components with children", () => {
    expect(
      stripMarkdown(
        "text\n<StorybookHintMessage>content</StorybookHintMessage>\nmore"
      )
    ).toBe("text\n\nmore");
  });

  it("strips lowercase HTML self-closing tags", () => {
    expect(stripMarkdown("Line one<br />Line two")).not.toContain("<br");
  });

  it("strips lowercase HTML tag markers but preserves text content", () => {
    const result = stripMarkdown("<p>Hello world</p>");
    expect(result).not.toContain("<p>");
    expect(result).not.toContain("</p>");
    expect(result).toContain("Hello world");
  });

  // ---------------------------------------------------------------------------
  // Fenced code blocks
  // ---------------------------------------------------------------------------

  it("strips fenced code block fence markers", () => {
    const input = "Some text\n```tsx\nconst x = 1;\n```\nMore text";
    const result = stripMarkdown(input);
    expect(result).not.toContain("```");
  });

  it("preserves code content inside fenced blocks for searchability", () => {
    const input = "Text\n```ts\nconst x = ButtonProps;\n```\nAfter";
    const result = stripMarkdown(input);
    expect(result).toContain("ButtonProps");
  });

  it("does not strip JSX/HTML tags inside fenced code blocks", () => {
    const input =
      'Text\n```tsx\n<Button variant="solid">Click me</Button>\n```\nAfter';
    const result = stripMarkdown(input);
    // Code content must be preserved verbatim — tag-stripping must not touch it
    expect(result).toContain("<Button");
    expect(result).toContain("Click me");
  });

  // ---------------------------------------------------------------------------
  // Markdown formatting
  // ---------------------------------------------------------------------------

  it("removes heading markers", () => {
    expect(stripMarkdown("# Heading")).toBe("Heading");
    expect(stripMarkdown("## Heading")).toBe("Heading");
    expect(stripMarkdown("###### Heading")).toBe("Heading");
  });

  it("removes bold formatting", () => {
    expect(stripMarkdown("**bold text**")).toBe("bold text");
  });

  it("removes italic formatting", () => {
    expect(stripMarkdown("*italic text*")).toBe("italic text");
  });

  it("removes images entirely", () => {
    expect(stripMarkdown("![alt text](image.png)")).toBe("");
  });

  it("removes link URLs but keeps label text", () => {
    expect(stripMarkdown("[see docs](https://example.com)")).toBe("see docs");
  });

  it("preserves inline code backticks", () => {
    expect(stripMarkdown("use `Button` component")).toBe(
      "use `Button` component"
    );
  });

  it("collapses 3+ blank lines into 2", () => {
    expect(stripMarkdown("a\n\n\n\nb")).toBe("a\n\nb");
  });

  it("trims leading and trailing whitespace", () => {
    expect(stripMarkdown("  content  ")).toBe("content");
  });

  it("returns plain text unchanged", () => {
    expect(stripMarkdown("plain text")).toBe("plain text");
  });

  it("returns empty string unchanged", () => {
    expect(stripMarkdown("")).toBe("");
  });

  it("handles mixed formatting", () => {
    expect(stripMarkdown("## Title\n**bold** and *italic* with `code`")).toBe(
      "Title\nbold and italic with `code`"
    );
  });
});
