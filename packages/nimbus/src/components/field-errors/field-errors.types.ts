import type { ReactNode } from "react";
import type { HTMLChakraProps } from "@chakra-ui/react";

// ============================================================
// SLOT PROPS
// ============================================================

export type FieldErrorsMessageSlotProps = HTMLChakraProps<"div">;

export type FieldErrorsRootSlotProps = HTMLChakraProps<"div"> & {
  id?: string;
  role?: string;
  children?: ReactNode;
};

// ============================================================
// HELPER TYPES
// ============================================================

export type TFieldErrors = Record<string, boolean>;

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
  id?: string;
  errors?: TFieldErrors;
  isVisible?: boolean;
  renderError?: TErrorRenderer;
  renderDefaultError?: TErrorRenderer;
  customMessages?: {
    missing?: ReactNode;
    invalid?: ReactNode;
    empty?: ReactNode;
    min?: ReactNode;
    max?: ReactNode;
    format?: ReactNode;
    duplicate?: ReactNode;
    negative?: ReactNode;
    fractions?: ReactNode;
    belowMin?: ReactNode;
    aboveMax?: ReactNode;
    outOfRange?: ReactNode;
    invalidFromServer?: ReactNode;
    notFound?: ReactNode;
    blocked?: ReactNode;
  };
};
