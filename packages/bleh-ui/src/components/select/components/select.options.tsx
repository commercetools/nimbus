import { forwardRef } from "react";

import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const SelectOptions = forwardRef<HTMLDivElement, SelectOptionsProps>(
  (props, forwardedRef) => {
    const [styleProps, rest] = extractStyleProps(props);
    return (
      <SelectOptionsSlot asChild {...styleProps}>
        <RaListBox ref={forwardedRef} {...rest} />
      </SelectOptionsSlot>
    );
  }
);

SelectOptions.displayName = "Select.Options";
