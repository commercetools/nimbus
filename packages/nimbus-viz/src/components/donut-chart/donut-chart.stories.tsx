import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DonutChart } from "./donut-chart";
import type { CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/DonutChart",
  render: () => <RegistryPreview base="DonutChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * `D2`: `texture` fills each slice with a per-category SVG pattern (in
 * addition to color) so slices stay distinguishable without color — print,
 * a photocopy, `forced-colors` mode. Proven directly: every slice's `fill`
 * is a `url(#...)` pattern reference, and `<defs>` has one `<pattern>` per
 * slice.
 */
const textureFixture: CategoryDatum[] = [
  { category: "New", value: 40 },
  { category: "Returning", value: 35 },
  { category: "Referral", value: 25 },
];

export const Texture: BaseStory = {
  render: () => (
    <DonutChart
      width={280}
      height={280}
      data={textureFixture}
      texture
      ariaLabel="Donut chart with per-slice textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(textureFixture.length);
    const slices = Array.from(canvasElement.querySelectorAll("path"));
    // At least the slices (there may be more paths in the accessibility
    // frame) reference a pattern fill, not a flat color.
    const patterned = slices.filter((p) =>
      p.getAttribute("fill")?.startsWith("url(#")
    );
    expect(patterned.length).toBe(textureFixture.length);
  },
};
