import { useRef } from "react";
import { Radio as RaRadio } from "react-aria-components";
import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import type { RadioInputOptionProps } from "../radio-input.types";
import { RadioInputOptionSlot } from "../radio-input.slots";
import { useFocusRing, useFocusable, mergeProps } from "react-aria";

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

  // Enable tooltip trigger support: reads from FocusableContext (set by Tooltip.Root)
  // to apply hover/focus handlers to the visible label element. No-op outside tooltips.
  const optionRef = useRef<HTMLLabelElement>(null);
  const { focusableProps } = useFocusable(
    { excludeFromTabOrder: true },
    optionRef
  );

  return (
    <RadioInputOptionSlot
      {...styleProps}
      {...mergeProps(focusProps, focusableProps)}
      data-focus={isFocused || undefined}
      asChild
    >
      <RaRadio value={value} {...restProps} ref={optionRef}>
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
