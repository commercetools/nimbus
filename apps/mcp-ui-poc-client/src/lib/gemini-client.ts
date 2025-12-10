import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { GoogleGenAI, mcpToTool } from "@google/genai";
import type { UIResource } from "../types/virtual-dom";

const MCP_SERVER_URL =
  import.meta.env.VITE_MCP_SERVER_URL || "http://localhost:3001";

export class GeminiClient {
  private ai: GoogleGenAI;
  private chat;
  private mcpClient: Client;

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

      // Initialize Gemini Developer API (for browser environments)
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("VITE_GEMINI_API_KEY environment variable is required");
      }

      this.ai = new GoogleGenAI({ apiKey });

      // Create chat session with MCP tools via mcpToTool()
      console.log("🔧 Converting MCP client to tool...");
      this.chat = this.ai.chats.create({
        model: "gemini-2.5-flash-lite",
        config: {
          tools: [mcpToTool(this.mcpClient)],
        },
      });

      console.log("✅ Gemini chat initialized with MCP tools");
    } catch (error) {
      console.error("❌ Initialization error:", error);
      throw error;
    }
  }

  async sendMessage(message: string) {
    if (!this.chat) {
      throw new Error("Gemini client not initialized");
    }

    // Send message - mcpToTool() automatically handles function calling
    console.log("📤 Sending message to Gemini:", message);
    const response = await this.chat.sendMessage({ message });
    console.log("📥 Received response:", response);

    // Extract UIResources from chat history
    const uiResources = await this.extractUIResourcesFromHistory();
    console.log("📦 Extracted UIResources:", uiResources);

    return {
      text: response.text,
      uiResources,
    };
  }

  private async extractUIResourcesFromHistory(): Promise<UIResource[]> {
    const uiResources: UIResource[] = [];

    try {
      // Get chat history to find all MCP tool responses
      const history = await this.chat.getHistory();

      // Look through messages for function responses containing UIResources
      for (const message of history) {
        if (message.role === "model" && message.parts) {
          for (const part of message.parts) {
            // Check for function response parts
            if (part.functionResponse?.response) {
              const response = part.functionResponse.response;

              // Check if this is a UIResource (has uri starting with "ui://")
              if (response.uri?.startsWith("ui://")) {
                console.log("📦 Found UIResource:", response.uri);
                uiResources.push(response as UIResource);
              }

              // Also check if response has content array with UIResources
              if (Array.isArray(response.content)) {
                for (const content of response.content) {
                  if (content.uri?.startsWith("ui://")) {
                    console.log("📦 Found UIResource in content:", content.uri);
                    uiResources.push(content as UIResource);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error extracting UI resources from history:", error);
    }

    return uiResources;
  }

  async cleanup() {
    // Close MCP connection
    if (this.mcpClient) {
      await this.mcpClient.close();
      console.log("🔌 MCP client disconnected");
    }
  }
}
