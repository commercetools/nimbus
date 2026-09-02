import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Stack, Text, Separator, Button } from "@commercetools/nimbus";
import { AiDot } from "../components/AiDot";
import { agents, pipelineSteps } from "../data/agents";

interface PipelineColors {
  bg: string;
  fg: string;
}

const getPipelineColors = (step: (typeof pipelineSteps)[number]): PipelineColors => {
  if (step.isHumanGate) {
    return { bg: "amber.3", fg: "amber.11" };
  }
  const agent = step.agentId ? agents[step.agentId] : undefined;
  if (agent?.source === "ct") {
    return { bg: "ctteal.3", fg: "ctteal.11" };
  }
  return { bg: "primary.3", fg: "primary.11" };
};

const WorkflowPipeline = () => (
  <Flex wrap="wrap" alignItems="flex-start" justifyContent="center" gap="100" rowGap="400">
    {pipelineSteps.map((step, index) => {
      const { bg, fg } = getPipelineColors(step);
      return (
        <Fragment key={step.step}>
          <Flex direction="column" alignItems="center" gap="100" width="88px">
            <Flex
              width="40px"
              height="40px"
              borderRadius="full"
              bg={bg}
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Text textStyle="sm" fontWeight="bold" color={fg}>
                {step.step}
              </Text>
            </Flex>
            <Text textStyle="xs" fontWeight="medium" color="neutral.12" textAlign="center">
              {step.label}
            </Text>
          </Flex>
          {index < pipelineSteps.length - 1 && (
            <Text
              as="span"
              color="neutral.7"
              mt="150"
              flexShrink={0}
              aria-hidden="true"
            >
              &rarr;
            </Text>
          )}
        </Fragment>
      );
    })}
  </Flex>
);

const flavorCards = [
  {
    id: "contextual",
    title: "Contextual",
    description:
      "The intelligence comes to you. Insights appear right inside the pages and controls you already use. Your inventory data shows up in the product list. Pricing recommendations appear in the discount form. You stay in your workflow. If you need to ask a follow-up, the chat panel is there, but it's rarely necessary because the answers are already in front of you.",
  },
  {
    id: "orchestrated",
    title: "Orchestrated",
    description:
      "You work through a single coordinator. It assembles information from multiple sources into one view and one conversation. Simpler to start, but the conversation becomes the interface: you ask, it answers, and what you see is shaped by what you asked.",
  },
];

const journeySteps = [
  { title: "Discover", description: "which products need a promotion and what kind" },
  { title: "Build", description: "configure the discount, validate stock, catch conflicts" },
  { title: "Test", description: "simulate carts, catch edge cases before launch" },
  { title: "Approve", description: "review everything, then launch" },
  { title: "Measure", description: "track performance, close the loop" },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box height="100%" overflow="auto" p={{ base: "300", sm: "600" }} bg="neutral.1">
      <Stack gap="500" maxWidth="800px" mx="auto">
        <Box>
          <Flex alignItems="center" gap="200" mb="200">
            <AiDot size="18px" />
            <Text textStyle="xl" fontWeight="bold" color="neutral.12">
              PetSmart Promotion Lifecycle
            </Text>
          </Flex>
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            8 agents across 5 steps, 1 promotion: from slow-moving inventory to measured results
          </Text>
        </Box>

        <Separator />

        <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4">
          <WorkflowPipeline />
        </Box>

        <Flex gap="300" direction={{ base: "column", md: "row" }}>
          {flavorCards.map((card) => (
            <Box
              key={card.id}
              flex="1"
              bg="white"
              borderRadius="300"
              p="400"
              shadow="xs"
              borderWidth="1px"
              borderColor="neutral.4"
            >
              <Text textStyle="sm" fontWeight="semibold" color="neutral.12" mb="150">
                {card.title}
              </Text>
              <Text textStyle="xs" color="neutral.10" lineHeight="tall">
                {card.description}
              </Text>
            </Box>
          ))}
        </Flex>

        <Box bg="white" borderRadius="300" p="400" shadow="xs" borderWidth="1px" borderColor="neutral.4">
          <Text textStyle="sm" color="neutral.11" lineHeight="tall" mb="300">
            Maya Chen is a category merchandiser at PetSmart. Spring is coming, and slow-moving pet
            health products are tying up shelf space. Over the next five steps, Maya will identify
            what to promote, build the discount, test it against real carts, approve the campaign,
            and measure the results. Eight agents from two organizations (commercetools and
            PetSmart) assist her throughout. She never leaves the Merchant Center.
          </Text>

          <Separator mb="300" />

          <Stack gap="150">
            {journeySteps.map((step, index) => (
              <Flex key={step.title} gap="150" alignItems="baseline">
                <Text textStyle="xs" fontWeight="bold" color="neutral.10" flexShrink={0}>
                  {index + 1}.
                </Text>
                <Text textStyle="xs" color="neutral.11">
                  <Text as="span" fontWeight="semibold" color="neutral.12">
                    {step.title}
                  </Text>
                  : {step.description}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Flex gap="300" justifyContent="center" wrap="wrap">
          <Button
            variant="solid"
            colorPalette="primary"
            size="sm"
            onPress={() => navigate("/contextual/step-1")}
          >
            Start: Contextual
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={() => navigate("/orchestrated/step-1")}
          >
            Start: Orchestrated
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
