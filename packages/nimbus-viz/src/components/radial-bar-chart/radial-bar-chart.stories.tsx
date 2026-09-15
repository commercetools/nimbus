import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
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
 * Hover/tooltip UX convergence: hovering a sector outlines that ONE sector
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the "dim
 * everyone else to 0.35 opacity" pattern this chart used to hand-roll.
 *
 * Pointer-follow is intentionally skipped here (unlike `BarChart`): a radial
 * sector's "along the bar" direction is the distance from the polar center,
 * which does not map cleanly onto `SvgTooltip`'s cartesian `x`/`top` anchor
 * for every angle — moving the pointer outward on a sector near 3 o'clock
 * barely changes its y at all, so tying the tooltip's position to radial
 * distance would move it in a direction unrelated to the pointer's actual
 * motion for most sectors. The tooltip stays pinned to the top of the plot;
 * dimming removal is the fix that applies here.
 */
const hoverFixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
];

/**
 * `showValues` draws each bar's formatted value centered inside its own
 * sector, in a WCAG-contrast-aware color -- not at the rim (the rim is
 * already claimed by the always-on category label). Every sector here
 * clears both minimum-size gates (`MIN_LABEL_THICKNESS`/`MIN_LABEL_ARC_WIDTH`),
 * so the labeled chart gains exactly one `<text>` per bar over the
 * unlabeled control.
 */
const valuesFixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
];

export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <RadialBarChart
        width={280}
        height={280}
        data={valuesFixture}
        ariaLabel="Radial bar chart without value labels"
      />
      <RadialBarChart
        width={280}
        height={280}
        data={valuesFixture}
        showValues
        ariaLabel="Radial bar chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (RadialBarChart uses the
    // library default role="img"; there is no nested <svg> anywhere in this
    // chart -- no axes, no visx tick-label positioning trick).
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + valuesFixture.length);
  },
};

export const HoverEmphasis: BaseStory = {
  render: () => <RadialBarChart width={320} height={320} data={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const sectors = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));

    const firstSector = sectors()[0];
    await userEvent.hover(firstSector);
    await waitFor(() =>
      expect(firstSector).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: no sector carries an `opacity` attribute at all -- the old
    // mechanism this replaces.
    for (const sector of sectors()) {
      expect(sector).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered sector gets a real outline.
    expect(firstSector).toHaveAttribute("stroke-width", "1.5");
    expect(sectors()[1]).toHaveAttribute("stroke-width", "0");
  },
};

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
