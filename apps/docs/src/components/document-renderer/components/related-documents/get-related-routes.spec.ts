import { describe, expect, it } from "vitest";
import { getRelatedRoutes } from "./get-related-routes";

const route = (id: string, related: string[] = []) => ({ id, related });

describe("getRelatedRoutes", () => {
  it("returns an empty list when the document has no related ids", () => {
    expect(getRelatedRoutes([route("A")], "A")).toEqual([]);
  });

  it("returns the entries in the order of the related list", () => {
    const routes = [route("A", ["C", "B"]), route("B"), route("C")];
    expect(getRelatedRoutes(routes, "A").map((r) => r.id)).toEqual(["C", "B"]);
  });

  it("skips ids that have no manifest entry", () => {
    const routes = [route("A", ["Missing", "B"]), route("B")];
    expect(getRelatedRoutes(routes, "A").map((r) => r.id)).toEqual(["B"]);
  });

  it("returns an empty list for an unknown document", () => {
    expect(getRelatedRoutes([route("A", ["B"])], "X")).toEqual([]);
  });
});
