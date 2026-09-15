import type { Meta } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor } from "storybook/test";
import { GanttChart, type TimelineEvent } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/GanttChart",
  render: () => <RegistryPreview base="GanttChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

// Two plain spans, no `category` (so no legend renders) -- each row draws
// exactly one `rect`, in data order, making the bar indices deterministic.
const hoverFixture: TimelineEvent[] = [
  {
    label: "Design",
    start: new Date("2024-01-01"),
    end: new Date("2024-01-20"),
  },
  {
    label: "Build",
    start: new Date("2024-01-10"),
    end: new Date("2024-01-25"),
  },
];

/**
 * Hover/tooltip UX convergence: hovering a row outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings — replacing the
 * "dim everyone else to a fixed opacity" pattern this chart used to
 * hand-roll. This chart's value axis is x (time), so the tooltip's
 * HORIZONTAL position tracks the live pointer while it stays inside the
 * same bar, rather than being pinned once to the event's own start-date
 * position; the row axis (its vertical `top`) stays snapped to the
 * hovered row, unchanged.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <GanttChart width={480} height={200} data={hoverFixture} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
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

const duplicateLabelEvents: TimelineEvent[] = duplicateLabels([
  {
    label: "Design",
    start: new Date("2024-01-01"),
    end: new Date("2024-01-10"),
  },
  {
    label: "Build",
    start: new Date("2024-01-05"),
    end: new Date("2024-01-20"),
  },
  {
    label: "Test",
    start: new Date("2024-01-15"),
    end: new Date("2024-01-25"),
  },
]);

// BC-1 regression guard: all three events now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three bars still draw at distinct vertical positions instead of
// collapsing onto a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <GanttChart
      width={480}
      height={320}
      data={duplicateLabelEvents}
      ariaLabel="Gantt chart with duplicate event labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const bars = svg!.querySelectorAll("rect");
    expect(bars).toHaveLength(duplicateLabelEvents.length);
    const ys = new Set(Array.from(bars).map((r) => r.getAttribute("y")));
    expect(ys.size).toBe(duplicateLabelEvents.length);
  },
};

/**
 * `D2`: `texture` fills each categorized event's bar/milestone with a
 * per-category SVG pattern (in addition to color) so categories stay
 * distinguishable without color. `Kickoff` has no `category`, so it keeps a
 * plain accent fill — there is nothing to texture. Proven directly: `<defs>`
 * has one `<pattern>` per category, and exactly the 3 categorized marks (not
 * the 4th, uncategorized one) have a `url(#...)` fill.
 */
const textureFixture: TimelineEvent[] = [
  { label: "Kickoff", start: new Date("2023-12-20") },
  {
    label: "Spec",
    start: new Date("2024-01-01"),
    end: new Date("2024-01-10"),
    category: "Design",
  },
  {
    label: "API",
    start: new Date("2024-01-05"),
    end: new Date("2024-01-20"),
    category: "Engineering",
  },
  { label: "Freeze", start: new Date("2024-02-01"), category: "Release" },
];

export const Texture: BaseStory = {
  render: () => (
    <GanttChart
      width={480}
      height={320}
      data={textureFixture}
      texture
      ariaLabel="Gantt chart with per-category textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const categoryCount = 3;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(categoryCount);
    const marks = Array.from(canvasElement.querySelectorAll("rect")).filter(
      (el) => el.getAttribute("fill")?.startsWith("url(#")
    );
    expect(marks.length).toBe(categoryCount);
  },
};
