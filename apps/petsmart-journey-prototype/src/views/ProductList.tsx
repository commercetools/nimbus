import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  DataTable,
  SearchInput,
} from "@commercetools/nimbus";
import type { DataTableColumnItem } from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ActivationButton } from "../components/ActivationButton";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { useJourney } from "../components/JourneyContext";
import { getProductsForJourney, type Product } from "../data/products";

// ─── Journey-specific inline summary cards ──────────────────────────────────

const J1SummaryCard = () => (
  <InlineCard
    title="Category Inventory Summary"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    headerRight={
      <Badge size="2xs" colorPalette="warning">
        47 SKUs aging
      </Badge>
    }
  >
    <Flex gap="300" alignItems="center" wrap="wrap">
      <Flex alignItems="baseline" gap="100">
        <Text textStyle="lg" fontWeight="bold" color="neutral.12">
          $340K
        </Text>
        <Text textStyle="xs" color="neutral.10">
          aging &gt;60d
        </Text>
      </Flex>
      <Flex gap="300">
        <Flex
          alignItems="baseline"
          gap="100"
          bg="red.2"
          px="200"
          py="50"
          borderRadius="100"
        >
          <Text textStyle="xs" color="neutral.10">
            Online
          </Text>
          <Text textStyle="xs" fontWeight="bold" color="red.11">
            ↓ 12%
          </Text>
        </Flex>
        <Flex
          alignItems="baseline"
          gap="100"
          bg="neutral.2"
          px="200"
          py="50"
          borderRadius="100"
        >
          <Text textStyle="xs" color="neutral.10">
            In-Store
          </Text>
          <Text textStyle="xs" fontWeight="bold" color="neutral.11">
            — flat
          </Text>
        </Flex>
      </Flex>
      <Text textStyle="xs" color="amber.11" flex="1" minWidth="200px">
        Channel-specific problem — online is the drag, in-store is stable
      </Text>
    </Flex>
  </InlineCard>
);

const J2SummaryCard = () => (
  <InlineCard
    title="Cost Increase Impact"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    headerRight={
      <Badge size="2xs" colorPalette="error">
        68 below floor
      </Badge>
    }
  >
    <Flex gap="300" alignItems="center" wrap="wrap">
      <Flex alignItems="baseline" gap="100">
        <Text textStyle="lg" fontWeight="bold" color="red.11">
          $2.1M
        </Text>
        <Text textStyle="xs" color="neutral.10">
          annual revenue at risk
        </Text>
      </Flex>
      <Flex
        alignItems="baseline"
        gap="100"
        bg="red.2"
        px="200"
        py="50"
        borderRadius="100"
      >
        <Text textStyle="xs" color="red.11" fontWeight="semibold">
          68 / 120
        </Text>
        <Text textStyle="xs" color="neutral.10">
          SKUs below 18% margin floor
        </Text>
      </Flex>
      <Text textStyle="xs" color="neutral.11" flex="1" minWidth="200px">
        Hill's Science Diet 8% wholesale cost increase
      </Text>
    </Flex>
  </InlineCard>
);

const J2HouseBrandCard = () => (
  <InlineCard
    title="Substitution Risk"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    headerRight={
      <Badge size="2xs" colorPalette="warning">
        churn risk
      </Badge>
    }
  >
    <Flex alignItems="center" gap="200">
      <Text textStyle="xs" color="amber.11" fontWeight="semibold">
        ⚠
      </Text>
      <Text textStyle="xs" color="neutral.11" lineHeight="tall">
        Hill's customers have 74% repurchase rate. Substitution may risk churn
        on loyal customers.
      </Text>
    </Flex>
  </InlineCard>
);

// ─── Column definitions ─────────────────────────────────────────────────────

const statusPalettes: Record<string, string> = {
  published: "success",
  modified: "warning",
  unpublished: "neutral",
};

const trendIcons: Record<string, { symbol: string; color: string }> = {
  rising: { symbol: "↑", color: "green.11" },
  flat: { symbol: "—", color: "neutral.10" },
  declining: { symbol: "↓", color: "red.11" },
};

const baseColumns: DataTableColumnItem<Product>[] = [
  {
    id: "name",
    header: "Product",
    isRowHeader: true,
    accessor: (row) => (
      <Box>
        <Text textStyle="xs" fontWeight="medium" color="neutral.12">
          {row.name}
        </Text>
        <Text textStyle="xs" color="neutral.10" fontFamily="mono">
          {row.key}
        </Text>
      </Box>
    ),
  },
  {
    id: "productType",
    header: "Type",
    accessor: (row) => row.productType,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => (
      <Badge size="2xs" colorPalette={statusPalettes[row.status] as any}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "priceRange",
    header: "Price Range",
    accessor: (row) => row.priceRange,
  },
  {
    id: "variantCount",
    header: "Variants",
    accessor: (row) => row.variantCount,
  },
];

const j1ExtraColumns: DataTableColumnItem<Product>[] = [
  {
    id: "daysOnHand",
    header: "Days on Hand",
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        <ProvenanceIndicator
          agentName="PetSmart Commerce Intelligence"
          agentSource="petsmart"
          size="10px"
          reason={`${row.daysOnHand}d on hand from PetSmart's inventory system`}
        />
        <Text
          textStyle="xs"
          fontWeight={row.isAging ? "semibold" : "regular"}
          color={row.isAging ? "amber.11" : "neutral.12"}
        >
          {row.daysOnHand ?? "—"}d
        </Text>
      </Flex>
    ),
  },
  {
    id: "velocityTrend",
    header: "Velocity",
    accessor: (row) => {
      const trend = row.velocityTrend ? trendIcons[row.velocityTrend] : null;
      return (
        <Flex alignItems="center" gap="100">
          <ProvenanceIndicator
            agentName="PetSmart Commerce Intelligence"
            agentSource="petsmart"
            size="10px"
            reason="Sales velocity trend from PetSmart's analytics provider"
          />
          <Text textStyle="xs" color={trend?.color ?? "neutral.10"}>
            {trend?.symbol ?? "—"}
          </Text>
        </Flex>
      );
    },
  },
  {
    id: "marginHeadroom",
    header: "Margin %",
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        <ProvenanceIndicator
          agentName="PetSmart Commerce Intelligence"
          agentSource="petsmart"
          size="10px"
          reason="Margin calculated from PetSmart's supplier cost data and ct pricing"
        />
        <Text textStyle="xs" color="neutral.12">
          {row.marginHeadroom ?? "—"}%
        </Text>
      </Flex>
    ),
  },
  {
    id: "j1Actions",
    header: "",
    accessor: (row) =>
      row.isAging ? (
        <ActivationButton
          label="View inventory"
          agentSource="petsmart"
          data-tour="view-inventory-action"
        />
      ) : null,
  },
];

const j2ExtraColumns: DataTableColumnItem<Product>[] = [
  {
    id: "currentMargin",
    header: "Margin Now",
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        <ProvenanceIndicator
          agentName="PetSmart Commerce Intelligence"
          agentSource="petsmart"
          size="10px"
          reason={
            row.isHouseBrand
              ? `House-brand margin from PetSmart's cost data`
              : `Current margin after 8% cost increase, from PetSmart's supplier cost feed`
          }
        />
        <Text
          textStyle="xs"
          fontWeight="semibold"
          color={
            row.isHouseBrand
              ? "green.11"
              : row.belowFloor
                ? "red.11"
                : "neutral.12"
          }
        >
          {row.isHouseBrand ? row.houseBrandMargin : (row.currentMargin ?? "—")}
          %
        </Text>
      </Flex>
    ),
  },
  {
    id: "previousMargin",
    header: "Margin Was",
    accessor: (row) =>
      row.previousMargin != null ? (
        <Text textStyle="xs" color="neutral.10">
          {row.previousMargin}%
        </Text>
      ) : null,
  },
  {
    id: "floorStatus",
    header: "Floor",
    accessor: (row) => {
      const label = row.isHouseBrand
        ? "above floor"
        : row.belowFloor
          ? "below 18%"
          : "OK";
      const palette = row.isHouseBrand || !row.belowFloor ? "success" : "error";
      return (
        <Flex alignItems="center" gap="100">
          <ProvenanceIndicator
            agentName="PetSmart Commerce Intelligence"
            agentSource="petsmart"
            size="10px"
            reason="Margin floor assessment from PetSmart's cost data"
          />
          <Badge size="2xs" colorPalette={palette as any}>
            {label}
          </Badge>
        </Flex>
      );
    },
  },
  {
    id: "j2Actions",
    header: "",
    accessor: (row) =>
      row.belowFloor ? (
        <ActivationButton
          label="View response options"
          agentSource="petsmart"
          data-tour="view-response-action"
        />
      ) : null,
  },
];

const j3ExtraColumns: DataTableColumnItem<Product>[] = [
  {
    id: "matchedDiscount",
    header: "Discount",
    accessor: (row) =>
      row.matchedDiscount ? (
        <Flex alignItems="center" gap="100">
          <ProvenanceIndicator
            agentName="Promotions Agent"
            agentSource="ct"
            size="10px"
            reason="Discount match from ct predicate evaluation"
          />
          <Text textStyle="xs" color="neutral.12">
            {row.matchedDiscount}
          </Text>
        </Flex>
      ) : null,
  },
  {
    id: "effectiveDiscount",
    header: "Eff. %",
    accessor: (row) =>
      row.effectiveDiscount != null ? (
        <Flex alignItems="center" gap="100">
          <ProvenanceIndicator
            agentName="Promotions Agent"
            agentSource="ct"
            size="10px"
            reason={`${row.effectiveDiscount}% effective discount after stacking rules`}
          />
          <Text textStyle="xs" color="neutral.12">
            {row.effectiveDiscount}%
          </Text>
        </Flex>
      ) : null,
  },
  {
    id: "badgeStatus",
    header: "Badge",
    accessor: (row) =>
      row.hasBadge != null ? (
        <Flex alignItems="center" gap="100">
          <ProvenanceIndicator
            agentName="Promotions Agent"
            agentSource="ct"
            size="10px"
            reason={
              row.hasBadge
                ? "Badge attribute is set on this product"
                : "No promotional badge set — customers won't see the offer"
            }
          />
          <Badge size="2xs" colorPalette={row.hasBadge ? "success" : "error"}>
            {row.hasBadge ? "set" : "missing"}
          </Badge>
        </Flex>
      ) : null,
  },
  {
    id: "j3Actions",
    header: "",
    accessor: (row) =>
      row.hasBadge === false ? (
        <ActivationButton
          label="Set badge"
          agentSource="ct"
          data-tour="set-badge-action"
        />
      ) : null,
  },
];

// ─── ProductList view ───────────────────────────────────────────────────────

export const ProductList = () => {
  const { activeJourney } = useJourney();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const journeyId = activeJourney?.id ?? null;
  const filter = searchParams.get("filter") ?? undefined;

  const products = useMemo(
    () => getProductsForJourney(journeyId, filter),
    [journeyId, filter]
  );

  // Journey-specific columns
  const columns = useMemo(() => {
    const extra =
      journeyId === 1
        ? j1ExtraColumns
        : journeyId === 2
          ? j2ExtraColumns
          : journeyId === 3
            ? j3ExtraColumns
            : [];
    return [...baseColumns, ...extra];
  }, [journeyId]);

  // Build table rows
  const rows = products.map((p) => ({ ...p, id: p.id }));

  // Subtitle and filter context
  const subtitle =
    journeyId === 1
      ? "Dog Toys > Outdoor"
      : journeyId === 2 && filter === "house-brand"
        ? "House Brand Alternatives"
        : journeyId === 2
          ? "Hill's Science Diet"
          : journeyId === 3
            ? "Back to School Pet Prep — Campaign Coverage"
            : "PetSmart US Retail";

  const toolbarActions =
    journeyId === 2 && filter !== "house-brand" ? (
      <ActivationButton
        label="Compare house-brand alternatives"
        agentSource="petsmart"
      />
    ) : journeyId === 2 && filter === "house-brand" ? (
      <ActivationButton
        label="Model scenarios"
        agentSource="petsmart"
        data-tour="model-scenarios-btn"
      />
    ) : (
      <Button variant="solid" colorPalette="primary" size="2xs">
        Add product
      </Button>
    );

  return (
    <Box>
      <PageHeader
        title="Products"
        subtitle={subtitle}
        actions={toolbarActions}
      />

      <Box p="300">
        {/* Inline render target — agent summary cards */}
        {journeyId && (
          <Box mb="400" data-tour="inline-slot">
            <InlineSlot direction="row">
              {journeyId === 1 && <J1SummaryCard />}
              {journeyId === 2 && filter !== "house-brand" && <J2SummaryCard />}
              {journeyId === 2 && filter === "house-brand" && (
                <J2HouseBrandCard />
              )}
            </InlineSlot>
          </Box>
        )}

        {/* Filter bar */}
        <Flex gap="200" mb="300" alignItems="center" wrap="wrap">
          <SearchInput
            placeholder="Search products..."
            aria-label="Search products"
            size="sm"
            width="240px"
          />
          {journeyId && (
            <Flex alignItems="center" gap="100" ml="auto">
              <ProvenanceIndicator
                agentName="PetSmart Commerce Intelligence"
                agentSource="petsmart"
                reason="Extra columns and summary data from PetSmart's inventory and analytics systems"
                data-tour="provenance-demo"
              />
              <Text textStyle="xs" color="neutral.10">
                PetSmart Commerce Intelligence
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Product table */}
        <Box data-tour="product-table">
          <DataTable.Root
            columns={columns}
            rows={rows}
            density="condensed"
            allowsPinning={false}
            onRowClick={(row) => navigate(`/products/${row.id}`)}
          >
            <DataTable.Table>
              <DataTable.Header />
              <DataTable.Body>
                {(row) => <DataTable.Row row={row} />}
              </DataTable.Body>
            </DataTable.Table>
          </DataTable.Root>
        </Box>
      </Box>
    </Box>
  );
};
