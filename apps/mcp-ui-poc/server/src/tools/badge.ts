import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "./shared-types.js";

export interface CreateBadgeArgs {
  label: string;
  colorPalette?: string;
  size?: string;
  width?: string;
}

export function createBadge(args: CreateBadgeArgs) {
  const { label, colorPalette = "primary", size = "md", width } = args;

  // Use improved escaping for template literal safety
  const escapedLabel = escapeForJS(label);

  const remoteDomScript = `
    const badge = document.createElement('nimbus-badge');
    badge.setAttribute('color-palette', '${colorPalette}');
    badge.setAttribute('size', '${size}');
    ${width ? `badge.setAttribute('width', '${width}');` : ""}
    badge.textContent = '${escapedLabel}';

    root.appendChild(badge);
  `;

  return createUIResource({
    uri: `ui://badge/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Badge",
      description: `Badge: ${label}`,
      created: new Date().toISOString(),
    },
  });
}
