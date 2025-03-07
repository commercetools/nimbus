import { forwardRef, type ForwardedRef } from "react";
import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const SelectOptions = forwardRef(
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
) as <T extends object>(props: SelectOptionsProps<T>) => JSX.Element;

// @ts-expect-error - doesn't work with this complex types
SelectOptions.displayName = "Select.Options";
