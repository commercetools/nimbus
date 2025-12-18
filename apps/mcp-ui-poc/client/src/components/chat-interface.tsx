import { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Flex,
  Heading,
  Text,
  Badge,
  Switch,
} from "@commercetools/nimbus";
import { isUIResource } from "@mcp-ui/client";
import { ClaudeClient } from "../lib/claude-client";
import { ChatInput } from "./chat-input";
import { ChatLoadingIndicator } from "./chat-loading-indicator";
import type { Message } from "../types/virtual-dom";
import {
  StructuredDomRenderer,
  type StructuredDomContent,
  type Intent,
} from "./structured-dom-renderer";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [claudeClient] = useState(() => new ClaudeClient());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [uiToolsEnabled, setUiToolsEnabled] = useState(true);
  const [commerceToolsEnabled, setCommerceToolsEnabled] = useState(true);
  const [serverStats, setServerStats] = useState({ ui: 0, commerce: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    // Immediate scroll for text content
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Delayed scroll to account for UI resource rendering
    // UI resources may take time to render, so we scroll again after a short delay
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  // Note: Form submission is now handled via intent system
  // Submit buttons with intents automatically capture form data
  // No need for global form interceptor anymore

  // Initialize Claude client
  useEffect(() => {
    async function init() {
      try {
        // Initialize Claude with MCP
        await claudeClient.initialize();

        // Get server stats
        const stats = claudeClient.getServerStats();
        setServerStats(stats);
        console.log("📊 Server stats:", stats);

        setIsReady(true);
      } catch (error) {
        console.error("❌ Initialization failed:", error);
        setInitError((error as Error).message);
      }
    }
    init();

    // Cleanup on unmount
    return () => {
      claudeClient.cleanup();
    };
  }, [claudeClient]);

  async function handleSendMessage(message: string) {
    if (!message.trim() || !isReady) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build message history for context (only text content)
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content || "",
      }));

      // Send message - Claude handles all tool calling automatically
      const { text, uiResources } = await claudeClient.sendMessage(message, {
        uiToolsEnabled,
        commerceToolsEnabled,
        messageHistory,
      });

      // Add response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text,
          uiResources,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${(error as Error).message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle intents emitted from UI components
  async function handleIntentEmit(intent: Intent) {
    console.log("🎯 Intent received:", intent);

    // Combine description + structured payload for Claude
    const message = `${intent.description}

[Intent Context]
Type: ${intent.type}
Payload: ${JSON.stringify(intent.payload, null, 2)}`;

    console.log("💬 Forwarding intent to Claude:", message);

    // Add user message to chat (show cleaner version to user)
    const userMessage: Message = {
      role: "user",
      content: `[Intent: ${intent.type}] ${intent.description}`,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Build message history for context
      const messageHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content || "",
      }));

      // Send to Claude with full description + payload
      const { text, uiResources } = await claudeClient.sendMessage(message, {
        uiToolsEnabled,
        commerceToolsEnabled,
        messageHistory,
      });

      // Add Claude's response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: text,
          uiResources,
        },
      ]);

      console.log("✅ Intent processed successfully");
    } catch (error) {
      console.error("❌ Error handling intent:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${(error as Error).message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Show initialization error if present
  if (initError) {
    return (
      <Flex
        direction="column"
        height="100vh"
        padding="600"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          padding="600"
          backgroundColor="critical.2"
          borderRadius="200"
          maxWidth="600px"
        >
          <Heading size="md" marginBottom="400" color="critical.11">
            Initialization Error
          </Heading>
          <Text color="critical.11">{initError}</Text>
          <Text marginTop="300" fontSize="sm" color="critical.10">
            Make sure the MCP-UI server is running and Claude API key is
            configured.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100vh" padding="600">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="600"
        flexWrap="wrap"
        gap="200"
      >
        <Flex alignItems="center" gap="400" flexWrap="wrap">
          <Heading>Nimbus MCP-UI + Claude Chat</Heading>
          {isReady && (
            <Flex gap="200">
              <Badge colorPalette="primary" size="xs">
                UI Tools: {serverStats.ui}
              </Badge>
              <Badge colorPalette="neutral" size="xs">
                Commerce Tools: {serverStats.commerce}
              </Badge>
              <Badge colorPalette="positive" size="xs">
                Total: {serverStats.ui + serverStats.commerce}
              </Badge>
            </Flex>
          )}
        </Flex>
        <Box alignItems="center" gap="400">
          <Flex alignItems="center" justifyContent="space-between" gap="300">
            <Text fontSize="350">{`Nimbus MCP-UI ${uiToolsEnabled ? "Enabled" : "Disabled"}`}</Text>
            <Switch
              size="sm"
              aria-label="enable ui mcp"
              defaultSelected={uiToolsEnabled}
              onChange={(checked) => setUiToolsEnabled(checked)}
              isDisabled={!isReady}
            />
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" gap="300">
            <Text fontSize="350">{`Commerce MCP ${commerceToolsEnabled ? "Enabled" : "Disabled"}`}</Text>
            <Switch
              size="sm"
              aria-label="enable commerce mcp"
              defaultSelected={commerceToolsEnabled}
              onChange={(checked) => setCommerceToolsEnabled(checked)}
              isDisabled={!isReady}
            />
          </Flex>
        </Box>
      </Flex>

      {!isReady && (
        <Box
          padding="400"
          backgroundColor="neutral.2"
          borderRadius="200"
          marginBottom="400"
        >
          <Text>Initializing...</Text>
        </Box>
      )}

      <Stack
        direction="column"
        gap="400"
        flex="1"
        overflowY="auto"
        marginBottom="400"
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            padding="400"
            backgroundColor={msg.role === "user" ? "primary.2" : "neutral.2"}
            borderRadius="200"
            maxW={msg.role === "user" ? "max-content" : "100%"}
            width={msg.role === "assistant" ? "100%" : undefined}
            alignSelf={msg.role === "user" ? "flex-end" : undefined}
          >
            <Text fontWeight="bold" marginBottom="200">
              {msg.role === "user" ? "You" : "Assistant"}
            </Text>

            {msg.content && <Text>{msg.content}</Text>}

            {msg.uiResources?.map((resource, i) => {
              console.log("🔍 Checking resource:", resource);
              console.log("🔍 isUIResource result:", isUIResource(resource));

              if (!isUIResource(resource)) {
                return (
                  <Box
                    key={i}
                    marginTop="300"
                    padding="400"
                    backgroundColor="critical.2"
                  >
                    <Text color="critical.11">
                      Failed to render UI resource (not recognized as
                      UIResource)
                    </Text>
                    <Text fontSize="sm" color="critical.10">
                      {JSON.stringify(resource, null, 2)}
                    </Text>
                  </Box>
                );
              }

              try {
                console.log("🎨 Rendering UIResource:", resource.resource.uri);

                // Parse structured DOM content
                const parsedContent = JSON.parse(
                  resource.resource.text
                ) as StructuredDomContent;

                console.log("✨ Using StructuredDomRenderer");
                return (
                  <Box key={i} marginTop="300">
                    <StructuredDomRenderer
                      content={parsedContent}
                      onIntentEmit={handleIntentEmit}
                    />
                  </Box>
                );
              } catch (error) {
                console.error("❌ Error rendering UIResource:", error);
                return (
                  <Box
                    key={i}
                    marginTop="300"
                    padding="400"
                    backgroundColor="critical.2"
                  >
                    <Text color="critical.11">Error rendering UI resource</Text>
                    <Text fontSize="sm" color="critical.10">
                      {(error as Error).message}
                    </Text>
                  </Box>
                );
              }
            })}
          </Box>
        ))}

        {/* Loading indicator */}
        {isLoading && <ChatLoadingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </Stack>
      <ChatInput
        onSend={handleSendMessage}
        isDisabled={isLoading || !isReady}
        autoFocus={isReady}
      />
    </Flex>
  );
}
