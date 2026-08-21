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
 * Provides a `close` callback so content can dismiss its own popover.
 */
export type PopoverContentRenderProps = RaDialogRenderProps;

/**
 * The React Aria overlay props that configure the popover surface and the dialog
 * inside it.
 *
 * `Popover.Root` renders `DialogTrigger`, but `Popover.Content` renders the
 * `Popover` and `Dialog` elements. These props therefore describe elements Root
 * does not own: Root accepts them as the compound's single configuration surface
 * and hands them to `Popover.Content` through context.
 *
 * Only behavioural props are hoisted. Per-element presentation — `className`,
 * `style`, `id`, `data-*`, `aria-*`, `slot`, `render`, `children` and the DOM
 * event handlers — stays on the part that renders the element, because `Popover`
 * and `Dialog` share 78 of those prop names with incompatible types (`className`
 * is `ClassNameOrFunction<PopoverRenderProps>` on one and `string` on the other)
 * and Root has no element of its own to disambiguate against.
 *
 * The open-state props (`isOpen`, `defaultOpen`, `onOpenChange`) are absent by
 * design. React Aria's `Popover` also declares them, but setting them on the
 * surface makes it derive its own state instead of reading the trigger's, which
 * desynchronises the two — so they belong to `DialogTrigger` alone. See the note
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
 * Establishes the popover's open state and styling context. Renders React
 * Aria's `DialogTrigger`, which mounts no DOM element of its own, so Root does
 * not affect the surrounding layout.
 *
 * Root is the compound's configuration surface: it accepts the open-state props
 * `DialogTrigger` honours directly, plus every behavioural prop of the `Popover`
 * and `Dialog` elements that `Popover.Content` renders on its behalf (see
 * {@link PopoverOverlayConfigProps}). Those travel to `Popover.Content` through
 * context. `Popover.Content` may still override the positioning and dismissal
 * subset per instance — the nearer value wins, matching React Aria's own
 * context-merging convention.
 *
 * Only `isOpen`, `defaultOpen` and `onOpenChange` reach `DialogTrigger`. They are
 * never forwarded to the surface: React Aria's `Popover` derives its own state
 * when either `isOpen` or `defaultOpen` is set, which would leave the trigger
 * toggling one state while the surface renders another.
 *
 * Deliberately not derived from `PopoverRootSlotProps`. Root renders no element,
 * so style props and DOM attributes would have nothing to attach to — put `id`,
 * `className`, `data-*` and style props on `Popover.Trigger` or
 * `Popover.Content` instead. The absence of Chakra style props is also why
 * `maxHeight` here is React Aria's numeric positioning cap rather than the CSS
 * property it denotes on `Popover.Content`.
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
 * context.
 *
 * Derived by removing `DialogTrigger`'s own prop surface from
 * {@link PopoverRootProps}, so the open-state props and `children` cannot reach
 * the overlay by construction rather than by convention.
 */
export type PopoverConfigContextValue = Omit<
  PopoverRootProps,
  keyof RaDialogTriggerProps
>;

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
 *
 * Carries no overlay configuration. `Popover.Root` is the compound's single
 * configuration surface, so `placement`, `offset`, `isNonModal`, `role` and the
 * rest of {@link PopoverOverlayConfigProps} are set there and rejected here —
 * there is exactly one `Popover.Content` per `Popover.Root`, so a second place
 * to set the same option would only be a second place to look for it.
 *
 * What remains here is this element's own presentation and labelling. Style props
 * apply to the positioned surface; `id`, `className`, `data-*`, `aria-*` and
 * event handlers apply to the dialog inside it. React Aria filters that second
 * set, so `title`, `tabIndex` and the keyboard and focus handlers are accepted
 * here but never reach the DOM — see the note on `PopoverContent`.
 *
 * One name to watch: `maxHeight` is accepted here as a Chakra style prop, but it
 * cannot take effect on the surface. React Aria assigns `overlay.style.maxHeight`
 * imperatively on every position pass, and that inline value outranks a class.
 * Cap the surface with `maxHeight` on `Popover.Root` instead, where it is React
 * Aria's positioning input and feeds the placement and flip calculation.
 */
export type PopoverContentProps = OmitInternalProps<
  PopoverContentSlotProps,
  "children"
> & {
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
