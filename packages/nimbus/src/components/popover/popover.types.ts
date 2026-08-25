import type { ReactElement, ReactNode, Ref } from "react";
import type {
  ButtonProps as RaButtonProps,
  DialogProps as RaDialogProps,
  DialogRenderProps as RaDialogRenderProps,
  DialogTriggerProps as RaDialogTriggerProps,
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
 * Provides a `close` callback for dismissing the popover from within.
 */
export type PopoverContentRenderProps = RaDialogRenderProps;

/**
 * Overlay behavior accepted on `Popover.Root` and forwarded through context to
 * the `Popover` and `Dialog` elements that `Popover.Content` renders.
 *
 * Behavior only — per-element presentation (`className`, `style`, `id`,
 * `data-*`, event handlers) stays on the part that renders the element. Open
 * state is absent by design: it belongs on `DialogTrigger` alone, so it lives
 * on {@link PopoverRootProps}.
 */
export type PopoverOverlayConfigProps = Pick<
  RaPopoverProps,
  // Positioning
  | "placement"
  | "offset"
  | "crossOffset"
  | "shouldFlip"
  | "containerPadding"
  | "boundaryElement"
  | "maxHeight"
  | "shouldUpdatePosition"
  | "scrollRef"
  | "getTargetRect"
  | "arrowBoundaryOffset"
  | "arrowRef"
  // Dismissal and modality
  | "isNonModal"
  | "isKeyboardDismissDisabled"
  | "shouldCloseOnInteractOutside"
  // Anchoring
  | "triggerRef"
  | "trigger"
  // Animation
  | "isEntering"
  | "isExiting"
  | "shouldSkipAnimation"
  // Portal
  | "UNSTABLE_portalContainer"
  // Focus containment
  | "onFocusWithin"
  | "onBlurWithin"
  | "onFocusWithinChange"
> &
  Pick<RaDialogProps, "role">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Popover.Root component.
 *
 * Renders React Aria's `DialogTrigger` and mounts no DOM element of its own, so
 * it takes no style props — put those on `Popover.Trigger` or
 * `Popover.Content`. Root is the compound's single configuration surface: every
 * overlay option in {@link PopoverOverlayConfigProps} is set here and reaches
 * `Popover.Content` through context.
 *
 * @see https://nimbus-documentation.vercel.app/components/feedback/popover
 */
export type PopoverRootProps = PopoverOverlayConfigProps & {
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
 * The configuration `Popover.Root` publishes to `Popover.Content` through
 * context — every Root prop except `DialogTrigger`'s own surface.
 */
export type PopoverConfigContextValue = Omit<
  PopoverRootProps,
  keyof RaDialogTriggerProps
>;

/**
 * Props for the Popover.Trigger component.
 *
 * The element that opens the popover when pressed. Renders its own button
 * unless `asChild` is set. React Aria hands the whole trigger contract to the
 * rendered element through context, so under `asChild` this part adds only the
 * `trigger` slot's styling — button props belong on the element you supply and
 * are rejected here rather than accepted with no effect.
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
 * The positioned overlay surface. Supplies its own dialog element, so consumers
 * do not need to add one for correct accessibility. Focus is contained and
 * outside interaction dismisses it; `isNonModal` on `Popover.Root` relaxes
 * neither.
 *
 * Carries no overlay configuration — `placement`, `offset`, `isNonModal`,
 * `role` and the rest of {@link PopoverOverlayConfigProps} are set on
 * `Popover.Root`, including the `maxHeight` cap on the surface. Three of those
 * names are excluded here explicitly rather than by absence, because Chakra
 * declares them too and would otherwise accept them as inert CSS.
 *
 * Style props apply to the positioned surface; everything else is forwarded to
 * the dialog inside it, where React Aria's `filterDOMProps` drops `title`,
 * `tabIndex`, the keyboard focus handlers and every `aria-*` name outside the
 * labelling four. Put those on your own content element instead.
 *
 * @see https://nimbus-documentation.vercel.app/components/feedback/popover
 */
export type PopoverContentProps = OmitInternalProps<
  PopoverContentSlotProps,
  "children" | "role" | "offset" | "maxHeight"
> & {
  /**
   * The popover's content. Pass a function to receive a `close` callback for
   * dismissing the popover from within.
   */
  children?: ReactNode | ((opts: PopoverContentRenderProps) => ReactNode);

  /**
   * An accessible name for the popover's dialog. Required when the content has
   * no visible heading.
   */
  "aria-label"?: string;

  /**
   * The id of the element that labels the popover's dialog.
   */
  "aria-labelledby"?: string;

  /**
   * Reference to the popover surface element.
   */
  ref?: Ref<HTMLDivElement>;
};
