import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
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
