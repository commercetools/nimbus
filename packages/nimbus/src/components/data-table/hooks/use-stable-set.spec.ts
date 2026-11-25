import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStableSet } from "./use-stable-set";

describe("useStableSet", () => {
  it("keeps the previous set when a new set holds the same keys", () => {
    const first = new Set(["a", "b"]);
    const { result, rerender } = renderHook(({ keys }) => useStableSet(keys), {
      initialProps: { keys: first as Set<string> | undefined },
    });

    rerender({ keys: new Set(["b", "a"]) });

    expect(result.current).toBe(first);
  });

  it("returns the new set when a key changes", () => {
    const { result, rerender } = renderHook(({ keys }) => useStableSet(keys), {
      initialProps: { keys: new Set(["a"]) as Set<string> | undefined },
    });
    const next = new Set(["b"]);

    rerender({ keys: next });

    expect(result.current).toBe(next);
  });

  it("returns undefined after a set", () => {
    const { result, rerender } = renderHook(({ keys }) => useStableSet(keys), {
      initialProps: { keys: new Set(["a"]) as Set<string> | undefined },
    });

    rerender({ keys: undefined });

    expect(result.current).toBeUndefined();
  });

  it("returns an empty set after undefined", () => {
    const { result, rerender } = renderHook(({ keys }) => useStableSet(keys), {
      initialProps: { keys: undefined as Set<string> | undefined },
    });
    const empty = new Set<string>();

    rerender({ keys: empty });

    expect(result.current).toBe(empty);
  });
});
