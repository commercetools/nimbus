import { forwardRef } from "react";
import { ListBoxItem as AriaListBoxItem } from "react-aria-components";
import { ListBoxItemSlot } from "../list-box.slots";
import type { ListBoxItemProps } from "../list-box.types";

/**
 * ListBoxItem
 * ============================================================
 * An individual selectable item within a ListBox component.
 *
 * Features:
 * - Uses React Aria for accessibility and keyboard navigation
 * - Supports selection state and disabled state
 * - Allows forwarding refs to the underlying DOM element
 * - Accepts all native HTML 'div' attributes (including aria- & data-attributes)
 * - Supports styling variants from the parent ListBox
 * - Allows overriding styles using style-props
 */
export const ListBoxItem = forwardRef<HTMLDivElement, ListBoxItemProps>(
  ({ children, value, isDisabled, ...props }, ref) => {
    return (
      <ListBoxItemSlot asChild ref={ref} {...props}>
        <AriaListBoxItem id={value} isDisabled={isDisabled}>
          {children}
        </AriaListBoxItem>
      </ListBoxItemSlot>
    );
  }
);

ListBoxItem.displayName = "ListBoxItem";
