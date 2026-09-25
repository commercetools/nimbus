import { describe, it, expect } from "vitest";
import { defaultGetRowKey } from "./row-keys.utils";
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
