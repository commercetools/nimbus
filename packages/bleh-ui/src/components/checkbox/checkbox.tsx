import { forwardRef, useRef } from "react";
import { useToggleState } from "react-stately";
import { Check, Minus } from "@bleh-ui/icons";
import { chakra, useSlotRecipe } from "@chakra-ui/react";

import {
  useFocusRing,
  useCheckbox,
  useObjectRef,
  VisuallyHidden,
  mergeProps,
} from "react-aria";

import { mergeRefs } from "@chakra-ui/react";
import type { CheckboxProps } from "./checkbox.types";

/**
 * Checkbox
 * ============================================================
 * displays a checkbox and an associated label
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const state = useToggleState(props);
    const { inputProps } = useCheckbox(props, state, ref);

    const { isFocused, focusProps } = useFocusRing();

    const isSelected = state.isSelected && !props.isIndeterminate;
    const isIndeterminate = props.isIndeterminate;

    const recipe = useSlotRecipe({ key: "checkbox" });
    const [recipeProps] = recipe.splitVariantProps(props);
    const styles = recipe(recipeProps);

    const stateProps = {
      "data-selected": isSelected,
      "data-indeterminate": isIndeterminate,
      "data-invalid": props.isInvalid,
      "data-disabled": props.isDisabled,
    };

    return (
      <chakra.label css={styles.root} {...recipeProps} {...stateProps}>
        <chakra.span
          css={styles.indicator}
          data-focus={isFocused || undefined}
          {...stateProps}
        >
          {isSelected && <Check />}
          {isIndeterminate && <Minus />}
          <VisuallyHidden>
            <chakra.input {...mergeProps(inputProps, focusProps)} ref={ref} />
          </VisuallyHidden>
        </chakra.span>

        {props.children && (
          <chakra.span css={styles.label} {...stateProps}>
            {props.children}
          </chakra.span>
        )}
      </chakra.label>
    );
  }
);
Checkbox.displayName = "Checkbox";
