import { ListBoxItem } from "react-aria-components";
import { Check } from "@commercetools/nimbus-icons";
import {
  ComboBoxOptionSlot,
  ComboBoxOptionIndicatorSlot,
  ComboBoxOptionContentSlot,
} from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ComboBoxOption = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxOptionProps<T>) => {
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
};

ComboBoxOption.displayName = "ComboBox.Option";
