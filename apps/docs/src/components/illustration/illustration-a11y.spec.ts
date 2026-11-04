import { describe, expect, it } from "vitest";
import { illustrationA11yProps } from "./illustration-a11y";

describe("illustrationA11yProps", () => {
  it("hides a decorative illustration", () => {
    expect(illustrationA11yProps()).toEqual({ "aria-hidden": true });
  });

  it("hides an illustration with an empty alt", () => {
    expect(illustrationA11yProps("")).toEqual({ "aria-hidden": true });
  });

  it("names an illustration with alt as an image", () => {
    expect(illustrationA11yProps("Color swatches")).toEqual({
      role: "img",
      "aria-label": "Color swatches",
    });
  });
});
