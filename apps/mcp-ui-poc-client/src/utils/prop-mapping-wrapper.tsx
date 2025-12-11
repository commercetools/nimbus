import React from "react";

/**
 * Creates a wrapper component that maps kebab-case attributes to camelCase React props
 * This is needed because @mcp-ui/client doesn't apply propMapping configuration
 *
 * This is a naive hack around having to fully implement [remote dom](https://github.com/Shopify/remote-dom) and [remote-dom/react](https://www.npmjs.com/package/@remote-dom/react)
 *
 * @param Component - The React component to wrap
 * @param propMapping - Map of attribute names (kebab-case) to prop names (camelCase)
 * @returns Wrapper component that applies the prop mapping
 */
export function createPropMappingWrapper<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propMapping: Record<string, string>
): React.ComponentType<Record<string, unknown>> {
  const WrapperComponent = (props: Record<string, unknown>) => {
    // Create a new props object with mapped prop names
    const mappedProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      // Check if this prop needs to be mapped
      const mappedKey = propMapping[key];
      if (mappedKey) {
        // Use the mapped prop name
        mappedProps[mappedKey] = value;
      } else {
        // Keep the original prop name
        mappedProps[key] = value;
      }
    }

    // Forward the mapped props to the actual component
    return React.createElement(Component, mappedProps as P);
  };

  // Set display name for debugging
  WrapperComponent.displayName = `PropMappingWrapper(${Component.displayName || Component.name || "Component"})`;

  return WrapperComponent;
}
