import { forwardRef } from "react";
import { ListBox as AriaListBox } from "react-aria-components";
import { ListBoxRootSlot } from "../list-box.slots";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { ListBoxRootProps } from "../list-box.types";

/**
 * ListBoxRoot
 * ============================================================
 * The root container for the ListBox component. Provides the main
 * container and selection logic for list items.
 *
 * Features:
 * - Uses React Aria for accessibility and keyboard navigation
 * - Supports single and multiple selection modes
 * - Allows forwarding refs to the underlying DOM element
 * - Accepts all native HTML 'div' attributes (including aria- & data-attributes)
 * - Supports styling variants configured in the recipe
 * - Allows overriding styles using style-props
 */
export const ListBoxRoot = forwardRef<HTMLDivElement, ListBoxRootProps>(
  ({ children, ...props }, ref) => {
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <ListBoxRootSlot {...styleProps}>
        <AriaListBox ref={ref} {...restProps}>
          {children}
        </AriaListBox>
      </ListBoxRootSlot>
    );
  }
);

ListBoxRoot.displayName = "ListBoxRoot";
