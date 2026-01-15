import { useContext } from "react";
import { Input as RaInput, InputContext } from "react-aria-components";
import { ComboBoxInputSlot } from "../combobox.slots";
import type { ComboBoxInputProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";
import { useComboBoxRootContext } from "./combobox.root-context";

/**
 * # ComboBox.Input (Internal Component)
 *
 * Internal text input field for filtering and typing in the combobox.
 * Automatically rendered by ComboBox.Trigger - not exposed to consumers.
 *
 * Consumes React Aria's InputContext which provides all necessary ARIA attributes
 * (role, aria-autocomplete, aria-controls, aria-expanded, etc.).
 *
 * Input width dynamically adjusts to match the text content or placeholder length,
 * collapsing to 1px when empty to avoid creating blank lines in multi-select mode.
 *
 * @internal
 * @supportsStyleProps
 */
export const ComboBoxInput = (props: ComboBoxInputProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);
  const inputContext = useContext(InputContext);
  const { inputRef } = useComboBoxRootContext();

  // Get the current value from context (handle both direct and slotted values)
  let currentValue = "";
  let placeholder = "";

  if (
    inputContext &&
    typeof inputContext === "object" &&
    "value" in inputContext
  ) {
    currentValue = (inputContext.value as string) || "";
    placeholder = (inputContext.placeholder as string) || "";
  }

  // Calculate size attribute: length of value or placeholder, with minimum of 1
  const inputSize = Math.max(currentValue.length || placeholder.length || 1, 1);

  return (
    <ComboBoxInputSlot asChild {...styleProps}>
      <RaInput
        ref={inputRef}
        {...functionalProps}
        size={inputSize}
        // If the value & placeholder are falsy, input width should be 1px
        // so it doesn't cause a blank line in content box
        data-empty={!(!!currentValue.length || !!placeholder.length)}
      />
    </ComboBoxInputSlot>
  );
};

ComboBoxInput.displayName = "ComboBox.Input";
