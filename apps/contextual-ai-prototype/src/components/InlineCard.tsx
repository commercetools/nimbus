import { Box, Flex, Text } from "@commercetools/nimbus";
import { ProvenanceIndicator } from "./ProvenanceIndicator";
import type { ReactNode } from "react";

interface InlineCardProps {
  title: string;
  agentName: string;
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
  headerRight,
  children,
}: InlineCardProps) => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="neutral.6"
      borderRadius="300"
      overflow="hidden"
      flex="1"
      minWidth="0"
    >
      {/* Card header */}
      <Flex
        alignItems="center"
        gap="200"
        px="400"
        py="200"
        borderBottomWidth="1px"
        borderColor="neutral.4"
        bg="neutral.2"
      >
        <ProvenanceIndicator agentName={agentName} size={11} />
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
          {title}
        </Text>
        <Box flex="1" />
        {headerRight}
      </Flex>

      {/* Card body */}
      <Box px="400" py="300">
        {children}
      </Box>
    </Box>
  );
};
