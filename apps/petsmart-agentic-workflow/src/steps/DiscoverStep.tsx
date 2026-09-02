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
import { slowMovers } from "../data/petsmartProducts";
import type { PetSmartProduct } from "../data/petsmartProducts";

export type FlavorMode = "contextual" | "orchestrated";

const SHELF_DAYS_WARNING_THRESHOLD = 80;

const productRows: DataTableRowItem<PetSmartProduct>[] = slowMovers.map((p) => ({
  ...p,
}));

const getProductColumns = (
  mode: FlavorMode
): DataTableColumnItem<PetSmartProduct>[] => [
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
          {mode === "contextual" && (
            <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" />
          )}
          <Text
            textStyle="xs"
            fontWeight={isHigh ? "semibold" : "medium"}
            color={isHigh ? "amber.11" : "neutral.12"}
          >
            {row.shelfDays}
          </Text>
        </Flex>
      );
    },
  },
  {
    id: "velocity",
    header: "Velocity",
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        {mode === "contextual" && (
          <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" />
        )}
        <Text textStyle="xs" fontWeight="medium" color="neutral.12">
          {row.velocity}
        </Text>
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

export const DiscoverStep = ({ mode }: { mode: FlavorMode }) => {
  const navigate = useNavigate();
  const productColumns = getProductColumns(mode);

  return (
    <Box height="100%" overflow="auto">
      <PageHeader
        breadcrumbs={[{ label: "Products", href: "#" }, { label: "Pet Health" }]}
        title="Pet Health Products"
        subtitle="847 products"
        actions={
          <>
            <Button variant="ghost" size="2xs">Unpublish</Button>
            <Button variant="solid" colorPalette="primary" size="2xs">Add product</Button>
            {mode === "contextual" && (
              <Flex
                alignItems="center"
                gap="100"
                px="200"
                py="100"
                borderRadius="200"
                borderWidth="1px"
                borderColor="primary.6"
                cursor="pointer"
                _hover={{ bg: "primary.3" }}
                transition="background 150ms"
                data-tour="suggest-promotion"
              >
                <ProvenanceIndicator agentName="Strategy Agent" agentSource="ct" reason="Suggest a promotion for slow-moving products in this category" />
                <Text textStyle="xs" fontWeight="medium" color="primary.11">Suggest promotion</Text>
              </Flex>
            )}
          </>
        }
      />

      <Stack gap="300" p="300">
        {/* Integrated search + filters + table */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          overflow="hidden"
        >
          {/* Toolbar */}
          <Flex
            px="300"
            py="200"
            gap="200"
            alignItems="center"
            borderBottomWidth="1px"
            borderColor="neutral.4"
            flexWrap="wrap"
            data-tour="product-toolbar"
          >
            <FormField.Root size="sm" width="240px">
              <FormField.Input>
                <TextInput
                  size="sm"
                  width="100%"
                  placeholder="Search products..."
                  leadingElement={<Icon as={Search} size="2xs" />}
                />
              </FormField.Input>
            </FormField.Root>
            <Badge size="2xs" colorPalette="neutral">Category: Pet Health</Badge>
            <Badge size="2xs" colorPalette="positive">Published</Badge>
            <Badge size="2xs" colorPalette="warning">6 slow movers</Badge>
            <Box flex="1" />
            <Text textStyle="xs" color="neutral.9">Showing 6 of 847</Text>
          </Flex>

          {/* Product table */}
          <Box data-tour="product-table">
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
        </Box>

        {/* Inline agent cards: contextual mode only. In orchestrated mode, the
            panel already has this context, so the page stays a normal MC page. */}
        {mode === "contextual" && (
          <>
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
          </>
        )}
      </Stack>
    </Box>
  );
};
