import { forwardRef, type ForwardedRef, type ReactNode } from "react";

import {
  ListBoxSection as RaListBoxSection,
  Header as RaHeader,
  Collection,
} from "react-aria-components";
import { SelectOptionGroupSlot } from "./../select.slots";
import type { SelectOptionGroupProps } from "../select.types";

/**
 * This is a workaround to fix the type of `forwardRef`.
 * The issue is that the type of `forwardRef` is not correct when using generics.
 *
 * While not ideal from a type-safety perspective, it's necessary because
 * TypeScript cannot properly express the transformation that happens when
 * combining generics with `forwardRef`.
 */
const fixedForwardRef = <T, P extends object>(
  render: (props: P, ref: React.Ref<T>) => JSX.Element
): ((props: P & React.RefAttributes<T>) => JSX.Element) => {
  // @ts-expect-error - This tells TypeScript to "trust us" about the resulting type.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return forwardRef(render) as any;
};

export const SelectOptionGroup = fixedForwardRef(
  <T extends object>(
    { label, items, children, ...props }: SelectOptionGroupProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    // Validate that children is a function when items is provided
    if (items && typeof children !== "function") {
      throw new Error(
        'SelectOptionGroup: When "items" is provided, "children" must be a function'
      );
    }

    return (
      <RaListBoxSection ref={forwardedRef} {...props}>
        <SelectOptionGroupSlot asChild>
          <RaHeader>{label}</RaHeader>
        </SelectOptionGroupSlot>

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
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
SelectOptionGroup.displayName = "Select.OptionGroup";
