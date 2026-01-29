import { createRecipeContext } from "@chakra-ui/react";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { ButtonRootSlotProps } from "./button.types";

/**
 * React Aria-specific event props that should NOT be forwarded to DOM elements.
 * These are custom event handlers that React Aria uses internally but are not
 * valid DOM event handlers.
 *
 * @see https://react-spectrum.adobe.com/react-aria/interactions.html
 */
const REACT_ARIA_EVENT_PROPS = [
  "onPress",
  "onPressStart",
  "onPressEnd",
  "onPressChange",
  "onPressUp",
  "onFocusChange",
  "onHoverStart",
  "onHoverEnd",
  "onHoverChange",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
];

/**
 * Checks if a prop is a React Aria-specific event handler that should not
 * be forwarded to the DOM.
 */
const isReactAriaEventProp = (prop: string): boolean =>
  REACT_ARIA_EVENT_PROPS.some((ariaProp) => prop.includes(ariaProp));

const { withContext } = createRecipeContext({
  key: "nimbusButton",
});

/**
 * Root component that provides the styling context for the Button component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ButtonRoot = withContext<HTMLButtonElement, ButtonRootSlotProps>(
  "button",
  {
    defaultProps: {
      type: "button",
    },
    /**
     * Filter out React Aria-specific props that shouldn't reach the DOM.
     * These props are consumed by useButton() but may still be present in
     * contextProps from ButtonContext slots.
     */
    shouldForwardProp(prop, variantKeys) {
      const chakraSfp =
        !variantKeys?.includes(prop) && !system.isValidProperty(prop);
      return (
        shouldForwardProp(prop) && chakraSfp && !isReactAriaEventProp(prop)
      );
    },
  }
);
