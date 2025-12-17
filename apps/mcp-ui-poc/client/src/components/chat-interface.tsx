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
import { UIResourceRenderer, isUIResource } from "@mcp-ui/client";
import { ClaudeClient } from "../lib/claude-client";
import {
  nimbusLibrary,
  nimbusRemoteElements,
  validateNimbusLibrary,
} from "./nimbus-library";
import { UIActionProvider } from "../utils/prop-mapping-wrapper";
import { FormSubmissionDialog } from "./form-submission-dialog";
import { ChatInput } from "./chat-input";
import type { Message } from "../types/virtual-dom";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [claudeClient] = useState(() => new ClaudeClient());
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [toolsEnabled, setToolsEnabled] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
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

  // Intercept form submissions globally
  useEffect(() => {
    const handleFormSubmit = (event: SubmitEvent) => {
      console.log("📋 Form submit event fired!", event);
      const form = event.target as HTMLFormElement;
      console.log("📋 Form element:", form);
      console.log("📋 Form action:", form.action);

      // Only intercept forms without an action attribute (or with empty action)
      if (form.action && form.action !== window.location.href) {
        console.log("📋 Form has real action, allowing normal submission");
        return; // Let forms with real actions submit normally
      }

      console.log("📋 Intercepting form submission");

      // Prevent default submission
      event.preventDefault();

      // Extract form data
      const formDataObj = new FormData(form);
      const data: Record<string, string> = {};

      formDataObj.forEach((value, key) => {
        data[key] = value.toString();
      });

      console.log("📝 Form submitted:", data);

      // Show form data in dialog
      setFormData(data);
      setFormDialogOpen(true);
    };

    document.addEventListener("submit", handleFormSubmit);
    console.log("✅ Form submit listener attached");

    return () => {
      document.removeEventListener("submit", handleFormSubmit);
      console.log("❌ Form submit listener removed");
    };
  }, []);

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

        // 3. Get server stats
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
      // Send message - Claude handles all tool calling automatically
      const { text, uiResources } = await claudeClient.sendMessage(message, {
        toolsEnabled,
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
      <Flex
        justifyContent="space-between"
        alignItems="center"
        marginBottom="600"
      >
        <Flex alignItems="center" gap="400">
          <Heading>Nimbus MCP-UI + Claude Chat</Heading>
          {isReady && (
            <Flex gap="200">
              <Badge colorPalette="primary">UI Tools: {serverStats.ui}</Badge>
              <Badge colorPalette="positive">
                Commerce Tools: {serverStats.commerce}
              </Badge>
              <Badge colorPalette="neutral">
                Total: {serverStats.ui + serverStats.commerce}
              </Badge>
            </Flex>
          )}
        </Flex>
        <Flex alignItems="center" gap="300">
          <Text fontSize="sm">{`Nimbus MCP-UI ${toolsEnabled ? "Enabled" : "Disabled"}`}</Text>
          <Switch
            aria-label="enable nimbus mcp-ui"
            defaultSelected={toolsEnabled}
            onChange={(checked) => setToolsEnabled(checked)}
            isDisabled={!isReady}
          />
        </Flex>
      </Flex>

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

                // Define onUIAction handler - simplified to forward intents directly
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

                  // Handle Intent Actions - simply forward to Claude
                  if (typedAction.type === "intent") {
                    const intent = typedAction.intent as {
                      type: string;
                      description: string;
                      payload: Record<string, unknown>;
                    };

                    console.log("🎯 Intent received:", intent);

                    // Combine description + structured payload for Claude
                    const message = `${intent.description}

                      [Intent Context]
                      Type: ${intent.type}
                      Payload: ${JSON.stringify(intent.payload, null, 2)}`;

                    console.log("💬 Forwarding intent to Claude:", message);

                    // 1. Add user message to chat (show cleaner version to user)
                    const userMessage: Message = {
                      role: "user",
                      content: `[Intent: ${intent.type}] ${intent.description}`,
                    };
                    setMessages((prev) => [...prev, userMessage]);

                    // 2. Set loading state
                    setIsLoading(true);

                    // 3. Send to Claude with full description + payload
                    try {
                      const { text, uiResources } =
                        await claudeClient.sendMessage(message, {
                          toolsEnabled,
                        });

                      // 4. Add Claude's response
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

                    return;
                  }

                  // Handle Remote DOM events (from our custom event wrapper)
                  if (typedAction.type === "event") {
                    console.log("🎯 Event:", typedAction.event, typedAction);

                    // Handle button press events
                    if (typedAction.event === "press") {
                      const properties = typedAction.properties as
                        | Record<string, unknown>
                        | undefined;

                      console.log("🔍 Button properties:", properties);

                      // Check if button has intent action data attribute
                      const intentActionStr = properties?.[
                        "data-intent-action"
                      ] as string | undefined;

                      if (intentActionStr) {
                        try {
                          // Parse the intent action and handle it
                          const intentAction = JSON.parse(intentActionStr);

                          if (intentAction.type === "intent") {
                            // Recursively handle as intent action
                            await handleUIAction(intentAction);
                            return;
                          }
                        } catch (e) {
                          console.error("Failed to parse intent action:", e);
                        }
                      }

                      // Regular button press (no intent)
                      const buttonType = properties?.type;
                      const label = properties?.["data-label"] || "Unknown";

                      // Don't intercept submit buttons - let form submission happen
                      if (buttonType === "submit") {
                        console.log(
                          "🔘 Submit button pressed:",
                          label,
                          "- allowing form submission"
                        );
                        return;
                      }

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

      <ChatInput
        onSend={handleSendMessage}
        isDisabled={isLoading || !isReady}
        autoFocus={isReady}
      />

      {/* Form submission dialog */}
      <FormSubmissionDialog
        isOpen={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        formData={formData}
      />
    </Flex>
  );
}
