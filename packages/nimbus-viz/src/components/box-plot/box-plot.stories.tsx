import type { Meta } from "@storybook/react-vite";
import { userEvent, waitFor, within, expect } from "storybook/test";
import {
  BoxPlot,
  type BoxPlotGroupStats,
  type BoxPlotGroupSamples,
} from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/BoxPlot",
  render: () => <RegistryPreview base="BoxPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const duplicateLabelGroups: BoxPlotGroupStats[] = duplicateLabels([
  {
    label: "Alpha",
    min: 10,
    firstQuartile: 20,
    median: 30,
    thirdQuartile: 40,
    max: 50,
  },
  {
    label: "Beta",
    min: 15,
    firstQuartile: 25,
    median: 35,
    thirdQuartile: 45,
    max: 55,
  },
  {
    label: "Gamma",
    min: 5,
    firstQuartile: 18,
    median: 28,
    thirdQuartile: 38,
    max: 48,
  },
]);

// BC-1 regression guard: all three groups now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three boxes still draw at distinct x positions instead of collapsing onto
// a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <BoxPlot
      width={480}
      height={320}
      groups={duplicateLabelGroups}
      ariaLabel="Box plot with duplicate group labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const boxes = svg!.querySelectorAll("rect.visx-boxplot-box");
    expect(boxes).toHaveLength(duplicateLabelGroups.length);
    const xs = new Set(Array.from(boxes).map((b) => b.getAttribute("x")));
    expect(xs.size).toBe(duplicateLabelGroups.length);
  },
};

/**
 * `#17-rest`: a group may pass raw `samples` instead of a precomputed
 * five-number summary; `fiveNumberSummary` (Tukey, 1.5·IQR fences) derives
 * min/quartiles/median/max/outliers internally. Mixing shapes across groups
 * in one chart is fine — "Precomputed" here is a `BoxPlotGroupStats`,
 * "Raw samples" is a `BoxPlotGroupSamples` whose 1..10 samples have a known,
 * hand-computed summary (median 5.5, Q1 3.25, Q3 7.75 — the R-7 quantile
 * method `fiveNumberSummary` uses), checked via the data table so the
 * assertion is on the exact derived numbers, not just "a box rendered".
 */
const rawSamplesGroups: (BoxPlotGroupStats | BoxPlotGroupSamples)[] = [
  {
    label: "Precomputed",
    min: 10,
    firstQuartile: 20,
    median: 30,
    thirdQuartile: 40,
    max: 50,
  },
  {
    label: "Raw samples",
    samples: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
];

export const RawSampleEntry: BaseStory = {
  render: () => (
    <BoxPlot
      width={480}
      height={320}
      groups={rawSamplesGroups}
      ariaLabel="Box plot mixing a precomputed group and a raw-samples group"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Both groups draw a box (raw samples resolved to one)",
      async () => {
        const boxes = canvasElement.querySelectorAll("rect.visx-boxplot-box");
        expect(boxes).toHaveLength(2);
      }
    );

    await step(
      "The raw-samples group's derived quartiles are exact",
      async () => {
        await userEvent.tab();
        await userEvent.keyboard("{Enter}");
        await waitFor(() => {
          expect(
            canvas.getByRole("region", { name: /data table/i })
          ).toBeInTheDocument();
        });
        const table = canvas.getByRole("region", { name: /data table/i });
        const row = within(table).getByText("Raw samples").closest("tr");
        const cells = Array.from(row?.querySelectorAll("td") ?? []).map(
          (td) => td.textContent
        );
        // Columns: Group, Min, Q1, Median, Q3, Max.
        expect(cells).toEqual([
          "Raw samples",
          "1",
          "3.25",
          "5.5",
          "7.75",
          "10",
        ]);
      }
    );
  },
};
