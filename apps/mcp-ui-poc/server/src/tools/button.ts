import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js";

export interface CreateButtonArgs {
  label: string;
  variant?: string;
  colorPalette?: string;
  width?: string;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

export function createButton(args: CreateButtonArgs) {
  const {
    label,
    variant = "solid",
    colorPalette = "primary",
    width,
    isDisabled = false,
    type = "button",
    ariaLabel,
  } = args;

  // Use improved escaping for template literal safety
  const escapedLabel = escapeForJS(label);
  const escapedAriaLabel = ariaLabel ? escapeForJS(ariaLabel) : undefined;

  const remoteDomScript = `
    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', '${variant}');
    button.setAttribute('color-palette', '${colorPalette}');
    ${width ? `button.setAttribute('width', '${width}');` : ""}
    ${isDisabled ? `button.setAttribute('is-disabled', 'true');` : ""}
    ${type !== "button" ? `button.setAttribute('type', '${type}');` : ""}
    ${escapedAriaLabel ? `button.setAttribute('aria-label', '${escapedAriaLabel}');` : ""}
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
