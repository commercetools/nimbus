import { defineConditions } from "@chakra-ui/react/styled-system";

/**
 * Custom conditions for React Aria Components state management
 * Maps Chakra UI pseudo-selectors to React Aria data attributes
 */
export const conditions = defineConditions({
  /**
   * Maps to React Aria's open state data attributes
   * Used for animations when a component is opening/entering
   */
  open: "&:is([data-entering], [data-open])",

  /**
   * Maps to React Aria's closed state data attributes
   * Used for animations when a component is closing/exiting
   */
  closed: "&:is([data-exiting], [data-closed])",
});
