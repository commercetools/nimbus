import { createUIResource } from "@mcp-ui/server";
import {
  type ChildElement,
  generateChildrenScript,
  escapeForJS,
} from "./shared-types.js";

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
  const {
    content = "",
    elevation = "elevated",
    borderStyle = "outlined",
    cardPadding,
    maxWidth,
    width,
    children,
  } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);

  const remoteDomScript = `
    const card = document.createElement('nimbus-card-root');
    card.setAttribute('elevation', '${elevation}');
    card.setAttribute('border-style', '${borderStyle}');
    ${cardPadding ? `card.setAttribute('card-padding', '${cardPadding}');` : ""}
    ${maxWidth ? `card.setAttribute('max-width', '${maxWidth}');` : ""}
    ${width ? `card.setAttribute('width', '${width}');` : ""}

    const cardContent = document.createElement('nimbus-card-content');
    ${content ? `cardContent.textContent = '${escapedContent}';` : ""}
    ${children ? generateChildrenScript(children, "cardContent") : ""}

    card.appendChild(cardContent);
    root.appendChild(card);
  `;

  return createUIResource({
    uri: `ui://card/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
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
