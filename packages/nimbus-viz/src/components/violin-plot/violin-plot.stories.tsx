import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { ViolinPlot, type SampleGroup } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ViolinPlot",
  render: () => <RegistryPreview base="ViolinPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixtureGroups: SampleGroup[] = [
  { label: "Alpha", samples: [10, 12, 14, 16, 18, 14, 13, 15] },
  { label: "Beta", samples: [20, 22, 24, 26, 28, 24, 23, 25] },
  { label: "Gamma", samples: [30, 32, 34, 36, 38, 34, 33, 35] },
];

/**
 * Hover/tooltip UX convergence: hovering a violin thickens that ONE violin's
 * own outline (`strokeWidth`) and never dims its siblings — replacing the
 * "dim everyone else to a lower fixed opacity" pattern this chart used to
 * hand-roll on the violin's fill. A violin's shape is a small, fixed-extent
 * mark with no useful interior to track a pointer within, so this chart has
 * no pointer-follow behavior to test, and none was added.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <ViolinPlot width={480} height={320} groups={hoverFixtureGroups} />
  ),
  play: async ({ canvasElement }) => {
    // One `<path>` per violin, in group order.
    const violins = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    const firstViolin = violins()[0];
    await userEvent.hover(firstViolin);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every violin keeps the exact same fill opacity regardless
    // of which one is hovered, and none carries an `opacity` attribute at
    // all (the old mechanism this replaces).
    for (const violin of violins()) {
      expect(violin).not.toHaveAttribute("opacity");
      expect(violin).toHaveAttribute("fill-opacity", "0.28");
    }
    // Emphasis instead: only the hovered violin's outline thickens.
    expect(firstViolin).toHaveAttribute("stroke-width", "3");
    expect(violins()[1]).toHaveAttribute("stroke-width", "1.5");
  },
};

const duplicateLabelGroups: SampleGroup[] = duplicateLabels([
  { label: "Alpha", samples: [10, 12, 14, 16, 18] },
  { label: "Beta", samples: [20, 22, 24, 26, 28] },
  { label: "Gamma", samples: [30, 32, 34, 36, 38] },
]);

// BC-1 regression guard: all three groups now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three violins still draw at distinct horizontal positions instead of
// collapsing onto a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <ViolinPlot
      width={480}
      height={320}
      groups={duplicateLabelGroups}
      ariaLabel="Violin plot with duplicate group labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const violins = svg!.querySelectorAll("path");
    expect(violins).toHaveLength(duplicateLabelGroups.length);
    const ds = new Set(Array.from(violins).map((p) => p.getAttribute("d")));
    expect(ds.size).toBe(duplicateLabelGroups.length);
  },
};
