import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUnpinnedCollapseWarning } from "./use-unpinned-collapse-warning";

describe("useUnpinnedCollapseWarning", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns for the flexible layout without stickyHeader", () => {
    renderHook(() =>
      useUnpinnedCollapseWarning({
        collapseHeaderOnScroll: true,
        layout: "flexible",
      })
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("[Nimbus DefaultPage]");
    expect(warn.mock.calls[0][0]).toContain("stickyHeader");
  });

  it("does not warn for the flexible layout with stickyHeader", () => {
    renderHook(() =>
      useUnpinnedCollapseWarning({
        collapseHeaderOnScroll: true,
        layout: "flexible",
        stickyHeader: true,
      })
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn for the constrained layout", () => {
    renderHook(() =>
      useUnpinnedCollapseWarning({ collapseHeaderOnScroll: true })
    );
    renderHook(() =>
      useUnpinnedCollapseWarning({
        collapseHeaderOnScroll: true,
        layout: "constrained",
      })
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn when the option is off", () => {
    renderHook(() => useUnpinnedCollapseWarning({ layout: "flexible" }));
    renderHook(() =>
      useUnpinnedCollapseWarning({
        collapseHeaderOnScroll: false,
        layout: "flexible",
      })
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it("warns once, not on every render", () => {
    const { rerender } = renderHook(() =>
      useUnpinnedCollapseWarning({
        collapseHeaderOnScroll: true,
        layout: "flexible",
      })
    );
    rerender();
    rerender();

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("is silent in production builds", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      renderHook(() =>
        useUnpinnedCollapseWarning({
          collapseHeaderOnScroll: true,
          layout: "flexible",
        })
      );
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
