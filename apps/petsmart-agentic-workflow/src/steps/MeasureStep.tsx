import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Grid, Icon, Badge, Button } from "@commercetools/nimbus";
import { CalendarToday, CheckCircle } from "@commercetools/nimbus-icons";
import { ChartThemeProvider, ResponsiveContainer, LineChart } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
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

/** Dashboard stat tile with optional color for the value. */
const StatTile = ({ label, value, color = "neutral.12" }: { label: string; value: string; color?: string }) => (
  <Box bg="neutral.2" borderRadius="200" borderWidth="1px" borderColor="neutral.4" p="200">
    <Text textStyle="lg" fontWeight="bold" color={color}>
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
    <Box flex="1" />
    <Badge size="2xs" colorPalette="positive">Completed</Badge>
  </Flex>
);

// CT provides point-in-time totals only, no charts. That contrast is part of the story.
const CtPerformanceCard = () => (
  <Box data-tour="ct-card" flex="1" display="flex">
    <InlineCard title="Platform Totals" agentName="Data Agent" agentSource="ct"
      headerRight={<Text textStyle="xs" color="neutral.9">Point-in-time</Text>}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap="200">
        <StatTile label="Orders" value={performanceMetrics.ct.orders.toLocaleString()} />
        <StatTile label="Revenue" value={`$${performanceMetrics.ct.revenue.toLocaleString()}`} color="green.11" />
        <StatTile label="Avg order value" value={`$${performanceMetrics.ct.avgOrderValue.toFixed(2)}`} />
        <StatTile label="Code usage rate" value={performanceMetrics.ct.codeUsageRate} />
      </Grid>
    </InlineCard>
  </Box>
);

const CrossChannelCard = () => (
  <Box data-tour="petsmart-card" flex="1" display="flex">
    <InlineCard title="Cross-Channel Impact" agentName="Reporting Agent" agentSource="customer"
      headerRight={<Text textStyle="xs" color="neutral.9">Time-series</Text>}
    >
      <Stack gap="200">
        <Flex gap="300" justifyContent="space-between">
          <Box textAlign="center">
            <Text textStyle="lg" fontWeight="bold" color="green.11">{performanceMetrics.petsmart.inStorePickupUplift}</Text>
            <Text textStyle="xs" color="neutral.9">Pickup uplift</Text>
          </Box>
          <Box textAlign="center">
            <Text textStyle="lg" fontWeight="bold" color="neutral.12">{performanceMetrics.petsmart.onlineToStoreConversion}</Text>
            <Text textStyle="xs" color="neutral.9">Online-to-store</Text>
          </Box>
          <Box textAlign="center">
            <Text textStyle="lg" fontWeight="bold" color="green.11">{performanceMetrics.petsmart.haloEffect}</Text>
            <Text textStyle="xs" color="neutral.9">Halo effect</Text>
          </Box>
        </Flex>
        <Box>
          <Text textStyle="xs" color="neutral.9" mb="50">
            Daily orders over promotion period
          </Text>
          <ChartThemeProvider>
            <ResponsiveContainer height={120}>
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

/** Progress bar for clearance rate */
const ClearanceBar = ({ cleared, total }: { cleared: number; total: number }) => {
  const pct = Math.round((cleared / total) * 100);
  return (
    <Box>
      <Flex justifyContent="space-between" mb="50">
        <Text textStyle="xs" color="neutral.9">Slow movers cleared</Text>
        <Text textStyle="xs" fontWeight="semibold" color="green.11">{cleared}/{total} ({pct}%)</Text>
      </Flex>
      <Box height="200" bg="neutral.4" borderRadius="full" overflow="hidden">
        <Box height="100%" width={`${pct}%`} bg="green.9" borderRadius="full" />
      </Box>
    </Box>
  );
};

const BeforeAfter = ({ label, before, after, improved = true }: { label: string; before: string; after: string; improved?: boolean }) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <Text textStyle="xs" color="neutral.10">{label}</Text>
    <Flex alignItems="baseline" gap="100">
      <Text textStyle="xs" color="neutral.9" textDecoration="line-through">{before}</Text>
      <Text textStyle="xs" fontWeight="semibold" color={improved ? "green.11" : "neutral.12"}>→ {after}</Text>
    </Flex>
  </Flex>
);

const InventoryClearanceCard = () => {
  const ps = performanceMetrics.petsmart;
  return (
    <Box data-tour="clearance-card" flex="1" display="flex">
      <InlineCard title="Inventory Clearance" agentName="Reporting Agent" agentSource="customer">
        <Stack gap="200">
          <ClearanceBar cleared={ps.slowMoversClearedCount} total={ps.slowMoversClearedTotal} />
          <BeforeAfter label="Avg days to clear" before={String(ps.avgDaysToClearBefore)} after={String(ps.avgDaysToClearAfter)} />
          <BeforeAfter label="Overstock value" before={`$${ps.overstockBefore.toLocaleString()}`} after={`$${ps.overstockAfter.toLocaleString()}`} />
        </Stack>
      </InlineCard>
    </Box>
  );
};

/** Closing the loop: connects Step 5 back to Step 1. */
const OutcomeSummary = ({ isContextual }: { isContextual: boolean }) => (
  <Box
    bg="white"
    borderWidth="1px"
    borderColor="neutral.6"
    borderRadius="200"
    p="300"
  >
    <Flex alignItems="center" gap="200" mb="200">
      {isContextual && <ProvenanceIndicator agentName="Strategy Agent" agentSource="ct" reason="Closing-the-loop analysis connecting campaign results to the original discovery." size="10px" />}
      <Icon as={CheckCircle} size="2xs" color="green.9" />
      <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Campaign outcome</Text>
    </Flex>
    <Text textStyle="xs" color="neutral.11" lineHeight="tall">
      The 23 slow-moving pet health products identified in Step 1 have been largely resolved: 18 cleared
      during the promotion window, reducing overstock value from $47,200 to $8,200 and cutting average
      shelf time from 87 days to 34 days. The Buy 2 Get 1 Free promotion drove 4,287 orders totaling
      $312,400 in revenue, with a +12% lift in in-store pickup and a +7% halo effect on adjacent categories.
    </Text>
  </Box>
);

export const MeasureStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[{ label: "Analytics" }, { label: "Spring Pet Wellness 2026" }]}
        title="Campaign Performance"
        actions={
          <Button variant="ghost" size="2xs" onPress={() => navigate("/")}>
            ← Back to start
          </Button>
        }
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

            <OutcomeSummary isContextual={isContextual} />

            <Flex gap="200" alignItems="center" px="200" py="100" bg="neutral.2" borderRadius="200">
              <Text textStyle="xs" color="neutral.9">
                Platform data (commercetools) reflects current totals. Time-series trends and
                cross-channel attribution come from PetSmart's reporting systems.
              </Text>
            </Flex>
          </Stack>
        ) : (
          <Stack gap="300">
            <OutcomeSummary isContextual={false} />
            <Text textStyle="xs" color="neutral.10">
              See the panel for the full campaign performance breakdown.
            </Text>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
