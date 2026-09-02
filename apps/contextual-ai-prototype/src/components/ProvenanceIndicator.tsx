import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { Box, Flex, Text, Tooltip, MakeElementFocusable } from "@commercetools/nimbus";

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
  /** One-line reasoning summary shown in the tooltip */
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
 * Hover shows a tooltip with agent name, confidence, reasoning, and "Why?" link.
 * Clicking "Why this suggestion?" opens the chat panel with contextual response.
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
      // Build contextual "Why?" message from props
      const parts = [agentName];
      if (confidence !== undefined) parts.push(`${confidence}% confidence`);
      if (reason) parts.push(reason);
      openPanel(parts.join(" · "));
    }
  }, [onWhyClick, openPanel, agentName, confidence, reason]);

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
          {...rest}
        >
          ✦
        </Text>
      </MakeElementFocusable>
      <Tooltip.Content>
        <Flex direction="column" gap="100" maxWidth="240px">
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
          {reason && (
            <Text textStyle="xs" color="neutral.11" lineHeight="snug">
              {reason}
            </Text>
          )}
          <Text
            as="span"
            textStyle="xs"
            color="indigo.11"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={handleWhyClick}
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
