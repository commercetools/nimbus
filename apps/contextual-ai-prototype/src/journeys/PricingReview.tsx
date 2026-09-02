import { useState } from "react";
import { Box, Flex, Stack, Text, Badge, Button, Separator, Icon } from "@commercetools/nimbus";
import { TrendingUp, Warning, ExpandMore, ExpandLess } from "@commercetools/nimbus-icons";
import { ChartThemeProvider, ResponsiveContainer, LineChart, StatCard } from "@commercetools/nimbus-viz";
import { PageHeader } from "../components/PageHeader";
import { InlineSlot } from "../components/InlineSlot";
import { InlineCard } from "../components/InlineCard";
import { ProvenanceIndicator } from "../components/ProvenanceIndicator";
import { AiDot } from "../components/AiDot";

// Margin trend data (past 6 months)
const marginTrend = [
  {
    id: "margin",
    label: "Gross Margin %",
    data: [
      { x: new Date("2026-03-01"), y: 24.1 },
      { x: new Date("2026-04-01"), y: 23.8 },
      { x: new Date("2026-05-01"), y: 23.5 },
      { x: new Date("2026-06-01"), y: 22.9 },
      { x: new Date("2026-07-01"), y: 20.1 },
      { x: new Date("2026-08-01"), y: 17.3 },
    ],
  },
];

const priceRows = [
  { entry: "EUR / Online", current: "€899", suggested: "€979", margin: "17.3% → 22.1%", position: "Mid-range", highlight: true },
  { entry: "EUR / Retail", current: "€949", suggested: "€1,029", margin: "18.1% → 22.8%", position: "Below avg", highlight: true },
  { entry: "USD / Online", current: "$949", suggested: "$1,029", margin: "16.8% → 21.4%", position: "Competitive", highlight: false },
  { entry: "USD / Retail", current: "$999", suggested: "$1,079", margin: "19.2% → 23.5%", position: "Above avg", highlight: false },
  { entry: "GBP / Online", current: "£799", suggested: "£869", margin: "18.5% → 22.9%", position: "Mid-range", highlight: false },
];

export const PricingReview = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(0); // first row expanded by default
  return (
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
          <Flex gap="400">
            <ChartThemeProvider>
              <Stack gap="200" flex="1">
                <Flex gap="300">
                  <StatCard label="Current" value={17.3} format={(n) => `${n}%`} previous={24.1} />
                  <StatCard label="After adj." value={22.1} format={(n) => `${n}%`} previous={17.3} />
                  <StatCard label="Floor" value={20} format={(n) => `${n}%`} />
                </Flex>
                <ResponsiveContainer height={100}>
                  {(w, h) => (
                    <LineChart width={w} height={h} series={marginTrend} ariaLabel="Margin trend over 6 months" />
                  )}
                </ResponsiveContainer>
              </Stack>
            </ChartThemeProvider>
          </Flex>
          <Flex mt="200" gap="100" alignItems="center">
            <Icon as={Warning} size="2xs" color="amber.9" />
            <Text textStyle="xs" color="amber.11">
              Supplier cost +12% dropped margin below 20% floor on 5 of 6 entries
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
          <Button variant="outline" size="2xs">Apply All</Button>
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

        {/* Table rows with expandable detail */}
        {priceRows.map((row, i) => (
          <Box key={i}>
            <Flex
              px="400"
              py="250"
              alignItems="center"
              borderBottomWidth="1px"
              borderColor="neutral.3"
              bg={expandedRow === i ? "neutral.2" : row.highlight ? "indigo.2" : undefined}
              _hover={{ bg: row.highlight ? "indigo.3" : "neutral.2" }}
              transition="background 150ms"
              cursor="pointer"
              onClick={() => setExpandedRow(expandedRow === i ? null : i)}
            >
              <Icon as={expandedRow === i ? ExpandLess : ExpandMore} size="2xs" color="neutral.8" />
              <Flex width="130px" alignItems="center" gap="150" ml="100">
                <ProvenanceIndicator agentName="Pricing Optimizer Agent" />
                <Text textStyle="sm" fontWeight="medium" color="neutral.12">{row.entry}</Text>
              </Flex>
              <Text textStyle="sm" color="neutral.10" width="80px">{row.current}</Text>
              <Text textStyle="sm" fontWeight="medium" color="indigo.11" width="90px">{row.suggested}</Text>
              <Text textStyle="xs" color="neutral.11" width="130px">{row.margin}</Text>
              <Text textStyle="xs" color="neutral.10" flex="1">{row.position}</Text>
              <Flex width="120px" justifyContent="flex-end" gap="200">
                <Button variant="outline" size="2xs">Apply</Button>
                <Button variant="ghost" size="2xs">Dismiss</Button>
              </Flex>
            </Flex>

            {/* Expanded row: inline render target with agent analysis */}
            {expandedRow === i && (
              <Box
                px="500"
                py="300"
                bg="neutral.2"
                borderBottomWidth="1px"
                borderColor="neutral.4"
                css={{ animation: "fadeIn 200ms ease" }}
              >
                <Stack gap="300">
                  {/* Vertical inline slot: multiple agents can stack here */}
                  <Flex alignItems="center" gap="150" mb="100">
                    <AiDot />
                    <Text textStyle="xs" fontWeight="medium" color="indigo.9">Pricing Optimizer Agent</Text>
                  </Flex>
                  <Flex gap="400">
                    <Box flex="1">
                      <Text textStyle="xs" color="neutral.9" mb="50">Rationale</Text>
                      <Text textStyle="sm" color="neutral.12">
                        Suggested {row.suggested} restores margin to {row.margin.split("→")[1]?.trim()} while staying within 5% of the category median (€969). Price elasticity model estimates a 2.1% volume decrease at this price point.
                      </Text>
                    </Box>
                    <ChartThemeProvider>
                      <Box width="200px" flexShrink={0}>
                        <Text textStyle="xs" color="neutral.9" mb="50">6-month trend</Text>
                        <ResponsiveContainer height={80}>
                          {(w, h) => (
                            <LineChart width={w} height={h} series={marginTrend} ariaLabel={`Margin trend for ${row.entry}`} />
                          )}
                        </ResponsiveContainer>
                      </Box>
                    </ChartThemeProvider>
                  </Flex>
                </Stack>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Stack>
  </Box>
  );
};
