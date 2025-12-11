import { createUIResource } from "@mcp-ui/server";

export interface CreateHeadingArgs {
  content: string;
  size?: string;
  marginBottom?: string;
}

export function createHeading(args: CreateHeadingArgs) {
  const { content, size = "lg", marginBottom } = args;

  // Use JSON.stringify for proper JavaScript string escaping
  const escapedContent = JSON.stringify(content).slice(1, -1);

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
