import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { ParetoChart, ResponsiveContainer } from "../../";
import type { CategoryDatum } from "../../";
import type { BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const data = [
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 9 },
  { category: "Other", value: 5 },
];

const meta: Meta = {
  title: "Charts/ParetoChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ParetoChart width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover emphasis: hovering a bar outlines that ONE bar (`stroke`/
 * `strokeWidth`) and never dims its siblings — replacing the "dim everyone
 * else to a fixed opacity" pattern this chart used to hand-roll. Unlike
 * `bar-chart.tsx`, this chart's tooltip was never positioned from the
 * hovered bar's value-axis position to begin with (it always defaulted to a
 * fixed `top`), so there is no pointer-follow behavior to prove here — only
 * the outline-instead-of-dim change.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <ParetoChart width={480} height={280} data={data} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGPathElement>("path.visx-bar-rounded")
      );

    const firstBar = bars()[0];
    await userEvent.hover(firstBar);
    await waitFor(() =>
      expect(firstBar).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: every bar keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const bar of bars()) {
      expect(bar).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered bar gets a real outline.
    expect(bars()[1]).toHaveAttribute("stroke-width", "0");
  },
};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one band, drawing their bars (and cumulative
 * markers) on top of each other with no error. `ParetoChart` keys its x-band
 * by row INDEX instead, so four same-labeled rows still land on four
 * distinct positions. Asserts the fixed behavior directly on the cumulative
 * line's per-row markers (one `<circle>` per row, no legend swatches are SVG
 * circles): distinct `cx` for every row.
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 9 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <ParetoChart
      width={480}
      height={280}
      data={duplicateLabelFixture}
      ariaLabel="Pareto chart of 4 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const markers = canvasElement.querySelectorAll("circle");
    expect(markers).toHaveLength(duplicateLabelFixture.length);
    const positions = Array.from(markers).map((c) => c.getAttribute("cx"));
    expect(new Set(positions).size).toBe(duplicateLabelFixture.length);
  },
};

/**
 * BC-2 (`docs/bug-classes.md`): a rank/cumulative-share chart can't encode a
 * negative magnitude — summing it into the running total would distort every
 * later cumulative share. A negative value is now clamped to 0 before
 * ranking and summing (the tooltip and data table still show the raw value).
 * Proven by comparing against an identical control chart whose last category
 * is a literal 0: sort order depends only on the ORIGINAL value (-9 and 0
 * both sort last here), so the two charts' clamped rows — and therefore every
 * bar, the cumulative line, and its markers — must render byte-identical.
 */
const negRows: CategoryDatum[] = [
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: -9 },
];
const zeroControlRows: CategoryDatum[] = [
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 0 },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <ParetoChart
        width={360}
        height={260}
        data={negRows}
        ariaLabel="Pareto chart with a negative category value"
      />
      <ParetoChart
        width={360}
        height={260}
        data={zeroControlRows}
        ariaLabel="Pareto chart with a literal zero category value (control)"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Each `@visx/axis` tick label sits in its own nested <svg> (a local
    // coordinate system for the offset text) — querySelectorAll("svg") picks
    // those up too. role="img" is unique to the two chart-root <svg>s.
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const negBars = Array.from(
      svgs[0].querySelectorAll("path.visx-bar-rounded")
    );
    const zeroBars = Array.from(
      svgs[1].querySelectorAll("path.visx-bar-rounded")
    );
    expect(negBars).toHaveLength(zeroControlRows.length);
    expect(negBars.map((b) => b.getAttribute("d"))).toEqual(
      zeroBars.map((b) => b.getAttribute("d"))
    );
    for (const b of [...negBars, ...zeroBars]) {
      expect(b.getAttribute("d")).not.toMatch(/NaN/);
    }
  },
};
