import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  within,
  expect,
  waitFor,
  fn,
  fireEvent,
} from "storybook/test";
import { BulletChart, type BulletDatum } from "./bullet-chart";
import { ResponsiveContainer } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/BulletChart",
  render: () => <RegistryPreview base="BulletChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: BulletDatum[] = [
  {
    label: "Engineering",
    measure: 172_000,
    target: 180_000,
    ranges: [162_000, 180_000, 198_000],
  },
  { label: "Marketing", measure: 131_000, target: 120_000 },
];

export const Base: BaseStory = {};

// No `ranges` on either row here (unlike the shared `fixture` above), so
// each row renders exactly one band rect then one measure-bar rect, in
// that order -- same convention `EdgeCaseNegativeValues` below already
// relies on -- making the bar indices deterministic for this story.
const hoverFixture: BulletDatum[] = [
  { label: "Engineering", measure: 172_000, target: 180_000 },
  { label: "Marketing", measure: 131_000, target: 120_000 },
];

/**
 * Hover/tooltip UX convergence: hovering a row outlines that row's measure
 * bar (`stroke`/`strokeWidth`) and never dims its siblings — replacing the
 * "dim everyone else to a fixed opacity" pattern this chart used to
 * hand-roll. This chart is horizontal-layout (value axis is x), so the
 * tooltip's HORIZONTAL position tracks the live pointer while it stays
 * inside the same row's bar, rather than being pinned once to the bar's
 * own value-derived x position; the row axis (its vertical `top`) stays
 * snapped to the hovered row, unchanged.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <BulletChart width={480} height={160} data={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const rects = () =>
      Array.from(canvasElement.querySelectorAll<SVGRectElement>("rect"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipLeft = () => {
      const g = tooltipGroup();
      const match = g
        ?.getAttribute("transform")
        ?.match(/translate\(\s*([\d.-]+)/);
      return match ? Number(match[1]) : null;
    };

    // Each row (no `ranges`) renders one band rect then one measure-bar
    // rect: [row0 band, row0 bar, row1 band, row1 bar].
    const firstBar = rects()[1];
    const secondBar = rects()[3];

    await userEvent.hover(firstBar);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every rect keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const rect of rects()) {
      expect(rect).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered row's measure bar gets a real
    // outline; the other row's measure bar does not.
    expect(firstBar).toHaveAttribute("stroke-width", "1.5");
    expect(secondBar).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different x positions
    // within the SAME bar move the tooltip to two different horizontal
    // positions.
    const rect = firstBar.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    fireEvent.mouseMove(firstBar, {
      clientX: rect.left + rect.width * 0.25,
      clientY: cy,
    });
    const leftNearStart = await waitFor(() => {
      const l = tooltipLeft();
      expect(l).not.toBeNull();
      return l;
    });
    fireEvent.mouseMove(firstBar, {
      clientX: rect.left + rect.width * 0.75,
      clientY: cy,
    });
    await waitFor(() => expect(tooltipLeft()).not.toBe(leftNearStart));
  },
};

/**
 * Proves the two accessibility features `bullet-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `BulletChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <BulletChart
      width={480}
      height={160}
      data={fixture}
      ariaLabel="Budget versus actual spend by department"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries an accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label");
      expect(svg?.getAttribute("aria-label")).not.toBe("");
    });

    await step("Data table is reachable by keyboard", async () => {
      await userEvent.tab();
      const toggle = canvas.getByRole("button", {
        name: /view data as table/i,
      });
      expect(toggle).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(
          canvas.getByRole("region", { name: /data table/i })
        ).toBeInTheDocument();
      });
    });
  },
};

/**
 * `ranges`: omit it (single band spanning the domain) or supply ascending
 * qualitative breakpoints (multiple bands, lighter toward the low end).
 */
export const Ranges: BaseStory = {
  render: () => (
    <BulletChart
      width={480}
      height={160}
      data={[
        { label: "No ranges (single band)", measure: 172_000, target: 180_000 },
        {
          label: "With ranges (poor/ok/good)",
          measure: 172_000,
          target: 180_000,
          ranges: [162_000, 180_000, 198_000],
        },
      ]}
    />
  ),
};

/**
 * `onDatumClick`/`onDatumHover` are wired on each row's own `<g>` — a
 * discrete hit target, same direct-mark-wiring pattern as `StackedBarChart`.
 * Both report the **whole row** (`BulletDatum`), not one field.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <BulletChart
      width={480}
      height={160}
      data={fixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    // The first row's measure bar (fill=theme.accent) is the second <rect>
    // in document order — the default single band renders first.
    const firstBar = () =>
      canvasElement.querySelectorAll<SVGRectElement>("rect")[1];

    await step(
      "Hovering the first row reports its whole BulletDatum",
      async () => {
        await userEvent.hover(firstBar()!);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual(fixture[0]);
        expect(call?.index).toBe(0);
      }
    );

    await step(
      "Clicking the first row fires onDatumClick with the same row",
      async () => {
        await userEvent.click(firstBar()!);
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual(fixture[0]);
        expect(call?.index).toBe(0);
      }
    );
  },
};

/** `bullet-chart.mdx` "API reference": renders `null` for empty `data`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <BulletChart width={200} height={100} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * Negative `measure`/`target` used to render wrong: the x-scale domain was
 * hardcoded to `[0, domainMax]`, so a negative `measure` mapped to a
 * negative pixel, which `width={Math.max(0, xScale(measure))}` clamped to a
 * zero-width bar — indistinguishable from `measure=0` — and a negative
 * `target` extrapolated the tick into the left margin. Fixed by widening
 * the domain to `[domainMin, domainMax]` and growing the measure bar from
 * the shared zero baseline (`xScale(0)`) in either direction. Compares the
 * negative row against an ordinary positive row on the same shared scale,
 * rather than asserting isolated pixel values, so this doesn't need to know
 * the exact niced domain.
 */
export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <BulletChart
      width={400}
      height={160}
      data={[
        { label: "Ordinary", measure: 10_000, target: 15_000 },
        { label: "Net margin", measure: -15_000, target: -5_000 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<SVGRectElement>("rect");
    // Each row (no `ranges`) renders exactly one band then one measure bar,
    // in that order: [row0 band, row0 bar, row1 band, row1 bar].
    const ordinaryBar = bars[1];
    const negativeBar = bars[3];
    const ordinaryX = Number(ordinaryBar.getAttribute("x"));
    const negativeX = Number(negativeBar.getAttribute("x"));
    const negativeWidth = Number(negativeBar.getAttribute("width"));

    // Non-zero width — not the old collapsed-to-0 bug.
    expect(negativeWidth).toBeGreaterThan(1);
    // The negative row's bar starts left of the ordinary row's bar, which
    // itself starts exactly at the shared zero baseline — i.e. the negative
    // bar sits on the other side of zero, not on top of/past it.
    expect(negativeX).toBeLessThan(ordinaryX);

    // The negative row's target tick no longer extrapolates into the
    // left margin (a negative pixel) now that the domain includes it.
    const ticks = canvasElement.querySelectorAll<SVGLineElement>("line");
    const negativeTick = ticks[1];
    expect(Number(negativeTick.getAttribute("x1"))).toBeGreaterThanOrEqual(0);
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={160}>
        {(width, height) => (
          <BulletChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
