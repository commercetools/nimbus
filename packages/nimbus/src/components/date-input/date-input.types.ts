import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { DateValue } from "react-aria";
import type { DateFieldProps as RaDateFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type DateInputRecipeProps = {
  /** Size variant of the date input */
  size?: SlotRecipeProps<"nimbusDateInput">["size"];
  /** Visual style variant of the date input */
  variant?: SlotRecipeProps<"nimbusDateInput">["variant"];
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
    /** Optional element to display at the start of the input */
    leadingElement?: React.ReactNode;
    /** Optional element to display at the end of the input */
    trailingElement?: React.ReactNode;
  };
