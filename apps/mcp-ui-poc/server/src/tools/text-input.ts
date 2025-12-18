import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildTextInputElement,
  textInputElementSchema,
  type TextInputElementArgs,
} from "../elements/text-input.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createTextInput(args: TextInputElementArgs) {
  const element = buildTextInputElement(args);
  return createRemoteDomResource(element, {
    name: "text-input",
    title: "Text Input",
    description: args.placeholder || "Text Input",
  });
}

export function registerTextInputTool(server: McpServer) {
  server.registerTool(
    "createTextInput",
    {
      title: "Create Text Input",
      description:
        "Creates a text input UI component using Nimbus design system. Can be used standalone or composed inside FormField.Input. Supports HTML5 validation attributes for native browser validation in forms.",
      inputSchema: textInputElementSchema
        .omit({ type: true })
        .extend({
          type: textInputElementSchema.shape.inputType,
        })
        .omit({ inputType: true }),
    },
    async (args) => {
      const uiResource = createTextInput(args);
      return {
        content: [uiResource],
      };
    }
  );
}
