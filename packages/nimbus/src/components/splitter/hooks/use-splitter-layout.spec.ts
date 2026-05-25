import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSplitterLayout } from "./use-splitter-layout";

describe("useSplitterLayout", () => {
  it("returns initialSizes when no storage is provided", () => {
    const { result } = renderHook(() =>
      useSplitterLayout({ initialSizes: { nav: 30, main: 70 } })
    );
    expect(result.current.defaultSizes).toEqual({ nav: 30, main: 70 });
  });

  it("reads synchronously from a custom storage adapter on first render", () => {
    const storage = {
      load: () => ({ nav: 25, main: 75 }),
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    expect(result.current.defaultSizes).toEqual({ nav: 25, main: 75 });
  });

  it("drops unknown ids from the stored value", () => {
    const storage = {
      load: () => ({ nav: 25, main: 70, oldAside: 5 }),
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    // oldAside dropped; remaining sums to 95, normalized within ±1% to 100.
    const { defaultSizes } = result.current;
    expect(Object.keys(defaultSizes).sort()).toEqual(["main", "nav"]);
    expect(defaultSizes.nav! + defaultSizes.main!).toBeCloseTo(100, 6);
  });

  it("falls back to initialSizes when stored sum is far from 100", () => {
    const storage = {
      load: () => ({ nav: 10, main: 10 }), // sum 20 — outside ±1%
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    expect(result.current.defaultSizes).toEqual({ nav: 40, main: 60 });
  });

  it("falls back to initialSizes when stored value is malformed", () => {
    const storage = {
      load: () => ({ nav: "thirty" as unknown as number, main: 70 }),
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    // nav was non-numeric → reconciler swapped in initialSizes[nav].
    expect(result.current.defaultSizes.nav).toBe(40);
  });

  it("fills in missing ids from initialSizes", () => {
    const storage = {
      load: () => ({ nav: 30 }) as Record<string, number>, // main missing
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    // main filled in to 60, then normalized to sum 100.
    const { defaultSizes } = result.current;
    expect(defaultSizes.nav).toBeCloseTo((30 / 90) * 100, 6);
    expect(defaultSizes.main).toBeCloseTo((60 / 90) * 100, 6);
  });

  it("debounces save() on onSizesChange", () => {
    vi.useFakeTimers();
    const save = vi.fn();
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 30, main: 70 },
        storage: { load: () => undefined, save },
        debounceMs: 50,
      })
    );

    act(() => {
      result.current.onSizesChange({ nav: 40, main: 60 });
      result.current.onSizesChange({ nav: 45, main: 55 });
      result.current.onSizesChange({ nav: 50, main: 50 });
    });
    expect(save).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith({ nav: 50, main: 50 });

    vi.useRealTimers();
  });

  it("getSizes returns the last cached onSizesChange value when ref not populated", () => {
    const { result } = renderHook(() =>
      useSplitterLayout({ initialSizes: { nav: 30, main: 70 } })
    );
    expect(result.current.getSizes()).toEqual({ nav: 30, main: 70 });
    act(() => {
      result.current.onSizesChange({ nav: 50, main: 50 });
    });
    expect(result.current.getSizes()).toEqual({ nav: 50, main: 50 });
  });

  it("imperative methods no-op safely when no Splitter is mounted", () => {
    const { result } = renderHook(() =>
      useSplitterLayout({ initialSizes: { nav: 30, main: 70 } })
    );
    expect(() => result.current.collapse("nav")).not.toThrow();
    expect(() => result.current.expand("nav")).not.toThrow();
    expect(result.current.isCollapsed("nav")).toBe(false);
  });
});
