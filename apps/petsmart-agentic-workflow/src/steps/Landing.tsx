import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Separator, Button, Badge, Grid } from "@commercetools/nimbus";
import { AiDot } from "../components/AiDot";
import { useTour } from "../components/Tour";
import { pipelineSteps, agents } from "../data/agents";
import { startStepTour, type FlavorMode } from "../data/tourSteps";

interface PipelineColors { bg: string; fg: string }

const getPipelineColors = (step: (typeof pipelineSteps)[number]): PipelineColors => {
  if (step.isHumanGate) return { bg: "amber.3", fg: "amber.11" };
  const agent = step.agentId ? agents[step.agentId] : undefined;
  if (agent?.source === "ct") return { bg: "ctteal.3", fg: "ctteal.11" };
  return { bg: "primary.3", fg: "primary.11" };
};

const WorkflowPipeline = () => (
  <Flex wrap="wrap" gap="200" justifyContent="center">
    {pipelineSteps.map((step) => {
      const { bg, fg } = getPipelineColors(step);
      const agent = step.agentId ? agents[step.agentId] : undefined;
      const description = (step as { description?: string }).description ?? agent?.description;
      const sourceBadge = step.isHumanGate
        ? "Human"
        : agent?.source === "ct"
          ? "commercetools"
          : "PetSmart";
      return (
        <Flex
          key={step.step}
          direction="column"
          bg="white"
          borderWidth="1px"
          borderColor="neutral.4"
          borderRadius="200"
          p="200"
          width="130px"
          flexGrow={1}
          flexBasis="130px"
          maxWidth="160px"
        >
          <Flex alignItems="center" gap="150" mb="100">
            <Flex
              width="500"
              height="500"
              borderRadius="full"
              bg={bg}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Text textStyle="xs" fontWeight="bold" color={fg}>{step.step}</Text>
            </Flex>
            <Text textStyle="xs" fontWeight="bold" color="neutral.12">{step.label}</Text>
          </Flex>
          <Badge size="2xs" colorPalette={step.isHumanGate ? "warning" : agent?.source === "ct" ? "info" : "primary"} mb="100" width="fit-content">
            {sourceBadge}
          </Badge>
          {description && (
            <Text textStyle="xs" color="neutral.10" lineHeight="tight" flex="1">
              {description}
            </Text>
          )}
        </Flex>
      );
    })}
  </Flex>
);

const flavorCards = [
  {
    id: "contextual",
    title: "Contextual",
    story:
      "Maya opens the product list and immediately sees which items are slow movers, right in the table. She opens the discount form and suggested conditions are already there. She never opens a separate tool or starts a conversation. When she does have a question, the chat panel already knows what she's looking at.",
  },
  {
    id: "orchestrated",
    title: "Orchestrated",
    story:
      "Maya opens a conversation with the PetSmart Orchestrator. She says \"I need a spring promotion for slow-moving pet health products.\" The orchestrator pulls inventory data, checks pricing, drafts the discount, and presents a single brief. Maya reviews, asks follow-ups, and approves.",
  },
];

export const Landing = () => {
  const navigate = useNavigate();
  const { startTour } = useTour();

  const handleStart = (flavorId: FlavorMode) => {
    navigate(`/${flavorId}/step-1`);
    setTimeout(() => startStepTour(navigate, startTour, flavorId, 1), 500);
  };

  return (
    <Box height="100%" overflow="auto" p={{ base: "300", sm: "600" }} bg="neutral.1">
      <Stack gap="500" maxWidth="800px" mx="auto">
        <Box>
          <Flex alignItems="center" gap="200" mb="200">
            <AiDot size="18px" />
            <Text textStyle="xl" fontWeight="bold" color="neutral.12">
              PetSmart Promotion Lifecycle User Journey
            </Text>
          </Flex>
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            8 agents across 5 steps, 1 promotion: from slow-moving inventory to measured results
          </Text>
        </Box>

        <Separator />

        <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4" overflowX="auto">
          <WorkflowPipeline />
        </Box>

        <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4">
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            Maya Chen is a category merchandiser at PetSmart. Spring is coming, and slow-moving pet
            health products are tying up shelf space. Over the next five steps, Maya will identify
            what to promote, build the discount, test it against real carts, approve the campaign,
            and measure the results. Eight agents from two organizations (commercetools and
            PetSmart) assist her throughout. She never leaves the Merchant Center.
          </Text>
        </Box>

        <Flex gap="300" direction={{ base: "column", md: "row" }}>
          {flavorCards.map((card) => (
            <Flex
              key={card.id}
              flex="1"
              direction="column"
              bg="white"
              borderRadius="300"
              p="400"
              shadow="xs"
              borderWidth="1px"
              borderColor="neutral.4"
            >
              <Text textStyle="sm" fontWeight="bold" color="neutral.12" mb="150">
                {card.title}
              </Text>
              <Text textStyle="xs" color="neutral.10" lineHeight="tall" flex="1" fontStyle="italic">
                "{card.story}"
              </Text>
              <Box mt="300">
                <Button
                  variant="solid"
                  colorPalette="primary"
                  size="sm"
                  width="100%"
                  onPress={() => handleStart(card.id as FlavorMode)}
                >
                  Start: {card.title}
                </Button>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};
