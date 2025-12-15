import React, { useContext, createContext } from "react";

/**
 * Context to provide the onUIAction callback to wrapped components
 * This allows event handlers to trigger UI actions
 */
const UIActionContext = createContext<
  ((action: unknown) => void | Promise<void>) | null
>(null);

export const UIActionProvider = UIActionContext.Provider;

export function useUIAction() {
  return useContext(UIActionContext);
}

/**
 * Creates a wrapper component that maps kebab-case attributes to camelCase React props
 * AND handles event mapping to trigger UI actions
 *
 * This is needed because @mcp-ui/client doesn't apply propMapping or eventMapping configuration
 *
 * This is a naive hack around having to fully implement [remote dom](https://github.com/Shopify/remote-dom) and [remote-dom/react](https://www.npmjs.com/package/@remote-dom/react)
 *
 * @param Component - The React component to wrap
 * @param propMapping - Map of attribute names (kebab-case) to prop names (camelCase)
 * @param eventMapping - Map of remote event names to React event prop names
 * @returns Wrapper component that applies the prop mapping and event handling
 */
export function createPropMappingWrapper<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propMapping: Record<string, string>,
  eventMapping?: Record<string, string>
): React.ComponentType<Record<string, unknown>> {
  const WrapperComponent = (props: Record<string, unknown>) => {
    const onUIAction = useUIAction();

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

    // Add event handlers if eventMapping is provided
    if (eventMapping && onUIAction) {
      for (const [remoteEventName, reactEventProp] of Object.entries(
        eventMapping
      )) {
        // Create an event handler that triggers a UI action
        mappedProps[reactEventProp] = (event: unknown) => {
          // Extract element properties from the event target
          const target = (event as { target?: HTMLElement })?.target;
          const properties: Record<string, unknown> = {};

          if (target) {
            // Collect all data attributes
            const attributes = target.attributes;
            for (let i = 0; i < attributes.length; i++) {
              const attr = attributes[i];
              properties[attr.name] = attr.value;
            }
          }

          // Also include any props passed to this component
          Object.assign(properties, props);

          // Trigger the UI action with Remote DOM event format
          onUIAction({
            type: "event",
            event: remoteEventName,
            properties,
            target: target?.tagName?.toLowerCase(),
          });
        };
      }
    }

    // Forward the mapped props to the actual component
    return React.createElement(Component, mappedProps as P);
  };

  // Set display name for debugging
  WrapperComponent.displayName = `PropMappingWrapper(${Component.displayName || Component.name || "Component"})`;

  return WrapperComponent;
}
