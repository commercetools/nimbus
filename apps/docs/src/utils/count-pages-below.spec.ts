import { describe, expect, it } from "vitest";
import { countPagesBelow } from "./count-pages-below";

const routes = [
  { menu: ["Components"] },
  { menu: ["Components", "Buttons"] },
  { menu: ["Components", "Buttons", "Button"] },
  { menu: ["Components", "Inputs", "Checkbox"] },
  { menu: ["Hooks"] },
  { menu: ["Home", "Design Tokens"] },
  { menu: ["Home", "Design Tokens", "Colors"] },
];

describe("countPagesBelow", () => {
  it("counts every level below a top-level document", () => {
    expect(countPagesBelow(routes, { menu: ["Components"] })).toBe(3);
  });

  it("counts the pages below a nested document", () => {
    expect(countPagesBelow(routes, { menu: ["Home", "Design Tokens"] })).toBe(
      1
    );
  });

  it("does not count documents that only share a name prefix", () => {
    expect(
      countPagesBelow([...routes, { menu: ["Components X", "A"] }], {
        menu: ["Components"],
      })
    ).toBe(3);
  });

  it("returns 0 for a document without pages below it", () => {
    expect(countPagesBelow(routes, { menu: ["Hooks"] })).toBe(0);
  });
});
