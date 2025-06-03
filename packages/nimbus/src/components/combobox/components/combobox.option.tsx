import { type ReactNode } from "react";
import { ListBoxItem } from "react-aria-components";
import { Checkbox } from "@/components";
import { ComboBoxOptionSlot } from "../combobox.slots";
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
            <Checkbox isSelected={renderProps.isSelected}>
              {children as ReactNode}
            </Checkbox>
          ) : (
            <>{content}</>
          );
        }}
      </ListBoxItem>
    </ComboBoxOptionSlot>
  );
};

ComboBoxOption.displayName = "ComboBox.Option";
