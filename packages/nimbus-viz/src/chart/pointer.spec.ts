import { describe, it, expect, vi } from "vitest";
import { plotPointerPosition, clamp } from "./pointer";

/**
 * jsdom has no real SVG geometry support (`SVGSVGElement.getScreenCTM` /
 * `createSVGPoint` don't exist), so `@visx/event`'s `localPoint` always
 * takes its bounding-rect FALLBACK path here, never the real CTM path a
 * browser uses. That fallback path is still real code — this spec proves
 * `plotPointerPosition`'s own margin subtraction is correct on top of it.
 * The CTM path (what actually runs for a real, possibly `viewBox`-scaled
 * chart `<svg>`) is exercised by the browser-mode story test instead
 * (`bar-chart.stories.tsx`'s `Interaction`/hover story), not here.
 */
function dispatchAt(
  target: HTMLElement,
  clientX: number,
  clientY: number,
  rect: { left: number; top: number }
) {
  vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
    left: rect.left,
    top: rect.top,
    right: rect.left + 100,
    bottom: rect.top + 100,
    width: 100,
    height: 100,
    x: rect.left,
    y: rect.top,
    toJSON: () => "",
  });
  const event = new MouseEvent("mousemove", {
    clientX,
    clientY,
    bubbles: true,
  });
  Object.defineProperty(event, "target", { value: target });
  return event;
}

describe("plotPointerPosition", () => {
  it("subtracts the element's own bounding-rect offset and the chart margin", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    // Event fires at screen (150, 220); the element's own rect starts at
    // (20, 30); the chart's margin is (left: 44, top: 12) -- plot-local
    // position should be (150 - 20 - 44, 220 - 30 - 12) = (86, 178).
    const event = dispatchAt(div, 150, 220, { left: 20, top: 30 });
    const point = plotPointerPosition(event as unknown as React.MouseEvent, {
      left: 44,
      top: 12,
    });
    expect(point).toEqual({ x: 86, y: 178 });
    document.body.removeChild(div);
  });

  it("returns a real value at the plot origin, not a silent (0,0) default", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const event = dispatchAt(div, 44, 12, { left: 0, top: 0 });
    const point = plotPointerPosition(event as unknown as React.MouseEvent, {
      left: 44,
      top: 12,
    });
    // Exactly at the plot's top-left corner -- (0, 0) here is a real,
    // computed answer, not evidence the function silently no-oped.
    expect(point).toEqual({ x: 0, y: 0 });
    document.body.removeChild(div);
  });
});

describe("clamp", () => {
  it("passes through a value already inside [0, max]", () => {
    expect(clamp(5, 10)).toBe(5);
  });

  it("floors a negative value to 0", () => {
    expect(clamp(-3, 10)).toBe(0);
  });

  it("ceils a value past max down to max", () => {
    expect(clamp(15, 10)).toBe(10);
  });
});
