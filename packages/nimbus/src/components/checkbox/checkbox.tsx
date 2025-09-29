import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { Check, Remove as Minus } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { CheckboxProps } from "./checkbox.types";
import type { CheckboxRenderProps } from "react-aria-components";
import {
  CheckboxIndicator,
  CheckboxRoot,
  CheckboxLabel,
} from "./checkbox.slots";

/**
 * Displays a checkbox.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/checkbox}
 */
export const Checkbox = (props: CheckboxProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  const recipe = useSlotRecipe({ key: "checkbox" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(restProps);

  const [styleProps, functionalProps] = extractStyleProps(remainingProps);

  return (
    <CheckboxRoot
      ref={forwardedRef}
      data-slot="root"
      {...functionalProps}
      {...recipeProps}
      {...styleProps}
    >
      {({
        isSelected,
        isIndeterminate,
        isInvalid,
        isDisabled,
        isFocused,
      }: CheckboxRenderProps) => {
        const stateProps = {
          "data-selected": isSelected,
          "data-indeterminate": isIndeterminate,
          "data-invalid": isInvalid,
          "data-disabled": isDisabled,
          "data-focus": isFocused || undefined,
        };

        return (
          <>
            <CheckboxIndicator data-slot="indicator" {...stateProps}>
              {isSelected && <Check />}
              {isIndeterminate && <Minus />}
            </CheckboxIndicator>

            {children && (
              <CheckboxLabel data-slot="label" {...stateProps}>
                {children}
              </CheckboxLabel>
            )}
          </>
        );
      }}
    </CheckboxRoot>
  );
};
Checkbox.displayName = "Checkbox";
