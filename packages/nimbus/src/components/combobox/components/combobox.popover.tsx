import { Popover } from "../../popover";
import { ComboBoxPopoverSlot } from "../combobox.slots";
import type { ComboBoxPopoverProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Popover
 *
 * Popover wrapper for the options dropdown list.
 * Uses Nimbus Popover component which reads from PopoverContext provided by the custom context provider.
 *
 * The PopoverContext provides:
 * - open state
 * - positioning configuration (fixed strategy, bottom-start placement, --nimbus-combobox-trigger-width CSS var)
 * - positionReference (trigger ref for proper positioning)
 *
 * @example
 * ```tsx
 * <ComboBox.Popover>
 *   <ComboBox.ListBox>
 *     {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
 *   </ComboBox.ListBox>
 * </ComboBox.Popover>
 * ```
 *
 * @supportsStyleProps
 */
export const ComboBoxPopover = ({
  children,
  ref,
  ...restProps
}: ComboBoxPopoverProps) => {
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <ComboBoxPopoverSlot asChild {...styleProps}>
      <Popover
        ref={ref}
        isNonModal={true}
        autoFocus={true}
        {...functionalProps}
      >
        {children}
      </Popover>
    </ComboBoxPopoverSlot>
  );
};

ComboBoxPopover.displayName = "ComboBox.Popover";
