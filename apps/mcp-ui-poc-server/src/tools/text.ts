import { createUIResource } from "@mcp-ui/server";

export interface CreateTextArgs {
  content: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  marginBottom?: string;
}

export function createText(args: CreateTextArgs) {
  const { content, fontSize, fontWeight, color, marginBottom } = args;

  // Use JSON.stringify for proper JavaScript string escaping
  const escapedContent = JSON.stringify(content).slice(1, -1);

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
