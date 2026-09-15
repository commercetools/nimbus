import type { Meta } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { FunnelChart } from "./funnel-chart";
import { ResponsiveContainer, type FunnelStage } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/FunnelChart",
  render: () => <RegistryPreview base="FunnelChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: FunnelStage[] = [
  { stage: "Visited", value: 12_400 },
  { stage: "Signed up", value: 4_100 },
  { stage: "Trial started", value: 1_850 },
  { stage: "Purchased", value: 620 },
];

export const Base: BaseStory = {};

/**
 * Hover emphasis: hovering a stage outlines that ONE bar (`stroke`/
 * `strokeWidth`) and never dims its siblings — replacing the "dim
 * everyone else to a fixed opacity" pattern this chart used to hand-roll
 * on the wrapping `<g>`. This chart's floating `SvgTooltip` has no
 * pointer-follow behavior to prove: its `x` is a fixed horizontal center
 * (value is encoded as bar WIDTH here, not a scaled pixel position) and
 * its `top` is already correctly snapped to the hovered stage's own row.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <FunnelChart width={400} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));

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
 * Proves the two accessibility features `funnel-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `FunnelChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <FunnelChart
      width={400}
      height={280}
      data={fixture}
      ariaLabel="Acquisition funnel from visitors to purchasers"
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
 * `onDatumClick`/`onDatumHover` are wired on each stage's own `<g>` — a
 * discrete hit target, same direct-mark-wiring pattern as `BarChart`/
 * `BulletChart`/`StackedBarChart`. Both report the whole `FunnelStage`.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <FunnelChart
      width={400}
      height={280}
      data={fixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const firstBar = () => canvasElement.querySelector<SVGPathElement>("path");

    await step("Hovering the first stage reports its FunnelStage", async () => {
      await userEvent.hover(firstBar()!);
      await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
      const call = handleDatumHover.mock.calls.at(-1)![0];
      expect(call?.datum).toEqual(fixture[0]);
      expect(call?.index).toBe(0);
    });

    await step(
      "Clicking the first stage fires onDatumClick with the same stage",
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

/** `funnel-chart.mdx` "API reference": renders `null` for empty `data`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <FunnelChart width={200} height={200} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * `top = Math.max(0, data[0].value) || 1`: if the first stage is `0` and a
 * later stage is non-zero, every bar's width is computed against that `1`
 * fallback
 * instead of a real reference — the same "assumes non-increasing values,
 * does not clamp or warn" contract as a later-stage-exceeds-first case,
 * just triggered by a zero reference instead of a shrinking one. Asserts
 * the actual (unclamped, oversized) width rather than only "doesn't
 * crash" — nimbus-reviewer confirmed no code fix is warranted here
 * (`Math.max(1, …)` would be a no-op for this exact case and a `NaN`
 * regression for negative/`NaN` inputs), so this locks in the documented
 * behavior instead.
 */
export const EdgeCaseZeroFirstStage: BaseStory = {
  render: () => (
    <FunnelChart
      width={300}
      height={160}
      data={[
        { stage: "No traffic yet", value: 0 },
        { stage: "Carried over", value: 50 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<SVGPathElement>("path");
    expect(bars.length).toBe(2);
    const secondBarBox = bars[1].getBBox();
    // top=1 (the || 1 fallback), so bar width = 50/1 * innerWidth — many
    // times wider than the plot itself, not clamped to it.
    expect(secondBarBox.width).toBeGreaterThan(300);
  },
};

/**
 * A later stage several times larger than the first: `funnel-chart.mdx`
 * documents this as unclamped ("does not clamp or warn"), and — found
 * during this pass — the SVG has no explicit `overflow`, so the browser's
 * default (`overflow: hidden` on an embedded `<svg>`) visually clips the
 * overrun rather than drawing an obviously-too-wide bar. A marginal
 * overrun would be invisible under that clipping, so this uses a large
 * (5x) multiple specifically to make the underlying, unclamped computation
 * assertable: the bar's own geometry (via `getBBox`, which reports true
 * geometry independent of ancestor clipping) really does compute several
 * times wider than the plot, proving the "no clamp" contract is real
 * rather than accidentally masked by the clip.
 */
export const EdgeCaseLaterStageExceedsFirst: BaseStory = {
  render: () => (
    <FunnelChart
      width={300}
      height={160}
      data={[
        { stage: "Baseline", value: 100 },
        { stage: "Unexpectedly large", value: 500 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<SVGPathElement>("path");
    const secondBarBox = bars[1].getBBox();
    // 500/100 = 5x the first stage's bar — several times the plot's own
    // ~268px inner width (300 - the 16px left/right margins), confirming
    // no clamp exists.
    expect(secondBarBox.width).toBeGreaterThan(268 * 3);
  },
};

/**
 * BC-2 (`docs/bug-classes.md`): a stage is a count, so a negative value
 * (e.g. a returns/refund adjustment applied to a stage) cannot be encoded by
 * width. It is now clamped to 0 wherever a ratio is computed (`Math.max(0,
 * stage.value)`), same treatment as a real 0. `BarRounded`'s own radius
 * clamp (`Math.max(1, Math.min(radius, Math.min(width, height) / 2))`)
 * forces even a 0-width bar to a ~2px sliver rather than a literal 0, so
 * this asserts the bar collapses to that same 2px floor -- not a
 * plausible-looking, ratio-scaled width -- while the first (real, positive)
 * stage stays wide, and no attribute anywhere is `NaN`.
 */
export const EdgeCaseNegativeStage: BaseStory = {
  render: () => (
    <FunnelChart
      width={300}
      height={160}
      data={[
        { stage: "Baseline", value: 100 },
        { stage: "Refunded", value: -50 },
        { stage: "Remaining", value: 40 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll<SVGPathElement>("path");
    expect(bars.length).toBe(3);
    const [firstBox, negativeBox] = [bars[0].getBBox(), bars[1].getBBox()];
    expect(firstBox.width).toBeGreaterThan(200); // real, non-zero reference bar
    expect(negativeBox.width).toBeLessThanOrEqual(2); // clamped to the 0-width floor

    for (const el of Array.from(canvasElement.querySelectorAll("*"))) {
      for (const attr of Array.from(el.attributes)) {
        expect(attr.value).not.toContain("NaN");
      }
    }
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <ResponsiveContainer height={280}>
        {(width, height) => (
          <FunnelChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
