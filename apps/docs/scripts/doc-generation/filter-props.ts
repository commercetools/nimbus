import type { PropItem } from "react-docgen-typescript";
/**
 * Prop filtering logic extracted from react-docgen-typescript parsing.
 * Filters out inherited HTML, React, Chakra, and ARIA props to show only
 * component-specific props in documentation.
 */

/**
 * Determines whether a prop should be filtered out of documentation.
 * Returns true if the prop should be KEPT, false if it should be FILTERED.
 *
 * @param prop - The prop item from react-docgen-typescript
 * @returns true if prop should be kept, false if it should be filtered
 */
export const shouldFilterProp = (prop: PropItem): boolean => {
  // React Key attribute
  const isReactKeyAttribute = prop.name === "key";

  // All HTML attributes
  const isHTMLAttribute = prop.parent?.name === "HTMLAttributes";

  // HTML-Event listener
  const isDOMAttribute = prop.parent?.name === "DOMAttributes";

  // ButtonHTMLAttributes
  const isButtonAttribute = prop.parent?.name === "ButtonHTMLAttributes";

  // GlobalDOMEvents
  const isGlobalDOMEvent = prop.parent?.name === "GlobalDOMEvents";

  // GlobalDOMAttribute
  const isGlobalDOMAttribute = prop.parent?.name === "GlobalDOMAttributes";

  // Chakra related props
  const isChakraSystemProperty = prop.parent?.name === "SystemProperties";
  const isChakraCondition = prop.parent?.name === "Conditions";
  const isSlotRecipeDefinition = prop.name === "recipe";

  // Default accessibility props
  const isAriaAttribute = prop.parent?.name === "AriaAttributes";

  /**
   * Fallback props: When standard HTML attribute names (e.g., "height") are
   * repurposed for style APIs, their actual DOM equivalents are generated
   * as "HtmlProps" (e.g., "htmlHeight") to avoid conflicts.
   */
  const isHtmlFallbackProp = prop.parent?.name === "HtmlProps";

  // Exclude redundant props
  if (
    isReactKeyAttribute ||
    isHTMLAttribute ||
    isDOMAttribute ||
    isButtonAttribute ||
    isGlobalDOMEvent ||
    isGlobalDOMAttribute ||
    isAriaAttribute ||
    isChakraSystemProperty ||
    isChakraCondition ||
    isSlotRecipeDefinition ||
    isHtmlFallbackProp
  ) {
    return false;
  }

  // Keep all other props
  return true;
};
