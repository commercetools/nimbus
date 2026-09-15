import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import { BarChart } from "./bar-chart";
import { ResponsiveContainer, ReferenceLine, type CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/BarChart",
  render: () => <RegistryPreview base="BarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
  { category: "Email", value: 1200 },
];

export const Base: BaseStory = {};

/**
 * Proves the accessibility features `bar-chart.mdx` claims: `role`
 * (`"graphics-document"`, not the library default `"img"` — `D1-rest`'s
 * roving-tabindex marks need a container role that allows focusable
 * descendants, which `"img"` deliberately does not) + a real `aria-label`,
 * and the keyboard-reachable data-table fallback (WCAG 1.1.1) that
 * `ChartContainer` renders whenever `table` is passed — which `BarChart`
 * does, in both orientations.
 */
export const Accessibility: BaseStory = {
  render: () => (
    <BarChart
      width={480}
      height={280}
      data={fixture}
      ariaLabel="Bar chart of revenue by channel, where Web leads"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries the accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "graphics-document");
      expect(svg).toHaveAttribute(
        "aria-label",
        "Bar chart of revenue by channel, where Web leads"
      );
    });

    await step(
      "Data table is reachable by keyboard, not just by mouse",
      async () => {
        const toggle = canvas.getByRole("button", {
          name: /view data as table/i,
        });
        // `D1-rest`'s focusable bars are earlier Tab stops than the toggle
        // (5 bars ahead of it in DOM order) -- tab until it's reached
        // rather than assuming a fixed count.
        for (let i = 0; i < 10 && document.activeElement !== toggle; i++) {
          await userEvent.tab();
        }
        expect(toggle).toHaveFocus();

        await userEvent.keyboard("{Enter}");
        const region = await waitFor(() =>
          canvas.getByRole("region", { name: /data table/i })
        );
        // Real row data, not just an empty disclosure.
        expect(within(region).getByText("Web")).toBeInTheDocument();
        expect(within(region).getByText("4200")).toBeInTheDocument();
      }
    );
  },
};

/**
 * `orientation` isn't a single visual swap — the horizontal (ranked) form
 * also sorts descending and swaps to direct end-labels instead of an axis.
 * Both forms host overlays as of `A1b` (see `OrientationAwareOverlay`
 * below) — both are shown side by side here, so a regression in either is
 * visible without diffing props.
 */
export const Orientation: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <BarChart
          width={320}
          height={240}
          data={fixture}
          ariaLabel="Bar chart of 5 categories, vertical orientation"
        />
      </div>
      <div style={{ flex: 1 }}>
        <BarChart
          width={320}
          height={240}
          data={fixture}
          orientation="horizontal"
          ariaLabel="Bar chart of 5 categories, horizontal orientation"
        />
      </div>
    </div>
  ),
};

/**
 * `A1b`: a `ReferenceLine` composed as `children` draws correctly in BOTH
 * orientations with the exact same `value`/default `orientation="horizontal"`
 * (= "mark the value axis") -- no prop needs to change between them. On the
 * vertical chart (value on y) it's a level spanning the width; on the
 * horizontal chart (value on x, `ChartScales.orientation: "horizontal"`) the
 * SAME props draw a line spanning the height instead, because `ReferenceLine`
 * reads the chart's own orientation rather than assuming value is always y.
 */
export const OrientationAwareOverlay: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <BarChart
          width={320}
          height={240}
          data={fixture}
          ariaLabel="Bar chart, vertical, with a value threshold line"
        >
          <ReferenceLine value={2500} label="Target" variant="accent" />
        </BarChart>
      </div>
      <div style={{ flex: 1 }}>
        <BarChart
          width={320}
          height={240}
          data={fixture}
          orientation="horizontal"
          ariaLabel="Bar chart, horizontal, with the same value threshold line"
        >
          <ReferenceLine value={2500} label="Target" variant="accent" />
        </BarChart>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // `ReferenceLine`'s dashed line is the only `<line>` with a
    // `stroke-dasharray` -- axis tick/gridlines have none -- so this
    // isolates the two overlay lines from the axes' own `<line>`s.
    const lines = canvasElement.querySelectorAll("line[stroke-dasharray]");
    expect(lines).toHaveLength(2);
    const [verticalLine, horizontalChartsLine] = Array.from(lines);
    // Vertical chart: the value line is screen-HORIZONTAL (y1 === y2).
    expect(verticalLine.getAttribute("y1")).toBe(
      verticalLine.getAttribute("y2")
    );
    // Horizontal chart: the SAME value line is now screen-VERTICAL
    // (x1 === x2) -- this is the actual A1b fix, proven end to end against
    // the real BarChart component, not just the overlay's own unit spec.
    expect(horizontalChartsLine.getAttribute("x1")).toBe(
      horizontalChartsLine.getAttribute("x2")
    );
  },
};

/**
 * `onDatumClick`/`onDatumHover` (`bar-chart.mdx` "Interaction callbacks").
 * Bars render as `<path>` via `@visx/shape`'s `BarRounded`. Since `D1-rest`
 * they DO carry `role="button"` + a real `aria-label` (see `KeyboardNav`
 * below), but this story predates that and a plain DOM query still works
 * fine for a mouse-driven hover/click check, so it's left as-is.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <BarChart
      width={480}
      height={280}
      data={fixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const firstBar = () => canvasElement.querySelector<SVGPathElement>("path");

    await step("Hovering the first bar reports its datum", async () => {
      await userEvent.hover(firstBar()!);
      await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
      const call = handleDatumHover.mock.calls.at(-1)![0];
      expect(call?.datum).toEqual(fixture[0]);
      expect(call?.index).toBe(0);
    });

    await step(
      "Clicking the first bar fires onDatumClick with its datum",
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

/**
 * Hover/tooltip UX convergence: hovering a bar outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the
 * "dim everyone else to a fixed opacity" pattern this chart (and 30 others)
 * used to hand-roll independently. The tooltip's vertical position tracks
 * the live pointer while it stays inside the same bar, rather than being
 * pinned once to the bar's own value height.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <BarChart width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipTop = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/,\s*([\d.-]+)\)/);
      return match ? Number(match[1]) : null;
    };

    const firstBar = bars()[0];
    await userEvent.hover(firstBar);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every bar keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const bar of bars()) {
      expect(bar).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered bar gets a real outline.
    expect(firstBar).toHaveAttribute("stroke-width", "1.5");
    expect(bars()[1]).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different heights
    // within the SAME bar move the tooltip to two different positions.
    const rect = firstBar.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    fireEvent.mouseMove(firstBar, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.25,
    });
    const topNearTop = await waitFor(() => {
      const t = tooltipTop();
      expect(t).not.toBeNull();
      return t;
    });
    fireEvent.mouseMove(firstBar, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.75,
    });
    await waitFor(() => expect(tooltipTop()).not.toBe(topNearTop));
  },
};

/**
 * `showValues` (Phase B): draws each bar's formatted value directly above
 * (or, for a negative bar, below) its outer end -- the vertical
 * orientation's new opt-in equivalent of the horizontal orientation's
 * always-on value labels. Default `false`; omitting the prop renders
 * exactly as before this existed. Two instances side by side (each its own
 * distinct `ariaLabel`, per this file's own established multi-instance
 * convention) prove the causal link directly: turning the prop on adds
 * exactly one new `<text>` per bar, not a guessed formatted string.
 */
export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <BarChart
        width={240}
        height={280}
        data={fixture}
        ariaLabel="Bar chart without value labels"
      />
      <BarChart
        width={240}
        height={280}
        data={fixture}
        showValues
        ariaLabel="Bar chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (BarChart uses
    // role="graphics-document", not "img" -- it has keyboard-focusable
    // marks, and "img" disallows focusable descendants). Axis tick labels
    // render their own nested <svg> (visx's positioning trick), which
    // would otherwise inflate this count too.
    const svgs = canvasElement.querySelectorAll(
      'svg[role="graphics-document"]'
    );
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + fixture.length);
  },
};

/**
 * `D1-rest`: roving-tabindex keyboard traversal of individual bars. Tab
 * enters the chart on the first bar (its own `tabIndex` starts at 0, every
 * other bar at -1); ArrowRight/ArrowLeft move both the roving tab stop and
 * real DOM focus; focusing a bar reports it through `onDatumHover` -- the
 * keyboard equivalent of hover, which is what shows its tooltip; Enter/Space
 * activate `onDatumClick`, since each bar's `role="button"` promises that
 * per WAI-ARIA; Escape blurs (dismissing the tooltip) without losing the
 * roving position.
 */
const handleKeyNavClick = fn();
const handleKeyNavHover = fn();

export const KeyboardNav: BaseStory = {
  render: () => (
    <BarChart
      width={480}
      height={280}
      data={fixture}
      onDatumClick={handleKeyNavClick}
      onDatumHover={handleKeyNavHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const bars = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGPathElement>('path[role="button"]')
      );

    await step("Tab enters the chart on the first bar", async () => {
      await userEvent.tab();
      expect(document.activeElement).toBe(bars()[0]);
      expect(bars()[0]).toHaveAttribute("tabindex", "0");
      expect(bars()[1]).toHaveAttribute("tabindex", "-1");
      await waitFor(() => expect(handleKeyNavHover).toHaveBeenCalled());
      expect(handleKeyNavHover.mock.calls.at(-1)![0]?.index).toBe(0);
    });

    await step("ArrowRight moves the roving tab stop and focus", async () => {
      await userEvent.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(bars()[1]);
      expect(bars()[0]).toHaveAttribute("tabindex", "-1");
      expect(bars()[1]).toHaveAttribute("tabindex", "0");
      expect(handleKeyNavHover.mock.calls.at(-1)![0]?.index).toBe(1);
    });

    await step("ArrowLeft moves back", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(bars()[0]);
      expect(handleKeyNavHover.mock.calls.at(-1)![0]?.index).toBe(0);
    });

    await step("Enter activates onDatumClick for the focused bar", async () => {
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(handleKeyNavClick).toHaveBeenCalled());
      const call = handleKeyNavClick.mock.calls.at(-1)![0];
      expect(call?.datum).toEqual(fixture[0]);
      expect(call?.index).toBe(0);
    });

    await step("Escape blurs, dismissing the tooltip", async () => {
      await userEvent.keyboard("{Escape}");
      expect(document.activeElement).not.toBe(bars()[0]);
      expect(handleKeyNavHover).toHaveBeenLastCalledWith(null);
    });
  },
};

// Edge cases are three separate stories, not one multi-instance render.
// An earlier draft rendered all three BarCharts side by side in one story
// and that failed `addon-a11y`'s `test: "error"` gate: every chart that
// wires `table` renders its own `role="region" aria-label="Data table"`
// landmark (chart-container.tsx — the label isn't parameterized per chart),
// so ANY page with 2+ table-wired charts trips axe's `landmark-unique` rule.
// That's a real, previously-undetected shared-infra bug — apps/viz-dashboard
// pages render 4-5 charts per page today, several with `table` wired, so
// production dashboards likely already have this violation — but it's a
// `chart/chart-container.tsx` fix (affects all ~46 charts), out of scope for
// a BarChart-only pass. Reported separately; not fixed here, and not worked
// around by testing an unrealistic single-chart page instead.

/** `bar-chart.mdx` "API reference": renders `null` for empty `data`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <BarChart width={200} height={200} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/** A single row still renders (and scales) correctly. */
export const EdgeCaseSingleDatum: BaseStory = {
  render: () => (
    <BarChart
      width={480}
      height={280}
      data={[{ category: "Web", value: 4200 }]}
    />
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll("path")).toHaveLength(1);
  },
};

/**
 * A negative value (`bar-chart.mdx` "Data shape" + "Color & theming").
 * Refunds/deltas/profit-or-loss by category are ordinary data for a "one
 * measure per category" chart, so `BarChart` renders a negative row as a
 * real bar on the other side of the zero baseline — not a crash, and not
 * (an earlier version of this story asserted only this) an invisible,
 * zero-height bar indistinguishable from an actual `0`. Any negative row
 * also switches every bar's fill to the theme's positive/negative valence
 * colors, so direction and color both carry sign.
 */
export const EdgeCaseNegativeValue: BaseStory = {
  render: () => (
    <BarChart
      width={200}
      height={200}
      data={[
        { category: "Refunds", value: -300 },
        { category: "Web", value: 4200 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    // Row order is preserved in the vertical orientation, so bar 0 is
    // "Refunds" (negative) and bar 1 is "Web" (positive).
    const bars = canvasElement.querySelectorAll<SVGPathElement>("path");
    const negativeBar = bars[0];
    const positiveBar = bars[1];
    expect(negativeBar).toBeInTheDocument();
    expect(positiveBar).toBeInTheDocument();

    // Real, non-collapsed bars — not the old zero-height result.
    const negativeRect = negativeBar.getBoundingClientRect();
    const positiveRect = positiveBar.getBoundingClientRect();
    expect(negativeRect.height).toBeGreaterThan(1);
    expect(positiveRect.height).toBeGreaterThan(1);

    // Opposite sides of one shared zero baseline, not both growing upward
    // from the bottom of the chart.
    expect(negativeRect.top).toBeGreaterThanOrEqual(positiveRect.bottom - 1);

    // Colored by sign, not both the same plain accent hue.
    expect(negativeBar.getAttribute("fill")).not.toBe(
      positiveBar.getAttribute("fill")
    );
  },
};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one band, drawing their bars on top of each
 * other with no error. `BarChart` keys its category band by row INDEX
 * instead (even though `getCat` still supplies the label text), so four
 * same-labeled rows still render four distinct bars. Bars render as `<path>`
 * via `BarRounded` (x/y are baked into `d`, not exposed as attributes — see
 * "Interaction" above), so distinctness is asserted on `d` rather than `x`.
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <BarChart
      width={320}
      height={240}
      data={duplicateLabelFixture}
      ariaLabel="Bar chart of 4 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<SVGPathElement>("path");
    expect(bars).toHaveLength(duplicateLabelFixture.length);
    const shapes = Array.from(bars).map((b) => b.getAttribute("d"));
    expect(new Set(shapes).size).toBe(duplicateLabelFixture.length);
  },
};

/**
 * `ResponsiveContainer` actually drives the render (`bar-chart.mdx`
 * "Responsiveness & performance") rather than the chart only ever being
 * exercised at one hardcoded size like every other story in this file.
 */
export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ResponsiveContainer height={220}>
        {(width, height) => (
          <BarChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};

// No ReducedMotionAndForcedColors story: BarChart calls neither
// useReducedMotion nor useForcedColors (bar-chart.mdx "Accessibility" —
// "There is no animation, so reduced-motion handling is N/A"), and adding
// one would assert a capability the component doesn't have.

/**
 * `#16`: `yScale="symlog"` compresses a long tail so a few outliers don't
 * flatten the rest of the bars, unlike the default linear axis. Proven by
 * comparing the SAME wide-dynamic-range data rendered once with each scale:
 * the smallest bar is a much larger fraction of the tallest bar's height
 * under symlog than under (default) linear.
 */
const wideRangeFixture: CategoryDatum[] = [
  { category: "A", value: 5 },
  { category: "B", value: 50 },
  { category: "C", value: 5000 },
];

export const ValueScaleSymlog: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 240, height: 220 }}>
        <BarChart
          width={240}
          height={220}
          data={wideRangeFixture}
          ariaLabel="Bar chart of a wide value range on a linear axis"
        />
      </div>
      <div style={{ width: 240, height: 220 }}>
        <BarChart
          width={240}
          height={220}
          data={wideRangeFixture}
          yScale="symlog"
          ariaLabel="Bar chart of a wide value range on a symlog axis"
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [linearSvg, symlogSvg] = Array.from(
      canvasElement.querySelectorAll('svg[role="graphics-document"]')
    );
    const barHeight = (svg: Element, i: number) =>
      Array.from(
        svg.querySelectorAll<SVGGraphicsElement>("path.visx-bar-rounded")
      )[i]!.getBBox().height;
    // Ratio of the smallest bar (A, value 5) to the tallest (C, value 5000):
    // symlog compresses the tail, so that ratio is much larger there.
    const linearRatio = barHeight(linearSvg, 0) / barHeight(linearSvg, 2);
    const symlogRatio = barHeight(symlogSvg, 0) / barHeight(symlogSvg, 2);
    expect(symlogRatio).toBeGreaterThan(linearRatio * 3);
  },
};

/**
 * `#16`: `yScale="log"` needs a strictly positive domain; `BarChart`'s
 * domain always spans down to (at least) 0, so it can never satisfy that —
 * proven by asserting the "log" render is pixel-identical to the (default)
 * "linear" render, i.e. the guarded fallback actually happened, rather than
 * a degenerate/NaN axis silently shipping.
 */
export const ValueScaleLogFallsBackToLinear: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ width: 240, height: 220 }}>
        <BarChart
          width={240}
          height={220}
          data={fixture}
          ariaLabel="Bar chart with the default linear value scale"
        />
      </div>
      <div style={{ width: 240, height: 220 }}>
        <BarChart
          width={240}
          height={220}
          data={fixture}
          yScale="log"
          ariaLabel="Bar chart requesting a log value scale"
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [linearSvg, logSvg] = Array.from(
      canvasElement.querySelectorAll('svg[role="graphics-document"]')
    );
    const heights = (svg: Element) =>
      Array.from(
        svg.querySelectorAll<SVGGraphicsElement>("path.visx-bar-rounded")
      ).map((p) => p.getBBox().height);
    const linearHeights = heights(linearSvg);
    const logHeights = heights(logSvg);
    expect(logHeights.length).toBe(linearHeights.length);
    for (let i = 0; i < linearHeights.length; i++) {
      expect(logHeights[i]).toBeCloseTo(linearHeights[i], 1);
    }
  },
};
