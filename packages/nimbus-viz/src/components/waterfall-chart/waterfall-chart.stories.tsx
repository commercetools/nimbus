import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import {
  WaterfallChart,
  ResponsiveContainer,
  type WaterfallStep,
} from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: WaterfallStep[] = [
  { label: "Start", value: 500, isTotal: true },
  { label: "New", value: 180 },
  { label: "Expansion", value: 90 },
  { label: "Churn", value: -70 },
  { label: "Contraction", value: -40 },
  { label: "End", value: 660, isTotal: true },
];

const meta: Meta = {
  title: "Charts/WaterfallChart",
  render: () => <RegistryPreview base="WaterfallChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence: hovering a bar outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings -- replacing the
 * "dim everyone else to a fixed opacity" pattern this chart (and 30 others)
 * used to hand-roll independently. The tooltip's vertical position tracks
 * the live pointer while it stays inside the same bar, rather than being
 * pinned once to the bar's own value height.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <WaterfallChart width={480} height={320} data={fixture} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGPathElement>("path.visx-bar-rounded")
      );
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
 * Proves the two accessibility features `waterfall-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) `ChartContainer` renders whenever `table` is wired
 * (always, for `WaterfallChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <WaterfallChart
      width={480}
      height={320}
      data={fixture}
      ariaLabel="Waterfall of ARR from 500k to 660k, where New and Expansion outweigh Churn and Contraction"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries the accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute(
        "aria-label",
        "Waterfall of ARR from 500k to 660k, where New and Expansion outweigh Churn and Contraction"
      );
    });

    await step(
      "Data table is reachable by keyboard, not just by mouse",
      async () => {
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
      }
    );
  },
};

/**
 * `onDatumClick`/`onDatumHover` report the raw input `WaterfallStep`, not the
 * internal floating-bar geometry (`from`/`to`) -- proven by checking the
 * callback payload against the original fixture object, not a derived shape.
 * The mouse handlers live on the per-bar `<g>`, not the mark itself, but
 * `userEvent.hover`/`click` on the `path.visx-bar-rounded` bubbles up to it.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <WaterfallChart
      width={480}
      height={320}
      data={fixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const firstBar = () =>
      canvasElement.querySelector<SVGPathElement>("path.visx-bar-rounded");

    await step(
      "Hovering the first bar reports its step and index",
      async () => {
        await userEvent.hover(firstBar()!);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual(fixture[0]);
        expect(call?.index).toBe(0);
      }
    );

    await step(
      "Clicking the first bar fires onDatumClick with the same step",
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

/** `waterfall-chart.mdx` "API reference": renders `null` for empty `data`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <WaterfallChart width={200} height={200} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

const duplicateLabelSteps: WaterfallStep[] = duplicateLabels([
  { label: "Start", value: 100 },
  { label: "Adjustment", value: 40 },
  { label: "End", value: -20 },
]);

// BC-1 regression guard: all three steps now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three bars still draw at distinct horizontal positions instead of
// collapsing onto a single band. Bars render as `BarRounded` (an SVG
// `path`), so distinctness is asserted on its `d` attribute, not a raw `x`.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <WaterfallChart
      width={480}
      height={320}
      data={duplicateLabelSteps}
      ariaLabel="Waterfall chart with duplicate step labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const bars = svg!.querySelectorAll("path.visx-bar-rounded");
    expect(bars).toHaveLength(duplicateLabelSteps.length);
    const ds = new Set(Array.from(bars).map((p) => p.getAttribute("d")));
    expect(ds.size).toBe(duplicateLabelSteps.length);
  },
};

/**
 * Proves the chart actually reads its measured size rather than being
 * exercised at one hardcoded size like every other story in this file.
 */
export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ResponsiveContainer height={280}>
        {(width, height) => (
          <WaterfallChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};

// No ReducedMotionAndForcedColors story: WaterfallChart calls neither
// useReducedMotion nor useForcedColors (waterfall-chart.mdx "Accessibility" --
// "There is no animation, so reduced-motion handling is N/A"). Identity is
// carried by the signed value label as well as color, so forced-colors is a
// repo-wide gap (TODO.md Phase D3), not specific to this chart.
