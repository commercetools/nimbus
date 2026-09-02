import { Box, Flex, Stack, Text, Badge, Button, Separator, TextInput, FormField, Icon, ComboBox } from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { AiDot } from "../components/AiDot";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ActivationButton } from "../components/ActivationButton";

// Readiness checklist data
const checklist = [
  { status: "done" as const, label: "Categories", detail: "Electronics > Mobile Phones" },
  { status: "done" as const, label: "Name (5 locales)", detail: "Complete" },
  { status: "missing" as const, label: "Descriptions", detail: "2 of 5 locales" },
  { status: "warn" as const, label: "Images", detail: "6 uploaded, unordered" },
  { status: "done" as const, label: "Pricing", detail: "Set for 3 markets" },
  { status: "warn" as const, label: "Variants", detail: "3 of est. 8" },
  { status: "missing" as const, label: "SEO metadata", detail: "Missing" },
  { status: "done" as const, label: "Attributes", detail: "12/12 required" },
];

const statusIcon = {
  done: { symbol: "✓", color: "green.11" as const },
  warn: { symbol: "⚠", color: "amber.11" as const },
  missing: { symbol: "✗", color: "red.11" as const },
};

// Suggested variants data
const suggestedVariants = [
  { color: "Navy", storage: "256GB", reason: "Top seller DE/FR", market: "EU" },
  { color: "Green", storage: "128GB", reason: "Trending, 0 in catalog", market: "EU" },
  { color: "White", storage: "512GB", reason: "High margin, 12% EU", market: "EU" },
];

// Category suggestions (augmentation items)
const categorySuggestions = [
  { label: "Electronics > Mobile Phones", confidence: 92, highlight: true },
  { label: "Electronics > Smartphones", confidence: 78, highlight: false },
  { label: "Accessories > Phone Cases", confidence: 67, highlight: false },
];

export const ProductLaunch = () => {
  return (
    <Box height="100%" overflow="auto">
      <PageHeader
        breadcrumbs={[
          { label: "Products", href: "#" },
          { label: "Galaxy S25 Ultra" },
        ]}
        title="Galaxy S25 Ultra"
        subtitle="SKU-GS25U-001"
        tabs={[
          { label: "General", active: true },
          { label: "Variants" },
          { label: "Images" },
          { label: "Prices" },
          { label: "SEO" },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm">
              Revert
            </Button>
            <Button variant="solid" colorPalette="primary" size="sm">
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
              cursor="pointer"
              _hover={{ bg: "indigo.3" }}
              transition="background 150ms"
            >
              <AiDot />
              <Text textStyle="xs" fontWeight="medium" color="indigo.11">
                Generate SEO
              </Text>
            </Flex>
          </>
        }
      />

      {/* Content area */}
      <Stack gap="400" p="500">
        {/* === INLINE SLOT: horizontal, two compact cards === */}
        <InlineSlot direction="row" gap="300">
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
            {/* Progress bar */}
            <Box
              height="3px"
              bg="neutral.4"
              borderRadius="full"
              mb="300"
              overflow="hidden"
            >
              <Box
                height="100%"
                width="68%"
                bg="amber.9"
                borderRadius="full"
                transition="width 600ms ease"
              />
            </Box>

            {/* Checklist: 2 columns */}
            <Flex gap="400">
              <Stack gap="100" flex="1">
                {checklist.slice(0, 4).map((item) => (
                  <Flex key={item.label} alignItems="center" gap="200">
                    <Text
                      textStyle="xs"
                      fontWeight="bold"
                      color={statusIcon[item.status].color}
                    >
                      {statusIcon[item.status].symbol}
                    </Text>
                    <Text textStyle="xs" color="neutral.11">
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </Stack>
              <Stack gap="100" flex="1">
                {checklist.slice(4).map((item) => (
                  <Flex key={item.label} alignItems="center" gap="200">
                    <Text
                      textStyle="xs"
                      fontWeight="bold"
                      color={statusIcon[item.status].color}
                    >
                      {statusIcon[item.status].symbol}
                    </Text>
                    <Text textStyle="xs" color="neutral.11">
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </Flex>
          </InlineCard>

          {/* Suggested Variants Card */}
          <InlineCard
            title="Suggested Variants"
            agentName="Product Enrichment Agent"
            headerRight={
              <Badge size="xs" colorPalette="info">
                3 new
              </Badge>
            }
          >
            <Stack gap="200">
              {suggestedVariants.map((v, i) => (
                <Flex
                  key={i}
                  alignItems="center"
                  gap="300"
                  py="100"
                >
                  <Text textStyle="sm" fontWeight="medium" color="neutral.12" minWidth="100px">
                    {v.color} / {v.storage}
                  </Text>
                  <Text textStyle="xs" color="neutral.9" flex="1">
                    {v.reason}
                  </Text>
                  <Button variant="solid" colorPalette="primary" size="xs">
                    Create
                  </Button>
                </Flex>
              ))}
            </Stack>
          </InlineCard>
        </InlineSlot>

        {/* === FORM CARD: General Information === */}
        <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" p="500">
          <Text textStyle="md" fontWeight="semibold" color="neutral.12" mb="400">
            General Information
          </Text>

          {/* 2-column form grid */}
          <Flex gap="500">
            <Stack gap="400" flex="1">
              <FormField.Root>
                <FormField.Label>Product name (EN)</FormField.Label>
                <TextInput defaultValue="Galaxy S25 Ultra" />
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>SKU</FormField.Label>
                <TextInput defaultValue="SKU-GS25U-001" />
              </FormField.Root>
            </Stack>
            <Stack gap="400" flex="1">
              <FormField.Root>
                <FormField.Label>
                  <Flex alignItems="center" gap="200" width="100%">
                    <Text>Description (EN)</Text>
                    <Box flex="1" />
                    <ActivationButton label="Translate" />
                  </Flex>
                </FormField.Label>
                <TextInput defaultValue='The Galaxy S25 Ultra features a stunning 6.9" Dynamic AMOLED...' />
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>Product key</FormField.Label>
                <TextInput defaultValue="galaxy-s25-ultra" />
              </FormField.Root>
            </Stack>
          </Flex>

          <Separator my="400" />

          {/* === AUGMENTATION: Category picker with real Nimbus ComboBox + sections === */}
          <FormField.Root>
            <FormField.Label>Categories</FormField.Label>
            <ComboBox.Root
              placeholder="Search categories..."
              aria-label="Assign categories"
              menuTrigger="focus"
            >
              <ComboBox.Trigger />
              <ComboBox.Popover>
                <ComboBox.ListBox>
                  <ComboBox.Section label="Recently used">
                    <ComboBox.Option id="tablets" textValue="Electronics > Tablets">
                      <Text textStyle="sm" color="neutral.12">Electronics {">"} Tablets</Text>
                    </ComboBox.Option>
                  </ComboBox.Section>
                  <ComboBox.Section label="✦ Suggested">
                    {categorySuggestions.map((sug) => (
                      <ComboBox.Option key={sug.label} id={sug.label} textValue={sug.label}>
                        <Flex alignItems="center" gap="200" width="100%">
                          <ProvenanceIndicator
                            agentName="Product Enrichment Agent"
                            confidence={sug.confidence}
                            size="16px"
                          />
                          <Text
                            textStyle="sm"
                            fontWeight={sug.highlight ? "medium" : "regular"}
                            color="neutral.12"
                            flex="1"
                          >
                            {sug.label}
                          </Text>
                          <Badge size="xs" colorPalette="info" variant="subtle">
                            {sug.confidence}%
                          </Badge>
                        </Flex>
                      </ComboBox.Option>
                    ))}
                  </ComboBox.Section>
                </ComboBox.ListBox>
              </ComboBox.Popover>
            </ComboBox.Root>
          </FormField.Root>
        </Box>
      </Stack>
    </Box>
  );
};
