import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Grid,
  Stack,
  Heading,
  Text,
  useColorMode,
} from "@commercetools/nimbus";
import {
  StatCard,
  LineChart,
  BarChart,
  DonutChart,
  ChartThemeProvider,
  ColorScaleProvider,
  ResponsiveContainer,
  useChartTheme,
  coerceColorMode,
  createFormatters,
  formatInteger,
} from "@commercetools/nimbus-viz";
import type { Series, CategoryDatum } from "@commercetools/nimbus-viz";

/* -------------------------------------------------------------------------- */
/* Sample data — a fictional storefront's last-12-months performance.         */
/* Everything is inline so the demo has no data dependencies.                 */
/* -------------------------------------------------------------------------- */

/** Monthly revenue (USD) for the trailing 12 months, this year vs. last year. */
const MONTHLY_REVENUE = [
  { month: 0, thisYear: 82_000, lastYear: 71_000 },
  { month: 1, thisYear: 88_000, lastYear: 74_000 },
  { month: 2, thisYear: 95_000, lastYear: 80_000 },
  { month: 3, thisYear: 91_000, lastYear: 78_000 },
  { month: 4, thisYear: 104_000, lastYear: 86_000 },
  { month: 5, thisYear: 112_000, lastYear: 92_000 },
  { month: 6, thisYear: 118_000, lastYear: 97_000 },
  { month: 7, thisYear: 109_000, lastYear: 90_000 },
  { month: 8, thisYear: 121_000, lastYear: 99_000 },
  { month: 9, thisYear: 133_000, lastYear: 110_000 },
  { month: 10, thisYear: 158_000, lastYear: 128_000 },
  { month: 11, thisYear: 173_000, lastYear: 141_000 },
];

const REVENUE_SERIES: Series[] = [
  {
    id: "this-year",
    label: "This year",
    data: MONTHLY_REVENUE.map((d) => ({
      x: new Date(2025, d.month, 1),
      y: d.thisYear,
    })),
  },
  {
    id: "last-year",
    label: "Last year",
    data: MONTHLY_REVENUE.map((d) => ({
      x: new Date(2025, d.month, 1),
      y: d.lastYear,
    })),
  },
];

/** Orders placed per product category over the same window. */
const ORDERS_BY_CATEGORY: CategoryDatum[] = [
  { category: "Apparel", value: 6_120 },
  { category: "Footwear", value: 4_980 },
  { category: "Accessories", value: 3_110 },
  { category: "Home", value: 2_540 },
  { category: "Beauty", value: 1_460 },
  { category: "Electronics", value: 1_030 },
];

/** Revenue split across sales channels (sums to the annual revenue total). */
const REVENUE_BY_CHANNEL: CategoryDatum[] = [
  { category: "Online Store", value: 742_000 },
  { category: "Marketplace", value: 358_000 },
  { category: "Retail", value: 214_000 },
  { category: "Wholesale", value: 70_000 },
];

/* -------------------------------------------------------------------------- */
/* Formatters                                                                 */
/* -------------------------------------------------------------------------- */

const fmt = createFormatters({ locale: "en-US", currency: "USD" });
const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const CHART_HEIGHT = 300;

/* -------------------------------------------------------------------------- */
/* Layout helpers — colored from the chart theme so chrome + charts cohere.   */
/* -------------------------------------------------------------------------- */

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const theme = useChartTheme();
  return (
    <Box
      backgroundColor={theme.surface}
      border={`1px solid ${theme.grid}`}
      borderRadius="12px"
      padding="20px"
    >
      <Text fontSize="14px" fontWeight="600" color={theme.ink}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="12px" color={theme.mutedInk} marginTop="2px">
          {subtitle}
        </Text>
      )}
      <Box marginTop="16px">{children}</Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

function Dashboard() {
  const theme = useChartTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Box minHeight="100vh" backgroundColor={theme.surfacePage} padding="32px">
      <Stack direction="column" gap="24px" maxWidth="1200px" marginX="auto">
        {/* Header */}
        <Box>
          <Heading color={theme.ink}>Commerce Overview</Heading>
          <Text color={theme.mutedInk} marginTop="4px">
            Trailing 12 months · demo data · built with
            @commercetools/nimbus-viz
          </Text>
        </Box>

        {/* KPI row */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap="16px"
        >
          <Panel title="Revenue">
            <StatCard
              label="This year"
              value={1_384_000}
              previous={1_146_000}
              format={fmt.currency}
            />
          </Panel>
          <Panel title="Orders">
            <StatCard
              label="This year"
              value={19_240}
              previous={16_980}
              format={formatInteger}
            />
          </Panel>
          <Panel title="Conversion rate">
            <StatCard
              label="Sessions → orders"
              value={0.0327}
              previous={0.0301}
              format={(n) => percent.format(n)}
            />
          </Panel>
          <Panel title="Avg. order value">
            <StatCard
              label="Per order"
              value={71.93}
              previous={67.49}
              format={(n) => usdCents.format(n)}
            />
          </Panel>
        </Grid>

        {/* Live interaction readout */}
        <Text fontSize="14px" color={theme.mutedInk}>
          {selectedCategory
            ? `Selected: ${selectedCategory}`
            : "Click a bar in “Orders by category” to drill in."}
        </Text>

        {/* Chart grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap="16px"
        >
          <Panel
            title="Revenue trend"
            subtitle="Monthly revenue · this year vs. last year"
          >
            <ColorScaleProvider domain={REVENUE_SERIES.map((s) => s.id)}>
              <ResponsiveContainer height={CHART_HEIGHT}>
                {(width, height) => (
                  <LineChart
                    width={width}
                    height={height}
                    series={REVENUE_SERIES}
                    variant="area"
                    valueFormat={fmt.currency}
                    ariaLabel="Monthly revenue, this year versus last year"
                  />
                )}
              </ResponsiveContainer>
            </ColorScaleProvider>
          </Panel>

          <Panel
            title="Orders by category"
            subtitle="Units ordered · click a bar to select"
          >
            <ResponsiveContainer height={CHART_HEIGHT}>
              {(width, height) => (
                <BarChart
                  width={width}
                  height={height}
                  data={ORDERS_BY_CATEGORY}
                  valueFormat={formatInteger}
                  ariaLabel="Orders by product category"
                  onDatumClick={(event) =>
                    setSelectedCategory(event.datum.category)
                  }
                />
              )}
            </ResponsiveContainer>
          </Panel>

          <Panel title="Revenue by channel" subtitle="Share of annual revenue">
            <ColorScaleProvider
              domain={REVENUE_BY_CHANNEL.map((d) => d.category)}
            >
              <ResponsiveContainer height={CHART_HEIGHT}>
                {(width, height) => (
                  <DonutChart
                    width={width}
                    height={height}
                    data={REVENUE_BY_CHANNEL}
                    ariaLabel="Revenue by sales channel"
                  />
                )}
              </ResponsiveContainer>
            </ColorScaleProvider>
          </Panel>
        </Grid>
      </Stack>
    </Box>
  );
}

export const App = () => {
  const { colorMode } = useColorMode();

  return (
    <ChartThemeProvider mode={coerceColorMode(colorMode)}>
      <Dashboard />
    </ChartThemeProvider>
  );
};
