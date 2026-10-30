import { describe, expect, it } from "vitest";
import { getVisibleTocItems } from "./toc-items";

const item = (id: string, depth: number) => ({
  value: id,
  href: `#${id}`,
  depth,
});

const toc = [
  item("a", 2),
  item("a1", 3),
  item("a1x", 4),
  item("a2", 3),
  item("b", 2),
  item("b1", 3),
  item("c", 2),
];

const ids = (items: { value: string }[]) => items.map((entry) => entry.value);

describe("getVisibleTocItems", () => {
  it("shows only h2 entries when nothing is active", () => {
    expect(ids(getVisibleTocItems(toc, undefined))).toEqual(["a", "b", "c"]);
  });

  it("shows the h3 entries of the section of an active h2", () => {
    expect(ids(getVisibleTocItems(toc, "b"))).toEqual(["a", "b", "b1", "c"]);
  });

  it("shows the h3 entries of the section of an active h3", () => {
    expect(ids(getVisibleTocItems(toc, "a2"))).toEqual([
      "a",
      "a1",
      "a2",
      "b",
      "c",
    ]);
  });

  it("uses the section of an active heading deeper than h3", () => {
    expect(ids(getVisibleTocItems(toc, "a1x"))).toEqual([
      "a",
      "a1",
      "a2",
      "b",
      "c",
    ]);
  });

  it("never shows entries deeper than h3", () => {
    expect(
      getVisibleTocItems(toc, "a").every((entry) => entry.depth <= 3)
    ).toBe(true);
  });

  it("keeps h1 entries", () => {
    const list = [item("t", 1), ...toc];
    expect(ids(getVisibleTocItems(list, undefined))).toEqual([
      "t",
      "a",
      "b",
      "c",
    ]);
  });

  it("shows all h2 entries when the active id is unknown", () => {
    expect(ids(getVisibleTocItems(toc, "missing"))).toEqual(["a", "b", "c"]);
  });
});
