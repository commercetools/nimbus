import { Popover as RaPopover } from "react-aria-components";
import { ComboBoxPopoverSlot } from "../combobox.slots";
import type { ComboBoxPopoverProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Popover
 *
 * Popover wrapper for the options dropdown list.
 * Uses React Aria's Popover directly, which reads from PopoverContext provided by
 * the custom context provider. The dropdown does not use the shared Nimbus
 * Popover: its own `popover` slot already declares every surface style, so the
 * shared recipe would contribute nothing.
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
      <RaPopover ref={ref} isNonModal={true} {...functionalProps}>
        {children}
      </RaPopover>
    </ComboBoxPopoverSlot>
  );
};

ComboBoxPopover.displayName = "ComboBox.Popover";
