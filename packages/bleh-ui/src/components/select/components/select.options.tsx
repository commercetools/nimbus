import { forwardRef } from "react";

import { ListBox as RaListBox } from "react-aria-components";
import { SelectOptionsSlot } from "./../select.slots";
import type { SelectOptionsProps } from "../select.types";

export const SelectOptions = forwardRef<HTMLDivElement, SelectOptionsProps>(
  (props, forwardedRef) => {
    return (
      <SelectOptionsSlot asChild ref={forwardedRef}>
        <RaListBox {...props} />
      </SelectOptionsSlot>
    );
  }
);

SelectOptions.displayName = "Select.Options";
