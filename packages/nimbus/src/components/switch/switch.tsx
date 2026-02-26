import { useRef } from "react";
import { useToggleState } from "react-stately";
import { useFocusRing, useSwitch, useObjectRef, mergeProps } from "react-aria";
import { extractStyleProps, mergeRefs } from "@/utils";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { VisuallyHidden } from "@/components";
import type { SwitchProps } from "./switch.types";
import {
  SwitchRootSlot,
  SwitchTrackSlot,
  SwitchThumbSlot,
  SwitchLabelSlot,
} from "./switch.slots";
import { switchSlotRecipe } from "./switch.recipe";

/**
 * # Switch
 *
 * A clear, visual toggle, allowing users to activate or deactivate a setting quickly.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/switch}
 */
export const Switch = ({ ref: externalRef, ...props }: SwitchProps) => {
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(
    externalRef ? mergeRefs(localRef, externalRef) : localRef
  );

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
      data-slot="root"
      {...recipeProps}
      {...stateProps}
      {...styleProps}
    >
      <SwitchTrackSlot data-slot="track" {...stateProps}>
        <SwitchThumbSlot data-slot="thumb" {...stateProps} />
        <VisuallyHidden as="span">
          <input
            data-slot="input"
            {...mergeProps(inputProps, focusProps)}
            ref={ref}
          />
        </VisuallyHidden>
      </SwitchTrackSlot>

      {props.children && (
        <SwitchLabelSlot data-slot="label" {...stateProps}>
          {props.children}
        </SwitchLabelSlot>
      )}
    </SwitchRootSlot>
  );
};
Switch.displayName = "Switch";
