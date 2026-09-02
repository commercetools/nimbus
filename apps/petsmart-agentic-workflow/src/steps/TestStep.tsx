import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Grid, Button } from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { AgentChain } from "../components/AgentChain";
import { ActivationButton } from "../components/ActivationButton";
import { StepNavigation } from "../components/StepNavigation";
import { simulationCarts } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const CartTable = ({ items }: { items: (typeof simulationCarts)[number]["items"] }) => (
  <Grid
    templateColumns="2fr repeat(3, 1fr)"
    gap="100"
    mt="150"
    mb="200"
  >
    <Text textStyle="xs" fontWeight="semibold" color="neutral.9">Item</Text>
    <Text textStyle="xs" fontWeight="semibold" color="neutral.9" textAlign="right">Qty</Text>
    <Text textStyle="xs" fontWeight="semibold" color="neutral.9" textAlign="right">Unit price</Text>
    <Text textStyle="xs" fontWeight="semibold" color="neutral.9" textAlign="right">Total</Text>
    {items.map((item, i) => (
      <Fragment key={item.name + i}>
        <Text textStyle="xs" color="neutral.12">{item.name}</Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">{item.qty}</Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">${item.unitPrice.toFixed(2)}</Text>
        <Text textStyle="xs" color="neutral.11" textAlign="right">${item.total.toFixed(2)}</Text>
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
          <Text textStyle="xs" color="neutral.10">Discount applied</Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">{cart.discountApplied}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">Savings</Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">${cart.savings.toFixed(2)}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">Cart total</Text>
          <Text textStyle="xs" fontWeight="medium" color="neutral.12">${cart.cartTotal.toFixed(2)}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text textStyle="xs" color="neutral.10">Margin</Text>
          <Text textStyle="xs" fontWeight="medium" color={isWarning ? "amber.11" : "neutral.12"}>{cart.margin}</Text>
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

const SimulationResults = () => (
  <Stack gap="200">
    {simulationCarts.map((cart) => (
      <CartCard key={cart.id} cart={cart} />
    ))}
  </Stack>
);

const inventoryContextText =
  "Return policy: if returned in-store, discount still applies to the bundle. In-store pickup: 78% of targeted products are available at local stores.";

export const TestStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[
          { label: "Discounts" },
          { label: "Spring Pet Wellness 2026" },
          { label: "Simulation" },
        ]}
        title="Cart Simulation"
        subtitle="Spring Pet Wellness 2026"
        actions={
          <>
            <ActivationButton label="✦ Simulate" />
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

      <Box p={{ base: "300", sm: "500" }}>
        {isContextual ? (
          <InlineSlot direction="row" gap="300">
            <Box data-tour="simulation-card">
              <InlineCard title="Simulation Results" agentName="Preview Agent" agentSource="ct">
                <SimulationResults />
              </InlineCard>
            </Box>
            <Box data-tour="petsmart-context">
              <InlineCard title="Inventory Context" agentName="Inventory Agent" agentSource="customer">
                <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                  {inventoryContextText}
                </Text>
              </InlineCard>
            </Box>
          </InlineSlot>
        ) : (
          <Box data-tour="orchestrator-card">
            <InlineCard title="Simulation Report" agentName="PetSmart Orchestrator" agentSource="customer">
              <SimulationResults />
              <Text textStyle="xs" color="neutral.11" lineHeight="tall" mt="200">
                {inventoryContextText}
              </Text>
              <Box data-tour="agent-chain">
                <AgentChain
                  contributions={[
                    {
                      agentName: "Preview Agent",
                      source: "ct",
                      contribution: "Simulated 3 carts against the current discount configuration.",
                    },
                    {
                      agentName: "Inventory Agent",
                      source: "customer",
                      contribution: "Added return policy and in-store pickup context for targeted products.",
                    },
                  ]}
                />
              </Box>
            </InlineCard>
          </Box>
        )}
      </Box>

      <StepNavigation currentStep={3} totalSteps={5} mode={mode} />
    </Box>
  );
};
