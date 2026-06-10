import { describe, it, expect } from "vitest";
import { themeTokens } from "@commercetools/nimbus-tokens";
import {
  SPLITTER_SIZE_TOKENS,
  isSplitterSizeToken,
  resolveTokenToPx,
} from "./size-tokens";

describe("SPLITTER_SIZE_TOKENS", () => {
  // Guard: a token rename/removal in the design tokens becomes a red build here,
  // rather than a silent runtime miss in the hook.
  it("every curated token exists in themeTokens.size with a finite px value", () => {
    const size = themeTokens.size as Record<
      string,
      { value: string } | undefined
    >;
    for (const token of SPLITTER_SIZE_TOKENS) {
      const entry = size[token];
      expect(entry, `missing size token: ${token}`).toBeDefined();
      expect(Number.isFinite(parseFloat(entry!.value))).toBe(true);
    }
  });
});

describe("isSplitterSizeToken", () => {
  it("accepts curated tokens and rejects everything else", () => {
    expect(isSplitterSizeToken("md")).toBe(true);
    expect(isSplitterSizeToken("breakpoint-lg")).toBe(true);
    expect(isSplitterSizeToken("9600")).toBe(false); // numeric scale excluded
    expect(isSplitterSizeToken("nope")).toBe(false);
    expect(isSplitterSizeToken(320)).toBe(false);
  });
});

describe("resolveTokenToPx", () => {
  it("resolves known tokens to their pixel values", () => {
    expect(resolveTokenToPx("md")).toBe(448);
    expect(resolveTokenToPx("3xs")).toBe(224);
    expect(resolveTokenToPx("breakpoint-sm")).toBe(480);
    expect(resolveTokenToPx("breakpoint-2xl")).toBe(1536);
  });
});
