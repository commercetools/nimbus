import { useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Separator,
  Grid,
  Button,
  TextInput,
  FormField,
  Switch,
  TagGroup,
} from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { useJourney } from "../components/JourneyContext";

// ─── Scenario card with expandable config ───────────────────────────────────

interface ScenarioConfig {
  type: string;
  value: string;
  predicates: string[];
  exclusions?: string[];
  stacking?: string;
}

interface ScenarioProps {
  title: string;
  agentSource: "ct" | "petsmart";
  metrics: Array<{ label: string; value: string; color?: string }>;
  historical?: string;
  isRecommended?: boolean;
  config?: ScenarioConfig;
}

const ScenarioCard = ({
  title,
  agentSource,
  metrics,
  historical,
  isRecommended,
  config,
}: ScenarioProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor={isRecommended ? "primary.6" : "neutral.4"}
      borderRadius="200"
      p="300"
      position="relative"
    >
      {isRecommended && (
        <Badge
          size="2xs"
          colorPalette="primary"
          position="absolute"
          top="-8px"
          right="200"
        >
          recommended
        </Badge>
      )}
      <Flex alignItems="center" gap="150" mb="200">
        <ProvenanceBadge size="12px" agentSource={agentSource} />
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
          {title}
        </Text>
        {config && (
          <Button
            variant="ghost"
            size="2xs"
            ml="auto"
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide config" : "Configure"}
          </Button>
        )}
      </Flex>
      <Flex gap="200" wrap="wrap" mb={historical || expanded ? "200" : "0"}>
        {metrics.map((m) => (
          <Box
            key={m.label}
            bg="neutral.2"
            px="200"
            py="100"
            borderRadius="100"
          >
            <Text textStyle="xs" color="neutral.10">
              {m.label}
            </Text>
            <Text
              textStyle="xs"
              fontWeight="bold"
              color={m.color ?? "neutral.12"}
            >
              {m.value}
            </Text>
          </Box>
        ))}
      </Flex>
      {historical && (
        <Box
          bg="amber.2"
          px="200"
          py="100"
          borderRadius="100"
          borderLeftWidth="2px"
          borderColor="amber.8"
          mb={expanded ? "200" : "0"}
        >
          <Text textStyle="xs" color="amber.12">
            {historical}
          </Text>
        </Box>
      )}
      {/* Expandable discount configuration */}
      {expanded && config && (
        <Box mt="200">
          <Separator mb="200" />
          <Grid columns={2} gap="200">
            <FormField.Root size="sm">
              <FormField.Label>Discount Type</FormField.Label>
              <TextInput size="sm" defaultValue={config.type} />
            </FormField.Root>
            <FormField.Root size="sm">
              <FormField.Label>Value</FormField.Label>
              <TextInput size="sm" defaultValue={config.value} />
            </FormField.Root>
          </Grid>
          <Box mt="200">
            <Text
              textStyle="xs"
              fontWeight="semibold"
              color="neutral.12"
              mb="100"
            >
              Targeting Predicates
            </Text>
            <TagGroup.Root size="sm" aria-label="Predicates">
              <TagGroup.TagList>
                {config.predicates.map((p, i) => (
                  <TagGroup.Tag key={i} id={`pred-${i}`}>
                    {p}
                  </TagGroup.Tag>
                ))}
              </TagGroup.TagList>
            </TagGroup.Root>
          </Box>
          {config.exclusions && config.exclusions.length > 0 && (
            <Box mt="200">
              <Text
                textStyle="xs"
                fontWeight="semibold"
                color="neutral.12"
                mb="100"
              >
                Exclusions
              </Text>
              <TagGroup.Root size="sm" aria-label="Exclusions">
                <TagGroup.TagList>
                  {config.exclusions.map((e, i) => (
                    <TagGroup.Tag key={i} id={`excl-${i}`}>
                      {e}
                    </TagGroup.Tag>
                  ))}
                </TagGroup.TagList>
              </TagGroup.Root>
            </Box>
          )}
          {config.stacking && (
            <Flex mt="200" alignItems="center" gap="200">
              <Text textStyle="xs" color="neutral.10">
                Stacking
              </Text>
              <Switch
                size="sm"
                defaultSelected={config.stacking === "allowed"}
              />
              <Text textStyle="xs" color="neutral.12">
                {config.stacking}
              </Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

// ─── Default config templates ───────────────────────────────────────────────

const clearanceConfig: ScenarioConfig = {
  type: "Relative %",
  value: "20%",
  predicates: ["category = Dog Toys > Outdoor", "inventory.daysOnHand > 60"],
  exclusions: ["New arrivals (last 30d)"],
  stacking: "allowed",
};

const buyXGetYConfig: ScenarioConfig = {
  type: "Buy X Get Y",
  value: "Buy 2 Get 1",
  predicates: ["category = Dog Toys > Outdoor", "inventory.daysOnHand > 60"],
  stacking: "not allowed",
};

const bundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined price",
  predicates: ["sku IN aging-outdoor-toys", "sku IN fast-moving-treats"],
  stacking: "allowed",
};

const flashSaleConfig: ScenarioConfig = {
  type: "Relative %",
  value: "25%",
  predicates: [
    "category = Dog Toys > Outdoor",
    "channel = online",
    "inventory.daysOnHand > 60",
  ],
  exclusions: ["In-store only SKUs"],
  stacking: "not allowed",
};

const costBundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined margin 19%",
  predicates: [
    "sku = hills-sd-adult-30lb",
    "category = Dog Treats > House Brand",
  ],
  stacking: "allowed",
};

const volumeConfig: ScenarioConfig = {
  type: "Volume discount",
  value: "$5 off 2+",
  predicates: ["brand = Hill's Science Diet", "quantity >= 2"],
  stacking: "allowed",
};

const passConfig: ScenarioConfig = {
  type: "Price adjustment",
  value: "+5% pass-through",
  predicates: ["brand = Hill's Science Diet", "cost_increase > 5%"],
  exclusions: ["Small Paws (above floor)"],
  stacking: "allowed",
};

const deepenConfig: ScenarioConfig = {
  type: "Relative %",
  value: "20%",
  predicates: ["category = Collars & Leashes > Leashes"],
  exclusions: ["Cat collars"],
  stacking: "not allowed",
};

const leashBundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined 20%",
  predicates: [
    "category = Collars & Leashes > Leashes",
    "category = Collars & Leashes > Collars",
  ],
  stacking: "allowed",
};

const badgeFixConfig: ScenarioConfig = {
  type: "Badge update only",
  value: "No discount change",
  predicates: ["matchedBy = bts-leashes-15", "badge.status = missing"],
};

// ─── Journey-specific scenario sets ─────────────────────────────────────────

const J1Scenarios = () => (
  <Stack gap="200" data-tour="scenario-cards">
    <ScenarioCard
      title="20% off Dog Toys > Outdoor (47 SKUs)"
      agentSource="petsmart"
      isRecommended
      config={clearanceConfig}
      metrics={[
        { label: "Margin impact", value: "-4.1%", color: "amber.11" },
        { label: "Est. clearance", value: "3 weeks" },
        { label: "Channel", value: "All" },
      ]}
      historical="Last Q3, a 20% clearance on outdoor toys cleared 78% of aging stock in 3 weeks with 2.1% margin erosion."
    />
    <ScenarioCard
      title="Buy 2 Get 1 on aging SKUs (>60 days)"
      agentSource="petsmart"
      config={buyXGetYConfig}
      metrics={[
        { label: "Margin impact", value: "-2.8%", color: "green.11" },
        { label: "Est. clearance", value: "5 weeks" },
        { label: "Channel", value: "All" },
      ]}
      historical="Buy 2 Get 1 on the same category cleared 64% but preserved full margin."
    />
    <ScenarioCard
      title="Bundle with fast-moving treats"
      agentSource="petsmart"
      config={bundleConfig}
      metrics={[
        { label: "Margin impact", value: "-1.2%", color: "green.11" },
        { label: "Est. clearance", value: "6 weeks" },
        { label: "Avg. order", value: "+$8.40", color: "green.11" },
      ]}
    />
    <ScenarioCard
      title="Online-only flash sale (targets underperforming channel)"
      agentSource="petsmart"
      config={flashSaleConfig}
      metrics={[
        { label: "Margin impact", value: "-3.5%", color: "amber.11" },
        { label: "Est. clearance", value: "2 weeks" },
        { label: "Channel", value: "Online only" },
      ]}
      historical="Online-only promotions in this category have 2.3x higher conversion lift than all-channel."
    />
  </Stack>
);

const J2Scenarios = () => (
  <Stack gap="200" data-tour="scenario-cards">
    <ScenarioCard
      title="Bundle Hill's 30lb + house-brand treats"
      agentSource="petsmart"
      isRecommended
      config={costBundleConfig}
      metrics={[
        { label: "Combined margin", value: "19%", color: "green.11" },
        { label: "Perceived value", value: "maintained" },
        { label: "Churn risk", value: "low", color: "green.11" },
      ]}
    />
    <ScenarioCard
      title="Volume discount: Buy 2 bags, save $5"
      agentSource="petsmart"
      config={volumeConfig}
      metrics={[
        { label: "Margin", value: "17.8%", color: "amber.11" },
        { label: "Volume lift", value: "+12% projected" },
        { label: "Price gap", value: "$2.50 vs PetCo" },
      ]}
      historical="Last time prices were raised 6% on premium dog food, volume dropped 4% over 8 weeks."
    />
    <ScenarioCard
      title="5% pass-through + shelf space for house brand"
      agentSource="petsmart"
      config={passConfig}
      metrics={[
        { label: "Margin", value: "19.4%", color: "green.11" },
        { label: "Volume impact", value: "-2% projected" },
        {
          label: "House brand lift",
          value: "+8% projected",
          color: "green.11",
        },
      ]}
    />
  </Stack>
);

const J3Scenarios = () => (
  <Stack gap="200" data-tour="scenario-cards">
    <InlineCard
      title="Campaign Simulation Results"
      agentName="Promotions Agent"
      agentSource="ct"
    >
      <Stack gap="200">
        <Grid columns={3} gap="200">
          <Box bg="green.2" p="200" borderRadius="100">
            <Text textStyle="xs" color="neutral.10">
              Collars 10%
            </Text>
            <Text textStyle="xs" fontWeight="bold" color="green.11">
              55 SKUs · ✓
            </Text>
          </Box>
          <Box bg="green.2" p="200" borderRadius="100">
            <Text textStyle="xs" color="neutral.10">
              Leashes 15%
            </Text>
            <Text textStyle="xs" fontWeight="bold" color="green.11">
              31 SKUs · ✓
            </Text>
          </Box>
          <Box bg="green.2" p="200" borderRadius="100">
            <Text textStyle="xs" color="neutral.10">
              Crates 20%
            </Text>
            <Text textStyle="xs" fontWeight="bold" color="green.11">
              24 SKUs · ✓
            </Text>
          </Box>
        </Grid>
        <Box
          bg="red.2"
          px="200"
          py="150"
          borderRadius="100"
          borderLeftWidth="2px"
          borderColor="red.8"
        >
          <Flex alignItems="center" gap="100" mb="50">
            <ProvenanceBadge size="12px" agentSource="ct" />
            <Text textStyle="xs" fontWeight="semibold" color="red.11">
              Stacking conflict
            </Text>
          </Flex>
          <Text textStyle="xs" color="red.12">
            Active "Loyalty 10%" discount stacks with crates (20%), pushing 12
            SKUs below margin floor.
          </Text>
        </Box>
        <Box bg="neutral.2" p="200" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            Sample cart: 2 collars + 1 leash
          </Text>
          <Flex gap="200" mt="100">
            <Text textStyle="xs" color="neutral.12">
              Total discount:{" "}
              <Text as="span" fontWeight="bold">
                $8.50
              </Text>
            </Text>
            <Text textStyle="xs" color="neutral.12">
              Margin:{" "}
              <Text as="span" fontWeight="bold" color="green.11">
                22% ✓
              </Text>
            </Text>
          </Flex>
        </Box>
      </Stack>
    </InlineCard>
  </Stack>
);

const J4Scenarios = () => (
  <Stack gap="200" data-tour="scenario-cards">
    <ScenarioCard
      title="Deepen leashes to 20% (matches competitor)"
      agentSource="petsmart"
      config={deepenConfig}
      metrics={[
        { label: "Projected redemption", value: "~16%", color: "green.11" },
        { label: "Margin impact", value: "-2.3%", color: "amber.11" },
        { label: "vs. PetCo", value: "price match" },
      ]}
    />
    <ScenarioCard
      title="Bundle: leash + collar at combined 20%"
      agentSource="petsmart"
      config={leashBundleConfig}
      metrics={[
        { label: "Projected redemption", value: "~12%", color: "green.11" },
        { label: "Cross-sell lift", value: "+18%", color: "green.11" },
        { label: "Avg. order", value: "+$6.20", color: "green.11" },
      ]}
    />
    <ScenarioCard
      title="Fix badge coverage first (no price change)"
      agentSource="petsmart"
      isRecommended
      config={badgeFixConfig}
      metrics={[
        { label: "Projected redemption", value: "~9%", color: "amber.11" },
        { label: "Cost", value: "$0", color: "green.11" },
        { label: "Implementation", value: "immediate" },
      ]}
      historical="Fixing badge coverage alone projects ~9% redemption (from 3%) based on the 4.2% vs 0.8% conversion gap between badged and unbadged products."
    />
  </Stack>
);

// ─── ConfigPlayground view ──────────────────────────────────────────────────

export const ConfigPlayground = () => {
  const { activeJourney } = useJourney();
  const journeyId = activeJourney?.id ?? null;

  const subtitle =
    journeyId === 1
      ? "Clearance scenarios for Dog Toys > Outdoor"
      : journeyId === 2
        ? "Cost-increase response scenarios for Hill's Science Diet"
        : journeyId === 3
          ? "Back to School Pet Prep. Campaign Simulation"
          : journeyId === 4
            ? "Pivot scenarios for leashes discount"
            : "Multi-discount simulation";

  return (
    <Box>
      <PageHeader title="Configuration Playground" subtitle={subtitle} />

      <Box p="300">
        {journeyId === 1 && <J1Scenarios />}
        {journeyId === 2 && <J2Scenarios />}
        {journeyId === 3 && <J3Scenarios />}
        {journeyId === 4 && <J4Scenarios />}

        {!journeyId && (
          <Box
            bg="white"
            borderRadius="200"
            p="300"
            borderWidth="1px"
            borderColor="neutral.4"
          >
            <Text textStyle="xs" color="neutral.10">
              Select a journey from the homepage to see pre-populated scenarios.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
