import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useStableArray } from "./use-stable-array";

describe("useStableArray", () => {
  const a = { id: "a" };
  const b = { id: "b" };

  it("keeps the previous array when a new array holds the same items", () => {
    const first = [a, b];
    const { result, rerender } = renderHook(
      ({ items }) => useStableArray(items),
      {
        initialProps: { items: first },
      }
    );

    rerender({ items: [a, b] });

    expect(result.current).toBe(first);
  });

  it("returns the new array when an item is replaced", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useStableArray(items),
      {
        initialProps: { items: [a, b] },
      }
    );
    const next = [a, { id: "b" }];

    rerender({ items: next });

    expect(result.current).toBe(next);
  });

  it("returns the new array when the order changes", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useStableArray(items),
      {
        initialProps: { items: [a, b] },
      }
    );
    const next = [b, a];

    rerender({ items: next });

    expect(result.current).toBe(next);
  });

  it("returns the new array when the length changes", () => {
    const { result, rerender } = renderHook(
      ({ items }) => useStableArray(items),
      {
        initialProps: { items: [a, b] },
      }
    );
    const next = [a];

    rerender({ items: next });

    expect(result.current).toBe(next);
  });

  it("compares primitive items by value", () => {
    const first = ["name", "status"];
    const { result, rerender } = renderHook(
      ({ items }) => useStableArray(items),
      {
        initialProps: { items: first },
      }
    );

    rerender({ items: ["name", "status"] });

    expect(result.current).toBe(first);
  });

  it("passes undefined through", () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: string[] | undefined }) => useStableArray(items),
      { initialProps: { items: ["name"] as string[] | undefined } }
    );

    rerender({ items: undefined });

    expect(result.current).toBeUndefined();
  });
});
