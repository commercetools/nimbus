import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildCardElement,
  buildCardContentElement,
  cardElementSchema,
} from "../elements/card.js";
import { convertChildrenToElements } from "../utils/element-converter.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { childElementSchema } from "../constants/child-element-schema.js";

export interface CreateCardArgs {
  content?: string;
  elevation?: string;
  borderStyle?: string;
  cardPadding?: string;
  maxWidth?: string;
  width?: string;
  children?: ChildElement[];
}

function createCard(args: CreateCardArgs) {
  const { content, children, ...cardArgs } = args;

  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  const element = buildCardElement({
    ...cardArgs,
    children: [
      buildCardContentElement({
        children: elementChildren.length > 0 ? elementChildren : undefined,
      }),
    ],
  });

  return createRemoteDomResource(element, {
    name: "card",
    title: "Card",
    description: "A card component",
  });
}

export function registerCardTool(server: McpServer) {
  server.registerTool(
    "createCard",
    {
      title: "Create Card",
      description:
        "Creates a card UI component using Nimbus design system. Can contain child elements for composition.",
      inputSchema: cardElementSchema.omit({ type: true }).extend({
        content: z.string().optional().describe("Card content text"),
        children: z.array(childElementSchema).optional(),
      }),
    },
    async (args) => {
      const uiResource = createCard(args);
      return {
        content: [uiResource],
      };
    }
  );
}
