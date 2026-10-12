import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useVirtualizerOptionsWarning } from "./use-virtualizer-options-warning";

const run = (isVirtualized: boolean, hasVirtualizerOptions: boolean) =>
  renderHook(() =>
    useVirtualizerOptionsWarning({
      componentName: "ListBox.Root",
      isVirtualized,
      hasVirtualizerOptions,
    })
  );

describe("useVirtualizerOptionsWarning", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns once when options are passed without isVirtualized", () => {
    run(false, true);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("[Nimbus Virtualizer]");
    expect(warn.mock.calls[0][0]).toContain(
      "ListBox.Root received virtualizerOptions without isVirtualized"
    );
  });

  it("does not warn when the collection is virtualized", () => {
    run(true, true);

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn without options", () => {
    run(false, false);

    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      run(false, true);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
