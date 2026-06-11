import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSplitterState } from "./use-splitter-state";
import type { ResolvedAsideConfig } from "../splitter.types";

const config = (
  over: Partial<ResolvedAsideConfig> = {}
): ResolvedAsideConfig => ({
  minSize: 0,
  maxSize: 100,
  collapsible: false,
  collapsedSize: 0,
  ...over,
});

const base = {
  orientation: "horizontal" as const,
  keyboardStep: 5,
  isDoubleClickDisabled: false,
  isDisabled: false,
};

/**
 * Regression guard: the size state must be seeded synchronously from props so
 * the FIRST render is already correct — no 50/50 flash before an effect runs.
 * These assertions read `result.current.size` immediately after the initial
 * render, before any pane has registered.
 */
describe("useSplitterState — synchronous first-render size", () => {
  it("seeds the uncontrolled defaultSize on the first render", () => {
    const { result } = renderHook(() =>
      useSplitterState({ ...base, defaultSize: 30, asideConfig: config() })
    );
    expect(result.current.size).toBe(30);
  });

  it("falls back to 50 when no size is configured", () => {
    const { result } = renderHook(() =>
      useSplitterState({ ...base, asideConfig: config() })
    );
    expect(result.current.size).toBe(50);
  });

  it("seeds the controlled size on the first render", () => {
    const { result } = renderHook(() =>
      useSplitterState({ ...base, size: 25, asideConfig: config() })
    );
    expect(result.current.size).toBe(25);
  });

  it("normalizes an out-of-range size on the first render", () => {
    const { result } = renderHook(() =>
      useSplitterState({ ...base, defaultSize: 150, asideConfig: config() })
    );
    expect(result.current.size).toBe(100);
  });

  it("shows the collapsed size on the first render when initially collapsed", () => {
    const { result } = renderHook(() =>
      useSplitterState({
        ...base,
        defaultSize: 30,
        defaultCollapsed: true,
        asideConfig: config({ collapsible: true, collapsedSize: 6 }),
      })
    );
    expect(result.current.size).toBe(6);
    expect(result.current.collapsed).toBe(true);
  });

  it("ignores initial collapse when the aside is not collapsible", () => {
    const { result } = renderHook(() =>
      useSplitterState({
        ...base,
        defaultSize: 30,
        defaultCollapsed: true,
        asideConfig: config({ collapsible: false, collapsedSize: 6 }),
      })
    );
    // Not collapsible → the collapse is ignored, the configured size shows.
    expect(result.current.size).toBe(30);
  });
});
