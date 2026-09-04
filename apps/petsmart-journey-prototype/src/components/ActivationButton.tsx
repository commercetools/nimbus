import { Flex, Text } from "@commercetools/nimbus";
import { ProvenanceBadge } from "./ProvenanceBadge";
import type { AgentSource } from "../data/agents";

interface ActivationButtonProps {
  label: string;
  agentSource?: AgentSource;
  onClick?: () => void;
  [key: `data-${string}`]: string | undefined;
}

const sourceBgColors: Record<
  AgentSource,
  { bg: string; hover: string; fg: string }
> = {
  ct: { bg: "ctteal.3", hover: "ctteal.4", fg: "ctteal.11" },
  petsmart: { bg: "primary.3", hover: "primary.4", fg: "primary.11" },
};

/**
 * A small AI-action button that appears inline in form fields or toolbars.
 * Represents an agent-provided activation with provenance badge.
 */
export const ActivationButton = ({
  label,
  agentSource = "ct",
  onClick,
  ...rest
}: ActivationButtonProps) => {
  const colors = sourceBgColors[agentSource];
  return (
    <Flex
      as="button"
      alignItems="center"
      gap="100"
      px="200"
      py="50"
      borderRadius="100"
      bg={colors.bg}
      cursor="pointer"
      flexShrink={0}
      transition="background 150ms"
      _hover={{ bg: colors.hover }}
      onClick={onClick}
      border="none"
      {...rest}
    >
      <ProvenanceBadge size="10px" agentSource={agentSource} />
      <Text
        fontSize="11px"
        fontWeight="medium"
        color={colors.fg}
        lineHeight="1"
        whiteSpace="nowrap"
      >
        {label}
      </Text>
    </Flex>
  );
};
