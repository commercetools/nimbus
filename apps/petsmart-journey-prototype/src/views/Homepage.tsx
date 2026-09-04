import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Stack, Text, Badge } from "@commercetools/nimbus";
import { ProvenanceBadge } from "../components/ProvenanceBadge";
import { useJourney } from "../components/JourneyContext";
import { useTour } from "../components/Tour";
import { journeys } from "../data/journeyDefinitions";
import { personaList } from "../data/personas";

const modeColors: Record<string, string> = {
  strategy: "teal",
  evaluation: "amber",
  execution: "indigo",
  correction: "red",
};

export const Homepage = () => {
  const navigate = useNavigate();
  const { startJourney } = useJourney();
  const { startTour } = useTour();

  const handleStartJourney = (journey: (typeof journeys)[number]) => {
    startJourney(journey);
    navigate(journey.startPath);
    setTimeout(() => startTour(journey.tourSteps), 500);
  };

  return (
    <Box height="100%" overflow="auto" p="300" bg="neutral.1">
      <Stack gap="200" maxWidth="1100px" mx="auto">
        {/* Header */}
        <Box>
          <Flex alignItems="center" gap="150" mb="100">
            <ProvenanceBadge size="14px" agentSource="petsmart" />
            <Text textStyle="lg" fontWeight="bold" color="neutral.12">
              PetSmart Contextual AI Journeys
            </Text>
          </Flex>
          <Text textStyle="xs" color="neutral.11" lineHeight="tall">
            A single external agent surfaces inventory, margin, competitive, and
            analytics data directly into the MC — adding context that doesn't
            exist in commercetools. Click a journey to walk through it.
          </Text>
        </Box>

        {/* Personas + legend row */}
        <Flex gap="200" alignItems="center" wrap="wrap">
          {personaList.map((p) => (
            <Flex
              key={p.id}
              alignItems="center"
              gap="100"
              bg="white"
              px="200"
              py="100"
              borderRadius="200"
              borderWidth="1px"
              borderColor="neutral.4"
            >
              <Box
                width="400"
                height="400"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
                bg="neutral.3"
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box>
                <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
                  {p.name}
                </Text>
                <Text textStyle="xs" color="neutral.10">
                  {p.role}
                </Text>
              </Box>
            </Flex>
          ))}
          <Box flex="1" />
          <Flex gap="200" alignItems="center">
            <Flex alignItems="center" gap="100">
              <Box
                width="100"
                height="100"
                borderRadius="full"
                bg="neutral.9"
              />
              <Text textStyle="xs" color="neutral.10">
                ct data
              </Text>
            </Flex>
            <Flex alignItems="center" gap="100">
              <ProvenanceBadge size="10px" agentSource="ct" />
              <Text textStyle="xs" color="neutral.10">
                ct agent
              </Text>
            </Flex>
            <Flex alignItems="center" gap="100">
              <ProvenanceBadge size="10px" agentSource="petsmart" />
              <Text textStyle="xs" color="neutral.10">
                PetSmart agent
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Journey cards */}
        <Grid columns={{ base: 1, md: 2 }} gap="200">
          {journeys.map((j) => (
            <Flex
              key={j.id}
              bg="white"
              borderRadius="200"
              p="300"
              gap="200"
              alignItems="flex-start"
              shadow="xs"
              _hover={{ shadow: "md", borderColor: "primary.6" }}
              transition="all 150ms"
              cursor="pointer"
              onClick={() => handleStartJourney(j)}
              borderWidth="1px"
              borderColor="neutral.4"
              direction="column"
            >
              <Flex alignItems="center" gap="150" width="100%">
                <Flex
                  width="400"
                  height="400"
                  borderRadius="full"
                  bg={`${modeColors[j.mode]}.3`}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text
                    textStyle="xs"
                    fontWeight="bold"
                    color={`${modeColors[j.mode]}.11`}
                  >
                    {j.id}
                  </Text>
                </Flex>
                <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
                  {j.title}
                </Text>
                <Badge size="2xs" colorPalette={modeColors[j.mode] as any}>
                  {j.mode}
                </Badge>
                <Text
                  textStyle="xs"
                  color="neutral.10"
                  ml="auto"
                  flexShrink={0}
                >
                  {j.persona.name}
                </Text>
              </Flex>
              <Text textStyle="xs" color="primary.11" fontWeight="medium">
                "{j.coreQuestion}"
              </Text>
              <Text
                textStyle="xs"
                color="neutral.11"
                lineHeight="tall"
                lineClamp={3}
              >
                {j.description}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};
