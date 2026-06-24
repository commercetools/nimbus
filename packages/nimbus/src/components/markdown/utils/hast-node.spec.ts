import { describe, it, expect } from "vitest";
import { getNodeText } from "./hast-node";

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
