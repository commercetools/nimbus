import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildButtonElement,
  buttonElementSchema,
  type ButtonElementArgs,
} from "../elements/button.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createButton(args: ButtonElementArgs) {
  const buttonDef = buildButtonElement(args);
  return createRemoteDomResource(buttonDef, {
    name: "button",
    title: "Button",
    description: `Button: ${args.label}`,
  });
}

/**
 * Register the createButton tool with the MCP server
 */
export function registerButtonTool(server: McpServer) {
  server.registerTool(
    "createButton",
    {
      title: "Create Button",
      description:
        "Creates a button UI component using Nimbus design system. Supports HTML form submission types.",
      // Use shared schema, omitting the type discriminator and renaming buttonType to type
      inputSchema: buttonElementSchema
        .omit({ type: true })
        .extend({
          type: buttonElementSchema.shape.buttonType,
        })
        .omit({ buttonType: true }),
    },
    async (args) => {
      const uiResource = createButton(args);
      return {
        content: [uiResource],
      };
    }
  );
}
