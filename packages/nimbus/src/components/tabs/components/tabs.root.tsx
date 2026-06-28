import { useRef } from "react";
import {
  useChakraContext,
  useSlotRecipe,
} from "@chakra-ui/react/styled-system";
import { Tabs as RATabs } from "react-aria-components";
import { TabsRootSlot, TabsIndicatorSlot } from "../tabs.slots";
import type { TabsProps } from "../tabs.types";
import { TabsList } from "./tabs.list";
import { TabsPanels } from "./tabs.panels";
import { extractStyleProps } from "@/utils";
import { useSlidingIndicator } from "@/hooks";
import type { SlidingIndicatorRects } from "@/hooks";

/** Thickness of the sliding bar for the `line` variant. */
const INDICATOR_BAR_PX = 2;

/** Deprecated variant aliases → their replacement. */
const VARIANT_ALIASES: Record<string, string> = {
  pills: "pill",
};

/** Resolve a deprecated string variant alias to its replacement (else pass through). */
function resolveVariantAlias<T>(variant: T): T {
  return typeof variant === "string" && VARIANT_ALIASES[variant]
    ? (VARIANT_ALIASES[variant] as T)
    : variant;
}

/**
 * # Tabs
 *
 * A tabs component built on React Aria Components that allows users to switch
 * between different views.
 *
 * @supportsStyleProps
 */
export const TabsRoot = ({
  children,
  tabs,
  tabListAriaLabel,
  ...props
}: TabsProps) => {
  const sysCtx = useChakraContext();
  // Standard pattern: Split recipe variants. Resolve deprecated variant aliases
  // (`pills` → `pill`) up front so the recipe only ever sees real variant keys.
  const recipe = useSlotRecipe({ key: "nimbusTabs" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps({
    ...props,
    variant: resolveVariantAlias(props.variant),
  } as Parameters<typeof recipe.splitVariantProps>[0]);

  // Standard pattern: Extract style props
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  // The react-aria Tabs do not support responsive values for the
  // `orientation` prop. We normalize `orientation` to a string
  // ("horizontal" or "vertical") using `system.normalizeValue` and
  // `useBreakpointValue` to ensure a concrete value is passed.
  const normalizedOrientation = sysCtx.normalizeValue(recipeProps.orientation);

  // The indicator geometry depends on the *resolved* variant, orientation, and
  // placement (responsive values are normalized the same way).
  const variant = sysCtx.normalizeValue(recipeProps.variant) ?? "line";
  const orientation = normalizedOrientation ?? "horizontal";
  const placement = sysCtx.normalizeValue(recipeProps.placement) ?? "start";

  const isLine = variant === "line";

  const indicatorRef = useRef<HTMLDivElement>(null);

  // Drive the sliding active-tab marker: an `aria-hidden`, non-focusable element
  // rendered inside the root and DOM-positioned over the selected tab (a bar for
  // `line`, a filled highlight for `rounded`/`pill`). The recipe's static
  // selected marker is the SSR/no-JS fallback, suppressed via `data-animated`
  // once this hook activates; the slide respects `prefers-reduced-motion`.
  useSlidingIndicator({
    enabled: true,
    indicatorRef,
    activeSelector: '[role="tab"][aria-selected="true"]',
    watchAttributes: ["aria-selected", "data-selected"],
    itemSelector: '[role="tab"]',
    deps: [variant, orientation, placement],
    getGeometry: ({ container, active }: SlidingIndicatorRects) => {
      const x = active.left - container.left;
      const y = active.top - container.top;
      // `rounded` / `pill` → full-box filled highlight.
      if (!isLine) {
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
    <TabsRootSlot asChild {...recipeProps} {...styleProps}>
      <RATabs {...functionalProps} orientation={normalizedOrientation}>
        <TabsIndicatorSlot ref={indicatorRef} aria-hidden="true" />
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
