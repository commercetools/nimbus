import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { UIResource } from "../types/virtual-dom";
import type { Tool } from "@anthropic-ai/sdk/resources/messages.mjs";

// Multi-server configuration
const UI_MCP_SERVER_URL =
  import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";
const COMMERCE_MCP_SERVER_URL =
  import.meta.env.VITE_COMMERCE_MCP_SERVER_URL || "http://localhost:8888";

export class ClaudeClient {
  private anthropic!: Anthropic;
  private mcpClients: Map<string, Client> = new Map();
  private allTools: Tool[] = [];
  private serverStats = { ui: 0, commerce: 0 };
  private isInitializing = false;
  private isInitialized = false;

  async initialize() {
    // Prevent concurrent initialization (React StrictMode runs effects twice)
    if (this.isInitializing) {
      console.log("⏸️ Already initializing, skipping duplicate call");
      return;
    }

    if (this.isInitialized) {
      console.log("✅ Already initialized, skipping");
      return;
    }

    this.isInitializing = true;

    try {
      console.log("🔌 Initializing multi-server MCP client...");

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

      // Clear previous state to prevent duplicates
      this.allTools = [];
      this.serverStats = { ui: 0, commerce: 0 };

      // Close any existing connections before reconnecting
      for (const [, client] of this.mcpClients.entries()) {
        try {
          await client.close();
        } catch {
          // Ignore close errors
        }
      }
      this.mcpClients.clear();

      // Connect to UI MCP Server
      await this.connectToMCPServer("ui", UI_MCP_SERVER_URL);

      // Connect to Commerce MCP Server
      await this.connectToMCPServer("commerce", COMMERCE_MCP_SERVER_URL);

      console.log(
        `✅ Multi-server MCP client initialized with ${this.allTools.length} total tools from ${this.mcpClients.size} servers`
      );
      console.log(
        "🔍 All tool names:",
        this.allTools.map((t) => t.name)
      );

      // Check for duplicates
      const toolNames = this.allTools.map((t) => t.name);
      const duplicates = toolNames.filter(
        (name, index) => toolNames.indexOf(name) !== index
      );
      if (duplicates.length > 0) {
        console.error("❌ DUPLICATE TOOL NAMES DETECTED:", [
          ...new Set(duplicates),
        ]);
      }

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

      console.log(
        `✅ Claude client initialized (UI: ${this.serverStats.ui} tools, Commerce: ${this.serverStats.commerce} tools)`
      );

      this.isInitialized = true;
    } catch (error) {
      console.error("❌ Initialization error:", error);
      this.isInitializing = false; // Reset on error
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  private async connectToMCPServer(serverName: string, serverUrl: string) {
    try {
      console.log(
        `🔌 Connecting to ${serverName} MCP server at ${serverUrl}...`
      );

      const client = new Client({
        name: `mcp-ui-${serverName}-client`,
        version: "1.0.0",
      });

      const transport = new StreamableHTTPClientTransport(
        new URL(`${serverUrl}/mcp`)
      );

      await client.connect(transport);
      console.log(`✅ Connected to ${serverName} MCP server`);

      // Get tools from this server
      const toolsList = await client.listTools();
      console.log(`🔧 ${serverName} MCP tools:`, toolsList.tools.length);

      // Convert to Anthropic format with server prefix
      const anthropicTools: Tool[] = toolsList.tools.map((tool) => ({
        name: `${serverName}__${tool.name}`,
        description: `[${serverName.toUpperCase()}] ${tool.description || ""}`,
        input_schema: tool.inputSchema,
      }));

      // Store client and add tools
      this.mcpClients.set(serverName, client);
      this.allTools.push(...anthropicTools);

      // Update stats
      if (serverName === "ui") {
        this.serverStats.ui = anthropicTools.length;
      } else if (serverName === "commerce") {
        this.serverStats.commerce = anthropicTools.length;
      }

      console.log(
        `✅ ${serverName} server registered with ${anthropicTools.length} tools`
      );
      console.log(
        `📋 ${serverName} tool names:`,
        anthropicTools.map((t) => t.name)
      );
    } catch (error) {
      console.error(`❌ Failed to connect to ${serverName} MCP server:`, error);
      // Don't throw - allow partial initialization
      console.warn(`⚠️ Continuing without ${serverName} server`);
    }
  }

  getServerStats() {
    return { ...this.serverStats };
  }

  async sendMessage(
    message: string,
    options: {
      uiToolsEnabled?: boolean;
      commerceToolsEnabled?: boolean;
      messageHistory?: { role: "user" | "assistant"; content: string }[];
    } = {}
  ) {
    if (!this.anthropic) {
      throw new Error("Claude client not initialized");
    }

    const {
      uiToolsEnabled = true,
      commerceToolsEnabled = true,
      messageHistory = [],
    } = options;

    console.log("📤 Sending message to Claude:", message);
    console.log("🔧 UI Tools enabled:", uiToolsEnabled);
    console.log("🔧 Commerce Tools enabled:", commerceToolsEnabled);

    // Try with retries if we hit token limits
    const maxRetries = 2;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount <= maxRetries) {
      try {
        return await this.sendMessageAttempt(
          message,
          uiToolsEnabled,
          commerceToolsEnabled,
          messageHistory,
          retryCount
        );
      } catch (error) {
        // Extract error message from various error formats
        let errorMessage = "";
        if (error && typeof error === "object") {
          const err = error as { message?: string };
          errorMessage = err.message || JSON.stringify(err);
        } else {
          errorMessage = String(error);
        }

        // Check if it's a token limit error (various formats)
        const isTokenLimitError =
          errorMessage.includes("prompt is too long") ||
          errorMessage.includes("maximum") ||
          (errorMessage.includes("token") && errorMessage.includes("200000"));

        if (isTokenLimitError && retryCount < maxRetries) {
          console.warn(
            `⚠️ Token limit exceeded (attempt ${retryCount + 1}/${maxRetries + 1}). Retrying with guidance...`
          );
          console.warn(`Error details: ${errorMessage.substring(0, 200)}...`);
          lastError = error as Error;
          retryCount++;
          continue;
        }

        // Not a token limit error or out of retries - throw it
        throw error;
      }
    }

    // If we exhausted retries, throw the last error with context
    throw new Error(
      `Failed after ${maxRetries + 1} attempts. Last error: ${lastError?.message || "Unknown error"}. ` +
        `Suggestion: Try a more specific query with filters, date ranges, or smaller result sets.`
    );
  }

  private async sendMessageAttempt(
    message: string,
    uiToolsEnabled: boolean,
    commerceToolsEnabled: boolean,
    messageHistory: { role: "user" | "assistant"; content: string }[],
    retryAttempt: number
  ) {
    const uiResources: UIResource[] = [];
    let textResponse = "";

    // Build conversation with history if provided (when tools are disabled)
    // Include message history only when commerce tools are disabled
    const currentConversation: Anthropic.MessageParam[] = [];

    // Add message history if commerce tools are disabled
    if (!commerceToolsEnabled && messageHistory.length > 0) {
      console.log(
        "📜 Including message history:",
        messageHistory.length,
        "messages"
      );
      for (const msg of messageHistory) {
        currentConversation.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current message
    currentConversation.push({
      role: "user",
      content: message,
    });

    // Loop to handle tool use (Claude may need multiple rounds)
    let continueLoop = true;
    while (continueLoop) {
      // Build retry context if this is a retry attempt
      const retryContext =
        retryAttempt > 0
          ? `

🔄 RETRY ATTEMPT ${retryAttempt} - TOKEN LIMIT EXCEEDED ON PREVIOUS ATTEMPT

The previous attempt exceeded the 200K token limit because tool responses were too large.

CRITICAL: You MUST use more restrictive parameters:
- Use pagination: limit to 5-10 items maximum
- Add filters: date ranges, categories, status filters
- Request specific fields only (avoid fetching all data)
- Use "where" clauses to narrow results
- Prefer summary/count endpoints over full list endpoints

Examples of good retry parameters:
- commerce__list_products with limit=5 and where="categories.id='cat123'"
- commerce__read_orders with limit=10 and where="createdAt > '2024-01-01'"
- Request only essential fields, not full objects

If you cannot fulfill the request with limited data, explain to the user that the dataset is too large and suggest:
1. Adding filters (category, date range, status, etc.)
2. Using pagination to view smaller batches
3. Being more specific in their query

DO NOT retry with the same parameters - you will hit the token limit again!
`
          : "";

      // Filter tools based on enabled servers
      const filteredTools = this.allTools.filter((tool) => {
        if (tool.name.startsWith("ui__")) return uiToolsEnabled;
        if (tool.name.startsWith("commerce__")) return commerceToolsEnabled;
        return false; // Unknown tool prefix
      });

      const anyToolsEnabled = uiToolsEnabled || commerceToolsEnabled;
      console.log(
        `🔧 Filtered tools: ${filteredTools.length} (UI: ${uiToolsEnabled}, Commerce: ${commerceToolsEnabled})`
      );

      // Adapt system prompt based on tools availability and retry state
      const systemPrompt = anyToolsEnabled
        ? `IMPORTANT PERSONA: You are an administrator and analyst for internal merchant tooling, NOT a shopper or consumer. You are a business-user tooling power user of the highest order.
        
ALWAYS provide UI components that relate to administration, modification, analysis, or similar, for requested entities.
        
You have access to TWO types of tools:

1. **Commerce Tools (commerce__*)**: Access REAL data from the commercetools platform
   - Products, orders, customers, inventory, categories, etc.
   - These tools fetch ACTUAL data from the connected commercetools project

2. **UI Tools (ui__*)**: Display information using the Nimbus design system
   - Create visual components like cards, tables, forms, etc.
   - These tools RENDER data visually for the user
${retryContext}
CRITICAL WORKFLOW - ALWAYS USE THIS PATTERN:

When the user asks about products, orders, customers, inventory, or any commerce data:
1. **FIRST**: Use commerce tools to fetch the REAL data (e.g., commerce__list_products)
2. **THEN**: Use UI tools to display that data beautifully (e.g., ui__createDataTable)

NEVER create mock/fake data when real data is available via commerce tools!

⚠️ IMPORTANT: Token Limit Management
- Large datasets can exceed the 200K token limit
- ALWAYS use pagination: Start with limit=10-20 items for list endpoints
- Use filters when possible: categories, date ranges, status filters
- If user asks for "all products", explain you'll show a limited set and they can refine

Examples:
- "Show me products" → commerce__list_products(limit=10) THEN ui__createDataTable
- "Show a product" → commerce__list_products(limit=1) THEN ui__createProductCard
- "Display orders" → commerce__read_orders(limit=10) THEN ui__createDataTable
- "Customer info" → commerce__customers_read THEN ui__createCard

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
- Profile images: 150x150 (small square)
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
        tools: anyToolsEnabled ? filteredTools : undefined,
        messages: currentConversation,
      });

      console.log("📥 Received response from Claude:", response);

      // Add assistant response to current conversation (for this message only)
      currentConversation.push({
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
              // Parse server name from tool name (format: "serverName__toolName")
              const [serverName, ...toolNameParts] = toolUse.name.split("__");
              const actualToolName = toolNameParts.join("__");

              const client = this.mcpClients.get(serverName);
              if (!client) {
                throw new Error(`Unknown MCP server: ${serverName}`);
              }

              console.log(
                `🔧 Routing to ${serverName} server: ${actualToolName}`
              );

              // Call the MCP tool on the correct server
              const result = await client.callTool({
                name: actualToolName,
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

        // Add tool results to current conversation
        currentConversation.push(toolResults);

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
    // Close all MCP connections
    for (const [serverName, client] of this.mcpClients.entries()) {
      try {
        await client.close();
        console.log(`🔌 ${serverName} MCP client disconnected`);
      } catch (error) {
        console.error(`❌ Error closing ${serverName} client:`, error);
      }
    }
    this.mcpClients.clear();
  }
}
