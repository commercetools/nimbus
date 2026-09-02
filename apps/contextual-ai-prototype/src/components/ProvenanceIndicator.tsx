import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Box, Flex, Text, Popover, Badge, Button, Separator } from "@commercetools/nimbus";

// ─── Panel context ──────────────────────────────────────────────────────────

type PanelContextValue = {
  /** Open the chat panel, optionally with a contextual "Why?" message */
  openPanel: (whyContext?: string) => void;
};

const PanelContext = createContext<PanelContextValue>({ openPanel: () => {} });

export const PanelProvider = ({
  openPanel,
  children,
}: {
  openPanel: (whyContext?: string) => void;
  children: React.ReactNode;
}) => <PanelContext.Provider value={{ openPanel }}>{children}</PanelContext.Provider>;

export const usePanelContext = () => useContext(PanelContext);

// ─── ProvenanceIndicator ────────────────────────────────────────────────────

interface ProvenanceIndicatorProps {
  agentName: string;
  confidence?: number;
  /** One-line reasoning summary shown in the popover */
  reason?: string;
  /** Font size for the ✦. Default "12px". */
  size?: string;
  /** When true, plays a one-shot pulse animation */
  pulse?: boolean;
  /** Explicit callback; falls back to PanelContext.openPanel */
  onWhyClick?: () => void;
  /** Extra props forwarded from parent (e.g. data-tour) */
  [key: `data-${string}`]: string | undefined;
}

/**
 * A tiny ✦ star that indicates AI provenance.
 * Click to open a styled popover with agent name, confidence, reasoning, and actions.
 */
export const ProvenanceIndicator = ({
  agentName,
  confidence,
  reason,
  size = "12px",
  pulse = false,
  onWhyClick,
  ...rest
}: ProvenanceIndicatorProps) => {
  const { openPanel } = usePanelContext();
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

  const handleWhyClick = useCallback(() => {
    if (onWhyClick) {
      onWhyClick();
    } else {
      const parts = [agentName];
      if (confidence !== undefined) parts.push(`${confidence}% confidence`);
      if (reason) parts.push(reason);
      openPanel(parts.join(" · "));
    }
  }, [onWhyClick, openPanel, agentName, confidence, reason]);

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="AI provenance"
        bg="transparent"
        borderWidth="0"
        p="0"
        minWidth="auto"
        minHeight="auto"
        height="auto"
        fontSize={size}
        lineHeight="1"
        color="indigo.9"
        cursor="pointer"
        flexShrink={0}
        transition="transform 200ms ease, color 200ms ease"
        _hover={{ color: "indigo.11", transform: "scale(1.3)" }}
        animation={isPulsing ? "ai-pulse 600ms ease-out" : undefined}
        onAnimationEnd={handleAnimationEnd}
      >
        ✦
      </Popover.Trigger>
      <Popover.Content maxWidth="300px">
        <Box p="200">
          {/* Header: agent name + confidence badge */}
          <Flex alignItems="center" gap="150" mb="150">
            <Text as="span" fontSize="10px" color="indigo.9" lineHeight="1">✦</Text>
            <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
              {agentName}
            </Text>
            {confidence !== undefined && (
              <Badge size="2xs" colorPalette="info" ml="auto">{confidence}%</Badge>
            )}
          </Flex>

          {/* Reasoning */}
          {reason && (
            <Text textStyle="xs" color="neutral.11" lineHeight="tall" mb="200">
              {reason}
            </Text>
          )}

          {/* Confidence bar */}
          {confidence !== undefined && (
            <Box mb="200">
              <Flex justifyContent="space-between" mb="50">
                <Text textStyle="xs" color="neutral.9">Confidence</Text>
                <Text textStyle="xs" fontWeight="medium" color={confidence >= 80 ? "green.11" : confidence >= 60 ? "amber.11" : "red.11"}>
                  {confidence >= 80 ? "High" : confidence >= 60 ? "Medium" : "Low"}
                </Text>
              </Flex>
              <Box height="3px" bg="neutral.4" borderRadius="full" overflow="hidden">
                <Box
                  height="100%"
                  width={`${confidence}%`}
                  bg={confidence >= 80 ? "green.9" : confidence >= 60 ? "amber.9" : "red.9"}
                  borderRadius="full"
                />
              </Box>
            </Box>
          )}

          <Separator mb="200" />

          {/* Actions */}
          <Flex gap="200">
            <Button variant="outline" size="2xs" colorPalette="primary" onPress={handleWhyClick}>
              Ask why
            </Button>
            <Button variant="ghost" size="2xs">
              Dismiss
            </Button>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
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
