import { Radio as RaRadio } from "react-aria-components";
import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import type { RadioInputOptionProps } from "../radio-input.types";
import { RadioInputOptionSlot } from "../radio-input.slots";
import { useFocusRing } from "react-aria";

/**
 * # RadioInput.Option
 *
 * An individual radio option within a RadioInput group that can be selected.
 * Provides visual feedback for selection state and supports keyboard interaction.
 *
 * @supportsStyleProps
 */
export const RadioInputOption = ({
  children,
  value,
  ...rest
}: RadioInputOptionProps) => {
  const [styleProps, restProps] = extractStyleProps(rest);
  const { isFocused, focusProps } = useFocusRing();

  return (
    <RadioInputOptionSlot
      {...styleProps}
      {...focusProps}
      data-focus={isFocused || undefined}
      asChild
    >
      <RaRadio value={value} {...restProps}>
        {(renderProps) => {
          const content =
            typeof children === "function"
              ? children({
                  ...renderProps,
                })
              : children;
          return (
            <>
              {renderProps.isSelected ? (
                <RadioButtonChecked />
              ) : (
                <RadioButtonUnchecked />
              )}
              {content}
            </>
          );
        }}
      </RaRadio>
    </RadioInputOptionSlot>
  );
};

RadioInputOption.displayName = "RadioInput.Option";
