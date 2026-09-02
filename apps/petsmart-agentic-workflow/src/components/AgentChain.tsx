import { useState } from "react";
import { Box, Flex, Stack, Text, Button } from "@commercetools/nimbus";
import type { AgentSource } from "../data/agents";

interface AgentContribution {
  agentName: string;
  source: AgentSource;
  contribution: string;
}

interface AgentChainProps {
  contributions: AgentContribution[];
  /** Start expanded (used on approval step) */
  defaultExpanded?: boolean;
}

const sourceColor = (source: AgentSource) =>
  source === "ct" ? "ctteal" : "primary";

/**
 * Shows which downstream agents the Orchestrator called, with their
 * individual contributions. Used inside InlineCards in Orchestrated mode.
 */
export const AgentChain = ({
  contributions,
  defaultExpanded = false,
}: AgentChainProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box mt="200">
      <Button variant="ghost" size="2xs" onPress={() => setExpanded(!expanded)}>
        {expanded ? "▾" : "▸"} Powered by {contributions.length} agents
      </Button>

      {expanded && (
        <Stack
          gap="150"
          mt="150"
          pl="200"
          borderLeftWidth="2px"
          borderColor="neutral.4"
        >
          {contributions.map((c, i) => (
            <Flex key={i} gap="200" alignItems="flex-start">
              <Text
                as="span"
                fontSize="10px"
                lineHeight="1"
                color={`${sourceColor(c.source)}.9`}
                flexShrink={0}
                mt="50"
              >
                ✦
              </Text>
              <Box>
                <Text
                  textStyle="xs"
                  fontWeight="semibold"
                  color={`${sourceColor(c.source)}.11`}
                >
                  {c.agentName}
                </Text>
                <Text textStyle="xs" color="neutral.10">
                  {c.contribution}
                </Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
    </Box>
  );
};
