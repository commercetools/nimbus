import { describe, it, expect } from "vitest";
import { getNodeText, withoutNode } from "./hast-node";

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

  it("returns an empty string for null/undefined input", () => {
    expect(getNodeText(null)).toBe("");
    expect(getNodeText(undefined)).toBe("");
  });

  it("returns a root-level text node's value", () => {
    expect(getNodeText({ type: "text", value: "hi" })).toBe("hi");
  });

  it("returns an empty string for an element with no children", () => {
    expect(getNodeText({ type: "element", tagName: "br" })).toBe("");
  });

  it("concatenates text across deeply nested elements", () => {
    const node = {
      type: "element",
      tagName: "p",
      children: [
        { type: "text", value: "a" },
        {
          type: "element",
          tagName: "em",
          children: [
            {
              type: "element",
              tagName: "strong",
              children: [{ type: "text", value: "b" }],
            },
            { type: "text", value: "c" },
          ],
        },
      ],
    };
    expect(getNodeText(node)).toBe("abc");
  });
});

describe("markdown utils — withoutNode", () => {
  it("strips the node prop and keeps the rest", () => {
    const result = withoutNode({
      node: { type: "element" },
      id: "x",
      checked: true,
    });
    expect(result).toEqual({ id: "x", checked: true });
    expect("node" in result).toBe(false);
  });

  it("returns a shallow copy without mutating the input", () => {
    const input = { node: { type: "element" }, id: "x" };
    withoutNode(input);
    expect("node" in input).toBe(true);
  });
});
