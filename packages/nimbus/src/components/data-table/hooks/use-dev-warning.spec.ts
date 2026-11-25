import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDevWarning } from "./use-dev-warning";

describe("useDevWarning", () => {
  afterEach(() => vi.restoreAllMocks());

  it("warns once while the condition stays true", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(({ on }) => useDevWarning(on, "careful"), {
      initialProps: { on: true },
    });
    rerender({ on: false });
    rerender({ on: true });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("careful");
  });

  it("does not warn while the condition is false", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderHook(() => useDevWarning(false, "careful"));
    expect(warn).not.toHaveBeenCalled();
  });
});
