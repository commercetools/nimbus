import type { OmitInternalProps } from "@/type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";

// ============================================================
// SLOT PROPS
// ============================================================
// FeedbackCard is layout-only: the recipe defines no `variant`/`size` axes, so
// slot props are plain Chakra div props. This still forwards every Chakra style
// prop (bg, border, borderRadius, padding, …) onto the rendered elements.

export type FeedbackCardRootSlotProps = HTMLChakraProps<"div">;

export type FeedbackCardContentSlotProps = HTMLChakraProps<"div">;

export type FeedbackCardActionSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `FeedbackCard.Root` layout container.
 *
 * Renders a responsive, wrapping flex row. Accepts all Chakra style props —
 * pass `bg`, `border`, `borderRadius`, `padding`, etc. to express the visual
 * context (e.g. approve vs. reject). No `variant` or `size` prop is offered.
 */
export type FeedbackCardRootProps =
  OmitInternalProps<FeedbackCardRootSlotProps> & {
    /** The `FeedbackCard.Content` and `FeedbackCard.Action` parts. */
    children?: React.ReactNode;
    /** Forwarded ref to the underlying root `div`. */
    ref?: React.Ref<HTMLDivElement>;
    /** Arbitrary `data-*` attributes are forwarded onto the root element. */
    [key: `data-${string}`]: unknown;
  };

/**
 * Props for the `FeedbackCard.Content` text area.
 *
 * A vertical stack for consumer-provided text (e.g. a title and subtitle
 * composed from Nimbus primitives). Grows to fill the row.
 */
export type FeedbackCardContentProps =
  OmitInternalProps<FeedbackCardContentSlotProps> & {
    /** Consumer-provided content, typically a title and subtitle. */
    children?: React.ReactNode;
    /** Forwarded ref to the underlying content `div`. */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for the `FeedbackCard.Action` layout slot.
 *
 * Positions a consumer-provided actionable element (e.g. a Nimbus `Button`).
 * Handles layout only — it does not alter the element's behavior.
 */
export type FeedbackCardActionProps =
  OmitInternalProps<FeedbackCardActionSlotProps> & {
    /** The consumer's action element, typically a Nimbus `Button`. */
    children?: React.ReactNode;
    /** Forwarded ref to the underlying action `div`. */
    ref?: React.Ref<HTMLDivElement>;
  };
