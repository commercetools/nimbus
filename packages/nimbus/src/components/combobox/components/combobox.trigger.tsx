import { useComboBoxRootContext } from "./combobox.root-context";
import {
  ComboBoxTriggerSlot,
  ComboBoxLeadingElementSlot,
} from "../combobox.slots";
import type { ComboBoxTriggerProps } from "../combobox.types";

/**
 * # ComboBox.Trigger
 *
 * Wrapper for the input trigger area. Applies the trigger ref for popover positioning.
 * Renders leadingElement (if provided) in a styled slot before children.
 * Children should include ComboBox.Input, ComboBox.TagGroup (for multi-select), and IconButton components.
 *
 * @example
 * ```tsx
 * <ComboBox.Trigger>
 *   <ComboBox.TagGroup />
 *   <ComboBox.Input />
 *   <IconButton slot="toggle"><Icons.KeyboardArrowDown /></IconButton>
 *   <IconButton slot="clear"><Icons.Close /></IconButton>
 * </ComboBox.Trigger>
 * ```
 *
 * @supportsStyleProps
 */
export const ComboBoxTrigger = ({
  children,
  ...restProps
}: ComboBoxTriggerProps) => {
  const { triggerRef, leadingElement } = useComboBoxRootContext();

  return (
    <ComboBoxTriggerSlot ref={triggerRef} {...restProps}>
      {leadingElement && (
        <ComboBoxLeadingElementSlot>
          {leadingElement}
        </ComboBoxLeadingElementSlot>
      )}
      {children}
    </ComboBoxTriggerSlot>
  );
};

ComboBoxTrigger.displayName = "ComboBox.Trigger";
