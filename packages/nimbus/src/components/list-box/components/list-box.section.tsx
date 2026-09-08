import { type ReactNode } from "react";
import { extractStyleProps } from "@/utils";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import {
  ListBoxSectionSlot,
  ListBoxSectionHeaderSlot,
} from "../list-box.slots";
import type { ListBoxSectionProps } from "../list-box.types";

/**
 * ListBox.Section - A labelled group of options.
 *
 * Wraps React Aria's `ListBoxSection` and renders its `label` as an accessible
 * `Header`. Supports both static children and a dynamic `items` + render-function
 * collection.
 *
 * @supportsStyleProps
 */
export const ListBoxSection = <T extends object>(
  props: ListBoxSectionProps<T>
) => {
  const { ref, label, items, children, ...restProps } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  // Match Select.OptionGroup: a dynamic collection requires a render function.
  if (items && typeof children !== "function") {
    throw new Error(
      'ListBox.Section: When "items" is provided, "children" must be a function'
    );
  }

  return (
    <ListBoxSectionSlot asChild {...styleProps}>
      <RaListBoxSection ref={ref} {...functionalProps}>
        <ListBoxSectionHeaderSlot asChild>
          <RaHeader>{label}</RaHeader>
        </ListBoxSectionHeaderSlot>

        {items ? (
          <Collection items={items}>
            {(item: T) =>
              typeof children === "function" ? children(item) : null
            }
          </Collection>
        ) : (
          (children as ReactNode)
        )}
      </RaListBoxSection>
    </ListBoxSectionSlot>
  );
};

ListBoxSection.displayName = "ListBox.Section";
