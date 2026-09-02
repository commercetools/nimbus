import { useState, useEffect, useCallback } from "react";
import { Box, Flex, Text, Tooltip, MakeElementFocusable } from "@commercetools/nimbus";

interface ProvenanceIndicatorProps {
  agentName: string;
  confidence?: number;
  /** Font size for the ✦. Default "8px". */
  size?: string;
  /** When true, plays a one-shot pulse animation */
  pulse?: boolean;
}

/**
 * A tiny ✦ star that indicates AI provenance.
 * Hover shows a tooltip with agent name, confidence, and "Why?" link.
 */
export const ProvenanceIndicator = ({
  agentName,
  confidence,
  size = "12px",
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
        <Text
          as="span"
          fontSize={size}
          lineHeight="1"
          color="indigo.9"
          cursor="help"
          flexShrink={0}
          transition="transform 200ms ease"
          _hover={{ color: "indigo.11", transform: "scale(1.3)" }}
          css={isPulsing ? { animation: "ai-pulse 600ms ease-out" } : undefined}
          onAnimationEnd={handleAnimationEnd}
          aria-hidden="true"
        >
          ✦
        </Text>
      </MakeElementFocusable>
      <Tooltip.Content>
        <Flex direction="column" gap="100" maxWidth="220px">
          <Flex alignItems="center" gap="150">
            <Text as="span" fontSize="7px" color="indigo.9" lineHeight="1">✦</Text>
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
        0% { transform: scale(1); }
        40% { transform: scale(1.5); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
}
