import type { Meta } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { Heatmap, ResponsiveContainer } from "../../";
import type { HeatRow } from "../../chart/types";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/Heatmap",
  render: () => <RegistryPreview base="Heatmap" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const rows: HeatRow[] = [
  { label: "Row A", values: [10, 40, 70, 90] },
  { label: "Row B", values: [20, 55, 60, 30] },
  { label: "Row C", values: [80, 35, 15, 65] },
];
const columnLabels = ["Q1", "Q2", "Q3", "Q4"];

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `heatmap.mdx` claims: `role="img"`
 * + a real `aria-label`, and the keyboard-reachable data-table fallback
 * (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is wired
 * (always, for `Heatmap`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <Heatmap
      width={480}
      height={280}
      rows={rows}
      columnLabels={columnLabels}
      ariaLabel="Value grid, three rows by four quarters"
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
 * `onDatumClick`/`onDatumHover` are wired on each cell's own `<g>` — a
 * discrete hit target, same direct-mark-wiring pattern as `CohortTriangle`.
 * Both report `{ label, column, value }` (not any layout-internal field)
 * plus the row `index`.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <Heatmap
      width={480}
      height={280}
      rows={rows}
      columnLabels={columnLabels}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    // The first cell (row 0, column 0) is the first <rect> in document order.
    const firstCell = () => canvasElement.querySelector<SVGRectElement>("rect");

    await step(
      "Hovering the first cell reports label/column/value + row index",
      async () => {
        await userEvent.hover(firstCell()!);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual({ label: "Row A", column: 0, value: 10 });
        expect(call?.index).toBe(0);
      }
    );

    await step(
      "Clicking the first cell fires onDatumClick with the same payload",
      async () => {
        await userEvent.click(firstCell()!);
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual({ label: "Row A", column: 0, value: 10 });
        expect(call?.index).toBe(0);
      }
    );
  },
};

/** `heatmap.mdx` "API reference": renders `null` for empty `rows`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <Heatmap width={200} height={200} rows={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * Found while introspecting this chart: the identical bug already fixed on
 * `CohortTriangle` — rows were positioned by `yScale(row.label)`, a
 * `scaleBand` domain keyed by the label *value*, so two rows sharing a
 * label collapsed onto the same y-position (one row rendering invisibly on
 * top of the other), not merely a React key warning. Fixed by keying the
 * domain and every lookup by row index instead. Asserts the actual fixed
 * behavior — two same-labeled rows at distinct positions — not just
 * "doesn't crash".
 */
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <Heatmap
      width={300}
      height={240}
      rows={[
        { label: "Row A", values: [10, 20] },
        { label: "Row B", values: [30, 40] },
        { label: "Row A", values: [50, 60] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const rowALabels = Array.from(
      canvasElement.querySelectorAll("text")
    ).filter((el) => el.textContent === "Row A");
    expect(rowALabels.length).toBe(2);
    const yPositions = rowALabels.map((el) => Number(el.getAttribute("y")));
    expect(yPositions[0]).not.toBe(yPositions[1]);
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={280}>
        {(width, height) => (
          <Heatmap
            width={width}
            height={height}
            rows={rows}
            columnLabels={columnLabels}
          />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
