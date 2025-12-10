import type {
  ComponentLibrary,
  RemoteElementConfiguration,
} from "@mcp-ui/client";
import * as Nimbus from "@commercetools/nimbus";

export const nimbusLibrary: ComponentLibrary = {
  name: "nimbus",
  elements: [
    // Card components
    {
      tagName: "nimbus-card",
      component: Nimbus.Card.Root,
      propMapping: {
        variant: "variant",
        "max-width": "maxWidth",
      },
    },
    {
      tagName: "nimbus-card-body",
      component: Nimbus.Card.Body,
      propMapping: {},
    },

    // Typography
    {
      tagName: "nimbus-heading",
      component: Nimbus.Heading,
      propMapping: {
        size: "size",
        "margin-bottom": "marginBottom",
      },
    },
    {
      tagName: "nimbus-text",
      component: Nimbus.Text,
      propMapping: {
        "font-size": "fontSize",
        "font-weight": "fontWeight",
        color: "color",
        "margin-bottom": "marginBottom",
      },
    },

    // Interactive components
    {
      tagName: "nimbus-button",
      component: Nimbus.Button,
      propMapping: {
        variant: "variant",
        "color-palette": "colorPalette",
        width: "width",
        "is-disabled": "isDisabled",
        "margin-top": "marginTop",
      },
      eventMapping: {
        press: "onClick",
      },
    },
    {
      tagName: "nimbus-badge",
      component: Nimbus.Badge,
      propMapping: {
        "color-palette": "colorPalette",
        "margin-bottom": "marginBottom",
      },
    },

    // Media
    {
      tagName: "nimbus-image",
      component: Nimbus.Image,
      propMapping: {
        src: "src",
        alt: "alt",
        "border-radius": "borderRadius",
        "margin-bottom": "marginBottom",
      },
    },

    // Layout
    {
      tagName: "nimbus-stack",
      component: Nimbus.Stack,
      propMapping: {
        direction: "direction",
        gap: "gap",
        "margin-bottom": "marginBottom",
      },
    },
    {
      tagName: "nimbus-flex",
      component: Nimbus.Flex,
      propMapping: {
        direction: "direction",
        gap: "gap",
        padding: "padding",
        "background-color": "backgroundColor",
        "border-bottom": "borderBottom",
        "border-color": "borderColor",
      },
    },

    // Form inputs
    {
      tagName: "nimbus-text-input",
      component: Nimbus.TextInput,
      propMapping: {
        name: "name",
        placeholder: "placeholder",
        required: "isRequired",
      },
    },
  ],
};

export const nimbusRemoteElements: RemoteElementConfiguration[] = [
  {
    tagName: "nimbus-card",
    properties: {
      variant: { type: "string" },
      "max-width": { type: "string" },
    },
  },
  {
    tagName: "nimbus-card-body",
    properties: {},
  },
  {
    tagName: "nimbus-heading",
    properties: {
      size: { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-text",
    properties: {
      "font-size": { type: "string" },
      "font-weight": { type: "string" },
      color: { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-button",
    properties: {
      variant: { type: "string" },
      "color-palette": { type: "string" },
      width: { type: "string" },
      "is-disabled": { type: "boolean" },
      "margin-top": { type: "string" },
    },
    events: {
      press: { type: "event" },
    },
  },
  {
    tagName: "nimbus-badge",
    properties: {
      "color-palette": { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-image",
    properties: {
      src: { type: "string" },
      alt: { type: "string" },
      "border-radius": { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-stack",
    properties: {
      direction: { type: "string" },
      gap: { type: "string" },
      "margin-bottom": { type: "string" },
    },
  },
  {
    tagName: "nimbus-flex",
    properties: {
      direction: { type: "string" },
      gap: { type: "string" },
      padding: { type: "string" },
      "background-color": { type: "string" },
      "border-bottom": { type: "string" },
      "border-color": { type: "string" },
    },
  },
  {
    tagName: "nimbus-text-input",
    properties: {
      name: { type: "string" },
      placeholder: { type: "string" },
      required: { type: "boolean" },
    },
  },
];

export async function validateNimbusLibrary(serverUrl: string) {
  const response = await fetch(`${serverUrl}/elements`);
  const manifest = await response.json();

  const missingElements: string[] = [];
  const validElements: string[] = [];

  for (const element of manifest.elements) {
    const hasMapping = nimbusLibrary.elements.some(
      (e) => e.tagName === element.tagName
    );

    if (!hasMapping) {
      missingElements.push(element.tagName);
      console.error(`❌ Missing component mapping: ${element.tagName}`);
    } else {
      validElements.push(element.tagName);
    }
  }

  console.log(`✅ Validated ${validElements.length} elements`);

  if (missingElements.length > 0) {
    throw new Error(
      `Missing component mappings: ${missingElements.join(", ")}`
    );
  }

  return manifest;
}
