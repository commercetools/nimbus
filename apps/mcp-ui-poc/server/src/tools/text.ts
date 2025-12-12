import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "./shared-types.js";

export interface CreateTextArgs {
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
}

export function createText(args: CreateTextArgs) {
  const { content, fontSize, fontWeight, color, marginBottom } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);

  const remoteDomScript = `
    const text = document.createElement('nimbus-text');
    ${fontSize ? `text.setAttribute('font-size', '${fontSize}');` : ""}
    ${fontWeight ? `text.setAttribute('font-weight', '${fontWeight}');` : ""}
    ${color ? `text.setAttribute('color', '${color}');` : ""}
    ${marginBottom ? `text.setAttribute('margin-bottom', '${marginBottom}');` : ""}
    text.textContent = '${escapedContent}';

    root.appendChild(text);
  `;

  return createUIResource({
    uri: `ui://text/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Text",
      description: "A text component",
      created: new Date().toISOString(),
    },
  });
}
