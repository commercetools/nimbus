import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Button } from "@commercetools/nimbus";
import { PageHeader } from "../components/PageHeader";
import { InlineCard } from "../components/InlineCard";
import { AgentChain } from "../components/AgentChain";
import { StepNavigation } from "../components/StepNavigation";
import { agents, pipelineSteps } from "../data/agents";

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

const executiveSummary =
  "Spring Pet Wellness targets 23 slow movers with a Buy 2 Get 1 Free offer across 340 products " +
  "(-4.1% margin, +28% historical uplift). Cart simulation surfaced and resolved one stacking " +
  "conflict with Loyalty Paw Points. 312 of 340 products are in stock; 28 are excluded for low " +
  "stock. Ready for approval.";

interface PipelineColors {
  bg: string;
  fg: string;
}

const getPipelineColors = (
  step: (typeof pipelineSteps)[number],
  status: "done" | "active" | "pending"
): PipelineColors => {
  if (status === "pending") {
    return { bg: "neutral.4", fg: "neutral.9" };
  }
  if (step.isHumanGate) {
    return { bg: "amber.3", fg: "amber.11" };
  }
  const agent = step.agentId ? agents[step.agentId] : undefined;
  if (agent?.source === "ct") {
    return { bg: "ctteal.3", fg: "ctteal.11" };
  }
  return { bg: "primary.3", fg: "primary.11" };
};

const getStepStatus = (stepNumber: number): "done" | "active" | "pending" => {
  if (stepNumber <= 5) return "done";
  if (stepNumber === 6) return "active";
  return "pending";
};

const WorkflowPipeline = () => (
  <Flex wrap="wrap" alignItems="flex-start" justifyContent="center" gap="50" rowGap="300">
    {pipelineSteps.map((step, index) => {
      const status = getStepStatus(step.step);
      const { bg, fg } = getPipelineColors(step, status);
      return (
        <Fragment key={step.step}>
          <Flex direction="column" alignItems="center" gap="50" width="64px">
            <Flex
              width="24px"
              height="24px"
              borderRadius="full"
              bg={bg}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              borderWidth={status === "active" ? "2px" : "0"}
              borderColor="amber.9"
            >
              <Text fontSize="11px" fontWeight="bold" color={fg} lineHeight="1">
                {status === "done" ? "✓" : step.step}
              </Text>
            </Flex>
            <Text fontSize="10px" fontWeight="medium" color="neutral.11" textAlign="center" lineHeight="tight">
              {step.label}
            </Text>
          </Flex>
          {index < pipelineSteps.length - 1 && (
            <Text as="span" color="neutral.7" fontSize="10px" mt="100" flexShrink={0} aria-hidden="true">
              →
            </Text>
          )}
        </Fragment>
      );
    })}
  </Flex>
);

export const ApproveStep = ({ mode }: { mode: FlavorMode }) => {
  const isContextual = mode === "contextual";
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" bg="neutral.1">
      <PageHeader
        breadcrumbs={[
          { label: "Promotions" },
          { label: "Spring Pet Wellness 2026" },
          { label: "Review" },
        ]}
        title="Promotion Review"
        subtitle="Ready for approval"
        actions={
          <>
            <Button
              variant="solid"
              colorPalette="positive"
              size="sm"
              onPress={() => navigate(`/${mode}/step-5`)}
            >
              Approve &amp; Launch
            </Button>
            <Button variant="outline" colorPalette="warning" size="sm">
              Request Changes
            </Button>
          </>
        }
      />

      <Box p={{ base: "300", sm: "500" }}>
        <Stack gap="400">
          <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4">
            <WorkflowPipeline />
          </Box>

          {isContextual ? (
            <Stack gap="200">
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
          ) : (
            <InlineCard title="Promotion Brief" agentName="PetSmart Orchestrator" agentSource="customer">
              <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                {executiveSummary}
              </Text>
              <AgentChain
                defaultExpanded
                contributions={summaryCards.map((card) => ({
                  agentName: card.agentName,
                  source: card.agentSource,
                  contribution: card.summary,
                }))}
              />
            </InlineCard>
          )}
        </Stack>
      </Box>

      <StepNavigation currentStep={4} totalSteps={5} mode={mode} />
    </Box>
  );
};
