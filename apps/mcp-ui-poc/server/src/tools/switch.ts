import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { queueAction } from "../utils/action-queue.js";
import { validateOptionalText } from "../utils/security.js";
import { showToast } from "../utils/toaster.js";

// Store switch action metadata by switch ID
const switchActionsBySwitchId = new Map<
  string,
  {
    onToolName?: string;
    onParams?: Record<string, unknown>;
    offToolName?: string;
    offParams?: Record<string, unknown>;
    uri: string;
  }
>();

/**
 * Handle switch change events - queue MCP action if configured
 */
export function handleSwitchChange(switchId: string, isSelected: boolean) {
  console.log(`🔄 Switch changed: ${switchId}, selected: ${isSelected}`);

  const actionMeta = switchActionsBySwitchId.get(switchId);
  if (!actionMeta) {
    console.log(`ℹ️ No action configured for switch: ${switchId}`);
    return null;
  }

  // Choose the appropriate tool based on switch state
  const toolName = isSelected ? actionMeta.onToolName : actionMeta.offToolName;
  const params = isSelected ? actionMeta.onParams : actionMeta.offParams;

  if (!toolName) {
    console.log(
      `ℹ️ No ${isSelected ? "on" : "off"} action configured for switch: ${switchId}`
    );
    return null;
  }

  console.log(`🎯 Queueing MCP tool call: ${toolName}`);

  const action = queueAction(
    {
      type: "mcp-tool-call",
      toolName,
      params: params || {},
      uri: actionMeta.uri,
    },
    (result, error) => {
      // Callback executed when action completes
      if (error) {
        console.error(`❌ Switch action failed:`, error);

        const errorMsg =
          typeof error === "object" && error !== null
            ? (error as { message?: string }).message || "Unknown error"
            : String(error);

        showToast({
          type: "error",
          title: "Action Failed",
          message: errorMsg,
        });
      } else {
        console.log(`✅ Switch action completed:`, result);

        showToast({
          type: "success",
          title: "Success",
          message: "Setting updated successfully",
        });
      }
    }
  );

  console.log(`✅ Action queued: ${action.id}`);
  return action;
}

/**
 * Register the createSwitch tool with the MCP server
 */
export function registerSwitchTool(
  server: McpServer,
  mutationServer?: {
    registerToolHandler: (
      toolName: string,
      handler: (toolName: string, params: Record<string, unknown>) => unknown
    ) => void;
  }
) {
  // Register tool handler for switch changes
  if (mutationServer) {
    mutationServer.registerToolHandler("switchChange", (_toolName, params) => {
      const switchId = params.switchId as string;
      const isSelected = params.isSelected as boolean;
      return handleSwitchChange(switchId, isSelected);
    });
  }

  server.registerTool(
    "createSwitch",
    {
      title: "Create Switch",
      description:
        "Creates a toggle switch UI component using Nimbus design system. Can optionally trigger different MCP tool calls when turned on or off by specifying onToolName/offToolName and their params. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        label: z
          .string()
          .optional()
          .describe("Label text to display next to the switch"),

        // State
        isSelected: z
          .boolean()
          .optional()
          .describe("Controlled selection state (use for controlled switches)"),
        defaultSelected: z
          .boolean()
          .optional()
          .describe("Default selection state (use for uncontrolled switches)"),

        // Action configuration (optional)
        onToolName: z
          .string()
          .optional()
          .describe(
            "Name of MCP tool to call when switch is turned ON (e.g., 'commerce__enableFeature')"
          ),
        onParams: z
          .record(z.string(), z.any())
          .optional()
          .describe("Parameters to pass to the MCP tool when turned ON"),
        offToolName: z
          .string()
          .optional()
          .describe(
            "Name of MCP tool to call when switch is turned OFF (e.g., 'commerce__disableFeature')"
          ),
        offParams: z
          .record(z.string(), z.any())
          .optional()
          .describe("Parameters to pass to the MCP tool when turned OFF"),

        // Component-specific props
        size: z.enum(["sm", "md", "lg"]).optional().describe("Switch size"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'critical')"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether the switch is disabled"),
        isInvalid: z
          .boolean()
          .optional()
          .describe("Whether the switch has validation errors"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether the switch is read-only"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether the switch is required"),
        name: z
          .string()
          .optional()
          .describe("Form name attribute for the switch"),
        value: z.string().optional().describe("Form value for the switch"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Validate and sanitize label if provided
      const sanitizedLabel = args.label
        ? validateOptionalText(args.label, "label")
        : undefined;

      // Generate unique switch ID
      const switchId = `switch-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Create switch element directly using Remote DOM custom element
      const switchElement = document.createElement(
        "nimbus-switch"
      ) as RemoteDomElement;

      // Set unique ID as attribute for event handling
      switchElement.setAttribute("id", switchId);

      // Set state props
      if (args.isSelected !== undefined)
        switchElement.isSelected = args.isSelected;
      if (args.defaultSelected !== undefined)
        switchElement.defaultSelected = args.defaultSelected;

      // Set component-specific props
      if (args.size) switchElement.size = args.size;
      if (args.colorPalette) switchElement.colorPalette = args.colorPalette;
      if (args.isDisabled) switchElement.isDisabled = args.isDisabled;
      if (args.isInvalid) switchElement.isInvalid = args.isInvalid;
      if (args.isReadOnly) switchElement.isReadOnly = args.isReadOnly;
      if (args.isRequired) switchElement.isRequired = args.isRequired;
      if (args.name) switchElement.name = args.name;
      if (args.value) switchElement.value = args.value;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        switchElement.styleProps = styleProps;
      }

      // Set label text if provided
      if (sanitizedLabel) {
        switchElement.textContent = sanitizedLabel;
      }

      // Generate URI for this switch
      const uri = `ui://switch/${Date.now()}`;

      // If actions configured, store metadata for change handler
      if (args.onToolName || args.offToolName) {
        switchActionsBySwitchId.set(switchId, {
          onToolName: args.onToolName,
          onParams: args.onParams,
          offToolName: args.offToolName,
          offParams: args.offParams,
          uri,
        });
        console.log(`🎯 Switch configured with actions:`, {
          on: args.onToolName,
          off: args.offToolName,
        });
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(switchElement, {
            name: "switch",
            title: "Switch",
            description: sanitizedLabel
              ? `Switch: ${sanitizedLabel}`
              : "Switch toggle",
            uri,
          }),
        ],
      };
    }
  );
}
