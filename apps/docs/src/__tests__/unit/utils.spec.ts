/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from "vitest";
import { sluggify, menuToPath } from "@/utils/sluggify";
import { stripMarkdown } from "@/utils/stip-markdown";

describe("sluggify", () => {
  it("converts string to URL-safe slug", () => {
    expect(sluggify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(sluggify("Hello & World!")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(sluggify("Hello    World")).toBe("hello-world");
  });

  it("handles uppercase letters", () => {
    expect(sluggify("HELLO WORLD")).toBe("hello-world");
  });

  it("handles empty string", () => {
    expect(sluggify("")).toBe("");
  });
});

describe("menuToPath", () => {
  it("converts menu array to path", () => {
    const menu = ["Components", "Button"];
    expect(menuToPath(menu)).toBe("components/button");
  });

  it("handles single item menu", () => {
    const menu = ["Home"];
    expect(menuToPath(menu)).toBe("home");
  });

  it("handles empty menu", () => {
    const menu: string[] = [];
    expect(menuToPath(menu)).toBe("");
  });

  it("handles menu items with special characters", () => {
    const menu = ["Get Started", "Installation & Setup"];
    expect(menuToPath(menu)).toBe("get-started/installation-setup");
  });
});

describe("stripMarkdown", () => {
  it("removes markdown bold syntax", () => {
    expect(stripMarkdown("**bold text**")).toBe("bold text");
  });

  it("removes markdown italic syntax", () => {
    expect(stripMarkdown("*italic text*")).toBe("italic text");
  });

  it("removes markdown links", () => {
    expect(stripMarkdown("[link text](https://example.com)")).toBe("");
  });

  it("removes markdown images", () => {
    expect(stripMarkdown("![alt text](image.jpg)")).toBe("");
  });

  it("removes HTML tags", () => {
    expect(stripMarkdown("<div>content</div>")).toBe("content");
  });

  it("removes markdown headings", () => {
    expect(stripMarkdown("# Heading")).toBe("Heading");
  });

  it("removes ordered list numbers", () => {
    expect(stripMarkdown("1. First item")).toBe("First item");
  });

  it("handles mixed markdown and HTML", () => {
    const input = "**Bold** and <strong>HTML</strong> text";
    const result = stripMarkdown(input);
    expect(result).toBe("Bold and HTML text");
  });

  it("handles empty string", () => {
    expect(stripMarkdown("")).toBe("");
  });

  it("handles plain text", () => {
    expect(stripMarkdown("plain text")).toBe("plain text");
  });

  it("removes line breaks and trims whitespace", () => {
    const input = "  Line one\nLine two  ";
    expect(stripMarkdown(input)).toBe("Line one Line two");
  });
});
