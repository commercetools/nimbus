import { describe, expect, it } from "vitest";
import { menuToPath, sluggify } from "./sluggify.js";

describe("sluggify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(sluggify("Data Display")).toBe("data-display");
  });

  it("removes special characters", () => {
    expect(sluggify("Hello, World!")).toBe("hello-world");
  });
});

describe("menuToPath", () => {
  it("joins the slugs of all menu items", () => {
    expect(menuToPath(["Components", "Buttons", "Icon button"])).toBe(
      "components/buttons/icon-button"
    );
  });

  it("separates the words of a PascalCase label like a spaced label", () => {
    expect(menuToPath(["Components", "Buttons", "IconButton"])).toBe(
      menuToPath(["Components", "Buttons", "Icon button"])
    );
    expect(menuToPath(["Components", "Inputs", "ComboBox"])).toBe(
      "components/inputs/combo-box"
    );
  });

  it("keeps acronyms and digits inside a word together", () => {
    expect(menuToPath(["Components", "NimbusI18nProvider"])).toBe(
      "components/nimbus-i18n-provider"
    );
  });
});
