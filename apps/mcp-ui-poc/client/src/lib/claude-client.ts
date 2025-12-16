import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { UIResource } from "../types/virtual-dom";
import type { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

const MCP_SERVER_URL =
  import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";

export class ClaudeClient {
  private anthropic!: Anthropic;
  private mcpClient!: Client;
  private conversationHistory: Anthropic.MessageParam[] = [];
  private mcpTools: Tool[] = [];

  async initialize() {
    try {
      // Clear any stored session data from localStorage
      // The MCP SDK may cache session IDs - force a clean slate
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes("mcp") || key.includes("session"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        if (keysToRemove.length > 0) {
          console.log("🧹 Cleared stale session data:", keysToRemove);
        }
      } catch (e) {
        // Ignore localStorage errors
        console.log("⚠️ Could not clear localStorage (ignored):", e);
      }

      // Create MCP client and connect to server
      // Note: We create a new client each time instead of trying to close the old one
      // to avoid async event handler errors from the close operation.
      // The old client will be garbage collected and cleanup() handles proper shutdown on unmount.
      console.log("🔌 Creating MCP client...");
      this.mcpClient = new Client({
        name: "nimbus-mcp-ui-poc",
        version: "1.0.0",
      });

      console.log("🔌 Connecting to MCP server...");
      const transport = new StreamableHTTPClientTransport(
        new URL(`${MCP_SERVER_URL}/mcp`)
      );

      await this.mcpClient.connect(transport);
      console.log("✅ MCP client connected to server");

      // Get available MCP tools and convert to Anthropic format
      const toolsList = await this.mcpClient.listTools();
      console.log("🔧 Available MCP tools:", toolsList.tools);

      this.mcpTools = toolsList.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || "",
        input_schema: tool.inputSchema,
      }));

      console.log("✅ MCP tools converted to Anthropic format");

      // Initialize Anthropic client
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          "VITE_ANTHROPIC_API_KEY environment variable is required"
        );
      }

      this.anthropic = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true, // Required for browser usage
      });

      console.log("✅ Claude client initialized with MCP tools");
    } catch (error) {
      console.error("❌ Initialization error:", error);
      throw error;
    }
  }

  async sendMessage(message: string, options: { toolsEnabled?: boolean } = {}) {
    if (!this.anthropic) {
      throw new Error("Claude client not initialized");
    }

    const { toolsEnabled = true } = options;

    console.log("📤 Sending message to Claude:", message);
    console.log("🔧 Tools enabled:", toolsEnabled);

    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      content: message,
    });

    const uiResources: UIResource[] = [];
    let textResponse = "";

    // Loop to handle tool use (Claude may need multiple rounds)
    let continueLoop = true;
    while (continueLoop) {
      // Adapt system prompt based on tools availability
      const systemPrompt = toolsEnabled
        ? `You are a helpful AI assistant that creates rich, visual UI components using the Nimbus design system. 
Use the available Nimbus components via tool calls whenever possible - prioritize minimizing text in the response.

CRITICAL: RESPONSE FORMAT
- ALWAYS prefer formatting your response with the UI tools. Paragraphs of text are UNACCEPTABLE.
- ALWAYS generate the necessary data to display what the user asks for based on the relevant tool schema.
- When you create UI components using tools, the user can SEE the rendered components in the interface
- Only include text responses that provide NEW information not visible in the UI.
- If there is no unique information to return, return 'here's what I found' along with the UI component.
- Do NOT describe what components you created or what they look like - the user can already see them
- Keep text responses concise - only explain concepts, provide context, or answer questions
- If you only created UI components with no additional information needed, you can return 'here's what I found' as a default message

CRITICAL INSTRUCTIONS FOR IMAGE URLS:
- When calling tools that accept image URLs (like 'imageUrl' parameters), you MUST always provide realistic, working image URLs
- **Images MUST be contextually relevant and match the content they represent**
- Use real product images from reputable sources or stock photo services

RECOMMENDED IMAGE SOURCES (in order of preference):
1. **Picsum Photos** (for all content - simple and reliable):
   - Format: https://picsum.photos/[width]/[height]
   - Works for any content type
   - Example: https://picsum.photos/400/400

2. **Placeholder.com** (alternative placeholder service):
   - Format: https://via.placeholder.com/[width]x[height]
   - Example: https://via.placeholder.com/400x400

IMPORTANT MATCHING RULES:
- If you can identify a specific type of product being requested, find an image that matches the product, e.g:
- Product name → product image
- Product name "Wireless Headphones" → Find a headphones image
- Product name "Gaming Mouse" → Find a gaming mouse image
- Product name "Mechanical Keyboard" → Find a keyboard image
- Product name "Laptop Stand" → Find a laptop stand image

- Generic/abstract content → Picsum photos acceptable

DIMENSION GUIDELINES:
- Product cards: 400x400 (square)
- Banner images: 800x400 (wide aspect ratio)
- Profile images: 200x200 (small square)
- Hero images: 1200x600 (large landscape)

NEVER:
- Leave image URL parameters empty or undefined
- Use completely irrelevant images (e.g., a sunset for headphones)
- Use broken or invalid URLs

Always provide engaging, visually complete, and contextually appropriate UI components.`
        : `You are a helpful AI assistant. Please provide text-based responses to help the user.`;

      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: systemPrompt,
        tools: toolsEnabled ? this.mcpTools : undefined,
        messages: this.conversationHistory,
      });

      console.log("📥 Received response from Claude:", response);

      // Add assistant response to history
      this.conversationHistory.push({
        role: "assistant",
        content: response.content,
      });

      // Check if Claude wants to use tools
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use"
      );

      if (toolUseBlocks.length > 0) {
        console.log("🔧 Claude is using tools:", toolUseBlocks);

        // Execute all tool calls
        const toolResults: Anthropic.MessageParam = {
          role: "user",
          content: [],
        };

        for (const toolUse of toolUseBlocks) {
          if (toolUse.type === "tool_use") {
            console.log(`🔧 Calling MCP tool: ${toolUse.name}`, toolUse.input);

            try {
              // Call the MCP tool
              const result = await this.mcpClient.callTool({
                name: toolUse.name,
                arguments: (toolUse.input || {}) as Record<string, unknown>,
              });

              console.log(`✅ Tool result for ${toolUse.name}:`, result);

              // Check for UIResources in the result
              // MCP-UI server returns UIResources directly in content array
              if (Array.isArray(result.content)) {
                for (const content of result.content) {
                  // Check if content is a resource block with nested resource
                  if (
                    content.type === "resource" &&
                    content.resource?.uri?.startsWith("ui://")
                  ) {
                    console.log(
                      "📦 Found UIResource (nested):",
                      content.resource.uri
                    );
                    uiResources.push({
                      type: "resource",
                      resource: content.resource,
                    } as UIResource);
                  }
                  // Check if content is a UIResource object directly (needs wrapping)
                  else if (
                    typeof content === "object" &&
                    "uri" in content &&
                    "text" in content &&
                    content.uri?.startsWith("ui://")
                  ) {
                    console.log("📦 Found UIResource (direct):", content.uri);
                    uiResources.push({
                      type: "resource",
                      resource: content,
                    } as UIResource);
                  }
                }
              }

              // Add tool result to response
              (toolResults.content as Anthropic.ToolResultBlockParam[]).push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: JSON.stringify(result.content),
              });
            } catch (error) {
              console.error(`❌ Error calling tool ${toolUse.name}:`, error);
              (toolResults.content as Anthropic.ToolResultBlockParam[]).push({
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: `Error: ${(error as Error).message}`,
                is_error: true,
              });
            }
          }
        }

        // Add tool results to conversation history
        this.conversationHistory.push(toolResults);

        // Continue the loop to get Claude's next response
        continueLoop = true;
      } else {
        // No more tool use - extract final text response
        const textBlock = response.content.find(
          (block) => block.type === "text"
        );
        if (textBlock && textBlock.type === "text") {
          textResponse = textBlock.text;
        }

        continueLoop = false;
      }
    }

    console.log("📦 Final UIResources:", uiResources);

    return {
      text: textResponse,
      uiResources,
    };
  }

  async cleanup() {
    // Close MCP connection
    if (this.mcpClient) {
      await this.mcpClient.close();
      console.log("🔌 MCP client disconnected");
    }
  }
}
