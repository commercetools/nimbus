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
import { UIErrorBoundary } from "./ui-error-boundary";
import { useMutationStream } from "../hooks/use-mutation-stream";
import {
  onActionQueued,
  sendActionResponse,
} from "../hooks/use-remote-connection";
import type { Message, UIResource } from "../types/virtual-dom";
import {
  RemoteDomRenderer,
  type RemoteDomContent,
} from "./remote-dom-renderer";

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
  const currentStreamingMessageIndexRef = useRef<number>(null);

  // WebSocket connection for real-time mutations
  const mutationStream = useMutationStream(
    import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001"
  );

  // Register callback for action notifications from UI interactions
  useEffect(() => {
    onActionQueued(async (action) => {
      console.log("🎯 Action queued from UI interaction:", action);

      // Execute silently - no chat messages, just update the component
      try {
        // Compact message history for action execution too
        const messageHistory = compactMessageHistory(messages);

        // Determine instruction based on action type
        let toolInstruction: string;

        if (
          action.toolName === "claude-instruction" &&
          action.params.instruction
        ) {
          // Instruction-based action - send custom instruction directly
          // The instruction already includes "do not create UI" from server
          toolInstruction = action.params.instruction as string;
          console.log("📝 Using custom instruction:", toolInstruction);
        } else {
          // Direct tool call - use generic instruction
          toolInstruction = `Execute the MCP tool ${action.toolName} with these exact parameters: ${JSON.stringify(action.params)}. IMPORTANT: Do NOT generate any UI components, just execute the tool and return the result.`;
        }

        // Disable UI tools during action execution to prevent duplicate UI creation
        // Claude should ONLY execute commerce tools, not create new UI components
        const { text, uiResources } = await claudeClient.sendMessage(
          toolInstruction,
          {
            uiToolsEnabled: false, // DISABLED - prevents duplicate UI
            commerceToolsEnabled,
            messageHistory,
          }
        );

        // Check if the text response contains an error message
        // Commerce tools return errors as text like "Error executing tool 'method': message"
        console.log("🔍 Checking text for errors:", text);

        const isErrorResponse =
          text &&
          (text.includes("Error executing tool") ||
            text.includes("Failed to") ||
            text.includes("SDKError:") ||
            text.includes("A duplicate value"));

        console.log("🔍 Is error response?", isErrorResponse);

        if (isErrorResponse) {
          console.log("⚠️ Detected error in tool response:", text);

          // Extract just the error message (remove SDK noise)
          let errorMessage = text;
          const match = text.match(/Failed to [^:]+: ([^-]+)/);
          if (match) {
            errorMessage = match[1].trim();
          }

          // Send as error instead of result
          sendActionResponse(action.id, undefined, {
            message: errorMessage,
          });
        } else {
          // Send successful result back to server (triggers callback in action queue)
          sendActionResponse(action.id, { text, uiResources });
        }

        // Do NOT add messages to chat - silent execution
      } catch (error) {
        console.error("Error executing action:", error);

        // Send error response back to server
        sendActionResponse(action.id, undefined, {
          message: (error as Error).message,
        });

        // Do NOT add error messages to chat - errors are shown in component
      }
    });
  }, [messages, claudeClient, uiToolsEnabled, commerceToolsEnabled]);

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

  // Compact message history to prevent context bloat
  function compactMessageHistory(
    messages: Message[]
  ): { role: "user" | "assistant"; content: string }[] {
    // Keep last 5 messages intact, summarize older ones
    const keepRecent = 5;

    if (messages.length <= keepRecent) {
      return messages.map((msg) => ({
        role: msg.role,
        content: msg.content || "",
      }));
    }

    const oldMessages = messages.slice(0, -keepRecent);
    const recentMessages = messages.slice(-keepRecent);

    // Create summary of old messages
    const summary = `[Previous conversation summary: User asked about ${oldMessages.filter((m) => m.role === "user").length} topics. Data was displayed using UI components.]`;

    return [
      { role: "assistant" as const, content: summary },
      ...recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content || "",
      })),
    ];
  }

  async function handleSendMessage(message: string) {
    if (!message.trim() || !isReady) return;

    const userMessage: Message = { role: "user", content: message };

    // Add user message AND a streaming assistant message placeholder
    const streamingMessage: Message = {
      role: "assistant",
      content: "",
      uiResources: [],
    };

    setMessages((prev) => [...prev, userMessage, streamingMessage]);
    setIsLoading(true);

    // Track the streaming message index for updates
    const streamingMessageIndex = messages.length + 1; // +1 for user message we just added
    currentStreamingMessageIndexRef.current = streamingMessageIndex;

    try {
      // Compact history to keep context focused (every 5+ messages)
      const compactedHistory = compactMessageHistory([
        ...messages,
        userMessage,
      ]);

      console.log(
        `📜 Message history: ${messages.length + 1} total, ${compactedHistory.length} after compaction`
      );

      // Stream UI resources as they're created
      const handleUIResource = (resource: UIResource) => {
        console.log("⚡ Streaming UI resource to chat:", resource.resource.uri);
        console.log("⚡ Target index:", streamingMessageIndex);
        setMessages((prev) => {
          const newMessages = prev.map((msg, idx) =>
            idx === streamingMessageIndex && msg.role === "assistant"
              ? {
                  ...msg,
                  uiResources: [...(msg.uiResources || []), resource],
                }
              : msg
          );
          console.log(
            "⚡ After adding resource, message has",
            newMessages[streamingMessageIndex]?.uiResources?.length,
            "resources"
          );
          return newMessages;
        });
      };

      // Send message with streaming callback
      const { text } = await claudeClient.sendMessage(message, {
        uiToolsEnabled,
        commerceToolsEnabled,
        messageHistory: compactedHistory,
        onUIResource: handleUIResource,
      });

      // Update final message with text only (UI resources already streamed)
      console.log(
        "📝 Final update - setting text content, preserving UI resources"
      );
      setMessages((prev) => {
        const targetMsg = prev[streamingMessageIndex];
        console.log(
          "📝 Before final update, message has",
          targetMsg?.uiResources?.length,
          "resources"
        );
        const newMessages = prev.map((msg, idx) =>
          idx === streamingMessageIndex && msg.role === "assistant"
            ? { ...msg, content: text }
            : msg
        );
        console.log(
          "📝 After final update, message has",
          newMessages[streamingMessageIndex]?.uiResources?.length,
          "resources"
        );
        return newMessages;
      });
    } catch (error) {
      console.error("Error:", error);
      // Use immutable update pattern to ensure React detects the change
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === streamingMessageIndex && msg.role === "assistant"
            ? { ...msg, content: `Error: ${(error as Error).message}` }
            : msg
        )
      );
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
              <Badge
                colorPalette={
                  mutationStream.isConnected ? "positive" : "critical"
                }
                size="xs"
              >
                {mutationStream.isConnected ? "⚡ Live" : "⚠️ Offline"}
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

      {/* Global toaster for notifications */}
      <RemoteDomRenderer
        content={{ type: "remoteDom", tree: null, framework: "react" }}
        uri="ui://global-toaster"
      />

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
            maxW="max-content"
            // width={msg.role === "assistant" ? "100%" : undefined}
            alignSelf={msg.role === "user" ? "flex-end" : undefined}
          >
            <Flex gap="200" alignItems="center">
              <Text fontWeight="bold">
                {msg.role === "user" ? "You" : "Assistant"}
              </Text>
              {idx === currentStreamingMessageIndexRef.current &&
                msg.role !== "user" &&
                isLoading && <ChatLoadingIndicator />}
            </Flex>

            {msg.content && <Text>{msg.content}</Text>}

            {msg.uiResources?.map((resource, i) => {
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
                // Parse Remote DOM content
                const parsedContent = JSON.parse(
                  resource.resource.text
                ) as RemoteDomContent;

                // Render with hybrid MCP snapshot + WebSocket live updates
                return (
                  <Box key={i} marginTop="300">
                    <UIErrorBoundary>
                      <RemoteDomRenderer
                        content={parsedContent}
                        uri={resource.resource.uri}
                      />
                    </UIErrorBoundary>
                  </Box>
                );
              } catch (error) {
                console.error("❌ Error parsing UIResource:", error);
                return (
                  <Box
                    key={i}
                    marginTop="300"
                    padding="400"
                    backgroundColor="critical.2"
                  >
                    <Text color="critical.11">Error parsing UI resource</Text>
                    <Text fontSize="sm" color="critical.10">
                      {(error as Error).message}
                    </Text>
                  </Box>
                );
              }
            })}
          </Box>
        ))}

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
