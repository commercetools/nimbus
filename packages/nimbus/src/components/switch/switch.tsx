import { forwardRef, useRef } from "react";
import { useToggleState } from "react-stately";
import { useFocusRing, useSwitch, useObjectRef } from "react-aria";
import { useSlotRecipe, mergeRefs } from "@chakra-ui/react";
import { VisuallyHidden } from "@/components";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { SwitchProps } from "./switch.types";
import {
  SwitchRootSlot,
  SwitchTrackSlot,
  SwitchThumbSlot,
  SwitchLabelSlot,
} from "./switch.slots";
import { switchSlotRecipe } from "./switch.recipe";

/**
 * Switch
 * ============================================================
 * displays a switch toggle and optionally an associated label
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (props, forwardedRef) => {
    const localRef = useRef<HTMLInputElement>(null);
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const recipe = useSlotRecipe({ recipe: switchSlotRecipe });

    const [recipeProps, recipeLessProps] = recipe.splitVariantProps(props);
    const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

    const state = useToggleState(props);
    const { inputProps } = useSwitch(functionalProps, state, ref);

    const { isFocused, focusProps } = useFocusRing();

    const stateProps = {
      "data-selected": state.isSelected,
      "data-invalid": props.isInvalid,
      "data-disabled": props.isDisabled,
      "data-focus": isFocused || undefined,
    };
    return (
      <SwitchRootSlot
        slot="root"
        {...recipeProps}
        {...stateProps}
        {...styleProps}
      >
        <SwitchTrackSlot slot="track" {...stateProps}>
          <SwitchThumbSlot slot="thumb" {...stateProps} />
          <VisuallyHidden as="span">
            <input slot="input" {...inputProps} {...focusProps} ref={ref} />
          </VisuallyHidden>
        </SwitchTrackSlot>

        {props.children && (
          <SwitchLabelSlot slot="label" {...stateProps}>
            {props.children}
          </SwitchLabelSlot>
        )}
      </SwitchRootSlot>
    );
  }
);
Switch.displayName = "Switch";
