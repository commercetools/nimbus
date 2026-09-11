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
 * Wraps React Aria's `ListBoxSection` and renders its optional `label` as an
 * accessible `Header`. When `label` is omitted no header is rendered; provide
 * an `aria-label` so the group still has an accessible name. Supports both
 * static children and a dynamic `items` + render-function collection.
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

  // A headerless section still needs an accessible name — React Aria requires
  // an `aria-label` (or `aria-labelledby`) on a section rendered without a
  // `Header`. Dev-only, matching the repo convention (see breadcrumbs.root).
  if (process.env.NODE_ENV !== "production") {
    if (!label && !props["aria-label"] && !props["aria-labelledby"]) {
      console.warn(
        "ListBox.Section: a section without a `label` should be given an `aria-label` (or `aria-labelledby`) so the group has an accessible name."
      );
    }
  }

  return (
    <ListBoxSectionSlot asChild {...styleProps}>
      <RaListBoxSection ref={ref} {...functionalProps}>
        {label != null && typeof label !== "boolean" && label !== "" && (
          <ListBoxSectionHeaderSlot asChild>
            <RaHeader>{label}</RaHeader>
          </ListBoxSectionHeaderSlot>
        )}

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
