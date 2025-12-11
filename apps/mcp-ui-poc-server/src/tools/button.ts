import { createUIResource } from "@mcp-ui/server";

export interface CreateButtonArgs {
  label: string;
  variant?: string;
  colorPalette?: string;
  width?: string;
  isDisabled?: boolean;
}

export function createButton(args: CreateButtonArgs) {
  const {
    label,
    variant = "solid",
    colorPalette = "primary",
    width,
    isDisabled = false,
  } = args;

  // Use JSON.stringify for proper JavaScript string escaping
  const escapedLabel = JSON.stringify(label).slice(1, -1);

  const remoteDomScript = `
    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', '${variant}');
    button.setAttribute('color-palette', '${colorPalette}');
    ${width ? `button.setAttribute('width', '${width}');` : ""}
    ${isDisabled ? `button.setAttribute('is-disabled', 'true');` : ""}
    button.textContent = '${escapedLabel}';

    // Store label as data attribute for event handling
    button.setAttribute('data-label', '${escapedLabel}');

    root.appendChild(button);
  `;

  return createUIResource({
    uri: `ui://button/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Button",
      description: `Button: ${label}`,
      created: new Date().toISOString(),
    },
  });
}
