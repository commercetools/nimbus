import { Box, Flex, Stack, Text, Badge, Button, Separator, Icon } from "@commercetools/nimbus";
import { AutoAwesome, Search, TrendingDown } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const suggestions = [
  { label: 'Split Silicone Cases into "Clear" and "Colored"', reason: "Product density 4.3x recommended max", confidence: 85 },
  { label: 'Merge Leather Cases into "Premium Cases"', reason: '"Premium cases" has 3.5x more search volume', confidence: 79 },
  { label: 'Add "MagSafe Compatible" child category', reason: "187 products with MagSafe attr, no category", confidence: 91 },
];

const impactRows = [
  { change: "Split Silicone → Clear + Colored", products: 612, redirects: 1, impact: "+15% findability" },
  { change: "Merge Leather → Premium", products: 142, redirects: 1, impact: "+28% search match" },
  { change: "Add MagSafe Compatible", products: 187, redirects: 0, impact: "+12% search match" },
];

const childCategories = [
  { name: "Silicone Cases", products: 612, conversion: "1.8%", density: "High" },
  { name: "Leather Cases", products: 142, conversion: "3.1%", density: "Normal" },
  { name: "Rugged Cases", products: 93, conversion: "2.7%", density: "Low" },
];

export const CategoryReorg = () => (
  <Box height="100%" overflow="auto">
    <PageHeader
      breadcrumbs={[
        { label: "Categories", href: "#" },
        { label: "Accessories", href: "#" },
        { label: "Phone Cases" },
      ]}
      title="Accessories > Phone Cases"
      subtitle="847 products · 3 children"
      tabs={[
        { label: "General", active: true },
        { label: "Products" },
        { label: "Search" },
      ]}
      actions={
        <>
          <Button variant="ghost" size="2xs">Revert</Button>
          <Button variant="solid" colorPalette="primary" size="2xs">Save</Button>
        </>
      }
    />

    <Stack gap="400" p="500">
      {/* Horizontal inline slot: category health dashboard */}
      <InlineSlot direction="row" data-tour="inline-slot">
        <InlineCard title="Category Health" agentName="Category Intelligence Agent" headerRight={
          <Badge size="2xs" colorPalette="warning">Below avg</Badge>
        }>
          <Flex gap="500">
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="neutral.12">847</Text>
              <Text textStyle="xs" color="neutral.9">Products</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="neutral.12">12,400</Text>
              <Text textStyle="xs" color="neutral.9">Monthly searches</Text>
            </Box>
            <Box>
              <Text textStyle="xl" fontWeight="bold" color="red.11">2.1%</Text>
              <Text textStyle="xs" color="neutral.9">Conversion (avg 3.4%)</Text>
            </Box>
          </Flex>
          <Flex mt="200" gap="200" alignItems="center" p="200" bg="amber.2" borderRadius="200">
            <Icon as={Search} size="2xs" color="amber.9" />
            <Text textStyle="xs" color="amber.11">
              Search term mismatch: customers search "phone covers" 2.1x more than "phone cases"
            </Text>
          </Flex>
          <Flex mt="100" gap="200" alignItems="center" p="200" bg="red.2" borderRadius="200">
            <Icon as={TrendingDown} size="2xs" color="red.9" />
            <Text textStyle="xs" color="red.11">
              Conversion 38% below the Accessories average
            </Text>
          </Flex>
        </InlineCard>

        <InlineCard title="Child Categories" agentName="Category Intelligence Agent">
          <Stack gap="0" borderWidth="1px" borderColor="neutral.4" borderRadius="200" overflow="hidden">
            <Flex px="300" py="150" bg="neutral.2" borderBottomWidth="1px" borderColor="neutral.4">
              <Text textStyle="xs" fontWeight="semibold" color="neutral.9" flex="1">Category</Text>
              <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="70px" textAlign="right">Products</Text>
              <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px" textAlign="right">Conv. Rate</Text>
              <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="60px" textAlign="right">Density</Text>
            </Flex>
            {childCategories.map((cat, i) => (
              <Flex key={i} px="300" py="200" borderBottomWidth={i < childCategories.length - 1 ? "1px" : "0"} borderColor="neutral.4" alignItems="center">
                <Text textStyle="sm" color="neutral.12" flex="1">{cat.name}</Text>
                <Text textStyle="xs" color="neutral.11" width="70px" textAlign="right">{cat.products}</Text>
                <Text textStyle="xs" color="neutral.11" width="80px" textAlign="right">{cat.conversion}</Text>
                <Badge size="xs" colorPalette={cat.density === "High" ? "warning" : cat.density === "Low" ? "info" : "neutral"} width="60px" justifyContent="center">{cat.density}</Badge>
              </Flex>
            ))}
          </Stack>
        </InlineCard>
      </InlineSlot>

      {/* Augmented restructuring suggestions */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" overflow="hidden">
        <Flex px="400" py="300" alignItems="center" gap="200" borderBottomWidth="1px" borderColor="neutral.4">
          <ProvenanceIndicator agentName="Category Intelligence Agent" iconSize="2xs" />
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Restructuring Suggestions</Text>
        </Flex>

        {suggestions.map((sug, i) => (
          <Flex
            key={i}
            px="400"
            py="300"
            alignItems="center"
            gap="300"
            borderBottomWidth="1px"
            borderColor="neutral.3"
            _hover={{ bg: "neutral.2" }}
            transition="background 150ms"
            css={{ animation: `fadeIn 200ms ease ${i * 100}ms both` }}
          >
            <ProvenanceIndicator agentName="Category Intelligence Agent" confidence={sug.confidence} iconSize="2xs" />
            <Box flex="1">
              <Text textStyle="sm" fontWeight="medium" color="neutral.12">{sug.label}</Text>
              <Text textStyle="xs" color="neutral.10">{sug.reason}</Text>
            </Box>
            <Badge size="2xs" colorPalette="info">{sug.confidence}%</Badge>
            <Button variant="outline" size="2xs">Apply</Button>
            <Button variant="ghost" size="2xs">Dismiss</Button>
          </Flex>
        ))}
      </Box>

      {/* Impact analysis table */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" overflow="hidden">
        <Flex px="400" py="300" alignItems="center" gap="200" borderBottomWidth="1px" borderColor="neutral.4">
          <ProvenanceIndicator agentName="Category Intelligence Agent" iconSize="2xs" />
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Impact Analysis</Text>
        </Flex>

        <Flex px="400" py="200" bg="neutral.2" borderBottomWidth="1px" borderColor="neutral.4">
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" flex="1">Change</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px" textAlign="right">Products</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px" textAlign="right">Redirects</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="120px" textAlign="right">Est. Impact</Text>
        </Flex>

        {impactRows.map((row, i) => (
          <Flex key={i} px="400" py="250" borderBottomWidth="1px" borderColor="neutral.3" alignItems="center">
            <Text textStyle="sm" color="neutral.12" flex="1">{row.change}</Text>
            <Text textStyle="xs" color="neutral.11" width="80px" textAlign="right">{row.products}</Text>
            <Text textStyle="xs" color="neutral.11" width="80px" textAlign="right">{row.redirects}</Text>
            <Text textStyle="xs" fontWeight="medium" color="green.11" width="120px" textAlign="right">{row.impact}</Text>
          </Flex>
        ))}
      </Box>
    </Stack>
  </Box>
);
