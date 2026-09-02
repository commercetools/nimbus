import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Stack,
  Text,
  Grid,
  Button,
  Icon,
} from "@commercetools/nimbus";
import { Warning } from "@commercetools/nimbus-icons";
import {
  ChartThemeProvider,
  ResponsiveContainer,
  BarChart,
  ReferenceLine,
} from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { promotion, simulationCarts } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const dateRange = `${promotion.startDate.replace(", 2026", "")} - ${promotion.endDate.replace(", 2026", "")}`;

const marginChartData = simulationCarts.map((cart) => ({
  category: cart.label.split(":")[0].trim(),
  value: parseInt(cart.margin, 10),
}));

/** Compact read-only summary of the discount under test, echoing the discount detail page. */
const DiscountSummaryBar = () => (
  <Flex
    px={{ base: "300", sm: "500" }}
    py="200"
    bg="neutral.2"
    borderBottomWidth="1px"
    borderColor="neutral.4"
    alignItems="center"
    flexWrap="wrap"
    gap="100"
  >
    <Text textStyle="sm" color="neutral.11">
      {promotion.name} · {promotion.type} · {promotion.productsAffected}{" "}
      products · {dateRange}
    </Text>
  </Flex>
);

/** Small margin-by-cart bar chart, with the 15% margin floor overlaid. */
const MarginComparisonChart = () => (
  <Box>
    <Flex justifyContent="space-between" alignItems="center" mb="100">
      <Text textStyle="xs" fontWeight="semibold" color="neutral.11">
        Margin by cart
      </Text>
      <Text textStyle="xs" color="neutral.9">
        Floor: 15%
      </Text>
    </Flex>
    <ChartThemeProvider>
      <ResponsiveContainer height={120}>
        {(w, h) => (
          <BarChart
            width={w}
            height={h}
            data={marginChartData}
            ariaLabel="Margin percentage by simulated cart"
          >
            <ReferenceLine value={15} variant="negative" label="15% floor" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartThemeProvider>
  </Box>
);

const CartTable = ({
  items,
}: {
  items: (typeof simulationCarts)[number]["items"];
}) => (
  <Grid templateColumns="2fr repeat(3, 1fr)" gap="100" mt="150" mb="200">
    <Text textStyle="xs" fontWeight="semibold" color="neutral.9">
      Item
    </Text>
    <Text
      textStyle="xs"
      fontWeight="semibold"
      color="neutral.9"
      textAlign="right"
    >
      Qty
    </Text>
    <Text
      textStyle="xs"
      fontWeight="semibold"
      color="neutral.9"
      textAlign="right"
    >
      Unit price
    </Text>
    <Text
      textStyle="xs"
      fontWeight="semibold"
      color="neutral.9"
      textAlign="right"
    >
      Total
    </Text>
    {items.map((item, i) => (
      <Fragment key={item.name + i}>
        <Text textStyle="xs" color="neutral.12">
          {item.name}
        </Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">
          {item.qty}
        </Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">
          ${item.unitPrice.toFixed(2)}
        </Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">
          ${item.total.toFixed(2)}
        </Text>
      </Fragment>
    ))}
  </Grid>
);

const CartCard = ({ cart }: { cart: (typeof simulationCarts)[number] }) => {
  const isWarning = cart.status === "warning";
  return (
    <Box
      bg={isWarning ? "amber.2" : "neutral.2"}
      borderWidth="1px"
      borderColor={isWarning ? "amber.7" : "neutral.5"}
      borderRadius="200"
      p="300"
      data-tour={isWarning ? "cart-warning" : undefined}
    >
      <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
        {cart.label}
      </Text>
      <CartTable items={cart.items} />
      <Stack gap="50">
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">
            Discount applied
          </Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">
            {cart.discountApplied}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">
            Savings
          </Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">
            ${cart.savings.toFixed(2)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">
            Cart total
          </Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">
            ${cart.cartTotal.toFixed(2)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">
            Margin
          </Text>
          <Text
            textStyle="xs"
            fontWeight="medium"
            color={isWarning ? "amber.11" : "neutral.12"}
          >
            {cart.margin}
          </Text>
        </Flex>
      </Stack>
      {isWarning && cart.warning && (
        <Text textStyle="xs" color="amber.11" mt="200" fontWeight="medium">
          ⚠ {cart.warning}
        </Text>
      )}
    </Box>
  );
};

/** Prominent alert bar for a cart that trips a stacking/margin violation, shown above the card. */
const CartWarningAlert = ({
  label,
  warning,
}: {
  label: string;
  warning: string;
}) => (
  <Flex
    gap="200"
    alignItems="flex-start"
    p="200"
    bg="amber.3"
    borderRadius="200"
    borderWidth="1px"
    borderColor="amber.7"
  >
    <Icon as={Warning} size="2xs" color="amber.9" mt="50" flexShrink={0} />
    <Box>
      <Text textStyle="sm" fontWeight="semibold" color="amber.12">
        {label} triggers a stacking conflict
      </Text>
      <Text textStyle="xs" color="amber.11" mt="50">
        {warning}
      </Text>
    </Box>
  </Flex>
);

const inventoryContextItems = [
  { label: "Return policy", detail: "If returned in-store, discount still applies to the bundle." },
  { label: "In-store pickup", detail: "78% of targeted products are available at local stores." },
  { label: "Store coverage", detail: "1,247 of 1,380 stores carry at least one promoted SKU." },
  { label: "Reorder buffer", detail: "Lead time for 28 low-stock items exceeds the 45-day promo window." },
];

export const TestStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[
          { label: "Discounts", href: "#" },
          { label: promotion.name },
        ]}
        title={promotion.name}
        subtitle="Cart discount · Draft"
        tabs={[
          { label: "General" },
          { label: "Rules" },
          { label: "Schedule" },
          { label: "Simulation", active: true },
        ]}
        actions={
          <>
            {isContextual && (
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
              >
                <ProvenanceIndicator agentName="Preview Agent" agentSource="ct" reason="Run cart simulation against the current discount configuration" />
                <Text textStyle="xs" fontWeight="medium" color="ctteal.11">Simulate</Text>
              </Flex>
            )}
            {isContextual && (
              <Button
                variant="solid"
                colorPalette="primary"
                size="2xs"
                data-tour="submit-approval"
                onPress={() => navigate(`/${mode}/step-4`)}
              >
                Submit for Approval
              </Button>
            )}
          </>
        }
      />

      <DiscountSummaryBar />

      <Box p={{ base: "300", sm: "500" }}>
        {/* Simulation section: styled as a section of the discount detail page, not a floating card */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          p="300"
        >
          <Flex justifyContent="space-between" alignItems="center" mb="300">
            <Box>
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                Test Scenarios
              </Text>
              <Text textStyle="xs" color="neutral.9">
                {simulationCarts.length} simulated carts
              </Text>
            </Box>
            <Button variant="ghost" size="2xs">
              Run again
            </Button>
          </Flex>

          {/* Insight cards: margin chart + PetSmart context side by side */}
          {isContextual && (
            <InlineSlot direction="row" gap="300" data-tour="inline-slot">
              <Box data-tour="simulation-card" flex="1" display="flex">
                <InlineCard
                  title="Simulation Results"
                  agentName="Preview Agent"
                  agentSource="ct"
                  headerRight={<Text textStyle="xs" color="neutral.9">{simulationCarts.length} carts tested</Text>}
                >
                  <MarginComparisonChart />
                </InlineCard>
              </Box>
              <Box data-tour="petsmart-context" flex="1" display="flex">
                <InlineCard
                  title="Inventory Context"
                  agentName="Inventory Agent"
                  agentSource="customer"
                >
                  <Stack gap="150">
                    {inventoryContextItems.map((item) => (
                      <Box key={item.label}>
                        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">{item.label}</Text>
                        <Text textStyle="xs" color="neutral.11" lineHeight="tall">{item.detail}</Text>
                      </Box>
                    ))}
                  </Stack>
                </InlineCard>
              </Box>
            </InlineSlot>
          )}

          {/* Cart simulation cards: full width, side by side */}
          <Grid templateColumns={{ base: "1fr", md: `repeat(${simulationCarts.length}, 1fr)` }} gap="200">
            {simulationCarts.map((cart) => (
              <Box key={cart.id}>
                {cart.status === "warning" && cart.warning && (
                  <Box mb="150">
                    <CartWarningAlert label={cart.label} warning={cart.warning} />
                  </Box>
                )}
                <CartCard cart={cart} />
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
