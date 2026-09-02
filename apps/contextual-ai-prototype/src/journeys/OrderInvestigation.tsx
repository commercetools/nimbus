import { Box, Flex, Stack, Text, Badge, Button, Separator, Icon } from "@commercetools/nimbus";
import { AutoAwesome, Warning, CheckCircle, Error as ErrorIcon } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const timeline = [
  { date: "Aug 29", event: "Shipping address changed to Hamburg (was Munich)", type: "warning" as const },
  { date: "Aug 31", event: "Order placed with expedited shipping", type: "info" as const },
  { date: "Aug 31", event: "Fraud alert triggered (automated)", type: "error" as const },
  { date: "Sep 1", event: "Assigned to David for investigation", type: "info" as const },
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
      tabs={[
        { label: "General", active: true },
        { label: "Line Items" },
        { label: "Shipping" },
        { label: "Payment" },
        { label: "Returns" },
      ]}
      actions={
        <>
          {/* Augmentation: risk indicator chip in the header */}
          <Flex alignItems="center" gap="150" px="200" py="100" borderRadius="200" bg="amber.3" borderWidth="1px" borderColor="amber.6">
            <ProvenanceIndicator agentName="Order Intelligence Agent" iconSize="2xs" />
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

    <Stack gap="400" p="500">
      {/* Horizontal inline slot: customer profile + timeline */}
      <InlineSlot direction="row">
        <InlineCard title="Customer Profile" agentName="Order Intelligence Agent">
          <Flex gap="500">
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

        <InlineCard title="Investigation Timeline" agentName="Order Intelligence Agent">
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
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" p="500">
        <Text textStyle="md" fontWeight="semibold" color="neutral.12" mb="400">
          Order Details
        </Text>

        <Flex gap="500">
          <Stack gap="300" flex="1">
            <Box>
              <Text textStyle="xs" color="neutral.9" mb="50">Customer</Text>
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">Sarah Chen</Text>
              <Text textStyle="xs" color="neutral.10">customer@example.com</Text>
            </Box>
            <Box>
              <Text textStyle="xs" color="neutral.9" mb="50">Billing address</Text>
              <Text textStyle="xs" color="neutral.12">Marienplatz 8, 80331 Munich, Germany</Text>
              <Badge size="xs" colorPalette="positive" mt="100">Consistent across 14 orders</Badge>
            </Box>
          </Stack>
          <Stack gap="300" flex="1">
            <Box>
              <Text textStyle="xs" color="neutral.9" mb="50">Shipping address</Text>
              <Flex alignItems="center" gap="150">
                <Text textStyle="xs" color="neutral.12">Jungfernstieg 12, 20354 Hamburg, Germany</Text>
                <ProvenanceIndicator agentName="Order Intelligence Agent" iconSize="2xs" />
              </Flex>
              <Badge size="xs" colorPalette="warning" mt="100">Changed 2 days before order</Badge>
            </Box>
            <Box>
              <Text textStyle="xs" color="neutral.9" mb="50">Shipping method</Text>
              <Flex alignItems="center" gap="150">
                <Text textStyle="xs" color="neutral.12">Express (1-2 days)</Text>
                <ProvenanceIndicator agentName="Order Intelligence Agent" iconSize="2xs" />
              </Flex>
              <Badge size="xs" colorPalette="warning" mt="100">Unusual for this customer</Badge>
            </Box>
          </Stack>
        </Flex>

        <Separator my="400" />

        {/* Line items */}
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="200">Line Items</Text>
        <Stack gap="0" borderWidth="1px" borderColor="neutral.4" borderRadius="200" overflow="hidden">
          {[
            { name: "Galaxy S25 Ultra (Black, 256GB)", qty: 1, price: "€399.00" },
            { name: "Premium Leather Case", qty: 1, price: "€32.00" },
          ].map((item, i) => (
            <Flex key={i} px="300" py="200" alignItems="center" borderBottomWidth={i < 1 ? "1px" : "0"} borderColor="neutral.4">
              <Text textStyle="sm" color="neutral.12" flex="1">{item.name}</Text>
              <Text textStyle="xs" color="neutral.9" width="40px" textAlign="center">×{item.qty}</Text>
              <Text textStyle="sm" fontWeight="medium" color="neutral.12" width="80px" textAlign="right">{item.price}</Text>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Stack>
  </Box>
);
