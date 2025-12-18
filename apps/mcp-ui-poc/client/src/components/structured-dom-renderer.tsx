import React from "react";
import { componentMap } from "./nimbus-library";

/**
 * Intent structure matching server-side definition
 */
export interface Intent {
  type: string;
  description: string;
  payload: Record<string, unknown>;
}

/**
 * Types matching server-side definitions
 */
export interface ElementDefinition {
  tagName: string;
  attributes?: Record<string, string | boolean | number | undefined>;
  children?: (ElementDefinition | string)[];
  events?: {
    onPress?: Intent;
  };
}

export interface StructuredDomContent {
  type: "structuredDom";
  element: ElementDefinition;
  framework: "react";
}

/**
 * Recursively render ElementDefinition as React components
 */
function renderElement(
  element: ElementDefinition,
  index: number = 0,
  onIntentEmit?: (intent: Intent) => void
): React.ReactNode {
  // Find the corresponding Nimbus component
  const Component = componentMap[element.tagName];

  if (!Component) {
    console.warn(`Unknown component tag: ${element.tagName}`);
    return null;
  }

  // ✅ Pass attributes directly - server sends camelCase React props
  const props: Record<string, unknown> = { ...(element.attributes || {}) };

  // Attach event handlers if present
  if (element.events?.onPress && onIntentEmit) {
    const intent = element.events.onPress;

    props.onPress = () => {
      console.log("🎯 Intent emitted:", intent);

      // Simple rule: If button is in a form, automatically capture form data
      const formElement = document.querySelector("form");
      if (formElement) {
        console.log("📝 Button is in a form, capturing form data...");

        const formData = new FormData(formElement);
        const data: Record<string, unknown> = {};

        // Extract all form fields
        formData.forEach((value, key) => {
          // Handle file inputs specially (can't serialize File objects)
          if (value instanceof File) {
            data[key] = {
              fileName: value.name,
              fileSize: value.size,
              fileType: value.type,
            };
          } else {
            data[key] = value;
          }
        });

        // Enhance intent with captured form data
        const enhancedIntent = {
          ...intent,
          payload: {
            ...intent.payload,
            formData: data,
          },
        };

        console.log("📝 Form data captured:", data);
        onIntentEmit(enhancedIntent);
        return;
      }

      // No form found, send intent as-is
      onIntentEmit(intent);
    };
  }

  // Render children (can be text or nested elements)
  const children = element.children?.map((child, childIndex) => {
    if (typeof child === "string") {
      return child;
    }
    return renderElement(child, childIndex, onIntentEmit);
  });

  return (
    <Component key={index} {...props}>
      {children}
    </Component>
  );
}

/**
 * StructuredDomRenderer - renders UI from structured data instead of executing scripts
 *
 * Benefits over old script-based approach:
 * - ✅ Type-safe: No string escaping needed
 * - ✅ Secure: No code execution (new Function())
 * - ✅ Debuggable: Data structures instead of code strings
 * - ✅ Performance: Direct React rendering, no script parsing
 * - ✅ Intent support: Type-safe event handlers for user interactions
 */
export function StructuredDomRenderer({
  content,
  onIntentEmit,
}: {
  content: StructuredDomContent;
  onIntentEmit?: (intent: Intent) => void;
}) {
  return <>{renderElement(content.element, 0, onIntentEmit)}</>;
}
