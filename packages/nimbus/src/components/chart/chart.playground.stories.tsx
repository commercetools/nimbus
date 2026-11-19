import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  AreaChart,
  BarChart,
  Badge,
  Box,
  Chart,
  Flex,
  Heading,
  LineChart,
  Meter,
  PieChart,
  RadarChart,
  RadialChart,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@commercetools/nimbus";
import {
  channelConfig,
  channels,
  conversion,
  conversionConfig,
  forecastConfig,
  monthly,
  orders,
  ordersAndForecast,
  ordersByDay,
  ordersConfig,
  revenue,
  revenueConfig,
  satisfaction,
  satisfactionConfig,
  stock,
  warehouseConfig,
  warehouses,
} from "./chart.playground.data";
import { Delta, figures, Sparkline, still } from "./chart.playground.parts";

const meta: Meta = {
  title: "Playground/Charts/Report",
};

export default meta;

type Story = StoryObj;

// ============================================================
// LAYOUT PARTS
// ============================================================

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
export const Report: Story = {
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
                  data={monthly}
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
                  data={monthly}
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
                  data={monthly}
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
                  data={monthly}
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
