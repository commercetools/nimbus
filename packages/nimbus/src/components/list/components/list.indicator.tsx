import { ListIndicatorSlot } from "../list.slots";
import type { ListIndicatorProps } from "../list.types";

/**
 * # ListIndicator
 *
 * A custom marker or indicator that appears before the list item content.
 * Useful for icons, checkmarks, or custom bullets.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <ListItem>
 *   <ListIndicator>
 *     <Icon><CheckIcon /></Icon>
 *   </ListIndicator>
 *   Item with custom indicator
 * </ListItem>
 * ```
 */
export const ListIndicator = (props: ListIndicatorProps) => {
  return <ListIndicatorSlot {...props} />;
};

ListIndicator.displayName = "List.Indicator";
