import { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Flex,
  Heading,
  Button,
  TextInput,
  Text,
} from "@commercetools/nimbus";
import { UIResourceRenderer, isUIResource } from "@mcp-ui/client";
import { ClaudeClient } from "../lib/claude-client";
import {
  nimbusLibrary,
  nimbusRemoteElements,
  validateNimbusLibrary,
} from "./nimbus-library";
import { UIActionProvider } from "../utils/prop-mapping-wrapper";
import type { Message } from "../types/virtual-dom";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [claudeClient] = useState(() => new ClaudeClient());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input after initialization
  useEffect(() => {
    if (isReady) {
      inputRef.current?.focus();
    }
  }, [isReady]);

  // Initialize: validate element manifest, then Claude
  useEffect(() => {
    async function init() {
      try {
        // 1. Validate element manifest
        const serverUrl =
          import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";
        await validateNimbusLibrary(serverUrl);
        console.log("✅ Element manifest validated successfully");

        // 2. Initialize Claude with MCP
        await claudeClient.initialize();
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

  async function handleSendMessage() {
    if (!input.trim() || !isReady) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message - Claude handles all tool calling automatically
      const { text, uiResources } = await claudeClient.sendMessage(input);

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
      // Focus input after response is received
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
            Make sure the MCP-UI server is running and the element manifest is
            valid.
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100vh" padding="600">
      <Heading marginBottom="600">Nimbus MCP-UI + Claude Chat</Heading>

      {!isReady && (
        <Box
          padding="400"
          backgroundColor="neutral.2"
          borderRadius="200"
          marginBottom="400"
        >
          <Text>
            Initializing... Validating element manifest and connecting to Claude
          </Text>
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
            maxW={"max-content"}
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
                console.log("📚 Using library config:", nimbusLibrary);
                console.log("🔧 Remote elements config:", nimbusRemoteElements);

                // Define onUIAction handler
                const handleUIAction = async (action: unknown) => {
                  // Filter out internal protocol messages
                  if (
                    !action ||
                    typeof action !== "object" ||
                    Array.isArray(action)
                  ) {
                    return;
                  }

                  const typedAction = action as Record<string, unknown>;
                  console.log("🎬 UI Action received:", typedAction);

                  // Handle Remote DOM events (from our custom event wrapper)
                  if (typedAction.type === "event") {
                    console.log("🎯 Event:", typedAction.event, typedAction);

                    // Handle button press events
                    if (typedAction.event === "press") {
                      const properties = typedAction.properties as
                        | Record<string, unknown>
                        | undefined;
                      const label = properties?.["data-label"] || "Unknown";
                      console.log("🔘 Button pressed:", label);
                      alert(`Button "${label}" was clicked!`);
                    }
                    return;
                  }

                  const payload = typedAction.payload as
                    | Record<string, unknown>
                    | undefined;

                  // Handle different action types
                  switch (typedAction.type) {
                    case "notify":
                      console.log("📢 Notification:", payload?.message);
                      if (payload?.message) {
                        alert(String(payload.message));
                      }
                      break;

                    case "tool":
                      console.log(
                        "🔧 Tool call:",
                        payload?.toolName,
                        payload?.params
                      );

                      // Handle form submission
                      if (payload?.toolName === "submitForm") {
                        const params = payload.params as Record<
                          string,
                          unknown
                        >;
                        console.log("📝 Form submitted with data:", params);
                        alert(
                          `Form "${params.formTitle}" submitted!\n\nData: ${JSON.stringify(params.fields, null, 2)}`
                        );
                      }
                      break;

                    case "prompt":
                      console.log("💬 Prompt:", payload?.prompt);
                      break;

                    default:
                      break;
                  }
                };

                return (
                  <Box key={i} marginTop="300">
                    <UIActionProvider value={handleUIAction}>
                      <UIResourceRenderer
                        resource={resource.resource}
                        remoteDomProps={{
                          library: nimbusLibrary,
                          remoteElements: nimbusRemoteElements,
                        }}
                        onUIAction={handleUIAction}
                      />
                    </UIActionProvider>
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
        {isLoading && (
          <Box
            padding="400"
            backgroundColor="neutral.2"
            borderRadius="200"
            width="fit-content"
          >
            <Flex gap="200" alignItems="center">
              <Box
                as="span"
                display="inline-block"
                width="8px"
                height="8px"
                borderRadius="full"
                backgroundColor="primary.9"
                animation="pulse"
              />
              <Box
                as="span"
                display="inline-block"
                width="8px"
                height="8px"
                borderRadius="full"
                backgroundColor="primary.9"
                animation="pulse"
                animationDelay="0.2s"
              />
              <Box
                as="span"
                display="inline-block"
                width="8px"
                height="8px"
                borderRadius="full"
                backgroundColor="primary.9"
                animation="pulse"
                animationDelay="0.4s"
              />
            </Flex>
          </Box>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </Stack>

      <Flex gap="300">
        <TextInput
          ref={inputRef}
          aria-label="chat input"
          flex="1"
          value={input}
          onChange={(value) => setInput(value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask Claude to create UI components..."
          isDisabled={isLoading || !isReady}
        />
        <Button
          aria-label="send message"
          onPress={handleSendMessage}
          isDisabled={isLoading || !isReady || !input.trim()}
          variant="solid"
          colorPalette="primary"
        >
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
