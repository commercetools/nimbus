import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";

/**
 * Register the createMoneyInput tool with the MCP server
 */
export function registerMoneyInputTool(server: McpServer) {
  server.registerTool(
    "createMoneyInput",
    {
      title: "Create Money Input",
      description:
        "Creates a money input UI component using Nimbus design system. Handles currency and amount input with support for multiple currencies. Can be used standalone or composed inside FormField.Input.",
      inputSchema: z.object({
        // Component-specific props
        name: z.string().optional().describe("Input name for form submission"),
        currencyCode: z
          .string()
          .optional()
          .describe("Currency code (e.g., 'USD', 'EUR')"),
        amount: z.number().optional().describe("Amount value"),
        currencies: z
          .array(z.string())
          .optional()
          .describe("Available currencies for selection"),
        placeholder: z.string().optional().describe("Placeholder text"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether input is required"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether input is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether input is read-only"),
        isInvalid: z.boolean().optional().describe("Whether input is invalid"),
        size: z.enum(["sm", "md"]).optional().describe("Input size"),
        hasHighPrecisionBadge: z
          .boolean()
          .optional()
          .describe("Show high precision badge"),
        isCurrencyInputDisabled: z
          .boolean()
          .optional()
          .describe("Disable currency selection"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create money input element directly using Remote DOM custom element
      const moneyInput = document.createElement(
        "nimbus-money-input"
      ) as RemoteDomElement;

      // Set component-specific props
      if (args.name) moneyInput.name = args.name;
      if (args.currencyCode) moneyInput.currencyCode = args.currencyCode;
      if (args.amount !== undefined) moneyInput.amount = args.amount;
      if (args.currencies) moneyInput.currencies = args.currencies;
      if (args.placeholder) moneyInput.placeholder = args.placeholder;
      if (args.isRequired) moneyInput.isRequired = args.isRequired;
      if (args.isDisabled) moneyInput.isDisabled = args.isDisabled;
      if (args.isReadOnly) moneyInput.isReadOnly = args.isReadOnly;
      if (args.isInvalid) moneyInput.isInvalid = args.isInvalid;
      if (args.size) moneyInput.size = args.size;
      if (args.hasHighPrecisionBadge)
        moneyInput.hasHighPrecisionBadge = args.hasHighPrecisionBadge;
      if (args.isCurrencyInputDisabled)
        moneyInput.isCurrencyInputDisabled = args.isCurrencyInputDisabled;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        moneyInput.styleProps = styleProps;
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(moneyInput, {
            name: "money-input",
            title: "Money Input",
            description: args.placeholder || "Money Input",
          }),
        ],
      };
    }
  );
}
