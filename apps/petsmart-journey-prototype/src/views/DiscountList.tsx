import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  DataTable,
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
    headerRight={
      <Badge size="2xs" colorPalette="error">
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
  product: "success",
  code: "warning",
};

const performancePalettes: Record<string, string> = {
  "on-target": "success",
  "above-target": "success",
  underperforming: "error",
};

const baseColumns: DataTableColumnItem<Discount>[] = [
  {
    id: "name",
    header: "Discount",
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
      <Badge size="2xs" colorPalette={row.isActive ? "success" : "neutral"}>
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

// ─── DiscountList view ──────────────────────────────────────────────────────

export const DiscountList = () => {
  const { activeJourney } = useJourney();
  const navigate = useNavigate();
  const journeyId = activeJourney?.id ?? null;

  const columns =
    journeyId === 4 ? [...baseColumns, ...j4ExtraColumns] : baseColumns;

  const rows = allDiscounts.map((d) => ({ ...d }));

  return (
    <Box>
      <PageHeader
        title="Discounts"
        subtitle={
          journeyId === 4
            ? "Back to School Pet Prep — Campaign Review"
            : "Cart Discounts"
        }
        actions={
          <Button variant="solid" colorPalette="primary" size="2xs">
            Add discount
          </Button>
        }
      />

      <Box p="300">
        {/* J4: Inline analytics + diagnosis */}
        {journeyId === 4 && (
          <Box mb="400" data-tour="inline-slot">
            <InlineSlot direction="column" gap="200">
              <J4AnalyticsCard />
              <J4DiagnosisCard />
            </InlineSlot>
          </Box>
        )}

        {/* Discount table */}
        <Box
          data-tour="discount-table"
          css={{
            "& th, & td": {
              paddingTop: "var(--nimbus-sizes-100) !important",
              paddingBottom: "var(--nimbus-sizes-100) !important",
              fontSize: "var(--nimbus-font-sizes-xs) !important",
            },
          }}
        >
          <DataTable.Root
            columns={columns}
            rows={rows}
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
      </Box>
    </Box>
  );
};
