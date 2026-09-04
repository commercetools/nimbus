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
      <Stack gap="500" maxWidth="800px" mx="auto">
        {/* Header */}
        <Box>
          <Flex alignItems="center" gap="150" mb="100">
            <ProvenanceBadge size="16px" agentSource="petsmart" />
            <Text textStyle="xl" fontWeight="bold" color="neutral.12">
              PetSmart Contextual AI Journeys
            </Text>
          </Flex>
          <Text textStyle="sm" color="neutral.11" lineHeight="tall">
            PetSmart's agent brings non-commercetools inventory, competitive,
            and analytics data directly into the Merchant Center, making sure
            the right person has the right data at the right time to make the
            best decision possible.
          </Text>
        </Box>

        {/* What you're seeing */}
        <Box bg="neutral.2" borderRadius="200" p="300">
          <Text
            textStyle="xs"
            fontWeight="semibold"
            color="neutral.12"
            mb="150"
          >
            What you're seeing
          </Text>
          <Stack gap="100">
            <Flex alignItems="flex-start" gap="150">
              <ProvenanceBadge size="12px" agentSource="ct" />
              <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                <Text as="span" fontWeight="semibold" color="neutral.12">
                  commercetools agent
                </Text>{" "}
                — operates within the MC: promotions, predicate validation,
                campaign simulation, and discount stacking rules.
              </Text>
            </Flex>
            <Flex alignItems="flex-start" gap="150">
              <ProvenanceBadge size="12px" agentSource="petsmart" />
              <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                <Text as="span" fontWeight="semibold" color="neutral.12">
                  PetSmart agent
                </Text>{" "}
                — surfaces external data: inventory days-on-hand, supplier
                costs, margin analysis, competitive intelligence, and web
                analytics.
              </Text>
            </Flex>
          </Stack>
        </Box>

        {/* Personas + legend row */}
        <Flex gap="200" alignItems="center" wrap="wrap">
          {personaList.map((p) => (
            <Flex
              key={p.id}
              alignItems="center"
              gap="150"
              bg="white"
              px="200"
              py="100"
              borderRadius="200"
              borderWidth="1px"
              borderColor="neutral.4"
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

        <Separator />

        {/* Journey cards */}
        <Box>
          <Text
            textStyle="sm"
            fontWeight="semibold"
            color="neutral.12"
            mb="300"
          >
            Click a journey to walk through it
          </Text>
          <Stack gap="300">
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
                  <Text textStyle="md" fontWeight="bold" color="neutral.12">
                    {j.title}
                  </Text>
                  <Badge size="2xs" colorPalette={modeColors[j.mode] as any}>
                    {j.mode}
                  </Badge>
                  <Flex alignItems="center" gap="100" ml="auto" flexShrink={0}>
                    <Box
                      width="400"
                      height="400"
                      borderRadius="full"
                      overflow="hidden"
                      flexShrink={0}
                      bg="neutral.3"
                    >
                      <img
                        src={j.persona.avatarUrl}
                        alt={j.persona.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Text textStyle="xs" color="neutral.10">
                      {j.persona.name}
                    </Text>
                  </Flex>
                </Flex>
                <Text textStyle="xs" color="primary.11" fontWeight="medium">
                  "{j.coreQuestion}"
                </Text>
                <Text textStyle="xs" color="neutral.11" lineHeight="tall">
                  {j.description}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
