import type { TimeFieldProps as RaTimeFieldProps } from "react-aria-components";
import type { TimeValue } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type TimeInputRecipeProps = {
  /** Size variant of the time input */
  size?: SlotRecipeProps<"nimbusTimeInput">["size"];
  /** Visual style variant of the time input */
  variant?: SlotRecipeProps<"nimbusTimeInput">["variant"];
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
    /** Optional element to display at the start of the input */
    leadingElement?: React.ReactNode;
    /** Optional element to display at the end of the input */
    trailingElement?: React.ReactNode;
  };
