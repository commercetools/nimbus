import { Box, Flex, Text } from "@commercetools/nimbus";
import { ProvenanceIndicator } from "./ProvenanceIndicator";
import type { AgentSource } from "../data/agents";
import type { ReactNode } from "react";

interface InlineCardProps {
  title: string;
  agentName: string;
  agentSource?: AgentSource;
  /** Optional right-side header content (badge, count, etc.) */
  headerRight?: ReactNode;
  children: ReactNode;
}

/**
 * Compact analysis card with AI provenance header.
 * Used inside InlineSlot to show agent-generated persistent analysis.
 */
export const InlineCard = ({
  title,
  agentName,
  agentSource = "ct",
  headerRight,
  children,
}: InlineCardProps) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="neutral.6"
      borderRadius="200"
      overflow="visible"
      width="100%"
    >
      {/* Card header — tinted by agent source */}
      <Flex
        alignItems="center"
        gap="150"
        px="200"
        py="100"
        borderBottomWidth="1px"
        borderColor="neutral.4"
        bg={agentSource === "petsmart" ? "primary.2" : "teal.2"}
      >
        <ProvenanceIndicator agentName={agentName} agentSource={agentSource} />
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
          {title}
        </Text>
        <Box flex="1" />
        {headerRight}
      </Flex>

      {/* Card body */}
      <Box px="200" py="150">
        {children}
      </Box>
    </Box>
  );
};
