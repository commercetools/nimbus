import { forwardRef } from "react";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
} from "react-aria-components";
import {
  ListBoxSectionSlot,
  ListBoxSectionHeaderSlot,
} from "../list-box.slots";
import type { ListBoxSectionProps } from "../list-box.types";

/**
 * ListBoxSection
 * ============================================================
 * A section component for grouping related ListBox items together.
 * Can include an optional header for labeling the group.
 *
 * Features:
 * - Uses React Aria for accessibility and proper grouping semantics
 * - Supports optional section headers
 * - Allows forwarding refs to the underlying DOM element
 * - Accepts all native HTML 'div' attributes (including aria- & data-attributes)
 * - Supports styling variants from the parent ListBox
 * - Allows overriding styles using style-props
 */
export const ListBoxSection = forwardRef<HTMLDivElement, ListBoxSectionProps>(
  ({ children, title, ...props }, ref) => {
    return (
      <ListBoxSectionSlot asChild ref={ref}>
        <RaListBoxSection ref={ref} {...props}>
          {title && (
            <ListBoxSectionHeaderSlot asChild>
              <RaHeader>{title}</RaHeader>
            </ListBoxSectionHeaderSlot>
          )}
          {children}
        </RaListBoxSection>
      </ListBoxSectionSlot>
    );
  }
);

ListBoxSection.displayName = "ListBoxSection";
