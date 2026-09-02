import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Stack,
  Text,
  DataTable,
  Button,
  Badge,
  TextInput,
  FormField,
  Icon,
  Separator,
} from "@commercetools/nimbus";
import type { DataTableColumnItem, DataTableRowItem } from "@commercetools/nimbus";
import { Search } from "@commercetools/nimbus-icons";
import { ChartThemeProvider, ResponsiveContainer, LineChart } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ActivationButton } from "../components/ActivationButton";
import { AgentChain } from "../components/AgentChain";
import { StepNavigation } from "../components/StepNavigation";
import { slowMovers } from "../data/petsmartProducts";
import type { PetSmartProduct } from "../data/petsmartProducts";

export type FlavorMode = "contextual" | "orchestrated";

const SHELF_DAYS_WARNING_THRESHOLD = 80;

const productRows: DataTableRowItem<PetSmartProduct>[] = slowMovers.map((p) => ({
  ...p,
}));

const productColumns: DataTableColumnItem<PetSmartProduct>[] = [
  {
    id: "name",
    header: "Product name",
    isRowHeader: true,
    accessor: (row) => (
      <Text textStyle="xs" fontWeight="medium" color="neutral.12">
        {row.name}
      </Text>
    ),
  },
  {
    id: "sku",
    header: "SKU",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.11">
        {row.sku}
      </Text>
    ),
  },
  {
    id: "price",
    header: "Price",
    accessor: (row) => (
      <Text textStyle="xs" fontWeight="medium" color="neutral.12">
        {row.price}
      </Text>
    ),
  },
  {
    id: "shelfDays",
    header: "Shelf Days",
    accessor: (row) => {
      const isHigh = row.shelfDays > SHELF_DAYS_WARNING_THRESHOLD;
      return (
        <Flex
          alignItems="center"
          gap="100"
          display="inline-flex"
          px={isHigh ? "150" : "0"}
          py={isHigh ? "50" : "0"}
          borderRadius="100"
          bg={isHigh ? "amber.4" : undefined}
          data-tour={isHigh ? "shelf-days-highlight" : undefined}
        >
          <Text
            textStyle="xs"
            fontWeight={isHigh ? "semibold" : "medium"}
            color={isHigh ? "amber.11" : "neutral.12"}
          >
            {row.shelfDays}
          </Text>
          <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" />
        </Flex>
      );
    },
  },
  {
    id: "velocity",
    header: "Velocity",
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        <Text textStyle="xs" fontWeight="medium" color="neutral.12">
          {row.velocity}
        </Text>
        <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" />
      </Flex>
    ),
  },
  {
    id: "units",
    header: "Units",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.11">
        {row.units}
      </Text>
    ),
  },
];

const inventoryStats = [
  { label: "Slow movers", value: "23" },
  { label: "Shelf value", value: "$47,200" },
  { label: "Avg. days on shelf", value: "79" },
];

// Weekly velocity trend for slow movers - PetSmart warehouse time-series data
// that commercetools platform data doesn't include.
const velocityTrendSeries = [
  {
    id: "velocity",
    label: "Weekly velocity",
    data: [
      { x: new Date("2026-01-06"), y: -8 },
      { x: new Date("2026-01-13"), y: -12 },
      { x: new Date("2026-01-20"), y: -18 },
      { x: new Date("2026-01-27"), y: -22 },
      { x: new Date("2026-02-03"), y: -29 },
      { x: new Date("2026-02-10"), y: -34 },
    ],
  },
];

const agentChainContributions = [
  {
    agentName: "Inventory Agent",
    source: "customer" as const,
    contribution:
      "Identified 23 slow-moving products in Pet Health with $47K in shelf value, based on warehouse velocity and shelf-age tracking.",
  },
  {
    agentName: "Strategy Agent",
    source: "ct" as const,
    contribution:
      "Analyzed current catalog structure and category assignments, then recommended bundling slow movers with high-velocity accessories.",
  },
];

export const DiscoverStep = ({ mode }: { mode: FlavorMode }) => {
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto">
      <PageHeader
        breadcrumbs={[{ label: "Products", href: "#" }, { label: "Pet Health" }]}
        title="Pet Health Products"
        subtitle="23 products below velocity threshold"
        actions={
          <ActivationButton label="Suggest promotion" data-tour="suggest-promotion" />
        }
      />

      <Stack gap="300" p="300">
        {/* Standard MC toolbar: search + filters (pre-existing product list chrome) */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          p="300"
          data-tour="product-toolbar"
        >
          <Stack gap="200">
            <Flex gap="200" alignItems="flex-end" flexWrap="wrap">
              <FormField.Root size="sm" width="280px">
                <FormField.Label>Search</FormField.Label>
                <FormField.Input>
                  <TextInput
                    size="sm"
                    width="100%"
                    placeholder="Search products..."
                    leadingElement={<Icon as={Search} />}
                  />
                </FormField.Input>
              </FormField.Root>

              <Flex gap="150" alignItems="center" flexWrap="wrap">
                <Badge size="sm" colorPalette="neutral">
                  Category: Pet Health
                </Badge>
                <Badge size="sm" colorPalette="neutral">
                  Status: Published
                </Badge>
              </Flex>
            </Flex>

            <Flex alignItems="center" gap="200">
              <Text textStyle="xs" color="neutral.9">
                Showing 6 of 847 products
              </Text>
              <Box flex="1" />
              <Button variant="outline" size="2xs">
                Export
              </Button>
              <Button variant="solid" colorPalette="primary" size="2xs">
                Add product
              </Button>
            </Flex>
          </Stack>
        </Box>

        {/* Product table */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          overflow="hidden"
          data-tour="product-table"
        >
          <DataTable.Root
            columns={productColumns}
            rows={productRows}
            density="condensed"
            allowsPinning={false}
            allowsExpandColumn={false}
          >
            <DataTable.Table>
              <DataTable.Header />
              <DataTable.Body>{(row) => <DataTable.Row row={row} />}</DataTable.Body>
            </DataTable.Table>
          </DataTable.Root>
        </Box>

        {/* Visual separation between standard MC content (above) and agent-augmented content (below) */}
        <Flex alignItems="center" gap="200" pt="100">
          <Separator flex="1" />
          <Text
            textStyle="xs"
            fontWeight="semibold"
            color="indigo.10"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Agent insights
          </Text>
          <Separator flex="1" />
        </Flex>

        {/* Inline agent cards */}
        {mode === "contextual" ? (
          <InlineSlot direction="row" data-tour="inline-slot">
            <Box data-tour="inventory-card">
              <InlineCard
                title="Inventory Overview"
                agentName="Inventory Agent"
                agentSource="customer"
              >
                <Stack gap="200" minWidth="260px">
                  <Flex gap="300">
                    {inventoryStats.map((stat) => (
                      <Box key={stat.label}>
                        <Text textStyle="lg" fontWeight="bold" color="neutral.12">
                          {stat.value}
                        </Text>
                        <Text textStyle="xs" color="neutral.9">
                          {stat.label}
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                  <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                    23 products below velocity threshold in Pet Health. Total
                    shelf value: $47,200. Average days on shelf: 79.
                  </Text>
                  <Box>
                    <Text textStyle="xs" color="neutral.9" mb="50">
                      Weekly velocity trend
                    </Text>
                    <ChartThemeProvider>
                      <ResponsiveContainer height={60}>
                        {(w, h) => (
                          <LineChart
                            width={w}
                            height={h}
                            series={velocityTrendSeries}
                            yBaselineFromData
                            ariaLabel="Weekly velocity trend for slow-moving Pet Health products"
                          />
                        )}
                      </ResponsiveContainer>
                    </ChartThemeProvider>
                  </Box>
                </Stack>
              </InlineCard>
            </Box>

            <Box data-tour="strategy-card">
              <InlineCard
                title="Seasonal Opportunity"
                agentName="Strategy Agent"
                agentSource="ct"
              >
                <Stack gap="150" minWidth="260px">
                  <Flex alignItems="flex-start" gap="100">
                    <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                      Spring Pet Wellness promotions historically lift this
                      category 28% (based on 2024, 2025 data).
                    </Text>
                    <ProvenanceIndicator
                      agentName="Inventory Agent"
                      agentSource="customer"
                      reason="28% lift figure sourced from PetSmart's historical promotion records (2024–2025), not commercetools platform data."
                    />
                  </Flex>
                  <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                    Optimal window: March 1 - April 15. Recommended: bundle slow
                    movers with high-velocity accessories.
                  </Text>
                  <Flex justifyContent="flex-end" pt="100">
                    <Button
                      variant="solid"
                      colorPalette="primary"
                      size="2xs"
                      data-tour="create-promotion"
                      onPress={() => navigate(`/${mode}/step-2`)}
                    >
                      <Flex alignItems="center" gap="100">
                        <Text as="span" fontSize="250" lineHeight="1" color="inherit">
                          ✦
                        </Text>
                        <Text as="span" textStyle="xs" fontWeight="semibold" color="inherit">
                          Create Promotion
                        </Text>
                      </Flex>
                    </Button>
                  </Flex>
                </Stack>
              </InlineCard>
            </Box>
          </InlineSlot>
        ) : (
          <InlineSlot direction="row" data-tour="inline-slot">
            <Box data-tour="orchestrator-card">
              <InlineCard
                title="Promotion Opportunity"
                agentName="PetSmart Orchestrator"
                agentSource="customer"
              >
                <Stack gap="200" minWidth="320px">
                  <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                    23 slow-moving products detected in Pet Health ($47K shelf
                    value). Spring promotions historically lift this category
                    28%. Recommended: Buy 2 Get 1 Free on pet health products,
                    bundled with accessories. Optimal window: March 1 - April
                    15.
                  </Text>
                  <Box data-tour="agent-chain">
                    <AgentChain contributions={agentChainContributions} />
                  </Box>
                </Stack>
              </InlineCard>
            </Box>
          </InlineSlot>
        )}
      </Stack>

      <StepNavigation currentStep={1} totalSteps={5} mode={mode} />
    </Box>
  );
};
