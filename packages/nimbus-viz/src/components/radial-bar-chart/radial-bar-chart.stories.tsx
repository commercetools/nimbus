import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RadialBarChart } from "./radial-bar-chart";
import type { CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/RadialBarChart",
  render: () => <RegistryPreview base="RadialBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one angular slot, drawing their sectors on top
 * of each other with no error. `RadialBarChart` keys its angular band by row
 * INDEX instead, so three same-labeled rows still get three distinct sectors.
 * Asserts the fixed behavior directly: one `<path>` per row, each with a
 * distinct `d` (no two sectors drawn at the same angle).
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <RadialBarChart
      width={320}
      height={320}
      data={duplicateLabelFixture}
      ariaLabel="Radial bar chart of 3 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const sectors = canvasElement.querySelectorAll("path");
    expect(sectors).toHaveLength(duplicateLabelFixture.length);
    const shapes = Array.from(sectors).map((p) => p.getAttribute("d"));
    expect(new Set(shapes).size).toBe(duplicateLabelFixture.length);
  },
};

/**
 * BC-2/BC-3 (`docs/bug-classes.md`): the un-guarded `domain: [0, valueMax]`
 * had two failure modes for a negative value -- extrapolating past the
 * outer ring when `valueMax` was itself negative (BC-2), or, once every
 * value is <= 0, degenerating to `[0, 0]`, which `scaleLinear` maps to the
 * *range midpoint* for any input rather than the inner ring (BC-3).
 * `valueDomain` over clamped values fixes both.
 *
 * Rendered side by side with a control chart where the same row is a real
 * `0` instead of negative: both are built from the same-length category
 * array (so the angular slot for row "B" is identical), and clamping makes
 * `radius(Math.max(0, d.value))` identical for `-30` and `0` -- so a
 * correctly-clamped negative sector's `d` must be byte-for-byte the *same*
 * as the control's real-zero sector, and distinct from its own chart's real
 * (positive) row.
 */
const negativeRowFixture: CategoryDatum[] = [
  { category: "A", value: 100 },
  { category: "B", value: -30 },
  { category: "C", value: 60 },
];
const zeroControlFixture: CategoryDatum[] = [
  { category: "A", value: 100 },
  { category: "B", value: 0 },
  { category: "C", value: 60 },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <RadialBarChart
        width={260}
        height={260}
        data={negativeRowFixture}
        ariaLabel="Radial bar chart of three categories, category B negative"
      />
      <RadialBarChart
        width={260}
        height={260}
        data={zeroControlFixture}
        ariaLabel="Radial bar chart of three categories, category B a real zero"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
    const negativeSectors = svgs[0].querySelectorAll("path");
    const zeroSectors = svgs[1].querySelectorAll("path");
    expect(negativeSectors.length).toBe(3);
    expect(zeroSectors.length).toBe(3);

    // Row "B" (index 1, the negative one) collapses to the exact same
    // zero-radial-extent sector as the control's real 0 -- proving it's
    // clamped, not extrapolated past the outer ring or through the
    // degenerate-domain midpoint bug.
    expect(negativeSectors[1].getAttribute("d")).toBe(
      zeroSectors[1].getAttribute("d")
    );
    // And it's genuinely collapsed, not accidentally drawn like a real
    // value: distinct from its own chart's real, positive row A.
    expect(negativeSectors[1].getAttribute("d")).not.toBe(
      negativeSectors[0].getAttribute("d")
    );
  },
};
