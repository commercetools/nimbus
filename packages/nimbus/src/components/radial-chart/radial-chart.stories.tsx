import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  DarkMode,
  findSvg,
  legendRed,
  tooltipText,
} from "../chart/chart.test-utils";
import { RadialChart } from "./radial-chart";
import type { RadialChartProps } from "./radial-chart.types";

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

const SampleChart = (props: Partial<RadialChartProps>) => (
  <Box width="600px">
    <RadialChart
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

// VRT: the chart paints concentric arcs on gray tracks, the legend and the
// tooltip (the shared parts are baselined in chart.stories.tsx). Snapshotted: Base
// (three rings with tracks, three-item legend) and Focused (the active ring and
// tooltip that Recharts paints for a radial chart). No Dark: ring colors are the
// variables that Dark in BarChart and chart.stories.tsx already baseline, and the
// Dark story here asserts them in the DOM; the track uses the neutral token, which
// is asserted as a variable below. Empty is snapshotted once, in
// chart.stories.tsx. Loading is a Skeleton, covered by its own stories.
const meta: Meta<typeof SampleChart> = {
  title: "Components/RadialChart",
  component: SampleChart,
};

export default meta;

type Story = StoryObj<typeof SampleChart>;

/** The rings (value arcs) of the chart, in data order */
const rings = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<SVGPathElement>(".recharts-radial-bar-sector")
  );

/** The gray tracks behind the rings */
const tracks = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<SVGPathElement>(
      ".recharts-radial-bar-background-sector"
    )
  );

/** One ring per category, in the config colors, on a gray track */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    await findSvg(canvasElement);

    await step("Draws one ring per data row", async () => {
      await expect(rings(canvasElement)).toHaveLength(data.length);
    });

    await step(
      "Rings use the palette CSS variables of their category",
      async () => {
        const fills = rings(canvasElement).map((r) => r.getAttribute("fill"));
        await expect(fills).toEqual([
          "var(--nimbus-colors-chart-ctviolet)",
          "var(--nimbus-colors-chart-orange)",
          "var(--nimbus-colors-chart-teal)",
        ]);
      }
    );
  },
};

/** Each ring has a light gray track from a Nimbus token */
export const Track: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const all = tracks(canvasElement);
    await expect(all).toHaveLength(data.length);
    for (const track of all) {
      await expect(track).toHaveAttribute(
        "fill",
        "var(--nimbus-colors-neutral-4)"
      );
      // Resolves to a light gray (equal channels, bright) in light mode
      const [r, g, b] = getComputedStyle(track).fill.match(/\d+/g)!.map(Number);
      await expect(r).toBe(g);
      await expect(g).toBe(b);
      await expect(r).toBeGreaterThan(200);
    }
  },
};

/** Adjacent rings are separated by a 2 px stroke in the bg color */
export const RingStroke: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const all = rings(canvasElement);
    await expect(all).toHaveLength(data.length);
    for (const ring of all) {
      await expect(ring).toHaveAttribute("stroke", "var(--nimbus-colors-bg)");
      await expect(ring).toHaveAttribute("stroke-width", "2");
      await expect(getComputedStyle(ring).stroke).toBe("rgb(255, 255, 255)");
    }
  },
};

/** The tooltip label is the category name, not an index */
export const TooltipLabelIsCategory: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Chrome")
    );
    await expect(tooltipText(canvasElement)).not.toHaveTextContent("Chrome0");
    await expect(tooltipText(canvasElement)?.textContent).not.toMatch(/^0/);
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
      "var(--nimbus-colors-chart-ctviolet)"
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
      "var(--nimbus-colors-chart-ctviolet)"
    );
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
    await expect(
      rings(canvasElement)[0].getAttribute("fill") ===
        "var(--nimbus-colors-chart-ctviolet)"
    ).toBe(true);
  },
};
