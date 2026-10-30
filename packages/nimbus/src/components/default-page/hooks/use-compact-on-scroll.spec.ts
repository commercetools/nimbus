import { afterEach, describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  OBSERVER_THRESHOLDS,
  nextPhase,
  parseStickyHeader,
  useCompactOnScroll,
  type SentinelBox,
} from "./use-compact-on-scroll";

const view = (top: number, bottom: number): SentinelBox => ({
  top,
  bottom,
  rootTop: 0,
  rootBottom: 700,
});

describe("nextPhase", () => {
  it("compacts only after the sentinel has left through the top", () => {
    expect(nextPhase("idle", view(-200, -10))).toBe("compact");
    expect(nextPhase("compact", view(-200, 0))).toBe("compact");
  });

  it("stays full when the sentinel is still below the viewport", () => {
    expect(nextPhase("idle", view(1500, 1657))).toBe("idle");
    expect(nextPhase("compact", view(1500, 1657))).toBe("idle");
  });

  it("restores when the top edge is back, even if most of the box is clipped", () => {
    expect(nextPhase("compact", view(0, 157))).toBe("idle");
    expect(nextPhase("compact", view(40, 509))).toBe("idle");
  });

  it("holds the previous phase while the sentinel is only partly past the top", () => {
    const partial = view(-40, 117);
    expect(nextPhase("idle", partial)).toBe("idle");
    expect(nextPhase("compact", partial)).toBe("compact");
  });

  it("holds when the viewport bounds are missing", () => {
    expect(nextPhase("compact", null)).toBe("compact");
    expect(nextPhase("idle", null)).toBe("idle");
  });

  it("returns the same phase when called twice with the same box", () => {
    for (const prev of ["idle", "compact"] as const) {
      for (const box of [view(-200, -10), view(-40, 117), view(0, 157), null]) {
        const once = nextPhase(prev, box);
        expect(nextPhase(once, box)).toBe(once);
      }
    }
  });
});

describe("parseStickyHeader", () => {
  it("decodes compact-on-scroll in flexible layout", () => {
    expect(parseStickyHeader("flexible", "compact-on-scroll")).toEqual({
      sticky: true,
      compactOnScroll: true,
    });
  });

  it("ignores compact-on-scroll without flexible layout", () => {
    const off = { sticky: false, compactOnScroll: false };
    expect(parseStickyHeader("constrained", "compact-on-scroll")).toEqual(off);
    expect(parseStickyHeader(undefined, "compact-on-scroll")).toEqual(off);
  });

  it("decodes booleans", () => {
    expect(parseStickyHeader("flexible", true)).toEqual({
      sticky: true,
      compactOnScroll: false,
    });
    expect(parseStickyHeader("flexible", false)).toEqual({
      sticky: false,
      compactOnScroll: false,
    });
  });

  it("decodes an absent prop", () => {
    expect(parseStickyHeader(undefined, undefined)).toEqual({
      sticky: false,
      compactOnScroll: false,
    });
    expect(parseStickyHeader("flexible", undefined)).toEqual({
      sticky: false,
      compactOnScroll: false,
    });
  });
});

describe("useCompactOnScroll", () => {
  const originalObserver = globalThis.IntersectionObserver;

  afterEach(() => {
    globalThis.IntersectionObserver = originalObserver;
  });

  const stubObserver = () => {
    type FakeObserver = {
      options: IntersectionObserverInit | undefined;
      callback: IntersectionObserverCallback;
      observe: ReturnType<typeof vi.fn>;
      disconnect: ReturnType<typeof vi.fn>;
    };
    const instances: FakeObserver[] = [];
    globalThis.IntersectionObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(
        public callback: IntersectionObserverCallback,
        public options?: IntersectionObserverInit
      ) {
        instances.push(this as unknown as FakeObserver);
      }
    } as unknown as typeof IntersectionObserver;
    return instances;
  };

  const renderWithSentinel = (enabled: boolean) =>
    renderHook(
      ({ enabled }) => {
        const result = useCompactOnScroll(enabled);
        result.sentinelRef.current ??= document.createElement("div");
        return result;
      },
      { initialProps: { enabled } }
    );

  const emit = (
    observer: {
      callback: IntersectionObserverCallback;
    },
    box: { top: number; bottom: number } | null
  ) =>
    act(() =>
      observer.callback(
        [
          {
            boundingClientRect: box ?? { top: 0, bottom: 0 },
            rootBounds: box ? { top: 0, bottom: 700 } : null,
          } as IntersectionObserverEntry,
        ],
        observer as unknown as IntersectionObserver
      )
    );

  it("does not observe when disabled", () => {
    const instances = stubObserver();
    const { result } = renderWithSentinel(false);

    expect(instances).toHaveLength(0);
    expect(result.current.phase).toBe("idle");
  });

  it("observes the sentinel against the viewport at steps fine enough for a clipped box", () => {
    const instances = stubObserver();
    renderWithSentinel(true);

    const observer = instances[0];
    const thresholds = observer.options?.threshold;
    expect(observer.observe).toHaveBeenCalledTimes(1);
    expect(observer.options?.root).toBeNull();
    expect(thresholds).toEqual(OBSERVER_THRESHOLDS);
    expect(Array.isArray(thresholds) && thresholds[0]).toBe(0);
    expect(Array.isArray(thresholds) && thresholds.at(-1)).toBe(1);
    expect(Array.isArray(thresholds) && thresholds.length).toBeGreaterThan(50);
  });

  it("follows the sentinel edges and disconnects on cleanup", () => {
    const instances = stubObserver();
    const { result, unmount } = renderWithSentinel(true);
    const observer = instances[0];

    emit(observer, { top: -200, bottom: -10 });
    expect(result.current.phase).toBe("compact");
    emit(observer, { top: -40, bottom: 117 });
    expect(result.current.phase).toBe("compact");
    emit(observer, { top: 0, bottom: 157 });
    expect(result.current.phase).toBe("idle");

    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("forgets a compact phase when the feature is turned off", () => {
    const instances = stubObserver();
    const { result, rerender } = renderWithSentinel(true);

    emit(instances[0], { top: -200, bottom: -10 });
    expect(result.current.phase).toBe("compact");

    rerender({ enabled: false });
    expect(result.current.phase).toBe("idle");
  });
});
