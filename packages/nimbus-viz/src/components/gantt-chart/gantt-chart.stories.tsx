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
