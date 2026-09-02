import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Button, Tooltip, MakeElementFocusable, Grid } from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineCard } from "../components/InlineCard";
import { agents, pipelineSteps } from "../data/agents";
import { promotion } from "../data/promotionData";

export type FlavorMode = "contextual" | "orchestrated";

const summaryCards: {
  title: string;
  agentName: string;
  agentSource: "ct" | "customer";
  summary: string;
}[] = [
  {
    title: "Strategy",
    agentName: "Strategy Agent",
    agentSource: "ct",
    summary: "Spring Pet Wellness targeting 23 slow movers. Historical uplift: +28%.",
  },
  {
    title: "Discount",
    agentName: "Promo Agent",
    agentSource: "ct",
    summary: "Buy 2 Get 1 Free. 340 products. Margin impact: -4.1%.",
  },
  {
    title: "Simulation",
    agentName: "Preview Agent",
    agentSource: "ct",
    summary: "3 simulated carts. 1 stacking issue resolved.",
  },
  {
    title: "Inventory",
    agentName: "Inventory Agent",
    agentSource: "customer",
    summary: "312 products in stock. 28 excluded (low stock).",
  },
];

interface PipelineColors { bg: string; fg: string }

const getPipelineColors = (step: (typeof pipelineSteps)[number], status: "done" | "active" | "pending"): PipelineColors => {
  if (status === "pending") return { bg: "neutral.4", fg: "neutral.9" };
  if (step.isHumanGate) return { bg: "amber.3", fg: "amber.11" };
  const agent = step.agentId ? agents[step.agentId] : undefined;
  if (agent?.source === "ct") return { bg: "ctteal.3", fg: "ctteal.11" };
  return { bg: "primary.3", fg: "primary.11" };
};

const getStepStatus = (stepNumber: number): "done" | "active" | "pending" => {
  if (stepNumber <= 5) return "done";
  if (stepNumber === 6) return "active";
  return "pending";
};

const WorkflowPipeline = () => (
  <Flex wrap="wrap" alignItems="flex-start" justifyContent="center" gap="50" rowGap="200">
    {pipelineSteps.map((step, index) => {
      const status = getStepStatus(step.step);
      const { bg, fg } = getPipelineColors(step, status);
      const agent = step.agentId ? agents[step.agentId] : undefined;
      const tooltip = (step as { description?: string }).description ?? agent?.description ?? step.label;
      return (
        <Flex key={step.step} alignItems="center" gap="50">
          <Tooltip.Root>
            <MakeElementFocusable>
              <Flex direction="column" alignItems="center" gap="50" width="1200" cursor="default">
                <Flex
                  width="500"
                  height="500"
                  borderRadius="full"
                  bg={bg}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  borderWidth={status === "active" ? "2px" : "0"}
                  borderColor="amber.9"
                >
                  <Text textStyle="xs" fontWeight="bold" color={fg}>
                    {status === "done" ? "✓" : step.step}
                  </Text>
                </Flex>
                <Text textStyle="xs" color="neutral.11" textAlign="center" lineHeight="tight">
                  {step.label}
                </Text>
              </Flex>
            </MakeElementFocusable>
            <Tooltip.Content>{tooltip}</Tooltip.Content>
          </Tooltip.Root>
          {index < pipelineSteps.length - 1 && (
            <Text as="span" color="neutral.6" textStyle="xs" flexShrink={0} aria-hidden="true">→</Text>
          )}
        </Flex>
      );
    })}
  </Flex>
);

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text textStyle="xs" color="neutral.9" mb="50">
      {label}
    </Text>
    <Text textStyle="sm" fontWeight="medium" color="neutral.12">
      {value}
    </Text>
  </Box>
);

const PromotionDetails = () => (
  <Box
    bg="white"
    borderRadius="300"
    p="400"
    shadow="xs"
    borderWidth="1px"
    borderColor="neutral.4"
    data-tour="promotion-details"
  >
    <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="300">
      Promotion details
    </Text>
    <Grid templateColumns={{ base: "1fr 1fr", md: "repeat(5, 1fr)" }} gap="300">
      <DetailField label="Name" value={promotion.name} />
      <DetailField label="Type" value={promotion.type} />
      <DetailField label="Date range" value={`${promotion.startDate} – ${promotion.endDate}`} />
      <DetailField label="Target category" value={promotion.targetCategory} />
      <DetailField label="Products affected" value={String(promotion.productsAffected)} />
    </Grid>
  </Box>
);

export const ApproveStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1" display="flex" flexDirection="column">
      <PageHeader
        breadcrumbs={[
          { label: "Promotions" },
          { label: "Spring Pet Wellness 2026" },
          { label: "Review" },
        ]}
        title="Promotion Review"
        subtitle="Ready for approval"
      />

      <Box p={{ base: "300", sm: "500" }} flex="1">
        <Stack gap="500">
          <PromotionDetails />

          <Stack gap="300">
            <Box>
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                Review: How this promotion was built
              </Text>
              <Text textStyle="xs" color="neutral.9">
                Agent contributions across the pipeline, from inventory analysis to promo
                configuration. Step 6 is the human approval gate you're at now.
              </Text>
            </Box>

            <Box
              bg="white"
              borderRadius="300"
              p="400"
              shadow="xs"
              borderWidth="1px"
              borderColor="neutral.4"
              data-tour="pipeline"
            >
              <WorkflowPipeline />
            </Box>

            {/* Agent contributions: contextual mode only. In orchestrated
                mode, the Orchestrator's brief already lives in the panel, so
                the review page is just the pipeline and promotion details. */}
            {isContextual && (
              <Stack gap="200" data-tour="summary-cards">
                <Text textStyle="xs" fontWeight="semibold" color="neutral.10">
                  Agent contributions
                </Text>
                {summaryCards.map((card) => (
                  <InlineCard
                    key={card.title}
                    title={card.title}
                    agentName={card.agentName}
                    agentSource={card.agentSource}
                  >
                    <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                      {card.summary}
                    </Text>
                  </InlineCard>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box
        position="sticky"
        bottom="0"
        flexShrink={0}
        bg="white"
        borderTopWidth="1px"
        borderColor="neutral.4"
        px={{ base: "300", sm: "500" }}
        py="300"
        shadow="lg"
        zIndex="1"
      >
        <Flex
          justifyContent="space-between"
          alignItems={{ base: "flex-start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
          gap="200"
        >
          <Text textStyle="xs" color="neutral.9">
            This promotion will go live immediately upon approval.
          </Text>
          <Flex gap="200" flexShrink={0}>
            <Button variant="outline" colorPalette="warning" size="2xs">
              Request Changes
            </Button>
            <Button
              variant="solid"
              colorPalette="positive"
              size="2xs"
              data-tour="approve-btn"
              onPress={() => navigate(`/${mode}/step-5`)}
            >
              Approve &amp; Launch
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
