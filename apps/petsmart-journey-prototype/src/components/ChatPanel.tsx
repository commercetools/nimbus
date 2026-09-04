import { useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Separator,
  IconButton,
} from "@commercetools/nimbus";
import { Close, ArrowUpward } from "@commercetools/nimbus-icons";
import { ProvenanceBadge } from "./ProvenanceBadge";

import type { ChatMessage } from "../data/chatMessages";

interface ChatPanelProps {
  onClose: () => void;
  agentName?: string;
  messages?: ChatMessage[];
  placeholder?: string;
  /** Context string passed from a ProvenanceIndicator "Chat about this" click */
  whyContext?: string;
}

const AgentMessage = ({ message }: { message: ChatMessage }) => (
  <Box
    pl="300"
    borderLeftWidth="2px"
    borderColor="primary.6"
    css={{ animation: "fadeIn 300ms ease" }}
  >
    {message.agentLabel && (
      <Flex alignItems="center" gap="150" mb="100">
        <ProvenanceBadge size="7px" agentSource="petsmart" />
        <Text textStyle="xs" fontWeight="medium" color="primary.9">
          {message.agentLabel}
        </Text>
      </Flex>
    )}
    <Text textStyle="sm" color="neutral.12" lineHeight="tall">
      {message.content}
    </Text>
    {message.items && (
      <Stack gap="200" mt="200">
        {message.items.map((item, i) => (
          <Box key={i}>
            <Text textStyle="sm" fontWeight="medium" color="neutral.12">
              {item.label}
            </Text>
            <Text textStyle="xs" color="neutral.10">
              {item.detail}
            </Text>
          </Box>
        ))}
      </Stack>
    )}
    {message.footnote && (
      <Text textStyle="xs" color="neutral.9" mt="200">
        {message.footnote}
      </Text>
    )}
  </Box>
);

const UserMessage = ({ message }: { message: ChatMessage }) => (
  <Flex justifyContent="flex-end">
    <Box
      bg="neutral.3"
      borderRadius="300"
      px="300"
      py="200"
      maxWidth="85%"
      css={{ animation: "fadeIn 200ms ease" }}
    >
      <Text textStyle="sm" fontWeight="medium" color="neutral.12">
        {message.content}
      </Text>
    </Box>
  </Flex>
);

/** Renders a contextual "Why?" follow-up when the panel was opened via a provenance indicator */
const WhyContextResponse = ({
  context,
  agentName,
}: {
  context: string;
  agentName: string;
}) => (
  <Box css={{ animation: "fadeIn 400ms ease" }}>
    {/* User's implicit question */}
    <Flex justifyContent="flex-end" mb="400">
      <Box bg="neutral.3" borderRadius="300" px="300" py="200" maxWidth="85%">
        <Text textStyle="sm" fontWeight="medium" color="neutral.12">
          Why this suggestion?
        </Text>
      </Box>
    </Flex>

    {/* Agent's contextual response */}
    <Box pl="300" borderLeftWidth="2px" borderColor="primary.6">
      <Flex alignItems="center" gap="150" mb="100">
        <ProvenanceBadge size="7px" agentSource="petsmart" />
        <Text textStyle="xs" fontWeight="medium" color="primary.9">
          {agentName}
        </Text>
      </Flex>
      <Text textStyle="sm" color="neutral.12" lineHeight="tall">
        {context}
      </Text>
      <Text textStyle="xs" color="neutral.9" mt="200">
        You can ask follow-up questions below, or dismiss this suggestion on the
        page.
      </Text>
    </Box>
  </Box>
);

export const ChatPanel = ({
  onClose,
  agentName = "PetSmart Commerce Intelligence",
  messages = [],
  placeholder = "Ask about this page...",
  whyContext,
}: ChatPanelProps) => {
  // Auto-scroll messages to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, whyContext]);

  return (
    <Flex direction="column" height="100%" overflow="hidden">
      {/* Header */}
      <Flex alignItems="center" gap="200" px="400" py="300" flexShrink={0}>
        <Box
          width="6px"
          height="6px"
          borderRadius="full"
          bg="primary.9"
          flexShrink={0}
        />
        <Text textStyle="sm" fontWeight="semibold" color="neutral.12">
          {agentName}
        </Text>
        <Box flex="1" />
        <IconButton
          aria-label="Close panel"
          variant="ghost"
          size="2xs"
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </Flex>

      <Separator />

      {/* Messages */}
      <Stack gap="500" px="400" py="400" flex="1" overflow="auto">
        {messages.map((msg, i) =>
          msg.sender === "agent" ? (
            <AgentMessage key={i} message={msg} />
          ) : (
            <UserMessage key={i} message={msg} />
          )
        )}
        {/* Contextual "Why?" follow-up from provenance indicator click */}
        {whyContext && (
          <WhyContextResponse context={whyContext} agentName={agentName} />
        )}
        <div ref={messagesEndRef} />
      </Stack>

      <Separator />

      {/* Input */}
      <Flex alignItems="flex-end" gap="100" px="300" py="150" flexShrink={0}>
        <Box flex="1" minWidth="0" width="100%">
          <textarea
            placeholder={placeholder}
            aria-label="Chat input"
            rows={1}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              color: "var(--nimbus-colors-neutral-12)",
              fontSize: "var(--nimbus-font-sizes-sm)",
              lineHeight: "var(--nimbus-line-heights-tall)",
              padding: 0,
              fontFamily: "inherit",
              overflow: "hidden",
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
        </Box>
        <IconButton
          aria-label="Send"
          variant="ghost"
          colorPalette="neutral"
          size="2xs"
          flexShrink={0}
        >
          <ArrowUpward />
        </IconButton>
      </Flex>
    </Flex>
  );
};

// Inject fadeIn animation
if (typeof document !== "undefined") {
  const styleId = "chat-fade-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}
