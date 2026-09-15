import type { Meta } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
import { Histogram } from "./histogram";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/Histogram",
  render: () => <RegistryPreview base="Histogram" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence: hovering a bin outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the
 * "dim everyone else to a fixed opacity" pattern this chart used to
 * hand-roll. The tooltip's vertical position tracks the live pointer while
 * it stays inside the same bin, rather than being pinned once to the bin's
 * own count-derived position.
 */
const hoverFixtureValues: number[] = [
  2, 3, 4, 5, 12, 13, 14, 22, 23, 32, 33, 34, 35, 42, 52, 53, 54,
];

export const HoverEmphasis: BaseStory = {
  render: () => (
    <Histogram
      width={480}
      height={280}
      values={hoverFixtureValues}
      thresholds={6}
      ariaLabel="Histogram of 17 samples across several bins"
    />
  ),
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
 * BC-3 (`docs/bug-classes.md`): a degenerate `[0, max]` count domain (every
 * bin holding the same count) maps the whole axis to the range midpoint
 * instead of a real span. All-identical samples fold into a single d3
 * `bin()`, so this is the input that would have hit that degenerate case --
 * the adversarial mutators (`negateEveryOther`, `allZero`) mutate a flat
 * `value` field and can't express a raw `values: number[]` sample set, so
 * the fixture is hand-built. `valueDomain()` keeps the resulting count axis,
 * and the single bar it draws, finite and correctly sized.
 */
export const EdgeCaseAllZeroSamples: BaseStory = {
  render: () => (
    <Histogram
      width={360}
      height={240}
      values={[0, 0, 0, 0, 0]}
      ariaLabel="Histogram of 5 identical samples"
    />
  ),
  play: async ({ canvasElement }) => {
    // BarRounded renders a <path>; the axis lines are <line> elements, so
    // this selector reaches only the bar marks.
    const bars = Array.from(
      canvasElement.querySelectorAll<SVGPathElement>("path")
    );
    expect(bars.length).toBeGreaterThan(0);

    for (const bar of bars) {
      expect(bar.getAttribute("d") ?? "").not.toContain("NaN");
      expect(bar.getBoundingClientRect().height).toBeGreaterThan(0);
    }
  },
};
