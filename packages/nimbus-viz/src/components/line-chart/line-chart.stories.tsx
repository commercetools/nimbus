import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import { LineChart } from "./line-chart";
import { ResponsiveContainer, type Series } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/LineChart",
  render: () => <RegistryPreview base="LineChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: Series[] = [
  {
    id: "eu",
    label: "EU",
    data: [
      { x: new Date("2026-01-01"), y: 120 },
      { x: new Date("2026-02-01"), y: 148 },
      { x: new Date("2026-03-01"), y: 136 },
      { x: new Date("2026-04-01"), y: 172 },
    ],
  },
  {
    id: "us",
    label: "US",
    data: [
      { x: new Date("2026-01-01"), y: 90 },
      { x: new Date("2026-02-01"), y: 104 },
      { x: new Date("2026-03-01"), y: 128 },
      { x: new Date("2026-04-01"), y: 119 },
    ],
  },
];

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `line-chart.mdx` claims: `role="img"`
 * + a real `aria-label`, and the keyboard-reachable data-table fallback (WCAG
 * 1.1.1) that `ChartContainer` renders whenever `table` is wired (always, for
 * `LineChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Line chart of sessions by region, where EU stays above US and both climb"
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
      const toggle = canvas.getByRole("button", {
        name: /view data as table/i,
      });
      // `A3`'s interactive legend adds its own focusable buttons (EU, US)
      // ahead of the toggle in DOM order, so reaching it now takes more than
      // one Tab -- loop rather than assume a fixed count.
      for (let i = 0; i < 10 && document.activeElement !== toggle; i++) {
        await userEvent.tab();
      }
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
 * `variant`: `"line"` (default, `LinePath`) vs `"area"` (`AreaClosed`, filled
 * at 0.16 opacity). Two instances of the same data on one page collide on the
 * auto-generated default `ariaLabel` and trip axe's `landmark-unique`
 * (`writing-chart-stories/SKILL.md`'s own documented pitfall) — each gets a
 * distinct, explicit `ariaLabel` here.
 */
export const Variant: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <LineChart
          width={320}
          height={240}
          series={fixture}
          ariaLabel="Line chart of sessions by region, line variant"
        />
      </div>
      <div style={{ flex: 1 }}>
        <LineChart
          width={320}
          height={240}
          series={fixture}
          variant="area"
          ariaLabel="Line chart of sessions by region, area variant"
        />
      </div>
    </div>
  ),
};

/**
 * `showValues` (Phase B): draws each series' formatted value directly past
 * the end of its line -- `chart/value-labels.tsx`'s `ValueLabel`. Only the
 * LAST point of each series is labeled (not every point), following
 * `bump-chart.tsx`'s existing end-of-series-label convention -- a label at
 * every point of a dense trend line would clutter badly. Both series in
 * `fixture` end on a non-null `y`, so turning the prop on adds exactly one
 * label per series. Two instances side by side (each its own distinct
 * `ariaLabel`, per this file's established convention) prove the causal
 * link directly, not a guessed formatted string.
 */
export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <LineChart
        width={280}
        height={240}
        series={fixture}
        ariaLabel="Line chart without value labels"
      />
      <LineChart
        width={280}
        height={240}
        series={fixture}
        showValues
        ariaLabel="Line chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (LineChart uses role="img").
    // Axis tick labels render their own nested <svg> (visx's positioning
    // trick), which don't carry this role attribute, so they're excluded
    // from this NodeList on their own.
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + fixture.length);
  },
};

/**
 * `showDots` (Phase C): draws a small dot at every point of every series,
 * not just the hover-highlighted one -- `chart/point-shapes.tsx`'s
 * `PointMark`, mirroring shadcn's `chart-line-dots` variant. `fixture` has
 * 4 points per series across 2 series, so turning the prop on adds exactly
 * 8 new `<circle>`s.
 */
export const ShowDots: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <LineChart
        width={280}
        height={240}
        series={fixture}
        ariaLabel="Line chart without dots"
      />
      <LineChart
        width={280}
        height={240}
        series={fixture}
        showDots
        ariaLabel="Line chart with dots"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const circleCount = (svg: Element) => svg.querySelectorAll("circle").length;
    const totalPoints = fixture.reduce((n, s) => n + s.data.length, 0);
    expect(circleCount(svgs[1])).toBe(circleCount(svgs[0]) + totalPoints);
  },
};

/**
 * `onDatumClick`/`onDatumHover` are wired on a transparent overlay `<rect>`
 * spanning the plot (not on individual marks — `LinePath`/`AreaClosed`
 * strokes/fills carry no accessible role or their own handlers), resolving
 * the nearest x-index from the pointer's `clientX`. Three evenly-spaced dates
 * put the middle point exactly at the overlay's horizontal center, which is
 * where `userEvent.hover`/`.click` land without explicit coordinates.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();
const interactionFixture: Series[] = [
  {
    id: "s1",
    label: "S1",
    data: [
      { x: new Date("2026-01-01"), y: 10 },
      { x: new Date("2026-01-02"), y: 20 },
      { x: new Date("2026-01-03"), y: 15 },
    ],
  },
];

export const Interaction: BaseStory = {
  render: () => (
    <LineChart
      width={320}
      height={240}
      series={interactionFixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const overlay = () => canvasElement.querySelector<SVGRectElement>("rect")!;
    // The overlay's own bounding rect already accounts for the plot's
    // margin translation (`chart-frame.tsx`'s `DEFAULT_MARGIN`), so its
    // horizontal center lands on the middle of the three evenly-spaced
    // dates. `userEvent.hover`/`.click` don't reliably center-target an SVG
    // `<rect>` in this runner, so fire the native events with explicit
    // coordinates instead — this is exactly what the component's own
    // `onMouseMove`/`onClick` handlers read (`e.clientX`).
    const centerOf = (el: SVGRectElement) => {
      const rect = el.getBoundingClientRect();
      return {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };
    };

    await step("Hovering the overlay reports the nearest datum", async () => {
      fireEvent.mouseMove(overlay(), centerOf(overlay()));
      await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
      const call = handleDatumHover.mock.calls.at(-1)![0];
      expect(call?.index).toBe(1);
      expect(call?.datum).toEqual(interactionFixture[0].data[1]);
      expect(call?.seriesId).toBe("s1");
    });

    await step(
      "Clicking the overlay fires onDatumClick with the same datum",
      async () => {
        fireEvent.click(overlay(), centerOf(overlay()));
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.index).toBe(1);
        expect(call?.datum).toEqual(interactionFixture[0].data[1]);
      }
    );
  },
};

/** `line-chart.mdx` "API reference": renders `null` for an empty `series`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <LineChart width={200} height={200} series={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * A single point per series: `xDomain` (`extent`) degenerates to a single
 * date, so the time scale's domain has zero width. Asserts the actual
 * failure mode — a rendered mark with finite coordinates — rather than only
 * "doesn't throw", since a degenerate scale is exactly the kind of input
 * that can silently produce `NaN` path coordinates instead of an error.
 */
export const EdgeCaseSingleDatum: BaseStory = {
  render: () => (
    <LineChart
      width={200}
      height={200}
      series={[
        { id: "s1", label: "S1", data: [{ x: new Date("2026-01-01"), y: 10 }] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const path = canvasElement.querySelector<SVGPathElement>("path");
    expect(path).toBeInTheDocument();
    expect(path!.getAttribute("d")).not.toMatch(/NaN/);
  },
};

/**
 * Negative values used to render off-scale: the y-domain was hardcoded to
 * `[0, yMax]`, so a negative point mapped below `innerHeight` (past the
 * plot's own bounds — `chart-frame.tsx` applies no clip). Fixed by widening
 * the domain to `[Math.min(0, yMin), Math.max(0, yMax)]`. `getBBox()` reports
 * true geometric extent in the plot's local coordinate system (independent
 * of any ancestor clipping), so asserting the line's bottom edge stays within
 * `innerHeight` (`height - margin.top - margin.bottom`, `chart-frame.tsx`'s
 * `DEFAULT_MARGIN`) directly proves the fix — it fails against the old
 * hardcoded domain for this fixture (value `-10` would map to local y ≈ 240,
 * well past `innerHeight = 160`).
 */
export const EdgeCaseNegativeValue: BaseStory = {
  render: () => (
    <LineChart
      width={240}
      height={200}
      series={[
        {
          id: "pnl",
          label: "P&L",
          data: [
            { x: new Date("2026-01-01"), y: 20 },
            { x: new Date("2026-01-02"), y: -10 },
            { x: new Date("2026-01-03"), y: 15 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const innerHeight = 200 - 12 - 28; // height - DEFAULT_MARGIN.top - .bottom
    const path = canvasElement.querySelector<SVGPathElement>("path")!;
    const bbox = path.getBBox();
    expect(bbox.y + bbox.height).toBeLessThanOrEqual(innerHeight + 1);
  },
};

/**
 * An all-negative series doesn't just draw off-scale — before the fix it
 * inverted (domain resolved to `[0, -5]` against `range: [innerHeight, 0]`).
 * The `variant="area"` fill has a second, distinct bug on top of the domain:
 * `AreaClosed`'s default baseline is `yScale.range()[0]` (a fixed pixel row),
 * not `yScale(0)` (the value-zero row) — the two only coincided by accident
 * under the old hardcoded `[0, yMax]` domain. Fixed with an explicit
 * `y0={() => yScale(0)}`. This fixture's domain is `[-20, 0]`, so `yScale(0)`
 * sits at local y ≈ 0 — the very top of the plot — but no *line* point ever
 * reaches that high (the closest value, -5, only gets to y ≈ 40). So the
 * fill's bounding-box top (`getBBox().y`) is a clean discriminator: ≈ 0 only
 * if the baseline is actually tracking zero (every baseline point shares
 * that one constant y); under the old bug the baseline sat at the fixed
 * bottom row instead, and the box top would be whatever the line trace's own
 * closest-to-zero point reached (y ≈ 40) — never the true top.
 */
export const EdgeCaseNegativeArea: BaseStory = {
  render: () => (
    <LineChart
      width={240}
      height={200}
      variant="area"
      series={[
        {
          id: "loss",
          label: "Loss",
          data: [
            { x: new Date("2026-01-01"), y: -10 },
            { x: new Date("2026-01-02"), y: -5 },
            { x: new Date("2026-01-03"), y: -20 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector<SVGPathElement>("path")!;
    const bbox = path.getBBox();
    expect(bbox.y).toBeLessThan(3); // ≈ yScale(0), not the line's own ≈40 top
  },
};

/**
 * `A3`: the legend is click-to-toggle / shift-click-to-isolate by default --
 * no props required. Uncontrolled here (`selection`/`onSelectionChange` both
 * omitted): `useControlledSelection` manages its own set internally.
 *
 * Crossfilter semantics (matching `SelectionProps`'s "linked views /
 * crossfilter" contract): an empty selection is "no filter" -- every series
 * shown, today's unchanged default. A plain click toggles that series' id
 * in/out of the selection; once non-empty, only series IN the selection are
 * shown -- so the FIRST click on an item filters down to just that one (not
 * "hide only this one"); clicking a second item adds it to the filter;
 * clicking a selected item again removes it, shrinking back toward "empty =
 * show all". Shift-click isolates -- jumps straight to a single-series
 * selection regardless of what was already selected.
 */
export const InteractiveLegend: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Line chart of sessions by region, with a clickable legend"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const paths = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));
    // `opacity` is set as a plain SVG presentation attribute (visx spreads
    // it onto the <path>, not via inline `style`), so read it with
    // `getAttribute`, not `el.style.opacity`.
    const opacityOf = (el: SVGPathElement) => {
      const a = el.getAttribute("opacity");
      return a == null ? 1 : Number(a);
    };

    await step("At rest, every series is fully visible", async () => {
      const [euPath, usPath] = paths();
      expect(opacityOf(euPath)).toBe(1);
      expect(opacityOf(usPath)).toBe(1);
    });

    await step("Clicking one legend item filters down to just it", async () => {
      const usItem = canvas.getByRole("button", { name: /US/i });
      await userEvent.click(usItem);
      const [euPath, usPath] = paths();
      expect(opacityOf(euPath)).toBe(0);
      expect(opacityOf(usPath)).toBe(1);
      expect(usItem).toHaveAttribute("aria-pressed", "true");
    });

    await step(
      "Clicking the same item again clears the filter (back to all shown)",
      async () => {
        const usItem = canvas.getByRole("button", { name: /US/i });
        await userEvent.click(usItem);
        const [euPath, usPath] = paths();
        expect(opacityOf(euPath)).toBe(1);
        expect(opacityOf(usPath)).toBe(1);
        expect(usItem).toHaveAttribute("aria-pressed", "false");
      }
    );

    await step(
      "Shift-clicking isolates that item regardless of the prior selection",
      async () => {
        // Select both first (US, then EU) so the selection has >1 member,
        // proving isolate REPLACES it rather than adding to it.
        await userEvent.click(canvas.getByRole("button", { name: /US/i }));
        await userEvent.click(canvas.getByRole("button", { name: /EU/i }));
        expect(opacityOf(paths()[0])).toBe(1); // EU
        expect(opacityOf(paths()[1])).toBe(1); // US

        // `userEvent.keyboard("{Shift>}")` held across a separate
        // `userEvent.click()` doesn't reliably carry `shiftKey` onto the
        // dispatched click in this runner -- `fireEvent` lets the modifier
        // be set directly on the one event, matching the component's own
        // `e.shiftKey` check.
        const euItem = canvas.getByRole("button", { name: /EU/i });
        fireEvent.click(euItem, { shiftKey: true });
        const [euPath, usPath] = paths();
        expect(opacityOf(euPath)).toBe(1);
        expect(opacityOf(usPath)).toBe(0);
      }
    );
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={240}>
        {(width, height) => (
          <LineChart width={width} height={height} series={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};

// `#19`: a 500-point series, well past a 60-point decimateThreshold.
const denseData = Array.from({ length: 500 }, (_, i) => ({
  x: new Date(2026, 0, 1 + i),
  y: 50 + 40 * Math.sin(i / 12) + (i === 250 ? 60 : 0), // one sharp spike
}));
const denseFixture: Series[] = [{ id: "s1", label: "S1", data: denseData }];

/**
 * `decimateThreshold` downsamples the DRAWN path via LTTB, well past its
 * threshold here (500 points -> ~60) -- proving the path's point count
 * actually drops while the y-axis domain still reflects the full series
 * (the spike at i=250 stays in range), not the decimated subset's own.
 */
export const Decimated: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={denseFixture}
      decimateThreshold={60}
      ariaLabel="Dense series drawn with LTTB decimation"
    />
  ),
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector<SVGPathElement>("path")!;
    const d = path.getAttribute("d") ?? "";
    // curveMonotoneX emits one "M" (the first point) then one "C" (cubic
    // bezier) per subsequent point -- so the command count IS the point
    // count, regardless of the smoothing curve (no straight "L" segments).
    const commands = d.match(/[MC]/g) ?? [];
    expect(commands.length).toBeLessThan(100); // ~60, well under 500
    expect(commands.length).toBeGreaterThan(10); // still a real line, not 1-2 pts
    expect(d).not.toMatch(/NaN/);
    // A real shape survived decimation -- not collapsed to a flat line. The
    // last coordinate pair on each command is the through-point (a C's two
    // control points come first); a bare-bones extraction of every number
    // pair is good enough to bound the y-range without parsing the curve.
    const ys = Array.from(d.matchAll(/([\d.-]+),([\d.-]+)/g)).map((m) =>
      Number(m[2])
    );
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(20);
  },
};

/**
 * `gradient` (Phase F): fades the `"area"` variant's fill toward the
 * baseline via an SVG `<linearGradient>` (`@visx/gradient`'s
 * `LinearGradient`, already a dependency with zero prior consumers)
 * instead of a flat `fillOpacity` -- mirroring shadcn's
 * `chart-area-gradient` variant. Proven directly: one `<linearGradient>`
 * per series, and each area's `fill` is a `url(#...)` reference to it.
 */
export const Gradient: BaseStory = {
  render: () => (
    <LineChart
      width={420}
      height={240}
      series={fixture}
      variant="area"
      gradient
      ariaLabel="Line chart (area variant) with gradient fill"
    />
  ),
  play: async ({ canvasElement }) => {
    const gradients = canvasElement.querySelectorAll("linearGradient");
    expect(gradients).toHaveLength(fixture.length);
    const areas = canvasElement.querySelectorAll<SVGPathElement>(
      "path.visx-area-closed"
    );
    expect(areas).toHaveLength(fixture.length);
    for (const area of Array.from(areas)) {
      expect(area.getAttribute("fill")).toMatch(/^url\(#/);
    }
  },
};

/**
 * `D2/D3-rest`: `texture` distinguishes series by `strokeDasharray` rhythm
 * (in addition to color), the stroked-mark reference for this rollout — a
 * fill `patternFill` doesn't apply to a `"line"` series (no fill area), and
 * `"area"`'s fill is too light (16% opacity) for a pattern to read, so the
 * dash rhythm on the stroke is the one non-color channel for both variants.
 * Proven directly on both: the first series stays a solid stroke (no
 * `strokeDasharray` attribute at all), the second gets a real dash pattern.
 */
export const Texture: BaseStory = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <LineChart
        width={420}
        height={200}
        series={fixture}
        texture
        ariaLabel="Line chart (line variant) with per-series dash rhythm"
      />
      <LineChart
        width={420}
        height={200}
        series={fixture}
        variant="area"
        texture
        ariaLabel="Line chart (area variant) with per-series dash rhythm"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the chart's own <svg role="img">: axis tick labels render
    // their own nested <svg> (visx's positioning trick), which would
    // otherwise match too and carry no marks of their own.
    const charts = Array.from(
      canvasElement.querySelectorAll<SVGElement>('svg[role="img"]')
    );
    expect(charts).toHaveLength(2); // line variant + area variant
    for (const el of charts) {
      const marks = Array.from(
        el.querySelectorAll<SVGPathElement>(
          "path.visx-linepath, path.visx-area-closed"
        )
      );
      expect(marks).toHaveLength(2); // one path per series
      expect(marks[0]).not.toHaveAttribute("stroke-dasharray"); // first series: unchanged solid stroke
      expect(marks[1]).toHaveAttribute("stroke-dasharray"); // second series: dash-encoded
      expect(marks[1].getAttribute("stroke-dasharray")).not.toBe("");
    }
  },
};
