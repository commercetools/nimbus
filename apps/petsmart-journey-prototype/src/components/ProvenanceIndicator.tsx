import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  Box,
  Flex,
  Text,
  Popover,
  Badge,
  Button,
  Separator,
  Icon,
} from "@commercetools/nimbus";
import { CommercetoolsCube, Pets } from "@commercetools/nimbus-icons";
import type { AgentSource } from "../data/agents";

// ─── Panel context ──────────────────────────────────────────────────────────

type PanelContextValue = {
  /** Open the chat panel, optionally with a contextual "Why?" message */
  openPanel: (whyContext?: string) => void;
};

const PanelContext = createContext<PanelContextValue>({
  openPanel: () => {},
});

export const PanelProvider = ({
  openPanel,
  children,
}: {
  openPanel: (whyContext?: string) => void;
  children: React.ReactNode;
}) => (
  <PanelContext.Provider value={{ openPanel }}>
    {children}
  </PanelContext.Provider>
);

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
  /** Which agent produced this element; drives the indicator's color. Default "ct". */
  agentSource?: AgentSource;
  /** Extra props forwarded from parent (e.g. data-tour) */
  [key: `data-${string}`]: string | undefined;
}

const sourceColors: Record<
  AgentSource,
  { star: string; starHover: string; popoverStar: string }
> = {
  ct: { star: "ctteal.9", starHover: "ctteal.11", popoverStar: "ctteal.11" },
  petsmart: {
    star: "primary.9",
    starHover: "primary.11",
    popoverStar: "primary.11",
  },
};

/**
 * A tiny ✦ star that indicates AI provenance.
 * Click to open a styled popover with agent name, confidence, reasoning, and actions.
 * Color varies by agent source: teal for ct, primary/purple for PetSmart.
 */
export const ProvenanceIndicator = ({
  agentName,
  confidence,
  reason,
  size = "12px",
  pulse = false,
  onWhyClick,
  agentSource = "ct",
  ...rest
}: ProvenanceIndicatorProps) => {
  const { openPanel } = usePanelContext();
  const colors = sourceColors[agentSource];
  const [isPulsing, setIsPulsing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setIsOpen(true), 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setIsOpen(false), 300);
  }, []);

  return (
    <Popover.Root isOpen={isOpen} onOpenChange={setIsOpen} isNonModal>
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
        color={colors.star}
        cursor="pointer"
        flexShrink={0}
        transition="transform 200ms ease, color 200ms ease"
        _hover={{ color: colors.starHover, transform: "scale(1.3)" }}
        animation={isPulsing ? "ai-pulse 600ms ease-out" : undefined}
        onAnimationEnd={handleAnimationEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        ✦
      </Popover.Trigger>
      <Popover.Content
        maxWidth="300px"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box p="200">
          {/* Header: agent name + org icon + confidence */}
          <Flex alignItems="center" gap="150" mb="150">
            <Text
              as="span"
              fontSize="250"
              color={colors.popoverStar}
              lineHeight="1"
            >
              ✦
            </Text>
            <Text textStyle="xs" fontWeight="semibold" color="neutral.12">
              {agentName}
            </Text>
            <Icon
              as={agentSource === "ct" ? CommercetoolsCube : Pets}
              size="2xs"
              color={agentSource === "ct" ? "ctteal.9" : "primary.9"}
              flexShrink={0}
            />
            {confidence !== undefined && (
              <Badge size="2xs" colorPalette="info" ml="auto">
                {confidence}%
              </Badge>
            )}
          </Flex>

          {/* Reasoning */}
          <Text textStyle="xs" color="neutral.11" lineHeight="tall" mb="200">
            {reason ??
              "This element was generated or suggested by the agent based on the current page context."}
          </Text>

          {/* Confidence bar */}
          {confidence !== undefined && (
            <Box mb="200">
              <Flex justifyContent="space-between" mb="50">
                <Text textStyle="xs" color="neutral.9">
                  Confidence
                </Text>
                <Text
                  textStyle="xs"
                  fontWeight="medium"
                  color={
                    confidence >= 80
                      ? "green.11"
                      : confidence >= 60
                        ? "amber.11"
                        : "red.11"
                  }
                >
                  {confidence >= 80
                    ? "High"
                    : confidence >= 60
                      ? "Medium"
                      : "Low"}
                </Text>
              </Flex>
              <Box
                height="3px"
                bg="neutral.4"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height="100%"
                  width={`${confidence}%`}
                  bg={
                    confidence >= 80
                      ? "green.9"
                      : confidence >= 60
                        ? "amber.9"
                        : "red.9"
                  }
                  borderRadius="full"
                />
              </Box>
            </Box>
          )}

          <Separator mb="200" />

          {/* Actions */}
          <Flex gap="100">
            <Button
              variant="ghost"
              size="2xs"
              colorPalette={agentSource === "petsmart" ? "primary" : "info"}
              onPress={handleWhyClick}
            >
              Chat about this
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
