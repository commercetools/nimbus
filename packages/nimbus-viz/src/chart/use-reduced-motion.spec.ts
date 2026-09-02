import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion, MOTION } from "./use-reduced-motion";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useReducedMotion", () => {
  it("returns false when matchMedia is unavailable (jsdom default)", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("reflects a reduce preference when matchMedia reports it", () => {
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe("MOTION tokens", () => {
  it("exposes positive durations and easing strings", () => {
    expect(MOTION.duration.base).toBeGreaterThan(0);
    expect(MOTION.duration.fast).toBeLessThan(MOTION.duration.slow);
    expect(typeof MOTION.easing.standard).toBe("string");
  });
});
