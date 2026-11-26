import { describe, expect, it } from "vitest";
import { findUnknownRelatedIds, resolveRelated } from "./resolve-related";

const doc = (id: string, related: string[] = []) => ({
  id,
  title: id,
  related,
});

describe("resolveRelated", () => {
  it("adds a reverse link when only one side lists the other", () => {
    const result = resolveRelated([doc("A", ["B"]), doc("B")]);
    expect(result.get("A")).toEqual(["B"]);
    expect(result.get("B")).toEqual(["A"]);
  });

  it("puts the own list first in the written order, then reverse links by title", () => {
    const result = resolveRelated([
      doc("A", ["D", "C"]),
      doc("B", ["A"]),
      doc("C"),
      doc("D"),
      doc("E", ["A"]),
    ]);
    expect(result.get("A")).toEqual(["D", "C", "B", "E"]);
  });

  it("lists each id once", () => {
    const result = resolveRelated([doc("A", ["B", "B"]), doc("B", ["A"])]);
    expect(result.get("A")).toEqual(["B"]);
    expect(result.get("B")).toEqual(["A"]);
  });

  it("ignores the own id", () => {
    const result = resolveRelated([doc("A", ["A"])]);
    expect(result.get("A")).toEqual([]);
  });

  it("returns an empty list for a document without links", () => {
    expect(resolveRelated([doc("A")]).get("A")).toEqual([]);
  });
});

describe("findUnknownRelatedIds", () => {
  it("reports the file and the unknown id", () => {
    const docs = [
      { file: "a.mdx", meta: doc("A", ["B", "Missing"]) },
      { file: "b.mdx", meta: doc("B") },
    ];
    expect(findUnknownRelatedIds(docs)).toEqual([
      { file: "a.mdx", id: "Missing" },
    ]);
  });

  it("reports nothing when all ids exist", () => {
    const docs = [
      { file: "a.mdx", meta: doc("A", ["B"]) },
      { file: "b.mdx", meta: doc("B") },
    ];
    expect(findUnknownRelatedIds(docs)).toEqual([]);
  });
});
