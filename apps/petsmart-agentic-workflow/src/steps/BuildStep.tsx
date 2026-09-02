import { useState } from "react";
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
  ComboBox,
  DateRangePickerField,
} from "@commercetools/nimbus";
import type { DateRangePickerProps } from "@commercetools/nimbus";
import { Warning } from "@commercetools/nimbus-icons";
import { CalendarDate } from "@internationalized/date";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
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
                data-tour="save-simulate"
                onClick={() => navigate(`/${mode}/step-3`)}
              >
                <ProvenanceIndicator agentName="Preview Agent" agentSource="ct" reason="Simulate this discount against real cart scenarios before launching" />
                <Text textStyle="xs" fontWeight="medium" color="ctteal.11">Save &amp; Simulate</Text>
              </Flex>
            )}
          </>
        }
      />

      <Stack gap="300" p="300">
        {/* Impact preview + stock validation + conflict detection: contextual
            mode only, surfaced above the form so Maya sees the impact as she
            configures. In orchestrated mode, this context lives in the chat
            panel instead. */}
        {mode === "contextual" && (
          <>
          <InlineSlot direction="row" data-tour="inline-slot">
            <Box data-tour="impact-card" flex="1" display="flex">
              <InlineCard
                title="Impact Preview"
                agentName="Promo Agent"
                agentSource="ct"
                headerRight={
                  <Text textStyle="xs" color="neutral.9">
                    Updates as you configure
                  </Text>
                }
              >
                <Flex gap="300" justifyContent="space-between">
                  <Box textAlign="center">
                    <Text textStyle="xl" fontWeight="bold" color="neutral.12">
                      ~{promotion.productsAffected}
                    </Text>
                    <Text textStyle="xs" color="neutral.9">
                      Products affected
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text textStyle="xl" fontWeight="bold" color="amber.11">
                      {promotion.marginImpact}
                    </Text>
                    <Text textStyle="xs" color="neutral.9">
                      Est. margin impact
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text textStyle="xl" fontWeight="bold" color="green.11">
                      0
                    </Text>
                    <Text textStyle="xs" color="neutral.9">
                      Products below floor
                    </Text>
                  </Box>
                </Flex>
                {/* Margin gauge: how close to the 15% floor */}
                <Box mt="200">
                  <Flex justifyContent="space-between" mb="50">
                    <Text textStyle="xs" color="neutral.9">Avg margin after discount</Text>
                    <Text textStyle="xs" fontWeight="semibold" color="green.11">15.9%</Text>
                  </Flex>
                  <Box height="200" bg="neutral.4" borderRadius="full" position="relative" overflow="hidden">
                    <Box
                      height="100%"
                      width="53%"
                      bg="green.9"
                      borderRadius="full"
                    />
                    <Box
                      position="absolute"
                      top="0"
                      bottom="0"
                      left="50%"
                      width="2px"
                      bg="neutral.12"
                    />
                  </Box>
                  <Flex justifyContent="space-between" mt="50">
                    <Text textStyle="xs" color="neutral.9">0%</Text>
                    <Text textStyle="xs" color="neutral.9">floor: 15%</Text>
                    <Text textStyle="xs" color="neutral.9">30%</Text>
                  </Flex>
                </Box>
              </InlineCard>
            </Box>

            <Box data-tour="stock-card" flex="1" display="flex">
              <InlineCard
                title="Stock Validation"
                agentName="Inventory Agent"
                agentSource="customer"
                headerRight={
                  <Badge size="2xs" colorPalette="warning">
                    {promotion.lowStockProducts} low stock
                  </Badge>
                }
              >
                <StockWarning />
              </InlineCard>
            </Box>

            <Box data-tour="conflict-card" flex="1" display="flex">
              <InlineCard
                title="Conflict Detection"
                agentName="Promo Agent"
                agentSource="ct"
                headerRight={
                  <Badge size="2xs" colorPalette="warning">
                    1 conflict
                  </Badge>
                }
              >
                <ConflictWarning />
              </InlineCard>
            </Box>
          </InlineSlot>

          {/* Full-width suggestions row */}
          <Flex gap="200" flexWrap="wrap">
            <Flex alignItems="center" gap="100" px="200" py="50" bg="ctteal.2" borderRadius="200" borderWidth="1px" borderColor="ctteal.6" cursor="pointer" _hover={{ bg: "ctteal.3" }} transition="background 150ms">
              <ProvenanceIndicator agentName="Inventory Agent" agentSource="ct" reason="Spring 2025 ran Buy 1 Get 1 on pet health and lifted orders 22% over 6 weeks." size="8px" />
              <Text textStyle="xs" color="ctteal.11">
                Comparable: <Text as="span" fontWeight="bold">Spring 2025</Text> lifted orders <Text as="span" fontWeight="bold">22%</Text> over 6 weeks
              </Text>
              <Flex as="span" alignItems="center" gap="50" px="150" py="50" borderRadius="200" borderWidth="1px" borderColor="ctteal.9" ml="50" flexShrink={0}>
                <Text textStyle="xs" fontWeight="semibold" color="ctteal.11">Use template</Text>
              </Flex>
            </Flex>
            <Flex alignItems="center" gap="100" px="200" py="50" bg="primary.2" borderRadius="200" borderWidth="1px" borderColor="primary.6" cursor="pointer" _hover={{ bg: "primary.3" }} transition="background 150ms">
              <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" reason="28 products have reorder lead times exceeding the promotion window." size="8px" />
              <Text textStyle="xs" color="primary.11">Exclude 28 low-stock products</Text>
            </Flex>
            <Flex alignItems="center" gap="100" px="200" py="50" bg="ctteal.2" borderRadius="200" borderWidth="1px" borderColor="ctteal.6" cursor="pointer" _hover={{ bg: "ctteal.3" }} transition="background 150ms">
              <ProvenanceIndicator agentName="Promo Agent" agentSource="ct" reason="Loyalty Paw Points 10% overlaps 67 products. Non-stackable prevents margin floor violations." size="8px" />
              <Text textStyle="xs" color="ctteal.11">Set non-stackable</Text>
            </Flex>
          </Flex>
          </>
        )}

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

          <Stack gap="300">
            {/* Row 1: Discount name (full width) */}
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

            {/* Row 2: Discount type + Promotion period */}
            <Flex gap="300" direction={{ base: "column", md: "row" }}>
              <Box flex="1">
                <FormField.Root size="sm" data-tour="discount-type">
                  <FormField.Label>
                    <Flex alignItems="center" gap="150">
                      {mode === "contextual" && (
                        <ProvenanceIndicator
                          agentName="Inventory Agent"
                          agentSource="ct"
                          reason="Buy 2 Get 1 Free historically lifts pet health 31% vs flat percentage"
                        />
                      )}
                      <Text>Discount type</Text>
                    </Flex>
                  </FormField.Label>
                  <FormField.Input>
                    <ComboBox.Root
                      size="sm"
                      width="100%"
                      selectedKeys={["buy-2-get-1"]}
                      selectionMode="single"
                      aria-label="Discount type"
                    >
                      <ComboBox.Trigger />
                      <ComboBox.Popover>
                        <ComboBox.ListBox>
                          <ComboBox.Option id="buy-2-get-1" textValue="Buy 2 Get 1 Free">
                            <Flex alignItems="center" gap="100">
                              {mode === "contextual" && <ProvenanceIndicator agentName="Inventory Agent" agentSource="customer" size="8px" />}
                              Buy 2 Get 1 Free
                            </Flex>
                          </ComboBox.Option>
                          <ComboBox.Option id="percentage" textValue="Percentage (20%)">Percentage (20%)</ComboBox.Option>
                          <ComboBox.Option id="fixed" textValue="Fixed amount ($10 off)">Fixed amount ($10 off)</ComboBox.Option>
                          <ComboBox.Option id="tiered" textValue="Tiered (15%/20%/25%)">Tiered (15%/20%/25%)</ComboBox.Option>
                        </ComboBox.ListBox>
                      </ComboBox.Popover>
                    </ComboBox.Root>
                  </FormField.Input>
                  {mode === "contextual" && (
                    <Flex
                      mt="100"
                      gap="150"
                      alignItems="center"
                      px="200"
                      py="100"
                      bg="ctteal.2"
                      borderRadius="200"
                      borderWidth="1px"
                      borderColor="ctteal.6"
                      cursor="pointer"
                      _hover={{ bg: "ctteal.3" }}
                      transition="background 150ms"
                      width="fit-content"
                    >
                      <ProvenanceIndicator
                        agentName="Inventory Agent"
                        agentSource="ct"
                        reason="Buy 2 Get 1 Free outperforms flat percentage discounts by 31% in the pet health category, based on PetSmart's 2024-2025 promotion data."
                        size="10px"
                      />
                      <Text textStyle="xs" color="ctteal.11">
                        Suggested: lifts pet health 31% vs flat percentage
                      </Text>
                    </Flex>
                  )}
                </FormField.Root>
              </Box>
              <Box flex="1">
                <DateRangePickerField
                  label="Promotion period"
                  size="sm"
                  defaultValue={{ start: new CalendarDate(2026, 3, 1), end: new CalendarDate(2026, 4, 15) } as DateRangePickerProps["value"]}
                />
              </Box>
            </Flex>

            {/* Row 3: Description */}
            <FormField.Root size="sm">
              <FormField.Label>Description</FormField.Label>
              <FormField.Input>
                <MultilineTextInput
                  size="sm"
                  width="100%"
                  rows={1}
                  autoGrow
                  placeholder="Add a description for internal reference (optional)"
                />
              </FormField.Input>
            </FormField.Root>

            {/* Row 4: Sort order + Stacking mode + Max applications (side by side) */}
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
                <FormField.Label>
                  <Flex alignItems="center" gap="150">
                    {mode === "contextual" && (
                      <ProvenanceIndicator
                        agentName="Promo Agent"
                        agentSource="ct"
                        reason={`Loyalty Paw Points 10% overlaps ${promotion.conflictProducts} products; non-stackable avoids pushing them below the margin floor`}
                      />
                    )}
                    <Text>Stacking mode</Text>
                  </Flex>
                </FormField.Label>
                <FormField.Input>
                  <ComboBox.Root
                    size="sm"
                    width="100%"
                    selectedKeys={["non-stackable"]}
                    selectionMode="single"
                    aria-label="Stacking mode"
                  >
                    <ComboBox.Trigger />
                    <ComboBox.Popover>
                      <ComboBox.ListBox>
                        <ComboBox.Option id="non-stackable" textValue="Non-stackable">Non-stackable</ComboBox.Option>
                        <ComboBox.Option id="stackable" textValue="Stackable">Stackable</ComboBox.Option>
                        <ComboBox.Option id="stop-after" textValue="Stop after this discount">Stop after this discount</ComboBox.Option>
                      </ComboBox.ListBox>
                    </ComboBox.Popover>
                  </ComboBox.Root>
                </FormField.Input>
              </FormField.Root>
              <FormField.Root size="sm" flex="1">
                <FormField.Label>Max applications</FormField.Label>
                <FormField.Input>
                  <ComboBox.Root
                    size="sm"
                    width="100%"
                    selectedKeys={["1-per-cart"]}
                    selectionMode="single"
                    aria-label="Max applications"
                  >
                    <ComboBox.Trigger />
                    <ComboBox.Popover>
                      <ComboBox.ListBox>
                        <ComboBox.Option id="1-per-cart" textValue="1 per cart">1 per cart</ComboBox.Option>
                        <ComboBox.Option id="3-per-cart" textValue="3 per cart">3 per cart</ComboBox.Option>
                        <ComboBox.Option id="unlimited" textValue="Unlimited">Unlimited</ComboBox.Option>
                      </ComboBox.ListBox>
                    </ComboBox.Popover>
                  </ComboBox.Root>
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

            {/* Applied conditions (click ✕ to remove) */}
            <Flex gap="200" flexWrap="wrap" mb="300">
              {appliedList.map((c) => (
                <Badge
                  key={c.label}
                  size="2xs"
                  colorPalette="neutral"
                  cursor="pointer"
                  onClick={() => removeCondition(c.label)}
                >
                  {c.label} ✕
                </Badge>
              ))}
            </Flex>

            {/* AI suggested conditions (click to add): contextual mode only.
                In orchestrated mode, these suggestions surface through the
                chat panel instead of an in-form control. */}
            {mode === "contextual" && suggestedList.length > 0 && (
              <Box data-tour="suggested-conditions">
                <Flex alignItems="center" gap="150" mb="200">
                  <ProvenanceIndicator
                    agentName="Promo Agent"
                    agentSource="ct"
                    reason="Predicate suggestions based on current discount rules and product catalog"
                  />
                  <Text textStyle="xs" fontWeight="medium" color="neutral.12">
                    Suggested conditions
                  </Text>
                </Flex>
                <Flex gap="200" flexWrap="wrap">
                  {suggestedList.map((chip) => (
                    <Flex
                      key={chip.label}
                      alignItems="center"
                      gap="100"
                      px="200"
                      py="50"
                      bg="ctteal.2"
                      borderRadius="200"
                      borderWidth="1px"
                      borderColor="ctteal.6"
                      cursor="pointer"
                      _hover={{ bg: "ctteal.3" }}
                      transition="background 150ms"
                      onClick={() => addCondition(chip.label)}
                    >
                      <ProvenanceIndicator
                        agentName="Promo Agent"
                        agentSource="ct"
                        confidence={chip.confidence}
                        size="8px"
                      />
                      <Text textStyle="xs" color="ctteal.11">{chip.label}</Text>
                      <Text textStyle="xs" color="ctteal.9">+</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            )}
          </FormField.Root>
        </Box>
      </Stack>
    </Box>
  );
};
