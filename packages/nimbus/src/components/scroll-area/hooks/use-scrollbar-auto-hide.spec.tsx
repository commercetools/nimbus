import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  SCROLLBAR_VISIBLE_ATTR,
  useScrollbarAutoHide,
} from "./use-scrollbar-auto-hide";

/**
 * The idle delay baked into the hook (see `AUTO_HIDE.hideDelay`). Kept in sync
 * here so the timing assertions read clearly.
 */
const HIDE_DELAY = 600;

const visible = (el: HTMLElement) => el.hasAttribute(SCROLLBAR_VISIBLE_ATTR);

const fire = (el: HTMLElement, type: string) =>
  act(() => {
    el.dispatchEvent(new Event(type));
  });

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

const setup = (enabled = true) => {
  const root = document.createElement("div");
  const viewport = document.createElement("div");
  root.appendChild(viewport);
  document.body.appendChild(root);

  const rootRef = { current: root };
  const viewportRef = { current: viewport };

  const view = renderHook(
    (props: { enabled: boolean }) =>
      useScrollbarAutoHide({
        enabled: props.enabled,
        rootRef,
        viewportRef,
      }),
    { initialProps: { enabled } }
  );

  return { root, viewport, view };
};

describe("useScrollbarAutoHide", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("reveals on pointer enter and hides after the idle delay", () => {
    const { root } = setup();

    fire(root, "mouseenter");
    expect(visible(root)).toBe(true);

    advance(HIDE_DELAY);
    expect(visible(root)).toBe(false);
  });

  it("stays visible while the mouse keeps moving, hides once it stops", () => {
    const { root } = setup();

    fire(root, "mouseenter");
    advance(HIDE_DELAY - 200);
    fire(root, "mousemove"); // resets the idle timer
    advance(HIDE_DELAY - 200);
    // The idle timer was reset by the move, so it has not fired yet.
    expect(visible(root)).toBe(true);

    advance(200); // now a full HIDE_DELAY has passed since the last move
    expect(visible(root)).toBe(false);
  });

  it("ignores mouse movement once idle; only scroll reveals it again", () => {
    const { root, viewport } = setup();

    fire(root, "mouseenter");
    advance(HIDE_DELAY); // idle → hidden, now in the scroll-only phase
    expect(visible(root)).toBe(false);

    fire(root, "mousemove"); // ignored while scroll-only
    expect(visible(root)).toBe(false);

    fire(viewport, "scroll"); // scrolling still reveals it
    expect(visible(root)).toBe(true);
  });

  it("re-arms the entry reveal after the mouse leaves and re-enters", () => {
    const { root } = setup();

    fire(root, "mouseenter");
    advance(HIDE_DELAY); // idle → scroll-only
    fire(root, "mousemove");
    expect(visible(root)).toBe(false); // movement ignored in this visit

    fire(root, "mouseleave"); // ends the visit
    fire(root, "mouseenter"); // fresh visit re-arms the entry reveal
    expect(visible(root)).toBe(true);

    fire(root, "mousemove"); // armed again → keeps it visible
    expect(visible(root)).toBe(true);
  });

  it("hides immediately when the mouse leaves", () => {
    const { root } = setup();

    fire(root, "mouseenter");
    expect(visible(root)).toBe(true);

    fire(root, "mouseleave");
    expect(visible(root)).toBe(false);
  });

  it("does nothing while disabled", () => {
    const { root, viewport } = setup(false);

    fire(root, "mouseenter");
    fire(viewport, "scroll");
    expect(visible(root)).toBe(false);
  });

  it("removes its listeners on unmount", () => {
    const { root, view } = setup();

    view.unmount();
    fire(root, "mouseenter");
    expect(visible(root)).toBe(false);
  });
});
