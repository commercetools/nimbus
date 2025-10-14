import type { TimeFieldProps as RaTimeFieldProps } from "react-aria-components";
import type { TimeValue } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type TimeInputRecipeProps = {
  size?: SlotRecipeProps<"timeInput">["size"];
  variant?: SlotRecipeProps<"timeInput">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type TimeInputRootSlotProps = HTMLChakraProps<
  "div",
  TimeInputRecipeProps
>;

export type TimeInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  TimeInputRecipeProps
>;

export type TimeInputTrailingElementSlotProps = HTMLChakraProps<
  "div",
  TimeInputRecipeProps
>;

// ============================================================
// HELPER TYPES
// ============================================================

type ConflictingFieldStateProps = keyof RaTimeFieldProps<TimeValue>;

type ExcludedProps =
  | "validationState"
  | "label"
  | "description"
  | "errorMessage"
  | "css"
  | "colorScheme"
  | "unstyled"
  | "recipe"
  | "as"
  | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type TimeInputProps = Omit<
  TimeInputRootSlotProps,
  ConflictingFieldStateProps | ExcludedProps
> &
  Omit<RaTimeFieldProps<TimeValue>, ExcludedProps> & {
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
  };
