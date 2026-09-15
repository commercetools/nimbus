import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { MarimekkoChart } from "./marimekko-chart";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/MarimekkoChart",
  render: () => <RegistryPreview base="MarimekkoChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 120 },
      { key: "Returning", value: 80 },
      { key: "Wholesale", value: 40 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 140 },
      { key: "Returning", value: 96 },
      { key: "Wholesale", value: 52 },
    ],
  },
];

/**
 * `D2`: `texture` fills each segment with a per-key SVG pattern (in addition
 * to color) so segments stay distinguishable without color. Proven
 * directly: every segment's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per segment key.
 */
export const Texture: BaseStory = {
  render: () => (
    <MarimekkoChart
      width={360}
      height={240}
      data={fixture}
      texture
      ariaLabel="Marimekko chart with per-segment textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const keyCount = fixture[0].segments.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(keyCount);
    const marks = Array.from(canvasElement.querySelectorAll("rect")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(fixture.length * keyCount);
  },
};
