import { describe, expect, it } from "vitest";
import { findSectionRoutes, SECTION_PATHS } from "./section-routes";

describe("findSectionRoutes", () => {
  it("returns the routes in the order of the paths", () => {
    const routes = [
      { path: "/hooks" },
      { path: "/a" },
      { path: "/components" },
    ];
    expect(findSectionRoutes(routes, ["/components", "/hooks"])).toEqual([
      { path: "/components" },
      { path: "/hooks" },
    ]);
  });

  it("leaves out a path that is not in the manifest", () => {
    expect(
      findSectionRoutes([{ path: "/icons" }], ["/gone", "/icons"])
    ).toEqual([{ path: "/icons" }]);
  });

  it("links six sections by default", () => {
    const routes = SECTION_PATHS.map((path) => ({ path }));
    expect(findSectionRoutes(routes)).toHaveLength(6);
  });
});
