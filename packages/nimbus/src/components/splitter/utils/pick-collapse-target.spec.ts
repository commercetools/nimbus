import { describe, it, expect } from "vitest";
import { pickCollapseTarget } from "./pick-collapse-target";

const cfg = (map: Record<string, { collapsible?: boolean }>) => (id: string) =>
  map[id] ?? {};

describe("pickCollapseTarget", () => {
  it("returns null when there are not exactly two panes", () => {
    expect(pickCollapseTarget(["a"], { a: 100 }, cfg({}))).toBeNull();
    expect(
      pickCollapseTarget(["a", "b", "c"], { a: 33, b: 33, c: 34 }, cfg({}))
    ).toBeNull();
  });

  it("returns null when neither pane is collapsible", () => {
    expect(
      pickCollapseTarget(["a", "b"], { a: 50, b: 50 }, cfg({}))
    ).toBeNull();
  });

  it("targets the only collapsible pane (prev)", () => {
    const result = pickCollapseTarget(
      ["a", "b"],
      { a: 50, b: 50 },
      cfg({ a: { collapsible: true } })
    );
    expect(result).toEqual({ paneId: "a", otherId: "b" });
  });

  it("targets the only collapsible pane (next)", () => {
    const result = pickCollapseTarget(
      ["a", "b"],
      { a: 50, b: 50 },
      cfg({ b: { collapsible: true } })
    );
    expect(result).toEqual({ paneId: "b", otherId: "a" });
  });

  it("targets the smaller pane when both are collapsible", () => {
    const result = pickCollapseTarget(
      ["a", "b"],
      { a: 70, b: 30 },
      cfg({ a: { collapsible: true }, b: { collapsible: true } })
    );
    expect(result).toEqual({ paneId: "b", otherId: "a" });
  });

  it("breaks ties toward the previous pane when both are collapsible", () => {
    const result = pickCollapseTarget(
      ["a", "b"],
      { a: 50, b: 50 },
      cfg({ a: { collapsible: true }, b: { collapsible: true } })
    );
    expect(result).toEqual({ paneId: "a", otherId: "b" });
  });
});
