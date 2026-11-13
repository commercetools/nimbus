import { describe, expect, it } from "vitest";
import { scopeIllustrationIds } from "./scope-illustration-ids";

const svg =
  '<svg><defs><linearGradient id="il-button-bg"/></defs><rect fill="url(#il-button-bg)" filter="url(#il-button-shadow)"/></svg>';

describe("scopeIllustrationIds", () => {
  it("gives each instance its own ids and keeps references in sync", () => {
    const first = scopeIllustrationIds(svg, "button", ":r1:");
    const second = scopeIllustrationIds(svg, "button", ":r2:");
    expect(first).toContain('id="il-button-r1-bg"');
    expect(first).toContain("url(#il-button-r1-bg)");
    expect(first).toContain("url(#il-button-r1-shadow)");
    expect(second).toContain('id="il-button-r2-bg"');
    expect(first).not.toContain("r2");
  });

  it("only uses characters that are safe in a url(#id) reference", () => {
    expect(scopeIllustrationIds(svg, "button", "«r:1»")).toContain(
      "url(#il-button-r1-bg)"
    );
  });
});
