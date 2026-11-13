import { designTokens } from "@commercetools/nimbus-tokens";
import { describe, expect, it } from "vitest";
import { defineIllustration, renderIllustration } from "./index";
import { ROLES } from "./roles";
import { RADII, SHADOW, fallbackColor } from "./tokens";

describe("illustration kit tokens", () => {
  it("uses Nimbus radius tokens divided by 4", () => {
    expect(RADII).toEqual({
      "50": 0.5,
      "100": 1,
      "150": 1.5,
      "200": 2,
      "300": 3,
      "400": 4,
    });
    for (const [token, value] of Object.entries(RADII)) {
      const px = parseFloat(
        designTokens.borderRadius[token as keyof typeof RADII]
      );
      expect(value * 4).toBe(px);
    }
  });

  it("matches the Nimbus shadow.3 token at 2.5px per unit", () => {
    // 0 4px 12px 0 hsla(0, 0%, 0%, 0.1): the blur is twice the deviation
    expect(designTokens.shadow["3"]).toBe("0 4px 12px 0 hsla(0, 0%, 0%, 0.1)");
    expect(SHADOW.dy * 2.5).toBe(4);
    expect(SHADOW.blur * 2 * 2.5).toBe(12);
    expect(SHADOW.light).toBe(0.1);
  });

  it("falls back to the ctviolet palette", () => {
    const violet = designTokens.color["brand-palettes"].ctviolet;
    expect(fallbackColor(9, "light")).toBe(violet.light["9"]);
    expect(fallbackColor(3, "dark")).toBe(violet.dark["3"]);
    expect(fallbackColor("contrast", "light")).toBe(violet.light.contrast);
    expect(ROLES.strong).toBe(
      `var(--nimbus-colors-color-palette-9, ${violet.light["9"]})`
    );
  });

  it("uses light-dark() only for roles that change per color mode", () => {
    expect(ROLES.surface).toContain("light-dark(");
    expect(ROLES.strong).not.toContain("light-dark(");
  });
});

describe("renderIllustration", () => {
  const definition = defineIllustration({
    name: "sample",
    draw: ({ panel, pill }) => [
      panel({ x: 24, y: 40, w: 48, h: 16, radius: "200", tone: "strong" }),
      pill({ x: 36, y: 46.5, w: 24, fill: "onStrong" }),
    ],
  });

  it("is deterministic and ends with a newline", () => {
    const first = renderIllustration(definition);
    expect(renderIllustration(definition)).toBe(first);
    expect(first.endsWith("</svg>\n")).toBe(true);
  });

  it("prefixes ids with il-<name>-", () => {
    const svg = renderIllustration(definition);
    expect(svg).toContain('id="il-sample-bg"');
    expect(svg).toContain('id="il-sample-shadow"');
  });

  it("keeps drawings independent of each other", () => {
    const other = defineIllustration({ name: "other", draw: () => [] });
    expect(renderIllustration(other)).not.toContain("il-sample-");
  });
});
