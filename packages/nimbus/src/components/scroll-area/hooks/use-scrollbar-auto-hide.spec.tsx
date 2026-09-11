import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  AUTO_HIDE_DELAY_MS,
  SCROLLBAR_VISIBLE_ATTR,
  useScrollbarAutoHide,
} from "./use-scrollbar-auto-hide";

// The real idle delay, imported from the hook so timing assertions can never
// drift from the value the hook actually uses.
const HIDE_DELAY = AUTO_HIDE_DELAY_MS;

const visible = (el: HTMLElement) => el.hasAttribute(SCROLLBAR_VISIBLE_ATTR);

const fire = (el: HTMLElement, type: string) =>
  act(() => {
    el.dispatchEvent(new Event(type));
  });

const move = (el: HTMLElement, x: number, y: number) =>
  act(() => {
    el.dispatchEvent(
      new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true })
    );
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

/**
 * A root whose single direct-child scrollbar has a mocked box at
 * x ∈ [100, 110], y ∈ [0, 200] — JSDOM does no layout, so proximity geometry
 * must be stubbed. Used to exercise the reveal-near-bar and rest-on-bar paths.
 */
const setupWithBar = (enabled = true) => {
  const result = setup(enabled);
  const bar = document.createElement("div");
  bar.setAttribute("data-part", "scrollbar");
  bar.getBoundingClientRect = () =>
    ({
      left: 100,
      right: 110,
      top: 0,
      bottom: 200,
      width: 10,
      height: 200,
      x: 100,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  result.root.appendChild(bar);
  return { ...result, bar };
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

  it("ignores mouse movement away from a bar once idle; scroll reveals it again", () => {
    const { root, viewport } = setup();

    fire(root, "mouseenter");
    advance(HIDE_DELAY); // idle → hidden, now in the scroll-only phase
    expect(visible(root)).toBe(false);

    fire(root, "mousemove"); // no coordinates + no bar → not near one → ignored
    expect(visible(root)).toBe(false);

    fire(viewport, "scroll"); // scrolling still reveals it
    expect(visible(root)).toBe(true);
  });

  it("reveals again when the pointer moves near a bar after idling (proximity)", () => {
    const { root } = setupWithBar();

    fire(root, "mouseenter");
    advance(HIDE_DELAY); // idle → hidden, scroll-only
    expect(visible(root)).toBe(false);

    move(root, 5, 5); // far from the bar → still ignored
    expect(visible(root)).toBe(false);

    move(root, 105, 100); // within the bar's proximity → revealed
    expect(visible(root)).toBe(true);
  });

  it("keeps the bar visible while the pointer rests on it past the idle delay", () => {
    const { root } = setupWithBar();

    fire(root, "mouseenter");
    move(root, 105, 100); // pointer resting directly on the bar
    advance(HIDE_DELAY); // timer fires, but the pointer is on the bar → stays
    expect(visible(root)).toBe(true);

    advance(HIDE_DELAY); // still resting on it → still visible
    expect(visible(root)).toBe(true);

    move(root, 5, 5); // pointer moves off into the content
    advance(HIDE_DELAY); // now it hides
    expect(visible(root)).toBe(false);
  });

  it("does not hide under a pointer resting on the bar when scroll re-arms the timer", () => {
    const { root, viewport } = setupWithBar();

    fire(root, "mouseenter");
    advance(HIDE_DELAY); // idle → hidden, scroll-only
    move(root, 105, 100); // proximity reveal, pointer now on the bar
    expect(visible(root)).toBe(true);

    fire(viewport, "scroll"); // re-arms the timer with no coordinates of its own
    advance(HIDE_DELAY); // would hide under the stationary pointer without the guard
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
