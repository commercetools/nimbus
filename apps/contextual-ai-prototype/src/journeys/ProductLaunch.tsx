import { useState } from "react";
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
  Icon,
  Tree,
  DataTable,
  Grid,
} from "@commercetools/nimbus";
import type { DataTableColumnItem, DataTableRowItem } from "@commercetools/nimbus";
import { CheckCircle } from "@commercetools/nimbus-icons";
import {
  ChartThemeProvider,
  ResponsiveContainer,
  WaffleChart,
} from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ActivationButton } from "../components/ActivationButton";

// ─── Data ───────────────────────────────────────────────────────────────────

const readinessBreakdown = [
  { category: "Categories · 10 pts", value: 10 },
  { category: "Names · 12 pts", value: 12 },
  { category: "Descriptions · 5 pts", value: 5 },
  { category: "Images · 8 pts", value: 8 },
  { category: "Pricing · 10 pts", value: 10 },
  { category: "Variants · 6 pts", value: 6 },
  { category: "SEO · 2 pts", value: 2 },
  { category: "Attributes · 15 pts", value: 15 },
];

const checklist = [
  { status: "done" as const, label: "Categories", detail: "Electronics > Mobile Phones" },
  { status: "done" as const, label: "Name (5 locales)", detail: "Complete" },
  { status: "missing" as const, label: "Descriptions", detail: "2 of 5 locales", suggestion: "Use ✦ Translate to generate for remaining 3 locales" },
  { status: "warn" as const, label: "Images", detail: "6 uploaded, unordered", suggestion: "Reorder suggested: lifestyle shots perform 2.3x better as hero" },
  { status: "done" as const, label: "Pricing", detail: "Set for 3 markets" },
  { status: "warn" as const, label: "Variants", detail: "3 of est. 8", suggestion: "3 variant suggestions available: Navy/256GB, Green/128GB, White/512GB" },
  { status: "missing" as const, label: "SEO metadata", detail: "Missing", suggestion: "Use ✦ Generate SEO in toolbar to create titles and descriptions" },
  { status: "done" as const, label: "Attributes", detail: "12/12 required" },
];

const statusIcon = {
  done: { symbol: "✓", color: "green.11" as const },
  warn: { symbol: "⚠", color: "amber.11" as const },
  missing: { symbol: "✗", color: "red.11" as const },
};

const chartColors = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

// Variant rows: 3 API + 3 AI-suggested
type VariantRow = {
  id: string;
  sku: string;
  color: string;
  storage: string;
  priceEur: string;
  inventory: number;
  images: number;
  status: string;
  isSuggested?: boolean;
  reason?: string;
};

const existingVariants: VariantRow[] = [
  { id: "v1", sku: "GS25U-BLK-128", color: "Black", storage: "128GB", priceEur: "€899", inventory: 342, images: 4, status: "Published" },
  { id: "v2", sku: "GS25U-BLK-256", color: "Black", storage: "256GB", priceEur: "€999", inventory: 187, images: 4, status: "Published" },
  { id: "v3", sku: "GS25U-WHT-128", color: "White", storage: "128GB", priceEur: "€899", inventory: 256, images: 3, status: "Published" },
];

const suggestedVariants: VariantRow[] = [
  { id: "s1", sku: "GS25U-NAV-256", color: "Navy", storage: "256GB", priceEur: "€999", inventory: 0, images: 0, status: "Draft", isSuggested: true, reason: "Top seller DE/FR" },
  { id: "s2", sku: "GS25U-GRN-128", color: "Green", storage: "128GB", priceEur: "€899", inventory: 0, images: 0, status: "Draft", isSuggested: true, reason: "Trending, 0 in catalog" },
  { id: "s3", sku: "GS25U-WHT-512", color: "White", storage: "512GB", priceEur: "€1,099", inventory: 0, images: 0, status: "Draft", isSuggested: true, reason: "High margin, 12% EU" },
];

const allVariantRows: DataTableRowItem<VariantRow>[] = [
  ...existingVariants,
  ...suggestedVariants,
];

const variantColumns: DataTableColumnItem<VariantRow>[] = [
  {
    id: "variant",
    header: "Variant",
    isRowHeader: true,
    accessor: (row) => (
      <Flex alignItems="center" gap="100">
        {row.isSuggested && (
          <ProvenanceIndicator agentName="Product Enrichment Agent" reason={row.reason} />
        )}
        <Text textStyle="xs" fontWeight="medium" color={row.isSuggested ? "indigo.11" : "neutral.12"}>
          {row.color} / {row.storage}
        </Text>
      </Flex>
    ),
  },
  {
    id: "sku",
    header: "SKU",
    accessor: (row) => <Text textStyle="xs" color="neutral.11">{row.sku}</Text>,
  },
  {
    id: "price",
    header: "Price",
    accessor: (row) => <Text textStyle="xs" fontWeight="medium" color="neutral.12">{row.priceEur}</Text>,
  },
  {
    id: "inventory",
    header: "Inventory",
    accessor: (row) => (
      <Text textStyle="xs" color={row.inventory === 0 ? "neutral.8" : "neutral.11"}>
        {row.inventory}
      </Text>
    ),
  },
  {
    id: "status",
    header: "",
    accessor: (row) => {
      if (row.isSuggested) {
        return <Button variant="outline" size="2xs">Create</Button>;
      }
      return <Badge size="2xs" colorPalette="positive">{row.status}</Badge>;
    },
  },
];

// Product attributes
const attributes = [
  { name: "Display", value: '6.9" Dynamic AMOLED 2X, 3120×1440', complete: true },
  { name: "Battery", value: "5,000 mAh, 45W wired charging", complete: true },
  { name: "Connectivity", value: "5G, Wi-Fi 7, Bluetooth 5.4, NFC", complete: true },
  { name: "Weight", value: "218g", complete: true },
  { name: "Processor", value: "Snapdragon 8 Elite for Galaxy", complete: true },
  { name: "RAM", value: "12GB", complete: true },
  { name: "OS", value: null as string | null, suggested: "Android 16 with One UI 7.1" },
  { name: "Water resistance", value: null as string | null, suggested: "IP68" },
  { name: "Camera (main)", value: null as string | null, suggested: "200MP wide + 50MP ultra-wide + 50MP telephoto" },
];

// Search keywords
const existingKeywords = ["galaxy", "s25", "ultra", "samsung"];
const suggestedKeywords = [
  { term: "5g phone", source: "Search volume analysis" },
  { term: "amoled display", source: "Product attributes" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ProductLaunch = () => {
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);

  return (
    <Box height="100%" overflow="auto">
      <PageHeader
        breadcrumbs={[
          { label: "Products", href: "#" },
          { label: "Galaxy S25 Ultra" },
        ]}
        title="Galaxy S25 Ultra"
        subtitle="SKU-GS25U-001"
        actions={
          <>
            <Button variant="ghost" size="2xs">
              Revert
            </Button>
            <Button variant="solid" colorPalette="primary" size="2xs">
              Publish
            </Button>
            <Flex
              alignItems="center"
              gap="100"
              px="200"
              py="100"
              borderRadius="200"
              borderWidth="1px"
              borderColor="indigo.6"
              data-tour="generate-seo"
              cursor="pointer"
              _hover={{ bg: "indigo.3" }}
              transition="background 150ms"
            >
              <ProvenanceIndicator agentName="Product Enrichment Agent" reason="Generate SEO titles and descriptions for all configured locales" />
              <Text textStyle="xs" fontWeight="medium" color="indigo.11">
                Generate SEO
              </Text>
            </Flex>
          </>
        }
      />

      {/* ── Two-column body ─────────────────────────────────────────── */}
      <Flex gap="300" p="300" alignItems="flex-start">
        {/* ── Left column (~65%) ─────────────────────────────────────── */}
        <Stack gap="300" flex="2" minWidth="0">
          {/* General info form */}
          <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
            <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="300">
              General Information
            </Text>

            <Grid gridTemplateColumns="1fr 1fr" gap="300">
              <FormField.Root size="sm">
                <FormField.Label>Product name (EN)</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" defaultValue="Galaxy S25 Ultra" />
                </FormField.Input>
              </FormField.Root>

              <FormField.Root size="sm">
                <FormField.Label>
                  <Flex alignItems="center" gap="200" width="100%">
                    <Text>Description (EN)</Text>
                    <Box flex="1" />
                    <ActivationButton label="Translate" data-tour="translate-btn" />
                  </Flex>
                </FormField.Label>
                <FormField.Input>
                  <TextInput
                    size="sm"
                    defaultValue='The Galaxy S25 Ultra features a stunning 6.9" Dynamic AMOLED...'
                  />
                </FormField.Input>
              </FormField.Root>

              <FormField.Root size="sm">
                <FormField.Label>Product key</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" defaultValue="galaxy-s25-ultra" />
                </FormField.Input>
              </FormField.Root>

              <FormField.Root size="sm">
                <FormField.Label>External ID</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" defaultValue="EXT-GS25U-2026" />
                </FormField.Input>
              </FormField.Root>

              <FormField.Root size="sm">
                <FormField.Label>Tax category</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" defaultValue="Standard Rate (19%)" />
                </FormField.Input>
              </FormField.Root>

              <FormField.Root size="sm">
                <FormField.Label>Price mode</FormField.Label>
                <FormField.Input>
                  <TextInput size="sm" defaultValue="Embedded" />
                </FormField.Input>
              </FormField.Root>
            </Grid>
          </Box>

          {/* Inline widgets: Readiness + Product Info */}
          <InlineSlot direction="row" gap="300" data-tour="inline-slot">
            {/* Readiness Card */}
            <InlineCard
              title="Readiness"
              agentName="Product Enrichment Agent"
              headerRight={
                <Text textStyle="lg" fontWeight="bold" color="amber.11">
                  68%
                </Text>
              }
            >
              <Box height="2px" bg="neutral.4" borderRadius="full" mb="200" overflow="hidden">
                <Box
                  height="100%"
                  width="0%"
                  bg="amber.9"
                  borderRadius="full"
                  css={{ animation: "progressGrow 800ms ease-out 300ms forwards" }}
                />
              </Box>

              <Flex gap="200">
                <Stack gap="100" flex="1">
                  {checklist.map((item, i) => (
                    <Flex key={item.label} alignItems="center" gap="150">
                      <Box
                        width="6px"
                        height="6px"
                        borderRadius="full"
                        flexShrink={0}
                        css={{ background: chartColors[i] ?? "#999" }}
                      />
                      <Text textStyle="xs" fontWeight="bold" color={statusIcon[item.status].color}>
                        {statusIcon[item.status].symbol}
                      </Text>
                      <Text textStyle="xs" color="neutral.11">{item.label}</Text>
                      {item.suggestion && (
                        <ProvenanceIndicator agentName="Product Enrichment Agent" reason={item.suggestion} size="8px" />
                      )}
                    </Flex>
                  ))}
                </Stack>
                <Box flex="1" minWidth="140px" data-tour="readiness-chart">
                  <Text textStyle="xs" color="neutral.9" mb="100">Completion by area</Text>
                  <ChartThemeProvider>
                    <ResponsiveContainer height={140}>
                      {(w, h) => (
                        <WaffleChart
                          width={w}
                          height={h}
                          data={readinessBreakdown}
                          cells={10}
                          ariaLabel="Product readiness: completion by area"
                        />
                      )}
                    </ResponsiveContainer>
                  </ChartThemeProvider>
                </Box>
              </Flex>
            </InlineCard>

            {/* Metadata sidebar card */}
            <InlineCard title="Product Info" agentName="Product Enrichment Agent">
              <Stack gap="150">
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.9">Product type</Text>
                  <Text textStyle="xs" fontWeight="medium" color="neutral.12">Electronics</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.9">Created</Text>
                  <Text textStyle="xs" fontWeight="medium" color="neutral.12">Aug 15, 2026</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.9">Modified</Text>
                  <Text textStyle="xs" fontWeight="medium" color="neutral.12">Sep 1, 2026</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.9">Master variant</Text>
                  <Text textStyle="xs" fontWeight="medium" color="neutral.12">GS25U-BLK-128</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textStyle="xs" color="neutral.9">Published</Text>
                  <Badge size="2xs" colorPalette="positive">Yes</Badge>
                </Flex>
              </Stack>
            </InlineCard>
          </InlineSlot>

          {/* Variants DataTable */}
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="neutral.6"
            borderRadius="200"
            overflow="hidden"
            data-tour="variants-table"
          >
            <Flex
              alignItems="center"
              gap="200"
              px="300"
              py="150"
              borderBottomWidth="1px"
              borderColor="neutral.4"
            >
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                Variants
              </Text>
              <Text textStyle="xs" color="neutral.9">3 existing</Text>
              <Box flex="1" />
              <Flex alignItems="center" gap="100">
                <ProvenanceIndicator agentName="Product Enrichment Agent" />
                <Text textStyle="xs" color="indigo.9" fontWeight="medium" data-tour="variants-suggested">
                  +3 suggested
                </Text>
              </Flex>
            </Flex>

            <DataTable.Root
              columns={variantColumns}
              rows={allVariantRows}
              density="condensed"
              allowsPinning={false}
              allowsExpandColumn={false}
              renderNestedContent={(row) => {
                if (!row.isSuggested) {
                  return (
                    <Box px="300" py="150" bg="neutral.2">
                      <Text textStyle="xs" color="neutral.11">
                        Variant details for {row.sku}
                      </Text>
                    </Box>
                  );
                }
                return (
                  <Box px="300" py="150" bg="indigo.2">
                    <Flex alignItems="center" gap="150" mb="100">
                      <ProvenanceIndicator agentName="Product Enrichment Agent" />
                      <Text textStyle="xs" fontWeight="medium" color="indigo.9">
                        Product Enrichment Agent
                      </Text>
                    </Flex>
                    <Text textStyle="xs" color="neutral.12">
                      Suggested because: {row.reason}. Based on market analysis of EU catalog gaps and trending search data.
                    </Text>
                  </Box>
                );
              }}
            >
              <DataTable.Table>
                <DataTable.Header />
                <DataTable.Body>
                  {(row) => (
                    <DataTable.Row
                      row={row}
                      css={row.isSuggested ? { background: "var(--nimbus-colors-indigo-2)" } : undefined}
                    />
                  )}
                </DataTable.Body>
              </DataTable.Table>
            </DataTable.Root>
          </Box>
        </Stack>

        {/* ── Right column (~35%) ──────────────────────────────────────── */}
        <Stack gap="300" flex="1" minWidth="260px">
          {/* Categories tree */}
          <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
            <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="200">
              Categories
            </Text>
            <Tree.Root
              size="sm"
              aria-label="Product categories"
              defaultExpandedKeys={["electronics", "accessories"]}
              selectionMode="multiple"
              defaultSelectedKeys={["mobile-phones"]}
              data-tour="category-tree"
            >
              <Tree.Item id="electronics" textValue="Electronics">
                <Tree.ItemContent>
                  <Tree.Indicator />
                  <Text textStyle="xs" color="neutral.12">Electronics</Text>
                </Tree.ItemContent>

                <Tree.Item id="mobile-phones" textValue="Mobile Phones">
                  <Tree.ItemContent>
                    <Tree.Indicator />
                    <Flex alignItems="center" gap="150" flex="1">
                      <Text textStyle="xs" fontWeight="medium" color="neutral.12">
                        Mobile Phones
                      </Text>
                      <Icon as={CheckCircle} size="2xs" color="green.9" />
                    </Flex>
                  </Tree.ItemContent>
                </Tree.Item>

                <Tree.Item id="smartphones" textValue="Smartphones (suggested)">
                  <Tree.ItemContent>
                    <Tree.Indicator />
                    <Flex alignItems="center" gap="150" flex="1">
                      <ProvenanceIndicator agentName="Product Enrichment Agent" confidence={78} reason="Products with 5G + AMOLED display are 78% categorized here" />
                      <Text textStyle="xs" color="indigo.11">Smartphones</Text>
                      <Badge size="2xs" colorPalette="info" variant="subtle">78%</Badge>
                    </Flex>
                  </Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>

              <Tree.Item id="accessories" textValue="Accessories">
                <Tree.ItemContent>
                  <Tree.Indicator />
                  <Text textStyle="xs" color="neutral.12">Accessories</Text>
                </Tree.ItemContent>

                <Tree.Item id="phone-cases" textValue="Phone Cases (suggested)">
                  <Tree.ItemContent>
                    <Tree.Indicator />
                    <Flex alignItems="center" gap="150" flex="1">
                      <ProvenanceIndicator agentName="Product Enrichment Agent" confidence={67} reason="Cross-sell category: 34% of phone buyers also buy cases" />
                      <Text textStyle="xs" color="indigo.11">Phone Cases</Text>
                      <Badge size="2xs" colorPalette="info" variant="subtle">67%</Badge>
                    </Flex>
                  </Tree.ItemContent>
                </Tree.Item>
              </Tree.Item>
            </Tree.Root>
          </Box>

          {/* Product attributes */}
          <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
            <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="200">
              Attributes
            </Text>
            <Stack gap="0">
              {attributes.map((attr, i) => (
                <Flex
                  key={attr.name}
                  py="100"
                  px="200"
                  alignItems="center"
                  gap="200"
                  borderBottomWidth={i < attributes.length - 1 ? "1px" : "0"}
                  borderColor="neutral.3"
                  _hover={{ bg: "neutral.2" }}
                  transition="background 100ms"
                >
                  <Text textStyle="xs" color="neutral.9" minWidth="100px" flexShrink={0}>
                    {attr.name}
                  </Text>
                  {attr.value ? (
                    <Text textStyle="xs" color="neutral.12" flex="1">
                      {attr.value}
                    </Text>
                  ) : (
                    <Flex alignItems="center" gap="100" flex="1">
                      <ProvenanceIndicator agentName="Product Enrichment Agent" reason="Inferred from manufacturer spec sheet and similar products in catalog" />
                      <Text textStyle="xs" fontWeight="medium" color="indigo.11">
                        {attr.suggested}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Stack>
          </Box>

          {/* Search keywords */}
          <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
            <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="200">
              Search Keywords
            </Text>

            <Flex gap="150" flexWrap="wrap" mb="200">
              {existingKeywords.map((kw) => (
                <Badge key={kw} size="2xs" colorPalette="neutral">{kw}</Badge>
              ))}
            </Flex>

            <Flex alignItems="center" gap="100" mb="150">
              <ProvenanceIndicator agentName="Product Enrichment Agent" />
              <Text textStyle="xs" fontWeight="medium" color="indigo.9">Suggested</Text>
            </Flex>
            <Stack gap="100">
              {suggestedKeywords.map((kw) => (
                <Flex key={kw.term} alignItems="center" gap="200">
                  <ProvenanceIndicator agentName="Product Enrichment Agent" size="10px" />
                  <Badge size="2xs" colorPalette="info" variant="subtle">{kw.term}</Badge>
                  <Text textStyle="xs" color="neutral.9">{kw.source}</Text>
                </Flex>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Box>
  );
};

// Progress bar animation
if (typeof document !== "undefined") {
  const styleId = "progress-grow-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes progressGrow {
        from { width: 0%; }
        to { width: 68%; }
      }
    `;
    document.head.appendChild(style);
  }
}
