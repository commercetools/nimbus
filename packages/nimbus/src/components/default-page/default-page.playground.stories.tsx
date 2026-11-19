import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type ReactNode } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  AreaChart,
  BarChart,
  Badge,
  Box,
  Button,
  Card,
  Chart,
  DefaultPage,
  Flex,
  LineChart,
  Meter,
  PieChart,
  RadarChart,
  RadialChart,
  SimpleGrid,
  Stack,
  TabNav,
  Table,
  Text,
  ToggleButtonGroup,
} from "@commercetools/nimbus";
import { Download } from "@commercetools/nimbus-icons";
import {
  channelConfig,
  channels,
  conversion,
  conversionConfig,
  forecastConfig,
  orders,
  ordersAndForecast,
  ordersByDay,
  ordersConfig,
  revenueConfig,
  satisfaction,
  satisfactionConfig,
  stock,
  toShape,
  warehouseConfig,
  warehouses,
} from "../chart/chart.playground.data";
import {
  Delta,
  figures,
  Sparkline,
  still,
} from "../chart/chart.playground.parts";

const meta: Meta<typeof DefaultPage.Root> = {
  title: "Playground/Dashboard",
  component: DefaultPage.Root,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof DefaultPage.Root>;

// ============================================================
// FAKE DATA THAT DEPENDS ON THE PERIOD
// ============================================================

type PeriodKey = "7" | "30";

/** The label of a day, counting back from 23 November */
const dayLabel = (index: number, count: number) => {
  const day = 23 - (count - 1 - index);
  return day > 0 ? `${day} Nov` : `${day + 31} Oct`;
};

/** A smooth, repeatable wave, so the fake data never changes between runs */
const wave = (
  index: number,
  base: number,
  amplitude: number,
  drift: number,
  phase: number
) =>
  Math.round(
    (base + amplitude * Math.sin(index / 2.1 + phase) + drift * index) * 10
  ) / 10;

const buildPeriod = (count: number) => {
  const rows = Array.from({ length: count }, (_, index) => ({
    day: dayLabel(index, count),
    online: wave(index, 4.4, 0.7, 0.05, 0),
    shops: wave(index, 1.9, 0.3, 0.015, 1.3),
    orders: wave(index, 360, 50, 3, 0.6),
    conversion: wave(index, 3.9, 0.3, 0.02, 2),
    refunds: wave(index, 3.7, 0.2, -0.01, 4),
  }));
  const revenueShape = toShape(rows.map((row) => row.online + row.shops));
  const ordersShape = toShape(rows.map((row) => row.orders));
  const conversionShape = toShape(rows.map((row) => row.conversion));
  const refundsShape = toShape(rows.map((row) => row.refunds));
  return {
    rows,
    trends: rows.map((row, index) => ({
      day: row.day,
      revenue: revenueShape[index],
      orders: ordersShape[index],
      conversion: conversionShape[index],
      refunds: refundsShape[index],
    })),
  };
};

const periods: Record<
  PeriodKey,
  {
    label: string;
    count: number;
    figures: {
      revenue: [string, string];
      orders: [string, string];
      conversion: [string, string];
      refunds: [string, string];
    };
  }
> = {
  "7": {
    label: "7 days",
    count: 7,
    figures: {
      revenue: ["€184k", "12%"],
      orders: ["2,940", "8%"],
      conversion: ["4.6%", "0.4 pt"],
      refunds: ["3.4%", "0.2 pt"],
    },
  },
  "30": {
    label: "30 days",
    count: 30,
    figures: {
      revenue: ["€742k", "18%"],
      orders: ["11,870", "9%"],
      conversion: ["4.4%", "0.7 pt"],
      refunds: ["3.5%", "0.3 pt"],
    },
  },
};

const attention = [
  {
    id: "delayed",
    palette: "critical",
    tag: "Late",
    title: "2 orders are delayed",
    detail: "The Leipzig warehouse is 12 hours behind.",
    action: "Review",
  },
  {
    id: "stock",
    palette: "warning",
    tag: "Stock",
    title: "14 products are almost sold out",
    detail: "Mostly trail shoes and rain jackets.",
    action: "Restock",
  },
  {
    id: "refunds",
    palette: "info",
    tag: "Refunds",
    title: "3 refunds wait for approval",
    detail: "The oldest request is 2 days old.",
    action: "Approve",
  },
  {
    id: "campaign",
    palette: "positive",
    tag: "Ready",
    title: "The Black Friday campaign is ready",
    detail: "It starts on Friday at 08:00.",
    action: "Open",
  },
] as const;

// ============================================================
// LAYOUT PARTS
// ============================================================

/** One widget on the dashboard: a title, what it shows, and the content */
const Widget = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <Card.Root variant="outlined" bg="bg" height="100%">
    <Card.Header>
      <Stack gap="100">
        <Text as="h2" fontWeight="600">
          {title}
        </Text>
        {description && (
          <Text color="fg.subtle" textStyle="sm">
            {description}
          </Text>
        )}
      </Stack>
    </Card.Header>
    <Card.Body>{children}</Card.Body>
  </Card.Root>
);

/** A number with its change, and a sparkline for the trend */
const Stat = ({
  index,
  label,
  value,
  delta,
  falling,
  children,
}: {
  index: number;
  label: string;
  value: string;
  delta: string;
  falling?: boolean;
  children: ReactNode;
}) => (
  <Stack
    gap="200"
    paddingY="500"
    paddingInlineStart={{
      base: index % 2 ? "500" : "0",
      lg: index ? "500" : "0",
    }}
    paddingInlineEnd="500"
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
        textStyle="2xl"
        fontWeight="600"
        letterSpacing="-0.02em"
        {...figures}
      >
        {value}
      </Text>
      <Delta falling={falling}>{delta}</Delta>
    </Flex>
    {children}
  </Stack>
);

// ============================================================
// THE PAGE
// ============================================================

const StoreDashboard = () => {
  const [period, setPeriod] = useState<PeriodKey>("30");
  const { label, count, figures: stats } = periods[period];
  const { rows, trends } = useMemo(() => buildPeriod(count), [count]);

  return (
    <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
      <DefaultPage.Header>
        <DefaultPage.Title>Dashboard</DefaultPage.Title>
        <DefaultPage.Subtitle>
          Nordlicht Outdoor, updated at 14:20. All figures are made up.
        </DefaultPage.Subtitle>
        <DefaultPage.Actions>
          <ToggleButtonGroup.Root
            aria-label="Period"
            size="md"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[period]}
            onSelectionChange={(keys) => {
              const [key] = [...keys];
              if (key === "7" || key === "30") setPeriod(key);
            }}
          >
            <ToggleButtonGroup.Button id="7">7 days</ToggleButtonGroup.Button>
            <ToggleButtonGroup.Button id="30">30 days</ToggleButtonGroup.Button>
          </ToggleButtonGroup.Root>
          <Button variant="outline">
            <Download />
            Export
          </Button>
        </DefaultPage.Actions>
        <DefaultPage.TabNav>
          <TabNav.Root aria-label="Dashboard sections">
            <TabNav.Item href="#overview" isCurrent>
              Overview
            </TabNav.Item>
            <TabNav.Item href="#orders">Orders</TabNav.Item>
            <TabNav.Item href="#customers">Customers</TabNav.Item>
            <TabNav.Item href="#products">Products</TabNav.Item>
            <TabNav.Item href="#promotions">Promotions</TabNav.Item>
          </TabNav.Root>
        </DefaultPage.TabNav>
      </DefaultPage.Header>

      <DefaultPage.Content bg="neutral.2">
        <Stack gap="600" maxWidth="1440px" marginInline="auto">
          <Card.Root
            variant="outlined"
            bg="bg"
            aria-label={`Key figures, last ${label}`}
          >
            <Card.Body padding="0" paddingInline="500">
              <SimpleGrid columns={{ base: 2, lg: 4 }} gap="0">
                <Stat
                  index={0}
                  label={`Revenue, ${label}`}
                  value={stats.revenue[0]}
                  delta={stats.revenue[1]}
                >
                  <Sparkline
                    label={`Revenue trend over ${label}`}
                    data={trends}
                    dataKey="revenue"
                    seriesLabel="Revenue"
                  />
                </Stat>
                <Stat
                  index={1}
                  label="Orders"
                  value={stats.orders[0]}
                  delta={stats.orders[1]}
                >
                  <Sparkline
                    label={`Orders trend over ${label}`}
                    data={trends}
                    dataKey="orders"
                    seriesLabel="Orders"
                  />
                </Stat>
                <Stat
                  index={2}
                  label="Conversion rate"
                  value={stats.conversion[0]}
                  delta={stats.conversion[1]}
                >
                  <Sparkline
                    label={`Conversion rate trend over ${label}`}
                    data={trends}
                    dataKey="conversion"
                    seriesLabel="Conversion rate"
                  />
                </Stat>
                <Stat
                  index={3}
                  label="Refund rate"
                  value={stats.refunds[0]}
                  delta={stats.refunds[1]}
                  falling
                >
                  <Sparkline
                    label={`Refund rate trend over ${label}`}
                    data={trends}
                    dataKey="refunds"
                    seriesLabel="Refund rate"
                  />
                </Stat>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>

          <Box
            display="grid"
            gridTemplateColumns={{
              base: "minmax(0, 1fr)",
              xl: "minmax(0, 2fr) minmax(0, 1fr)",
            }}
            gap="600"
          >
            <Widget
              title="Revenue"
              description={`Last ${label}, in thousands of euros`}
            >
              <Box
                css={{ "& .nimbus-chart__plot": { aspectRatio: "2.4 / 1" } }}
              >
                <AreaChart
                  key={period}
                  aria-label={`Revenue per day over the last ${label}, online and shops`}
                  data={rows}
                  xAxisKey="day"
                  series={["online", "shops"]}
                  config={revenueConfig}
                  stacked
                  {...still}
                />
              </Box>
            </Widget>
            <Widget
              title="Needs attention"
              description="Things to act on today"
            >
              <Stack gap="0">
                {attention.map((item, index) => (
                  <Flex
                    key={item.id}
                    justify="space-between"
                    align="center"
                    gap="400"
                    paddingY="400"
                    borderTopWidth={index ? "1px" : "0"}
                    borderColor="neutral.6"
                  >
                    <Stack gap="100" minWidth="0">
                      <Flex align="center" gap="200" wrap="wrap">
                        <Badge size="2xs" colorPalette={item.palette}>
                          {item.tag}
                        </Badge>
                        <Text fontWeight="600" textStyle="sm">
                          {item.title}
                        </Text>
                      </Flex>
                      <Text color="fg.subtle" textStyle="sm">
                        {item.detail}
                      </Text>
                    </Stack>
                    <Button
                      size="xs"
                      variant="outline"
                      aria-label={`${item.action}: ${item.title}`}
                    >
                      {item.action}
                    </Button>
                  </Flex>
                ))}
              </Stack>
            </Widget>
          </Box>

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap="600">
            <Widget
              title="Orders by device"
              description="This week, per weekday"
            >
              <BarChart
                aria-label="Orders per weekday by device"
                data={ordersByDay}
                xAxisKey="day"
                series={["desktop", "mobile", "tablet"]}
                config={ordersConfig}
                {...still}
              />
            </Widget>
            <Widget
              title="Conversion by source"
              description="Percent, last eight weeks"
            >
              <LineChart
                aria-label="Conversion rate per week by traffic source"
                data={conversion}
                xAxisKey="week"
                series={["search", "email", "social", "direct"]}
                config={conversionConfig}
                {...still}
              />
            </Widget>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, xl: 3 }} gap="600">
            <Widget title="Sales channels" description="Share of revenue">
              <PieChart
                aria-label="Share of revenue by sales channel in percent"
                data={channels}
                nameKey="channel"
                valueKey="share"
                config={channelConfig}
                {...still}
              />
            </Widget>
            <Widget title="Customer satisfaction" description="Score per topic">
              <RadarChart
                aria-label="Customer satisfaction per topic, Nordlicht and the market"
                data={satisfaction}
                xAxisKey="topic"
                series={["store", "market"]}
                config={satisfactionConfig}
                {...still}
              />
            </Widget>
            <Widget
              title="On-time shipping"
              description="Percent per warehouse"
            >
              <RadialChart
                aria-label="Orders shipped on time per warehouse in percent"
                data={warehouses}
                nameKey="warehouse"
                valueKey="shipped"
                config={warehouseConfig}
                {...still}
              />
            </Widget>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap="600">
            <Widget
              title="Orders against forecast"
              description="Bars and a line in one plot, built from the Chart parts"
            >
              <Box css={{ "& .nimbus-chart__plot": { aspectRatio: "2 / 1" } }}>
                <Chart.Root
                  aria-label="Orders and forecast per month"
                  data={ordersAndForecast}
                  config={forecastConfig}
                  {...still}
                >
                  <Chart.Plot>
                    <Chart.Grid />
                    <Chart.XAxis dataKey="month" />
                    <Chart.Tooltip />
                    <Chart.Bar dataKey="orders" />
                    <Chart.Line dataKey="forecast" />
                  </Chart.Plot>
                </Chart.Root>
              </Box>
            </Widget>
            <Widget title="Stock" description="5,500 of 6,000 units">
              <Stack gap="600">
                <Meter.Root
                  segments={stock}
                  maxValue={6000}
                  size="lg"
                  formatOptions={{ style: "decimal" }}
                >
                  <Meter.Label>Units by category</Meter.Label>
                  <Meter.Value />
                  <Meter.Track />
                  <Meter.Legend />
                </Meter.Root>
                <Stack gap="300">
                  <Meter.Root value={94} colorPalette="warning" layout="inline">
                    <Meter.Label>Leipzig space</Meter.Label>
                    <Meter.Track />
                    <Meter.Value />
                  </Meter.Root>
                  <Meter.Root value={78} layout="inline">
                    <Meter.Label>Hamburg space</Meter.Label>
                    <Meter.Track />
                    <Meter.Value />
                  </Meter.Root>
                  <Meter.Root value={61} layout="inline">
                    <Meter.Label>Berlin space</Meter.Label>
                    <Meter.Track />
                    <Meter.Value />
                  </Meter.Root>
                </Stack>
              </Stack>
            </Widget>
          </SimpleGrid>

          <Widget
            title="Orders to check"
            description="Late, on backorder or in packing"
          >
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
          </Widget>
        </Stack>
      </DefaultPage.Content>

      <DefaultPage.Footer bg="bg">
        <Text color="fg.subtle" textStyle="sm">
          Data refreshes every five minutes.
        </Text>
      </DefaultPage.Footer>
    </DefaultPage.Root>
  );
};

/**
 * A fake e-commerce admin dashboard built on `DefaultPage`: a sticky header
 * that collapses on scroll, with a title, a working period toggle, an export
 * button and tab navigation. The content shows key figures with sparklines
 * (built from the Chart parts), every chart type, Meter, and a table.
 */
export const StoreDashboardPage: Story = {
  render: () => <StoreDashboard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Dashboard"
    );
    await expect(canvas.getByText("€742k")).toBeInTheDocument();

    // The period toggle changes the key figures
    await userEvent.click(canvas.getByRole("radio", { name: "7 days" }));
    await expect(canvas.getByText("€184k")).toBeInTheDocument();
    await expect(canvas.queryByText("€742k")).not.toBeInTheDocument();
  },
};
