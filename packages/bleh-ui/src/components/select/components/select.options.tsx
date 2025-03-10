import { forwardRef, type ForwardedRef } from "react";
import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

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

export const SelectOptions = fixedForwardRef(
  <T extends object>(
    props: SelectOptionsProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    const [styleProps, rest] = extractStyleProps(props);
    return (
      <SelectOptionsSlot asChild {...styleProps}>
        <RaListBox ref={forwardedRef} {...rest} />
      </SelectOptionsSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
SelectOptions.displayName = "Select.Options";
