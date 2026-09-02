import { Box, Flex, Stack, Text, Badge, Button, Separator, Icon } from "@commercetools/nimbus";
import { AutoAwesome, TrendingUp, Warning } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const priceRows = [
  { entry: "EUR / Online", current: "€899", suggested: "€979", margin: "17.3% → 22.1%", position: "Mid-range", highlight: true },
  { entry: "EUR / Retail", current: "€949", suggested: "€1,029", margin: "18.1% → 22.8%", position: "Below avg", highlight: true },
  { entry: "USD / Online", current: "$949", suggested: "$1,029", margin: "16.8% → 21.4%", position: "Competitive", highlight: false },
  { entry: "USD / Retail", current: "$999", suggested: "$1,079", margin: "19.2% → 23.5%", position: "Above avg", highlight: false },
  { entry: "GBP / Online", current: "£799", suggested: "£869", margin: "18.5% → 22.9%", position: "Mid-range", highlight: false },
];

export const PricingReview = () => (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Products", href: "#" },
        { label: "Galaxy S25 Ultra", href: "#" },
        { label: "Prices" },
      ]}
      title="Galaxy S25 Ultra"
      subtitle="SKU-GS25U-001"
      tabs={[
        { label: "General" },
        { label: "Variants" },
        { label: "Images" },
        { label: "Prices", active: true },
        { label: "SEO" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="2xs">Revert</Button>
          <Button variant="solid" colorPalette="primary" size="2xs">Save</Button>
        </>
      }
    />

    <Stack gap="400" p="500">
      {/* Horizontal inline slot: margin summary + competitive overview */}
      <InlineSlot direction="row">
        <InlineCard title="Margin Analysis" agentName="Pricing Optimizer Agent" headerRight={
          <Badge size="xs" colorPalette="warning">At Risk</Badge>
        }>
          <Flex gap="600" alignItems="center">
            <Box>
              <Text textStyle="2xl" fontWeight="bold" color="red.11">17.3%</Text>
              <Text textStyle="xs" color="neutral.9">Current margin</Text>
            </Box>
            <Icon as={TrendingUp} size="sm" color="neutral.8" />
            <Box>
              <Text textStyle="2xl" fontWeight="bold" color="green.11">22.1%</Text>
              <Text textStyle="xs" color="neutral.9">After adjustment</Text>
            </Box>
            <Separator orientation="vertical" height="40px" />
            <Box>
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">20% floor</Text>
              <Text textStyle="xs" color="neutral.9">Company minimum</Text>
            </Box>
          </Flex>
          <Flex mt="200" gap="100" alignItems="center">
            <Icon as={Warning} size="2xs" color="amber.9" />
            <Text textStyle="xs" color="amber.11">
              Supplier cost increase of 12% reduced margins below the 20% floor on 5 of 6 price entries
            </Text>
          </Flex>
        </InlineCard>

        <InlineCard title="Competitive Context" agentName="Pricing Optimizer Agent" headerRight={
          <Text textStyle="xs" color="neutral.9">Last sync: 3 days ago</Text>
        }>
          <Stack gap="200">
            {[
              { name: "Competitor A", price: "€999", position: "Premium" },
              { name: "Competitor B", price: "€949", position: "Match" },
              { name: "Category median", price: "€969", position: "Reference" },
            ].map((c, i) => (
              <Flex key={i} alignItems="center" gap="300" py="50">
                <Text textStyle="sm" color="neutral.12" minWidth="100px">{c.name}</Text>
                <Text textStyle="sm" fontWeight="medium" color="neutral.12" minWidth="60px">{c.price}</Text>
                <Badge size="xs" colorPalette="neutral">{c.position}</Badge>
              </Flex>
            ))}
          </Stack>
        </InlineCard>
      </InlineSlot>

      {/* Augmented price table */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" overflow="hidden">
        <Flex px="400" py="300" alignItems="center" gap="200" borderBottomWidth="1px" borderColor="neutral.4">
          <ProvenanceIndicator agentName="Pricing Optimizer Agent" iconSize="2xs" />
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Price Adjustments</Text>
          <Box flex="1" />
          <Button variant="solid" colorPalette="primary" size="2xs">Apply All Suggestions</Button>
        </Flex>

        {/* Table header */}
        <Flex px="400" py="200" bg="neutral.2" borderBottomWidth="1px" borderColor="neutral.4">
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="140px">Price Entry</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px">Current</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="90px">Suggested</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="130px">Margin Impact</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" flex="1">Position</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="120px" textAlign="right">Actions</Text>
        </Flex>

        {/* Table rows */}
        {priceRows.map((row, i) => (
          <Flex
            key={i}
            px="400"
            py="250"
            alignItems="center"
            borderBottomWidth="1px"
            borderColor="neutral.3"
            bg={row.highlight ? "indigo.2" : undefined}
            _hover={{ bg: row.highlight ? "indigo.3" : "neutral.2" }}
            transition="background 150ms"
            cursor="pointer"
          >
            <Flex width="140px" alignItems="center" gap="150">
              <ProvenanceIndicator agentName="Pricing Optimizer Agent" iconSize="2xs" />
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">{row.entry}</Text>
            </Flex>
            <Text textStyle="sm" color="neutral.10" width="80px">{row.current}</Text>
            <Text textStyle="sm" fontWeight="medium" color="indigo.11" width="90px">{row.suggested}</Text>
            <Text textStyle="xs" color="neutral.11" width="130px">{row.margin}</Text>
            <Text textStyle="xs" color="neutral.10" flex="1">{row.position}</Text>
            <Flex width="120px" justifyContent="flex-end" gap="200">
              <Button variant="solid" colorPalette="primary" size="2xs">Apply</Button>
              <Button variant="ghost" size="2xs">Dismiss</Button>
            </Flex>
          </Flex>
        ))}
      </Box>
    </Stack>
  </Box>
);
