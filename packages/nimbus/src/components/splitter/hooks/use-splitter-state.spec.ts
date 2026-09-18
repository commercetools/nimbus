import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
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

/**
 * Regression for #1648: a collapsed-on-mount aside must follow a `collapsedSize`
 * that resolves *after* the first render (e.g. `useResponsiveSplitterSizes`
 * converting a pixel/token value once the container is measured). The collapse
 * effect only reconciles on a collapse transition, so a late `collapsedSize`
 * change while already collapsed needs its own reconcile.
 */
describe("useSplitterState — late collapsedSize while already collapsed", () => {
  it("follows a collapsedSize that resolves after the first render", () => {
    const onSizeChange = vi.fn();
    const onSizeChangeEnd = vi.fn();
    const { result, rerender } = renderHook(
      (collapsedSize: number) =>
        useSplitterState({
          ...base,
          defaultSize: 30,
          defaultCollapsed: true,
          asideConfig: config({ collapsible: true, collapsedSize }),
          onSizeChange,
          onSizeChangeEnd,
        }),
      { initialProps: 0 }
    );

    // Collapsed on mount with an unresolved (0%) collapsedSize.
    expect(result.current.size).toBe(0);
    expect(result.current.collapsed).toBe(true);

    // Both panes register (the reconcile effect waits for this).
    act(() => {
      result.current.registerPane("aside", "aside-id");
      result.current.registerPane("main", "main-id");
    });

    // collapsedSize resolves to 23% — the aside must follow it.
    rerender(23);
    expect(result.current.size).toBe(23);
    expect(result.current.collapsed).toBe(true);

    // Collapse is signalled via onCollapsedChange, not the size channels.
    expect(onSizeChange).not.toHaveBeenCalled();
    expect(onSizeChangeEnd).not.toHaveBeenCalled();
  });

  it("ignores a collapsedSize change while the aside is expanded", () => {
    const { result, rerender } = renderHook(
      (collapsedSize: number) =>
        useSplitterState({
          ...base,
          defaultSize: 30,
          asideConfig: config({ collapsible: true, collapsedSize }),
        }),
      { initialProps: 0 }
    );

    act(() => {
      result.current.registerPane("aside", "aside-id");
      result.current.registerPane("main", "main-id");
    });

    // Not collapsed → a collapsedSize change must not touch the live size.
    rerender(23);
    expect(result.current.size).toBe(30);
    expect(result.current.collapsed).toBe(false);
  });
});
