import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Button, Badge, Separator } from "@commercetools/nimbus";
import { AiDot } from "../components/AiDot";
import { useTour } from "../components/Tour";

const journeys = [
  {
    id: 1,
    title: "Product Launch Preparation",
    path: "/products/galaxy-s25-ultra",
    description: "Complete a product for launch with AI-assisted category assignment, variant suggestions, and readiness tracking.",
    targets: ["inline", "augmentation", "panel"],
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Inline Render Targets", description: "Two compact cards from the Product Enrichment Agent provide persistent context: a readiness scorecard with trend chart, and a variants card showing API data alongside AI suggestions.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='readiness-chart']", title: "Embedded Visualization", description: "An area chart shows readiness climbing over the past week. This is a nimbus-viz LineChart rendered directly inside the inline card.", renderTarget: "inline" as const, placement: "right" as const },
      { selector: "[data-tour='variants-suggested']", title: "API + AI Coexistence", description: "Existing variants (API data) appear above the divider. AI-suggested variants appear below with ✦ markers. Same card, same control, different data sources.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='generate-seo']", title: "Activation Button", description: "An augmentation render target of kind 'activation': a single action the agent surfaces in the toolbar. Clicking triggers the agent without navigating away.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='translate-btn']", title: "Field-Level Activation", description: "Another activation augmentation, scoped to a single form field. The agent can translate this field's content to all configured locales.", renderTarget: "augmentation" as const, placement: "left" as const },
      { selector: "[data-tour='category-combobox']", title: "Augmented Combobox", description: "The category picker uses Nimbus ComboBox.Section to show 'Recently Used' (API) and '✦ Suggested' (AI) sections side by side. Each suggestion has a provenance indicator with confidence score.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='chat-panel']", title: "Panel Render Target", description: "The chat panel is locator-aware: it knows you're on the product detail page and pre-seeds the conversation with relevant context. No blank prompt.", renderTarget: "panel" as const, placement: "left" as const },
    ],
  },
  {
    id: 2,
    title: "Pricing Review",
    path: "/products/pricing",
    description: "Review and adjust prices after a supplier cost increase with margin analysis, competitive context, and per-SKU optimization.",
    targets: ["inline", "augmentation", "panel"],
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Margin + Competitive Cards", description: "Two inline cards side by side: margin analysis with stat indicators and a trend chart, competitive context with position badges.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='price-table']", title: "Augmented Price Table", description: "Each row has a ✦ provenance indicator showing AI-suggested prices. Click a row to expand the inline detail view.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='expanded-row']", title: "Expandable Row as Inline Slot", description: "The expanded area is an inline render target scoped to this row's entity. It shows agent rationale and an embedded trend chart.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 3,
    title: "Discount Campaign",
    path: "/discounts/summer-clearance",
    description: "Design a promotional discount with AI-suggested conditions, real-time impact preview, and conflict detection.",
    targets: ["inline", "augmentation", "panel"],
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Impact + Conflict Cards", description: "Inline cards update as you configure: affected product count, margin impact, and a conflict warning about overlapping promotions.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='condition-chips']", title: "Suggested Condition Chips", description: "Augmentation items rendered as clickable chips below the conditions form. Each has a confidence score. Clicking adds the condition.", renderTarget: "augmentation" as const, placement: "top" as const },
    ],
  },
  {
    id: 4,
    title: "Order Investigation",
    path: "/orders/mc-2026-847291",
    description: "Investigate a flagged order with ambient risk signals, customer context, and conversational investigation.",
    targets: ["inline", "augmentation", "panel"],
    steps: [
      { selector: "[data-tour='risk-badge']", title: "Ambient Risk Signal", description: "An augmentation item in the page header: a risk badge with provenance indicator. The user sees the risk score without asking for it.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='inline-slot']", title: "Investigation Context", description: "Customer profile and timeline cards assembled by the agent, replacing manual lookups across multiple tabs and systems.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
  {
    id: 5,
    title: "Category Reorganization",
    path: "/categories/phone-cases",
    description: "Restructure the category tree with search data, health metrics, and impact analysis.",
    targets: ["inline", "augmentation", "panel"],
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
    steps: [
      { selector: "[data-tour='inline-slot']", title: "Readiness + Getting Started", description: "For a new user, the inline cards serve as onboarding: what's missing and what to do first. The AI surfaces capabilities the user might not know exist.", renderTarget: "inline" as const, placement: "bottom" as const },
    ],
  },
];

export const Landing = () => {
  const navigate = useNavigate();
  const { startTour } = useTour();

  const handleStartTour = (journey: typeof journeys[0]) => {
    navigate(journey.path);
    // Delay tour start to let the page render
    setTimeout(() => startTour(journey.steps), 500);
  };

  return (
    <Box height="100%" overflow="auto" p="600">
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
              borderWidth="1px"
              borderColor="neutral.6"
              borderRadius="200"
              p="400"
              gap="400"
              alignItems="center"
              _hover={{ borderColor: "indigo.6", bg: "indigo.1" }}
              transition="all 150ms"
              cursor="pointer"
              onClick={() => handleStartTour(j)}
            >
              <Box
                width="28px"
                height="28px"
                borderRadius="full"
                bg="neutral.3"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Text textStyle="sm" fontWeight="bold" color="neutral.11">{j.id}</Text>
              </Box>
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

        <Box bg="neutral.3" borderRadius="200" p="400">
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
