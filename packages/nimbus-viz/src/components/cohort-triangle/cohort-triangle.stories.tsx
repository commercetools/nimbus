import type { Meta } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { CohortTriangle, ResponsiveContainer } from "../../";
import type { HeatRow } from "../../chart/types";
import type { BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here. No RegistryPreview here --
// CohortTriangle has no selection/registry.tsx entry (a niche chart shape,
// not a strong intent-match candidate for the general resolver).
const rows: HeatRow[] = [
  { label: "Jan", values: [100, 80, 65, 50] },
  { label: "Feb", values: [120, 95, 70] },
  { label: "Mar", values: [110, 90] },
  { label: "Apr", values: [130] },
];

const periodLabels = ["Jan", "Feb", "Mar", "Apr"];

const meta: Meta = {
  title: "Charts/CohortTriangle",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <CohortTriangle
          width={width}
          height={height}
          rows={rows}
          periodLabels={periodLabels}
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `cohort-triangle.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `CohortTriangle`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <CohortTriangle
      width={480}
      height={320}
      rows={rows}
      periodLabels={periodLabels}
      ariaLabel="Retention by cohort, four months since signup"
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
 * discrete hit target, same direct-mark-wiring pattern as `BarChart`/
 * `BulletChart`/`FunnelChart`. Both report `{ cohort, age, value }` (not the
 * calendar-aligned `col`, a layout implementation detail) plus the row
 * `index`.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <CohortTriangle
      width={480}
      height={320}
      rows={rows}
      periodLabels={periodLabels}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    // The first cell (row 0 "Jan", age 0) is the first <rect> in document order.
    const firstCell = () => canvasElement.querySelector<SVGRectElement>("rect");

    await step(
      "Hovering the first cell reports cohort/age/value + row index",
      async () => {
        await userEvent.hover(firstCell()!);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual({ cohort: "Jan", age: 0, value: 100 });
        expect(call?.index).toBe(0);
      }
    );

    await step(
      "Clicking the first cell fires onDatumClick with the same payload",
      async () => {
        await userEvent.click(firstCell()!);
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual({ cohort: "Jan", age: 0, value: 100 });
        expect(call?.index).toBe(0);
      }
    );
  },
};

/** `cohort-triangle.mdx` "API reference": renders `null` for empty `rows`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <CohortTriangle width={200} height={200} rows={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * Found while introspecting this chart: rows used to be positioned by
 * `yScale(row.label)` — a `scaleBand` domain keyed by the label *value*, so
 * two rows sharing a label collapsed onto the same y-position (one row
 * rendering invisibly on top of the other) rather than merely tripping a
 * React key warning. Fixed by keying the domain and every lookup by row
 * index instead. Asserts the actual fixed behavior — two same-labeled rows
 * at distinct positions — not just "doesn't crash".
 */
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <CohortTriangle
      width={300}
      height={240}
      rows={[
        { label: "Jan", values: [10, 8] },
        { label: "Feb", values: [20] },
        { label: "Jan", values: [30] },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const janLabels = Array.from(canvasElement.querySelectorAll("text")).filter(
      (el) => el.textContent === "Jan"
    );
    expect(janLabels.length).toBe(2);
    const yPositions = janLabels.map((el) => Number(el.getAttribute("y")));
    expect(yPositions[0]).not.toBe(yPositions[1]);
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={320}>
        {(width, height) => (
          <CohortTriangle
            width={width}
            height={height}
            rows={rows}
            periodLabels={periodLabels}
          />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
