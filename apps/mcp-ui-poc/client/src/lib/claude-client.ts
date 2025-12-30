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
  private assistantResources: string = ""; // Resources for Claude's context

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

    // Build conversation with full message history
    const currentConversation: Anthropic.MessageParam[] = [];

    // Always include message history for multi-turn conversations
    if (messageHistory.length > 0) {
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
        ? `You are an AI assistant with access to commerce data and UI display tools.

CORE RULE: When users request data (show, list, view, display), ALWAYS use tools:
1. Fetch data with commerce__ tools
2. Display data with ui__ tools
Never respond with text-only - use visual components.

${retryContext}
WORKFLOW:

**Displaying Data:**
Step 1: Call commerce tool to fetch data (e.g., commerce__execute_tool with toolMethod: 'list_products')
Step 2: Call UI tool with the fetched data (e.g., ui__createDataTable)

Important: Wait for commerce data before creating UI. Create each UI component only ONCE.

**Creating/Editing Data:**
Use ui__createSimpleForm configured with actionToolName pointing to the commerce tool.
The form will automatically execute the commerce tool when submitted.

**Data Tables with Editing:**
When using ui__createDataTable with showDetails=true, provide editAction:
editAction={ instruction: "Update {entityType} {id} with data: {formData}. Use commerce {toolMethod}." }

RESPONSE RULES:
- Use UI tools, not text paragraphs
- Create UI components only once (no duplicates)
- Use limit=10-20 for list queries (token management)
- Minimal text - let UI components speak for themselves

Before responding:
[ ] Did I fetch commerce data?
[ ] Did I create UI to display it?
[ ] Did I avoid creating duplicate UI components?
`
        : `You are a helpful AI assistant. Please provide text-based responses to help the user.`;

      // Use streaming API for faster initial response
      // This allows Claude to start thinking and generating tools sooner
      const stream = this.anthropic.messages.stream({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: systemPrompt,
        tools: anyToolsEnabled ? filteredTools : undefined,
        messages: currentConversation,
      });

      // Wait for complete response
      // We must wait for all tool_use blocks to be identified before executing,
      // since Claude expects all tool results together in the next message
      const response = await stream.finalMessage();

      console.log(
        `📥 Response received. Blocks: ${response.content.length}, Stop: ${response.stop_reason}`
      );

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

              // Check if this server's tools are enabled
              const isToolEnabled =
                (serverName === "ui" && uiToolsEnabled) ||
                (serverName === "commerce" && commerceToolsEnabled);

              if (!isToolEnabled) {
                throw new Error(
                  `Tool from ${serverName} server is currently disabled. Enable it using the switch in the UI.`
                );
              }

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
