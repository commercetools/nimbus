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

// ─── Product data lookup ────────────────────────────────────────────────────

interface ProductDetailData {
  name: string;
  key: string;
  productType: string;
  status: "published" | "modified" | "unpublished";
}

const productDetails: Record<string, ProductDetailData> = {
  "outdoor-fetch-toy": {
    name: "ChuckIt! Ultra Ball Launcher",
    key: "chuckit-ultra-launcher",
    productType: "Dog Toys",
    status: "published",
  },
  "hills-science-diet-30lb": {
    name: "Hill's Science Diet Adult 30lb",
    key: "hills-sd-adult-30lb",
    productType: "Dog Food",
    status: "published",
  },
  "nylon-leash-medium": {
    name: "Top Paw Nylon Leash - Medium",
    key: "top-paw-leash-md",
    productType: "Collars & Leashes",
    status: "published",
  },
};

// ─── Journey 1: Inventory & Channel Context Card ────────────────────────────

const J1ContextCard = () => (
  <InlineCard
    title="Channel Performance & Inventory"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
  >
    <Stack gap="150">
      <Grid columns={3} gap="200">
        <Box>
          <Text textStyle="xs" color="neutral.10">
            Days on Hand
          </Text>
          <Text textStyle="md" fontWeight="bold" color="amber.11">
            89d
          </Text>
        </Box>
        <Box>
          <Text textStyle="xs" color="neutral.10">
            Conversion Rate
          </Text>
          <Flex alignItems="baseline" gap="100">
            <Text textStyle="md" fontWeight="bold" color="green.11">
              3.8%
            </Text>
            <Text textStyle="xs" color="neutral.10">
              vs. 2.1% avg
            </Text>
          </Flex>
        </Box>
        <Box>
          <Text textStyle="xs" color="neutral.10">
            Online Impressions
          </Text>
          <Text textStyle="md" fontWeight="bold" color="red.11">
            Low
          </Text>
        </Box>
      </Grid>
      <Box
        data-tour="provenance-demo"
        bg="amber.2"
        px="200"
        py="100"
        borderRadius="100"
        borderLeftWidth="2px"
        borderColor="amber.8"
      >
        <Flex alignItems="center" gap="100" mb="50">
          <ProvenanceIndicator
            agentName="PetSmart Commerce Intelligence"
            agentSource="petsmart"
            confidence={88}
            reason="Calculated from PetSmart analytics: 412 purchases out of 10,842 product page views over 30 days"
          />
          <Text textStyle="xs" fontWeight="medium" color="amber.12">
            Key Insight
          </Text>
        </Flex>
        <Text textStyle="xs" color="amber.12">
          Strong conversion when viewed but low online impressions — sells 3x
          faster in stores. Online channel is the drag.
        </Text>
      </Box>
      <Grid columns={2} gap="150">
        <Box bg="neutral.2" px="200" py="100" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            Online
          </Text>
          <Text textStyle="xs" fontWeight="semibold" color="red.11">
            142 orders / 30d · ↓ 18%
          </Text>
        </Box>
        <Box bg="neutral.2" px="200" py="100" borderRadius="100">
          <Text textStyle="xs" color="neutral.10">
            In-Store
          </Text>
          <Text textStyle="xs" fontWeight="semibold" color="green.11">
            270 orders / 30d · ↑ 4%
          </Text>
        </Box>
      </Grid>
    </Stack>
  </InlineCard>
);

// ─── Journey 2: Multi-Lever Decision Card ───────────────────────────────────

const J2DecisionCard = () => (
  <InlineCard
    title="Response Options"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
  >
    <Stack gap="250">
      {[
        {
          lever: "Absorb",
          detail: "Margin drops to 14% (below 18% floor)",
          risk: "high",
        },
        {
          lever: "Pass-through 5%",
          detail:
            "Price → $57.74, competitor PetCo at $52.99, margin recovers to 19.4%",
          risk: "medium",
        },
        {
          lever: "Pass-through 8% (full)",
          detail: "Price → $59.39, $6.40 above PetCo, margin recovers to 22%",
          risk: "high",
        },
        {
          lever: "Substitute",
          detail: "Authority house-brand: 32% margin, similar velocity",
          risk: "medium",
        },
        {
          lever: "Promotional offset",
          detail: "Bundle with accessories to maintain perceived value",
          risk: "low",
        },
      ].map((opt) => (
        <Flex
          key={opt.lever}
          bg="neutral.2"
          p="200"
          borderRadius="100"
          alignItems="center"
          justifyContent="space-between"
          gap="200"
        >
          <Box>
            <Flex alignItems="center" gap="100">
              <ProvenanceBadge size="8px" agentSource="petsmart" />
              <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
                {opt.lever}
              </Text>
            </Flex>
            <Text textStyle="xs" color="neutral.10">
              {opt.detail}
            </Text>
          </Box>
          <Badge
            size="xs"
            colorPalette={
              opt.risk === "high"
                ? "critical"
                : opt.risk === "medium"
                  ? "warning"
                  : "positive"
            }
          >
            {opt.risk} risk
          </Badge>
        </Flex>
      ))}
      <Separator />
      <Flex alignItems="center" gap="150" data-tour="provenance-demo">
        <ProvenanceIndicator
          agentName="PetSmart Commerce Intelligence"
          agentSource="petsmart"
          confidence={91}
          reason="PetCo's price of $52.99 comes from competitive intelligence feed, last updated 2 days ago via automated price monitoring"
        />
        <Text textStyle="xs" color="neutral.10">
          Competitive pricing from PetSmart's intelligence feed
        </Text>
      </Flex>
    </Stack>
  </InlineCard>
);

// ─── Journey 3/4: Badge Gap Card ────────────────────────────────────────────

const BadgeGapCard = ({ journeyId }: { journeyId: number }) => (
  <InlineCard
    title={journeyId === 4 ? "Badge Gap & Competitive Position" : "Badge Gap"}
    agentName={
      journeyId === 4 ? "PetSmart Commerce Intelligence" : "Promotions Agent"
    }
    agentSource={journeyId === 4 ? "petsmart" : "ct"}
    headerRight={
      <Badge size="2xs" colorPalette="critical">
        missing badge
      </Badge>
    }
  >
    <Stack gap="200">
      <Text textStyle="xs" color="neutral.11" lineHeight="tall">
        This leash product is matched by the leashes discount (15% off) but has
        no promo badge attribute. Customers won't see the offer on the listing
        page.
      </Text>
      <Box bg="amber.2" p="200" borderRadius="100">
        <Flex alignItems="center" gap="100">
          <ProvenanceBadge size="8px" agentSource="ct" />
          <Text textStyle="xs" fontWeight="semibold" color="amber.11">
            Suggested badge copy
          </Text>
        </Flex>
        <Text textStyle="sm" color="neutral.12" mt="50">
          "Save 15% — Back to School Pet Prep"
        </Text>
      </Box>
      <Text textStyle="xs" color="neutral.10">
        23 of 89 matched products are missing badges.
      </Text>
      {journeyId === 4 && (
        <>
          <Separator />
          <Grid columns={2} gap="200">
            <Box bg="neutral.2" p="200" borderRadius="100">
              <Text textStyle="xs" color="neutral.10">
                Impressions this week
              </Text>
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                412
              </Text>
              <Text textStyle="xs" color="neutral.10">
                Badged avg: 1,100
              </Text>
            </Box>
            <Box bg="neutral.2" p="200" borderRadius="100">
              <Text textStyle="xs" color="neutral.10">
                Your price (after discount)
              </Text>
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                $21.24
              </Text>
              <Text textStyle="xs" color="red.11">
                PetCo: $19.99
              </Text>
            </Box>
          </Grid>
        </>
      )}
    </Stack>
  </InlineCard>
);

// ─── ProductDetail view ─────────────────────────────────────────────────────

export const ProductDetail = () => {
  const { productId } = useParams();
  const { activeJourney } = useJourney();
  const journeyId = activeJourney?.id ?? null;

  const product = productDetails[productId ?? ""] ?? {
    name: productId ?? "Product",
    key: productId ?? "",
    productType: "Unknown",
    status: "published" as const,
  };

  // Journey-specific toolbar actions
  const toolbarActions = (
    <Flex gap="200" alignItems="center">
      {journeyId === 1 && (
        <ActivationButton
          label="Model promotions"
          agentSource="petsmart"
          data-tour="model-promotions-btn"
        />
      )}
      {journeyId === 2 && (
        <>
          <ActivationButton
            label="View alternatives"
            agentSource="petsmart"
            data-tour="view-alternatives-btn"
          />
          <ActivationButton
            label="Model promotional offset"
            agentSource="petsmart"
          />
        </>
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
        title={product.name}
        subtitle={`${product.key} · ${product.productType}`}
        status={{ label: product.status, colorPalette: "positive" }}
        actions={toolbarActions}
      />

      <Box p="300">
        <Flex gap="300" direction={{ base: "column", lg: "row" }}>
          {/* Left column: form */}
          <Stack gap="300" flex="2" minWidth="0">
            {/* Product info */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.6"
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
                  <FormField.Label>Product Name (EN)</FormField.Label>
                  <TextInput defaultValue={product.name} size="sm" />
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Product Key</FormField.Label>
                  <TextInput defaultValue={product.key} size="sm" isReadOnly />
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Product Type</FormField.Label>
                  <TextInput
                    defaultValue={product.productType}
                    size="sm"
                    isReadOnly
                  />
                </FormField.Root>
              </Stack>
            </Box>

            {/* Description */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Description
              </Text>
              <Box bg="neutral.2" p="200" borderRadius="100" minHeight="80px">
                <Text textStyle="xs" color="neutral.10">
                  Product description placeholder...
                </Text>
              </Box>
            </Box>

            {/* Variants */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Variants
              </Text>
              <Box bg="neutral.2" p="200" borderRadius="100">
                <Text textStyle="xs" color="neutral.10">
                  Variant table — details vary by product
                </Text>
              </Box>
            </Box>
          </Stack>

          {/* Right column: inline render target + agent cards */}
          <Stack
            gap="300"
            flex="1"
            minWidth={{ base: "0", lg: "300px" }}
            width={{ base: "100%", lg: "auto" }}
            data-tour="inline-slot"
          >
            {journeyId === 1 && <J1ContextCard />}
            {journeyId === 2 && <J2DecisionCard />}
            {(journeyId === 3 || journeyId === 4) && (
              <BadgeGapCard journeyId={journeyId} />
            )}

            {/* Always show: basic product metadata card (ct data) */}
            <Box
              bg="white"
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="200"
              p="300"
            >
              <Text
                textStyle="sm"
                fontWeight="semibold"
                color="neutral.12"
                mb="200"
              >
                Product Metadata
              </Text>
              <Stack gap="100">
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Status
                  </Text>
                  <Badge size="2xs" colorPalette="positive">
                    {product.status}
                  </Badge>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Type
                  </Text>
                  <Text textStyle="xs" color="neutral.12">
                    {product.productType}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.10">
                    Key
                  </Text>
                  <Text textStyle="xs" color="neutral.12" fontFamily="mono">
                    {product.key}
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
