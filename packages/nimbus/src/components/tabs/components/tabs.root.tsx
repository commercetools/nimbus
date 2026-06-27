import { useRef } from "react";
import {
  useChakraContext,
  useSlotRecipe,
} from "@chakra-ui/react/styled-system";
import { Box } from "@chakra-ui/react/box";
import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot } from "../tabs.slots";
import type { TabsProps } from "../tabs.types";
import { TabsList } from "./tabs.list";
import { TabsPanels } from "./tabs.panels";
import { extractStyleProps } from "@/utils";
import { useSlidingIndicator } from "@/hooks";
import type { SlidingIndicatorRects } from "@/hooks";

/** Thickness of the sliding underline bar for the `line` variant. */
const INDICATOR_BAR_PX = 2;

/**
 * # Tabs
 *
 * A tabs component built on React Aria Components that allows users to switch between different views.
 *
 * When `animated` is set, a single decorative indicator slides between tabs as
 * the selected tab changes (see `tabs.types.ts`). It is `aria-hidden` and
 * non-focusable, rendered inside the root and positioned with
 * `useSlidingIndicator`; the static selected marker is suppressed by the recipe
 * while animated, and the slide respects `prefers-reduced-motion`.
 *
 * @supportsStyleProps
 */
export const TabsRoot = ({
  children,
  tabs,
  tabListAriaLabel,
  animated,
  ...props
}: TabsProps) => {
  const sysCtx = useChakraContext();
  // Standard pattern: Split recipe variants
  const recipe = useSlotRecipe({ key: "nimbusTabs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // The react-aria Tabs do not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.
  const normalizedOrientation = sysCtx.normalizeValue(recipeProps.orientation);

  // The animated indicator's geometry depends on the *resolved* variant,
  // orientation, and placement (responsive values are normalized the same way).
  const variant = sysCtx.normalizeValue(recipeProps.variant) ?? "line";
  const orientation = normalizedOrientation ?? "horizontal";
  const placement = sysCtx.normalizeValue(recipeProps.placement) ?? "start";

  const showIndicator = animated === true;
  const isFill = variant === "pills";

  const indicatorRef = useRef<HTMLDivElement>(null);

  useSlidingIndicator({
    enabled: showIndicator,
    indicatorRef,
    activeSelector: '[role="tab"][aria-selected="true"]',
    watchAttributes: ["aria-selected", "data-selected"],
    itemSelector: '[role="tab"]',
    deps: [variant, orientation, placement],
    getGeometry: ({ container, active }: SlidingIndicatorRects) => {
      const x = active.left - container.left;
      const y = active.top - container.top;
      // `pills` → full-box filled highlight.
      if (isFill) {
        return { x, y, width: active.width, height: active.height };
      }
      // `line` → a thin bar pinned to the active tab's marker edge.
      if (orientation === "vertical") {
        return placement === "end"
          ? // tabs on the right; marker on their left edge
            { x, y, width: INDICATOR_BAR_PX, height: active.height }
          : // tabs on the left; marker on their right edge
            {
              x: x + active.width - INDICATOR_BAR_PX,
              y,
              width: INDICATOR_BAR_PX,
              height: active.height,
            };
      }
      // horizontal; marker on the bottom edge
      return {
        x,
        y: y + active.height - INDICATOR_BAR_PX,
        width: active.width,
        height: INDICATOR_BAR_PX,
      };
    },
  });

  return (
    <TabsRootSlot
      asChild
      {...recipeProps}
      {...styleProps}
      position={showIndicator ? "relative" : undefined}
      data-animated={showIndicator ? "true" : undefined}
    >
      <RATabs {...functionalProps} orientation={normalizedOrientation}>
        {showIndicator && (
          <Box
            ref={indicatorRef}
            aria-hidden="true"
            position="absolute"
            top="0"
            left="0"
            zIndex={0}
            opacity={0}
            pointerEvents="none"
            background={isFill ? "primary.3" : "primary.9"}
            borderRadius={isFill ? "full" : "0"}
            transition="transform 180ms ease, width 180ms ease, height 180ms ease, opacity 120ms ease"
            css={{
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none",
              },
            }}
          />
        )}
        {children || (
          <>
            <TabsList tabs={tabs} aria-label={tabListAriaLabel} />
            <TabsPanels tabs={tabs} />
          </>
        )}
      </RATabs>
    </TabsRootSlot>
  );
};

TabsRoot.displayName = "Tabs.Root";
