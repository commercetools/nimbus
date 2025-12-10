# MCP-UI POC Client

Client application demonstrating the integration of Model Context Protocol (MCP) with Gemini API and Nimbus design system components.

## Architecture

- **Gemini API**: Uses `@google/genai` SDK with `mcpToTool()` for automatic function calling
- **MCP Protocol**: Connects to MCP server via StreamableHTTPClientTransport
- **MCP-UI**: Renders UIResources with Remote DOM pattern
- **Nimbus Components**: Maps custom elements to React components

## Prerequisites

### Gemini API Key

This application uses the Gemini Developer API which requires an API key. Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables:
- `VITE_GEMINI_API_KEY`: Your Gemini API key from Google AI Studio
- `VITE_MCP_SERVER_URL`: URL of the MCP server (default: http://localhost:3001)

## Installation

```bash
pnpm install
```

## Development

### Start the MCP Server

In a separate terminal:

```bash
cd ../mcp-ui-poc-server
pnpm dev
```

### Start the Client

```bash
pnpm dev
```

Open http://localhost:5173

## How It Works

1. **Client initialization**:
   - Creates MCP client with StreamableHTTPClientTransport
   - Connects to MCP server
   - Creates Gemini chat session with `mcpToTool(mcpClient)`

2. **User sends message**:
   - Gemini receives message with MCP tools available
   - Gemini decides if a tool should be called
   - `mcpToTool()` automatically executes MCP tools and sends results back

3. **UI rendering**:
   - Client extracts UIResources from chat history
   - UIResourceRenderer executes Remote DOM scripts
   - Custom elements map to Nimbus components
   - Components render in the chat

## Available MCP Tools

The server provides these tools that Gemini can call:

- **createProductCard**: Creates a product card UI with name, price, image, stock status
- **createForm**: Creates a form UI with dynamic fields
- **createDataTable**: Creates a data table UI with headers and rows

## Resources

- [@google/genai SDK](https://github.com/googleapis/js-genai)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP-UI Library](https://github.com/mcpui/mcp-ui)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
