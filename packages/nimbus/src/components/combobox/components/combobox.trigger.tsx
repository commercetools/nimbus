import { Close, KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components/icon-button/icon-button";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { useComboBoxRootContext } from "./combobox.root-context";
import { ComboBoxTriggerSlot, ComboBoxContentSlot } from "../combobox.slots";
import type { ComboBoxTriggerProps } from "../combobox.types";
import { ComboBoxInput } from "./combobox.input";
import { ComboBoxLeadingElement } from "./combobox.leading-element";
import { ComboBoxTagGroup } from "./combobox.tag-group";

/**
 * # ComboBox.Trigger
 *
 * The trigger element that contains the input field and controls for the combobox.
 * Automatically renders the tag group (for multi-select), input field, toggle button, and clear button.
 * Handles click interactions to focus the input when clicking anywhere on the trigger area.
 *
 * @example
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Trigger />
 *   <ComboBox.Popover>
 *     <ComboBox.ListBox>
 *       <ComboBox.Item value="option1">Option 1</ComboBox.Item>
 *     </ComboBox.ListBox>
 *   </ComboBox.Popover>
 * </ComboBox.Root>
 * ```
 *
 * @supportsStyleProps
 */
export const ComboBoxTrigger = ({
  children,
  ...restProps
}: ComboBoxTriggerProps) => {
  const { triggerRef, leadingElement, inputRef, isLoading, isDisabled } =
    useComboBoxRootContext();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Focus input when clicking anywhere on the trigger, except on buttons
    if (
      !isDisabled &&
      e.target instanceof HTMLElement &&
      !e.target.closest("button")
    ) {
      inputRef.current?.focus();
    }
  };

  return (
    <ComboBoxTriggerSlot ref={triggerRef} onClick={handleClick} {...restProps}>
      {leadingElement && (
        <ComboBoxLeadingElement>{leadingElement}</ComboBoxLeadingElement>
      )}
      <ComboBoxContentSlot>
        <ComboBoxTagGroup />
        <ComboBoxInput />
      </ComboBoxContentSlot>
      <IconButton
        slot="clear"
        size="2xs"
        variant="ghost"
        colorPalette="primary"
      >
        <Close />
      </IconButton>

      <IconButton
        slot="toggle"
        size="2xs"
        variant="ghost"
        colorPalette="neutral"
        excludeFromTabOrder
      >
        {isLoading ? (
          <LoadingSpinner size="xs" margin="50" />
        ) : (
          <KeyboardArrowDown />
        )}
      </IconButton>

      {children}
    </ComboBoxTriggerSlot>
  );
};

ComboBoxTrigger.displayName = "ComboBox.Trigger";
