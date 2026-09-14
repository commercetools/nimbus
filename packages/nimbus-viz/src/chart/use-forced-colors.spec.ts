import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useForcedColors } from "./use-forced-colors";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useForcedColors", () => {
  it("returns false when matchMedia is unavailable (jsdom default)", () => {
    const { result } = renderHook(() => useForcedColors());
    expect(result.current).toBe(false);
  });

  it("reflects an active forced-colors context", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useForcedColors());
    expect(result.current).toBe(true);
  });
});
