import type { Meta } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
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

/**
 * `showValues` draws each cell's own formatted value centered in it, when
 * the cell is large enough to hold the text (the same minimum-size gate
 * `treemap.tsx` uses for its own labels) -- small cells stay unlabeled
 * rather than overflowing their neighbors. This fixture's cells are all
 * comfortably above that threshold, so every segment gets a label. Proven
 * the same way as `bar-chart.tsx`'s reference: the with-labels chart
 * carries exactly one extra `<text>` per segment over the without-labels
 * chart.
 */
const showValuesFixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 200 },
      { key: "Returning", value: 100 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 220 },
      { key: "Returning", value: 140 },
    ],
  },
];

export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <MarimekkoChart
        width={320}
        height={280}
        data={showValuesFixture}
        ariaLabel="Marimekko chart without value labels"
      />
      <MarimekkoChart
        width={320}
        height={280}
        data={showValuesFixture}
        showValues
        ariaLabel="Marimekko chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (MarimekkoChart uses the
    // library default role="img" -- it has no keyboard-focusable marks).
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    const segmentCount = showValuesFixture.reduce(
      (sum, row) => sum + row.segments.length,
      0
    );
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + segmentCount);
  },
};

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

/**
 * Hover/tooltip UX convergence: hovering a cell outlines that ONE cell
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the "dim
 * everyone else to 0.4 opacity" pattern this chart used to hand-roll. The
 * tooltip's vertical position tracks the live pointer while it stays inside
 * the same cell, the same convergence `BarChart` got first.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <MarimekkoChart width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const cells = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipTop = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/,\s*([\d.-]+)\)/);
      return match ? Number(match[1]) : null;
    };

    const firstCell = cells()[0];
    await userEvent.hover(firstCell);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every cell keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const cell of cells()) {
      expect(cell).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered cell gets a real outline.
    expect(firstCell).toHaveAttribute("stroke-width", "1.5");
    expect(cells()[1]).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different heights
    // within the SAME cell move the tooltip to two different positions.
    const rect = firstCell.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    fireEvent.mouseMove(firstCell, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.25,
    });
    const topNearTop = await waitFor(() => {
      const t = tooltipTop();
      expect(t).not.toBeNull();
      return t;
    });
    fireEvent.mouseMove(firstCell, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.75,
    });
    await waitFor(() => expect(tooltipTop()).not.toBe(topNearTop));
  },
};
