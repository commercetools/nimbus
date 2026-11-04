import { describe, expect, it, vi } from "vitest";
import { applyHeaderFormChange, resolveScroller } from "./scroll-correction";

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

describe("scroll correction", () => {
  it("uses Content as the scroller when Content itself scrolls", () => {
    const content = document.createElement("main");
    Object.defineProperty(content, "scrollHeight", { value: 800 });
    Object.defineProperty(content, "clientHeight", { value: 400 });
    const outer = document.createElement("div");

    expect(resolveScroller(content, outer)).toBe(content);
  });

  it("uses the last scroll target when Content does not scroll", () => {
    const content = document.createElement("main");
    Object.defineProperty(content, "scrollHeight", { value: 200 });
    Object.defineProperty(content, "clientHeight", { value: 200 });
    const outer = document.createElement("div");

    expect(resolveScroller(content, outer)).toBe(outer);
  });

  it("keeps the content reference still when collapsing after a scroll", () => {
    const header = document.createElement("header");
    const content = document.createElement("main");
    Object.defineProperty(content, "scrollHeight", { value: 800 });
    Object.defineProperty(content, "clientHeight", { value: 400 });
    content.scrollTop = 80;
    setRect(content, { top: 120, bottom: 520, height: 400 });

    const scrollBy = vi.fn();
    content.scrollBy = scrollBy;

    let reads = 0;
    vi.spyOn(content, "getBoundingClientRect").mockImplementation(() => {
      reads += 1;
      const top = reads === 1 ? 120 : 80;
      return {
        x: 0,
        y: top,
        width: 400,
        height: 400,
        top,
        right: 400,
        bottom: top + 400,
        left: 0,
        toJSON: () => ({}),
      } as DOMRect;
    });

    applyHeaderFormChange({
      header,
      content,
      lastScrollTarget: content,
      next: "collapsed",
      lastChangeWasJump: false,
      isFirstMeasurement: false,
    });

    expect(header.getAttribute("data-collapsed")).toBe("true");
    expect(scrollBy).toHaveBeenCalledWith({
      top: -40,
      behavior: "instant",
    });
  });

  it("does not correct after a jump or on the first measurement", () => {
    const header = document.createElement("header");
    const content = document.createElement("main");
    Object.defineProperty(content, "scrollHeight", { value: 800 });
    Object.defineProperty(content, "clientHeight", { value: 400 });
    const scrollBy = vi.fn();
    content.scrollBy = scrollBy;
    setRect(content, { top: 120, bottom: 520, height: 400 });

    applyHeaderFormChange({
      header,
      content,
      lastScrollTarget: content,
      next: "collapsed",
      lastChangeWasJump: true,
      isFirstMeasurement: false,
    });
    expect(scrollBy).not.toHaveBeenCalled();

    applyHeaderFormChange({
      header,
      content,
      lastScrollTarget: content,
      next: "collapsed",
      lastChangeWasJump: false,
      isFirstMeasurement: true,
    });
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it("restores the scroller offset when returning to the full form", () => {
    const header = document.createElement("header");
    header.setAttribute("data-collapsed", "true");
    const content = document.createElement("main");
    Object.defineProperty(content, "scrollHeight", { value: 800 });
    Object.defineProperty(content, "clientHeight", { value: 400 });
    content.scrollTop = 0;
    const scrollTo = vi.fn();
    content.scrollTo = scrollTo;

    applyHeaderFormChange({
      header,
      content,
      lastScrollTarget: content,
      next: "full",
      lastChangeWasJump: false,
      isFirstMeasurement: false,
    });

    expect(header.hasAttribute("data-collapsed")).toBe(false);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });
});
