import { useState, useEffect } from "react";
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
import { GeminiClient } from "../lib/gemini-client";
import {
  nimbusLibrary,
  nimbusRemoteElements,
  validateNimbusLibrary,
} from "./nimbus-library";
import type { Message } from "../types/virtual-dom";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [geminiClient] = useState(() => new GeminiClient());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize: validate element manifest, then Gemini
  useEffect(() => {
    async function init() {
      try {
        // 1. Validate element manifest
        const serverUrl =
          import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";
        await validateNimbusLibrary(serverUrl);
        console.log("✅ Element manifest validated successfully");

        // 2. Initialize Gemini with MCP
        await geminiClient.initialize();
        setIsReady(true);
      } catch (error) {
        console.error("❌ Initialization failed:", error);
        setInitError((error as Error).message);
      }
    }
    init();

    // Cleanup on unmount
    return () => {
      geminiClient.cleanup();
    };
  }, [geminiClient]);

  async function handleSendMessage() {
    if (!input.trim() || !isReady) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message - Gemini handles all tool calling automatically
      const { text, uiResources } = await geminiClient.sendMessage(input);

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
      <Heading marginBottom="600">MCP-UI + Gemini Chat</Heading>

      {!isReady && (
        <Box
          padding="400"
          backgroundColor="neutral.2"
          borderRadius="200"
          marginBottom="400"
        >
          <Text>
            Initializing... Validating element manifest and connecting to Gemini
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
          >
            <Text fontWeight="bold" marginBottom="200">
              {msg.role === "user" ? "You" : "Assistant"}
            </Text>

            {msg.content && <Text>{msg.content}</Text>}

            {msg.uiResources?.map((resource, i) =>
              isUIResource(resource) ? (
                <Box key={i} marginTop="300">
                  <UIResourceRenderer
                    resource={resource}
                    remoteDomProps={{
                      library: nimbusLibrary,
                      remoteElements: nimbusRemoteElements,
                    }}
                  />
                </Box>
              ) : null
            )}
          </Box>
        ))}
      </Stack>

      <Flex gap="300">
        <TextInput
          aria-label="chat input"
          flex="1"
          value={input}
          onChange={(value) => setInput(value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask Gemini to create UI components..."
          isDisabled={isLoading || !isReady}
        />
        <Button
          aria-label="send message"
          onClick={handleSendMessage}
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
