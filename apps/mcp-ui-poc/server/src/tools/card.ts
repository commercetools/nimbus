import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import { buildCardElement, buildCardContentElement } from "../elements/card.js";
import { convertChildrenToElements } from "../utils/element-converter.js";

export interface CreateCardArgs {
  content?: string;
  elevation?: string;
  borderStyle?: string;
  cardPadding?: string;
  maxWidth?: string;
  width?: string;
  children?: ChildElement[];
}

export function createCard(args: CreateCardArgs) {
  const { content, children, ...cardArgs } = args;

  // Build children array
  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  return createUIResource({
    uri: `ui://card/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildCardElement({
          ...cardArgs,
          children: [
            buildCardContentElement({
              children:
                elementChildren.length > 0 ? elementChildren : undefined,
            }),
          ],
        }),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Card",
      description: "A card component",
      created: new Date().toISOString(),
    },
  });
}
