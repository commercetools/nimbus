import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Stack,
  Text,
  Badge,
  Separator,
} from "@commercetools/nimbus";
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
    <Box
      height="100%"
      overflow="auto"
      p={{ base: "300", sm: "600" }}
      bg="neutral.1"
    >
      <Stack gap="500" maxWidth="860px" mx="auto">
        {/* Title + intro */}
        <Box>
          <Flex alignItems="center" gap="200" mb="200">
            <ProvenanceBadge size="18px" agentSource="petsmart" />
            <Text textStyle="xl" fontWeight="bold" color="neutral.12">
              PetSmart Contextual AI Journeys
            </Text>
          </Flex>
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            A single external agent — PetSmart Commerce Intelligence — surfaces
            inventory, margin, competitive, and analytics data directly into the
            Merchant Center pages where merchandisers are already making
            decisions. It adds context that doesn't exist in commercetools
            without replacing anything. These four journeys show what that looks
            like across different modes of work: strategy, evaluation,
            execution, and correction.
          </Text>
        </Box>

        <Separator />

        {/* Persona cards */}
        <Box>
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color="neutral.12"
            mb="200"
          >
            Personas
          </Text>
          <Flex gap="300" wrap="wrap">
            {personaList.map((p) => (
              <Flex
                key={p.id}
                bg="white"
                borderRadius="300"
                p="300"
                gap="250"
                alignItems="center"
                shadow="xs"
                borderWidth="1px"
                borderColor="neutral.4"
                flex="1"
                minWidth="200px"
              >
                <Box
                  width="600"
                  height="600"
                  borderRadius="full"
                  overflow="hidden"
                  flexShrink={0}
                  bg="neutral.3"
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box>
                  <Flex alignItems="center" gap="150">
                    <Text
                      textStyle="sm"
                      fontWeight="semibold"
                      color="neutral.12"
                    >
                      {p.name}
                    </Text>
                    <Text textStyle="xs" color="neutral.10">
                      {p.role}
                    </Text>
                  </Flex>
                  <Text textStyle="xs" color="neutral.10" mt="50">
                    {p.description}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>

        <Separator />

        {/* Journey cards */}
        <Box>
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color="neutral.12"
            mb="200"
          >
            User Journeys
          </Text>
          <Stack gap="300">
            {journeys.map((j) => (
              <Flex
                key={j.id}
                bg="white"
                borderRadius="300"
                p="400"
                gap="400"
                alignItems="flex-start"
                shadow="xs"
                _hover={{ shadow: "md", borderColor: "primary.6" }}
                transition="all 150ms"
                cursor="pointer"
                onClick={() => handleStartJourney(j)}
                borderWidth="1px"
                borderColor="neutral.4"
              >
                <Flex
                  width="500"
                  height="500"
                  borderRadius="full"
                  bg={`${modeColors[j.mode]}.3`}
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text
                    textStyle="sm"
                    fontWeight="bold"
                    color={`${modeColors[j.mode]}.11`}
                  >
                    {j.id}
                  </Text>
                </Flex>
                <Box flex="1" minWidth="0">
                  <Flex alignItems="center" gap="200" mb="50">
                    <Text
                      textStyle="sm"
                      fontWeight="semibold"
                      color="neutral.12"
                    >
                      {j.title}
                    </Text>
                    <Badge size="xs" colorPalette={modeColors[j.mode] as any}>
                      {j.mode}
                    </Badge>
                    <Text
                      textStyle="xs"
                      color="neutral.10"
                      ml="auto"
                      flexShrink={0}
                    >
                      {j.persona.name} · {j.persona.role}
                    </Text>
                  </Flex>
                  <Text
                    textStyle="sm"
                    color="primary.11"
                    fontWeight="medium"
                    mb="150"
                  >
                    "{j.coreQuestion}"
                  </Text>
                  <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                    {j.description}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Separator />

        {/* Data sources legend */}
        <Box
          bg="white"
          borderRadius="300"
          p="400"
          shadow="xs"
          borderWidth="1px"
          borderColor="neutral.4"
        >
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color="neutral.12"
            mb="200"
          >
            What you're seeing
          </Text>
          <Text textStyle="xs" color="neutral.11" lineHeight="tall" mb="300">
            Each view starts as a standard Merchant Center page showing only
            commercetools data. The tutorial then reveals how agents render data
            into the page at the right moment. Every agent-provided element
            carries a provenance indicator so the user always knows where data
            came from.
          </Text>
          <Flex gap="400" wrap="wrap">
            <Flex alignItems="center" gap="150">
              <Box
                width="100"
                height="100"
                borderRadius="full"
                bg="neutral.9"
              />
              <Text textStyle="xs" color="neutral.11">
                commercetools data
              </Text>
            </Flex>
            <Flex alignItems="center" gap="150">
              <ProvenanceBadge size="10px" agentSource="ct" />
              <Text textStyle="xs" color="neutral.11">
                ct agent augmentation
              </Text>
            </Flex>
            <Flex alignItems="center" gap="150">
              <ProvenanceBadge size="10px" agentSource="petsmart" />
              <Text textStyle="xs" color="neutral.11">
                PetSmart agent augmentation
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};
