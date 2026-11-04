import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { warnCollapseHeaderOnScroll } from "./warn-collapse-header-on-scroll";

describe("warnCollapseHeaderOnScroll", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns in development when the option is set without a pinned header", () => {
    warnCollapseHeaderOnScroll({
      collapseHeaderOnScroll: true,
      layout: "flexible",
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("collapseHeaderOnScroll");
    expect(warn.mock.calls[0][0]).toContain("stickyHeader");
  });

  it("does not warn when the header is pinned", () => {
    warnCollapseHeaderOnScroll({
      collapseHeaderOnScroll: true,
      layout: "flexible",
      stickyHeader: true,
    });
    warnCollapseHeaderOnScroll({
      collapseHeaderOnScroll: true,
      layout: "constrained",
    });

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn in production", () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      warnCollapseHeaderOnScroll({
        collapseHeaderOnScroll: true,
        layout: "flexible",
      });
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
