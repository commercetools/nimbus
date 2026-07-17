import type { PopoverProps as RaPopoverProps } from "react-aria-components";
import { Popover as RaPopover } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { FC } from "react";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS (internal PopoverBase)
// ============================================================

type PopoverRecipeProps = RecipeProps<"nimbusPopover"> & UnstyledProp;

// ============================================================
// SLOT PROPS (internal PopoverBase)
// ============================================================

export type PopoverRootSlotProps = HTMLChakraProps<"div", PopoverRecipeProps>;

// ============================================================
// INTERNAL POPOVER BASE PROPS
// ============================================================

export type PopoverBaseProps = RaPopoverProps &
  Omit<PopoverRootSlotProps, keyof RaPopoverProps> & {
    ref?: React.Ref<typeof RaPopover>;
  };

export type PopoverBaseComponent = FC<PopoverBaseProps>;

// ============================================================
// COMPOUND POPOVER PROPS
// ============================================================

export type PopoverRootProps = OmitInternalProps<HTMLChakraProps<"div">> & {
  children: React.ReactNode;

  /** Whether the popover is open (controlled mode) */
  isOpen?: boolean;

  /** Whether the popover is open by default (uncontrolled mode) */
  defaultOpen?: boolean;

  /** Callback fired when the popover open state changes */
  onOpenChange?: (isOpen: boolean) => void;

  /** Position relative to trigger */
  placement?: RaPopoverProps["placement"];

  /** Gap between trigger and popover */
  offset?: number;

  /** Close on click outside (default true) */
  isDismissable?: boolean;

  /** Prevent Escape key from closing */
  isKeyboardDismissDisabled?: boolean;
};

export type PopoverTriggerProps = OmitInternalProps<
  HTMLChakraProps<"button">
> & {
  children: React.ReactNode;

  /** Render as child element (same pattern as Dialog.Trigger) */
  asChild?: boolean;

  /** Whether the trigger is disabled */
  isDisabled?: boolean;

  ref?: React.RefObject<HTMLButtonElement>;
};

export type PopoverContentProps = OmitInternalProps<HTMLChakraProps<"div">> & {
  children: React.ReactNode;

  /** CSS width value */
  width?: string;

  ref?: React.RefObject<HTMLDivElement>;
};
