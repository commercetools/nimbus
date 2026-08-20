import type { ReactElement, ReactNode, Ref } from "react";
import type {
  ButtonProps as RaButtonProps,
  DialogRenderProps as RaDialogRenderProps,
  PopoverProps as RaPopoverProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  JsxStyleProps,
} from "@chakra-ui/react/styled-system";

import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// SLOT PROPS
// ============================================================

export type PopoverRootSlotProps = HTMLChakraProps<"div">;

export type PopoverTriggerSlotProps = HTMLChakraProps<"button">;

export type PopoverContentSlotProps = HTMLChakraProps<"div">;

export type PopoverDialogSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * The render-prop argument handed to a `Popover.Content` function child.
 * Provides a `close` callback so content can dismiss its own popover.
 */
export type PopoverContentRenderProps = RaDialogRenderProps;

/**
 * The React Aria positioning and dismissal props `Popover.Content` forwards to
 * the underlying overlay.
 */
type PopoverPositioningProps = Pick<
  RaPopoverProps,
  | "placement"
  | "offset"
  | "crossOffset"
  | "shouldFlip"
  | "containerPadding"
  | "boundaryElement"
  | "isNonModal"
  | "isKeyboardDismissDisabled"
  | "shouldCloseOnInteractOutside"
  | "triggerRef"
>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Popover.Root component.
 *
 * Establishes the popover's open state and styling context. Renders React
 * Aria's `DialogTrigger`, which mounts no DOM element of its own, so Root does
 * not affect the surrounding layout.
 */
export type PopoverRootProps = OmitInternalProps<PopoverRootSlotProps> & {
  /**
   * The popover's parts — typically a `Popover.Trigger` and a
   * `Popover.Content`.
   */
  children: ReactNode;

  /**
   * Whether the popover is open (controlled mode).
   */
  isOpen?: boolean;

  /**
   * Whether the popover is open by default (uncontrolled mode).
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Handler called when the popover's open state changes.
   * @param isOpen - Whether the popover is now open
   */
  onOpenChange?: (isOpen: boolean) => void;
};

/**
 * Props for the Popover.Trigger component.
 *
 * The element that opens the popover when pressed. Renders its own button
 * unless `asChild` is set.
 *
 * The two modes accept different props. React Aria hands the whole trigger
 * contract — press handling, `aria-expanded`, `aria-controls` and the trigger
 * ref — to the rendered element through context, so under `asChild` the only
 * thing this component adds is the `trigger` slot's styling. Button props
 * belong on the element you supply and are rejected here, rather than being
 * accepted and quietly having no effect.
 */
export type PopoverTriggerProps =
  | (OmitInternalProps<PopoverTriggerSlotProps, keyof RaButtonProps> &
      RaButtonProps & {
        /**
         * Render an own button element (the default). Pass `asChild` instead to
         * supply your own pressable element.
         */
        asChild?: false;

        /**
         * Reference to the trigger element.
         */
        ref?: Ref<HTMLButtonElement>;
      })
  | (Omit<JsxStyleProps, "css"> & {
      /**
       * Apply trigger behavior to the supplied child rather than rendering an
       * own button, which avoids nesting one interactive element inside
       * another. The child must be able to receive a ref, and carries its own
       * props — put `id`, `isDisabled`, `aria-label` and friends on it.
       */
      asChild: true;

      /**
       * The pressable element to turn into the trigger.
       */
      children: ReactElement;

      /**
       * Reference to the trigger element.
       */
      ref?: Ref<HTMLButtonElement>;
    });

/**
 * Props for the Popover.Content component.
 *
 * The positioned overlay surface. Supplies its own dialog element, so
 * consumers do not need to add one for correct accessibility.
 *
 * Focus is contained within the popover and outside interaction dismisses it,
 * which is React Aria's default. Pass `isNonModal` to relax that — see the
 * React Aria guidance before doing so.
 */
export type PopoverContentProps = OmitInternalProps<
  PopoverContentSlotProps,
  keyof PopoverPositioningProps | "children"
> &
  PopoverPositioningProps & {
    /**
     * The popover's content. Pass a function to receive a `close` callback for
     * dismissing the popover from within.
     */
    children?: ReactNode | ((opts: PopoverContentRenderProps) => ReactNode);

    /**
     * An accessible name for the popover's dialog. Required when the content
     * has no visible heading.
     */
    "aria-label"?: string;

    /**
     * The id of an element that labels the popover's dialog.
     */
    "aria-labelledby"?: string;

    /**
     * Reference to the popover surface element.
     */
    ref?: Ref<HTMLDivElement>;
  };
