import { describe, it, expect, vi, afterEach } from "vitest";
import { resolveSpacing } from "./resolve-spacing";

describe("resolveSpacing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns undefined when no value is given", () => {
    expect(resolveSpacing(undefined)).toBeUndefined();
  });

  it("keeps a number of pixels", () => {
    expect(resolveSpacing(12)).toBe(12);
    expect(resolveSpacing(0)).toBe(0);
  });

  it("resolves a spacing token key to pixels", () => {
    expect(resolveSpacing("100")).toBe(4);
    expect(resolveSpacing("200")).toBe(8);
    expect(resolveSpacing("25")).toBe(1);
  });

  it("warns in development and returns undefined for an unknown token", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error -- unknown tokens are a type error; this checks the runtime fallback
    expect(resolveSpacing("not-a-token")).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Unknown spacing token "not-a-token"')
    );
  });

  it("does not warn in production", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      // @ts-expect-error -- unknown tokens are a type error; this checks the runtime fallback
      expect(resolveSpacing("not-a-token")).toBeUndefined();
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
