import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { WaffleChart } from "./waffle-chart";
import type { CategoryDatum } from "../../chart/types";

const meta: Meta = {
  title: "Charts/WaffleChart",
  render: () => <RegistryPreview base="WaffleChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
  { category: "Email", value: 1200 },
];

/**
 * `D2`: `texture` fills each owned cell with a per-category SVG pattern (in
 * addition to color) so categories stay distinguishable without color.
 * Proven directly: every owned cell's `fill` is a `url(#...)` pattern
 * reference, and `<defs>` has one `<pattern>` per category — cell count
 * itself is unaffected (owner-less cells, if any, stay unfilled).
 */
export const Texture: BaseStory = {
  render: () => (
    <WaffleChart
      width={280}
      height={280}
      data={fixture}
      texture
      ariaLabel="Waffle chart with per-category textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const categoryCount = fixture.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(categoryCount);
    // Every cell is owned (allocateCells sums exactly to cells * cells), so
    // every rendered <rect> should carry a textured fill.
    const marks = Array.from(canvasElement.querySelectorAll("rect")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(100);
  },
};
