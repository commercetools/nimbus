import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { Treemap, type TreemapNode } from "./treemap";

const meta: Meta = {
  title: "Charts/Treemap",
  render: () => <RegistryPreview base="Treemap" />,
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
 * `D2`: `texture` fills each leaf with a per-branch SVG pattern (in addition
 * to color) so branches stay distinguishable without color. Every leaf
 * inherits its top-level ancestor's texture, not one keyed to its own name,
 * so the pattern count matches the number of TOP-LEVEL branches (3), not the
 * number of leaves. Proven directly: every leaf's `fill` is a `url(#...)`
 * pattern reference, and `<defs>` has one `<pattern>` per top-level branch.
 */
export const Texture: BaseStory = {
  render: () => (
    <Treemap
      width={360}
      height={240}
      data={fixture}
      texture
      ariaLabel="Treemap with per-branch textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const branchCount = fixture.children!.length;
    const leafCount = fixture.children!.reduce(
      (s, c) => s + c.children!.length,
      0
    );
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(branchCount);
    const marks = Array.from(canvasElement.querySelectorAll("rect")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(leafCount);
  },
};
