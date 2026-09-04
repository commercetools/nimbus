import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { useJourney } from "../components/JourneyContext";
import { allDiscounts, type Discount } from "../data/discounts";

// ─── J4: Campaign Analytics Card ────────────────────────────────────────────

const J4AnalyticsCard = () => (
  <InlineCard
    title="Campaign Performance — Back to School Pet Prep"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    reason="Redemption rates from commercetools order data, matched against campaign targets set by the merchandising team"
    data-tour="inline-slot"
    headerRight={
      <Badge size="2xs" colorPalette="warning">
        10d running · 11d left
      </Badge>
    }
  >
    <Flex gap="300" wrap="wrap">
      <Flex
        alignItems="baseline"
        gap="100"
        bg="green.2"
        px="200"
        py="50"
        borderRadius="100"
      >
        <Text textStyle="xs" color="neutral.10">
          Collars 10%
        </Text>
        <Text textStyle="xs" fontWeight="bold" color="green.11">
          14%
        </Text>
        <Text textStyle="xs" color="green.10">
          ✓ on target
        </Text>
      </Flex>
      <Flex
        alignItems="baseline"
        gap="100"
        bg="green.2"
        px="200"
        py="50"
        borderRadius="100"
      >
        <Text textStyle="xs" color="neutral.10">
          Crates 20%
        </Text>
        <Text textStyle="xs" fontWeight="bold" color="green.11">
          17%
        </Text>
        <Text textStyle="xs" color="green.10">
          ✓ above target
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
        <Text textStyle="xs" color="neutral.10">
          Leashes 15%
        </Text>
        <Text textStyle="xs" fontWeight="bold" color="red.11">
          3%
        </Text>
        <Text textStyle="xs" color="red.10">
          ⚠ 3% vs 15% target
        </Text>
      </Flex>
    </Flex>
  </InlineCard>
);

const J4DiagnosisCard = () => (
  <InlineCard
    title="Preliminary Diagnosis — Leashes"
    agentName="PetSmart Commerce Intelligence"
    agentSource="petsmart"
    reason="Root cause analysis combining PetSmart's web analytics (page impressions) and competitive intelligence feed (competitor promotions)"
    headerRight={
      <Badge size="2xs" colorPalette="critical">
        2 factors identified
      </Badge>
    }
  >
    <Flex direction="column" gap="150" data-tour="diagnosis-card">
      <Flex alignItems="center" gap="150">
        <ProvenanceBadge size="12px" agentSource="petsmart" />
        <Text textStyle="xs" color="neutral.11">
          Page impressions on leash products are{" "}
          <Text as="span" fontWeight="semibold" color="red.11">
            60% below category average
          </Text>
        </Text>
        <Badge size="2xs" colorPalette="neutral">
          PetSmart Analytics
        </Badge>
      </Flex>
      <Flex alignItems="center" gap="150">
        <ProvenanceBadge size="12px" agentSource="petsmart" />
        <Text textStyle="xs" color="neutral.11">
          Competitor PetCo launched{" "}
          <Text as="span" fontWeight="semibold" color="red.11">
            20% off leashes
          </Text>{" "}
          5 days ago
        </Text>
        <Badge size="2xs" colorPalette="neutral">
          Competitive Feed
        </Badge>
      </Flex>
      <Box
        bg="amber.2"
        px="200"
        py="100"
        borderRadius="100"
        borderLeftWidth="2px"
        borderColor="amber.8"
        mt="50"
      >
        <Text textStyle="xs" color="amber.12">
          Conversion rate on viewed products is normal — the problem is
          visibility, not appeal.
        </Text>
      </Box>
    </Flex>
  </InlineCard>
);

// ─── Columns ────────────────────────────────────────────────────────────────

const typePalettes: Record<string, string> = {
  cart: "info",
  product: "positive",
  code: "warning",
};

const performancePalettes: Record<string, string> = {
  "on-target": "positive",
  "above-target": "positive",
  underperforming: "critical",
};

const baseColumns: DataTableColumnItem<Discount>[] = [
  {
    id: "name",
    header: "Discount",
    isRowHeader: true,
    accessor: (row) => (
      <Text textStyle="xs" fontWeight="medium" color="neutral.12">
        {row.name}
      </Text>
    ),
  },
  {
    id: "type",
    header: "Type",
    accessor: (row) => (
      <Badge size="2xs" colorPalette={typePalettes[row.type] as any}>
        {row.typeLabel}
      </Badge>
    ),
  },
  {
    id: "value",
    header: "Value",
    accessor: (row) => (
      <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
        {row.value}
      </Text>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => (
      <Badge size="2xs" colorPalette={row.isActive ? "positive" : "neutral"}>
        {row.isActive ? "active" : "inactive"}
      </Badge>
    ),
  },
  {
    id: "validRange",
    header: "Valid",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.10">
        {row.validFrom} → {row.validUntil}
      </Text>
    ),
  },
  {
    id: "stores",
    header: "Stores",
    accessor: (row) => (
      <Text textStyle="xs" color="neutral.10">
        {row.stores.join(", ")}
      </Text>
    ),
  },
];

const j4ExtraColumns: DataTableColumnItem<Discount>[] = [
  {
    id: "redemption",
    header: "Redemption",
    accessor: (row) =>
      row.redemptionRate != null ? (
        <Flex alignItems="center" gap="100">
          <ProvenanceBadge size="12px" agentSource="petsmart" />
          <Text
            textStyle="xs"
            fontWeight="bold"
            color={
              row.performanceStatus === "underperforming"
                ? "red.11"
                : "green.11"
            }
          >
            {row.redemptionRate}%
          </Text>
          <Text textStyle="xs" color="neutral.10">
            / {row.redemptionTarget}%
          </Text>
        </Flex>
      ) : null,
  },
  {
    id: "performance",
    header: "Performance",
    accessor: (row) =>
      row.performanceStatus ? (
        <Badge
          size="2xs"
          colorPalette={performancePalettes[row.performanceStatus] as any}
        >
          {row.performanceStatus.replace("-", " ")}
        </Badge>
      ) : null,
  },
  {
    id: "j4Actions",
    header: "",
    accessor: (row) =>
      row.performanceStatus === "underperforming" ? (
        <ActivationButton
          label="Diagnose underperformance"
          agentSource="petsmart"
          data-tour="diagnose-action"
        />
      ) : null,
  },
];

// ─── Tab types ─────────────────────────────────────────────────────────────

type DiscountTab = "all" | "cart" | "product" | "code";

const tabs: Array<{ id: DiscountTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "cart", label: "Cart Discounts" },
  { id: "product", label: "Product Discounts" },
  { id: "code", label: "Discount Codes" },
];

// ─── DiscountList view ──────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export const DiscountList = () => {
  const { activeJourney } = useJourney();
  const navigate = useNavigate();
  const journeyId = activeJourney?.id ?? null;

  const [activeTab, setActiveTab] = useState<DiscountTab>("all");
  const [search, setSearch] = useState("");

  const columns =
    journeyId === 4 ? [...baseColumns, ...j4ExtraColumns] : baseColumns;

  const filteredRows = useMemo(() => {
    let rows = allDiscounts;
    if (activeTab !== "all") {
      rows = rows.filter((d) => d.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.key.toLowerCase().includes(q) ||
          d.value.toLowerCase().includes(q)
      );
    }
    return rows.map((d) => ({ ...d }));
  }, [activeTab, search]);

  const subtitleText =
    journeyId === 4
      ? "Back to School Pet Prep — Campaign Review"
      : activeTab === "all"
        ? "All Discounts"
        : (tabs.find((t) => t.id === activeTab)?.label ?? "Discounts");

  return (
    <Box>
      <PageHeader
        title="Discounts"
        subtitle={subtitleText}
        actions={
          <Button variant="solid" colorPalette="primary" size="2xs">
            Add discount
          </Button>
        }
      />

      <Box p="300">
        {/* J4: Inline analytics + diagnosis */}
        {journeyId === 4 && (
          <Box mb="400">
            <InlineSlot direction="column" gap="200">
              <J4AnalyticsCard />
              <J4DiagnosisCard />
            </InlineSlot>
          </Box>
        )}

        {/* Tabs */}
        <Flex gap="100" mb="300">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "solid" : "ghost"}
              colorPalette={activeTab === tab.id ? "primary" : undefined}
              size="2xs"
              onPress={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </Flex>

        {/* Search + filter bar */}
        <Flex gap="200" mb="300" alignItems="center" wrap="wrap">
          <SearchInput
            placeholder="Search discounts..."
            aria-label="Search discounts"
            size="sm"
            width="240px"
            value={search}
            onChange={(val) => setSearch(val)}
          />
          <Text textStyle="xs" color="neutral.9" ml="auto">
            {filteredRows.length} discount{filteredRows.length !== 1 ? "s" : ""}
          </Text>
        </Flex>

        {/* Discount table */}
        <Box data-tour="discount-table">
          <DataTable.Root
            columns={columns}
            rows={filteredRows}
            density="condensed"
            onRowClick={(row) => navigate(`/discounts/${row.id}`)}
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

        {/* Pagination */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mt="300"
          pt="200"
          borderTopWidth="1px"
          borderColor="neutral.4"
        >
          <Text textStyle="xs" color="neutral.9">
            Showing {Math.min(filteredRows.length, PAGE_SIZE)} of{" "}
            {filteredRows.length} results
          </Text>
          <Flex gap="100">
            <Button variant="ghost" size="2xs" isDisabled>
              Previous
            </Button>
            <Button
              variant="ghost"
              size="2xs"
              isDisabled={filteredRows.length <= PAGE_SIZE}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
