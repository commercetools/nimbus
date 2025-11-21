import { Close, KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { IconButton } from "@/components/icon-button/icon-button";
import { useComboBoxRootContext } from "./combobox.root-context";
import { ComboBoxTriggerSlot, ComboBoxContentSlot } from "../combobox.slots";
import type { ComboBoxTriggerProps } from "../combobox.types";
import { ComboBoxInput } from "./combobox.input";
import { ComboBoxLeadingElement } from "./combobox.leading-element";
import { ComboBoxTagGroup } from "./combobox.tag-group";

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
  const { triggerRef, leadingElement, inputRef, isDisabled } =
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
      <IconButton slot="toggle" size="2xs" variant="ghost" excludeFromTabOrder>
        <KeyboardArrowDown />
      </IconButton>
      <IconButton
        slot="clear"
        size="2xs"
        variant="ghost"
        colorPalette="primary"
      >
        <Close />
      </IconButton>
      {children}
    </ComboBoxTriggerSlot>
  );
};

ComboBoxTrigger.displayName = "ComboBox.Trigger";
