import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { LollipopChart } from "./lollipop-chart";
import type { CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels, negateEveryOther } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/LollipopChart",
  render: () => <RegistryPreview base="LollipopChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const hoverFixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
];

/**
 * Hover emphasis: hovering a row enlarges that ONE dot's radius and never
 * dims its siblings — replacing the "dim everyone else to a fixed opacity"
 * pattern this chart used to hand-roll on the wrapping `<g>`. Unlike
 * `bar-chart.tsx`'s filled bars, this chart's mark is a stem + a small
 * circle head, so a radius bump (not an outline) is the emphasis mechanism
 * — and there is no `SvgTooltip` on this chart at all (values are always
 * shown as direct on-mark text), so there is no pointer-follow behavior to
 * prove here.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <LollipopChart width={480} height={280} data={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const dots = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));

    const restingRadii = dots().map((c) => Number(c.getAttribute("r")));
    const firstDot = dots()[0];
    await userEvent.hover(firstDot);
    await waitFor(() =>
      expect(Number(dots()[0].getAttribute("r"))).toBeGreaterThan(
        restingRadii[0]
      )
    );

    // No dimming: every mark keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const dot of dots()) {
      expect(dot).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered dot's radius grows; an unhovered
    // sibling keeps its original (smaller) radius.
    expect(Number(dots()[1].getAttribute("r"))).toBe(restingRadii[1]);
  },
};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one band, drawing them on top of each other
 * with no error. `LollipopChart` keys its y-band by row INDEX instead, so
 * three same-labeled rows still land on three distinct positions. Asserts the
 * fixed behavior directly: one `<circle>` per row, each at a distinct `cy`.
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <LollipopChart
      width={320}
      height={240}
      data={duplicateLabelFixture}
      ariaLabel="Lollipop chart of 3 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const dots = canvasElement.querySelectorAll("circle");
    expect(dots).toHaveLength(duplicateLabelFixture.length);
    const positions = Array.from(dots).map((c) => c.getAttribute("cy"));
    expect(new Set(positions).size).toBe(duplicateLabelFixture.length);
  },
};

/**
 * BC-2 (`docs/bug-classes.md`): a `[0, max]` value domain clamped a negative
 * value's dot to the baseline (`Math.max(0, xScale(d.value))`), collapsing
 * every negative row onto the same invisible point instead of drawing it on
 * the other side of the zero line. `LollipopChart` now scales from
 * `valueDomain()` and draws each stem from `zeroX` outward, so a negative
 * row's dot sits left of the baseline.
 */
const negativeFixture: CategoryDatum[] = negateEveryOther([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
]);

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <LollipopChart
      width={320}
      height={240}
      data={negativeFixture}
      ariaLabel="Lollipop chart of 4 categories, two of them negative"
    />
  ),
  play: async ({ canvasElement }) => {
    const lines = Array.from(
      canvasElement.querySelectorAll<SVGLineElement>("line")
    );
    const dots = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    );
    expect(dots).toHaveLength(negativeFixture.length);

    // Every stem starts at the same zero-baseline column.
    const zeroX = Number(lines[0].getAttribute("x1"));
    expect(lines.every((l) => Number(l.getAttribute("x1")) === zeroX)).toBe(
      true
    );

    const cxs = dots.map((c) => Number(c.getAttribute("cx")));
    const negativeCxs = cxs.filter((cx) => cx < zeroX);
    const positiveCxs = cxs.filter((cx) => cx >= zeroX);
    // negateEveryOther negates the odd-indexed rows (Mobile, Partner).
    expect(negativeCxs).toHaveLength(2);
    expect(positiveCxs).toHaveLength(2);
  },
};
