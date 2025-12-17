import { createUIResource } from "@mcp-ui/server";
import {
  buildMoneyInputElement,
  type MoneyInputElementArgs,
} from "../elements/money-input.js";

export type CreateMoneyInputArgs = MoneyInputElementArgs;

export function createMoneyInput(args: CreateMoneyInputArgs) {
  return createUIResource({
    uri: `ui://money-input/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildMoneyInputElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Money Input",
      description: args.placeholder || "Money Input",
      created: new Date().toISOString(),
    },
  });
}
