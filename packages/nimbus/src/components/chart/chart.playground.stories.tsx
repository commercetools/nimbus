import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  AreaChart,
  BarChart,
  Box,
  Card,
  Chart,
  type ChartConfig,
  Heading,
  LineChart,
  Meter,
  type MeterSegment,
  PieChart,
  RadarChart,
  RadialChart,
  SimpleGrid,
  Stack,
  Text,
} from "@commercetools/nimbus";

const meta: Meta = {
  title: "Playground/Charts",
};

export default meta;

type Story = StoryObj;

// ============================================================
// FAKE DATA
// ============================================================

/** Revenue per month in thousands of euros, online and in the shops */
const revenue = [
  { month: "Jan", online: 86, shops: 42 },
  { month: "Feb", online: 92, shops: 38 },
  { month: "Mar", online: 110, shops: 45 },
  { month: "Apr", online: 118, shops: 50 },
  { month: "May", online: 131, shops: 54 },
  { month: "Jun", online: 127, shops: 58 },
  { month: "Jul", online: 142, shops: 61 },
  { month: "Aug", online: 138, shops: 57 },
  { month: "Sep", online: 156, shops: 63 },
  { month: "Oct", online: 171, shops: 70 },
  { month: "Nov", online: 224, shops: 88 },
  { month: "Dec", online: 268, shops: 104 },
];
const revenueConfig = {
  online: { label: "Online", palette: "ctviolet" },
  shops: { label: "Shops", palette: "teal" },
} satisfies ChartConfig;

/** Orders per weekday by device */
const ordersByDay = [
  { day: "Mon", desktop: 120, mobile: 98, tablet: 24 },
  { day: "Tue", desktop: 132, mobile: 105, tablet: 28 },
  { day: "Wed", desktop: 128, mobile: 118, tablet: 22 },
  { day: "Thu", desktop: 141, mobile: 126, tablet: 31 },
  { day: "Fri", desktop: 165, mobile: 152, tablet: 36 },
  { day: "Sat", desktop: 190, mobile: 214, tablet: 41 },
  { day: "Sun", desktop: 158, mobile: 201, tablet: 33 },
];
const ordersConfig = {
  desktop: { label: "Desktop", palette: "ctviolet" },
  mobile: { label: "Mobile", palette: "orange" },
  tablet: { label: "Tablet", palette: "teal" },
} satisfies ChartConfig;

/** Share of revenue by sales channel */
const channels = [
  { channel: "Web shop", revenue: 1840 },
  { channel: "Mobile app", revenue: 920 },
  { channel: "Marketplace", revenue: 610 },
  { channel: "Stores", revenue: 540 },
  { channel: "B2B portal", revenue: 280 },
];
const channelConfig = {
  "Web shop": { label: "Web shop", palette: "ctviolet" },
  "Mobile app": { label: "Mobile app", palette: "orange" },
  Marketplace: { label: "Marketplace", palette: "teal" },
  Stores: { label: "Stores", palette: "crimson" },
  "B2B portal": { label: "B2B portal", palette: "blue" },
} satisfies ChartConfig;

/** Conversion rate in percent for four traffic sources over eight weeks */
const conversion = [
  { week: "W1", search: 3.1, email: 5.2, social: 1.8, direct: 4.1 },
  { week: "W2", search: 3.3, email: 5.0, social: 2.0, direct: 4.3 },
  { week: "W3", search: 3.0, email: 5.6, social: 2.4, direct: 4.2 },
  { week: "W4", search: 3.6, email: 5.9, social: 2.1, direct: 4.6 },
  { week: "W5", search: 3.8, email: 6.3, social: 2.7, direct: 4.5 },
  { week: "W6", search: 3.7, email: 6.1, social: 3.0, direct: 4.9 },
  { week: "W7", search: 4.1, email: 6.8, social: 2.9, direct: 5.1 },
  { week: "W8", search: 4.4, email: 7.2, social: 3.3, direct: 5.3 },
];
const conversionConfig = {
  search: { label: "Search", palette: "ctviolet" },
  email: { label: "Email", palette: "orange" },
  social: { label: "Social", palette: "teal" },
  direct: { label: "Direct", palette: "crimson" },
} satisfies ChartConfig;

/** Customer satisfaction scores per topic, this store and the market average */
const satisfaction = [
  { topic: "Delivery", store: 86, market: 78 },
  { topic: "Price", store: 72, market: 75 },
  { topic: "Support", store: 91, market: 80 },
  { topic: "Returns", store: 83, market: 70 },
  { topic: "Range", store: 77, market: 82 },
  { topic: "Website", store: 88, market: 79 },
];
const satisfactionConfig = {
  store: { label: "Our store", palette: "ctviolet" },
  market: { label: "Market", palette: "slate" },
} satisfies ChartConfig;

/** Orders shipped on time per warehouse, in percent */
const warehouses = [
  { warehouse: "Berlin", shipped: 97 },
  { warehouse: "Munich", shipped: 91 },
  { warehouse: "Hamburg", shipped: 84 },
  { warehouse: "Leipzig", shipped: 72 },
];
const warehouseConfig = {
  Berlin: { label: "Berlin", palette: "ctviolet" },
  Munich: { label: "Munich", palette: "teal" },
  Hamburg: { label: "Hamburg", palette: "orange" },
  Leipzig: { label: "Leipzig", palette: "crimson" },
} satisfies ChartConfig;

/** Orders and the refund trend per month, for a chart that mixes bars and a line */
const ordersAndRefunds = [
  { month: "Jul", orders: 3120, refunds: 3.4 },
  { month: "Aug", orders: 2980, refunds: 3.1 },
  { month: "Sep", orders: 3410, refunds: 3.3 },
  { month: "Oct", orders: 3760, refunds: 2.9 },
  { month: "Nov", orders: 5120, refunds: 3.8 },
  { month: "Dec", orders: 6040, refunds: 4.2 },
];
const mixedConfig = {
  orders: { label: "Orders", palette: "ctviolet" },
  refunds: { label: "Refund rate (%)", palette: "orange" },
} satisfies ChartConfig;

/** Stock by category, for the segmented meter */
const stock: MeterSegment[] = [
  { id: "apparel", label: "Apparel", value: 2400 },
  { id: "shoes", label: "Shoes", value: 1500 },
  { id: "accessories", label: "Accessories", value: 900 },
  { id: "home", label: "Home", value: 700 },
];

// ============================================================
// LAYOUT HELPERS
// ============================================================

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <Text fontWeight="700" fontSize="500">
    {children}
  </Text>
);

const Caption = ({ children }: { children: ReactNode }) => (
  <Text color="neutral.11" fontSize="300">
    {children}
  </Text>
);

/** A card with a title, a short description and the chart below */
const ChartCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Card.Root variant="outlined">
    <Card.Header>
      <Stack gap="100">
        <Text fontWeight="600">{title}</Text>
        {description && <Caption>{description}</Caption>}
      </Stack>
    </Card.Header>
    <Card.Body>{children}</Card.Body>
  </Card.Root>
);

/** A number with a label, for the top row */
const Kpi = ({
  label,
  value,
  note,
  children,
}: {
  label: string;
  value: string;
  note: string;
  children?: ReactNode;
}) => (
  <Card.Root variant="outlined">
    <Card.Body>
      <Stack gap="200">
        <Caption>{label}</Caption>
        <Text fontWeight="700" fontSize="700">
          {value}
        </Text>
        <Caption>{note}</Caption>
        {children}
      </Stack>
    </Card.Body>
  </Card.Root>
);

// ============================================================
// STORIES
// ============================================================

/**
 * A fake e-commerce dashboard: every chart type, the `Chart` parts, and the
 * Meter component in one view. The data is made up.
 */
export const EcommerceDashboard: Story = {
  render: () => (
    <Stack gap="800" padding="600" maxWidth="1280px">
      <Stack gap="100">
        <Heading as="h1" size="xl">
          Store overview
        </Heading>
        <Caption>Last 12 months, all channels. Fake data.</Caption>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="400">
        <Kpi label="Revenue" value="€2.19M" note="Goal: €2.8M">
          <Meter.Root value={78} aria-label="Revenue goal reached" size="sm">
            <Meter.Track />
          </Meter.Root>
        </Kpi>
        <Kpi label="Orders" value="38,420" note="96% shipped">
          <Meter.Root value={96} aria-label="Orders shipped" size="sm">
            <Meter.Track />
          </Meter.Root>
        </Kpi>
        <Kpi label="Conversion" value="4.6%" note="Up from 3.9%">
          <Meter.Root
            value={4.6}
            maxValue={8}
            aria-label="Conversion against a target of 8 percent"
            size="sm"
            colorPalette="positive"
          >
            <Meter.Track />
          </Meter.Root>
        </Kpi>
        <Kpi label="Refund rate" value="3.4%" note="Limit: 4%">
          <Meter.Root
            value={3.4}
            maxValue={4}
            aria-label="Refund rate against the 4 percent limit"
            size="sm"
            colorPalette="warning"
          >
            <Meter.Track />
          </Meter.Root>
        </Kpi>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
        <Box gridColumn={{ xl: "span 2" }}>
          <ChartCard
            title="Revenue"
            description="Online and shops, in thousands of euros"
          >
            <AreaChart
              aria-label="Revenue per month, online and in the shops"
              data={revenue}
              xAxisKey="month"
              series={["online", "shops"]}
              config={revenueConfig}
              stacked
            />
          </ChartCard>
        </Box>
        <ChartCard title="Sales channels" description="Share of revenue">
          <PieChart
            aria-label="Share of revenue by sales channel"
            data={channels}
            nameKey="channel"
            valueKey="revenue"
            config={channelConfig}
          />
        </ChartCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="400">
        <ChartCard title="Orders per weekday" description="By device">
          <BarChart
            aria-label="Orders per weekday by device"
            data={ordersByDay}
            xAxisKey="day"
            series={["desktop", "mobile", "tablet"]}
            config={ordersConfig}
          />
        </ChartCard>
        <ChartCard
          title="Conversion rate"
          description="Percent, by traffic source. Four lines, so each has a dash pattern."
        >
          <LineChart
            aria-label="Conversion rate per week by traffic source"
            data={conversion}
            xAxisKey="week"
            series={["search", "email", "social", "direct"]}
            config={conversionConfig}
          />
        </ChartCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
        <ChartCard
          title="Customer satisfaction"
          description="Score per topic, against the market"
        >
          <RadarChart
            aria-label="Customer satisfaction per topic, our store and the market"
            data={satisfaction}
            xAxisKey="topic"
            series={["store", "market"]}
            config={satisfactionConfig}
          />
        </ChartCard>
        <ChartCard title="On-time shipping" description="Percent per warehouse">
          <RadialChart
            aria-label="Orders shipped on time per warehouse"
            data={warehouses}
            nameKey="warehouse"
            valueKey="shipped"
            config={warehouseConfig}
          />
        </ChartCard>
        <ChartCard
          title="Orders and refunds"
          description="Bars and a line, built with the Chart parts"
        >
          <Chart.Root
            aria-label="Orders and refund rate per month"
            data={ordersAndRefunds}
            config={mixedConfig}
          >
            <Chart.Plot>
              <Chart.Grid />
              <Chart.XAxis dataKey="month" />
              <Chart.Tooltip />
              <Chart.Bar dataKey="orders" />
              <Chart.Line dataKey="refunds" />
            </Chart.Plot>
          </Chart.Root>
        </ChartCard>
      </SimpleGrid>

      <Stack gap="400">
        <SectionHeading>Stock</SectionHeading>
        <Card.Root variant="outlined">
          <Card.Body>
            <Meter.Root
              segments={stock}
              maxValue={6000}
              formatOptions={{ style: "decimal" }}
            >
              <Meter.Label>Units in stock by category</Meter.Label>
              <Meter.Value />
              <Meter.Track />
              <Meter.Legend />
            </Meter.Root>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Eight Recharts charts: area, pie, bar, line, radar, radial, and the
    // mixed chart. The count is checked on the drawing surfaces.
    await expect(
      canvasElement.querySelectorAll("svg.recharts-surface").length
    ).toBeGreaterThanOrEqual(7);
    await expect(canvas.getAllByRole("meter").length).toBeGreaterThanOrEqual(5);
  },
};

/**
 * The same charts with their options: single series with a legend, no grid,
 * stacked and grouped bars, many lines, loading and empty states.
 */
export const Variants: Story = {
  render: () => (
    <Stack gap="800" padding="600" maxWidth="1280px">
      <Stack gap="400">
        <SectionHeading>Bar</SectionHeading>
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
          <ChartCard title="Grouped (default)">
            <BarChart
              aria-label="Orders per weekday by device, grouped"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop", "mobile"]}
              config={ordersConfig}
            />
          </ChartCard>
          <ChartCard title="Stacked">
            <BarChart
              aria-label="Orders per weekday by device, stacked"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop", "mobile", "tablet"]}
              config={ordersConfig}
              stacked
            />
          </ChartCard>
          <ChartCard title="One series, legend on, no grid">
            <BarChart
              aria-label="Desktop orders per weekday"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop"]}
              config={ordersConfig}
              showLegend
              showGrid={false}
            />
          </ChartCard>
        </SimpleGrid>
      </Stack>

      <Stack gap="400">
        <SectionHeading>Line and area</SectionHeading>
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
          <ChartCard title="Line, two series">
            <LineChart
              aria-label="Revenue per month, online and in the shops"
              data={revenue}
              xAxisKey="month"
              series={["online", "shops"]}
              config={revenueConfig}
            />
          </ChartCard>
          <ChartCard title="Line, four series (dash patterns)">
            <LineChart
              aria-label="Conversion rate per week by traffic source"
              data={conversion}
              xAxisKey="week"
              series={["search", "email", "social", "direct"]}
              config={conversionConfig}
            />
          </ChartCard>
          <ChartCard title="Area, one series, no tooltip">
            <AreaChart
              aria-label="Online revenue per month"
              data={revenue}
              xAxisKey="month"
              series={["online"]}
              config={revenueConfig}
              showTooltip={false}
            />
          </ChartCard>
        </SimpleGrid>
      </Stack>

      <Stack gap="400">
        <SectionHeading>Pie, radar and radial</SectionHeading>
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
          <ChartCard title="Pie">
            <PieChart
              aria-label="Share of revenue by sales channel"
              data={channels}
              nameKey="channel"
              valueKey="revenue"
              config={channelConfig}
            />
          </ChartCard>
          <ChartCard title="Radar, one series">
            <RadarChart
              aria-label="Customer satisfaction per topic"
              data={satisfaction}
              xAxisKey="topic"
              series={["store"]}
              config={satisfactionConfig}
              showLegend
            />
          </ChartCard>
          <ChartCard title="Radial">
            <RadialChart
              aria-label="Orders shipped on time per warehouse"
              data={warehouses}
              nameKey="warehouse"
              valueKey="shipped"
              config={warehouseConfig}
            />
          </ChartCard>
        </SimpleGrid>
      </Stack>

      <Stack gap="400">
        <SectionHeading>States</SectionHeading>
        <SimpleGrid columns={{ base: 1, xl: 3 }} gap="400">
          <ChartCard title="Loading">
            <BarChart
              aria-label="Orders per weekday, loading"
              data={ordersByDay}
              xAxisKey="day"
              series={["desktop"]}
              config={ordersConfig}
              isLoading
            />
          </ChartCard>
          <ChartCard title="Empty">
            <LineChart
              aria-label="Revenue per month, no data"
              data={[]}
              xAxisKey="month"
              series={["online"]}
              config={revenueConfig}
            />
          </ChartCard>
          <ChartCard title="Composed, stacked areas">
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
          </ChartCard>
        </SimpleGrid>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvasElement.querySelectorAll("svg.recharts-surface").length
    ).toBeGreaterThanOrEqual(10);
    await expect(canvas.getByText("No data to display")).toBeInTheDocument();
  },
};
