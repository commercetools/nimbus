import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Grid, Icon, Button } from "@commercetools/nimbus";
import { CalendarToday } from "@commercetools/nimbus-icons";
import { ChartThemeProvider, ResponsiveContainer, LineChart, BarChart } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { performanceMetrics, promotion } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const dailyOrdersSeries = [
  {
    id: "daily-orders",
    label: "Daily orders",
    data: performanceMetrics.petsmart.dailyOrders.map((d, i) => ({
      x: new Date(2026, 2, 1 + i * 7),
      y: d.orders,
    })),
  },
];

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text textStyle="lg" fontWeight="bold" color="neutral.12">
      {value}
    </Text>
    <Text textStyle="xs" color="neutral.9">
      {label}
    </Text>
  </Box>
);

/** Dashboard-style stat tile: bordered, with the number prominent and the
 * label below. Used for headline metrics in stat grids. */
const StatTile = ({ label, value }: { label: string; value: string }) => (
  <Box bg="neutral.2" borderRadius="200" borderWidth="1px" borderColor="neutral.4" p="300">
    <Text textStyle="xl" fontWeight="bold" color="neutral.12">
      {value}
    </Text>
    <Text textStyle="xs" color="neutral.9" mt="50">
      {label}
    </Text>
  </Box>
);

const DateRangeBar = () => (
  <Flex
    bg="white"
    borderBottomWidth="1px"
    borderColor="neutral.4"
    px={{ base: "300", sm: "500" }}
    py="200"
    alignItems="center"
    gap="200"
    flexWrap="wrap"
    data-tour="date-range-bar"
  >
    <Icon as={CalendarToday} size="2xs" color="neutral.9" />
    <Text textStyle="sm" fontWeight="medium" color="neutral.12">
      {promotion.startDate} &ndash; {promotion.endDate}
    </Text>
    <Text as="span" color="neutral.6" aria-hidden="true">|</Text>
    <Text textStyle="sm" color="neutral.10">
      Promotion: {promotion.name}
    </Text>
  </Flex>
);

// Intentionally no charts on this card: commercetools provides point-in-time
// totals, not time-series trends. That boundary is part of the story.
const CtPerformanceCard = () => (
  <Box data-tour="ct-card">
    <InlineCard title="CT Performance" agentName="Data Agent" agentSource="ct">
      <Grid templateColumns="repeat(2, 1fr)" gap="200">
        <StatTile label="Orders" value={performanceMetrics.ct.orders.toLocaleString()} />
        <StatTile
          label="Revenue"
          value={`$${performanceMetrics.ct.revenue.toLocaleString()}`}
        />
        <StatTile
          label="Avg order value"
          value={`$${performanceMetrics.ct.avgOrderValue.toFixed(2)}`}
        />
        <StatTile label="Code usage" value={performanceMetrics.ct.codeUsageRate} />
      </Grid>
    </InlineCard>
  </Box>
);

const CrossChannelCard = () => (
  <Box data-tour="petsmart-card">
    <InlineCard title="Cross-Channel Impact" agentName="Reporting Agent" agentSource="customer">
      <Stack gap="200">
        <Grid templateColumns="repeat(3, 1fr)" gap="200">
          <StatTile label="In-store pickup uplift" value={performanceMetrics.petsmart.inStorePickupUplift} />
          <StatTile label="Online-to-store" value={performanceMetrics.petsmart.onlineToStoreConversion} />
          <StatTile label="Halo effect" value={performanceMetrics.petsmart.haloEffect} />
        </Grid>
        <Box>
          <Text textStyle="xs" color="neutral.9" mb="50">
            Daily orders over promotion period
          </Text>
          <ChartThemeProvider>
            <ResponsiveContainer height={90}>
              {(w, h) => (
                <LineChart
                  width={w}
                  height={h}
                  series={dailyOrdersSeries}
                  yBaselineFromData
                  ariaLabel="Daily orders over the promotion period"
                />
              )}
            </ResponsiveContainer>
          </ChartThemeProvider>
        </Box>
      </Stack>
    </InlineCard>
  </Box>
);

const BeforeAfter = ({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <Text textStyle="xs" color="neutral.10">
      {label}
    </Text>
    <Flex alignItems="baseline" gap="100">
      <Text textStyle="sm" color="neutral.9" textDecoration="line-through">
        {before}
      </Text>
      <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
        &rarr; {after}
      </Text>
    </Flex>
  </Flex>
);

/** Compact before/after bar chart for a single metric. */
const BeforeAfterBars = ({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) => (
  <Box>
    <Text textStyle="xs" color="neutral.9" mb="50">
      {label}
    </Text>
    <ResponsiveContainer height={80}>
      {(w, h) => (
        <BarChart
          width={w}
          height={h}
          data={[
            { category: "Before", value: before },
            { category: "After", value: after },
          ]}
          ariaLabel={`${label}, before and after the promotion`}
        />
      )}
    </ResponsiveContainer>
  </Box>
);

const InventoryClearanceCard = () => {
  const { slowMoversClearedCount, slowMoversClearedTotal, avgDaysToClearBefore, avgDaysToClearAfter, overstockBefore, overstockAfter } =
    performanceMetrics.petsmart;

  return (
    <Box data-tour="clearance-card">
      <InlineCard title="Inventory Clearance" agentName="Reporting Agent" agentSource="customer">
        <Stack gap="200">
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
            {slowMoversClearedCount} of {slowMoversClearedTotal} slow movers cleared
          </Text>
          <BeforeAfter
            label="Avg days to clear"
            before={String(avgDaysToClearBefore)}
            after={String(avgDaysToClearAfter)}
          />
          <BeforeAfter
            label="Overstock value"
            before={`$${overstockBefore.toLocaleString()}`}
            after={`$${overstockAfter.toLocaleString()}`}
          />
          <ChartThemeProvider>
            <Grid templateColumns="1fr 1fr" gap="200">
              <BeforeAfterBars
                label="Avg days to clear"
                before={avgDaysToClearBefore}
                after={avgDaysToClearAfter}
              />
              <BeforeAfterBars
                label="Overstock value ($)"
                before={overstockBefore}
                after={overstockAfter}
              />
            </Grid>
          </ChartThemeProvider>
        </Stack>
      </InlineCard>
    </Box>
  );
};

export const MeasureStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[{ label: "Analytics" }, { label: "Spring Pet Wellness 2026" }]}
        title="Campaign Performance"
      />

      <DateRangeBar />

      <Box p={{ base: "300", sm: "500" }}>
        {isContextual ? (
          <Stack gap="300">
            <InlineSlot direction="row" gap="300">
              <CtPerformanceCard />
              <CrossChannelCard />
              <InventoryClearanceCard />
            </InlineSlot>
            <Text textStyle="xs" color="neutral.9">
              Platform data (commercetools) reflects current totals. Time-series trends and
              cross-channel attribution come from PetSmart's reporting systems.
            </Text>
          </Stack>
        ) : (
          // Orchestrated mode: no cards. The panel already has the full
          // campaign performance report, so the page stays minimal.
          <Text textStyle="sm" color="neutral.10">
            See the panel for your campaign performance report.
          </Text>
        )}
      </Box>

      <Flex justifyContent="center" py="400">
        <Button variant="ghost" size="2xs" onPress={() => navigate("/")}>
          ← Back to start
        </Button>
      </Flex>
    </Box>
  );
};
