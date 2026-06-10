import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useResponsiveSplitterSizes } from "./use-responsive-splitter-sizes";
import type { SplitterSizesStorage } from "../splitter.types";

// --- Controllable ResizeObserver -------------------------------------------
type ROCallback = (entries: Array<{ contentRect: DOMRectReadOnly }>) => void;
const observers: Array<{ cb: ROCallback; node: Element | null }> = [];

class ControllableResizeObserver {
  cb: ROCallback;
  node: Element | null = null;
  constructor(cb: ROCallback) {
    this.cb = cb;
    observers.push(this);
  }
  observe(node: Element) {
    this.node = node;
  }
  unobserve() {}
  disconnect() {
    this.node = null;
  }
}

/** Fire a measurement on every active observer (the hook keeps a single one). */
const fireResize = (width: number, height = 600) => {
  act(() => {
    for (const o of observers) {
      if (o.node) {
        o.cb([{ contentRect: { width, height } as DOMRectReadOnly }]);
      }
    }
  });
};

/** Render the hook and attach its ref to a detached node. */
const mountHook = (
  options: Parameters<typeof useResponsiveSplitterSizes>[0]
) => {
  const view = renderHook((o) => useResponsiveSplitterSizes(o), {
    initialProps: options,
  });
  const node = document.createElement("div");
  act(() => {
    (view.result.current.rootProps.ref as (n: HTMLDivElement | null) => void)(
      node
    );
  });
  return view;
};

const memoryStorage = (): SplitterSizesStorage & {
  dump: Record<string, string>;
} => {
  const dump: Record<string, string> = {};
  return {
    dump,
    getItem: (k) => dump[k] ?? null,
    setItem: (k, v) => {
      dump[k] = v;
    },
  };
};

let originalRO: typeof ResizeObserver;
beforeEach(() => {
  observers.length = 0;
  originalRO = globalThis.ResizeObserver;
  globalThis.ResizeObserver =
    ControllableResizeObserver as unknown as typeof ResizeObserver;
});
afterEach(() => {
  globalThis.ResizeObserver = originalRO;
  vi.restoreAllMocks();
});

describe("useResponsiveSplitterSizes", () => {
  it("resolves a single percent value synchronously, before measurement", () => {
    const view = renderHook(() => useResponsiveSplitterSizes({ size: "30%" }));
    expect(view.result.current.rootProps.size).toBe(30);
  });

  it("converts a pixel value to a percentage of the measured container", () => {
    const view = mountHook({ size: 320 });
    // No measurement yet → size omitted (component stays uncontrolled).
    expect(view.result.current.rootProps.size).toBeUndefined();
    fireResize(1000);
    expect(view.result.current.rootProps.size).toBe(32);
    fireResize(800);
    expect(view.result.current.rootProps.size).toBe(40);
  });

  it("selects the active band by container width", () => {
    const view = mountHook({
      size: { 0: 320, 768: "30%" },
    });
    fireResize(640); // below 768 → 320px / 640 = 50%
    expect(view.result.current.rootProps.size).toBe(50);
    fireResize(1000); // at/above 768 → 30%
    expect(view.result.current.rootProps.size).toBe(30);
  });

  it("forwards minSize/maxSize/collapsedSize as percentages and clamps size", () => {
    const view = mountHook({
      size: 100, // 100px
      minSize: 200, // 200px
      maxSize: 600, // 600px
      collapsedSize: 0,
    });
    fireResize(1000);
    // minSize 20%, maxSize 60%, collapsedSize 0%; raw size 10% clamped up to 20%.
    expect(view.result.current.rootProps.minSize).toBe(20);
    expect(view.result.current.rootProps.maxSize).toBe(60);
    expect(view.result.current.rootProps.collapsedSize).toBe(0);
    expect(view.result.current.rootProps.size).toBe(20);
  });

  it("does not thrash the emitted size on sub-tolerance resize ticks", () => {
    const view = mountHook({ size: 320 });
    fireResize(1000);
    const first = view.result.current.rootProps.size;
    expect(first).toBe(32);
    // 320/1001 ≈ 31.97% — within EMIT_TOLERANCE of 32, so size holds steady.
    fireResize(1001);
    expect(view.result.current.rootProps.size).toBe(first);
    // A clearly larger change does move it.
    fireResize(1280); // 320/1280 = 25%
    expect(view.result.current.rootProps.size).toBe(25);
  });

  it("persists a settled drag in pixels and restores it across a remount + resize", () => {
    const storage = memoryStorage();
    const view = mountHook({
      size: 320,
      persistKey: "k",
      storage,
    });
    fireResize(1000);
    // User drags and releases at 28% (≈280px in a 1000px container).
    act(() => view.result.current.rootProps.onSizeChangeEnd(28));
    expect(view.result.current.rootProps.size).toBe(28); // fed back, no snap-back
    expect(storage.dump.k).toContain('"unit":"px"');

    // Remount into an 800px container — the 280px pin re-converts to 35%.
    const remount = mountHook({
      size: 320,
      persistKey: "k",
      storage,
    });
    fireResize(800);
    expect(remount.result.current.rootProps.size).toBeCloseTo(35);
  });

  it("does not persist a collapse-driven settle", () => {
    const storage = memoryStorage();
    const view = mountHook({
      size: 320,
      collapsedSize: 0,
      persistKey: "k",
      storage,
    });
    fireResize(1000);
    act(() => view.result.current.rootProps.onSizeChangeEnd(32)); // real settle
    const afterReal = storage.dump.k;
    expect(afterReal).toBeDefined();

    // Collapse: onCollapsedChange(true) fires before the collapse settle.
    act(() => view.result.current.rootProps.onCollapsedChange(true));
    act(() => view.result.current.rootProps.onSizeChangeEnd(0)); // collapsed size
    // Storage unchanged — the collapsed value was not persisted.
    expect(storage.dump.k).toBe(afterReal);
  });

  it("calls the optional onCollapsedChange passthrough", () => {
    const onCollapsedChange = vi.fn();
    const view = mountHook({
      size: "30%",
      onCollapsedChange,
    });
    act(() => view.result.current.rootProps.onCollapsedChange(true));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it("degrades without ResizeObserver: percent config still resolves", () => {
    globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
    const view = mountHook({ size: "40%" });
    expect(view.result.current.rootProps.size).toBe(40);
  });

  it("tolerates a throwing storage on write", () => {
    const storage: SplitterSizesStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
    };
    const view = mountHook({
      size: 320,
      persistKey: "k",
      storage,
    });
    fireResize(1000);
    expect(() =>
      act(() => view.result.current.rootProps.onSizeChangeEnd(30))
    ).not.toThrow();
    expect(view.result.current.rootProps.size).toBe(30);
  });
});
