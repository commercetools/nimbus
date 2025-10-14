import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { DateValue } from "react-aria";
import type { DateFieldProps as RaDateFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type DateInputRecipeProps = {
  size?: SlotRecipeProps<"dateInput">["size"];
  variant?: SlotRecipeProps<"dateInput">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DateInputRootSlotProps = HTMLChakraProps<
  "div",
  DateInputRecipeProps
>;

export type DateInputLeadingElementSlotProps = HTMLChakraProps<"div">;

export type DateInputTrailingElementSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

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

export type DateInputProps = Omit<
  DateInputRootSlotProps,
  keyof RaDateFieldProps<DateValue> | ExcludedProps
> &
  Omit<RaDateFieldProps<DateValue>, ExcludedProps> & {
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
  };
