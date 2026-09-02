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
} from "@commercetools/nimbus";
import type { DataTableColumnItem, DataTableRowItem } from "@commercetools/nimbus";
import { Search } from "@commercetools/nimbus-icons";
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
  { label: "Slow movers", value: "23", color: "amber.11" },
  { label: "Shelf value", value: "$47,200", color: "red.11" },
  { label: "Avg. days on shelf", value: "79", color: "amber.11" },
] as const;


export const DiscoverStep = ({ mode }: { mode: FlavorMode }) => {
  const navigate = useNavigate();
  const productColumns = getProductColumns(mode);

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
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
                borderColor="ctteal.10"
                cursor="pointer"
                _hover={{ bg: "ctteal.3" }}
                transition="background 150ms"
                data-tour="suggest-promotion"
              >
                <ProvenanceIndicator agentName="Strategy Agent" agentSource="ct" reason="Suggest a promotion for slow-moving products in this category" />
                <Text textStyle="xs" fontWeight="medium" color="ctteal.11">Suggest promotion</Text>
              </Flex>
            )}
          </>
        }
      />

      <Stack gap="300" p="300">
        {/* Agent insight cards: above the table, compact. Contextual mode only. */}
        {mode === "contextual" && (
          <InlineSlot direction="row" data-tour="inline-slot">
            <Box data-tour="inventory-card" flex="1" display="flex">
              <InlineCard
                title="Inventory Overview"
                agentName="Inventory Agent"
                agentSource="customer"
              >
                <Flex gap="300" alignItems="center">
                  {inventoryStats.map((stat) => (
                    <Box key={stat.label} textAlign="center">
                      <Text textStyle="sm" fontWeight="bold" color={stat.color}>{stat.value}</Text>
                      <Text textStyle="xs" color="neutral.9">{stat.label}</Text>
                    </Box>
                  ))}
                  {/* Threshold bar: 79 avg days vs 60 day target */}
                  <Box flex="1" minWidth="100px">
                    <Text textStyle="xs" color="neutral.9" mb="50">Avg shelf age vs 60-day target</Text>
                    <Box height="200" bg="neutral.4" borderRadius="full" position="relative" overflow="hidden">
                      <Box
                        height="100%"
                        width={`${Math.min((79 / 100) * 100, 100)}%`}
                        bg="amber.9"
                        borderRadius="full"
                      />
                      <Box
                        position="absolute"
                        top="0"
                        bottom="0"
                        left="60%"
                        width="2px"
                        bg="neutral.12"
                      />
                    </Box>
                    <Flex justifyContent="space-between" mt="50">
                      <Text textStyle="xs" color="amber.11" fontWeight="semibold">79 days</Text>
                      <Text textStyle="xs" color="neutral.9">target: 60</Text>
                    </Flex>
                  </Box>
                </Flex>
              </InlineCard>
            </Box>

            <Box data-tour="strategy-card" flex="1" display="flex">
              <InlineCard
                title="Seasonal Opportunity"
                agentName="Strategy Agent"
                agentSource="ct"
              >
                <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                  Spring promotions lift this category 28%.
                  Window: March 1 through April 15. Bundle slow movers with accessories.
                </Text>
                <Box pt="100">
                  <Button
                    variant="outline"
                    size="2xs"
                    data-tour="create-promotion"
                    onPress={() => navigate(`/${mode}/step-2`)}
                  >
                    ✦ Create Promotion
                  </Button>
                </Box>
              </InlineCard>
            </Box>
          </InlineSlot>
        )}

        {/* Integrated search + filters + table */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          overflow="hidden"
        >
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
      </Stack>
    </Box>
  );
};
