import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { queueAction } from "../utils/action-queue.js";

// Store button action metadata by button ID
const buttonActionsByButtonId = new Map<
  string,
  { toolName: string; params: Record<string, unknown>; uri: string }
>();

/**
 * Configure a button to trigger an MCP action when clicked
 * Used by other tools (e.g., simple-form) to register button actions
 */
export function configureButtonAction(
  buttonId: string,
  toolName: string,
  params: Record<string, unknown>,
  uri: string
) {
  buttonActionsByButtonId.set(buttonId, { toolName, params, uri });
  console.log(`🎯 Button action configured: ${buttonId} -> ${toolName}`);
}

/**
 * Handle button click events - queue MCP action if configured
 * Receives formData from client if button is inside a form
 */
export function handleButtonClick(
  buttonId: string,
  formData?: Record<string, string>
) {
  console.log(`🖱️ Button clicked: ${buttonId}`);
  if (formData && Object.keys(formData).length > 0) {
    console.log(`📝 Form data received from client:`, formData);
  }

  const actionMeta = buttonActionsByButtonId.get(buttonId);
  if (!actionMeta) {
    console.log(`ℹ️ No action configured for button: ${buttonId}`);
    return null;
  }

  console.log(`🎯 Queueing MCP tool call: ${actionMeta.toolName}`);

  // Merge form data with configured action params
  const params = {
    ...actionMeta.params,
    ...(formData && Object.keys(formData).length > 0 ? { formData } : {}),
  };

  const action = queueAction({
    type: "mcp-tool-call",
    toolName: actionMeta.toolName,
    params,
    uri: actionMeta.uri,
  });

  console.log(`✅ Action queued: ${action.id}`);
  return action;
}

/**
 * Register the createButton tool with the MCP server
 */
export function registerButtonTool(
  server: McpServer,
  mutationServer?: {
    registerToolHandler: (
      toolName: string,
      handler: (toolName: string, params: Record<string, unknown>) => unknown
    ) => void;
  }
) {
  // Register tool handler for button clicks
  if (mutationServer) {
    mutationServer.registerToolHandler("buttonClick", (_toolName, params) => {
      const buttonId = params.buttonId as string;
      const formData = params.formData as Record<string, string> | undefined;
      return handleButtonClick(buttonId, formData);
    });
  }

  server.registerTool(
    "createButton",
    {
      title: "Create Button",
      description:
        "Creates a button UI component using Nimbus design system. Can optionally trigger an MCP tool call when clicked by specifying actionToolName and actionParams. Supports HTML form submission types and all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        label: z.string().describe("Button label text"),

        // Action configuration (optional)
        actionToolName: z
          .string()
          .optional()
          .describe(
            "Name of MCP tool to call when button is clicked (e.g., 'commerce__getProducts')"
          ),
        actionParams: z
          .record(z.any())
          .optional()
          .describe(
            "Parameters to pass to the MCP tool when button is clicked"
          ),

        // Component-specific props
        variant: z
          .enum(["solid", "subtle", "outline", "ghost"])
          .optional()
          .describe("Button variant"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'critical')"),
        size: z.enum(["sm", "md", "lg"]).optional().describe("Button size"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the button is disabled"),
        type: z
          .enum(["button", "submit", "reset"])
          .optional()
          .describe("Button type for HTML forms (default: 'button')"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Generate unique button ID
      const buttonId = `button-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Create button element directly using Remote DOM custom element
      const button = document.createElement(
        "nimbus-button"
      ) as RemoteDomElement;

      // Set unique ID as attribute for event handling
      button.setAttribute("id", buttonId);

      // Set component-specific props
      if (args.variant) button.variant = args.variant;
      if (args.colorPalette) button.colorPalette = args.colorPalette;
      if (args.size) button.size = args.size;
      if (args.isDisabled) button.isDisabled = args.isDisabled;
      if (args.type) button.type = args.type;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        button.styleProps = styleProps;
      }

      // Set text content
      button.textContent = args.label;

      // Generate URI for this button
      const uri = `ui://button/${Date.now()}`;

      // If action configured, store metadata for click handler
      if (args.actionToolName) {
        buttonActionsByButtonId.set(buttonId, {
          toolName: args.actionToolName,
          params: args.actionParams || {},
          uri,
        });
        console.log(
          `🎯 Button configured with action: ${args.actionToolName}`,
          args.actionParams
        );
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(button, {
            name: "button",
            title: "Button",
            description: `Button: ${args.label}`,
            uri,
          }),
        ],
      };
    }
  );
}
