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
  private resourceCache = new Map<string, string>(); // URI → content
  private toolResources = new Map<string, Set<string>>(); // toolName → Set<URI>

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

      // Convert to Anthropic format with server prefix and extract resource references
      const anthropicTools: Tool[] = [];

      for (const tool of toolsList.tools) {
        const toolName = `${serverName}__${tool.name}`;
        const description = `[${serverName.toUpperCase()}] ${tool.description || ""}`;

        anthropicTools.push({
          name: toolName,
          description,
          input_schema: tool.inputSchema,
        });

        // Parse description for resource URI references (format: nimbus://something or resource://something)
        const resourceUris = description.match(/\w+:\/\/[\w-]+/g) || [];

        if (resourceUris.length > 0) {
          console.log(
            `📖 Tool ${toolName} references resources:`,
            resourceUris
          );
          this.toolResources.set(toolName, new Set(resourceUris));

          // Fetch and cache each resource
          for (const uri of resourceUris) {
            if (!this.resourceCache.has(uri)) {
              try {
                console.log(`📥 Fetching resource: ${uri}`);
                const resourceData = await client.readResource({ uri });

                if (resourceData.contents?.[0]) {
                  const content = resourceData.contents[0];
                  const text =
                    "text" in content
                      ? content.text
                      : "blob" in content
                        ? content.blob
                        : "";

                  if (text) {
                    this.resourceCache.set(uri, text);
                    console.log(
                      `✅ Cached resource: ${uri} (${text.length} chars)`
                    );
                  }
                }
              } catch (error) {
                console.warn(`⚠️ Failed to fetch resource ${uri}:`, error);
              }
            }
          }
        }
      }

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

  /**
   * Get relevant resources for currently enabled tools
   */
  private getRelevantResources(
    uiToolsEnabled: boolean,
    commerceToolsEnabled: boolean
  ): string {
    const relevantUris = new Set<string>();

    // Collect resource URIs from enabled tools
    for (const tool of this.allTools) {
      const isUiTool = tool.name.startsWith("ui__");
      const isCommerceTool = tool.name.startsWith("commerce__");

      if (
        (isUiTool && uiToolsEnabled) ||
        (isCommerceTool && commerceToolsEnabled)
      ) {
        const toolResourceUris = this.toolResources.get(tool.name);
        if (toolResourceUris) {
          toolResourceUris.forEach((uri) => relevantUris.add(uri));
        }
      }
    }

    if (relevantUris.size === 0) {
      return "";
    }

    // Build resources section
    let resourcesSection = "\n\n=== MCP RESOURCES ===\n";
    resourcesSection +=
      "The following resources provide critical information for using the tools:\n\n";

    for (const uri of relevantUris) {
      const content = this.resourceCache.get(uri);
      if (content) {
        resourcesSection += `--- Resource: ${uri} ---\n`;
        resourcesSection += content;
        resourcesSection += "\n\n";
      }
    }

    console.log(`📚 Including ${relevantUris.size} resources in context`);
    return resourcesSection;
  }

  async sendMessage(
    message: string,
    options: {
      uiToolsEnabled?: boolean;
      commerceToolsEnabled?: boolean;
      messageHistory?: { role: "user" | "assistant"; content: string }[];
      onUIResource?: (resource: UIResource) => void; // Stream UI as it's created
    } = {}
  ) {
    if (!this.anthropic) {
      throw new Error("Claude client not initialized");
    }

    const {
      uiToolsEnabled = true,
      commerceToolsEnabled = true,
      messageHistory = [],
      onUIResource,
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
          retryCount,
          onUIResource
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
    retryAttempt: number,
    onUIResource?: (resource: UIResource) => void
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
      // Get relevant resources for enabled tools
      const relevantResources = this.getRelevantResources(
        uiToolsEnabled,
        commerceToolsEnabled
      );

      const systemPrompt = anyToolsEnabled
        ? `You are an AI assistant with access to commerce data and UI display tools.

CORE RULE: When users request data (show, list, view, display), ALWAYS use tools:
1. Fetch data with commerce__ tools
2. Display data with ui__ tools
Never respond with text-only - use visual components.
${retryContext}

=== WORKFLOW ===

**Displaying Data:**
Step 1: Fetch data with commerce__ tools
Step 2: Create UI with nested children in ONE tool call

**PERFORMANCE CRITICAL - USE NESTED CHILDREN:**
UI tools accept a "children" array to compose entire layouts in ONE tool call.

WRONG (slow - 5 separate API round-trips):
  ui__createStack → ui__createHeading → ui__createDataTable

RIGHT (fast - 1 API round-trip):
  ui__createStack({
    direction: "column",
    children: [
      { type: "nimbus-heading", properties: { size: "xl" }, textContent: "Orders" },
      { type: "nimbus-data-table", properties: { columns: [...], rows: [...], ariaLabel: "..." } }
    ]
  })

**Creating/Editing Data:**
Use ui__createSimpleForm configured with actionToolName pointing to the commerce tool.

**Data Tables with Editing:**
When using ui__createDataTable with showDetails=true, provide editAction:
editAction={ instruction: "Update {entityType} {id} with data: {formData}. Use commerce {toolMethod}." }

RESPONSE RULES:
- Use UI tools, **NEVER** text paragraphs
- Create UI with nested children in ONE tool call
- Use limit=10-20 for list queries (token management)
- Minimal text - let UI components speak for themselves. **WHEN UI TOOLS ARE USED, LIMIT YOUR RESPONSE TO 'Here's what I found'**

Before responding:
[ ] Did I create UI with nested children in a SINGLE tool call?
[ ] Did I avoid calling multiple tools sequentially?
${relevantResources}`
        : `You are a helpful AI assistant. Please provide text-based responses to help the user.`;

      // Use streaming API and execute tools AS they complete (not after full response)
      const stream = this.anthropic.messages.stream({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 8192,
        system: systemPrompt,
        tools: anyToolsEnabled ? filteredTools : undefined,
        messages: currentConversation,
      });

      // Track tool_use blocks as they stream in
      const toolBlocks = new Map<
        number,
        { id: string; name: string; inputJson: string }
      >();
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      const contentBlocks: Anthropic.ContentBlock[] = [];
      let stopReason: string | null = null;

      // Helper to execute a tool and handle results
      const executeToolBlock = async (block: {
        id: string;
        name: string;
        inputJson: string;
      }) => {
        const toolInput = JSON.parse(block.inputJson || "{}");
        console.log(`🔧 Calling tool: ${block.name}`, toolInput);

        try {
          // Standard MCP tool handling
          const [serverName, ...toolNameParts] = block.name.split("__");
          const actualToolName = toolNameParts.join("__");

          const isToolEnabled =
            (serverName === "ui" && uiToolsEnabled) ||
            (serverName === "commerce" && commerceToolsEnabled);

          if (!isToolEnabled) {
            throw new Error(
              `Tool from ${serverName} server is currently disabled.`
            );
          }

          const client = this.mcpClients.get(serverName);
          if (!client) {
            throw new Error(`Unknown MCP server: ${serverName}`);
          }

          console.log(`🔧 Routing to ${serverName} server: ${actualToolName}`);

          const result = await client.callTool({
            name: actualToolName,
            arguments: toolInput,
          });

          console.log(`✅ Tool result for ${block.name}:`, result);

          // Check for UIResources and stream them immediately
          if (Array.isArray(result.content)) {
            for (const content of result.content) {
              if (
                content.type === "resource" &&
                content.resource?.uri?.startsWith("ui://")
              ) {
                console.log("📦 Streaming UIResource:", content.resource.uri);
                const resource = {
                  type: "resource",
                  resource: content.resource,
                } as UIResource;
                uiResources.push(resource);
                // Stream to UI immediately!
                if (onUIResource) {
                  onUIResource(resource);
                }
              } else if (
                typeof content === "object" &&
                "uri" in content &&
                "text" in content &&
                content.uri?.startsWith("ui://")
              ) {
                console.log("📦 Streaming UIResource (direct):", content.uri);
                const resource = {
                  type: "resource",
                  resource: content,
                } as UIResource;
                uiResources.push(resource);
                if (onUIResource) {
                  onUIResource(resource);
                }
              }
            }
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result.content),
          });
        } catch (error) {
          console.error(`❌ Error calling tool ${block.name}:`, error);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Error: ${(error as Error).message}`,
            is_error: true,
          });
        }
      };

      // Process stream events - execute UI tools immediately as they complete
      const toolExecutionPromises: Promise<void>[] = [];

      for await (const event of stream) {
        if (event.type === "content_block_start") {
          const block = event.content_block;
          if (block.type === "tool_use") {
            toolBlocks.set(event.index, {
              id: block.id,
              name: block.name,
              inputJson: "",
            });
          }
        } else if (event.type === "content_block_delta") {
          const delta = event.delta;
          if (delta.type === "input_json_delta") {
            const block = toolBlocks.get(event.index);
            if (block) {
              block.inputJson += delta.partial_json;
            }
          }
        } else if (event.type === "content_block_stop") {
          const block = toolBlocks.get(event.index);
          if (block) {
            // Execute tool IMMEDIATELY when its block completes (don't wait for full response)
            const isUiTool = block.name.startsWith("ui__");
            if (isUiTool) {
              // UI tools: execute immediately for instant rendering
              console.log(`⚡ Executing UI tool immediately: ${block.name}`);
              toolExecutionPromises.push(executeToolBlock(block));
            } else {
              // Non-UI tools: also execute immediately (commerce data needed for UI)
              console.log(`⚡ Executing tool immediately: ${block.name}`);
              toolExecutionPromises.push(executeToolBlock(block));
            }
          }
        } else if (event.type === "message_delta") {
          stopReason = event.delta.stop_reason;
        }
      }

      // Wait for all tool executions to complete
      await Promise.all(toolExecutionPromises);

      // Build content blocks for conversation history
      const finalMessage = await stream.finalMessage();
      contentBlocks.push(...finalMessage.content);

      console.log(
        `📥 Response complete. Blocks: ${contentBlocks.length}, Stop: ${stopReason}`
      );

      // Add assistant response to conversation
      currentConversation.push({
        role: "assistant",
        content: contentBlocks,
      });

      // Continue if there were tool calls
      if (toolResults.length > 0) {
        currentConversation.push({
          role: "user",
          content: toolResults,
        });
        continueLoop = true;
      } else {
        // No tool use - extract final text response
        const textBlock = contentBlocks.find((block) => block.type === "text");
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
