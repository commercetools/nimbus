import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCollapseHeaderOnScroll } from "./use-collapse-header-on-scroll";

/**
 * JSDOM has no layout, so the geometry of a constrained page is mocked:
 * the header is 120px tall in its full form and 80px when collapsed (it gives
 * back 40px, so it collapses at a distance of 48px). The content starts at the
 * bottom of the live header and scrolls through `scrollTop`.
 */
const FULL_HEIGHT = 120;
const COLLAPSED_HEIGHT = 80;
const WIDTH = 800;

type ObserverCallback = (entries: { target: Element }[]) => void;
const observers: {
  callback: ObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}[] = [];

class ResizeObserverStub {
  callback: ObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: ObserverCallback) {
    this.callback = callback;
    observers.push({ callback, disconnect: this.disconnect });
  }
}

const rect = (top: number, height: number) =>
  ({
    top,
    bottom: top + height,
    height,
    left: 0,
    right: WIDTH,
    width: WIDTH,
    x: 0,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

const headerHeight = (element: Element) =>
  element.getAttribute("data-collapsed") === "true"
    ? COLLAPSED_HEIGHT
    : FULL_HEIGHT;

let container: HTMLDivElement;
let header: HTMLElement;
let content: HTMLElement;
let unrelated: HTMLDivElement;
let scrollTop: number;
let scrollBy: ReturnType<typeof vi.fn>;

const pointerEvent = (type: string, pointerType: string) => {
  const event = new Event(type);
  Object.defineProperty(event, "pointerType", { value: pointerType });
  return event;
};

const scrollContentTo = (top: number) => {
  scrollTop = top;
  act(() => {
    content.dispatchEvent(new Event("scroll"));
  });
};

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const renderEnabled = (isEnabled = true) =>
  renderHook(
    ({ enabled }) =>
      useCollapseHeaderOnScroll({
        isEnabled: enabled,
        containerElement: container,
        headerElement: header,
        contentElement: content,
      }),
    { initialProps: { enabled: isEnabled } }
  );

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  observers.length = 0;

  container = document.createElement("div");
  header = document.createElement("header");
  content = document.createElement("main");
  unrelated = document.createElement("div");
  container.append(header, content);
  document.body.append(container, unrelated);

  scrollTop = 0;
  scrollBy = vi.fn((options: ScrollToOptions) => {
    scrollTop += options.top ?? 0;
  });
  Object.defineProperty(content, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });
  Object.defineProperty(content, "scrollBy", {
    configurable: true,
    value: scrollBy,
  });

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      if (this.tagName === "HEADER") return rect(0, headerHeight(this));
      if (this === content) return rect(headerHeight(header), 600);
      return rect(0, 0);
    }
  );
});

afterEach(() => {
  container.remove();
  unrelated.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useCollapseHeaderOnScroll", () => {
  describe("listeners", () => {
    it("adds no listeners and keeps the full form when disabled", () => {
      const addToDocument = vi.spyOn(document, "addEventListener");
      const addToHeader = vi.spyOn(header, "addEventListener");
      scrollTop = 500;

      const { result } = renderEnabled(false);

      expect(addToDocument).not.toHaveBeenCalledWith(
        "scroll",
        expect.anything(),
        expect.anything()
      );
      expect(addToHeader).not.toHaveBeenCalled();
      expect(observers).toHaveLength(0);
      expect(result.current.isCollapsed).toBe(false);
      expect(header).not.toHaveAttribute("data-collapsed");
      expect(
        container.style.getPropertyValue("--default-page-header-height")
      ).toBe("");
    });

    it("listens to scroll in the capture phase when enabled", () => {
      const addToDocument = vi.spyOn(document, "addEventListener");

      renderEnabled();

      expect(addToDocument).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        { capture: true, passive: true }
      );
      expect(observers).toHaveLength(1);
    });

    it("removes everything on unmount", () => {
      const removeFromDocument = vi.spyOn(document, "removeEventListener");
      const removeFromHeader = vi.spyOn(header, "removeEventListener");
      const { unmount } = renderEnabled();
      scrollContentTo(300);

      unmount();

      expect(removeFromDocument).toHaveBeenCalledWith(
        "scroll",
        expect.any(Function),
        { capture: true, passive: true }
      );
      expect(removeFromHeader).toHaveBeenCalledWith(
        "pointerenter",
        expect.any(Function)
      );
      expect(removeFromHeader).toHaveBeenCalledWith(
        "pointerleave",
        expect.any(Function)
      );
      expect(removeFromHeader).toHaveBeenCalledWith(
        "wheel",
        expect.any(Function)
      );
      expect(observers[0].disconnect).toHaveBeenCalled();
      expect(
        container.style.getPropertyValue("--default-page-header-height")
      ).toBe("");

      // A pending timer does nothing after unmount.
      advance(500);
      expect(header).not.toHaveAttribute("data-collapsed");
    });

    it("returns to the full form when switched off", () => {
      const { result, rerender } = renderEnabled();
      scrollContentTo(300);
      advance(150);
      expect(result.current.isCollapsed).toBe(true);

      rerender({ enabled: false });

      expect(result.current.isCollapsed).toBe(false);
      expect(header).not.toHaveAttribute("data-collapsed");
    });
  });

  describe("scroll targets", () => {
    it("ignores scroll events of unrelated elements", () => {
      const { result } = renderEnabled();
      scrollTop = 300;

      act(() => {
        unrelated.dispatchEvent(new Event("scroll"));
      });
      advance(500);

      expect(result.current.isCollapsed).toBe(false);
    });

    it("accepts scroll events of ancestors and of the document", () => {
      const { result } = renderEnabled();
      scrollTop = 300;
      act(() => {
        document.body.dispatchEvent(new Event("scroll"));
      });
      advance(150);
      expect(result.current.isCollapsed).toBe(true);

      scrollTop = 0;
      act(() => {
        document.dispatchEvent(new Event("scroll"));
      });
      advance(150);
      expect(result.current.isCollapsed).toBe(false);
    });
  });

  describe("pause", () => {
    it("changes the form only after 150ms without a scroll event", () => {
      const { result } = renderEnabled();

      scrollContentTo(100);
      advance(100);
      scrollContentTo(200);
      advance(100);
      expect(result.current.isCollapsed).toBe(false);
      expect(header).not.toHaveAttribute("data-collapsed");

      advance(50);
      expect(result.current.isCollapsed).toBe(true);
      expect(header).toHaveAttribute("data-collapsed", "true");
    });

    it("keeps the full form below the collapse point", () => {
      const { result } = renderEnabled();

      scrollContentTo(47);
      advance(500);

      expect(result.current.isCollapsed).toBe(false);
    });

    it("keeps the collapsed form while scrolling up, and expands at the top", () => {
      const { result } = renderEnabled();
      scrollContentTo(300);
      advance(150);
      expect(result.current.isCollapsed).toBe(true);

      scrollContentTo(20);
      advance(150);
      expect(result.current.isCollapsed).toBe(true);

      scrollContentTo(0);
      advance(150);
      expect(result.current.isCollapsed).toBe(false);
    });

    it("does not apply a change from the ResizeObserver callback synchronously", () => {
      const { result } = renderEnabled();
      scrollTop = 300;

      act(() => {
        observers[0].callback([{ target: content }]);
      });
      expect(result.current.isCollapsed).toBe(false);

      advance(150);
      expect(result.current.isCollapsed).toBe(true);
    });
  });

  describe("content stays still", () => {
    it("scrolls by the space given back when collapsing after a scroll", () => {
      renderEnabled();
      scrollContentTo(30);
      scrollContentTo(60);
      advance(150);

      expect(scrollBy).toHaveBeenCalledTimes(1);
      expect(scrollBy).toHaveBeenCalledWith({
        top: -(FULL_HEIGHT - COLLAPSED_HEIGHT),
        behavior: "instant",
      });
    });

    it("does not correct after a jump larger than the space given back", () => {
      const { result } = renderEnabled();
      scrollContentTo(500);
      advance(150);

      expect(result.current.isCollapsed).toBe(true);
      expect(scrollBy).not.toHaveBeenCalled();
    });

    it("collapses on the first measurement without a correction", () => {
      scrollTop = 500;
      const { result } = renderEnabled();

      expect(result.current.isCollapsed).toBe(true);
      expect(header).toHaveAttribute("data-collapsed", "true");
      expect(scrollBy).not.toHaveBeenCalled();
    });
  });

  describe("pointer hold", () => {
    it("holds the form while the mouse pointer is over the header", () => {
      const { result } = renderEnabled();
      act(() => {
        header.dispatchEvent(pointerEvent("pointerenter", "mouse"));
      });

      scrollContentTo(300);
      advance(500);
      expect(result.current.isCollapsed).toBe(false);

      act(() => {
        header.dispatchEvent(pointerEvent("pointerleave", "mouse"));
      });
      expect(result.current.isCollapsed).toBe(true);
    });

    it("releases the hold on a wheel event over the header", () => {
      const { result } = renderEnabled();
      act(() => {
        header.dispatchEvent(pointerEvent("pointerenter", "mouse"));
      });
      scrollContentTo(300);
      advance(500);
      expect(result.current.isCollapsed).toBe(false);

      act(() => {
        header.dispatchEvent(new Event("wheel"));
      });
      advance(100);
      expect(result.current.isCollapsed).toBe(false);
      advance(50);
      expect(result.current.isCollapsed).toBe(true);
    });

    it("does not hold for touch", () => {
      const { result } = renderEnabled();
      act(() => {
        header.dispatchEvent(pointerEvent("pointerenter", "touch"));
      });

      scrollContentTo(300);
      advance(150);

      expect(result.current.isCollapsed).toBe(true);
    });
  });

  describe("header height variable", () => {
    it("follows the header height in both forms", () => {
      renderEnabled();
      expect(
        container.style.getPropertyValue("--default-page-header-height")
      ).toBe(`${FULL_HEIGHT}px`);

      scrollContentTo(300);
      advance(150);
      expect(
        container.style.getPropertyValue("--default-page-header-height")
      ).toBe(`${COLLAPSED_HEIGHT}px`);
    });

    it("is not set when the header cannot be measured", () => {
      vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockImplementation(
        () => rect(0, 0)
      );
      scrollTop = 500;

      const { result } = renderEnabled();

      expect(
        container.style.getPropertyValue("--default-page-header-height")
      ).toBe("");
      expect(result.current.isCollapsed).toBe(false);
    });
  });

  describe("hidden copy", () => {
    it("removes the copy after measuring", () => {
      renderEnabled();

      expect(container.querySelectorAll("header")).toHaveLength(1);
    });
  });
});
