import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  COLLAPSE_HEADER_PAUSE_MS,
  useCollapseHeaderOnScroll,
} from "./use-collapse-header-on-scroll";

type Observed = { node: Element; options?: ResizeObserverOptions };
const observers: Array<{
  callback: ResizeObserverCallback;
  observed: Observed[];
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

class ControllableResizeObserver {
  callback: ResizeObserverCallback;
  observed: Observed[] = [];
  disconnect = vi.fn(() => {
    this.observed = [];
  });

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }

  observe(node: Element, options?: ResizeObserverOptions) {
    this.observed.push({ node, options });
  }

  unobserve() {}
}

const setRect = (
  element: HTMLElement,
  rect: Pick<DOMRect, "top" | "bottom" | "height">
) => {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: rect.top,
    width: 400,
    height: rect.height,
    top: rect.top,
    right: 400,
    bottom: rect.bottom,
    left: 0,
    toJSON: () => ({}),
  } as DOMRect);
};

const createElements = () => {
  const root = document.createElement("div");
  const header = document.createElement("header");
  const content = document.createElement("main");
  root.append(header, content);
  document.body.append(root);
  setRect(header, { top: 0, bottom: 120, height: 120 });
  setRect(content, { top: 120, bottom: 720, height: 600 });
  return { root, header, content };
};

let originalResizeObserver: typeof ResizeObserver;

beforeEach(() => {
  observers.length = 0;
  originalResizeObserver = globalThis.ResizeObserver;
  globalThis.ResizeObserver =
    ControllableResizeObserver as unknown as typeof ResizeObserver;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.ResizeObserver = originalResizeObserver;
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("useCollapseHeaderOnScroll", () => {
  it("does not publish a header height before the first measurement", () => {
    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header: null,
        content: null,
        root: null,
      })
    );

    expect(result.current.headerHeight).toBeNull();
  });

  it("adds listeners only when enabled", () => {
    const { root, header, content } = createElements();
    const addSpy = vi.spyOn(document, "addEventListener");

    const { rerender } = renderHook(
      (enabled: boolean) =>
        useCollapseHeaderOnScroll({
          enabled,
          header,
          content,
          root,
          collapsedHeight: 48,
        }),
      { initialProps: false }
    );

    expect(addSpy).not.toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.objectContaining({ capture: true })
    );

    rerender(true);

    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true })
    );
    expect(observers[0]?.observed).toEqual([
      { node: header, options: { box: "border-box" } },
      { node: content, options: { box: "border-box" } },
    ]);
  });

  it("ignores unrelated scroll targets", () => {
    const { root, header, content } = createElements();
    const nested = document.createElement("div");
    content.append(nested);
    content.scrollTop = 200;

    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    act(() => {
      nested.dispatchEvent(new Event("scroll", { bubbles: true }));
      vi.advanceTimersByTime(COLLAPSE_HEADER_PAUSE_MS);
    });

    expect(result.current.form).toBe("full");
  });

  it("does not change form before the pause", () => {
    const { root, header, content } = createElements();
    content.scrollTop = 200;

    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    act(() => {
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    expect(result.current.form).toBe("full");

    act(() => {
      vi.advanceTimersByTime(COLLAPSE_HEADER_PAUSE_MS - 1);
    });
    expect(result.current.form).toBe("full");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.form).toBe("collapsed");
  });

  it("holds the form while the pointer is over the header", () => {
    const { root, header, content } = createElements();
    content.scrollTop = 200;

    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    act(() => {
      header.dispatchEvent(new Event("pointerenter"));
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
      vi.advanceTimersByTime(COLLAPSE_HEADER_PAUSE_MS);
    });
    expect(result.current.form).toBe("full");

    act(() => {
      header.dispatchEvent(new Event("pointerleave"));
    });
    expect(result.current.form).toBe("collapsed");
  });

  it("releases the pointer hold on a wheel event over the header", () => {
    const { root, header, content } = createElements();
    content.scrollTop = 200;

    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    act(() => {
      header.dispatchEvent(new Event("pointerenter"));
      header.dispatchEvent(new WheelEvent("wheel", { bubbles: true }));
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
      vi.advanceTimersByTime(COLLAPSE_HEADER_PAUSE_MS);
    });

    expect(result.current.form).toBe("collapsed");
  });

  it("does not apply a form change synchronously in the ResizeObserver callback", () => {
    const { root, header, content } = createElements();
    content.scrollTop = 200;

    const { result } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    act(() => {
      observers[0]?.callback([], observers[0] as unknown as ResizeObserver);
    });
    expect(result.current.form).toBe("full");

    act(() => {
      vi.advanceTimersByTime(COLLAPSE_HEADER_PAUSE_MS);
    });
    expect(result.current.form).toBe("collapsed");
  });

  it("removes every listener and the observer on unmount", () => {
    const { root, header, content } = createElements();
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const headerRemove = vi.spyOn(header, "removeEventListener");

    const { unmount } = renderHook(() =>
      useCollapseHeaderOnScroll({
        enabled: true,
        header,
        content,
        root,
        collapsedHeight: 48,
      })
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.objectContaining({ capture: true, passive: true })
    );
    expect(headerRemove).toHaveBeenCalledWith(
      "pointerenter",
      expect.any(Function)
    );
    expect(headerRemove).toHaveBeenCalledWith(
      "pointerleave",
      expect.any(Function)
    );
    expect(headerRemove).toHaveBeenCalledWith("wheel", expect.any(Function));
    expect(observers[0]?.disconnect).toHaveBeenCalledTimes(1);
  });
});
