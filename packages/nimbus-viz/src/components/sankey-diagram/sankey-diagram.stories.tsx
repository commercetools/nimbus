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

/**
 * `D2/D3-rest`: `texture` distinguishes nodes/links by a non-color channel
 * matched to how each mark actually paints. Nodes are real filled `<rect>`s
 * — they get a fill `patternFill`. Links are `fill="none"` paths with the
 * ribbon width as `strokeWidth` — no fill area to texture — so they get
 * their source node's `strokeDasharray` rhythm instead. Proven directly: 3
 * `<pattern>`s (one per node), the first node's link (source index 0)
 * carries a solid stroke, the second node's link (source index 1) carries a
 * real dash pattern.
 */
const chainGraph = {
  nodes: [{ name: "A" }, { name: "B" }, { name: "C" }],
  links: [
    { source: 0, target: 1, value: 10 },
    { source: 1, target: 2, value: 6 },
  ],
};

export const Texture: BaseStory = {
  render: () => (
    <SankeyDiagram
      width={400}
      height={280}
      graph={chainGraph}
      texture
      ariaLabel="Sankey diagram with per-node pattern fills and dashed links"
    />
  ),
  play: async ({ canvasElement }) => {
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(chainGraph.nodes.length);

    const nodeRects = Array.from(
      canvasElement.querySelectorAll<SVGRectElement>("rect")
    ).filter((r) => r.getAttribute("fill")?.startsWith("url(#"));
    expect(nodeRects).toHaveLength(chainGraph.nodes.length);

    const links = Array.from(
      canvasElement.querySelectorAll<SVGPathElement>('path[fill="none"]')
    );
    expect(links).toHaveLength(chainGraph.links.length);
    expect(links[0]).not.toHaveAttribute("stroke-dasharray"); // source "A" (index 0): solid
    expect(links[1]).toHaveAttribute("stroke-dasharray"); // source "B" (index 1): dash-encoded
    expect(links[1].getAttribute("stroke-dasharray")).not.toBe("");
  },
};
