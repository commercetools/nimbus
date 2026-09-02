import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Button,
  Separator,
  Icon,
  DataTable,
  Grid,
} from "@commercetools/nimbus";
import type { DataTableColumnItem, DataTableRowItem } from "@commercetools/nimbus";
import {
  Warning,
  CheckCircle,
  Error as ErrorIcon,
  LocalShipping,
  Payment,
} from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const AGENT_NAME = "Order Intelligence Agent (proposed)";

const timeline = [
  { date: "Aug 29", event: "Shipping address changed to Hamburg (was Munich)", type: "warning" as const },
  { date: "Aug 31", event: "Order placed with expedited shipping", type: "info" as const },
  { date: "Aug 31", event: "Fraud alert triggered (automated)", type: "error" as const },
  { date: "Sep 1", event: "Assigned to David for investigation", type: "info" as const },
];

interface LineItem {
  name: string;
  qty: number;
  unitPrice: string;
  total: string;
}

const lineItems: DataTableRowItem<LineItem>[] = [
  { id: "li1", name: "Galaxy S25 Ultra (Black, 256GB)", qty: 1, unitPrice: "€399.00", total: "€399.00" },
  { id: "li2", name: "Premium Leather Case", qty: 1, unitPrice: "€32.00", total: "€32.00" },
];

const lineItemColumns: DataTableColumnItem<LineItem>[] = [
  {
    id: "name",
    header: "Item",
    isRowHeader: true,
    accessor: (row) => (
      <Text textStyle="sm" color="neutral.12">
        {row.name}
      </Text>
    ),
  },
  {
    id: "qty",
    header: "Qty",
    align: "end",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.10">
        {row.qty}
      </Text>
    ),
  },
  {
    id: "unitPrice",
    header: "Unit Price",
    align: "end",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.11">
        {row.unitPrice}
      </Text>
    ),
  },
  {
    id: "total",
    header: "Total",
    align: "end",
    accessor: (row) => (
      <Text textStyle="sm" fontWeight="medium" color="neutral.12">
        {row.total}
      </Text>
    ),
  },
];

export const OrderInvestigation = () => (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Orders", href: "#" },
        { label: "#MC-2026-847291" },
      ]}
      title="Order #MC-2026-847291"
      subtitle="€431.00 · Expedited shipping"
      actions={
        <>
          {/* Augmentation: risk indicator chip in the header */}
          <Flex alignItems="center" gap="150" px="200" py="100" borderRadius="200" bg="amber.3" borderWidth="1px" borderColor="amber.6" data-tour="risk-badge">
            <ProvenanceIndicator agentName={AGENT_NAME} size="10px" />
            <Text textStyle="xs" fontWeight="semibold" color="amber.11">High Fraud Risk · 87/100</Text>
          </Flex>
          {/* Augmentation: toolbar action */}
          <Flex
            alignItems="center"
            gap="100"
            px="200"
            py="100"
            borderRadius="200"
            borderWidth="1px"
            borderColor="green.6"
            cursor="pointer"
            _hover={{ bg: "green.3" }}
            transition="background 150ms"
          >
            <Icon as={CheckCircle} size="2xs" color="green.9" />
            <Text textStyle="xs" fontWeight="medium" color="green.11">Release Order</Text>
          </Flex>
          <Button variant="ghost" size="2xs" colorPalette="critical">Cancel Order</Button>
        </>
      }
    />

    <Stack gap="300" p="300">
      {/* Compact state row: order, payment, shipment state badges */}
      <Flex gap="300" alignItems="center" wrap="wrap" data-tour="state-badges">
        <Flex alignItems="center" gap="100">
          <Icon as={CheckCircle} size="2xs" color="neutral.9" />
          <Text textStyle="xs" color="neutral.9">Order state</Text>
          <Badge size="2xs" colorPalette="info">Open</Badge>
        </Flex>
        <Flex alignItems="center" gap="100">
          <Icon as={Payment} size="2xs" color="neutral.9" />
          <Text textStyle="xs" color="neutral.9">Payment state</Text>
          <Badge size="2xs" colorPalette="warning">Pending</Badge>
        </Flex>
        <Flex alignItems="center" gap="100">
          <Icon as={LocalShipping} size="2xs" color="neutral.9" />
          <Text textStyle="xs" color="neutral.9">Shipment state</Text>
          <Badge size="2xs" colorPalette="critical">Backorder</Badge>
        </Flex>
      </Flex>

      {/* Horizontal inline slot: customer profile + timeline */}
      <InlineSlot direction="row" data-tour="inline-slot">
        <InlineCard title="Customer Profile" agentName={AGENT_NAME}>
          <Flex gap="300">
            <Stack gap="100" flex="1">
              <Flex justifyContent="space-between">
                <Text textStyle="xs" color="neutral.9">Account age</Text>
                <Text textStyle="xs" fontWeight="medium" color="neutral.12">2.3 years</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text textStyle="xs" color="neutral.9">Previous orders</Text>
                <Text textStyle="xs" fontWeight="medium" color="neutral.12">14</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text textStyle="xs" color="neutral.9">Avg order value</Text>
                <Text textStyle="xs" fontWeight="medium" color="neutral.12">€127</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text textStyle="xs" color="neutral.9">This order</Text>
                <Text textStyle="xs" fontWeight="bold" color="amber.11">€431 (3.4x avg)</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text textStyle="xs" color="neutral.9">Return rate</Text>
                <Text textStyle="xs" fontWeight="medium" color="green.11">7% (below avg)</Text>
              </Flex>
            </Stack>
          </Flex>
        </InlineCard>

        <InlineCard title="Investigation Timeline" agentName={AGENT_NAME}>
          <Stack gap="200">
            {timeline.map((item, i) => (
              <Flex key={i} gap="200" alignItems="flex-start">
                <Box mt="100">
                  {item.type === "warning" && <Icon as={Warning} size="2xs" color="amber.9" />}
                  {item.type === "error" && <Icon as={ErrorIcon} size="2xs" color="red.9" />}
                  {item.type === "info" && <Icon as={CheckCircle} size="2xs" color="neutral.8" />}
                </Box>
                <Box flex="1">
                  <Flex gap="200" alignItems="baseline">
                    <Text textStyle="xs" fontWeight="medium" color="neutral.9" minWidth="50px">{item.date}</Text>
                    <Text textStyle="xs" color="neutral.12">{item.event}</Text>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Stack>
        </InlineCard>
      </InlineSlot>

      {/* Order details with augmented risk signals */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="300">
          Order Details
        </Text>

        <Box mb="300">
          <Text textStyle="xs" color="neutral.9" mb="50">Customer</Text>
          <Text textStyle="sm" fontWeight="medium" color="neutral.12">Sarah Chen</Text>
          <Text textStyle="xs" color="neutral.10">customer@example.com</Text>
        </Box>

        {/* Billing / shipping addresses side by side */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="300">
          <Box borderWidth="1px" borderColor="neutral.5" borderRadius="200" p="300">
            <Text textStyle="xs" fontWeight="semibold" color="neutral.11" mb="150">Billing address</Text>
            <Text textStyle="xs" color="neutral.12">Marienplatz 8, 80331 Munich, Germany</Text>
            <Badge size="2xs" colorPalette="positive" mt="150">Consistent across 14 orders</Badge>
          </Box>
          <Box borderWidth="1px" borderColor="amber.6" borderRadius="200" p="300" bg="amber.2" data-tour="shipping-flagged">
            <Flex alignItems="center" gap="150" mb="150">
              <Text textStyle="xs" fontWeight="semibold" color="neutral.11">Shipping address</Text>
              <ProvenanceIndicator agentName={AGENT_NAME} size="10px" />
            </Flex>
            <Text textStyle="xs" color="neutral.12">Jungfernstieg 12, 20354 Hamburg, Germany</Text>
            <Badge size="2xs" colorPalette="warning" mt="150">Changed 2 days before order</Badge>
            <Flex alignItems="center" gap="150" mt="200">
              <Text textStyle="xs" color="neutral.9">Shipping method</Text>
              <Text textStyle="xs" color="neutral.12">Express (1-2 days)</Text>
              <ProvenanceIndicator agentName={AGENT_NAME} size="10px" />
            </Flex>
            <Badge size="2xs" colorPalette="warning" mt="150">Unusual for this customer</Badge>
          </Box>
        </Grid>

        <Separator my="300" />

        {/* Line items */}
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="200">Line Items</Text>
        <Box borderWidth="1px" borderColor="neutral.4" borderRadius="200" overflow="hidden" data-tour="line-items">
          <DataTable.Root columns={lineItemColumns} rows={lineItems} density="condensed" allowsPinning={false} allowsExpandColumn={false}>
            <DataTable.Table>
              <DataTable.Header />
              <DataTable.Body />
            </DataTable.Table>
          </DataTable.Root>
        </Box>
      </Box>
    </Stack>
  </Box>
);
