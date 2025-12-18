import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import { buildStackElement, stackElementSchema } from "../elements/stack.js";
import { convertChildrenToElements } from "../utils/element-converter.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { childElementSchema } from "../constants/child-element-schema.js";

export interface CreateStackArgs {
  content?: string;
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  children?: ChildElement[];
  as?: "div" | "form";
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

function createStack(args: CreateStackArgs) {
  const { content, children, ...stackArgs } = args;

  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  const element = buildStackElement({
    ...stackArgs,
    children: elementChildren.length > 0 ? elementChildren : undefined,
  });

  return createRemoteDomResource(element, {
    name: "stack",
    title: "Stack",
    description: "A stack layout component",
  });
}

export function registerStackTool(server: McpServer) {
  server.registerTool(
    "createStack",
    {
      title: "Create Stack",
      description:
        "Creates a stack layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission.",
      inputSchema: stackElementSchema.omit({ type: true }).extend({
        content: z.string().optional().describe("Stack content text"),
        children: z.array(childElementSchema).optional(),
      }),
    },
    async (args) => {
      const uiResource = createStack(args);
      return {
        content: [uiResource],
      };
    }
  );
}
