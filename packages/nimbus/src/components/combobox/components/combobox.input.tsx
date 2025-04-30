import { type ForwardedRef } from "react";
import { TextInput, type TextInputProps } from "@/components";

import {
  ComboBoxInputSlot,
  type ComboBoxInputSlotProps,
} from "../combobox.slots";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxInput = fixedForwardRef(
  (props: ComboBoxInputSlotProps, ref: ForwardedRef<HTMLInputElement>) => {
    const [styleProps, inputProps] = extractStyleProps(props);

    return (
      <ComboBoxInputSlot ref={ref} asChild {...styleProps}>
        <TextInput {...(inputProps as TextInputProps)} />
      </ComboBoxInputSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxInput.displayName = "ComboBox.Input";
