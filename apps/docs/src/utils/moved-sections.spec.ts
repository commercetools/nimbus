import { describe, expect, it } from "vitest";
import { findMovedSectionPath } from "./moved-sections";

describe("findMovedSectionPath", () => {
  it("moves the design tokens section and keeps the rest of the path", () => {
    expect(findMovedSectionPath("home/design-tokens")).toBe(
      "/foundations/design-tokens"
    );
    expect(findMovedSectionPath("home/design-tokens/colors")).toBe(
      "/foundations/design-tokens/colors"
    );
    expect(findMovedSectionPath("home/design-tokens/other/blurs")).toBe(
      "/foundations/design-tokens/other/blurs"
    );
  });

  it("moves the style props section", () => {
    expect(findMovedSectionPath("home/style-props/spacing")).toBe(
      "/foundations/style-props/spacing"
    );
  });

  it("moves the Contribute section to the top level", () => {
    expect(findMovedSectionPath("home/contribute")).toBe("/contribute");
    expect(findMovedSectionPath("home/contribute/adrs")).toBe(
      "/contribute/adrs"
    );
  });

  it("moves single pages to Contribute", () => {
    expect(findMovedSectionPath("home/getting-started/collaboration")).toBe(
      "/contribute/collaboration"
    );
    expect(findMovedSectionPath("home/getting-started/release-process")).toBe(
      "/contribute/release-process"
    );
  });

  it("does not match a prefix that only looks the same", () => {
    expect(findMovedSectionPath("home/style-props-extra")).toBeUndefined();
    expect(findMovedSectionPath("home/getting-started/installation")).toBe(
      undefined
    );
  });
});
