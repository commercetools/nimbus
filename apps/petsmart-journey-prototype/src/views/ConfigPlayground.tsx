import { useState, useEffect } from "react";
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
  ComboBox,
} from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineCard } from "../components/InlineCard";
import { ActivationButton } from "../components/ActivationButton";
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { useJourney } from "../components/JourneyContext";

// ─── Scenario card with expandable config ───────────────────────────────────

interface SuggestedPredicate {
  label: string;
  confidence: number;
  agentSource: "ct" | "petsmart";
}

interface ScenarioConfig {
  type: string;
  value: string;
  predicates: string[];
  exclusions?: string[];
  stacking?: string;
  suggestions?: SuggestedPredicate[];
  suggestedExclusions?: SuggestedPredicate[];
}

// ─── Expanded config panel (matches petsmart-agentic-workflow pattern) ───────

const ExpandedConfig = ({
  config,
  agentSource,
}: {
  config: ScenarioConfig;
  agentSource: "ct" | "petsmart";
}) => {
  const [applied, setApplied] = useState<Set<string>>(
    new Set(config.predicates)
  );
  const [exclusions, setExclusions] = useState<Set<string>>(
    new Set(config.exclusions ?? [])
  );

  const addPredicate = (label: string) =>
    setApplied((prev) => new Set([...prev, label]));
  const removePredicate = (label: string) =>
    setApplied((prev) => {
      const next = new Set(prev);
      next.delete(label);
      return next;
    });
  const addExclusion = (label: string) =>
    setExclusions((prev) => new Set([...prev, label]));
  const removeExclusion = (label: string) =>
    setExclusions((prev) => {
      const next = new Set(prev);
      next.delete(label);
      return next;
    });

  const agentColor = agentSource === "petsmart" ? "primary" : "ctteal";

  return (
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

      {/* Applied conditions (removable) */}
      <Box mt="200">
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12" mb="100">
          Targeting Predicates
        </Text>
        <Flex gap="100" flexWrap="wrap" mb="150">
          {[...applied].map((p) => (
            <Badge
              key={p}
              size="2xs"
              colorPalette="neutral"
              cursor="pointer"
              onClick={() => removePredicate(p)}
            >
              {p} ✕
            </Badge>
          ))}
        </Flex>

        {/* Agent-suggested conditions */}
        {config.suggestions && config.suggestions.length > 0 && (
          <Box>
            <Flex alignItems="center" gap="100" mb="100">
              <ProvenanceIndicator
                agentName={
                  agentSource === "petsmart"
                    ? "PetSmart Commerce Intelligence"
                    : "Promotions Agent"
                }
                agentSource={agentSource}
                size="10px"
                reason="Predicate suggestions based on the scenario context and product catalog"
              />
              <Text textStyle="xs" fontWeight="medium" color="neutral.12">
                Suggested conditions
              </Text>
            </Flex>
            <Flex gap="100" flexWrap="wrap">
              {config.suggestions
                .filter((s) => !applied.has(s.label))
                .map((s) => (
                  <Flex
                    key={s.label}
                    alignItems="center"
                    gap="100"
                    px="200"
                    py="50"
                    bg={`${agentColor}.2`}
                    borderRadius="200"
                    borderWidth="1px"
                    borderColor={`${agentColor}.6`}
                    cursor="pointer"
                    _hover={{ bg: `${agentColor}.3` }}
                    transition="background 150ms"
                    onClick={() => addPredicate(s.label)}
                  >
                    <ProvenanceIndicator
                      agentName={
                        s.agentSource === "petsmart"
                          ? "PetSmart Commerce Intelligence"
                          : "Promotions Agent"
                      }
                      agentSource={s.agentSource}
                      confidence={s.confidence}
                      size="8px"
                      reason={`Suggested predicate "${s.label}" with ${s.confidence}% confidence, based on scenario context and catalog analysis`}
                    />
                    <Text textStyle="xs" color={`${agentColor}.11`}>
                      {s.label}
                    </Text>
                    <Text textStyle="xs" color={`${agentColor}.9`}>
                      +
                    </Text>
                  </Flex>
                ))}
            </Flex>
          </Box>
        )}

        {/* Search for additional predicates */}
        <Box mt="150">
          <ComboBox.Root
            size="sm"
            aria-label="Search predicates"
            width="100%"
            placeholder="Search for conditions..."
          >
            <ComboBox.Trigger />
            <ComboBox.Popover>
              <ComboBox.ListBox>
                <ComboBox.Option id="cat-pred" textValue="category = ...">
                  category = ...
                </ComboBox.Option>
                <ComboBox.Option id="sku-pred" textValue="sku IN ...">
                  sku IN ...
                </ComboBox.Option>
                <ComboBox.Option
                  id="inv-pred"
                  textValue="inventory.quantity > ..."
                >
                  inventory.quantity &gt; ...
                </ComboBox.Option>
                <ComboBox.Option id="brand-pred" textValue="brand = ...">
                  brand = ...
                </ComboBox.Option>
                <ComboBox.Option
                  id="price-pred"
                  textValue="price.centAmount > ..."
                >
                  price.centAmount &gt; ...
                </ComboBox.Option>
                <ComboBox.Option
                  id="attr-pred"
                  textValue="attributes.custom = ..."
                >
                  attributes.custom = ...
                </ComboBox.Option>
              </ComboBox.ListBox>
            </ComboBox.Popover>
          </ComboBox.Root>
        </Box>
      </Box>

      {/* Exclusions */}
      <Box mt="200">
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12" mb="100">
          Exclusions
        </Text>
        {exclusions.size > 0 && (
          <Flex gap="100" flexWrap="wrap" mb="150">
            {[...exclusions].map((e) => (
              <Badge
                key={e}
                size="2xs"
                colorPalette="critical"
                cursor="pointer"
                onClick={() => removeExclusion(e)}
              >
                {e} ✕
              </Badge>
            ))}
          </Flex>
        )}

        {/* Agent-suggested exclusions */}
        {config.suggestedExclusions &&
          config.suggestedExclusions.length > 0 && (
            <Box>
              <Flex alignItems="center" gap="100" mb="100">
                <ProvenanceIndicator
                  agentName={
                    agentSource === "petsmart"
                      ? "PetSmart Commerce Intelligence"
                      : "Promotions Agent"
                  }
                  agentSource={agentSource}
                  size="10px"
                  reason="Exclusion suggestions based on category overlap analysis and past campaign errors"
                />
                <Text textStyle="xs" fontWeight="medium" color="neutral.12">
                  Suggested exclusions
                </Text>
              </Flex>
              <Flex gap="100" flexWrap="wrap">
                {config.suggestedExclusions
                  .filter((s) => !exclusions.has(s.label))
                  .map((s) => (
                    <Flex
                      key={s.label}
                      alignItems="center"
                      gap="100"
                      px="200"
                      py="50"
                      bg="red.2"
                      borderRadius="200"
                      borderWidth="1px"
                      borderColor="red.6"
                      cursor="pointer"
                      _hover={{ bg: "red.3" }}
                      transition="background 150ms"
                      onClick={() => addExclusion(s.label)}
                    >
                      <ProvenanceIndicator
                        agentName={
                          s.agentSource === "petsmart"
                            ? "PetSmart Commerce Intelligence"
                            : "Promotions Agent"
                        }
                        agentSource={s.agentSource}
                        confidence={s.confidence}
                        size="8px"
                        reason={`Suggested exclusion "${s.label}" with ${s.confidence}% confidence, to prevent unintended matches`}
                      />
                      <Text textStyle="xs" color="red.11">
                        {s.label}
                      </Text>
                      <Text textStyle="xs" color="red.9">
                        +
                      </Text>
                    </Flex>
                  ))}
              </Flex>
            </Box>
          )}
      </Box>

      {/* Stacking */}
      {config.stacking && (
        <Flex mt="200" alignItems="center" gap="200">
          <Text slot={null} textStyle="xs" color="neutral.10">
            Stacking
          </Text>
          <Badge
            size="2xs"
            colorPalette={
              config.stacking === "allowed" ? "positive" : "neutral"
            }
          >
            {config.stacking}
          </Badge>
        </Flex>
      )}
    </Box>
  );
};

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

  // Open the recommended card's config when the chat panel opens (tour action)
  useEffect(() => {
    if (!isRecommended) return;
    const handler = () => setExpanded(true);
    window.addEventListener("tour:openPanel", handler);
    return () => window.removeEventListener("tour:openPanel", handler);
  }, [isRecommended]);

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
        <ExpandedConfig config={config} agentSource={agentSource} />
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
  suggestions: [
    {
      label: "velocity.trend = declining",
      confidence: 85,
      agentSource: "petsmart",
    },
    { label: "margin.headroom > 20%", confidence: 72, agentSource: "petsmart" },
  ],
  suggestedExclusions: [
    {
      label: "seasonal-holiday-2026 SKUs",
      confidence: 64,
      agentSource: "ct",
    },
    {
      label: "margin.headroom < 10%",
      confidence: 78,
      agentSource: "petsmart",
    },
  ],
};

const buyXGetYConfig: ScenarioConfig = {
  type: "Buy X Get Y",
  value: "Buy 2 Get 1",
  predicates: ["category = Dog Toys > Outdoor", "inventory.daysOnHand > 60"],
  stacking: "not allowed",
  suggestions: [
    {
      label: "brand = house-brand only",
      confidence: 67,
      agentSource: "petsmart",
    },
    { label: "price.centAmount > 1500", confidence: 58, agentSource: "ct" },
  ],
};

const bundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined price",
  predicates: ["sku IN aging-outdoor-toys", "sku IN fast-moving-treats"],
  stacking: "allowed",
  suggestions: [
    {
      label: "treats.velocity = rising",
      confidence: 81,
      agentSource: "petsmart",
    },
    { label: "margin.combined > 15%", confidence: 73, agentSource: "petsmart" },
  ],
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
  suggestions: [
    {
      label: "impressions.weekly > 200",
      confidence: 74,
      agentSource: "petsmart",
    },
    { label: "returns.rate < 5%", confidence: 69, agentSource: "ct" },
  ],
};

const costBundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined margin 19%",
  predicates: [
    "sku = hills-sd-adult-30lb",
    "category = Dog Treats > House Brand",
  ],
  stacking: "allowed",
  suggestions: [
    {
      label: "customer.segment = loyal-premium",
      confidence: 79,
      agentSource: "petsmart",
    },
    { label: "inventory.quantity > 100", confidence: 71, agentSource: "ct" },
  ],
  suggestedExclusions: [
    {
      label: "competitor.price < cost (loss leader)",
      confidence: 68,
      agentSource: "petsmart",
    },
  ],
};

const volumeConfig: ScenarioConfig = {
  type: "Volume discount",
  value: "$5 off 2+",
  predicates: ["brand = Hill's Science Diet", "quantity >= 2"],
  stacking: "allowed",
  suggestions: [
    { label: "channel = online + in-store", confidence: 82, agentSource: "ct" },
    {
      label: "customer.purchaseHistory >= 2",
      confidence: 66,
      agentSource: "petsmart",
    },
  ],
};

const passConfig: ScenarioConfig = {
  type: "Price adjustment",
  value: "+5% pass-through",
  predicates: ["brand = Hill's Science Diet", "cost_increase > 5%"],
  exclusions: ["Small Paws (above floor)"],
  stacking: "allowed",
  suggestions: [
    { label: "competitor.gap < $3", confidence: 77, agentSource: "petsmart" },
    {
      label: "shelf.position = premium",
      confidence: 63,
      agentSource: "petsmart",
    },
  ],
};

const deepenConfig: ScenarioConfig = {
  type: "Relative %",
  value: "20%",
  predicates: ["category = Collars & Leashes > Leashes"],
  exclusions: ["Cat collars"],
  stacking: "not allowed",
  suggestions: [
    {
      label: "competitor.priceMatch = PetCo",
      confidence: 91,
      agentSource: "petsmart",
    },
    { label: "badge.status = missing", confidence: 88, agentSource: "ct" },
    {
      label: "impressions.weekly < 500",
      confidence: 76,
      agentSource: "petsmart",
    },
  ],
  suggestedExclusions: [
    {
      label: "Loyalty program members (active)",
      confidence: 82,
      agentSource: "petsmart",
    },
    {
      label: "Already discounted > 15%",
      confidence: 74,
      agentSource: "ct",
    },
  ],
};

const leashBundleConfig: ScenarioConfig = {
  type: "Bundle",
  value: "Combined 20%",
  predicates: [
    "category = Collars & Leashes > Leashes",
    "category = Collars & Leashes > Collars",
  ],
  stacking: "allowed",
  suggestions: [
    {
      label: "cross-sell.affinity > 60%",
      confidence: 79,
      agentSource: "petsmart",
    },
    {
      label: "inventory.both_in_stock = true",
      confidence: 85,
      agentSource: "ct",
    },
  ],
};

const badgeFixConfig: ScenarioConfig = {
  type: "Badge update only",
  value: "No discount change",
  predicates: ["matchedBy = bts-leashes-15", "badge.status = missing"],
  suggestions: [
    {
      label: "badge.copy = 'Back to School 15% Off'",
      confidence: 92,
      agentSource: "ct",
    },
    {
      label: "impressions.weekly < 500",
      confidence: 84,
      agentSource: "petsmart",
    },
  ],
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
      reason="Simulation of all three discounts against the product catalog, checking stacking rules, predicate coverage, and sample cart outcomes"
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
        <Flex justifyContent="flex-end" mt="100">
          <ActivationButton
            label="Check coverage"
            agentSource="ct"
            data-tour="check-coverage-btn"
          />
        </Flex>
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
        <Box mb="400">
          <Text textStyle="lg" fontWeight="bold" color="neutral.12" mb="100">
            {subtitle}
          </Text>
          <Text textStyle="xs" color="neutral.10">
            {journeyId
              ? "Compare agent-generated scenarios. Click Configure to adjust parameters."
              : "Configure a discount to see projected outcomes."}
          </Text>
        </Box>

        {journeyId === 1 && <J1Scenarios />}
        {journeyId === 2 && <J2Scenarios />}
        {journeyId === 3 && <J3Scenarios />}
        {journeyId === 4 && <J4Scenarios />}

        {!journeyId && (
          <ScenarioCard
            title="Configure a discount to preview"
            agentSource="ct"
            config={{
              type: "",
              value: "",
              predicates: [],
              stacking: "allowed",
              suggestions: [
                { label: "category = ...", confidence: 0, agentSource: "ct" },
                {
                  label: "inventory.daysOnHand > 60",
                  confidence: 78,
                  agentSource: "petsmart",
                },
                { label: "brand = ...", confidence: 0, agentSource: "ct" },
              ],
            }}
            metrics={[]}
          />
        )}
      </Box>
    </Box>
  );
};
