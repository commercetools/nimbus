import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { BumpChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const series = [
  {
    id: "alpha",
    label: "Alpha",
    data: [
      { x: 0, y: 30 },
      { x: 1, y: 28 },
      { x: 2, y: 35 },
      { x: 3, y: 40 },
      { x: 4, y: 38 },
    ],
  },
  {
    id: "beta",
    label: "Beta",
    data: [
      { x: 0, y: 25 },
      { x: 1, y: 32 },
      { x: 2, y: 20 },
      { x: 3, y: 22 },
      { x: 4, y: 27 },
    ],
  },
  {
    id: "gamma",
    label: "Gamma",
    data: [
      { x: 0, y: 18 },
      { x: 1, y: 15 },
      { x: 2, y: 28 },
      { x: 3, y: 33 },
      { x: 4, y: 41 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/BumpChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <BumpChart width={width} height={height} series={series} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence with `bar-chart.tsx`: hovering a point bolds
 * its whole series (thicker line, bigger dot -- the chart's existing bump
 * mechanisms) and never dims the other series' `opacity` (the old mechanism
 * this replaces). Line/point charts like this one have no wide mark to move
 * a pointer within, so there's no tooltip-follows-pointer part here.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <BumpChart width={480} height={320} series={series} />,
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector<SVGElement>('svg[role="img"]');
    const lines = () =>
      Array.from(chart!.querySelectorAll<SVGPathElement>("path.visx-linepath"));
    const circles = () =>
      Array.from(chart!.querySelectorAll<SVGCircleElement>("circle"));

    // Hover the first point of the first series ("Alpha").
    const firstCircle = circles()[0];
    await userEvent.hover(firstCircle);
    await waitFor(() =>
      expect(lines()[0]).toHaveAttribute("stroke-width", "3")
    );

    // No dimming: every series' <g> wrapper (and every line/point within it)
    // keeps full, unmodified opacity -- none carries an `opacity` attribute
    // tied to hover (the old mechanism this replaces).
    for (const g of Array.from(chart!.querySelectorAll("g"))) {
      expect(g).not.toHaveAttribute("opacity");
    }
    for (const line of lines()) {
      expect(line).not.toHaveAttribute("opacity");
    }
    for (const c of circles()) {
      expect(c).not.toHaveAttribute("opacity");
    }

    // Emphasis instead: only the hovered series' line thickens, and only its
    // hovered point grows.
    expect(lines()[1]).toHaveAttribute("stroke-width", "2"); // sibling series, unhovered
    expect(firstCircle).toHaveAttribute("r", "6");
    expect(circles()[1]).toHaveAttribute("r", "4"); // sibling point, unhovered
  },
};

/**
 * `D2/D3-rest`: `texture` distinguishes series by `strokeDasharray` rhythm
 * (in addition to color) -- the stroked-mark reference for this rollout,
 * same as `LineChart`'s own `Texture` story: the rank line has no fill area
 * to texture, so the dash rhythm on the stroke is the one non-color channel.
 * Only the line carries the dash -- the per-rank point markers stay plain
 * solid-filled circles either way. Proven directly: the first series
 * (`Alpha`) keeps a solid stroke (no `stroke-dasharray` attribute at all),
 * later series get a real dash pattern.
 */
export const Texture: BaseStory = {
  render: () => (
    <BumpChart
      width={420}
      height={280}
      series={series}
      texture
      ariaLabel="Bump chart with per-series dash rhythm"
    />
  ),
  play: async ({ canvasElement }) => {
    // Scope to the chart's own <svg role="img">: AxisLeft/AxisBottom render
    // their own nested <svg> for tick-label positioning (visx's positioning
    // trick), which would otherwise match too and carry no marks of their
    // own.
    const chart = canvasElement.querySelector<SVGElement>('svg[role="img"]');
    expect(chart).toBeTruthy();
    const lines = Array.from(
      chart!.querySelectorAll<SVGPathElement>("path.visx-linepath")
    );
    expect(lines).toHaveLength(series.length);
    expect(lines[0]).not.toHaveAttribute("stroke-dasharray"); // first series: unchanged solid stroke
    expect(lines[1]).toHaveAttribute("stroke-dasharray"); // second series: dash-encoded
    expect(lines[1].getAttribute("stroke-dasharray")).not.toBe("");
    // Per-rank point markers stay plain circles -- dash doesn't apply to them.
    const circles = chart!.querySelectorAll("circle");
    const totalPoints = series.reduce((n, s) => n + s.data.length, 0);
    expect(circles).toHaveLength(totalPoints);
  },
};
