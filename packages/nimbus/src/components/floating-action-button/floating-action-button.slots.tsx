import { createRecipeContext } from "@chakra-ui/react/styled-system";
import shouldForwardProp from "@emotion/is-prop-valid";
import { system } from "@/theme";
import type { SlotComponent } from "@/type-utils";
import type { FloatingActionButtonRootSlotProps } from "./floating-action-button.types";

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

const isReactAriaEventProp = (prop: string): boolean =>
  REACT_ARIA_EVENT_PROPS.some((ariaProp) => prop.includes(ariaProp));

const { withContext } = createRecipeContext({
  key: "nimbusFloatingActionButton",
});

export const FloatingActionButtonRoot: SlotComponent<
  HTMLButtonElement,
  FloatingActionButtonRootSlotProps
> = withContext<HTMLButtonElement, FloatingActionButtonRootSlotProps>(
  "button",
  {
    defaultProps: {
      type: "button",
    },
    shouldForwardProp(prop, variantKeys) {
      const chakraSfp =
        !variantKeys?.includes(prop) && !system.isValidProperty(prop);
      return (
        shouldForwardProp(prop) && chakraSfp && !isReactAriaEventProp(prop)
      );
    },
  }
);
