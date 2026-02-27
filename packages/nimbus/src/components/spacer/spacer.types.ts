/**
 * Type definitions for the Spacer component.
 *
 * A simple layout component that occupies leftover available space in flex containers.
 * Component tier: 1 (Simple)
 */

import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { BoxProps } from "@chakra-ui/react/box";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Spacer component.
 * Extends Chakra UI Box props with flexGrow automatically set to 1.
 */
export type SpacerProps = OmitInternalProps<BoxProps, "flexGrow"> & {
  /**
   * Reference to the spacer element
   */
  ref?: React.Ref<HTMLDivElement>;
};
