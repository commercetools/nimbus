import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import { buildFlexElement, flexElementSchema } from "../elements/flex.js";
import { convertChildrenToElements } from "../utils/element-converter.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { childElementSchema } from "../constants/child-element-schema.js";

export interface CreateFlexArgs {
  content?: string;
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
  children?: ChildElement[];
  as?: "div" | "form";
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

function createFlex(args: CreateFlexArgs) {
  const { content, children, ...flexArgs } = args;

  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  const element = buildFlexElement({
    ...flexArgs,
    children: elementChildren.length > 0 ? elementChildren : undefined,
  });

  return createRemoteDomResource(element, {
    name: "flex",
    title: "Flex",
    description: "A flex layout component",
  });
}

export function registerFlexTool(server: McpServer) {
  server.registerTool(
    "createFlex",
    {
      title: "Create Flex",
      description:
        "Creates a flex layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission.",
      inputSchema: flexElementSchema.omit({ type: true }).extend({
        content: z.string().optional().describe("Flex content text"),
        children: z.array(childElementSchema).optional(),
      }),
    },
    async (args) => {
      const uiResource = createFlex(args);
      return {
        content: [uiResource],
      };
    }
  );
}
