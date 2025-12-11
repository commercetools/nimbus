import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { UIResource } from "../types/virtual-dom";
import type { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

const MCP_SERVER_URL =
  import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";

export class ClaudeClient {
  private anthropic: Anthropic;
  private mcpClient: Client;
  private conversationHistory: Anthropic.MessageParam[] = [];
  private mcpTools: Tool[] = [];

  async initialize() {
    try {
      // Create MCP client and connect to server
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

  async sendMessage(message: string) {
    if (!this.anthropic) {
      throw new Error("Claude client not initialized");
    }

    console.log("📤 Sending message to Claude:", message);

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
      const response = await this.anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: `You are a helpful AI assistant that creates rich, visual UI components using the Nimbus design system.

CRITICAL: RESPONSE FORMAT
- When you create UI components using tools, the user can SEE the rendered components in the interface
- Only include text responses that provide NEW information not visible in the UI. If there is no unique information to return, return 'here's what I found' as a default message.
- Do NOT describe what components you created or what they look like - the user can already see them
- Keep text responses concise - only explain concepts, provide context, or answer questions
- If you only created UI components with no additional information needed, you can return an empty text response

CRITICAL INSTRUCTIONS FOR IMAGE URLS:
- When calling tools that accept image URLs (like 'imageUrl' parameters), you MUST always provide realistic, working image URLs
- **Images MUST be contextually relevant and match the content they represent**
- For product cards showing "Wireless Headphones", find an actual headphones image URL
- For product cards showing "Gaming Mouse", find an actual gaming mouse image URL
- Use real product images from reputable sources or stock photo services

RECOMMENDED IMAGE SOURCES (in order of preference):
1. **Unsplash** (high-quality, searchable stock photos):
   - Format: https://images.unsplash.com/photo-[id]?w=[width]&q=80
   - Use search terms that match the product (e.g., "headphones", "mouse", "keyboard")
   - Example: For headphones, use a direct Unsplash URL with headphones in the photo

2. **Product-specific stock photos** (when product name is specific):
   - Search for publicly available product images
   - Use CDN URLs from reputable retailers or manufacturers
   - Ensure images are appropriate dimensions (typically 400x400 for product cards)

3. **Picsum Photos** (ONLY as last resort for generic/abstract content):
   - Format: https://picsum.photos/[width]/[height]
   - Use ONLY when content is generic or abstract
   - Example: https://picsum.photos/400/400

IMPORTANT MATCHING RULES:
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

Always provide engaging, visually complete, and contextually appropriate UI components.`,
        tools: this.mcpTools,
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
