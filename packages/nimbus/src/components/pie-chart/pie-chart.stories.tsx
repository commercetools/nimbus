import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import {
  DarkMode,
  findSvg,
  legendRed,
  tooltipText,
} from "../chart/chart.test-utils";
import { PieChart } from "./pie-chart";
import type { PieChartProps } from "./pie-chart.types";

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
];

const config = {
  chrome: { label: "Chrome", palette: "ctviolet" },
  safari: { label: "Safari", palette: "orange" },
  firefox: { label: "Firefox", palette: "teal" },
} as const;

const SampleChart = (props: Partial<PieChartProps>) => (
  <Box width="600px">
    <PieChart
      data={data}
      config={config}
      nameKey="browser"
      valueKey="visitors"
      aria-label="Visitors by browser"
      isAnimationActive={false}
      data-testid="chart"
      {...props}
    />
  </Box>
);

// VRT: the chart paints slices with a 2 px stroke in the bg color, the legend and
// the tooltip (the shared parts are baselined in chart.stories.tsx).
// Snapshotted: Base (three slices with separators, three-item legend) and
// Focused (the active slice and tooltip that Recharts paints for a pie). No Dark:
// slice colors are the same variables that Dark in BarChart and chart.stories.tsx
// already baseline, and the Dark story here asserts them in the DOM. Empty is
// snapshotted once, in chart.stories.tsx. Loading is a Skeleton, covered by its
// own stories. Legend rules, tooltip and keyboard behavior are DOM assertions.
const meta: Meta<typeof SampleChart> = {
  title: "Components/PieChart",
  component: SampleChart,
};

export default meta;

type Story = StoryObj<typeof SampleChart>;

/** The slices of the pie, in data order */
const slices = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<SVGPathElement>(".recharts-pie-sector path")
  );

/** One slice per category, in the config colors */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    await findSvg(canvasElement);

    await step("Draws one slice per data row", async () => {
      await expect(slices(canvasElement)).toHaveLength(data.length);
    });

    await step(
      "Slices use the palette CSS variables of their category",
      async () => {
        const fills = slices(canvasElement).map((s) => s.getAttribute("fill"));
        await expect(fills).toEqual([
          "var(--nimbus-colors-ctviolet-9)",
          "var(--nimbus-colors-orange-9)",
          "var(--nimbus-colors-teal-9)",
        ]);
      }
    );
  },
};

/** Entries without a palette get the default order at their position */
export const DefaultPaletteOrder: Story = {
  render: () => (
    <SampleChart
      config={{
        chrome: { label: "Chrome" },
        safari: { label: "Safari" },
        firefox: { label: "Firefox" },
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const fills = slices(canvasElement).map((s) => s.getAttribute("fill"));
    await expect(fills).toEqual([
      "var(--nimbus-colors-ctviolet-9)",
      "var(--nimbus-colors-orange-9)",
      "var(--nimbus-colors-teal-9)",
    ]);
  },
};

/** Adjacent slices are separated by a 2 px stroke in the bg color */
export const SliceStroke: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const all = slices(canvasElement);
    await expect(all).toHaveLength(data.length);
    for (const slice of all) {
      await expect(slice).toHaveAttribute("stroke", "var(--nimbus-colors-bg)");
      await expect(slice).toHaveAttribute("stroke-width", "2");
      // Proves var() works as an SVG presentation attribute: light-mode bg
      await expect(getComputedStyle(slice).stroke).toBe("rgb(255, 255, 255)");
    }
  },
};

/** Colors, in data order, of the drawn marks */
const fillsOf = (root: HTMLElement) =>
  slices(root).map((el) => el.getAttribute("fill"));

/** A category that is not in the config is skipped, the others keep their colors */
export const UnknownCategorySkipped: Story = {
  render: () => (
    <SampleChart
      data={[
        { browser: "chrome", visitors: 275 },
        { browser: "edge", visitors: 90 },
        { browser: "safari", visitors: 200 },
        { browser: "firefox", visitors: 187 },
      ]}
      showLegend={false}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await findSvg(canvasElement);
    // 4 rows, 3 known categories: the unknown one is not drawn
    await expect(slices(canvasElement)).toHaveLength(3);
    await expect(fillsOf(canvasElement)).toEqual([
      "var(--nimbus-colors-ctviolet-9)",
      "var(--nimbus-colors-orange-9)",
      "var(--nimbus-colors-teal-9)",
    ]);
    await expect(items.map((i) => i.textContent)).toEqual([
      "Chrome",
      "Safari",
      "Firefox",
    ]);
  },
};

/** Color follows the config entry of the category name, not the config order */
export const ConfigOrderDiffersFromData: Story = {
  render: () => (
    <SampleChart
      config={{
        firefox: { label: "Firefox", palette: "teal" },
        safari: { label: "Safari", palette: "orange" },
        chrome: { label: "Chrome", palette: "ctviolet" },
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    // Data order is chrome, safari, firefox
    await expect(fillsOf(canvasElement)).toEqual([
      "var(--nimbus-colors-ctviolet-9)",
      "var(--nimbus-colors-orange-9)",
      "var(--nimbus-colors-teal-9)",
    ]);
  },
};

let consoleErrorSpy: ReturnType<typeof spyOn>;

/** Two rows with the same category are both drawn, listed once, with no duplicate-key error */
export const DuplicateCategory: Story = {
  beforeEach: () => {
    consoleErrorSpy = spyOn(console, "error");
    return () => consoleErrorSpy.mockRestore();
  },
  render: () => (
    <SampleChart
      showLegend={false}
      data={[
        { browser: "chrome", visitors: 275 },
        { browser: "chrome", visitors: 100 },
        { browser: "safari", visitors: 200 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await findSvg(canvasElement);
    await expect(slices(canvasElement)).toHaveLength(3);
    await expect(fillsOf(canvasElement).slice(0, 2)).toEqual([
      "var(--nimbus-colors-ctviolet-9)",
      "var(--nimbus-colors-ctviolet-9)",
    ]);
    await expect(items.map((i) => i.textContent)).toEqual(["Chrome", "Safari"]);
    const messages = consoleErrorSpy.mock.calls.map((call) => String(call[0]));
    await expect(messages.filter((m) => m.includes("same key"))).toEqual([]);
  },
};

/** Two or more categories: the legend lists each with its label and color */
export const LegendForSeveral: Story = {
  render: () => <SampleChart showLegend={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveTextContent("Chrome");
    await expect(items[1]).toHaveTextContent("Safari");
    const swatch = canvasElement.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe(
      "var(--nimbus-colors-ctviolet-9)"
    );
  },
};

/** One category: no legend, unless `showLegend` is set */
export const SingleNoLegend: Story = {
  render: () => <SampleChart data={[data[0]]} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(canvasElement.querySelector("ul")).toBeNull();
  },
};

export const SingleWithLegend: Story = {
  render: () => <SampleChart data={[data[0]]} showLegend />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(1);
  },
};

/** The svg keeps the Recharts role and tab stop, and carries the aria-label */
export const Accessibility: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await expect(svg).toHaveAttribute("role", "application");
    await expect(svg).toHaveAttribute("tabindex", "0");
    await expect(svg).toHaveAttribute("aria-label", "Visitors by browser");
  },
};

/** Tab reaches the chart and the tooltip shows the first item */
export const TabFocus: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await userEvent.tab();
    await expect(svg).toHaveFocus();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
  },
};

/** The tooltip is a live region with the label, swatch and value */
export const TooltipContent: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    const tooltip = await waitFor(() => {
      const el = tooltipText(canvasElement);
      if (!el) throw new Error("tooltip not shown yet");
      return el as HTMLElement;
    });
    await expect(tooltip).toHaveAttribute("role", "status");
    await expect(tooltip).toHaveAttribute("aria-live", "assertive");
    await expect(tooltip).toHaveTextContent("Chrome");
    await expect(tooltip).toHaveTextContent("275");
    await expect(tooltip).not.toHaveTextContent("Safari");
    const swatch = tooltip.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe(
      "var(--nimbus-colors-ctviolet-9)"
    );
  },
};

/** The tooltip shows the category, even when `config` has a key equal to `valueKey` */
export const TooltipWithValueKeyInConfig: Story = {
  render: () => (
    <SampleChart
      config={{
        visitors: { label: "Visitors" },
        chrome: { label: "Chrome", palette: "ctviolet" },
        safari: { label: "Safari", palette: "orange" },
        firefox: { label: "Firefox", palette: "teal" },
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
    await expect(tooltipText(canvasElement)).not.toHaveTextContent("Visitors");
    await expect(tooltipText(canvasElement)).toHaveTextContent("275");
  },
};

/** ArrowRight and ArrowLeft move the active item and the tooltip text */
export const KeyboardNavigation: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Safari")
    );
    await expect(tooltipText(canvasElement)).not.toHaveTextContent("Chrome");
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
  },
};

/** Enter hides the tooltip and shows it again */
export const EnterTogglesTooltip: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() => expect(tooltipText(canvasElement)).not.toBeNull());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(tooltipText(canvasElement)).toBeNull());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(tooltipText(canvasElement)).not.toBeNull());
  },
};

/** `showTooltip={false}` renders no tooltip */
export const TooltipOff: Story = {
  render: () => <SampleChart showTooltip={false} />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await userEvent.tab();
    // Positive control: the chart has focus, so a tooltip would be shown now
    await expect(svg).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    // Wait a short fixed time so a wrongly rendered tooltip would have
    // appeared. The on-case is covered by the TooltipContent story.
    await new Promise((r) => setTimeout(r, 300));
    await expect(tooltipText(canvasElement)).toBeNull();
  },
};

/** The tab stop shows the focus ring and the active item with its tooltip */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
  },
};

/** `isLoading` shows the skeleton instead of the chart */
export const Loading: Story = {
  render: () => <SampleChart isLoading />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>(
      "[data-testid='chart']"
    )!;
    await expect(root).toHaveAttribute("aria-busy", "true");
    await expect(root.querySelector("svg.recharts-surface")).toBeNull();
    await expect(root.querySelector(".nimbus-skeleton")).not.toBeNull();
  },
};

/** Empty data shows the empty state (its pixels are snapshotted in chart.stories.tsx) */
export const Empty: Story = {
  render: () => <SampleChart data={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "No data to display"
    );
    await expect(
      canvasElement.querySelector("svg.recharts-surface")
    ).toBeNull();
  },
};

/** Light mode: the legend text is a dark gray */
export const Light: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole("listitem");
    await expect(legendRed(canvasElement)).toBeLessThan(128);
  },
};

/** Dark mode: colors come from variables that switch with the color mode */
export const Dark: Story = {
  render: () => (
    <DarkMode>
      <SampleChart />
    </DarkMode>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(3);
    await waitFor(() => expect(legendRed(canvasElement)).toBeGreaterThan(128));
  },
};
