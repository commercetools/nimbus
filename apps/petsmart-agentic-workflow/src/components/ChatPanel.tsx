import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import { Box, Flex, Stack, Text, Separator, IconButton, MultilineTextInput, Badge } from "@commercetools/nimbus";
import { Close, ArrowUpward } from "@commercetools/nimbus-icons";
import { AiDot } from "./AiDot";

/** Simple markdown-like renderer for chat content: **bold**, bullets (•), [Sources: ...], ✓/⚠️ status */
const RichContent = ({ text }: { text: string }) => {
  // Split into paragraphs on double newlines
  const paragraphs = text.split("\n\n");
  const elements: ReactNode[] = [];

  paragraphs.forEach((para, pi) => {
    const trimmed = para.trim();
    if (!trimmed) return;

    // Sources footnote
    if (trimmed.startsWith("[Sources:") || trimmed.startsWith("[Source:")) {
      const sourceText = trimmed.replace(/^\[Sources?:\s*/, "").replace(/\]$/, "");
      elements.push(
        <Flex key={pi} gap="100" flexWrap="wrap" mt="100">
          {sourceText.split(",").map((s, i) => (
            <Badge key={i} size="2xs" colorPalette="neutral">{s.trim().replace(/[()]/g, "")}</Badge>
          ))}
        </Flex>
      );
      return;
    }

    // Check for bullet lines
    const lines = trimmed.split("\n");
    const isBulletBlock = lines.every((l) => l.trim().startsWith("•") || l.trim().startsWith("- "));

    if (isBulletBlock) {
      elements.push(
        <Stack key={pi} gap="50" pl="200">
          {lines.map((line, li) => {
            const bulletText = line.trim().replace(/^[•\-]\s*/, "");
            return (
              <Flex key={li} gap="100" alignItems="flex-start">
                <Text textStyle="xs" color="neutral.9" flexShrink={0}>•</Text>
                <Text textStyle="xs" color="neutral.12" lineHeight="tall">{renderInline(bulletText)}</Text>
              </Flex>
            );
          })}
        </Stack>
      );
      return;
    }

    // Regular paragraph (may contain single newlines as line breaks)
    elements.push(
      <Text key={pi} textStyle="xs" color="neutral.12" lineHeight="tall">
        {lines.map((line, li) => (
          <Text as="span" key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </Text>
        ))}
      </Text>
    );
  });

  return <Stack gap="200">{elements}</Stack>;
};

/** Render inline formatting: **bold**, ✓, ⚠️ */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Text as="span" key={match.index} fontWeight="semibold">{match[1]}</Text>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export interface ChatMessage {
  sender: "agent" | "user";
  agentLabel?: string;
  content: string;
  /** Rich JSX content rendered after the text content. Use for Nimbus components (stat tiles, badges, tables). */
  richContent?: ReactNode;
  items?: { label: string; detail: string }[];
  footnote?: string;
}

interface ChatPanelProps {
  onClose: () => void;
  agentName?: string;
  messages?: ChatMessage[];
  placeholder?: string;
  /** Context string passed from a ProvenanceIndicator "Why?" click */
  whyContext?: string;
  /** When true, messages reveal progressively with typing animation in the input */
  progressive?: boolean;
  /** Number of messages to show immediately (carried from previous pages) */
  carriedCount?: number;
}

/** Hook: progressively reveals messages with typing-in-input animation.
 *  Uses a single imperative timer chain to avoid effect re-fire issues. */
function useProgressiveReveal(messages: ChatMessage[], active: boolean, carriedCount: number) {
  const [revealedCount, setRevealedCount] = useState(active ? carriedCount : messages.length);
  const [inputText, setInputText] = useState("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clear any previous animation
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!active) { setRevealedCount(messages.length); setInputText(""); return; }

    // Start from carriedCount (previously shown messages)
    let shown = carriedCount;
    setRevealedCount(shown);
    setInputText("");


    // Build the entire animation timeline upfront
    let delay = 400; // initial pause

    for (let i = carriedCount; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.sender === "user") {
        // Show text in input
        const showDelay = delay;
        timersRef.current.push(setTimeout(() => setInputText(msg.content), showDelay));
        delay += 1500;
        // Clear input, reveal as bubble
        const sendDelay = delay;
        const sendIdx = i + 1;
        timersRef.current.push(setTimeout(() => {
          setInputText("");
          setRevealedCount(sendIdx);
        }, sendDelay));
        delay += 400;
      } else {
        // Reveal agent response
        const revealDelay = delay;
        const revealIdx = i + 1;
        timersRef.current.push(setTimeout(() => setRevealedCount(revealIdx), revealDelay));
        delay += 800;
      }
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [messages, active, carriedCount]);

  return {
    visibleMessages: messages.slice(0, revealedCount),
    inputText,
    isAnimating: active && revealedCount < messages.length,
  };
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
        <AiDot size="7px" />
        <Text textStyle="xs" fontWeight="medium" color="primary.9">
          {message.agentLabel}
        </Text>
      </Flex>
    )}
    {message.content && <RichContent text={message.content} />}
    {message.richContent}
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
const WhyContextResponse = ({ context, agentName }: { context: string; agentName: string }) => (
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
    <Box pl="300" borderLeftWidth="2px" borderColor="indigo.6">
      <Flex alignItems="center" gap="150" mb="100">
        <AiDot size="7px" />
        <Text textStyle="xs" fontWeight="medium" color="primary.9">
          {agentName}
        </Text>
      </Flex>
      <Text textStyle="sm" color="neutral.12" lineHeight="tall">
        {context}
      </Text>
      <Text textStyle="xs" color="neutral.9" mt="200">
        You can ask follow-up questions below, or dismiss this suggestion on the page.
      </Text>
    </Box>
  </Box>
);

export const ChatPanel = ({
  onClose,
  agentName = "Product Enrichment",
  messages = [],
  placeholder = "Ask about this product...",
  whyContext,
  progressive = false,
  carriedCount = 0,
}: ChatPanelProps) => {
  const { visibleMessages, inputText, isAnimating } = useProgressiveReveal(messages, progressive, carriedCount);
  const displayMessages = progressive ? visibleMessages : messages;

  // Always scroll to the bottom so the latest message is visible
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    });
  }, [displayMessages.length, whyContext]);

  return (
    <Flex direction="column" position="absolute" top="0" left="0" right="0" bottom="0" overflow="hidden">
      {/* Header */}
      <Flex
        alignItems="center"
        gap="200"
        px="400"
        py="300"
        flexShrink={0}
      >
        <Box
          width="6px"
          height="6px"
          borderRadius="full"
          bg="indigo.9"
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
      <Stack
        ref={messagesContainerRef}
        gap="500"
        px="400"
        py="400"
        flex="1"
        minHeight="0"
        overflow="auto"
      >
        {displayMessages.map((msg, i) =>
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
      </Stack>

      <Separator />

      {/* Input */}
      <Flex
        alignItems="flex-end"
        gap="100"
        px="300"
        py="250"
        flexShrink={0}
        maxHeight="max-content"
        borderTopWidth="1px"
        borderColor="neutral.4"
      >
        <Box minWidth="0" width="100%">
          <MultilineTextInput
            placeholder={inputText ? undefined : placeholder}
            value={inputText}
            aria-label="Chat input"
            variant="ghost"
            size="sm"
            rows={1}
            autoGrow
            width="100%"
            isReadOnly={isAnimating}
          />
        </Box>
        <IconButton
          aria-label="Send"
          variant="ghost"
          colorPalette={inputText ? "primary" : "neutral"}
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
