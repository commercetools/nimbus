import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  useRef,
} from "react";
import {
  ButtonGroupRoot,
  ButtonGroupButton as ButtonGroupButtonSlot,
} from "./button-group.slots";
import type {
  ButtonGroupButtonProps,
  ButtonGroupProps,
  ButtonGroupRootProps,
} from "./button-group.types";
import React from "react";
import { Button } from "@/components";
import { type ToggleGroupState, useToggleGroupState } from "react-stately";
import {
  useObjectRef,
  useToggleButtonGroup,
  useToggleButtonGroupItem,
} from "react-aria";
import { mergeRefs } from "@chakra-ui/react";

// Extend the ButtonGroup's ForwardRef type with the component's compound components
type ButtonGroupComponent = ForwardRefExoticComponent<
  ButtonGroupProps & RefAttributes<HTMLDivElement>
> & {
  Button: typeof ToggleButton;
};

/**
 * ButtonGroup
 * ============================================================
 * To group multiple `Button` or `IconButton` components together, visually and logically, representing a set of related actions.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'UnknownElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

const ToggleButtonGroupContext = React.createContext<
  ToggleGroupState | undefined
>(undefined);

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ children, size, variant, ...props }, forwardedRef) => {
    const state = useToggleGroupState(props);
    // create a local ref (because the consumer may not provide a forwardedRef)
    const localRef = useRef<HTMLDivElement>(null);
    // merge the local ref with a potentially forwarded ref
    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
    const { groupProps } = useToggleButtonGroup(props, state, ref);
    return (
      <ButtonGroupRoot ref={ref} {...groupProps}>
        <ToggleButtonGroupContext.Provider value={state}>
          {React.Children.toArray(children).map((child) =>
            React.cloneElement(child, { size, variant, ref })
          )}
        </ToggleButtonGroupContext.Provider>
      </ButtonGroupRoot>
    );
  }
) as ButtonGroupComponent;
ButtonGroup.displayName = "ButtonGroup";

const ToggleButton = forwardRef<HTMLButtonElement, ButtonGroupButtonProps>(
  ({ children, size, variant, ...props }, ref) => {
    const state = React.useContext(ToggleButtonGroupContext)!;
    const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem(
      props,
      state,
      ref
    );
    return (
      <ButtonGroupButtonSlot
        ref={ref}
        asChild
        {...buttonProps}
        data-pressed={isPressed}
        data-selected={isSelected}
      >
        <Button ref={ref} size={size} variant={variant}>
          {children}
        </Button>
      </ButtonGroupButtonSlot>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

ButtonGroup.Button = ToggleButton;
