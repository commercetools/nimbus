import { describe, expect, it } from "vitest";
import { resolveMovedRoute, routePathToSlug } from "./route.js";

describe("resolveMovedRoute", () => {
  it("maps old routes of moved sections to the new routes", () => {
    expect(resolveMovedRoute("home/style-props")).toBe(
      "foundations/style-props"
    );
    expect(resolveMovedRoute("/home/design-tokens/colors/")).toBe(
      "foundations/design-tokens/colors"
    );
    expect(resolveMovedRoute("home/contribute/adrs")).toBe("contribute/adrs");
    expect(resolveMovedRoute("home/getting-started/collaboration")).toBe(
      "contribute/collaboration"
    );
  });

  it("keeps routes that did not move", () => {
    expect(resolveMovedRoute("/components/inputs/button/")).toBe(
      "components/inputs/button"
    );
    expect(resolveMovedRoute("foundations/style-props")).toBe(
      "foundations/style-props"
    );
  });
});

describe("routePathToSlug", () => {
  it("gives the same slug for the old and the new route", () => {
    expect(routePathToSlug("home/style-props/spacing")).toBe(
      "foundations-style-props-spacing"
    );
    expect(routePathToSlug("foundations/style-props/spacing")).toBe(
      "foundations-style-props-spacing"
    );
  });
});
