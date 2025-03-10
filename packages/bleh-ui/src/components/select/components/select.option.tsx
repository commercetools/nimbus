import { forwardRef, type ForwardedRef } from "react";
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { SelectOptionSlot } from "./../select.slots";
import type { SelectOptionProps } from "../select.types";

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

export const SelectOption = fixedForwardRef(
  <T extends object>(
    props: SelectOptionProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <SelectOptionSlot asChild ref={forwardedRef}>
        <RaListBoxItem {...props} />
      </SelectOptionSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
SelectOption.displayName = "Select.Option";
