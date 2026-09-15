import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SankeyDiagram } from "./sankey-diagram";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/SankeyDiagram",
  render: () => <RegistryPreview base="SankeyDiagram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-3 (`docs/bug-classes.md`): d3-sankey scales node/link geometry
 * proportional to `value / totalFlow`. When every link's value is 0,
 * `totalFlow` is 0 and that division produces `NaN` throughout the laid-out
 * graph (node heights, `y` positions, ribbon `strokeWidth`), and React logs
 * "Received NaN for …" for each one. The fix renders the same "nothing to
 * show" form as an empty graph (`null`) instead of attempting the layout.
 */
export const EdgeCaseAllZeroFlow: BaseStory = {
  render: () => (
    <SankeyDiagram
      width={400}
      height={280}
      ariaLabel="Sankey diagram of three nodes with no measurable flow"
      graph={{
        nodes: [{ name: "A" }, { name: "B" }, { name: "C" }],
        links: [
          { source: 0, target: 1, value: 0 },
          { source: 1, target: 2, value: 0 },
        ],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    // Renders its empty form -- no `<svg>` at all, the same convention as
    // an empty `graph.nodes` -- rather than a layout full of NaN geometry.
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();

    for (const el of Array.from(canvasElement.querySelectorAll("*"))) {
      for (const attr of Array.from(el.attributes)) {
        expect(attr.value).not.toContain("NaN");
      }
    }
  },
};
