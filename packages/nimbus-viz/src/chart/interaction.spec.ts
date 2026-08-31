import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useControlledSelection } from "./interaction";

describe("useControlledSelection", () => {
  it("manages its own state when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControlledSelection(undefined, onChange)
    );
    expect(result.current[0].size).toBe(0);
    act(() => result.current[1]("EU"));
    expect(result.current[0].has("EU")).toBe(true);
    act(() => result.current[1]("EU")); // toggle off
    expect(result.current[0].has("EU")).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("does not mutate local state when controlled, but still emits changes", () => {
    const onChange = vi.fn();
    const controlled = new Set(["US"]);
    const { result } = renderHook(() =>
      useControlledSelection(controlled, onChange)
    );
    expect(result.current[0]).toBe(controlled);
    act(() => result.current[1]("EU"));
    // controlled set is unchanged locally; parent is told the next value.
    expect(result.current[0]).toBe(controlled);
    expect(onChange).toHaveBeenCalledWith(new Set(["US", "EU"]));
  });
});
