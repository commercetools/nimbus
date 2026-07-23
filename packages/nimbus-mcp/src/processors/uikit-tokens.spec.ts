import { describe, it, expect } from "vitest";
import {
  cssPropertyToCamelCase,
  deriveCategory,
  buildUiKitTokenMap,
} from "./uikit-tokens.js";

describe("cssPropertyToCamelCase", () => {
  it("converts --constraint-7 to constraint7", () => {
    expect(cssPropertyToCamelCase("--constraint-7")).toBe("constraint7");
  });

  it("converts --spacing-xl to spacingXl", () => {
    expect(cssPropertyToCamelCase("--spacing-xl")).toBe("spacingXl");
  });

  it("converts --color-primary to colorPrimary", () => {
    expect(cssPropertyToCamelCase("--color-primary")).toBe("colorPrimary");
  });

  it("converts --font-size-30 to fontSize30", () => {
    expect(cssPropertyToCamelCase("--font-size-30")).toBe("fontSize30");
  });

  it("converts --background-color-for-input to backgroundColorForInput", () => {
    expect(cssPropertyToCamelCase("--background-color-for-input")).toBe(
      "backgroundColorForInput"
    );
  });

  it("converts --border-radius-4 to borderRadius4", () => {
    expect(cssPropertyToCamelCase("--border-radius-4")).toBe("borderRadius4");
  });

  it("converts --break-point-mobile to breakPointMobile", () => {
    expect(cssPropertyToCamelCase("--break-point-mobile")).toBe(
      "breakPointMobile"
    );
  });
});

describe("deriveCategory", () => {
  it("maps constraint* to size", () => {
    expect(deriveCategory("constraint7")).toBe("size");
    expect(deriveCategory("constraintScale")).toBe("size");
  });

  it("maps spacing* to spacing", () => {
    expect(deriveCategory("spacingXl")).toBe("spacing");
    expect(deriveCategory("spacing30")).toBe("spacing");
  });

  it("maps color* to color", () => {
    expect(deriveCategory("colorPrimary")).toBe("color");
    expect(deriveCategory("colorError95")).toBe("color");
  });

  it("maps fontSize* to fontSize", () => {
    expect(deriveCategory("fontSize30")).toBe("fontSize");
  });

  it("maps fontWeight* to fontWeight", () => {
    expect(deriveCategory("fontWeight500")).toBe("fontWeight");
  });

  it("maps lineHeight* to lineHeight", () => {
    expect(deriveCategory("lineHeight30")).toBe("lineHeight");
  });

  it("maps borderRadius* to borderRadius", () => {
    expect(deriveCategory("borderRadius4")).toBe("borderRadius");
  });

  it("maps borderWidth* to borderWidth", () => {
    expect(deriveCategory("borderWidth1")).toBe("borderWidth");
  });

  it("maps shadow* to shadow", () => {
    expect(deriveCategory("shadow1")).toBe("shadow");
  });

  it("maps backgroundColorFor* to color", () => {
    expect(deriveCategory("backgroundColorForInput")).toBe("color");
  });

  it("maps borderColorFor* to color", () => {
    expect(deriveCategory("borderColorForInput")).toBe("color");
  });

  it("maps fontColorFor* to color", () => {
    expect(deriveCategory("fontColorForInput")).toBe("color");
  });

  it("maps heightFor* to size", () => {
    expect(deriveCategory("heightForButtonAsBig")).toBe("size");
  });

  it("maps shadowFor* to shadow", () => {
    expect(deriveCategory("shadowForInput")).toBe("shadow");
  });

  it("maps borderRadiusFor* to borderRadius", () => {
    expect(deriveCategory("borderRadiusForInput")).toBe("borderRadius");
  });

  it("returns null for unrecognized prefixes", () => {
    expect(deriveCategory("breakPointMobile")).toBeNull();
    expect(deriveCategory("transitionStandard")).toBeNull();
    expect(deriveCategory("fontFamily")).toBeNull();
  });
});

describe("buildUiKitTokenMap", () => {
  it("builds a map from raw custom properties", () => {
    const input = {
      "--constraint-7": "342px",
      "--spacing-xl": "32px",
      "--color-primary": "hsl(240, 64%, 58%)",
    };

    const map = buildUiKitTokenMap(input);

    expect(map.constraint7).toEqual({
      cssValue: "342px",
      recommendedCategory: "size",
    });
    expect(map.spacingXl).toEqual({
      cssValue: "32px",
      recommendedCategory: "spacing",
    });
    expect(map.colorPrimary).toEqual({
      cssValue: "hsl(240, 64%, 58%)",
      recommendedCategory: "color",
    });
  });

  it("sets recommendedCategory to null for unknown prefixes", () => {
    const input = {
      "--break-point-mobile": "768px",
    };

    const map = buildUiKitTokenMap(input);

    expect(map.breakPointMobile).toEqual({
      cssValue: "768px",
      recommendedCategory: null,
    });
  });

  it("returns an empty map for empty input", () => {
    expect(buildUiKitTokenMap({})).toEqual({});
  });
});
