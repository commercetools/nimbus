import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ChordDiagram } from "./chord-diagram";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ChordDiagram",
  render: () => <RegistryPreview base="ChordDiagram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const textureFixture = {
  labels: ["Search", "Social", "Email"],
  matrix: [
    [0, 18, 9],
    [14, 0, 12],
    [7, 15, 0],
  ],
};

/**
 * `D2`: `texture` fills every ribbon and arc with a per-entity SVG pattern (in
 * addition to color) so entities stay distinguishable without color. Proven
 * directly: every ribbon/arc's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per entity.
 */
export const Texture: BaseStory = {
  render: () => (
    <ChordDiagram
      width={360}
      height={320}
      data={textureFixture}
      texture
      ariaLabel="Chord diagram with per-entity textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const entityCount = textureFixture.labels.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(entityCount);
    const marks = Array.from(canvasElement.querySelectorAll("path")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    // One arc per entity (3) plus one ribbon per pair exchanging volume in
    // either direction — every one of the 3 possible pairs here (Search↔
    // Social, Search↔Email, Social↔Email) has flow, so 3 ribbons + 3 arcs.
    expect(marks.length).toBe(entityCount + 3);
  },
};
