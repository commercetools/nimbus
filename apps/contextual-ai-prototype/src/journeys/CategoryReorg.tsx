import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Button,
  Separator,
  Icon,
  Tree,
  FormField,
  TextInput,
} from "@commercetools/nimbus";
import { ChartThemeProvider, ResponsiveContainer, DonutChart } from "@commercetools/nimbus-viz";
import { Search, TrendingDown } from "@commercetools/nimbus-icons";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";

const AGENT_NAME = "Category Intelligence Agent (proposed)";

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
  { id: "silicone-cases", name: "Silicone Cases", products: 612, conversion: "1.8%", density: "High" },
  { id: "leather-cases", name: "Leather Cases", products: 142, conversion: "3.1%", density: "Normal" },
  { id: "rugged-cases", name: "Rugged Cases", products: 93, conversion: "2.7%", density: "Low" },
];

// Agent-proposed children, not yet part of the category tree — rendered as
// ✦-marked nodes so they read as suggestions rather than existing structure.
const suggestedChildren = [
  { id: "magsafe-compatible", name: "MagSafe Compatible", reason: "187 products with MagSafe attr, no category", confidence: 91 },
];

const densityPalette = (density: string) =>
  density === "High" ? "warning" : density === "Low" ? "info" : "neutral";

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
      actions={
        <>
          <Button variant="ghost" size="2xs">Revert</Button>
          <Button variant="solid" colorPalette="primary" size="2xs">Save</Button>
        </>
      }
    />

    <Stack gap="300" p="300">
      {/* Horizontal inline slot: category health dashboard */}
      <InlineSlot direction="row" data-tour="inline-slot">
        <InlineCard title="Category Health" agentName={AGENT_NAME} headerRight={
          <Badge size="2xs" colorPalette="warning">Below avg</Badge>
        }>
          <Flex gap="300">
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

          {/* Category health: product density breakdown across child categories */}
          <Box mt="200" data-tour="density-chart">
            <Text textStyle="xs" fontWeight="semibold" color="neutral.10" mb="100">
              Product density by subcategory
            </Text>
            <ChartThemeProvider>
              <ResponsiveContainer height={120}>
                {(w, h) => (
                  <DonutChart
                    width={w}
                    height={h}
                    data={childCategories.map((cat) => ({
                      category: cat.name,
                      value: cat.products,
                    }))}
                    ariaLabel="Product density by subcategory"
                  />
                )}
              </ResponsiveContainer>
            </ChartThemeProvider>
          </Box>
        </InlineCard>

        <Box data-tour="category-tree"><InlineCard title="Category Hierarchy" agentName={AGENT_NAME} headerRight={
          <Badge size="2xs" colorPalette="info">1 suggestion</Badge>
        }>
          <FormField.Root size="sm" mb="200">
            <FormField.Input>
              <TextInput
                width="100%"
                size="sm"
                placeholder="Search categories"
                leadingElement={<Icon as={Search} size="2xs" color="neutral.8" />}
              />
            </FormField.Input>
          </FormField.Root>

          <Tree.Root
            aria-label="Category hierarchy"
            size="sm"
            defaultExpandedKeys={["accessories", "phone-cases"]}
            css={{ "--tree-indent-step": "28px", "--tree-control-gap": "2px" }}
          >
            <Tree.Item id="accessories" textValue="Accessories">
              <Tree.ItemContent>
                <Tree.Indicator />
                <Text textStyle="sm" fontWeight="medium" color="neutral.12">
                  Accessories
                </Text>
              </Tree.ItemContent>

              <Tree.Item id="phone-cases" textValue="Phone Cases">
                <Tree.ItemContent>
                  <Tree.Indicator />
                  <Flex flex="1" alignItems="center" justifyContent="space-between" gap="200">
                    <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                      Phone Cases
                    </Text>
                    <Flex alignItems="center" gap="150">
                      <Text textStyle="xs" color="neutral.9">847 products</Text>
                      <Badge size="2xs" colorPalette="info">Current</Badge>
                    </Flex>
                  </Flex>
                </Tree.ItemContent>

                {childCategories.map((cat) => (
                  <Tree.Item key={cat.id} id={cat.id} textValue={cat.name}>
                    <Tree.ItemContent>
                      <Tree.Indicator />
                      <Flex flex="1" alignItems="center" justifyContent="space-between" gap="200">
                        <Text textStyle="sm" color="neutral.12">{cat.name}</Text>
                        <Flex alignItems="center" gap="150">
                          <Text textStyle="xs" color="neutral.10">{cat.products} products</Text>
                          <Text textStyle="xs" color="neutral.9">{cat.conversion}</Text>
                          <Badge size="2xs" colorPalette={densityPalette(cat.density)}>
                            {cat.density}
                          </Badge>
                        </Flex>
                      </Flex>
                    </Tree.ItemContent>
                  </Tree.Item>
                ))}

                {suggestedChildren.map((sug) => (
                  <Tree.Item key={sug.id} id={sug.id} textValue={sug.name}>
                    <Tree.ItemContent>
                      <Tree.Indicator />
                      <Flex flex="1" alignItems="center" justifyContent="space-between" gap="200">
                        <Flex alignItems="center" gap="150">
                          <ProvenanceIndicator agentName={AGENT_NAME} confidence={sug.confidence} size="10px" />
                          <Text textStyle="sm" fontStyle="italic" color="indigo.11">
                            {sug.name}
                          </Text>
                        </Flex>
                        <Badge size="2xs" colorPalette="info">Suggested</Badge>
                      </Flex>
                    </Tree.ItemContent>
                  </Tree.Item>
                ))}
              </Tree.Item>
            </Tree.Item>
          </Tree.Root>
        </InlineCard></Box>
      </InlineSlot>

      {/* Augmented restructuring suggestions */}
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" overflow="hidden" data-tour="restructuring-suggestions">
        <Flex px="300" py="200" alignItems="center" gap="200" borderBottomWidth="1px" borderColor="neutral.4">
          <ProvenanceIndicator agentName={AGENT_NAME} size="10px" />
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Restructuring Suggestions</Text>
        </Flex>

        {suggestions.map((sug, i) => (
          <Flex
            key={i}
            px="300"
            py="200"
            alignItems="center"
            gap="300"
            borderBottomWidth="1px"
            borderColor="neutral.3"
            _hover={{ bg: "neutral.2" }}
            transition="background 150ms"
            css={{ animation: `fadeIn 200ms ease ${i * 100}ms both` }}
          >
            <ProvenanceIndicator agentName={AGENT_NAME} confidence={sug.confidence} size="10px" />
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
      <Box bg="white" borderWidth="1px" borderColor="neutral.6" borderRadius="300" overflow="hidden" data-tour="impact-analysis">
        <Flex px="300" py="200" alignItems="center" gap="200" borderBottomWidth="1px" borderColor="neutral.4">
          <ProvenanceIndicator agentName={AGENT_NAME} size="10px" />
          <Text textStyle="sm" fontWeight="semibold" color="neutral.12">Impact Analysis</Text>
        </Flex>

        <Flex px="300" py="150" bg="neutral.2" borderBottomWidth="1px" borderColor="neutral.4">
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" flex="1">Change</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px" textAlign="right">Products</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="80px" textAlign="right">Redirects</Text>
          <Text textStyle="xs" fontWeight="semibold" color="neutral.9" width="120px" textAlign="right">Est. Impact</Text>
        </Flex>

        {impactRows.map((row, i) => (
          <Flex key={i} px="300" py="200" borderBottomWidth="1px" borderColor="neutral.3" alignItems="center">
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
