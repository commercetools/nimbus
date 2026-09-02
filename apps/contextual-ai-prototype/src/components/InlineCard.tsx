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
      borderRadius="200"
      overflow="visible"
      width="fit-content"
      maxWidth="100%"
    >
      {/* Card header */}
      <Flex
        alignItems="center"
        gap="150"
        px="300"
        py="150"
        borderBottomWidth="1px"
        borderColor="neutral.4"
        bg="neutral.2"
      >
        <ProvenanceIndicator agentName={agentName} />
        <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
          {title}
        </Text>
        <Box flex="1" />
        {headerRight}
      </Flex>

      {/* Card body */}
      <Box px="300" py="250">
        {children}
      </Box>
    </Box>
  );
};
