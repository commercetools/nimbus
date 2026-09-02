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
      { selector: "[data-tour='inline-slot']", title: "Lena checks readiness", description: "Lena opens the Galaxy S25 Ultra product page. A readiness scorecard appears automatically: 68% launch readiness. She didn't ask for it. The Product Enrichment Agent assembled it from the product's current state. She glances at the breakdown and sees what's missing.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='readiness-chart']", title: "She spots the gaps", description: "The waffle chart shows completion by area. Each cell is a specific criterion she can hover for details. Items with ✦ have agent suggestions ready. Descriptions and SEO metadata are the biggest gaps.", renderTarget: "inline" as const, placement: "right" as const, action: "hoverWaffleCells" as const },
      { selector: "[data-tour='category-tree']", title: "Categories already suggested", description: "Lena looks at the category tree. \"Mobile Phones\" is already assigned (✓). But the agent has also suggested two additional categories: \"Smartphones\" (78% confidence) and \"Phone Cases\" (67%). She hovers the ✦ to see why, then checks the box to assign Smartphones.", renderTarget: "augmentation" as const, placement: "left" as const, action: "highlightStars" as const },
      { selector: "[data-tour='generate-seo']", title: "She discovers a new capability", description: "Next to Publish and Revert, Lena notices a new toolbar action: \"✦ Generate SEO.\" She didn't know this was available. The agent surfaced it because SEO metadata is missing. She clicks it, and draft titles and descriptions appear for all locales.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='translate-btn']", title: "Field-level AI actions", description: "The Description field has a \"✦ Translate\" button next to its label. Lena can translate the English description to all configured locales with one click. The agent scoped this action to the exact field where it's useful.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='variants-table']", title: "Variants: API data + AI suggestions", description: "The variants table shows 3 existing variants (API data) alongside 3 AI-suggested ones. Navy/256GB, Green/128GB, White/512GB each have a ✦ provenance indicator and a \"Create\" button. Lena clicks Create on the first two. The readiness score climbs.", renderTarget: "augmentation" as const, placement: "top" as const, action: "highlightStars" as const },
      { selector: "[data-tour='chat-panel']", title: "Lena asks a follow-up question", description: "For a more complex question about EU market strategy, Lena opens the panel. It already knows she's editing the Galaxy S25 Ultra and has context from her interactions. No blank prompt. She asks: \"What variants should I add for the EU market?\" The agent responds with structured suggestions.", renderTarget: "panel" as const, placement: "left" as const, action: "openPanel" as const },
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
      { selector: "[data-tour='inline-slot']", title: "Marco sees the problem immediately", description: "Marco opens the prices tab after a 12% supplier cost increase. Before he looks at the price table, an inline card tells him: current margin is 17.3%, below the 20% floor. A trend line shows the six-month decline. He didn't pull a spreadsheet or check the ERP.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='price-table']", title: "Every price entry has a suggestion", description: "Each row has a ✦ next to a suggested new price. EUR/Online: €899 → €979, restoring margin to 22.1%. Marco clicks the first row to expand the agent's rationale: price elasticity model, competitive position, and a per-entry trend chart.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "highlightStars" as const },
      { selector: "[data-tour='apply-all']", title: "Marco applies the batch", description: "Satisfied with the per-SKU analysis, Marco clicks \"Apply All\" to accept the agent's recommendations across all five entries. The margin card updates in real time: 17.3% → 22.1%. The red \"At Risk\" badge turns green.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
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
      { selector: "[data-tour='inline-slot']", title: "Aisha sees impact as she configures", description: "Aisha starts filling in Summer Clearance 2026. An impact preview card updates in real time: ~2,400 products affected, -3.2% margin impact, 0 products below the 15% floor. A comparable campaign note shows Summer 2025 lifted orders 18% over 4 weeks.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='conflict-card']", title: "A conflict she would have missed", description: "The Conflict Detection card flags a problem: 142 products overlap with the active \"Loyalty Member 10%\" discount. Stacking would push 38 products below the margin floor. Aisha clicks \"Add exclusion\" to resolve it before launch.", renderTarget: "inline" as const, placement: "left" as const, action: "pulseElement" as const },
      { selector: "[data-tour='suggested-conditions']", title: "Conditions appear as she works", description: "Below the conditions she already set, the Promotions Agent has suggested two more: \"Product age > 90 days\" (76%) and \"Exclude: New Arrivals\" (71%). Each chip shows a ✦ with confidence. She clicks to add \"Product age > 90 days\" and the impact preview recalculates.", renderTarget: "augmentation" as const, placement: "top" as const, action: "highlightStars" as const },
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
      { selector: "[data-tour='risk-badge']", title: "David sees the risk score instantly", description: "David opens order #MC-2026-847291. A risk badge in the header reads \"High Fraud Risk: 87/100\" with a ✦ provenance indicator. He didn't have to check a separate fraud tool. The signal is right where he's already looking.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='inline-slot']", title: "The investigation context is pre-assembled", description: "Two cards give David everything he'd normally look up across five tabs: customer profile (2.3 years, 14 orders, avg €127, this order €431 at 3.4x average), and a timeline showing the address change 2 days before the order followed by the fraud alert.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='shipping-flagged']", title: "The risk signals are in the data", description: "The shipping address card is flagged amber. The agent has annotated it: address changed 2 days before order, express shipping is unusual for this customer. The billing address card shows it's been consistent across all 14 orders. David is building a picture.", renderTarget: "augmentation" as const, placement: "left" as const, action: "pulseElement" as const },
      { selector: "[data-tour='chat-panel']", title: "David asks a follow-up", description: "David wants more detail. He opens the panel, which already has the order context loaded. He asks: \"Has this customer changed addresses before?\" The agent responds: yes, once before (Berlin → Munich), also flagged but fulfilled without issue. The pattern is consistent with relocation, not fraud.", renderTarget: "panel" as const, placement: "left" as const, action: "openPanel" as const },
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
      { selector: "[data-tour='inline-slot']", title: "Tomás discovers the real problem", description: "Tomás opens Phone Cases for a routine seasonal review. The category health card reveals something he didn't know: customers search \"phone covers\" 2.1x more than \"phone cases\", and conversion is 38% below the Accessories average. A donut chart shows Silicone Cases dominate with 612 products.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='category-tree']", title: "The hierarchy tells the story", description: "The category tree shows the structure: Phone Cases has three children (Silicone, Leather, Rugged) plus a ✦ suggested \"MagSafe Compatible\" node from the agent. 187 products have MagSafe attributes but no dedicated category. Tomás considers the restructuring.", renderTarget: "augmentation" as const, placement: "left" as const, action: "highlightStars" as const },
      { selector: "[data-tour='restructuring-suggestions']", title: "Three changes, each with rationale", description: "The agent suggests splitting Silicone Cases (density 4.3x recommended max), merging Leather Cases into \"Premium Cases\" (3.5x more search volume), and adding MagSafe Compatible. Each has a confidence score, an Apply button, and a Dismiss option.", renderTarget: "augmentation" as const, placement: "bottom" as const },
      { selector: "[data-tour='impact-analysis']", title: "Blast radius before committing", description: "Before Tomás applies any change, the impact analysis shows exactly what happens: 612 products affected by the split, 1 URL redirect needed, estimated +15% findability. No surprises. He clicks Apply on the MagSafe suggestion first.", renderTarget: "augmentation" as const, placement: "bottom" as const },
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
      { selector: "[data-tour='inline-slot']", title: "Priya doesn't know what she doesn't know", description: "Priya is new to the team. She opens a product a colleague started and isn't sure what needs to be done. The readiness card answers her unasked question: 41% ready. Three items are red (missing), one is amber (needs attention), three are green.", renderTarget: "inline" as const, placement: "bottom" as const },
      { selector: "[data-tour='getting-started']", title: "A prioritized checklist, not a blank page", description: "The \"Getting Started\" card gives Priya a numbered list: (1) assign a category, (2) write a description, (3) upload one more image. Each step explains why it matters. She doesn't need to consult a wiki or ask a colleague.", renderTarget: "inline" as const, placement: "right" as const },
      { selector: "[data-tour='generate-btn']", title: "She discovers a capability she didn't know existed", description: "In the toolbar, Priya notices \"✦ Generate description.\" She didn't know AI could write product descriptions. The augmentation made the capability visible at the exact moment she needs it, next to an empty description field.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "pulseElement" as const },
      { selector: "[data-tour='category-suggestions']", title: "Categories are already suggested", description: "The category field is empty, but a dropdown already shows suggestions: \"Home & Garden > Kitchen > Small Appliances\" (89%) and \"Coffee & Tea\" (74%). Each has a ✦ with a reasoning tooltip. Priya hovers the first one, reads the rationale, and clicks to assign it.", renderTarget: "augmentation" as const, placement: "bottom" as const, action: "highlightStars" as const },
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
