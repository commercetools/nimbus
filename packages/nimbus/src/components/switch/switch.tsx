import { useRef, memo } from "react";
import { useToggleState } from "react-stately";
import {
  useFocusRing,
  useSwitch,
  useObjectRef,
  useFocusable,
  mergeProps,
} from "react-aria";
import { extractStyleProps } from "@/utils";
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
export const Switch = memo(({ ref: externalRef, ...props }: SwitchProps) => {
  const inputRef = useObjectRef(externalRef);

  const recipe = useSlotRecipe({ recipe: switchSlotRecipe });

  const [recipeProps, recipeLessProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(recipeLessProps);

  const isAriaDisabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true";

  const state = useToggleState(props);
  const { inputProps } = useSwitch(functionalProps, state, inputRef);

  const { isFocused, focusProps } = useFocusRing();

  // Enable tooltip trigger support: reads from FocusableContext (set by Tooltip.Root)
  // to apply hover/focus handlers to the visible label element. No-op outside tooltips.
  // Must be called after useSwitch so the ref sync targets rootRef, not the hidden input.
  const rootRef = useRef<HTMLLabelElement>(null);
  const { focusableProps } = useFocusable(
    { excludeFromTabOrder: true },
    rootRef
  );

  const stateProps = {
    "data-selected": state.isSelected,
    "data-invalid": props.isInvalid,
    "data-disabled": props.isDisabled || isAriaDisabled,
    "data-focus": isFocused || undefined,
  };
  return (
    <SwitchRootSlot
      data-slot="root"
      {...recipeProps}
      {...stateProps}
      {...styleProps}
      {...focusableProps}
      {...(isAriaDisabled && { "data-allow-pointer": true })}
      ref={rootRef}
    >
      <SwitchTrackSlot data-slot="track" {...stateProps}>
        <SwitchThumbSlot data-slot="thumb" {...stateProps} />
        <VisuallyHidden as="span">
          <input
            data-slot="input"
            {...mergeProps(inputProps, focusProps)}
            {...(isAriaDisabled && { disabled: true })}
            ref={inputRef}
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
});
Switch.displayName = "Switch";
