import { Box, Flex, Stack, Text, Badge, Button, Separator, TextInput, FormField, Icon } from "@commercetools/nimbus";
import { AutoAwesome, Warning } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { AiDot } from "../components/AiDot";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const conditionChips = [
  { label: "Category: Summer Collection", confidence: 88 },
  { label: "Inventory > 50 units", confidence: 82 },
  { label: "Product age > 90 days", confidence: 76 },
  { label: "Exclude: New Arrivals tag", confidence: 71 },
];

export const DiscountCampaign = () => (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Discounts", href: "#" },
        { label: "Summer Clearance 2026" },
      ]}
      title="Summer Clearance 2026"
      subtitle="Cart discount · Draft"
      tabs={[
        { label: "General", active: true },
        { label: "Rules" },
        { label: "Schedule" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="sm">Discard</Button>
          <Button variant="solid" colorPalette="primary" size="sm">Save</Button>
        </>
      }
    />

    <Stack gap="400" p="500">
      {/* Vertical inline slot: impact preview + conflict analysis */}
      <InlineSlot direction="row">
        <InlineCard title="Impact Preview" agentName="Promotions Agent" headerRight={
          <Text textStyle="xs" color="neutral.9">Updates as you configure</Text>
        }>
          <Flex gap="500">
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="neutral.12">~2,400</Text>
              <Text textStyle="xs" color="neutral.9">Affected products</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="amber.11">-3.2%</Text>
              <Text textStyle="xs" color="neutral.9">Avg margin impact</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="green.11">0</Text>
              <Text textStyle="xs" color="neutral.9">Below 15% floor</Text>
            </Box>
          </Flex>
          <Flex mt="200" px="300" py="200" bg="neutral.3" borderRadius="200" gap="200" alignItems="center">
            <AiDot />
            <Text textStyle="xs" color="neutral.11">
              Comparable: Summer Clearance 2025 (Q3) lifted orders 18% over 4 weeks
            </Text>
          </Flex>
        </InlineCard>

        <InlineCard title="Conflict Detection" agentName="Promotions Agent" headerRight={
          <Badge size="xs" colorPalette="warning">1 conflict</Badge>
        }>
          <Flex gap="200" alignItems="flex-start" p="200" bg="amber.2" borderRadius="200" borderWidth="1px" borderColor="amber.6">
            <Icon as={Warning} size="xs" color="amber.9" mt="50" flexShrink={0} />
            <Box>
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">
                142 products overlap with "Loyalty Member 10%"
              </Text>
              <Text textStyle="xs" color="neutral.10" mt="50">
                Stacking would push 38 products below the 15% margin floor. Consider adding an exclusion rule or making this discount non-stackable.
              </Text>
              <Flex mt="200" gap="200">
                <Button variant="outline" size="2xs">Add exclusion</Button>
                <Button variant="ghost" size="2xs">Non-stackable</Button>
              </Flex>
            </Box>
          </Flex>
        </InlineCard>
      </InlineSlot>

      {/* Discount form */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" p="500">
        <Text textStyle="md" fontWeight="semibold" color="neutral.12" mb="400">
          Discount Configuration
        </Text>

        <Flex gap="500">
          <Stack gap="400" flex="1">
            <FormField.Root>
              <FormField.Label>Discount name</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="Summer Clearance 2026" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Discount type</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="Percentage (20%)" />
              </FormField.Input>
            </FormField.Root>
          </Stack>
          <Stack gap="400" flex="1">
            <FormField.Root>
              <FormField.Label>Valid from</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="2026-06-01" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Valid until</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="2026-08-31" />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </Flex>

        <Separator my="400" />

        {/* Augmented conditions section */}
        <FormField.Root>
          <FormField.Label>
            <Flex alignItems="center" gap="200">
              <Text>Conditions</Text>
              <Box flex="1" />
              <Text textStyle="xs" color="neutral.9">2 applied</Text>
            </Flex>
          </FormField.Label>

          {/* Current conditions */}
          <Flex gap="200" flexWrap="wrap" mb="300">
            <Badge size="md" colorPalette="neutral">Category = Summer Collection ✕</Badge>
            <Badge size="md" colorPalette="neutral">Inventory {">"} 50 units ✕</Badge>
          </Flex>

          {/* AI suggested condition chips */}
          <Box>
            <Flex alignItems="center" gap="150" mb="200">
              <AiDot />
              <Text textStyle="xs" fontWeight="semibold" color="indigo.9">Suggested conditions</Text>
            </Flex>
            <Flex gap="200" flexWrap="wrap">
              {conditionChips.map((chip, i) => (
                <Flex
                  key={i}
                  alignItems="center"
                  gap="150"
                  px="300"
                  py="100"
                  borderRadius="full"
                  bg="indigo.2"
                  borderWidth="1px"
                  borderColor="indigo.6"
                  cursor="pointer"
                  _hover={{ bg: "indigo.3" }}
                  transition="background 150ms"
                  css={{ animation: `fadeIn 200ms ease ${i * 80}ms both` }}
                >
                  <ProvenanceIndicator agentName="Promotions Agent" confidence={chip.confidence} iconSize="2xs" />
                  <Text textStyle="xs" fontWeight="medium" color="indigo.11">{chip.label}</Text>
                  <Badge size="xs" colorPalette="info" variant="subtle">{chip.confidence}%</Badge>
                </Flex>
              ))}
            </Flex>
          </Box>
        </FormField.Root>
      </Box>
    </Stack>
  </Box>
);
