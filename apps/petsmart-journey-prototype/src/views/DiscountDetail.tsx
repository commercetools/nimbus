import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Button,
  Separator,
  TextInput,
  FormField,
  Grid,
} from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ActivationButton } from "../components/ActivationButton";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { useJourney } from "../components/JourneyContext";

// ─── Discount data lookup ───────────────────────────────────────────────────

interface DiscountDetailData {
  name: string;
  key: string;
  type: string;
  value: string;
  isActive: boolean;
}

const discountDetails: Record<string, DiscountDetailData> = {
  "back-to-school-collars": {
    name: "Back to School Pet Prep — Collars",
    key: "bts-collars-10",
    type: "Relative %",
    value: "10",
    isActive: true,
  },
  "back-to-school-leashes": {
    name: "Back to School Pet Prep — Leashes",
    key: "bts-leashes-15",
    type: "Relative %",
    value: "15",
    isActive: true,
  },
  "back-to-school-crates": {
    name: "Back to School Pet Prep — Crates",
    key: "bts-crates-20",
    type: "Relative %",
    value: "20",
    isActive: true,
  },
};

// ─── J3: Predicate suggestions + warning ────────────────────────────────────

const J3PredicateCard = () => (
  <InlineCard
    title="Targeting Assistance"
    agentName="Promotions Agent"
    agentSource="ct"
    reason="Predicate suggestions and overlap detection from ct's promotion engine, validated against PetSmart's category hierarchy"
    data-tour="inline-slot"
  >
    <Stack gap="200">
      <Text slot={null} textStyle="xs" color="neutral.10">
        Suggested targeting rules:
      </Text>
      <Flex gap="100" flexWrap="wrap">
        <Badge size="2xs" colorPalette="info">
          <Flex alignItems="center" gap="100">
            <ProvenanceBadge size="10px" agentSource="ct" />
            Category: Dog Supplies &gt; Collars &amp; Leashes
          </Flex>
        </Badge>
        <Badge size="2xs" colorPalette="info">
          <Flex alignItems="center" gap="100">
            <ProvenanceBadge size="10px" agentSource="petsmart" />
            Inventory &gt; 20 units
          </Flex>
        </Badge>
      </Flex>
      <Box
        bg="red.2"
        px="200"
        py="150"
        borderRadius="200"
        borderLeftWidth="2px"
        borderColor="red.8"
      >
        <Flex alignItems="center" gap="100" mb="50">
          <ProvenanceBadge size="12px" agentSource="petsmart" />
          <Text textStyle="xs" fontWeight="semibold" color="red.11">
            Targeting overlap detected
          </Text>
        </Flex>
        <Text textStyle="xs" color="red.12">
          This rule also matches Cat Collars — 34 unintended SKUs. Add an
          exclusion?
        </Text>
      </Box>
    </Stack>
  </InlineCard>
);

// ─── J4: Diagnostic cards ───────────────────────────────────────────────────

const J4BadgeCoverageCard = () => (
  <InlineCard
    title="Badge Coverage Analysis"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    reason="Badge attribute coverage from commercetools product data, with conversion comparison from PetSmart's web analytics"
    data-tour="inline-slot"
    headerRight={
      <Badge size="2xs" colorPalette="critical">
        61% missing
      </Badge>
    }
  >
    <Stack gap="200">
      <Flex gap="200">
        <Box flex="1" bg="red.2" p="200" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            Badge set
          </Text>
          <Text textStyle="md" fontWeight="bold" color="neutral.12">
            12 / 31
          </Text>
          <Text textStyle="xs" color="red.11">
            61% of products not showing the offer
          </Text>
        </Box>
        <Box flex="1" bg="green.2" p="200" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            Other discounts
          </Text>
          <Text textStyle="md" fontWeight="bold" color="green.11">
            &gt;90%
          </Text>
          <Text textStyle="xs" color="green.10">
            Collars and crates badge coverage
          </Text>
        </Box>
      </Flex>
      <Separator />
      <Flex gap="200">
        <Box flex="1" bg="neutral.2" p="200" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            With badges
          </Text>
          <Text textStyle="sm" fontWeight="bold" color="green.11">
            4.2% conversion
          </Text>
        </Box>
        <Box flex="1" bg="neutral.2" p="200" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            Without badges
          </Text>
          <Text textStyle="sm" fontWeight="bold" color="red.11">
            0.8% conversion
          </Text>
        </Box>
      </Flex>
    </Stack>
  </InlineCard>
);

const J4CompetitiveCard = () => (
  <InlineCard
    title="Competitive Context"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    reason="Competitor promotion detected by PetSmart's automated competitive intelligence feed, confirmed still active"
  >
    <Flex alignItems="center" gap="150" data-tour="provenance-demo">
      <ProvenanceIndicator
        agentName="PetSmart Commerce Intelligence"
        agentSource="petsmart"
        confidence={94}
        reason="PetCo's 'Leash & Harness Sale' (20% off) detected Aug 26 via competitive intelligence feed, confirmed still active"
      />
      <Text textStyle="xs" color="neutral.11">
        PetCo launched{" "}
        <Text as="span" fontWeight="semibold" color="red.11">
          20% off leashes
        </Text>{" "}
        5 days ago. Current discount depth (15%) is 5 points below competitor's
        offer.
      </Text>
    </Flex>
  </InlineCard>
);

// ─── DiscountDetail view ────────────────────────────────────────────────────

export const DiscountDetail = () => {
  const { discountId } = useParams();
  const { activeJourney } = useJourney();
  const journeyId = activeJourney?.id ?? null;

  const discount = discountDetails[discountId ?? ""] ?? {
    name: discountId ?? "Discount",
    key: discountId ?? "",
    type: "Relative %",
    value: "0",
    isActive: false,
  };

  const toolbarActions = (
    <Flex gap="200" alignItems="center">
      {journeyId === 3 && (
        <ActivationButton
          label="Simulate campaign"
          agentSource="ct"
          data-tour="simulate-campaign-btn"
        />
      )}
      {journeyId === 4 && (
        <ActivationButton
          label="Model pivot"
          agentSource="petsmart"
          data-tour="model-pivot-btn"
        />
      )}
      <Button variant="ghost" size="2xs">
        Revert
      </Button>
      <Button variant="solid" colorPalette="primary" size="2xs">
        Save
      </Button>
    </Flex>
  );

  return (
    <Box>
      <PageHeader
        title={discount.name}
        subtitle={discount.key}
        status={{
          label: discount.isActive ? "active" : "inactive",
          colorPalette: discount.isActive ? "positive" : "neutral",
        }}
        actions={toolbarActions}
      />

      <Box p="300">
        <Flex gap="300" direction={{ base: "column", lg: "row" }}>
          {/* Left column: form */}
          <Stack gap="300" flex="2" minWidth="0">
            {/* General info */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.4"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                General Information
              </Text>
              <Stack gap="200">
                <FormField.Root>
                  <FormField.Label>Discount Name</FormField.Label>
                  <TextInput defaultValue={discount.name} size="sm" />
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Key</FormField.Label>
                  <TextInput defaultValue={discount.key} size="sm" isReadOnly />
                </FormField.Root>
              </Stack>
              <Flex gap="200" alignItems="center" mt="200">
                <Text slot={null} textStyle="xs" color="neutral.10">
                  Status
                </Text>
                <Badge
                  size="2xs"
                  colorPalette={discount.isActive ? "positive" : "neutral"}
                >
                  {discount.isActive ? "active" : "inactive"}
                </Badge>
              </Flex>
            </Box>

            {/* Discount value */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.4"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Discount Value
              </Text>
              <Grid columns={2} gap="200">
                <FormField.Root>
                  <FormField.Label>Type</FormField.Label>
                  <TextInput
                    defaultValue={discount.type}
                    size="sm"
                    isReadOnly
                  />
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Value (%)</FormField.Label>
                  <TextInput defaultValue={discount.value} size="sm" />
                </FormField.Root>
              </Grid>
            </Box>

            {/* Cart conditions / predicate builder */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.4"
              borderRadius="200"
              p="300"
              data-tour="predicate-builder"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Cart Conditions
              </Text>
              <Box bg="neutral.2" p="200" borderRadius="100" minHeight="60px">
                <Text textStyle="xs" color="neutral.10">
                  category.id = "dog-supplies-collars" AND inventory.quantity
                  &gt; 20
                </Text>
              </Box>
            </Box>

            {/* Scheduling */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.4"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Scheduling
              </Text>
              <Grid columns={2} gap="200">
                <FormField.Root>
                  <FormField.Label>Valid From</FormField.Label>
                  <TextInput defaultValue="2026-08-15" size="sm" />
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Valid Until</FormField.Label>
                  <TextInput defaultValue="2026-09-15" size="sm" />
                </FormField.Root>
              </Grid>
            </Box>
          </Stack>

          {/* Right column: inline render target */}
          <Stack
            gap="300"
            flex="1"
            minWidth={{ base: "0", lg: "300px" }}
            width={{ base: "100%", lg: "auto" }}
          >
            {journeyId === 3 && <J3PredicateCard />}
            {journeyId === 4 && (
              <>
                <J4BadgeCoverageCard />
                <J4CompetitiveCard />
              </>
            )}

            {/* Always show: discount metadata */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.4"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Discount Info
              </Text>
              <Stack gap="100">
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Type
                  </Text>
                  <Badge size="2xs" colorPalette="info">
                    {discount.type}
                  </Badge>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Value
                  </Text>
                  <Text textStyle="xs" color="neutral.12">
                    {discount.value}%
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Sort Order
                  </Text>
                  <Text textStyle="xs" color="neutral.12">
                    1
                  </Text>
                </Flex>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
