import { describe, it, expect } from "vitest";
import {
  defaultGetRowKey,
  findRowKeyProblems,
  formatRowKeyProblems,
} from "./row-keys.utils";
import type { DataTableRowItem } from "../data-table.types";

const row = (r: Record<string, unknown>) => r as DataTableRowItem;

describe("defaultGetRowKey", () => {
  it("identifies a row by its id", () => {
    expect(defaultGetRowKey(row({ id: "a1" }))).toBe("a1");
  });

  it("never falls back to a business `key` field", () => {
    // The whole bug this resolver exists to prevent: React Aria resolves
    // `props.id ?? item.key ?? item.id`, so a domain object's `key` used to
    // become the row's identity.
    expect(defaultGetRowKey(row({ id: "a1", key: "vip" }))).toBe("a1");
  });
});

describe("findRowKeyProblems", () => {
  it("reports nothing for unique, non-empty keys", () => {
    const rows = [row({ id: "a1" }), row({ id: "b2" })];
    expect(findRowKeyProblems(rows, defaultGetRowKey)).toEqual([]);
  });

  it("reports duplicated keys with a count", () => {
    const rows = [row({ id: "dup" }), row({ id: "dup" }), row({ id: "b2" })];
    expect(findRowKeyProblems(rows, defaultGetRowKey)).toEqual([
      { type: "duplicate", key: "dup", count: 2 },
    ]);
  });

  it("reports an empty key by index", () => {
    const rows = [row({ id: "a1" }), row({ id: "" })];
    expect(findRowKeyProblems(rows, defaultGetRowKey)).toEqual([
      { type: "missing", index: 1 },
    ]);
  });

  it("reports a missing key by index", () => {
    const rows = [row({ name: "no id" }), row({ id: "b2" })];
    expect(findRowKeyProblems(rows, defaultGetRowKey)).toEqual([
      { type: "missing", index: 0 },
    ]);
  });

  it("honours a custom resolver", () => {
    const rows = [row({ id: "a1", sku: "X" }), row({ id: "b2", sku: "X" })];
    const bySku = (r: DataTableRowItem) => r.sku as string;
    expect(findRowKeyProblems(rows, bySku)).toEqual([
      { type: "duplicate", key: "X", count: 2 },
    ]);
    // The same rows are fine under the default resolver.
    expect(findRowKeyProblems(rows, defaultGetRowKey)).toEqual([]);
  });
});

describe("formatRowKeyProblems", () => {
  it("returns null when there is nothing to report", () => {
    expect(formatRowKeyProblems([])).toBeNull();
  });

  it("names the duplicated key", () => {
    const message = formatRowKeyProblems([
      { type: "duplicate", key: "dup", count: 2 },
    ]);
    expect(message).toContain('"dup" (2 rows)');
    expect(message).toContain("unique");
  });

  it("names the index of a missing key", () => {
    const message = formatRowKeyProblems([{ type: "missing", index: 3 }]);
    expect(message).toContain("index 3");
  });

  it("reports both kinds in one message", () => {
    const message = formatRowKeyProblems([
      { type: "duplicate", key: "dup", count: 2 },
      { type: "missing", index: 0 },
    ]);
    expect(message).toContain("dup");
    expect(message).toContain("index 0");
  });
});
