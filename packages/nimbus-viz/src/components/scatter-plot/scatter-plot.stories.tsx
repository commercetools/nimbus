import type { Meta } from "@storybook/react-vite";
import { fireEvent, waitFor, fn, expect, userEvent } from "storybook/test";
import { ScatterPlot } from "./scatter-plot";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ScatterPlot",
  render: () => <RegistryPreview base="ScatterPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * `#19`: `quadtreeHitRadius` swaps per-circle listeners for one plot-wide
 * `d3-quadtree` nearest-point lookup — the large-N-friendly path (one DOM
 * listener regardless of point count). Proves the lookup resolves the exact
 * point under the pointer through that one shared listener, not each
 * point's own handler (there are none in this mode — see the component).
 */
const quadtreeFixture = [
  { x: 10, y: 20, label: "A" },
  { x: 50, y: 60, label: "B" },
  { x: 90, y: 30, label: "C" },
];
const handleHover = fn();

export const QuadtreeHitTest: BaseStory = {
  render: () => (
    <ScatterPlot
      width={320}
      height={240}
      points={quadtreeFixture}
      quadtreeHitRadius={20}
      onDatumHover={handleHover}
      ariaLabel="Scatter plot using quadtree-based hit testing"
    />
  ),
  play: async ({ canvasElement }) => {
    const circles = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    );
    expect(circles).toHaveLength(3);
    // No per-circle listener in quadtree mode -- one transparent overlay
    // rect (on top, in DOM order after the circles) both handles the hover
    // and is the only element than can receive it.
    const overlay = canvasElement.querySelector<SVGRectElement>(
      "rect[fill='transparent']"
    );
    expect(overlay).toBeTruthy();

    const target = circles[1]; // point "B"
    const box = target.getBoundingClientRect();
    fireEvent.mouseMove(overlay!, {
      clientX: box.left + box.width / 2,
      clientY: box.top + box.height / 2,
    });
    await waitFor(() => expect(handleHover).toHaveBeenCalled());
    const call = handleHover.mock.calls.at(-1)![0];
    expect(call?.datum).toEqual(quadtreeFixture[1]);
    expect(call?.index).toBe(1);
  },
};

/**
 * Hover/tooltip UX convergence with `bar-chart.tsx`: hovering a point bolds
 * it via the chart's existing bump mechanism (radius 5px -> 6px) and never
 * dims its siblings' `fill-opacity` (the old mechanism this replaces). No
 * tooltip-follows-pointer here -- a scatter point's radius is fixed and
 * small (5-6px, `scatter-plot.mdx` "Axes, scales & tooltip"), leaving no
 * real room to track pointer position within the mark; see `BubbleChart`
 * (variable, up to 56px-diameter bubbles) for where that DOES apply.
 */
const hoverFixture = [
  { x: 10, y: 20, label: "A" },
  { x: 50, y: 60, label: "B" },
  { x: 90, y: 30, label: "C" },
];

export const HoverEmphasis: BaseStory = {
  render: () => <ScatterPlot width={320} height={240} points={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const circles = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));

    const first = circles()[0];
    await userEvent.hover(first);
    await waitFor(() => expect(circles()[0]).toHaveAttribute("r", "6"));

    // No dimming: every point keeps the same base fill-opacity -- none is
    // reduced because a sibling is hovered (the old mechanism this
    // replaces).
    for (const c of circles()) {
      expect(c).toHaveAttribute("fill-opacity", "0.85");
    }
    // Emphasis instead: only the hovered point's radius grows.
    expect(circles()[1]).toHaveAttribute("r", "5");
    expect(circles()[2]).toHaveAttribute("r", "5");
  },
};

/**
 * `D2/D3-rest`: `texture` distinguishes groups by marker SHAPE (in addition
 * to color) so groups stay distinguishable without color alone. Not a fill
 * *pattern* like `StackedBarChart`'s `Texture` story — a scatter point's
 * radius is fixed at 5px (6px on hover), under one texture tile, where a
 * fill pattern would read as noise rather than a shape. Proven directly: the
 * first group (`Sedan`) stays a `<circle>`, the second (`SUV`) becomes a
 * `<polygon>` (a square) — a shape swap, not just a color change.
 */
const groupedFixture = [
  { x: 12, y: 22, group: "Sedan" },
  { x: 20, y: 30, group: "Sedan" },
  { x: 26, y: 24, group: "Sedan" },
  { x: 34, y: 44, group: "SUV" },
  { x: 48, y: 58, group: "SUV" },
];

/**
 * `showValues` (Phase B): draws each point's `label` directly above it --
 * `chart/value-labels.tsx`'s `ValueLabel`. A scatter point has no single
 * numeric "value" the way a bar or lollipop does -- `x` and `y` are two
 * independent, already position-encoded measures, so this labels point
 * IDENTITY (`label`) instead; a point with no `label` draws nothing extra.
 * Default `false`; omitting the prop renders exactly as before this
 * existed. Every point in `showValuesFixture` sets a `label`, so two
 * instances side by side (each its own distinct `ariaLabel`, per this
 * file's established convention) prove the causal link directly: turning
 * the prop on adds exactly one new `<text>` per point, not a guessed
 * string.
 */
const showValuesFixture = [
  { x: 12, y: 22, label: "Acme" },
  { x: 34, y: 44, label: "Globex" },
  { x: 63, y: 66, label: "Initech" },
];

export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <ScatterPlot
        width={240}
        height={240}
        points={showValuesFixture}
        ariaLabel="Scatter plot without value labels"
      />
      <ScatterPlot
        width={240}
        height={240}
        points={showValuesFixture}
        showValues
        ariaLabel="Scatter plot with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (ScatterPlot uses role="img",
    // not "graphics-document" -- unlike BarChart it has no keyboard-
    // focusable marks). Axis tick labels render their own nested <svg>
    // (visx's positioning trick), which don't carry this role attribute, so
    // they're excluded from this NodeList on their own.
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(
      textCount(svgs[0]) + showValuesFixture.length
    );
  },
};

export const Texture: BaseStory = {
  render: () => (
    <ScatterPlot
      width={360}
      height={280}
      points={groupedFixture}
      texture
      ariaLabel="Scatter plot with per-group marker shapes"
    />
  ),
  play: async ({ canvasElement }) => {
    const sedanCount = groupedFixture.filter((p) => p.group === "Sedan").length;
    const suvCount = groupedFixture.filter((p) => p.group === "SUV").length;
    const circles = canvasElement.querySelectorAll("circle");
    const polygons = canvasElement.querySelectorAll("polygon");
    expect(circles.length).toBe(sedanCount); // first group: unchanged circle
    expect(polygons.length).toBe(suvCount); // second group: shape-encoded
  },
};
