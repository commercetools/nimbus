import { Input as RaInput } from "react-aria-components";
import { ComboBoxInputSlot } from "../combobox.slots";
import type { ComboBoxInputProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Input
 *
 * Text input field for filtering and typing.
 * Reads from InputContext provided by the custom context provider.
 *
 * The InputContext provides all necessary props:
 * - role="combobox"
 * - aria-autocomplete="list"
 * - aria-controls (listbox ID)
 * - aria-expanded (open state)
 * - aria-label / aria-labelledby
 * - placeholder
 *
 * Uses React Aria Input directly (not TextInput) for custom combobox styling.
 *
 * @example
 * ```tsx
 * <ComboBox.Trigger>
 *   <ComboBox.Input />
 *   <IconButton slot="toggle"><Icons.KeyboardArrowDown /></IconButton>
 * </ComboBox.Trigger>
 * ```
 *
 * @supportsStyleProps
 */
export const ComboBoxInput = (props: ComboBoxInputProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <ComboBoxInputSlot asChild {...styleProps}>
      <RaInput {...functionalProps} />
    </ComboBoxInputSlot>
  );
};

ComboBoxInput.displayName = "ComboBox.Input";
