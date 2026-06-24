import { describe, it, expect } from "vitest";
import { isExternalUrl } from "./is-external-url";

describe("markdown utils — isExternalUrl", () => {
  it("treats absolute http(s) and protocol-relative URLs as external", () => {
    expect(isExternalUrl("https://example.com")).toBe(true);
    expect(isExternalUrl("http://example.com")).toBe(true);
    expect(isExternalUrl("//cdn.example.com/x")).toBe(true);
  });
  it("treats relative and in-page links as internal", () => {
    expect(isExternalUrl("/docs")).toBe(false);
    expect(isExternalUrl("#section")).toBe(false);
    expect(isExternalUrl("mailto:a@b.com")).toBe(false);
    expect(isExternalUrl(undefined)).toBe(false);
  });
});
