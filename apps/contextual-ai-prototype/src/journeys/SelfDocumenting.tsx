import { Box, Flex, Stack, Text, Badge, Button, Separator, TextInput, FormField, Icon } from "@commercetools/nimbus";
import { CheckCircle, Error as ErrorIcon, Warning } from "@commercetools/nimbus-icons";
import { ChartThemeProvider, ResponsiveContainer, WaffleChart } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ActivationButton } from "../components/ActivationButton";

// Each cell = one specific completion criterion
const readinessBreakdown = [
  // Images (4 cells)
  { category: "Hero image uploaded", value: 1 },
  { category: "Product angle shot", value: 1 },
  { category: "Images ≥ 1000px", value: 1 },
  { category: "Alt text set", value: 1 },
  // Name (10 cells)
  { category: "Name EN complete", value: 1 },
  { category: "Name DE complete", value: 1 },
  { category: "Name FR complete", value: 1 },
  { category: "Name ES complete", value: 1 },
  { category: "Name IT complete", value: 1 },
  { category: "Name length ≤ 80 chars", value: 1 },
  { category: "Name has brand prefix", value: 1 },
  { category: "Name title case", value: 1 },
  { category: "Name slug generated", value: 1 },
  { category: "Name no special chars", value: 1 },
  // Price (8 cells)
  { category: "EUR price set", value: 1 },
  { category: "USD price set", value: 1 },
  { category: "Margin above floor", value: 1 },
  { category: "Tax category assigned", value: 1 },
  { category: "Price mode set", value: 1 },
  { category: "Currency formatting", value: 1 },
  { category: "Competitive range", value: 1 },
  { category: "Price valid dates", value: 1 },
  // Variants (10 cells)
  { category: "Master variant set", value: 1 },
  { category: "Variant 1 configured", value: 1 },
  { category: "Variant 2 configured", value: 1 },
  { category: "Variant 3 configured", value: 1 },
  { category: "Variant SKUs unique", value: 1 },
  { category: "Variant attributes filled", value: 1 },
  { category: "Variant images linked", value: 1 },
  { category: "Variant prices set", value: 1 },
  { category: "Inventory tracked", value: 1 },
  { category: "Variant keys set", value: 1 },
];

const checklist = [
  { status: "missing" as const, label: "Categories", detail: "Unassigned (required for storefront)", suggestion: "Suggested: Home & Garden > Kitchen > Small Appliances (89%)" },
  { status: "missing" as const, label: "Description (EN)", detail: "Empty (required for SEO)", suggestion: 'Use "Generate description" in toolbar for a draft' },
  { status: "missing" as const, label: "Description (DE, FR)", detail: "Empty (required for EU)", suggestion: "Translate after EN description is written" },
  { status: "warn" as const, label: "Images", detail: "2 uploaded (min 3 recommended)", suggestion: "Coffee & Tea category recommends 3+ lifestyle shots" },
  { status: "done" as const, label: "Name", detail: "Complete in all locales" },
  { status: "done" as const, label: "Price", detail: "Set for 2 markets" },
  { status: "done" as const, label: "Variants", detail: "4 configured" },
];

const statusIcon = {
  done: { symbol: "✓", color: "green.11" as const },
  warn: { symbol: "⚠", color: "amber.11" as const },
  missing: { symbol: "✗", color: "red.11" as const },
};

const chartColors = ["#e34948", "#e34948", "#eda100", "#1baf7a", "#2a78d6", "#008300"];

const categorySuggestions = [
  { label: "Home & Garden > Kitchen > Small Appliances", confidence: 89 },
  { label: "Home & Garden > Kitchen > Coffee & Tea", confidence: 74 },
];

export const SelfDocumenting = () => (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Products", href: "#" },
        { label: "Precision Pour-Over Kettle" },
      ]}
      title="Precision Pour-Over Kettle"
      subtitle="SKU-POK-2026"
      tabs={[
        { label: "General", active: true },
        { label: "Variants" },
        { label: "Images" },
        { label: "Prices" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="2xs">Revert</Button>
          <Button variant="solid" colorPalette="primary" size="2xs">Publish</Button>
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
            data-tour="generate-btn"
          >
            <ProvenanceIndicator agentName="Product Enrichment Agent" reason="Generate descriptions for all configured locales" />
            <Text textStyle="xs" fontWeight="medium" color="indigo.11">Generate description</Text>
          </Flex>
        </>
      }
    />

    <Stack gap="300" p="300">
      {/* Horizontal inline slot: readiness + getting started */}
      <InlineSlot direction="row" gap="300" data-tour="inline-slot">
        <InlineCard title="Product Readiness" agentName="Product Enrichment Agent" headerRight={
          <Text textStyle="lg" fontWeight="bold" color="red.11">41%</Text>
        }>
          {/* Progress bar */}
          <Box height="2px" bg="neutral.4" borderRadius="full" mb="200" overflow="hidden">
            <Box height="100%" width="41%" bg="red.9" borderRadius="full" transition="width 600ms ease" />
          </Box>

          <Flex gap="200">
            <Stack gap="100" flex="1" data-tour="readiness-checklist">
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
                  <Text textStyle="xs" color="neutral.12" fontWeight={item.status === "missing" ? "medium" : "regular"}>
                    {item.label}
                  </Text>
                  {item.suggestion && (
                    <ProvenanceIndicator agentName="Product Enrichment Agent" reason={item.suggestion} size="8px" />
                  )}
                </Flex>
              ))}
            </Stack>
            <Box flex="1" minWidth="120px" css={{ "& figure > ul, & figure > table": { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)" } }}>
              <Text textStyle="xs" color="neutral.9" mb="100">Completion by area</Text>
              <ChartThemeProvider>
                <ResponsiveContainer height={120}>
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

        <Box data-tour="getting-started"><InlineCard title="Getting Started" agentName="Product Enrichment Agent" headerRight={
          <Badge size="2xs" colorPalette="info">For you</Badge>
        }>
          <Stack gap="300">
            <Text textStyle="sm" color="neutral.11">
              This product was started by a colleague and needs several fields completed before it can go live. Here's what to focus on first:
            </Text>
            <Stack gap="200">
              {[
                { step: "1", label: "Assign a category", detail: "Required for storefront navigation. AI suggestions are available below." },
                { step: "2", label: "Write a description", detail: 'Use "Generate description" in the toolbar for a draft.' },
                { step: "3", label: "Upload one more image", detail: "Coffee & Tea category recommends 3+ lifestyle shots." },
              ].map((item) => (
                <Flex key={item.step} gap="200" alignItems="flex-start">
                  <Flex
                    width="20px" height="20px" borderRadius="full"
                    bg="indigo.3" alignItems="center" justifyContent="center" flexShrink={0}
                  >
                    <Text textStyle="xs" fontWeight="bold" color="indigo.11">{item.step}</Text>
                  </Flex>
                  <Box>
                    <Text textStyle="sm" fontWeight="medium" color="neutral.12">{item.label}</Text>
                    <Text textStyle="xs" color="neutral.10">{item.detail}</Text>
                  </Box>
                </Flex>
              ))}
            </Stack>
          </Stack>
        </InlineCard></Box>
      </InlineSlot>

      {/* Form with augmented fields */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="200" p="300">
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="300">
          General Information
        </Text>

        <Flex gap="300">
          <Stack gap="300" flex="1">
            <FormField.Root size="sm">
              <FormField.Label>Product name (EN)</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" defaultValue="Precision Pour-Over Kettle" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root size="sm">
              <FormField.Label>
                <Flex alignItems="center" gap="200" width="100%">
                  <Text>Description (EN)</Text>
                  <Box flex="1" />
                  <ActivationButton label="Generate" />
                </Flex>
              </FormField.Label>
              <FormField.Input>
                <TextInput size="sm" placeholder="Write a product description..." />
              </FormField.Input>
              <FormField.Description>Required for SEO and storefront display</FormField.Description>
            </FormField.Root>
          </Stack>
          <Stack gap="300" flex="1">
            <FormField.Root size="sm">
              <FormField.Label>SKU</FormField.Label>
              <FormField.Input>
                <TextInput size="sm" defaultValue="SKU-POK-2026" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root size="sm">
              <FormField.Label>
                <Flex alignItems="center" gap="200" width="100%">
                  <Text>Description (DE)</Text>
                  <Box flex="1" />
                  <ActivationButton label="Translate" />
                </Flex>
              </FormField.Label>
              <FormField.Input>
                <TextInput size="sm" placeholder="German description..." />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </Flex>

        <Separator my="300" />

        {/* Categories with AI suggestions */}
        <FormField.Root size="sm">
          <FormField.Label>Categories</FormField.Label>
          <Box position="relative">
            <FormField.Input>
              <TextInput size="sm" placeholder="Search categories..." />
            </FormField.Input>
            <Box
              position="absolute"
              top="100%"
              left="0"
              right="0"
              mt="100"
              bg="white"
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="200"
              data-tour="category-suggestions"
              overflow="hidden"
              zIndex={10}
              shadow="md"
              data-tour="category-suggestions"
            >
              <Flex px="300" pt="200" pb="100" alignItems="center" gap="150">
                <ProvenanceIndicator agentName="Product Enrichment Agent" reason="Based on product name and attributes" />
                <Text textStyle="xs" fontWeight="semibold" color="indigo.9">Suggested for this product</Text>
              </Flex>

              {categorySuggestions.map((sug, i) => (
                <Flex
                  key={i}
                  px="300"
                  py="200"
                  alignItems="center"
                  gap="200"
                  cursor="pointer"
                  bg={i === 0 ? "indigo.2" : undefined}
                  _hover={{ bg: i === 0 ? "indigo.3" : "neutral.3" }}
                  transition="background 150ms"
                  css={{ animation: `fadeIn 200ms ease ${i * 80}ms both` }}
                >
                  <ProvenanceIndicator
                    agentName="Product Enrichment Agent"
                    confidence={sug.confidence}
                    reason={i === 0 ? "Based on product name 'Pour-Over Kettle', capacity 1.2L, stainless steel material" : "Alternative: coffee-specific category with higher search volume"}
                  />
                  <Text textStyle="sm" fontWeight={i === 0 ? "medium" : "regular"} color="neutral.12" flex="1">
                    {sug.label}
                  </Text>
                  <Badge size="2xs" colorPalette="info" variant="subtle">{sug.confidence}%</Badge>
                </Flex>
              ))}
            </Box>
          </Box>
        </FormField.Root>
      </Box>
    </Stack>
  </Box>
);
