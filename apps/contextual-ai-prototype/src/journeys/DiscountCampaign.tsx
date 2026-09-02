import { useState } from "react";
import { Box, Flex, Stack, Text, Badge, Button, Separator, TextInput, FormField, Icon } from "@commercetools/nimbus";
import { Warning } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";

import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const allConditions = [
  { label: "Category = Summer Collection", isDefault: true },
  { label: "Inventory > 50 units", isDefault: true },
  { label: "Product age > 90 days", confidence: 76 },
  { label: "Exclude: New Arrivals tag", confidence: 71 },
];

export const DiscountCampaign = () => {
  const [applied, setApplied] = useState<Set<string>>(new Set(["Category = Summer Collection", "Inventory > 50 units"]));

  const appliedList = allConditions.filter(c => applied.has(c.label));
  const suggestedList = allConditions.filter(c => !applied.has(c.label) && c.confidence);

  const addCondition = (label: string) => setApplied(prev => new Set([...prev, label]));
  const removeCondition = (label: string) => setApplied(prev => { const next = new Set(prev); next.delete(label); return next; });

  return (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Discounts", href: "#" },
        { label: "Summer Clearance 2026" },
      ]}
      title="Summer Clearance 2026"
      subtitle="Cart discount · Draft"
      tabs={[
        { label: "General", active: true },
        { label: "Rules" },
        { label: "Schedule" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="2xs">Discard</Button>
          <Button variant="solid" colorPalette="primary" size="2xs">Save</Button>
        </>
      }
    />

    <Stack gap="300" p="300">
      {/* Vertical inline slot: impact preview + conflict analysis */}
      <InlineSlot direction="row" data-tour="inline-slot">
        <InlineCard title="Impact Preview" agentName="Promotions Agent" headerRight={
          <Text textStyle="xs" color="neutral.9">Updates as you configure</Text>
        }>
          <Flex gap="300">
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="neutral.12">~2,400</Text>
              <Text textStyle="xs" color="neutral.9">Affected products</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="amber.11">-3.2%</Text>
              <Text textStyle="xs" color="neutral.9">Avg margin impact</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="green.11">0</Text>
              <Text textStyle="xs" color="neutral.9">Below 15% floor</Text>
            </Box>
          </Flex>
          <Flex mt="200" px="300" py="200" bg="neutral.3" borderRadius="200" gap="200" alignItems="center">
            <ProvenanceIndicator agentName="Promotions Agent" reason="Based on Summer Clearance 2025 (Q3) performance data" />
            <Text textStyle="xs" color="neutral.11">
              Comparable: Summer Clearance 2025 (Q3) lifted orders 18% over 4 weeks
            </Text>
          </Flex>
        </InlineCard>

        <Box data-tour="conflict-card"><InlineCard title="Conflict Detection" agentName="Promotions Agent" headerRight={
          <Badge size="2xs" colorPalette="warning">1 conflict</Badge>
        }>
          <Flex gap="200" alignItems="flex-start" p="200" bg="amber.2" borderRadius="200" borderWidth="1px" borderColor="amber.6">
            <Icon as={Warning} size="xs" color="amber.9" mt="50" flexShrink={0} />
            <Box>
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">
                142 products overlap with "Loyalty Member 10%"
              </Text>
              <Text textStyle="xs" color="neutral.10" mt="50">
                Stacking would push 38 products below the 15% margin floor. Consider adding an exclusion rule or making this discount non-stackable.
              </Text>
              <Flex mt="200" gap="200">
                <Button variant="outline" size="2xs">Add exclusion</Button>
                <Button variant="ghost" size="2xs">Non-stackable</Button>
              </Flex>
            </Box>
          </Flex>
        </InlineCard></Box>
      </InlineSlot>

      {/* Discount form */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300" data-tour="discount-form">
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="300">
          Discount Configuration
        </Text>

        <Flex gap="300">
          <Stack gap="300" flex="1">
            <FormField.Root size="sm">
              <FormField.Label>Discount name</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" width="100%" defaultValue="Summer Clearance 2026" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root size="sm">
              <FormField.Label>Discount type</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" width="100%" defaultValue="Percentage (20%)" />
              </FormField.Input>
            </FormField.Root>
          </Stack>
          <Stack gap="300" flex="1">
            <FormField.Root size="sm">
              <FormField.Label>Valid from</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" width="100%" defaultValue="2026-06-01" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root size="sm">
              <FormField.Label>Valid until</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" width="100%" defaultValue="2026-08-31" />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </Flex>

        <Separator my="300" />

        {/* Augmented conditions section */}
        <FormField.Root size="sm">
          <FormField.Label>
            <Flex alignItems="center" gap="200">
              <Text>Conditions</Text>
              <Box flex="1" />
              <Text textStyle="xs" color="neutral.9">{appliedList.length} applied</Text>
            </Flex>
          </FormField.Label>

          {/* Applied conditions (click ✕ to remove) */}
          <Flex gap="200" flexWrap="wrap" mb="300">
            {appliedList.map((c) => (
              <Badge key={c.label} size="2xs" colorPalette="neutral" cursor="pointer" onClick={() => removeCondition(c.label)}>
                {c.label} ✕
              </Badge>
            ))}
          </Flex>

          {/* AI suggested conditions (click to add) */}
          {suggestedList.length > 0 && (
            <Box data-tour="suggested-conditions">
              <Flex alignItems="center" gap="150" mb="200">
                <ProvenanceIndicator agentName="Promotions Agent" reason="Based on discount name and type analysis" />
                <Text textStyle="xs" fontWeight="semibold" color="indigo.9">Suggested conditions</Text>
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
                    <ProvenanceIndicator agentName="Promotions Agent" confidence={chip.confidence} size="8px" />
                    {chip.label} +
                  </Badge>
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
