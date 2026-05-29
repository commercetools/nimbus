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

  it("drops unknown ids and infers the partner from the first pane", () => {
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
    // oldAside ignored; nav (the first pane) is salvaged at 25, main inferred
    // as its complement (100 − 25). The stored main (70) is redundant.
    expect(result.current.defaultSizes).toEqual({ nav: 25, main: 75 });
  });

  it("keeps the first pane's stored value and infers the complement", () => {
    const storage = {
      load: () => ({ nav: 10, main: 10 }), // stored main is redundant
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    // nav 10 is a valid boundary; main is inferred as 90 (not a fallback).
    expect(result.current.defaultSizes).toEqual({ nav: 10, main: 90 });
  });

  it("falls back to initialSizes when the stored record is malformed", () => {
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
    // The non-numeric value makes the whole record invalid at read time, so
    // reconciliation never runs and initialSizes is used.
    expect(result.current.defaultSizes).toEqual({ nav: 40, main: 60 });
  });

  it("infers the missing partner from the stored first pane", () => {
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
    // nav stays 30 (its saved value); main inferred as the complement.
    expect(result.current.defaultSizes).toEqual({ nav: 30, main: 70 });
  });

  it("infers the first pane from the partner when only the partner is stored", () => {
    const storage = {
      load: () => ({ main: 70 }) as Record<string, number>, // nav missing
      save: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSplitterLayout({
        initialSizes: { nav: 40, main: 60 },
        storage,
      })
    );
    // nav absent → inferred as the complement of the salvaged main (100 − 70).
    expect(result.current.defaultSizes).toEqual({ nav: 30, main: 70 });
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
