/**
 * Remote DOM Prop Injection System
 *
 * Enables prop injection for components that use React.cloneElement()
 * to pass props to their children (e.g., FormField.Input).
 *
 * ## The Problem
 * When FormField.Input uses cloneElement() to inject props (id, aria-describedby,
 * error state) into its child, those props must flow through the Remote DOM
 * serialization boundary to reach the actual child component on the client.
 *
 * ## The Solution
 * The renderElement function recursively renders Remote DOM element trees,
 * merging injected props from cloneElement with the element's original props.
 *
 * ## Example Flow
 * ```
 * Server (Remote DOM):
 *   FormField.Input calls cloneElement(child, { id: "field-123", ... })
 *
 * Client (this module):
 *   renderElement receives both the child element AND the injected props
 *   Merges them: { ...elementProps, ...injectedProps }
 *   Renders the actual component with merged props
 * ```
 */

import React from "react";

/**
 * Remote DOM Element Structure
 * Represents a serialized element from the Remote DOM tree
 */
export interface RemoteDomElement {
  type: number;
  data?: string;
  element?: string;
  properties?: Record<string, unknown>;
  children?: RemoteDomElement[];
}

/**
 * Recursively render Remote DOM element tree as React components
 *
 * This is the core of prop injection - it takes injected props from a parent's
 * cloneElement call and merges them with the Remote DOM element's props before
 * rendering.
 *
 * @param element - Remote DOM element data (serialized from server)
 * @param key - React key for this element
 * @param componentMap - Map of remote-dom tag names to React components
 * @param injectedProps - Props from parent's cloneElement (e.g., from FormField.Input)
 * @returns Rendered React element with merged props
 */
export function renderElement(
  element: RemoteDomElement,
  key: string | number,
  componentMap: Map<string, React.ComponentType<Record<string, unknown>>>,
  injectedProps: Record<string, unknown> = {}
): React.ReactNode {
  if (!element) return null;

  // Text nodes
  if (element.type === 3) {
    return element.data;
  }

  // Element nodes
  if (element.type === 1) {
    const Component = componentMap.get(element.element);

    if (!Component) {
      console.warn(`⚠️ No component registered for: ${element.element}`);
      console.warn(`   Element structure:`, element);
      console.warn(`   Available components:`, Array.from(componentMap.keys()));
      return null;
    }

    const props = element.properties || {};

    // CRITICAL: Merge Remote DOM props with injected props from cloneElement
    // This is why this module exists - to bridge the serialization gap
    const finalProps = { ...props, ...injectedProps };

    // Recursively render children (without prop injection - only direct children get injected props)
    const children = (element.children || []).map(
      (child: RemoteDomElement, index: number) =>
        renderElement(child, `${key}-child-${index}`, componentMap, {})
    );

    // Don't pass children to void elements (img, input, etc.)
    if (children.length === 0) {
      return <Component key={key} {...finalProps} />;
    }

    return (
      <Component key={key} {...finalProps}>
        {children}
      </Component>
    );
  }

  return null;
}
