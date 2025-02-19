import { useRef } from "react";
import type { TooltipProps } from "./tooltip.types";
import { chakra, useSlotRecipe } from "@chakra-ui/react";
import { useFocusable } from "react-aria";

import {
  TooltipTrigger,
  Tooltip as RaTooltip,
  OverlayArrow,
} from "react-aria-components";

const CustomTriggerButton = ({ children, ...props }) => {
  const ref = useRef(null);
  const { focusableProps } = useFocusable(props, ref);

  const recipe = useSlotRecipe({ key: "tooltip" });
  const [recipeProps] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  const needsWrapper = typeof children === "string";

  return (
    <chakra.button asChild ref={ref} {...focusableProps}>
      {needsWrapper ? (
        <chakra.button css={styles.trigger}>{children}</chakra.button>
      ) : (
        children
      )}
    </chakra.button>
  );
};

/**
 * Tooltip
 * ============================================================
 * A contextual popup that displays a description for an element, uses `Tooltip` component from `react-aria-components`.
 *
 * Features:
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - allows overriding styles by using style-props
 *
 * Further Context:
 * - [React Aria Components Tooltip Documentation](https://react-spectrum.adobe.com/react-aria/Tooltip.html)
 * - [ARIA Tooltip Pattern](https://www.w3.org/TR/wai-aria-1.2/#tooltip)
 */
export const Tooltip = ({ children, content, ...props }: TooltipProps) => {
  const recipe = useSlotRecipe({ key: "tooltip" });
  const [recipeProps] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  return (
    <TooltipTrigger {...props}>
      <CustomTriggerButton>{children}</CustomTriggerButton>
      <chakra.span asChild css={styles.content}>
        <RaTooltip placement={props.placement}>
          <chakra.span css={styles.arrow} asChild>
            <OverlayArrow>
              <svg width={8} height={8} viewBox="0 0 8 8">
                <path d="M0 0 L4 4 L8 0" />
              </svg>
            </OverlayArrow>
          </chakra.span>
          {content}
        </RaTooltip>
      </chakra.span>
    </TooltipTrigger>
  );
};

Tooltip.displayName = "Tooltip";
