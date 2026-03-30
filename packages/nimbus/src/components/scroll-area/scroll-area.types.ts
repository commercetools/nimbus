import type { ScrollAreaRootProps } from "@chakra-ui/react/scroll-area";
import type { OmitInternalProps } from "@/type-utils/omit-props";

type ScrollAreaBaseProps = OmitInternalProps<
  ScrollAreaRootProps,
  "role" | "aria-label" | "aria-labelledby"
> & {
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
};

type ScrollAreaRegionProps = ScrollAreaBaseProps & {
  /**
   * The ARIA landmark role for the scroll area.
   * When set to `"region"`, an accessible name is required.
   */
  role: "region";
} & (
    | {
        /** The accessible name. Required when `role="region"`. */
        "aria-label": string;
        "aria-labelledby"?: string;
      }
    | {
        "aria-label"?: string;
        /** ID of the labeling element. Required when `role="region"` if `aria-label` is not provided. */
        "aria-labelledby": string;
      }
  );

type ScrollAreaDefaultProps = ScrollAreaBaseProps & {
  /** The ARIA role for the scroll area. */
  role?: never;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

/**
 * Props for the `ScrollArea` component.
 *
 * When `role="region"`, either `aria-label` or `aria-labelledby` is
 * required at the type level to satisfy WCAG landmark naming requirements.
 */
export type ScrollAreaProps = ScrollAreaRegionProps | ScrollAreaDefaultProps;
