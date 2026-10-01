import { describe, it, expect } from "vitest";
import { system } from "../index";

describe("foreground semantic color tokens", () => {
  it("resolves fg to a CSS variable", () => {
    expect(system.token("colors.fg")).toBe("var(--nimbus-colors-fg)");
  });

  it("resolves fg.subtle to its own CSS variable", () => {
    expect(system.token("colors.fg.subtle")).toBe(
      "var(--nimbus-colors-fg-subtle)"
    );
  });

  it("emits valid CSS for color='fg.subtle'", () => {
    // An undefined token is passed through as the raw string, which is not
    // valid CSS, so the browser drops it and the parent color shows instead.
    expect(system.css({ color: "fg.subtle" })).toEqual({
      color: "var(--nimbus-colors-fg-subtle)",
    });
  });

  it("maps fg.subtle to neutral.11", () => {
    expect(system.tokens.getByName("colors.fg.subtle")?.originalValue).toBe(
      "{colors.neutral.11}"
    );
  });
});
