import { useState, useEffect } from "react";
import { Flex, Text } from "@commercetools/nimbus";

interface FloatingChatButtonProps {
  /** When true, the button pulses to indicate the agent has something to discuss */
  pulse?: boolean;
  onClick: () => void;
}

/**
 * Persistent ✦ button at the bottom-left of every page.
 * Opens the chat panel. Pulses when the agent has contextual suggestions.
 */
export const FloatingChatButton = ({
  pulse = false,
  onClick,
}: FloatingChatButtonProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (pulse) {
      setIsPulsing(true);
      const interval = setInterval(() => {
        setIsPulsing((prev) => !prev);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setIsPulsing(false);
    }
  }, [pulse]);

  return (
    <Flex
      as="button"
      position="fixed"
      bottom="16px"
      right="16px"
      width="28px"
      height="28px"
      borderRadius="full"
      bg="primary.9"
      color="white"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      shadow="md"
      border="none"
      zIndex={50}
      transition="transform 200ms ease, box-shadow 200ms ease"
      _hover={{ transform: "scale(1.1)", shadow: "lg" }}
      onClick={onClick}
      css={
        isPulsing
          ? { animation: "chatBtnPulse 2s ease-in-out infinite" }
          : undefined
      }
    >
      <Text fontSize="12px" lineHeight="1">
        ✦
      </Text>
    </Flex>
  );
};

// Inject pulse keyframes
if (typeof document !== "undefined") {
  const styleId = "chat-btn-pulse-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes chatBtnPulse {
        0%, 100% { box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        50% { box-shadow: 0 4px 14px rgba(0,0,0,0.15), 0 0 0 8px rgba(124, 58, 237, 0.2); }
      }
    `;
    document.head.appendChild(style);
  }
}
