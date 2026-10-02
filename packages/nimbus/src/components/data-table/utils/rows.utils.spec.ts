import { describe, it, expect } from "vitest";
import { filterRows, sortRows } from "./rows.utils";
import type {
  DataTableColumnItem,
  DataTableRowItem,
} from "../data-table.types";

const columns: DataTableColumnItem[] = [
  { id: "name", header: "Name", accessor: (row) => row.name as string },
];

const parent = {
  id: "p",
  name: "Parent",
  children: [
    { id: "c2", name: "Beta" },
    { id: "c1", name: "Alpha" },
  ],
} as DataTableRowItem;
const leaf = { id: "l", name: "Leaf" } as DataTableRowItem;

// DataTable.Row is memoised by its row object. These tests guard that a row
// is only copied when its content changes, so `memo` can skip the others.
describe("sortRows", () => {
  it("keeps a row with nested rows when their order does not change", () => {
    // Pinning moves the leaf to the top; the parent's nested rows stay.
    const [sortedLeaf, sortedParent] = sortRows(
      [parent, leaf],
      undefined,
      columns,
      "children",
      new Set(["l"])
    );

    expect(sortedParent).toBe(parent);
    expect(sortedLeaf).toBe(leaf);
  });

  it("copies a row whose nested rows are reordered", () => {
    const [sortedParent] = sortRows(
      [parent],
      { column: "name", direction: "ascending" },
      columns,
      "children"
    );

    expect(sortedParent).not.toBe(parent);
    expect(
      (sortedParent.children as DataTableRowItem[]).map((row) => row.id)
    ).toEqual(["c1", "c2"]);
  });

  it("resolves the keys of nested rows with the given getRowKey", () => {
    // "key:c1" is pinned. Only the given resolver produces that key, so
    // the nested sort must use it to keep c1 at the top.
    const [sortedParent] = sortRows(
      [parent],
      { column: "name", direction: "descending" },
      columns,
      "children",
      new Set(["key:c1"]),
      (row) => `key:${row.id}`
    );

    expect(
      (sortedParent.children as DataTableRowItem[]).map((row) => row.id)
    ).toEqual(["c1", "c2"]);
  });
});

describe("filterRows", () => {
  it("keeps a matching row when every nested row matches too", () => {
    const [match] = filterRows([parent], "a", columns, "children");

    expect(match).toBe(parent);
  });

  it("copies a row whose nested rows are filtered", () => {
    const [match] = filterRows([parent], "alpha", columns, "children");

    expect(match).not.toBe(parent);
    expect((match.children as DataTableRowItem[]).map((row) => row.id)).toEqual(
      ["c1"]
    );
  });

  it("keeps a matching row whose nested content is not an array", () => {
    const withNote = {
      id: "n",
      name: "Note",
      note: "Text",
    } as DataTableRowItem;

    const [match] = filterRows([withNote], "note", columns, "note");

    expect(match).toBe(withNote);
  });
});
