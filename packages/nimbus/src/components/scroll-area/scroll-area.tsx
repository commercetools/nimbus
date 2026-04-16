import {
  ScrollArea as ChakraScrollArea,
  useScrollAreaContext,
} from "@chakra-ui/react/scroll-area";
import { extractPaddingProps } from "@/utils";
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
  orientation = "vertical",
  viewportRef,
  contentPaddingProps,
}: ScrollAreaPartsProps) => {
  const { hasOverflowX, hasOverflowY } = useScrollAreaContext();
  const tabIndex = hasOverflowX || hasOverflowY ? 0 : undefined;

  return (
    <>
      <ChakraScrollArea.Viewport ref={viewportRef} tabIndex={tabIndex}>
        <ChakraScrollArea.Content {...contentPaddingProps}>
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
    value,
    ...restProps
  } = props;

  const [paddingProps, rootProps] = extractPaddingProps(restProps);

  const parts = (
    <ScrollAreaParts
      orientation={orientation}
      viewportRef={viewportRef}
      contentPaddingProps={paddingProps}
    >
      {children}
    </ScrollAreaParts>
  );

  if (value) {
    return (
      <ChakraScrollArea.RootProvider ref={ref} value={value} {...rootProps}>
        {parts}
      </ChakraScrollArea.RootProvider>
    );
  }

  return (
    <ChakraScrollArea.Root ref={ref} {...rootProps}>
      {parts}
    </ChakraScrollArea.Root>
  );
};

ScrollArea.displayName = "ScrollArea";
