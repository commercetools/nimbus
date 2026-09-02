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
            {/* Progress bar with animation */}
            <Box
              height="2px"
              bg="neutral.4"
              borderRadius="full"
              mb="200"
              overflow="hidden"
            >
              <Box
                height="100%"
                width="0%"
                bg="amber.9"
                borderRadius="full"
                css={{
                  animation: "progressGrow 800ms ease-out 300ms forwards",
                }}
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

          {/* Variants Card: existing API data + AI suggestions coexisting */}
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="neutral.6"
            borderRadius="200"
            overflow="hidden"
            width="fit-content"
            maxWidth="100%"
          >
            {/* Card header */}
            <Flex alignItems="center" gap="150" px="300" py="150" borderBottomWidth="1px" borderColor="neutral.4" bg="neutral.2">
              <Text textStyle="xs" fontWeight="semibold" color="neutral.12">Variants</Text>
              <Box flex="1" />
              <Text textStyle="xs" color="neutral.9">3 existing</Text>
            </Flex>
            <Box px="300" py="200">
              <Stack gap="150">
                {/* Existing variants (API data, no AI indicator) */}
                {[
                  { color: "Black", storage: "128GB", status: "Published" },
                  { color: "Black", storage: "256GB", status: "Published" },
                  { color: "White", storage: "128GB", status: "Published" },
                ].map((v, i) => (
                  <Flex key={i} alignItems="center" gap="300" py="50">
                    <Text textStyle="xs" color="neutral.11" minWidth="100px">
                      {v.color} / {v.storage}
                    </Text>
                    <Badge size="2xs" colorPalette="positive">{v.status}</Badge>
                  </Flex>
                ))}

                {/* Divider between API data and AI suggestions */}
                <Flex alignItems="center" gap="150" pt="100">
                  <Box height="1px" bg="neutral.4" flex="1" />
                  <Flex alignItems="center" gap="100">
                    <AiDot size="10px" />
                    <Text textStyle="xs" color="indigo.9" fontWeight="medium">Suggested</Text>
                  </Flex>
                  <Box height="1px" bg="neutral.4" flex="1" />
                </Flex>

                {/* AI-suggested variants (with ✦ indicator) */}
                {suggestedVariants.map((v, i) => (
                  <Flex key={i} alignItems="center" gap="300" py="50">
                    <Flex alignItems="center" gap="150" minWidth="100px">
                      <AiDot size="8px" />
                      <Text textStyle="xs" fontWeight="medium" color="neutral.12">
                        {v.color} / {v.storage}
                      </Text>
                    </Flex>
                    <Text textStyle="xs" color="neutral.9" flex="1">{v.reason}</Text>
                    <Button variant="solid" colorPalette="primary" size="2xs">Create</Button>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Box>
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
                <FormField.Input>
                  <TextInput defaultValue="Galaxy S25 Ultra" />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>SKU</FormField.Label>
                <FormField.Input>
                  <TextInput defaultValue="SKU-GS25U-001" />
                </FormField.Input>
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
                <FormField.Input>
                  <TextInput defaultValue='The Galaxy S25 Ultra features a stunning 6.9" Dynamic AMOLED...' />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>Product key</FormField.Label>
                <FormField.Input>
                  <TextInput defaultValue="galaxy-s25-ultra" />
                </FormField.Input>
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
                    <ComboBox.Option id="wearables" textValue="Electronics > Wearables">
                      <Text textStyle="sm" color="neutral.12">Electronics {">"} Wearables</Text>
                    </ComboBox.Option>
                  </ComboBox.Section>
                  <ComboBox.Section label="All categories">
                    <ComboBox.Option id="audio" textValue="Electronics > Audio">
                      <Text textStyle="sm" color="neutral.12">Electronics {">"} Audio</Text>
                    </ComboBox.Option>
                    <ComboBox.Option id="computing" textValue="Electronics > Computing">
                      <Text textStyle="sm" color="neutral.12">Electronics {">"} Computing</Text>
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
