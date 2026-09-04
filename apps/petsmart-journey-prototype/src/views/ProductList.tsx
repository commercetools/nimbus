import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { useJourney } from "../components/JourneyContext";
import { getProductsForJourney, type Product } from "../data/products";

// ─── Journey-specific inline summary cards ──────────────────────────────────

const J1SummaryCard = () => (
  <InlineCard
    title="Category Inventory Summary"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    headerRight={
      <Badge size="xs" colorPalette="warning">
        47 SKUs aging
      </Badge>
    }
  >
    <Flex gap="400" alignItems="center" wrap="wrap">
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
          <Text textStyle="sm" fontWeight="bold" color="red.11">
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
          <Text textStyle="sm" fontWeight="bold" color="neutral.11">
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
      <Badge size="xs" colorPalette="error">
        68 below floor
      </Badge>
    }
  >
    <Flex gap="400" alignItems="center" wrap="wrap">
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
      <Badge size="xs" colorPalette="warning">
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
        <Text textStyle="sm" fontWeight="medium" color="neutral.12">
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
      <Badge size="xs" colorPalette={statusPalettes[row.status] as any}>
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
        {row.isAging && <ProvenanceBadge size="8px" agentSource="petsmart" />}
        <Text
          textStyle="sm"
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
      return trend ? (
        <Text textStyle="sm" color={trend.color}>
          {trend.symbol}
        </Text>
      ) : (
        <Text textStyle="sm" color="neutral.10">
          —
        </Text>
      );
    },
  },
  {
    id: "marginHeadroom",
    header: "Margin %",
    accessor: (row) => (
      <Text textStyle="sm" color="neutral.12">
        {row.marginHeadroom ?? "—"}%
      </Text>
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
    accessor: (row) => {
      if (row.isHouseBrand) {
        return (
          <Flex alignItems="center" gap="100">
            <ProvenanceBadge size="8px" agentSource="petsmart" />
            <Text textStyle="sm" fontWeight="semibold" color="green.11">
              {row.houseBrandMargin}%
            </Text>
          </Flex>
        );
      }
      return (
        <Flex alignItems="center" gap="100">
          {row.belowFloor && (
            <ProvenanceBadge size="8px" agentSource="petsmart" />
          )}
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color={row.belowFloor ? "red.11" : "neutral.12"}
          >
            {row.currentMargin ?? "—"}%
          </Text>
        </Flex>
      );
    },
  },
  {
    id: "previousMargin",
    header: "Margin Was",
    accessor: (row) =>
      row.previousMargin != null ? (
        <Text textStyle="sm" color="neutral.10">
          {row.previousMargin}%
        </Text>
      ) : null,
  },
  {
    id: "floorStatus",
    header: "Floor",
    accessor: (row) => {
      if (row.isHouseBrand) {
        return (
          <Badge size="xs" colorPalette="success">
            above floor
          </Badge>
        );
      }
      return row.belowFloor ? (
        <Badge size="xs" colorPalette="error">
          below 18%
        </Badge>
      ) : (
        <Badge size="xs" colorPalette="success">
          OK
        </Badge>
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
          <ProvenanceBadge size="8px" agentSource="ct" />
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
        <Text textStyle="sm" color="neutral.12">
          {row.effectiveDiscount}%
        </Text>
      ) : null,
  },
  {
    id: "badgeStatus",
    header: "Badge",
    accessor: (row) =>
      row.hasBadge != null ? (
        row.hasBadge ? (
          <Badge size="xs" colorPalette="success">
            set
          </Badge>
        ) : (
          <Badge size="xs" colorPalette="error">
            missing
          </Badge>
        )
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
      <Button variant="solid" size="sm">
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

      <Box p="400">
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
                Agent-enriched view
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
