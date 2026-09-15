import type { Meta } from "@storybook/react-vite";
import { fireEvent, waitFor, fn, expect } from "storybook/test";
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
