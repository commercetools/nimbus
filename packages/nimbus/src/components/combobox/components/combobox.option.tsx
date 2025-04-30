import type { ForwardedRef } from "react";
import { ListBoxItem as RaListBoxItem } from "react-aria-components";
import { ComboBoxOptionSlot } from "../combobox.slots";
import type { ComboBoxOptionProps } from "../combobox.types";
import { Box, Flex, Checkbox } from "@/components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxOption = fixedForwardRef(
  <T extends object>(
    props: ComboBoxOptionProps<T>,
    forwardedRef: ForwardedRef<HTMLLIElement>
  ) => {
    const [styleProps, rest] = extractStyleProps(props);
    return (
      <ComboBoxOptionSlot asChild ref={forwardedRef} {...styleProps}>
        <RaListBoxItem {...rest}>
          {({
            selectionMode,
            isSelected,
            isDisabled,

            ...restRenderProps
          }) => {
            console.log(selectionMode, isSelected, isDisabled);
            return (
              <Flex>
                {selectionMode === "multiple" ? (
                  <Checkbox isSelected={isSelected} isDisabled={isDisabled} />
                ) : null}
                <Box>
                  {typeof props.children === "function"
                    ? props.children({
                        selectionMode,
                        isSelected,
                        isDisabled,

                        ...restRenderProps,
                      })
                    : props.children}
                </Box>
              </Flex>
            );
          }}
        </RaListBoxItem>
      </ComboBoxOptionSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxOption.displayName = "ComboBox.Option";
