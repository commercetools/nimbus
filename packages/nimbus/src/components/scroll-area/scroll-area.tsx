import {
  ScrollArea as ChakraScrollArea,
  useScrollAreaContext,
} from "@chakra-ui/react/scroll-area";
import { devWarn } from "@/utils";
import type { ScrollAreaProps } from "./scroll-area.types";

/**
 * Private component that renders inside ChakraScrollArea.Root
 * so it can access useScrollAreaContext() for conditional tabIndex.
 * Composes Viewport + Content + Scrollbar(s) + Corner.
 */
const ScrollAreaParts = ({
  children,
  orientation = "vertical",
  viewportRef,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: React.ReactNode;
  orientation?: "vertical" | "horizontal" | "both";
  viewportRef?: React.Ref<HTMLDivElement>;
  role?: React.AriaRole;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) => {
  const { hasOverflowX, hasOverflowY } = useScrollAreaContext();
  const tabIndex = hasOverflowX || hasOverflowY ? 0 : undefined;

  return (
    <>
      <ChakraScrollArea.Viewport
        ref={viewportRef}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <ChakraScrollArea.Content>{children}</ChakraScrollArea.Content>
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
 * Replaces native scrollbars with themed overlay indicators that appear
 * on hover or during scrolling.
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
    orientation = "vertical",
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...restProps
  } = props;

  if (role === "region" && !ariaLabel && !ariaLabelledBy) {
    devWarn(
      'ScrollArea with role="region" requires an "aria-label" or ' +
        '"aria-labelledby" prop for accessibility.'
    );
  }

  return (
    <ChakraScrollArea.Root ref={ref} {...restProps}>
      <ScrollAreaParts
        orientation={orientation}
        viewportRef={viewportRef}
        role={role}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </ScrollAreaParts>
    </ChakraScrollArea.Root>
  );
};

ScrollArea.displayName = "ScrollArea";
