import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStableKeySet } from "./use-stable-key-set";

describe("useStableKeySet", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns undefined for undefined", () => {
    const { result } = renderHook(() => useStableKeySet(undefined));
    expect(result.current).toBeUndefined();
  });

  it("normalizes any iterable of keys to a set of strings", () => {
    const { result } = renderHook(() => useStableKeySet([1, "b"]));
    expect(result.current).toEqual(new Set(["1", "b"]));
  });

  it("keeps the previous set when new input holds the same keys", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useStableKeySet(keys),
      {
        initialProps: {
          keys: new Set<string | number>(["a", "b"]) as Iterable<
            string | number
          >,
        },
      }
    );
    const first = result.current;
    rerender({ keys: ["b", "a"] });
    expect(result.current).toBe(first);
  });

  it("returns a new set when a key changes", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useStableKeySet(keys),
      { initialProps: { keys: ["a"] as Iterable<string> | undefined } }
    );
    const first = result.current;
    rerender({ keys: ["b"] });
    expect(result.current).not.toBe(first);
    expect(result.current).toEqual(new Set(["b"]));
  });

  it("returns undefined after a set, and an empty set after undefined", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useStableKeySet(keys),
      { initialProps: { keys: ["a"] as Iterable<string> | undefined } }
    );
    rerender({ keys: undefined });
    expect(result.current).toBeUndefined();
    rerender({ keys: [] });
    expect(result.current).toEqual(new Set());
  });

  it("does not iterate the input again while its identity stays the same", () => {
    const keys = new Set(["a", "b"]);
    const { rerender } = renderHook(() => useStableKeySet(keys));
    const iterate = vi.spyOn(keys, Symbol.iterator);
    rerender();
    rerender();
    expect(iterate).not.toHaveBeenCalled();
  });

  it("warns once when equal keys arrive in a new object on every render", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(() => useStableKeySet(new Set(["a"])));
    for (let i = 0; i < 5; i++) rerender();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/useMemo/);
  });

  it("does not warn for a stable input", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const keys = new Set(["a"]);
    const { rerender } = renderHook(() => useStableKeySet(keys));
    for (let i = 0; i < 5; i++) rerender();
    expect(warn).not.toHaveBeenCalled();
  });
});
