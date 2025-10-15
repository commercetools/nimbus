/**
 * Post-processing pipeline for react-docgen-typescript output.
 * Applies metadata enrichment and filtering in a single in-memory pass.
 */

import type { ComponentDoc, Props } from "react-docgen-typescript";
import { shouldFilterProp } from "./filter-props";

type PropItem = Props[string];

/**
 * Check if component supports Chakra style props by looking for
 * Chakra-specific props that survive filtering (css, as, asChild, unstyled).
 * These props indicate Chakra UI integration.
 *
 * If a component has zero props, it's likely a thin wrapper around a Chakra
 * component (like Image), so we default to true.
 */
const hasChakraIntegration = (
  filteredProps: Record<string, PropItem>
): boolean => {
  const propNames = Object.keys(filteredProps);

  // If component has no props at all, assume it's a Chakra wrapper
  // (react-docgen can't expand external type aliases)
  if (propNames.length === 0) {
    return true;
  }

  // Otherwise, check for Chakra-specific props
  const chakraProps = ["css", "as", "asChild", "unstyled"];
  return chakraProps.some((propName) => propName in filteredProps);
};

/**
 * Enrich component with metadata based on analyzing its props.
 * This adds aggregate information about the component at the top level.
 *
 * @param filteredProps - The props object after filtering
 * @returns Component-level metadata
 */
const enrichComponent = (
  filteredProps: Record<string, PropItem>
): Record<string, unknown> => {
  // Check if component supports Chakra UI style props
  // We check filtered props because some components (like Image) are
  // thin wrappers where react-docgen can't expand external types
  const supportsStyleProps = hasChakraIntegration(filteredProps);

  // Future enrichment examples:
  // - hasReactAriaProps: check for React Aria parent names
  // - propCategoryBreakdown: count props by category
  // - deprecationWarnings: list deprecated props
  // - requiredPropsCount: count required props

  return {
    supportsStyleProps,
  };
};

/**
 * Process parsed component types in a single pass:
 * 1. Filter out unwanted props
 * 2. Analyze filtered props to generate component-level metadata
 * 3. Return component with metadata and filtered props
 *
 * This is a single-pass, in-memory operation with no disk I/O.
 *
 * @param rawParsedTypes - Raw output from react-docgen-typescript
 * @returns Processed component docs with filtered props and enriched metadata
 */
export const processComponentTypes = (
  rawParsedTypes: ComponentDoc[]
): ComponentDoc[] => {
  return rawParsedTypes.map((component) => {
    // Step 1: Filter props
    const filteredProps = Object.fromEntries(
      Object.entries(component.props).filter(([, prop]) =>
        shouldFilterProp(prop)
      )
    );

    // Step 2: Generate component-level metadata from filtered props
    const metadata = enrichComponent(filteredProps);

    // Step 3: Return component with metadata and filtered props
    return {
      ...component,
      ...metadata,
      props: filteredProps,
    };
  });
};
