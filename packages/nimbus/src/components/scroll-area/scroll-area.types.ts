import type {
  ScrollAreaRootProps,
  UseScrollAreaReturn,
} from "@chakra-ui/react/scroll-area";
import type { OmitInternalProps } from "@/type-utils/omit-props";

/** Props for the `ScrollArea` component. */
export type ScrollAreaProps = OmitInternalProps<ScrollAreaRootProps> & {
  /** Content to render inside the scrollable area. */
  children: React.ReactNode;
  /** The HTML element type to render the root as. */
  as?: ScrollAreaRootProps["as"];
  /** A ref to the root scroll area element. */
  ref?: React.Ref<HTMLDivElement>;
  /** A ref to the scrollable viewport element inside the scroll area. */
  viewportRef?: React.Ref<HTMLDivElement>;
  /**
   * Which scrollbar axes to render.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal" | "both";
  /**
   * An externally created scroll area machine (from `useScrollArea`).
   * When provided, the component uses `RootProvider` instead of `Root`,
   * allowing external access to scroll state and programmatic control.
   */
  value?: UseScrollAreaReturn;
};

/**
 * Custom element IDs for ScrollArea's internal parts.
 * Pass to the `ids` prop to set known IDs for DOM access.
 */
export type ScrollAreaElementIds = Partial<{
  root: string;
  viewport: string;
  content: string;
  scrollbar: string;
  thumb: string;
}>;
