import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Badge, Separator } from "@commercetools/nimbus";
import { AiDot } from "../components/AiDot";
import { useTour } from "../components/Tour";

const journeys = [
  {
    id: 1,
    title: "Product Launch Preparation",
    path: "/products/galaxy-s25-ultra",
    description: "Complete a product for launch with AI-assisted category assignment, variant suggestions, and readiness tracking.",
    targets: ["inline", "augmentation", "panel"],
    accent: "teal",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Inline Render Targets", description: "Two compact cards from the Product Enrichment Agent provide persistent context: a readiness scorecard with waffle chart, and product metadata.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='readiness-chart']", title: "Waffle Chart Readiness", description: "A waffle chart breaks down readiness by area. Colored dots on the checklist double as the chart legend. Items with ✦ have agent suggestions.", renderTarget: "inline" as const, placement: "right" as const },
      { selector: "[data-tour='variants-table']", title: "Variants DataTable", description: "Existing variants (API data) and AI-suggested variants coexist in the same DataTable. Suggested rows show ✦ provenance indicators with Create buttons.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "highlightStars" as const },
      { selector: "[data-tour='generate-seo']", title: "Activation Button", description: "An augmentation activation: a single action the agent surfaces in the toolbar. Hover ✦ for agent info, click to trigger without navigating away.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='translate-btn']", title: "Field-Level Activation", description: "Another activation augmentation, scoped to a single form field. The agent can translate this field's content to all configured locales.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='category-tree']", title: "Category Tree with Suggestions", description: "The Nimbus Tree shows the category hierarchy. Assigned categories have a ✓. AI-suggested categories show ✦ with confidence percentages.", renderTarget: "augmentation" as const, placement: "left" as const, action: "highlightStars" as const },
      { selector: "[data-tour='chat-panel']", title: "Panel Render Target", description: "The chat panel is locator-aware: it knows you're on the product detail page. Click any ✦ 'Why this suggestion?' to open the panel with contextual follow-up.", renderTarget: "panel" as const, placement: "left" as const, action: "openPanel" as const },
    ],
  },
  {
    id: 2,
    title: "Pricing Review",
    path: "/products/pricing",
    description: "Review and adjust prices after a supplier cost increase with margin analysis, competitive context, and per-SKU optimization.",
    targets: ["inline", "augmentation", "panel"],
    accent: "amber",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Margin + Competitive Cards", description: "Two inline cards side by side: margin analysis with stat indicators and a trend chart, competitive context with position badges.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='price-table']", title: "Augmented Price Table", description: "Each row has a ✦ provenance indicator showing AI-suggested prices. Click a row to expand the inline detail view.", renderTarget: "augmentation" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 3,
    title: "Discount Campaign",
    path: "/discounts/summer-clearance",
    description: "Design a promotional discount with AI-suggested conditions, real-time impact preview, and conflict detection.",
    targets: ["inline", "augmentation", "panel"],
    accent: "indigo",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Impact + Conflict Cards", description: "Inline cards update as you configure: affected product count, margin impact, and a conflict warning about overlapping promotions.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 4,
    title: "Order Investigation",
    path: "/orders/mc-2026-847291",
    description: "Investigate a flagged order with ambient risk signals, customer context, and conversational investigation.",
    targets: ["inline", "augmentation", "panel"],
    accent: "amber",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Investigation Context", description: "Customer profile and timeline cards assembled by the agent, replacing manual lookups across multiple tabs and systems.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 5,
    title: "Category Reorganization",
    path: "/categories/phone-cases",
    description: "Restructure the category tree with search data, health metrics, and impact analysis.",
    targets: ["inline", "augmentation", "panel"],
    accent: "teal",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Category Health Dashboard", description: "Inline cards showing data you'd normally pull from analytics: search volume, conversion rate, product density, search term mismatches.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 6,
    title: "Self-Documenting Interface",
    path: "/products/pour-over-kettle",
    description: "A new user discovers capabilities through ambient augmentations and contextual guidance.",
    targets: ["inline", "augmentation", "panel"],
    accent: "indigo",
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Readiness + Getting Started", description: "For a new user, the inline cards serve as onboarding: what's missing and what to do first. The AI surfaces capabilities the user might not know exist.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
];

const accentBg: Record<string, string> = {
  teal: "teal.3",
  amber: "amber.3",
  indigo: "indigo.3",
};

const accentFg: Record<string, string> = {
  teal: "teal.11",
  amber: "amber.11",
  indigo: "indigo.11",
};

export const Landing = () => {
  const navigate = useNavigate();
  const { startTour } = useTour();

  const handleStartTour = (journey: typeof journeys[0]) => {
    navigate(journey.path);
    setTimeout(() => startTour(journey.steps), 500);
  };

  return (
    <Box height="100%" overflow="auto" p="600" bg="neutral.1">
      <Stack gap="500" maxWidth="800px" mx="auto">
        <Box>
          <Flex alignItems="center" gap="200" mb="200">
            <AiDot size="18px" />
            <Text textStyle="xl" fontWeight="bold" color="neutral.12">
              Contextual AI User Journeys
            </Text>
          </Flex>
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            Six scenarios showing how panel, inline, and augmentation render targets
            compose into a contextual AI experience. Each journey demonstrates AI that
            integrates with existing controls rather than replacing them.
          </Text>
        </Box>

        <Separator />

        <Stack gap="300">
          {journeys.map((j) => (
            <Flex
              key={j.id}
              bg="white"
              borderRadius="300"
              p="400"
              gap="400"
              alignItems="center"
              shadow="xs"
              _hover={{ shadow: "md", borderColor: "indigo.6" }}
              transition="all 150ms"
              cursor="pointer"
              onClick={() => handleStartTour(j)}
              borderWidth="1px"
              borderColor="neutral.4"
            >
              <Flex
                width="32px"
                height="32px"
                borderRadius="full"
                bg={accentBg[j.accent] ?? "neutral.3"}
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text textStyle="sm" fontWeight="bold" color={accentFg[j.accent] ?? "neutral.11"}>
                  {j.id}
                </Text>
              </Flex>
              <Box flex="1" minWidth="0">
                <Text textStyle="sm" fontWeight="semibold" color="neutral.12">{j.title}</Text>
                <Text textStyle="xs" color="neutral.10" mt="50">{j.description}</Text>
              </Box>
              <Flex gap="100" flexShrink={0}>
                {j.targets.map((t) => (
                  <Badge key={t} size="2xs" colorPalette={renderTargetColors[t] as any}>
                    {t}
                  </Badge>
                ))}
              </Flex>
            </Flex>
          ))}
        </Stack>

        <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4">
          <Text textStyle="xs" color="neutral.10" lineHeight="tall">
            Click any journey to navigate to it and start a guided tour highlighting
            the render targets in action. Or use the sidebar to navigate directly.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

const renderTargetColors: Record<string, string> = {
  panel: "indigo",
  inline: "teal",
  augmentation: "amber",
};
