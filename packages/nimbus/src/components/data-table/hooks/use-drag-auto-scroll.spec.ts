import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { DragEvent as ReactDragEvent, RefObject } from "react";
import { renderHook } from "@testing-library/react";
import {
  DRAG_AUTO_SCROLL_EDGE,
  getDragAutoScrollSpeed,
  hasNativeDragAutoScroll,
  useDragAutoScroll,
  withoutReactAriaAutoScroll,
} from "./use-drag-auto-scroll";

/** Frames are faked, so a test moves time by hand. */
const nextFrame = () => vi.advanceTimersByTimeAsync(16);

// The visible area of the scroll area: from 100px to 500px in the viewport,
// inside a 1px border.
const AREA_TOP = 100;
const AREA_HEIGHT = 400;
const BORDER = 1;
const INNER_TOP = AREA_TOP + BORDER;
const INNER_BOTTOM = INNER_TOP + AREA_HEIGHT;

/**
 * A scroll area with a table in it, and an element outside it. The scroll
 * area is the table's scroll parent: it has `overflow: auto`.
 */
const setup = ({ isEnabled = true }: { isEnabled?: boolean } = {}) => {
  const area = document.createElement("div");
  area.style.overflow = "auto";
  Object.defineProperty(area, "clientTop", { value: BORDER });
  Object.defineProperty(area, "clientHeight", { value: AREA_HEIGHT });
  area.getBoundingClientRect = () =>
    ({
      top: AREA_TOP,
      bottom: AREA_TOP + AREA_HEIGHT + 2 * BORDER,
      left: 0,
      right: 600,
    }) as DOMRect;
  area.scrollTop = 1000;
  const table = document.createElement("table");
  const cell = table.insertRow().insertCell();
  area.append(table);
  const outside = document.createElement("div");
  document.body.append(area, outside);

  const tableRef = { current: table } as RefObject<HTMLTableElement | null>;
  const { unmount, rerender } = renderHook(
    (props: { isEnabled: boolean }) =>
      useDragAutoScroll({ tableRef, isEnabled: props.isEnabled }),
    { initialProps: { isEnabled } }
  );

  return {
    area,
    cell,
    outside,
    unmount,
    rerender,
    cleanup: () => {
      area.remove();
      outside.remove();
    },
  };
};

/** Fires a drag event at `target`. JSDOM has no `DragEvent`. */
const drag = (
  target: Element,
  type: string,
  { clientX = 300, clientY = 300 }: { clientX?: number; clientY?: number } = {}
) => {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
  });
  target.dispatchEvent(event);
};

describe("getDragAutoScrollSpeed", () => {
  it("is 0 between the edges", () => {
    expect(getDragAutoScrollSpeed(300, 100, 500)).toBe(0);
    expect(getDragAutoScrollSpeed(100 + DRAG_AUTO_SCROLL_EDGE, 100, 500)).toBe(
      0
    );
    expect(getDragAutoScrollSpeed(500 - DRAG_AUTO_SCROLL_EDGE, 100, 500)).toBe(
      0
    );
  });

  it("scrolls up near the top edge, faster closer to it", () => {
    expect(getDragAutoScrollSpeed(115, 100, 500)).toBe(-5);
    expect(getDragAutoScrollSpeed(102, 100, 500)).toBe(-18);
  });

  it("scrolls down near the bottom edge, faster closer to it", () => {
    expect(getDragAutoScrollSpeed(485, 100, 500)).toBe(5);
    expect(getDragAutoScrollSpeed(498, 100, 500)).toBe(18);
  });

  it("is never faster than the size of the edge", () => {
    expect(getDragAutoScrollSpeed(50, 100, 500)).toBe(-DRAG_AUTO_SCROLL_EDGE);
    expect(getDragAutoScrollSpeed(550, 100, 500)).toBe(DRAG_AUTO_SCROLL_EDGE);
  });
});

describe("hasNativeDragAutoScroll", () => {
  const userAgents = {
    safariMac:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
    safariIPhone:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    chromeMac:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    firefoxMac:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0",
  };
  const pretend = (userAgent: string, platform: string) => {
    vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(userAgent);
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue(platform);
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is false in Safari on macOS", () => {
    pretend(userAgents.safariMac, "MacIntel");
    expect(hasNativeDragAutoScroll()).toBe(false);
  });

  it("is true in Safari on iOS, Chrome and Firefox", () => {
    pretend(userAgents.safariIPhone, "iPhone");
    expect(hasNativeDragAutoScroll()).toBe(true);
    pretend(userAgents.chromeMac, "MacIntel");
    expect(hasNativeDragAutoScroll()).toBe(true);
    pretend(userAgents.firefoxMac, "MacIntel");
    expect(hasNativeDragAutoScroll()).toBe(true);
  });
});

describe("useDragAutoScroll", () => {
  let current: ReturnType<typeof setup> | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    current?.unmount();
    current?.cleanup();
    current = undefined;
    vi.useRealTimers();
  });

  const start = (options?: { isEnabled?: boolean }) => {
    current = setup(options);
    return current;
  };

  it("scrolls down every frame while the pointer is near the bottom edge", async () => {
    const { area, cell } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1015);
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
  });

  it("scrolls up every frame while the pointer is near the top edge", async () => {
    const { area, cell } = start();
    drag(cell, "dragover", { clientY: INNER_TOP + 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(985);
    await nextFrame();
    expect(area.scrollTop).toBe(970);
  });

  it("follows the pointer and stops between the edges", async () => {
    const { area, cell } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 1 });
    await nextFrame();
    expect(area.scrollTop).toBe(1015 + 19);
    drag(cell, "dragover", { clientY: 300 });
    await nextFrame();
    await nextFrame();
    expect(area.scrollTop).toBe(1034);
  });

  it("stops on drop and when the drag ends", async () => {
    const { area, cell } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    drag(cell, "drop", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1015);

    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
    drag(cell, "dragend");
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
  });

  it("stops when the pointer leaves the scroll area, not between its elements", async () => {
    const { area, cell } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    // From one element of the table to the next: still inside.
    drag(cell, "dragleave", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
    // Out of the scroll area, for example out of the window.
    drag(cell, "dragleave", { clientY: INNER_BOTTOM + 50 });
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
  });

  it("does not scroll for a drag outside the scroll area", async () => {
    const { area, outside } = start();
    drag(outside, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1000);
  });

  it("stops when the pointer moves out of the scroll area", async () => {
    const { area, cell, outside } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    drag(outside, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1015);
  });

  it("does nothing when it is not enabled", async () => {
    const { area, cell } = start({ isEnabled: false });
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1000);
  });

  it("stops when it is disabled or unmounted", async () => {
    const { area, cell, rerender, unmount } = start();
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    rerender({ isEnabled: false });
    await nextFrame();
    expect(area.scrollTop).toBe(1015);

    rerender({ isEnabled: true });
    drag(cell, "dragover", { clientY: INNER_BOTTOM - 5 });
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
    unmount();
    await nextFrame();
    expect(area.scrollTop).toBe(1030);
  });
});

describe("withoutReactAriaAutoScroll", () => {
  type UseDroppableCollection = Parameters<
    typeof withoutReactAriaAutoScroll
  >[0];
  const hookArgs = [{}, {}, { current: null }] as unknown as Parameters<
    ReturnType<typeof withoutReactAriaAutoScroll>
  >;
  const dragOverEvent = {} as ReactDragEvent<HTMLElement>;

  it("runs React Aria's dragover handler without animation frames", () => {
    const frameCallback = vi.fn();
    let requested: number | undefined;
    const onDragOver = vi.fn(() => {
      requested = requestAnimationFrame(frameCallback);
    });
    const original = (() => ({
      collectionProps: { onDragOver },
    })) as unknown as UseDroppableCollection;
    const requestAnimationFrameBefore = window.requestAnimationFrame;

    const result = withoutReactAriaAutoScroll(original)(...hookArgs);
    result.collectionProps.onDragOver?.(dragOverEvent);

    expect(onDragOver).toHaveBeenCalledWith(dragOverEvent);
    // React Aria starts its loop only with an id that is not 0.
    expect(requested).toBe(0);
    expect(window.requestAnimationFrame).toBe(requestAnimationFrameBefore);
  });

  it("puts `requestAnimationFrame` back when the handler throws", () => {
    const original = (() => ({
      collectionProps: {
        onDragOver: () => {
          throw new Error("handler failed");
        },
      },
    })) as unknown as UseDroppableCollection;
    const requestAnimationFrameBefore = window.requestAnimationFrame;

    const result = withoutReactAriaAutoScroll(original)(...hookArgs);
    expect(() => result.collectionProps.onDragOver?.(dragOverEvent)).toThrow(
      "handler failed"
    );
    expect(window.requestAnimationFrame).toBe(requestAnimationFrameBefore);
  });

  it("keeps the other props and a result without a dragover handler", () => {
    const onDrop = vi.fn();
    const withoutDragOver = { collectionProps: { onDrop } };
    const original = (() =>
      withoutDragOver) as unknown as UseDroppableCollection;
    expect(withoutReactAriaAutoScroll(original)(...hookArgs)).toBe(
      withoutDragOver
    );

    const withDragOver = (() => ({
      collectionProps: { onDrop, onDragOver: vi.fn() },
    })) as unknown as UseDroppableCollection;
    expect(
      withoutReactAriaAutoScroll(withDragOver)(...hookArgs).collectionProps
        .onDrop
    ).toBe(onDrop);
  });
});
