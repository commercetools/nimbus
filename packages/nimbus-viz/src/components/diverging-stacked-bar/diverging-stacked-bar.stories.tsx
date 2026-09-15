import type { Meta } from "@storybook/react-vite";
import { userEvent, fireEvent, expect, waitFor } from "storybook/test";
import { DivergingStackedBar } from "./diverging-stacked-bar";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/DivergingStackedBar",
  render: () => <RegistryPreview base="DivergingStackedBar" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: StackRow[] = [
  {
    category: "Item A",
    segments: [
      { key: "Disagree", value: 40 },
      { key: "Neutral", value: 10 },
      { key: "Agree", value: 50 },
    ],
  },
  {
    category: "Item B",
    segments: [
      { key: "Disagree", value: 35 },
      { key: "Neutral", value: 8 },
      { key: "Agree", value: 45 },
    ],
  },
];

/**
 * Hover/tooltip UX convergence: hovering a segment outlines that ONE segment
 * (`stroke`/`strokeWidth`) and never dims its siblings -- replacing the "dim
 * everyone else to a fixed opacity" pattern this chart (and 30 others) used
 * to hand-roll independently. This chart's value axis runs along x
 * (horizontal layout), so the tooltip's HORIZONTAL position tracks the live
 * pointer while it stays inside the hovered segment -- the category axis
 * (`top`, on y) stays snapped to the hovered row's own band position.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <DivergingStackedBar width={480} height={280} data={hoverFixture} />
  ),
  play: async ({ canvasElement }) => {
    const rects = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipLeft = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/\(([\d.-]+),/);
      return match ? Number(match[1]) : null;
    };

    // DOM order: Item A's Disagree, Neutral, Agree, then Item B's.
    const [itemADisagree, itemANeutral] = rects();
    await userEvent.hover(itemADisagree);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every segment keeps a full, unmodified fill -- none
    // carries an `opacity` attribute at all (the old mechanism this
    // replaces).
    for (const rect of rects()) {
      expect(rect).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered segment gets a real outline.
    expect(itemADisagree).toHaveAttribute("stroke-width", "1.5");
    expect(itemANeutral).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer horizontally: two mousemoves at different
    // widths within the SAME segment move the tooltip to two different
    // horizontal positions.
    const rect = itemADisagree.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    fireEvent.mouseMove(itemADisagree, {
      clientX: rect.left + rect.width * 0.25,
      clientY: cy,
    });
    const leftNearStart = await waitFor(() => {
      const l = tooltipLeft();
      expect(l).not.toBeNull();
      return l;
    });
    fireEvent.mouseMove(itemADisagree, {
      clientX: rect.left + rect.width * 0.75,
      clientY: cy,
    });
    await waitFor(() => expect(tooltipLeft()).not.toBe(leftNearStart));
  },
};

/**
 * BC-1 regression: `bandByIndex` positions each row's `y` band by row order,
 * not by the category label, so three rows sharing one label ("Item A"
 * below, after `duplicateLabels`) still render at three distinct heights
 * instead of collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "Item A",
    segments: [
      { key: "Disagree", value: 10 },
      { key: "Neutral", value: 5 },
      { key: "Agree", value: 15 },
    ],
  },
  {
    category: "Item B",
    segments: [
      { key: "Disagree", value: 8 },
      { key: "Neutral", value: 6 },
      { key: "Agree", value: 20 },
    ],
  },
  {
    category: "Item C",
    segments: [
      { key: "Disagree", value: 12 },
      { key: "Neutral", value: 4 },
      { key: "Agree", value: 18 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <DivergingStackedBar
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Diverging stacked bar with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const segmentsPerRow = dupFixture[0].segments.length;
    const rects = Array.from(canvasElement.querySelectorAll("rect"));
    expect(rects.length).toBe(dupFixture.length * segmentsPerRow);

    // Every segment in a row shares that row's y; rows land at distinct ys.
    const rowYs = rects
      .filter((_, i) => i % segmentsPerRow === 0)
      .map((r) => r.getAttribute("y"));
    expect(new Set(rowYs).size).toBe(dupFixture.length);
  },
};
