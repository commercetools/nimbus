import { Box, Flex, Stack, Text, Grid } from "@commercetools/nimbus";
import { ChartThemeProvider, ResponsiveContainer, LineChart } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { AgentChain } from "../components/AgentChain";
import { StepNavigation } from "../components/StepNavigation";
import { performanceMetrics } from "../data/promotionData";

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

const CtPerformanceCard = () => (
  <Box data-tour="ct-card">
    <InlineCard title="CT Performance" agentName="Data Agent" agentSource="ct">
      <Grid templateColumns="1fr 1fr" gap="300">
        <Stat label="Orders" value={performanceMetrics.ct.orders.toLocaleString()} />
        <Stat
          label="Revenue"
          value={`$${performanceMetrics.ct.revenue.toLocaleString()}`}
        />
        <Stat
          label="Avg order value"
          value={`$${performanceMetrics.ct.avgOrderValue.toFixed(2)}`}
        />
        <Stat label="Code usage" value={performanceMetrics.ct.codeUsageRate} />
      </Grid>
    </InlineCard>
  </Box>
);

const CrossChannelCard = () => (
  <Box data-tour="petsmart-card">
    <InlineCard title="Cross-Channel Impact" agentName="Reporting Agent" agentSource="customer">
      <Stack gap="200">
        <Grid templateColumns="1fr 1fr 1fr" gap="200">
          <Stat label="In-store pickup uplift" value={performanceMetrics.petsmart.inStorePickupUplift} />
          <Stat label="Online-to-store" value={performanceMetrics.petsmart.onlineToStoreConversion} />
          <Stat label="Halo effect" value={performanceMetrics.petsmart.haloEffect} />
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

const InventoryClearanceCard = () => {
  const { slowMoversClearedCount, slowMoversClearedTotal, avgDaysToClearBefore, avgDaysToClearAfter, overstockBefore, overstockAfter } =
    performanceMetrics.petsmart;

  return (
    <Box data-tour="clearance-card">
      <InlineCard title="Inventory Clearance" agentName="Reporting Agent" agentSource="customer">
        <Stack gap="150">
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
        </Stack>
      </InlineCard>
    </Box>
  );
};

export const MeasureStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[{ label: "Analytics" }, { label: "Spring Pet Wellness 2026" }]}
        title="Campaign Performance"
        subtitle="March 1 - April 15, 2026"
      />

      <Box p={{ base: "300", sm: "500" }}>
        {isContextual ? (
          <Stack gap="300">
            <InlineSlot direction="row" gap="300">
              <CtPerformanceCard />
              <CrossChannelCard />
              <InventoryClearanceCard />
            </InlineSlot>
            <Text textStyle="xs" color="neutral.9">
              CT data reflects current platform totals. Time-series trends and cross-channel data
              come from PetSmart's reporting systems.
            </Text>
          </Stack>
        ) : (
          <Box data-tour="orchestrator-card">
            <InlineCard title="Campaign Results" agentName="PetSmart Orchestrator" agentSource="customer">
              <Grid templateColumns="1fr 1fr" gap="300" mb="300">
                <Stat label="Orders" value={performanceMetrics.ct.orders.toLocaleString()} />
                <Stat label="Revenue" value={`$${performanceMetrics.ct.revenue.toLocaleString()}`} />
                <Stat label="In-store pickup uplift" value={performanceMetrics.petsmart.inStorePickupUplift} />
                <Stat label="Halo effect" value={performanceMetrics.petsmart.haloEffect} />
              </Grid>
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="100">
                {performanceMetrics.petsmart.slowMoversClearedCount} of{" "}
                {performanceMetrics.petsmart.slowMoversClearedTotal} slow movers cleared
              </Text>
              <Box mb="200">
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
              <Box data-tour="agent-chain">
                <AgentChain
                  contributions={[
                    {
                      agentName: "Data Agent",
                      source: "ct",
                      contribution: "Provided current order, revenue, and code usage totals from commercetools.",
                    },
                    {
                      agentName: "Reporting Agent",
                      source: "customer",
                      contribution: "Provided daily order trends, cross-channel attribution, and inventory clearance history.",
                    },
                  ]}
                />
              </Box>
            </InlineCard>
          </Box>
        )}
      </Box>

      <StepNavigation currentStep={5} totalSteps={5} mode={mode} />
    </Box>
  );
};
