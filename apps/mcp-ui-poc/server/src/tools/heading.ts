import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js.js";

export interface CreateHeadingArgs {
  content: string;
  size?: string;
  marginBottom?: string;
}

export function createHeading(args: CreateHeadingArgs) {
  const { content, size = "lg", marginBottom } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);

  const remoteDomScript = `
    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', '${size}');
    ${marginBottom ? `heading.setAttribute('margin-bottom', '${marginBottom}');` : ""}
    heading.textContent = '${escapedContent}';

    root.appendChild(heading);
  `;

  return createUIResource({
    uri: `ui://heading/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Heading",
      description: `Heading: ${content}`,
      created: new Date().toISOString(),
    },
  });
}
