import { useRef } from "react";
import { useObjectRef } from "react-aria";
import {
  ScrollArea as ChakraScrollArea,
  useScrollAreaContext,
} from "@chakra-ui/react/scroll-area";
import { extractPaddingProps, mergeRefs } from "@/utils";
import { useScrollbarAutoHide } from "./hooks";
import type { ScrollAreaProps } from "./scroll-area.types";

type ScrollAreaPartsProps = Pick<
  ScrollAreaProps,
  "children" | "orientation" | "viewportRef"
> & {
  /** Padding style props extracted from Root, applied to Content. */
  contentPaddingProps?: Record<string, unknown>;
};

/**
 * Private component that renders inside ChakraScrollArea.Root
 * so it can access useScrollAreaContext() for conditional tabIndex.
 * Composes Viewport + Content + Scrollbar(s) + Corner.
 */
const ScrollAreaParts = ({
  children,
  orientation = "both",
  viewportRef,
  contentPaddingProps,
}: ScrollAreaPartsProps) => {
  const { hasOverflowX, hasOverflowY } = useScrollAreaContext();
  const tabIndex = hasOverflowX || hasOverflowY ? 0 : undefined;

  // Zag always writes `min-width: fit-content` inline on the content slot so
  // horizontal scroll works. That makes the wrapper grow to fit its widest
  // child, which stretches every `width: 100%` sibling to that same overgrown
  // width. For `vertical` and `both` orientations we want the wrapper to stay
  // at viewport width so `width: 100%` children behave naturally — any
  // descendant that still overflows (e.g. `white-space: nowrap` text) shows
  // up as viewport scroll via descendant overflow, which is exactly what the
  // horizontal scrollbar in `both` is for. `horizontal` keeps Zag's
  // fit-content so a row of items can scroll as usual.
  const contentAxisLock =
    orientation === "horizontal"
      ? { minHeight: 0, height: "100%" }
      : { minWidth: "100%", width: "100%", height: "100%" };

  // Belt-and-suspenders: clip the suppressed axis on the viewport so a child
  // with an explicit fixed size larger than the viewport can't escape either.
  // Inline `style` is required because Zag writes `overflow: auto` inline and
  // recipe-generated classes can't outspecify inline styles.
  const viewportAxisClip =
    orientation === "vertical"
      ? { overflowX: "hidden" as const }
      : orientation === "horizontal"
        ? { overflowY: "hidden" as const }
        : undefined;

  return (
    <>
      <ChakraScrollArea.Viewport
        ref={viewportRef}
        tabIndex={tabIndex}
        style={viewportAxisClip}
      >
        <ChakraScrollArea.Content
          {...contentPaddingProps}
          style={contentAxisLock}
        >
          {children}
        </ChakraScrollArea.Content>
      </ChakraScrollArea.Viewport>
      {(orientation === "vertical" || orientation === "both") && (
        <ChakraScrollArea.Scrollbar orientation="vertical" />
      )}
      {(orientation === "horizontal" || orientation === "both") && (
        <ChakraScrollArea.Scrollbar orientation="horizontal" />
      )}
      {orientation === "both" && <ChakraScrollArea.Corner />}
    </>
  );
};

/**
 * # ScrollArea
 *
 * A scrollable container with custom-styled scrollbar overlays.
 * Replaces native scrollbars with themed overlay indicators.
 *
 * By default the bar auto-hides: it appears when the pointer enters the area or
 * when the content scrolls, then fades out after a short idle delay. While the
 * pointer rests inside, the bar comes back on scroll or when the pointer moves
 * toward it — so a resting reader is not distracted. Use the `variant` prop for
 * the visual style (`solid` | `inset` | `overlay` | `glass`) and
 * `scrollbarVisibility="always"` to keep the bar permanently visible.
 *
 * Built on Chakra UI's ScrollArea (powered by Ark UI) with Nimbus
 * design tokens and keyboard accessibility.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/scroll-area}
 *
 * @example
 * ```tsx
 * <ScrollArea maxH="200px" aria-label="Log output">
 *   {content}
 * </ScrollArea>
 * ```
 */
export const ScrollArea = (props: ScrollAreaProps) => {
  const {
    ref,
    viewportRef,
    children,
    orientation = "both",
    value,
    variant,
    scrollbarVisibility,
    ...restProps
  } = props;

  const [paddingProps, rootProps] = extractPaddingProps(restProps);

  // Adapter: split the public props into what the recipe styles (`appearance`)
  // and what drives behavior (`resolvedVisibility` + whether the idle-hide hook
  // runs). `variant` carries the visual style plus two deprecated aliases:
  // - `inset` / `overlay` / `glass` → that look; otherwise the `solid` look.
  // - `hover` (deprecated) → `solid`; `always` (deprecated) → `solid` + always.
  // The explicit `scrollbarVisibility` prop wins; the deprecated
  // `variant="always"` only applies when it is not set.
  const appearance =
    variant === "inset" || variant === "overlay" || variant === "glass"
      ? variant
      : "solid";
  const resolvedVisibility =
    scrollbarVisibility ?? (variant === "always" ? "always" : "auto-hide");
  const isPersistent = resolvedVisibility === "always";

  // Local object refs so `useScrollbarAutoHide` can watch the real DOM nodes,
  // while still forwarding any consumer-provided `ref` / `viewportRef`.
  const rootLocalRef = useRef<HTMLDivElement>(null);
  const rootRef = useObjectRef(
    ref ? mergeRefs(rootLocalRef, ref) : rootLocalRef
  );
  const viewportLocalRef = useRef<HTMLDivElement>(null);
  const mergedViewportRef = useObjectRef(
    viewportRef ? mergeRefs(viewportLocalRef, viewportRef) : viewportLocalRef
  );

  // A permanently visible bar (`scrollbarVisibility="always"`) has nothing to idle-hide,
  // so the activity hook only runs otherwise.
  useScrollbarAutoHide({
    enabled: !isPersistent,
    rootRef,
    viewportRef: mergedViewportRef,
  });

  const parts = (
    <ScrollAreaParts
      orientation={orientation}
      viewportRef={mergedViewportRef}
      contentPaddingProps={paddingProps}
    >
      {children}
    </ScrollAreaParts>
  );

  if (value) {
    return (
      <ChakraScrollArea.RootProvider
        ref={rootRef}
        value={value}
        variant={appearance}
        scrollbarVisibility={resolvedVisibility}
        {...rootProps}
      >
        {parts}
      </ChakraScrollArea.RootProvider>
    );
  }

  return (
    <ChakraScrollArea.Root
      ref={rootRef}
      variant={appearance}
      scrollbarVisibility={resolvedVisibility}
      {...rootProps}
    >
      {parts}
    </ChakraScrollArea.Root>
  );
};

ScrollArea.displayName = "ScrollArea";
