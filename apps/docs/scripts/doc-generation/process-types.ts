/**
 * Post-processing pipeline for react-docgen-typescript output.
 * Applies metadata enrichment and filtering in a single in-memory pass.
 */

import type { ComponentDoc, Props } from "react-docgen-typescript";
import { shouldFilterProp } from "./filter-props";

/**
 * Enrich component with metadata based on JSDoc tags and props.
 * This adds aggregate information about the component at the top level.
 *
 * @param component - The component doc from react-docgen-typescript
 * @param filteredProps - The props object after filtering
 * @returns Component-level metadata
 */
const enrichComponent = (component: ComponentDoc): Record<string, unknown> => {
  // Check if component has @supportsStyleProps JSDoc tag
  const supportsStyleProps = "supportsStyleProps" in (component.tags || {});

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

    // Step 2: Generate component-level metadata from JSDoc tags and filtered props
    const metadata = enrichComponent(component, filteredProps);

    // Step 3: Return component with metadata and filtered props
    return {
      ...component,
      ...metadata,
      props: filteredProps,
    };
  });
};
