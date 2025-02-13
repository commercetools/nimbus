import {
  cloneElement,
  forwardRef,
  useRef,
  type ReactElement,
  type PropsWithChildren,
} from "react";
import {
  useObjectRef,
  useButton,
  mergeProps,
  type AriaButtonOptions,
} from "react-aria";
import { css } from "@emotion/css";
import {
  Tooltip as RATooltip,
  TooltipTrigger as RATooltipTrigger,
} from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";
import { tooltipRecipe } from "./tooltip.recipe";
import type { TooltipProps } from "./tooltip.types";

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element.  See https://www.w3.org/TR/wai-aria-1.2/#tooltip
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLSpanElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

function MyButton(props: any) {
  const localref = useRef(null);

  const { buttonProps } = useButton(props, localref);
  // const { pressProps } = usePress(props);
  // const { focusableProps } = useFocusable(props, localref);
  return (
    <button {...buttonProps} ref={localref}>
      {props.children}
    </button>
  );
}

// https://github.com/adobe/react-spectrum/issues/5733#issuecomment-1918691983
export function TooltipTriggerWrap(
  // TODO: can we get the tag dynamically?
  props: AriaButtonOptions<"button"> & { children: ReactElement }
) {
  const triggerRef = useRef(null);
  const { buttonProps } = useButton(props, triggerRef);

  return cloneElement(
    props.children,
    mergeProps(buttonProps, props.children.props, { ref: triggerRef })
  );
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, ...props }, ref) => {
    const recipe = useRecipe({ recipe: tooltipRecipe });
    const [recipeProps, restProps] = recipe.splitVariantProps(props);
    console.log(recipeProps, restProps);
    const styles = recipe(recipeProps);

    return (
      // @ts-expect-error TODO: Chakra styles into react-aria-components, how do?
      <RATooltip className={css(styles)} {...restProps} ref={ref} isOpen>
        {children}
      </RATooltip>
    );
  }
);
Tooltip.displayName = "Tooltip";

// import React from "react";
// import { useTooltipTriggerState } from "react-stately";
// import { mergeProps, useTooltip, useTooltipTrigger } from "react-aria";

// function Tooltip({ state, ...props }) {
//   let { tooltipProps } = useTooltip(props, state);

//   return (
//     <span
//       style={{
//         position: "absolute",
//         left: "5px",
//         top: "100%",
//         maxWidth: 150,
//         marginTop: "10px",
//         backgroundColor: "white",
//         color: "black",
//         padding: "5px",
//         border: "1px solid gray",
//       }}
//       {...mergeProps(props, tooltipProps)}
//     >
//       {props.children}
//     </span>
//   );
// }

// export function TooltipButton(props) {
//   let state = useTooltipTriggerState(props);
//   let ref = React.useRef(null);

//   // Get props for the trigger and its tooltip
//   let { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

//   return (
//     <span style={{ position: "relative" }}>
//       <button
//         ref={ref}
//         {...triggerProps}
//         style={{ fontSize: 18 }}
//         onClick={() => alert("Pressed button")}
//       >
//         {props.children}
//       </button>
//       {state.isOpen && (
//         <Tooltip delay={0} state={state} {...tooltipProps}>
//           {props.tooltip}
//         </Tooltip>
//       )}
//     </span>
//   );
// }
