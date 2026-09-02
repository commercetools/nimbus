import { Box, Flex, Stack, Text, Badge, Button, Separator, TextInput, FormField, Icon } from "@commercetools/nimbus";
import { AutoAwesome, CheckCircle, Error as ErrorIcon, Warning } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { AiDot } from "../components/AiDot";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { ActivationButton } from "../components/ActivationButton";

const checklist = [
  { status: "missing" as const, label: "Categories", detail: "Unassigned (required for storefront)" },
  { status: "missing" as const, label: "Description (EN)", detail: "Empty (required for SEO)" },
  { status: "missing" as const, label: "Description (DE, FR)", detail: "Empty (required for EU)" },
  { status: "warn" as const, label: "Images", detail: "2 uploaded (min 3 recommended)" },
  { status: "done" as const, label: "Name", detail: "Complete in all locales" },
  { status: "done" as const, label: "Price", detail: "Set for 2 markets" },
  { status: "done" as const, label: "Variants", detail: "4 configured" },
];

const statusConfig = {
  done: { icon: CheckCircle, color: "green.11" as const },
  warn: { icon: Warning, color: "amber.11" as const },
  missing: { icon: ErrorIcon, color: "red.11" as const },
};

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
          <Button variant="ghost" size="sm">Revert</Button>
          <Button variant="solid" colorPalette="primary" size="sm">Publish</Button>
          {/* Augmentation: toolbar action that surfaces a capability */}
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
            <Text textStyle="xs" fontWeight="medium" color="indigo.11">Generate description</Text>
          </Flex>
        </>
      }
    />

    <Stack gap="400" p="500">
      {/* Horizontal inline slot: readiness + getting started */}
      <InlineSlot direction="row">
        <InlineCard title="Product Readiness" agentName="Product Enrichment Agent" headerRight={
          <Text textStyle="lg" fontWeight="bold" color="red.11">41%</Text>
        }>
          <Box height="3px" bg="neutral.4" borderRadius="full" mb="300" overflow="hidden">
            <Box height="100%" width="41%" bg="red.9" borderRadius="full" transition="width 600ms ease" />
          </Box>
          <Stack gap="100">
            {checklist.map((item) => {
              const config = statusConfig[item.status];
              return (
                <Flex key={item.label} alignItems="center" gap="200">
                  <Icon as={config.icon} size="2xs" color={config.color} />
                  <Text textStyle="xs" color="neutral.12" fontWeight={item.status === "missing" ? "medium" : "regular"}>
                    {item.label}
                  </Text>
                  <Text textStyle="xs" color="neutral.9" ml="auto">{item.detail}</Text>
                </Flex>
              );
            })}
          </Stack>
        </InlineCard>

        <InlineCard title="Getting Started" agentName="Product Enrichment Agent" headerRight={
          <Badge size="xs" colorPalette="info">For you</Badge>
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
        </InlineCard>
      </InlineSlot>

      {/* Form with augmented fields */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" p="500">
        <Text textStyle="md" fontWeight="semibold" color="neutral.12" mb="400">
          General Information
        </Text>

        <Flex gap="500">
          <Stack gap="400" flex="1">
            <FormField.Root>
              <FormField.Label>Product name (EN)</FormField.Label>
              <TextInput defaultValue="Precision Pour-Over Kettle" />
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>
                <Flex alignItems="center" gap="200" width="100%">
                  <Text>Description (EN)</Text>
                  <Box flex="1" />
                  <ActivationButton label="Generate" />
                </Flex>
              </FormField.Label>
              <TextInput placeholder="Write a product description..." />
              <FormField.Description>Required for SEO and storefront display</FormField.Description>
            </FormField.Root>
          </Stack>
          <Stack gap="400" flex="1">
            <FormField.Root>
              <FormField.Label>SKU</FormField.Label>
              <TextInput defaultValue="SKU-POK-2026" />
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>
                <Flex alignItems="center" gap="200" width="100%">
                  <Text>Description (DE)</Text>
                  <Box flex="1" />
                  <ActivationButton label="Translate" />
                </Flex>
              </FormField.Label>
              <TextInput placeholder="German description..." />
            </FormField.Root>
          </Stack>
        </Flex>

        <Separator my="400" />

        {/* Categories with AI suggestions */}
        <FormField.Root>
          <FormField.Label>Categories</FormField.Label>
          <Box position="relative">
            <TextInput placeholder="Search categories..." />
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
              overflow="hidden"
              zIndex={10}
              shadow="md"
            >
              <Flex px="300" pt="200" pb="100" alignItems="center" gap="150">
                <AiDot />
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
                  <ProvenanceIndicator agentName="Product Enrichment Agent" confidence={sug.confidence} iconSize="2xs" />
                  <Text textStyle="sm" fontWeight={i === 0 ? "medium" : "regular"} color="neutral.12" flex="1">
                    {sug.label}
                  </Text>
                  <Badge size="xs" colorPalette="info" variant="subtle">{sug.confidence}%</Badge>
                </Flex>
              ))}
            </Box>
          </Box>
        </FormField.Root>
      </Box>
    </Stack>
  </Box>
);
