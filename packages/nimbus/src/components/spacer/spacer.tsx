/**
 * Spacer component
 *
 * A simple layout component that occupies leftover available space in flex containers.
 * Uses flexGrow="1" to fill remaining space.
 */

import { Box } from "@chakra-ui/react/box";
import type { SpacerProps } from "./spacer.types";

/**
 * Spacer component that fills available space in flex layouts.
 *
 * @example
 * ```tsx
 * <Stack direction="row">
 *   <Button>Left</Button>
 *   <Spacer />
 *   <Button>Right</Button>
 * </Stack>
 * ```
 */
export const Spacer = ({ ref, ...props }: SpacerProps) => {
  return <Box ref={ref} flexGrow={1} {...props} />;
};

Spacer.displayName = "Spacer";
