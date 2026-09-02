import { useState, useEffect, useCallback } from "react";
import { Box, Flex, Text, Tooltip, Icon, MakeElementFocusable } from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";

type IconSize = "2xs" | "xs" | "sm" | "md";

interface ProvenanceIndicatorProps {
  agentName: string;
  confidence?: number;
  /** Nimbus Icon size token */
  iconSize?: IconSize;
  /** When true, plays a one-shot pulse animation */
  pulse?: boolean;
}

export const ProvenanceIndicator = ({
  agentName,
  confidence,
  iconSize = "2xs",
  pulse = false,
}: ProvenanceIndicatorProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulse) {
      setIsPulsing(true);
      const timeout = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [pulse]);

  const handleAnimationEnd = useCallback(() => {
    setIsPulsing(false);
  }, []);

  return (
    <Tooltip.Root>
      <MakeElementFocusable>
        <Box
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          color="indigo.8"
          cursor="help"
          flexShrink={0}
          transition="transform 200ms ease, filter 200ms ease"
          _hover={{ color: "indigo.11", transform: "scale(1.15)" }}
          css={
            isPulsing
              ? { animation: "ai-pulse 600ms ease-out" }
              : undefined
          }
          onAnimationEnd={handleAnimationEnd}
        >
          <Icon as={AutoAwesome} boxSize="350" />
        </Box>
      </MakeElementFocusable>
      <Tooltip.Content>
        <Flex direction="column" gap="100" maxWidth="220px">
          <Flex alignItems="center" gap="100">
            <Icon as={AutoAwesome} size="2xs" />
            <Text textStyle="xs" fontWeight="semibold">
              {agentName}
            </Text>
          </Flex>
          {confidence !== undefined && (
            <Text textStyle="xs" color="neutral.11">
              {confidence}% confidence
            </Text>
          )}
          <Text
            textStyle="xs"
            color="indigo.11"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            Why this suggestion?
          </Text>
        </Flex>
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

// Inject the keyframes globally (once)
if (typeof document !== "undefined") {
  const styleId = "ai-pulse-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes ai-pulse {
        0% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
        40% { transform: scale(1.3); filter: drop-shadow(0 0 6px rgba(110, 86, 207, 0.4)); }
        100% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
      }
    `;
    document.head.appendChild(style);
  }
}
