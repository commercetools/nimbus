import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  AreaChart,
  BarChart,
  Box,
  Chart,
  Heading,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";
import {
  channelConfig,
  channels,
  conversion,
  conversionConfig,
  ordersByDay,
  ordersConfig,
  revenue,
  revenueConfig,
  satisfaction,
  satisfactionConfig,
  warehouseConfig,
  warehouses,
} from "./chart.playground.data";

const meta: Meta = {
  title: "Playground/Charts/Variants",
};

export default meta;

type Story = StoryObj;

/**
 * The same charts with their options: single series with a legend, no grid,
 * stacked and grouped bars, many lines, loading and empty states.
 */
export const Variants: Story = {
  render: () => (
    <Box
      maxWidth="1200px"
      marginInline="auto"
      paddingX={{ base: "400", md: "800" }}
      paddingY="800"
    >
      <Stack gap="1000">
        <VariantGroup
          title="Bar"
          lead="Grouped by default, stacked with a prop."
        >
          <Variant caption="Grouped (default)">
            <BarChart
              aria-label="Orders per weekday by device, grouped"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop", "mobile"]}
              config={ordersConfig}
            />
          </Variant>
          <Variant caption="stacked">
            <BarChart
              aria-label="Orders per weekday by device, stacked"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop", "mobile", "tablet"]}
              config={ordersConfig}
              stacked
            />
          </Variant>
          <Variant caption="One series, showLegend, showGrid={false}">
            <BarChart
              aria-label="Desktop orders per weekday"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop"]}
              config={ordersConfig}
              showLegend
              showGrid={false}
            />
          </Variant>
        </VariantGroup>

        <VariantGroup
          title="Line and area"
          lead="Smooth curves that never go below the lowest value."
        >
          <Variant caption="Line, two series">
            <LineChart
              aria-label="Revenue per month, online and in the shops"
              data={revenue}
              xAxisKey="month"
              series={["online", "shops"]}
              config={revenueConfig}
            />
          </Variant>
          <Variant caption="Line, four series: each also gets a dash pattern">
            <LineChart
              aria-label="Conversion rate per week by traffic source"
              data={conversion}
              xAxisKey="week"
              series={["search", "email", "social", "direct"]}
              config={conversionConfig}
            />
          </Variant>
          <Variant caption="Area, one series, showTooltip={false}">
            <AreaChart
              aria-label="Online revenue per month"
              data={revenue}
              xAxisKey="month"
              series={["online"]}
              config={revenueConfig}
              showTooltip={false}
            />
          </Variant>
        </VariantGroup>

        <VariantGroup
          title="Pie, radar and radial"
          lead="Shapes are separated by a stroke in the background color."
        >
          <Variant caption="Pie">
            <PieChart
              aria-label="Share of revenue by sales channel"
              data={channels}
              nameKey="channel"
              valueKey="share"
              config={channelConfig}
            />
          </Variant>
          <Variant caption="Radar, one series, showLegend">
            <RadarChart
              aria-label="Customer satisfaction per topic"
              data={satisfaction}
              xAxisKey="topic"
              series={["store"]}
              config={satisfactionConfig}
              showLegend
            />
          </Variant>
          <Variant caption="Radial">
            <RadialChart
              aria-label="Orders shipped on time per warehouse"
              data={warehouses}
              nameKey="warehouse"
              valueKey="shipped"
              config={warehouseConfig}
            />
          </Variant>
        </VariantGroup>

        <VariantGroup
          title="States and parts"
          lead="Loading and empty states, and a chart composed from the Chart parts."
        >
          <Variant caption="isLoading">
            <BarChart
              aria-label="Orders per weekday, loading"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop"]}
              config={ordersConfig}
              isLoading
            />
          </Variant>
          <Variant caption="Empty data">
            <LineChart
              aria-label="Revenue per month, no data"
              data={[]}
              xAxisKey="month"
              series={["online"]}
              config={revenueConfig}
            />
          </Variant>
          <Variant caption="Chart parts: two stacked areas">
            <Chart.Root
              aria-label="Revenue per month, composed from parts"
              data={revenue}
              config={revenueConfig}
            >
              <Chart.Plot>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.Tooltip />
                <Chart.Area dataKey="online" stacked />
                <Chart.Area dataKey="shops" stacked />
              </Chart.Plot>
            </Chart.Root>
          </Variant>
        </VariantGroup>
      </Stack>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvasElement.querySelectorAll("svg.recharts-surface").length
    ).toBeGreaterThanOrEqual(10);
    await expect(canvas.getByText("No data to display")).toBeInTheDocument();
  },
};

/** A group of variants under one heading, separated from the next by a hairline */
function VariantGroup({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <Stack
      as="section"
      gap="600"
      borderTopWidth="1px"
      borderColor="neutral.6"
      paddingTop="600"
    >
      <Stack gap="100">
        <Heading as="h2" size="xl">
          {title}
        </Heading>
        <Text color="fg.subtle" textStyle="md">
          {lead}
        </Text>
      </Stack>
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="800">
        {children}
      </SimpleGrid>
    </Stack>
  );
}

/** One chart with a caption that names the props that make it different */
function Variant({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="300" minWidth="0">
      {children}
      <Text color="fg.subtle" textStyle="sm" textAlign="center">
        {caption}
      </Text>
    </Stack>
  );
}
