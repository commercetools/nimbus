import React from "react";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
} from "react-aria-components";
import { extractStyleProps } from "@/utils";
import {
  ListBoxSectionSlot,
  ListBoxSectionHeaderSlot,
} from "../list-box.slots";
import type { ListBoxSectionProps } from "../list-box.types";

/**
 * ListBox.Section
 *
 * Groups related `ListBox.Item` elements under a labelled heading. Renders an
 * optional visible section header when `title` is provided. Supports both
 * static children and dynamic collections via the `items` prop.
 *
 * @supportsStyleProps
 */
export const ListBoxSection = <T extends object>({
  title,
  children,
  ref,
  ...props
}: ListBoxSectionProps<T>) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ListBoxSectionSlot ref={ref} {...styleProps} asChild>
      <RaListBoxSection {...functionalProps}>
        {title && (
          <ListBoxSectionHeaderSlot asChild>
            <RaHeader>{title}</RaHeader>
          </ListBoxSectionHeaderSlot>
        )}
        {children as React.ReactNode}
      </RaListBoxSection>
    </ListBoxSectionSlot>
  );
};

ListBoxSection.displayName = "ListBox.Section";
