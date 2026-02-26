import type { ReactNode } from "react";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type FieldErrorsRecipeProps = SlotRecipeProps<"nimbusFieldErrors"> &
  UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type FieldErrorsRootSlotProps = OmitInternalProps<
  HTMLChakraProps<"div", FieldErrorsRecipeProps>
>;

export type FieldErrorsMessageSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

export type FieldErrorsData = Record<string, boolean>;

export type TErrorRenderer = (key: string, error?: boolean) => ReactNode;

export const FieldErrorTypes = {
  MISSING: "missing",
  INVALID: "invalid",
  EMPTY: "empty",
  MIN_LENGTH: "min",
  MAX_LENGTH: "max",
  FORMAT: "format",
  DUPLICATE: "duplicate",
  NEGATIVE: "negative",
  FRACTIONS: "fractions",
  BELOW_MIN: "belowMin",
  ABOVE_MAX: "aboveMax",
  OUT_OF_RANGE: "outOfRange",
  INVALID_FROM_SERVER: "invalidFromServer",
  NOT_FOUND: "notFound",
  BLOCKED: "blocked",
} as const;

export type TFieldErrorTypes =
  (typeof FieldErrorTypes)[keyof typeof FieldErrorTypes];

// ============================================================
// MAIN PROPS
// ============================================================

export type FieldErrorsProps = FieldErrorsRootSlotProps & {
  /**
   * Object mapping error types to boolean values indicating presence
   */
  errors?: FieldErrorsData;
  /**
   * Whether the error messages are visible
   * @default true
   */
  isVisible?: boolean;
  /**
   * Custom render function for error messages
   */
  renderError?: TErrorRenderer;
  /**
   * Default render function for error messages when no custom renderer is provided
   */
  renderDefaultError?: TErrorRenderer;
  /**
   * Custom message overrides for specific error types
   */
  customMessages?: {
    /** Message for missing field error */
    missing?: ReactNode;
    /** Message for invalid field error */
    invalid?: ReactNode;
    /** Message for empty field error */
    empty?: ReactNode;
    /** Message for minimum length error */
    min?: ReactNode;
    /** Message for maximum length error */
    max?: ReactNode;
    /** Message for format error */
    format?: ReactNode;
    /** Message for duplicate value error */
    duplicate?: ReactNode;
    /** Message for negative value error */
    negative?: ReactNode;
    /** Message for fractional value error */
    fractions?: ReactNode;
    /** Message for below minimum value error */
    belowMin?: ReactNode;
    /** Message for above maximum value error */
    aboveMax?: ReactNode;
    /** Message for out of range error */
    outOfRange?: ReactNode;
    /** Message for invalid from server error */
    invalidFromServer?: ReactNode;
    /** Message for not found error */
    notFound?: ReactNode;
    /** Message for blocked error */
    blocked?: ReactNode;
  };
};
