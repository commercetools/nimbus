import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useHeadingSkipWarning } from "./use-heading-skip-warning";

describe("useHeadingSkipWarning", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns when a heading level is skipped (h1 → h3)", () => {
    renderHook(() => useHeadingSkipWarning("# Title\n\n### Subsection"));

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("h1 → h3");
    expect(warn.mock.calls[0][0]).toContain("[Nimbus Markdown]");
  });

  it("emits one warning per skip when several occur", () => {
    renderHook(() =>
      useHeadingSkipWarning("# A\n\n### B\n\n#### C\n\n###### D")
    );

    // Skips: h1→h3 and h4→h6 (h3→h4 is a valid single step).
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0][0]).toContain("h1 → h3");
    expect(warn.mock.calls[1][0]).toContain("h4 → h6");
  });

  it("does not warn for a well-formed heading outline", () => {
    renderHook(() =>
      useHeadingSkipWarning("# A\n\n## B\n\n### C\n\nBody text.")
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn when there are no headings", () => {
    renderHook(() => useHeadingSkipWarning("Just a paragraph with **bold**."));

    expect(warn).not.toHaveBeenCalled();
  });

  it("is silent in production regardless of skips", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      renderHook(() => useHeadingSkipWarning("# Title\n\n### Subsection"));
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
