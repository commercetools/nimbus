import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildMoneyInputElement,
  moneyInputElementSchema,
  type MoneyInputElementArgs,
} from "../elements/money-input.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createMoneyInput(args: MoneyInputElementArgs) {
  const element = buildMoneyInputElement(args);
  return createRemoteDomResource(element, {
    name: "money-input",
    title: "Money Input",
    description: args.placeholder || "Money Input",
  });
}

export function registerMoneyInputTool(server: McpServer) {
  server.registerTool(
    "createMoneyInput",
    {
      title: "Create Money Input",
      description:
        "Creates a money input UI component using Nimbus design system. Handles currency and amount input with support for multiple currencies. Can be used standalone or composed inside FormField.Input.",
      inputSchema: moneyInputElementSchema.omit({ type: true }),
    },
    async (args) => {
      const uiResource = createMoneyInput(args);
      return {
        content: [uiResource],
      };
    }
  );
}
