import { ListBoxItem } from "react-aria-components";
import { Check } from "@commercetools/nimbus-icons";
import {
  ComboBoxOptionSlot,
  ComboBoxOptionIndicatorSlot,
  ComboBoxOptionContentSlot,
} from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { extractStyleProps } from "@/utils";

/**
 * # ComboBox.Option
 *
 * Individual option within the combobox listbox.
 * Wraps React Aria's ListBoxItem for automatic ARIA management.
 * Displays a checkmark indicator for selected items in multi-select mode.
 * Supports render prop pattern for custom rendering.
 *
 * @example
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Option id="1">Option 1</ComboBox.Option>
 *   <ComboBox.Option id="2">Option 2</ComboBox.Option>
 * </ComboBox.Root>
 * ```
 *
 * @example Render prop pattern
 * ```tsx
 * <ComboBox.Option id="1">
 *   {({ isSelected, isDisabled }) => (
 *     <div>
 *       Option 1 {isSelected && "(Selected)"}
 *     </div>
 *   )}
 * </ComboBox.Option>
 * ```
 */

/**
 * @supportsStyleProps
 */
export function ComboBoxOption<T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionProps<T>) {
  const [styleProps, restProps] = extractStyleProps(props);
  const textValue = typeof children === "string" ? children : undefined;

  return (
    <ComboBoxOptionSlot {...styleProps} asChild>
      <ListBoxItem
        ref={ref}
        textValue={props.textValue ?? textValue}
        aria-label={props.textValue ?? textValue}
        {...restProps}
      >
        {(renderProps) => {
          const content =
            typeof children === "function"
              ? children({
                  ...renderProps,
                })
              : children;
          return renderProps.selectionMode === "multiple" ? (
            <>
              <ComboBoxOptionIndicatorSlot>
                <span data-selected={renderProps.isSelected}>
                  {renderProps.isSelected && <Check />}
                </span>
              </ComboBoxOptionIndicatorSlot>

              <ComboBoxOptionContentSlot>{content}</ComboBoxOptionContentSlot>
            </>
          ) : (
            <>{content}</>
          );
        }}
      </ListBoxItem>
    </ComboBoxOptionSlot>
  );
}

ComboBoxOption.displayName = "ComboBox.Option";
