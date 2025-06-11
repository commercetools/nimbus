import { Radio as RaRadio } from "react-aria-components";
import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { RadioInputOptionProps } from "../radio-input.types";
import { RadioInputOptionSlot } from "../radio-input.slots";

export const RadioInputOption = ({
  children,
  ...rest
}: RadioInputOptionProps) => {
  const [styleProps, restProps] = extractStyleProps(rest);

  return (
    <RadioInputOptionSlot {...styleProps} asChild>
      <RaRadio {...restProps}>
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

RadioInputOption.displayName = "RadioInputOption";
