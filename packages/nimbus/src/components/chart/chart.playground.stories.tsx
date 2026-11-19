import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  AreaChart,
  BarChart,
  Badge,
  Box,
  Chart,
  type ChartConfig,
  Flex,
  Heading,
  LineChart,
  Meter,
  type MeterSegment,
  PieChart,
  RadarChart,
  RadialChart,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@commercetools/nimbus";
import { ArrowDownward, ArrowUpward } from "@commercetools/nimbus-icons";

const meta: Meta = {
  title: "Playground/Charts",
};

export default meta;

type Story = StoryObj;

// ============================================================
// FAKE DATA: Nordlicht Outdoor, a made-up outdoor gear retailer
// ============================================================

/** Revenue per month in thousands of euros */
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

/**
 * Scales a series to 20 to 100, so a sparkline shows the shape of the trend
 * even when the values barely change. A sparkline has no axis and no tooltip,
 * so the scaled values are never shown.
 */
const toShape = (values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value) => 20 + (80 * (value - min)) / (max - min));
};

const revenueTotals = revenue.map((row) => row.online + row.shops);
const orderTotals = [
  1900, 1980, 2210, 2350, 2680, 2870, 3120, 2980, 3410, 3760, 5120, 6040,
];
const conversionRates = [
  3.2, 3.3, 3.4, 3.6, 3.7, 3.7, 3.9, 3.9, 4.1, 4.3, 4.5, 4.6,
];
const refundRates = [
  3.9, 3.8, 3.8, 3.7, 3.6, 3.7, 3.5, 3.6, 3.5, 3.4, 3.5, 3.4,
];

/** The scaled trend of each key figure for the sparklines */
const trends = {
  revenue: toShape(revenueTotals),
  orders: toShape(orderTotals),
  conversion: toShape(conversionRates),
  refunds: toShape(refundRates),
};
const monthly = revenue.map((row, index) => ({
  month: row.month,
  revenue: trends.revenue[index],
  orders: trends.orders[index],
  conversion: trends.conversion[index],
  refunds: trends.refunds[index],
}));

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

/** Conversion rate in percent for four traffic sources over eight weeks */
const conversion = [
  { week: "Wk 40", search: 3.1, email: 5.2, social: 1.8, direct: 4.1 },
  { week: "Wk 41", search: 3.3, email: 5.0, social: 2.0, direct: 4.3 },
  { week: "Wk 42", search: 3.0, email: 5.6, social: 2.4, direct: 4.2 },
  { week: "Wk 43", search: 3.6, email: 5.9, social: 2.1, direct: 4.6 },
  { week: "Wk 44", search: 3.8, email: 6.3, social: 2.7, direct: 4.5 },
  { week: "Wk 45", search: 3.7, email: 6.1, social: 3.0, direct: 4.9 },
  { week: "Wk 46", search: 4.1, email: 6.8, social: 2.9, direct: 5.1 },
  { week: "Wk 47", search: 4.4, email: 7.2, social: 3.3, direct: 5.3 },
];
const conversionConfig = {
  search: { label: "Search", palette: "ctviolet" },
  email: { label: "Email", palette: "orange" },
  social: { label: "Social", palette: "teal" },
  direct: { label: "Direct", palette: "crimson" },
} satisfies ChartConfig;

/** Orders and the forecast per month, for the chart that mixes bars and a line */
const ordersAndForecast = [
  { month: "Jul", orders: 3120, forecast: 3000 },
  { month: "Aug", orders: 2980, forecast: 3100 },
  { month: "Sep", orders: 3410, forecast: 3300 },
  { month: "Oct", orders: 3760, forecast: 3600 },
  { month: "Nov", orders: 5120, forecast: 4800 },
  { month: "Dec", orders: 6040, forecast: 5600 },
];
const forecastConfig = {
  orders: { label: "Orders", palette: "ctviolet" },
  forecast: { label: "Forecast", palette: "orange" },
} satisfies ChartConfig;

/** Share of revenue by sales channel, in percent */
const channels = [
  { channel: "Web shop", share: 42 },
  { channel: "Mobile app", share: 24 },
  { channel: "Marketplace", share: 14 },
  { channel: "Stores", share: 13 },
  { channel: "B2B portal", share: 7 },
];
const channelConfig = {
  "Web shop": { label: "Web shop", palette: "ctviolet" },
  "Mobile app": { label: "Mobile app", palette: "orange" },
  Marketplace: { label: "Marketplace", palette: "teal" },
  Stores: { label: "Stores", palette: "crimson" },
  "B2B portal": { label: "B2B portal", palette: "blue" },
} satisfies ChartConfig;

/** Customer satisfaction per topic, this store against the market */
const satisfaction = [
  { topic: "Delivery", store: 86, market: 78 },
  { topic: "Price", store: 72, market: 75 },
  { topic: "Support", store: 91, market: 80 },
  { topic: "Returns", store: 83, market: 70 },
  { topic: "Range", store: 77, market: 82 },
  { topic: "Website", store: 88, market: 79 },
];
const satisfactionConfig = {
  store: { label: "Nordlicht", palette: "ctviolet" },
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

/** Units in stock by category, for the segmented meter */
const stock: MeterSegment[] = [
  { id: "apparel", label: "Apparel", value: 2400 },
  { id: "shoes", label: "Shoes", value: 1500 },
  { id: "accessories", label: "Accessories", value: 900 },
  { id: "home", label: "Home", value: 700 },
];

const orders = [
  {
    id: "48213",
    customer: "Maren Vogt",
    channel: "Mobile app",
    status: "Delayed",
    palette: "critical",
    packed: 38,
  },
  {
    id: "48207",
    customer: "Jonas Albrecht",
    channel: "Web shop",
    status: "Backorder",
    palette: "warning",
    packed: 20,
  },
  {
    id: "48199",
    customer: "Studio Nord GmbH",
    channel: "B2B portal",
    status: "Packing",
    palette: "info",
    packed: 64,
  },
  {
    id: "48191",
    customer: "Lea Hartmann",
    channel: "Marketplace",
    status: "Packing",
    palette: "info",
    packed: 71,
  },
  {
    id: "48180",
    customer: "Tobias Reiter",
    channel: "Web shop",
    status: "Shipped",
    palette: "positive",
    packed: 100,
  },
] as const;

// ============================================================
// LAYOUT PARTS
// ============================================================

const figures = { fontVariantNumeric: "tabular-nums" } as const;

/**
 * The dashboard is a visual regression page, so its charts do not animate:
 * Chromatic would otherwise capture a frame in the middle of the drawing.
 */
const still = { isAnimationActive: false } as const;

/**
 * A page section. Sections are separated by a hairline, not boxed in cards,
 * so the charts sit directly on the page.
 */
const Section = ({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) => (
  <Box
    as="section"
    aria-labelledby={labelledBy}
    borderTopWidth="1px"
    borderColor="neutral.6"
    paddingTop="800"
  >
    {children}
  </Box>
);

/** The sentence that says what a chart shows, with the numbers that matter */
const Finding = ({
  id,
  title,
  level = "h3",
  children,
}: {
  id: string;
  title: string;
  level?: "h2" | "h3";
  children: ReactNode;
}) => (
  <Stack gap="300" maxWidth="40ch">
    <Heading
      as={level}
      id={id}
      size={level === "h2" ? "2xl" : "xl"}
      letterSpacing="-0.01em"
    >
      {title}
    </Heading>
    <Text color="fg.subtle" textStyle="md">
      {children}
    </Text>
  </Stack>
);

/** Text on the left, chart on the right. Stacks on narrow screens. */
const TextAndChart = ({
  text,
  children,
}: {
  text: ReactNode;
  children: ReactNode;
}) => (
  <Box
    display="grid"
    gridTemplateColumns={{ base: "1fr", lg: "minmax(0, 1fr) minmax(0, 2fr)" }}
    gap={{ base: "600", lg: "1200" }}
    alignItems="start"
  >
    {text}
    <Box minWidth="0">{children}</Box>
  </Box>
);

/** A change against last year. Green means better, also for a falling rate. */
const Delta = ({
  children,
  falling,
}: {
  children: string;
  falling?: boolean;
}) => (
  <Badge size="2xs" colorPalette="positive">
    {falling ? <ArrowDownward /> : <ArrowUpward />}
    {children}
  </Badge>
);

/** A small chart without axes, built from the Chart parts */
const Sparkline = ({
  label,
  dataKey,
  seriesLabel,
}: {
  label: string;
  dataKey: "revenue" | "orders" | "conversion" | "refunds";
  seriesLabel: string;
}) => (
  <Box
    marginInline="-12px"
    css={{ "& .nimbus-chart__plot": { aspectRatio: "6 / 1" } }}
  >
    <Chart.Root
      {...still}
      aria-label={label}
      data={monthly}
      config={{ [dataKey]: { label: seriesLabel, palette: "ctviolet" } }}
    >
      <Chart.Plot>
        <Chart.Area dataKey={dataKey} />
      </Chart.Plot>
    </Chart.Root>
  </Box>
);

const KeyFigure = ({
  index,
  label,
  value,
  delta,
  falling,
  sparkline,
}: {
  index: number;
  label: string;
  value: string;
  delta: string;
  falling?: boolean;
  sparkline: ReactNode;
}) => (
  <Stack
    gap="200"
    paddingY="600"
    paddingInlineStart={{
      base: index % 2 ? "600" : "0",
      lg: index ? "600" : "0",
    }}
    paddingInlineEnd="600"
    borderInlineStartWidth={{
      base: index % 2 ? "1px" : "0",
      lg: index ? "1px" : "0",
    }}
    borderColor="neutral.6"
  >
    <Text color="fg.subtle" textStyle="sm">
      {label}
    </Text>
    <Flex align="center" gap="300" wrap="wrap">
      <Text
        textStyle="3xl"
        fontWeight="600"
        letterSpacing="-0.02em"
        {...figures}
      >
        {value}
      </Text>
      <Delta falling={falling}>{delta}</Delta>
    </Flex>
    {sparkline}
  </Stack>
);

// ============================================================
// STORIES
// ============================================================

/**
 * A fake e-commerce dashboard for a made-up outdoor gear retailer. It shows
 * every chart type, the `Chart` parts (sparklines and a bar and line chart)
 * and the Meter component. Each chart is introduced by what it shows. Every
 * chart is visible without interaction and does not animate, so this story is
 * one stable frame for the visual regression test.
 */
export const EcommerceDashboard: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box
      maxWidth="1200px"
      marginInline="auto"
      paddingX={{ base: "400", md: "800" }}
      paddingY="800"
    >
      <Stack gap="1000">
        <Stack gap="600" as="header">
          <Text color="fg.subtle" textStyle="sm">
            Nordlicht Outdoor, week 47 (17 to 23 November). All figures are made
            up.
          </Text>
          <Heading
            as="h1"
            size={{ base: "3xl", md: "5xl" }}
            letterSpacing="-0.03em"
            maxWidth="22ch"
            textWrap="balance"
          >
            Sales are 18% above last year, and the app drives most of it.
          </Heading>
          <Text color="fg.subtle" textStyle="lg" maxWidth="56ch">
            Leipzig ships late. Fix that before Black Friday.
          </Text>
          <Box maxWidth="420px">
            <Meter.Root
              value={83}
              size="sm"
              layout="inline"
              valueLabel="83% of €3.0M"
            >
              <Meter.Label>Revenue goal</Meter.Label>
              <Meter.Track />
              <Meter.Value />
            </Meter.Root>
          </Box>
        </Stack>

        <Box
          as="section"
          aria-label="Key figures"
          borderTopWidth="1px"
          borderColor="neutral.6"
        >
          <SimpleGrid columns={{ base: 2, lg: 4 }} gap="0">
            <KeyFigure
              index={0}
              label="Revenue, 12 months"
              value="€2.49M"
              delta="18%"
              sparkline={
                <Sparkline
                  label="Revenue trend over 12 months"
                  dataKey="revenue"
                  seriesLabel="Revenue"
                />
              }
            />
            <KeyFigure
              index={1}
              label="Orders"
              value="38,420"
              delta="9%"
              sparkline={
                <Sparkline
                  label="Orders trend over 12 months"
                  dataKey="orders"
                  seriesLabel="Orders"
                />
              }
            />
            <KeyFigure
              index={2}
              label="Conversion rate"
              value="4.6%"
              delta="0.7 pt"
              sparkline={
                <Sparkline
                  label="Conversion rate trend over 12 months"
                  dataKey="conversion"
                  seriesLabel="Conversion rate"
                />
              }
            />
            <KeyFigure
              index={3}
              label="Refund rate"
              value="3.4%"
              delta="0.3 pt"
              falling
              sparkline={
                <Sparkline
                  label="Refund rate trend over 12 months"
                  dataKey="refunds"
                  seriesLabel="Refund rate"
                />
              }
            />
          </SimpleGrid>
        </Box>

        <Section labelledBy="revenue-heading">
          <Stack gap="800">
            <Finding
              id="revenue-heading"
              level="h2"
              title="Online grew faster than the shops all year"
            >
              Online revenue grew 3.1 times from January to December, the shops
              2.5 times. November and December carry the gap.
            </Finding>
            <Box
              css={{
                "& .nimbus-chart__plot": {
                  aspectRatio: { base: "4 / 3", md: "3 / 1" },
                },
              }}
            >
              <AreaChart
                {...still}
                aria-label="Revenue per month in thousands of euros, online and shops"
                data={revenue}
                xAxisKey="month"
                series={["online", "shops"]}
                config={revenueConfig}
                stacked
              />
            </Box>
          </Stack>
        </Section>

        <Section labelledBy="orders-heading">
          <Stack gap="800">
            <Heading as="h2" id="orders-heading" size="2xl">
              Orders and conversion
            </Heading>
            <Stack gap="1200">
              <TextAndChart
                text={
                  <Finding
                    id="devices-heading"
                    title="Mobile overtakes desktop at the weekend"
                  >
                    On Saturday mobile brings 214 orders and desktop 190. On
                    Sunday the gap grows to 201 against 158.
                  </Finding>
                }
              >
                <BarChart
                  {...still}
                  aria-label="Orders per weekday by device"
                  data={ordersByDay}
                  xAxisKey="day"
                  series={["desktop", "mobile", "tablet"]}
                  config={ordersConfig}
                />
              </TextAndChart>
              <TextAndChart
                text={
                  <Finding
                    id="sources-heading"
                    title="Email converts best, and social is catching up"
                  >
                    Email reached 7.2% this week. Social almost doubled since
                    week 40, from 1.8% to 3.3%. Each line also has its own dash
                    pattern, so it works without color.
                  </Finding>
                }
              >
                <LineChart
                  {...still}
                  aria-label="Conversion rate per week by traffic source"
                  data={conversion}
                  xAxisKey="week"
                  series={["search", "email", "social", "direct"]}
                  config={conversionConfig}
                />
              </TextAndChart>
              <TextAndChart
                text={
                  <Finding
                    id="forecast-heading"
                    title="Orders have beaten the forecast since September"
                  >
                    August was the only month below the line. December came in
                    at 6,040 orders against a forecast of 5,600. This chart is
                    composed from the Chart parts: bars and a line in one plot.
                  </Finding>
                }
              >
                <Chart.Root
                  {...still}
                  aria-label="Orders and forecast per month"
                  data={ordersAndForecast}
                  config={forecastConfig}
                >
                  <Chart.Plot>
                    <Chart.Grid />
                    <Chart.XAxis dataKey="month" />
                    <Chart.Tooltip />
                    <Chart.Bar dataKey="orders" />
                    <Chart.Line dataKey="forecast" />
                  </Chart.Plot>
                </Chart.Root>
              </TextAndChart>
            </Stack>
          </Stack>
        </Section>

        <Section labelledBy="quality-heading">
          <Stack gap="800">
            <Heading as="h2" id="quality-heading" size="2xl">
              Channels, service and shipping
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap="1000">
              <Stack gap="600">
                <Finding
                  id="channels-heading"
                  title="The web shop and the app bring two thirds of revenue"
                >
                  Together they make 66%. The B2B portal is the smallest channel
                  at 7%.
                </Finding>
                <PieChart
                  {...still}
                  aria-label="Share of revenue by sales channel in percent"
                  data={channels}
                  nameKey="channel"
                  valueKey="share"
                  config={channelConfig}
                />
              </Stack>
              <Stack gap="600">
                <Finding
                  id="satisfaction-heading"
                  title="Customers rate us above the market on four of six topics"
                >
                  Support and returns lead. Price and range are the two topics
                  below the market.
                </Finding>
                <RadarChart
                  {...still}
                  aria-label="Customer satisfaction per topic, Nordlicht and the market"
                  data={satisfaction}
                  xAxisKey="topic"
                  series={["store", "market"]}
                  config={satisfactionConfig}
                />
              </Stack>
              <Stack gap="600">
                <Finding
                  id="shipping-heading"
                  title="Only Leipzig ships less than 80% on time"
                >
                  Berlin is at 97%. Leipzig is at 72% and has the most open
                  orders.
                </Finding>
                <RadialChart
                  {...still}
                  aria-label="Orders shipped on time per warehouse in percent"
                  data={warehouses}
                  nameKey="warehouse"
                  valueKey="shipped"
                  config={warehouseConfig}
                />
              </Stack>
            </SimpleGrid>
          </Stack>
        </Section>

        <Section labelledBy="stock-heading">
          <TextAndChart
            text={
              <Finding
                id="stock-heading"
                level="h2"
                title="The warehouses are 92% full, and apparel takes 44%"
              >
                5,500 of 6,000 units are in stock. Shoes follow apparel with
                1,500 units.
              </Finding>
            }
          >
            <Meter.Root
              segments={stock}
              maxValue={6000}
              size="lg"
              formatOptions={{ style: "decimal" }}
            >
              <Meter.Label>Units in stock by category</Meter.Label>
              <Meter.Value />
              <Meter.Track />
              <Meter.Legend />
            </Meter.Root>
          </TextAndChart>
        </Section>

        <Section labelledBy="orders-table-heading">
          <Stack gap="800">
            <Finding
              id="orders-table-heading"
              level="h2"
              title="Two orders are late or on backorder"
            >
              The meter shows how much of each order is packed.
            </Finding>
            <Box overflowX="auto">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Order</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer</Table.ColumnHeader>
                    <Table.ColumnHeader>Channel</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader width="30%">Packed</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orders.map((order) => (
                    <Table.Row key={order.id}>
                      <Table.Cell {...figures}>#{order.id}</Table.Cell>
                      <Table.Cell>{order.customer}</Table.Cell>
                      <Table.Cell>{order.channel}</Table.Cell>
                      <Table.Cell>
                        <Badge size="xs" colorPalette={order.palette}>
                          {order.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Meter.Root
                          value={order.packed}
                          size="sm"
                          layout="inline"
                          colorPalette={
                            order.palette === "positive"
                              ? "positive"
                              : "primary"
                          }
                          aria-label={`Order ${order.id} packed`}
                        >
                          <Meter.Track />
                          <Meter.Value />
                        </Meter.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Stack>
        </Section>
      </Stack>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Four sparklines, the revenue chart, three charts in the next section
    // and the selected tab: nine drawing surfaces in total.
    await expect(
      canvasElement.querySelectorAll("svg.recharts-surface").length
    ).toBeGreaterThanOrEqual(8);
    await expect(canvas.getAllByRole("meter").length).toBeGreaterThanOrEqual(7);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Sales are 18% above last year/
    );
  },
};

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
