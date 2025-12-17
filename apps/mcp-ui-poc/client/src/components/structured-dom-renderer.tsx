import React from "react";
import { componentMap } from "./nimbus-library";

/**
 * Types matching server-side definitions
 */
export interface ElementDefinition {
  tagName: string;
  attributes?: Record<string, string | boolean | number | undefined>;
  children?: (ElementDefinition | string)[];
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
  index: number = 0
): React.ReactNode {
  // Find the corresponding Nimbus component
  const Component = componentMap[element.tagName];

  if (!Component) {
    console.warn(`Unknown component tag: ${element.tagName}`);
    return null;
  }

  // ✅ Pass attributes directly - server sends camelCase React props
  const props = element.attributes || {};

  // Render children (can be text or nested elements)
  const children = element.children?.map((child, childIndex) => {
    if (typeof child === "string") {
      return child;
    }
    return renderElement(child, childIndex);
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
 */
export function StructuredDomRenderer({
  content,
}: {
  content: StructuredDomContent;
}) {
  return <>{renderElement(content.element)}</>;
}
