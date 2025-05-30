import { type ForwardedRef, type ReactNode } from "react";
import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { ComboBoxOptionGroupSlot } from "../combobox.slots";
import type { ComboBoxOptionGroupProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxOptionGroup = fixedForwardRef(
  <T extends object>(
    { label, items, children, ...props }: ComboBoxOptionGroupProps<T>,
    forwardedRef: ForwardedRef<HTMLUListElement>
  ) => {
    // Validate that children is a function when items is provided
    if (items && typeof children !== "function") {
      throw new Error(
        'ComboBoxOptionGroup: When "items" is provided, "children" must be a function'
      );
    }
    const [styleProps, rest] = extractStyleProps(props);
    return (
      <ComboBoxOptionGroupSlot asChild ref={forwardedRef} {...styleProps}>
        <RaListBoxSection {...rest}>
          <RaHeader>{label}</RaHeader>
          {items ? (
            <Collection items={items}>
              {(item: T) => {
                if (typeof children === "function") {
                  return children(item);
                }
                return null;
              }}
            </Collection>
          ) : (
            (children as ReactNode)
          )}
        </RaListBoxSection>
      </ComboBoxOptionGroupSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxOptionGroup.displayName = "ComboBox.OptionGroup";
