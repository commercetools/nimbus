import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
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

/**
 * Hover/tooltip UX convergence: hovering a slice outlines that ONE slice
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the "dim
 * everyone else to 0.4 opacity" pattern this chart used to hand-roll.
 * `DonutChart` has no floating tooltip (the center label already swaps to
 * the hovered slice's share instead — see `donut-chart.mdx`), so this story
 * only proves the emphasis half of the convergence.
 */
const hoverFixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
];

export const HoverEmphasis: BaseStory = {
  render: () => <DonutChart width={280} height={280} data={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const slices = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));

    const firstSlice = slices()[0];
    await userEvent.hover(firstSlice);
    await waitFor(() =>
      expect(firstSlice).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: no slice carries an `opacity` attribute at all -- the old
    // mechanism this replaces.
    for (const slice of slices()) {
      expect(slice).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered slice gets a real outline.
    expect(firstSlice).toHaveAttribute("stroke-width", "1.5");
    expect(slices()[1]).toHaveAttribute("stroke-width", "0");
  },
};

/**
 * `showValues` draws each slice's formatted value just outside its outer
 * edge, at its midpoint angle. Every slice here clears `MIN_LABEL_ANGLE`
 * (each share is well above the ~5.5% threshold), so the labeled chart
 * gains exactly one `<text>` per slice over the unlabeled control.
 */
const valuesFixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
];

export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <DonutChart
        width={280}
        height={280}
        data={valuesFixture}
        ariaLabel="Donut chart without value labels"
      />
      <DonutChart
        width={280}
        height={280}
        data={valuesFixture}
        showValues
        ariaLabel="Donut chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (DonutChart uses the library
    // default role="img"; there is no nested <svg> anywhere in this chart --
    // no axes, no visx tick-label positioning trick).
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + valuesFixture.length);
  },
};
