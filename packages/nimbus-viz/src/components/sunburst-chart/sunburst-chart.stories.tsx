import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { SunburstChart } from "./sunburst-chart";
import type { TreemapNode } from "../treemap";

const meta: Meta = {
  title: "Charts/SunburstChart",
  render: () => <RegistryPreview base="SunburstChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: TreemapNode = {
  name: "Revenue",
  children: [
    {
      name: "Web",
      children: [
        { name: "New", value: 260 },
        { name: "Returning", value: 180 },
      ],
    },
    {
      name: "Mobile",
      children: [
        { name: "iOS", value: 150 },
        { name: "Android", value: 120 },
      ],
    },
    {
      name: "Retail",
      children: [
        { name: "Flagship", value: 90 },
        { name: "Outlet", value: 60 },
      ],
    },
  ],
};

/**
 * `D2`: `texture` fills each arc with a per-branch SVG pattern (in addition to
 * color) so branches stay distinguishable without color. Every node inherits
 * its top-level ancestor's texture, not one keyed to its own name, so the
 * pattern count matches the number of TOP-LEVEL branches (3), not the number
 * of arcs. Proven directly: every arc's `fill` is a `url(#...)` pattern
 * reference, and `<defs>` has one `<pattern>` per top-level branch.
 */
export const Texture: BaseStory = {
  render: () => (
    <SunburstChart
      width={360}
      height={360}
      data={fixture}
      texture
      ariaLabel="Sunburst with per-branch textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const branchCount = fixture.children!.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(branchCount);
    const arcCount = fixture.children!.reduce(
      (s, c) => s + c.children!.length + 1,
      0
    );
    const marks = Array.from(canvasElement.querySelectorAll("path")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(arcCount);
  },
};
