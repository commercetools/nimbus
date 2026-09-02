import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Button,
  Separator,
  TextInput,
  MultilineTextInput,
  NumberInput,
  FormField,
  Icon,
  DataTable,
} from "@commercetools/nimbus";
import type {
  DataTableColumnItem,
  DataTableRowItem,
} from "@commercetools/nimbus";
import { Warning } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { AgentChain } from "../components/AgentChain";
import { StepNavigation } from "../components/StepNavigation";
import { promotion } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const allConditions = [
  { label: "Category = Pet Health", isDefault: true },
  { label: "Inventory > 50 units", isDefault: true },
  { label: "Product predicate: shelf-days > 60", confidence: 82 },
  { label: "Exclude: New Arrivals tag", confidence: 68 },
];

const ConflictWarning = () => (
  <Flex
    gap="200"
    alignItems="flex-start"
    p="200"
    bg="amber.2"
    borderRadius="200"
    borderWidth="1px"
    borderColor="amber.6"
  >
    <Icon as={Warning} size="2xs" color="amber.9" mt="50" flexShrink={0} />
    <Box>
      <Text textStyle="sm" fontWeight="medium" color="neutral.12">
        {promotion.conflictProducts} products overlap with &quot;
        {promotion.conflictDiscount}&quot;
      </Text>
      <Text textStyle="xs" color="neutral.10" mt="50">
        Stacking would push 12 products below 15% margin floor.
      </Text>
      <Flex mt="200">
        <Button variant="outline" size="2xs">
          Add exclusion
        </Button>
      </Flex>
    </Box>
  </Flex>
);

const StockWarning = () => (
  <Flex
    gap="200"
    alignItems="flex-start"
    p="200"
    bg="amber.2"
    borderRadius="200"
    borderWidth="1px"
    borderColor="amber.6"
  >
    <Icon as={Warning} size="2xs" color="amber.9" mt="50" flexShrink={0} />
    <Box>
      <Text textStyle="sm" fontWeight="medium" color="neutral.12">
        Stock check: 312 of {promotion.productsAffected} products have
        sufficient inventory (&gt;50 units)
      </Text>
      <Text textStyle="xs" color="neutral.10" mt="50">
        28 products are low-stock (reorder lead time exceeds promo window).
        Consider exclusion.
      </Text>
    </Box>
  </Flex>
);

export const BuildStep = ({ mode }: { mode: FlavorMode }) => {
  const navigate = useNavigate();
  const [applied, setApplied] = useState<Set<string>>(
    new Set(["Category = Pet Health", "Inventory > 50 units"])
  );

  const appliedList = allConditions.filter((c) => applied.has(c.label));
  const suggestedList = allConditions.filter(
    (c) => !applied.has(c.label) && c.confidence
  );

  const addCondition = (label: string) =>
    setApplied((prev) => new Set([...prev, label]));
  const removeCondition = (label: string) =>
    setApplied((prev) => {
      const next = new Set(prev);
      next.delete(label);
      return next;
    });

  const appliedColumns: DataTableColumnItem[] = [
    {
      id: "condition",
      header: "Condition",
      accessor: (row) => row.label as ReactNode,
    },
    {
      id: "source",
      header: "Source",
      accessor: (row) =>
        (row.isDefault ? "Default" : "Agent suggested") as ReactNode,
    },
    {
      id: "actions",
      header: "",
      align: "end",
      accessor: (row) => (
        <Button
          variant="ghost"
          size="2xs"
          onPress={() => removeCondition(row.label as string)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const appliedRows: DataTableRowItem[] = appliedList.map((c) => ({
    id: c.label,
    label: c.label,
    isDefault: c.isDefault ?? false,
    confidence: c.confidence,
  }));

  return (
    <Box height="100%" overflow="auto">
      <PageHeader
        breadcrumbs={[
          { label: "Discounts", href: "#" },
          { label: promotion.name },
        ]}
        title={promotion.name}
        subtitle="Cart discount · Draft"
        tabs={[
          { label: "General", active: true },
          { label: "Rules" },
          { label: "Schedule" },
        ]}
        actions={
          <>
            <Badge size="2xs" colorPalette="neutral">
              Draft
            </Badge>
            <Button variant="ghost" size="2xs">
              Discard
            </Button>
            <Button variant="solid" colorPalette="primary" size="2xs">
              Save
            </Button>
            {mode === "contextual" && (
              <Button
                variant="solid"
                colorPalette="info"
                size="2xs"
                data-tour="save-simulate"
                onPress={() => navigate(`/${mode}/step-3`)}
              >
                Save &amp; Simulate
              </Button>
            )}
          </>
        }
      />

      <Stack gap="300" p="300">
        {/* Discount form */}
        <Box
          bg="white"
          borderWidth="1px"
          borderColor="neutral.6"
          borderRadius="200"
          p="300"
          data-tour="discount-form"
        >
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color="neutral.12"
            mb="300"
          >
            Discount Configuration
          </Text>

          <Flex gap="300" direction={{ base: "column", md: "row" }}>
            <Stack gap="300" flex="1">
              <FormField.Root size="sm">
                <FormField.Label>Discount name</FormField.Label>
                <FormField.Input>
                  <TextInput
                    size="sm"
                    width="100%"
                    defaultValue={promotion.name}
                  />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root size="sm" data-tour="discount-type">
                <FormField.Label>
                  <Flex alignItems="center" gap="150">
                    <Text>Discount type</Text>
                    <ProvenanceIndicator
                      agentName="Inventory Agent"
                      agentSource="customer"
                      reason="Historically lifts pet health 31% vs flat percentage"
                    />
                  </Flex>
                </FormField.Label>
                <FormField.Input>
                  <TextInput
                    size="sm"
                    width="100%"
                    defaultValue={promotion.type}
                  />
                </FormField.Input>
                <Flex
                  mt="150"
                  gap="200"
                  alignItems="center"
                  px="300"
                  py="200"
                  bg="primary.2"
                  borderRadius="200"
                >
                  <Text textStyle="xs" color="neutral.11">
                    Suggested: &quot;{promotion.type}&quot; — historically lifts
                    pet health 31% vs flat percentage
                  </Text>
                </Flex>
              </FormField.Root>
            </Stack>
            <Stack gap="300" flex="1">
              <FormField.Root size="sm">
                <FormField.Label>Valid from</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" width="100%" defaultValue="2026-03-01" />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root size="sm">
                <FormField.Label>Valid until</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" width="100%" defaultValue="2026-04-15" />
                </FormField.Input>
              </FormField.Root>
            </Stack>
          </Flex>

          <Separator my="300" />

          {/* Additional discount editor fields */}
          <Stack gap="300">
            <FormField.Root size="sm">
              <FormField.Label>Description</FormField.Label>
              <FormField.Input>
                <MultilineTextInput
                  size="sm"
                  width="100%"
                  rows={2}
                  placeholder="Add a description for internal reference (optional)"
                />
              </FormField.Input>
            </FormField.Root>

            <Flex gap="300" direction={{ base: "column", md: "row" }}>
              <FormField.Root size="sm" flex="1">
                <FormField.Label>Sort order</FormField.Label>
                <FormField.Input>
                  <NumberInput
                    size="sm"
                    width="100%"
                    defaultValue={0.5}
                    step={0.1}
                  />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root size="sm" flex="1">
                <FormField.Label>Max applications</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" width="100%" defaultValue="1 per cart" />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root size="sm" flex="1">
                <FormField.Label>
                  <Flex alignItems="center" gap="150">
                    <Text>Stacking mode</Text>
                    <ProvenanceIndicator
                      agentName="Promo Agent"
                      agentSource="ct"
                      reason={`Loyalty Paw Points 10% overlaps ${promotion.conflictProducts} products; non-stackable avoids pushing them below the margin floor`}
                    />
                  </Flex>
                </FormField.Label>
                <FormField.Input>
                  <TextInput
                    size="sm"
                    width="100%"
                    defaultValue="Non-stackable"
                  />
                </FormField.Input>
              </FormField.Root>
            </Flex>
          </Stack>

          <Separator my="300" />

          {/* Conditions section */}
          <FormField.Root size="sm">
            <FormField.Label>
              <Flex alignItems="center" gap="200">
                <Text>Conditions</Text>
                <Box flex="1" />
                <Text textStyle="xs" color="neutral.9">
                  {appliedList.length} applied
                </Text>
              </Flex>
            </FormField.Label>

            {/* Applied conditions, with per-row rationale on expand */}
            <Box mb="300" data-tour="applied-conditions-table">
              {appliedRows.length > 0 ? (
                <DataTable.Root
                  columns={appliedColumns}
                  rows={appliedRows}
                  density="condensed"
                  renderNestedContent={(row) => (
                    <Box px="300" py="200">
                      <Text textStyle="xs" color="neutral.11">
                        {row.isDefault
                          ? "Applied automatically when this discount was created."
                          : `Added from a Promo Agent suggestion (${row.confidence as number}% confidence).`}
                      </Text>
                    </Box>
                  )}
                />
              ) : (
                <Text textStyle="xs" color="neutral.9">
                  No conditions applied yet.
                </Text>
              )}
            </Box>

            {/* AI suggested conditions (click to add) */}
            {suggestedList.length > 0 && (
              <Box data-tour="suggested-conditions">
                <Flex alignItems="center" gap="150" mb="200">
                  <ProvenanceIndicator
                    agentName="Promo Agent"
                    reason="Predicate suggestions based on current discount rules and product catalog"
                  />
                  <Text textStyle="xs" fontWeight="semibold" color="ctteal.11">
                    Suggested conditions
                  </Text>
                </Flex>
                <Flex gap="200" flexWrap="wrap">
                  {suggestedList.map((chip) => (
                    <Badge
                      key={chip.label}
                      size="2xs"
                      colorPalette="info"
                      cursor="pointer"
                      onClick={() => addCondition(chip.label)}
                    >
                      <ProvenanceIndicator
                        agentName="Promo Agent"
                        confidence={chip.confidence}
                        size="8px"
                      />
                      {chip.label} +
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </FormField.Root>
        </Box>

        {/* Agent insights: augmentation, separated from the form above */}
        <Box>
          <Flex alignItems="baseline" gap="200" mb="200">
            <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
              Agent insights
            </Text>
            <Text textStyle="xs" color="neutral.9">
              Automated checks based on the current configuration
            </Text>
          </Flex>

          {mode === "contextual" ? (
            <InlineSlot direction="row" data-tour="inline-slot">
              <Box data-tour="impact-card">
                <InlineCard
                  title="Impact Preview"
                  agentName="Promo Agent"
                  agentSource="ct"
                >
                  <Flex gap="300">
                    <Box>
                      <Text textStyle="xl" fontWeight="bold" color="neutral.12">
                        ~{promotion.productsAffected}
                      </Text>
                      <Text textStyle="xs" color="neutral.9">
                        Products affected
                      </Text>
                    </Box>
                    <Box>
                      <Text textStyle="xl" fontWeight="bold" color="amber.11">
                        {promotion.marginImpact}
                      </Text>
                      <Text textStyle="xs" color="neutral.9">
                        Est. margin impact
                      </Text>
                    </Box>
                    <Box>
                      <Text textStyle="xl" fontWeight="bold" color="green.11">
                        0
                      </Text>
                      <Text textStyle="xs" color="neutral.9">
                        Products below floor
                      </Text>
                    </Box>
                  </Flex>
                </InlineCard>
              </Box>

              <Box data-tour="stock-card">
                <InlineCard
                  title="Stock Validation"
                  agentName="Inventory Agent"
                  agentSource="customer"
                  headerRight={
                    <Badge size="2xs" colorPalette="warning">
                      {promotion.lowStockProducts} low-stock
                    </Badge>
                  }
                >
                  <StockWarning />
                </InlineCard>
              </Box>

              <Box data-tour="conflict-card">
                <InlineCard
                  title="Conflict Detection"
                  agentName="Promo Agent"
                  agentSource="ct"
                  headerRight={
                    <Badge size="2xs" colorPalette="warning">
                      {promotion.conflictProducts} conflicts
                    </Badge>
                  }
                >
                  <ConflictWarning />
                </InlineCard>
              </Box>
            </InlineSlot>
          ) : (
            <InlineSlot direction="row" data-tour="inline-slot">
              <Box data-tour="orchestrator-card">
                <InlineCard
                  title="Promotion Draft"
                  agentName="PetSmart Orchestrator"
                  agentSource="customer"
                >
                  <Stack gap="300" minWidth={{ base: "auto", md: "480px" }}>
                    <Box>
                      <Text
                        textStyle="xs"
                        fontWeight="semibold"
                        color="neutral.11"
                        mb="150"
                      >
                        Impact preview
                      </Text>
                      <Flex gap="300">
                        <Box>
                          <Text
                            textStyle="xl"
                            fontWeight="bold"
                            color="neutral.12"
                          >
                            ~{promotion.productsAffected}
                          </Text>
                          <Text textStyle="xs" color="neutral.9">
                            Products affected
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            textStyle="xl"
                            fontWeight="bold"
                            color="amber.11"
                          >
                            {promotion.marginImpact}
                          </Text>
                          <Text textStyle="xs" color="neutral.9">
                            Est. margin impact
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            textStyle="xl"
                            fontWeight="bold"
                            color="green.11"
                          >
                            0
                          </Text>
                          <Text textStyle="xs" color="neutral.9">
                            Products below floor
                          </Text>
                        </Box>
                      </Flex>
                    </Box>

                    <Separator />

                    <Box>
                      <Text
                        textStyle="xs"
                        fontWeight="semibold"
                        color="neutral.11"
                        mb="150"
                      >
                        Stock validation
                      </Text>
                      <StockWarning />
                    </Box>

                    <Separator />

                    <Box>
                      <Text
                        textStyle="xs"
                        fontWeight="semibold"
                        color="neutral.11"
                        mb="150"
                      >
                        Conflict detection
                      </Text>
                      <ConflictWarning />
                    </Box>

                    <Box data-tour="agent-chain">
                      <AgentChain
                        contributions={[
                          {
                            agentName: "Promo Agent",
                            source: "ct",
                            contribution:
                              "Impact preview and conflict detection against active discounts",
                          },
                          {
                            agentName: "Inventory Agent",
                            source: "customer",
                            contribution:
                              "Stock validation and reorder lead time analysis; discount-type performance history",
                          },
                        ]}
                      />
                    </Box>
                  </Stack>
                </InlineCard>
              </Box>
            </InlineSlot>
          )}
        </Box>
      </Stack>

      <StepNavigation currentStep={2} totalSteps={5} mode={mode} />
    </Box>
  );
};
