import type { ReactNode } from "react";
import type { HTMLChakraProps } from "@chakra-ui/react";

/**
 * Error object type - compatible with UI-Kit FieldErrors
 * Only entries with truthy values will be rendered as errors
 */
export type FieldErrorsData = Record<string, boolean>;

/**
 * Function to render custom error messages
 */
export type TErrorRenderer = (key: string, error?: boolean) => ReactNode;

export interface FieldErrorsRootProps extends HTMLChakraProps<"div"> {
  id?: string;
  role?: string;
  children?: ReactNode;
}

/**
 * Props for FieldErrors component
 */
export interface FieldErrorsProps extends FieldErrorsRootProps {
  /**
   * ID of the error field for accessibility
   */
  id?: string;

  /**
   * Error object - only truthy values will be rendered
   * Compatible with UI-Kit FieldErrors format
   */
  errors?: FieldErrorsData;

  /**
   * Whether error messages should be visible
   * @deprecated This prop will be automatically handled by the component
   */
  isVisible?: boolean;

  /**
   * Custom error renderer function
   * Return null to fall back to renderDefaultError or built-in errors
   */
  renderError?: TErrorRenderer;

  /**
   * Default error renderer function for errors not handled by renderError
   * Return null to fall back to built-in error handling
   */
  renderDefaultError?: TErrorRenderer;

  /**
   * Custom error messages to override built-in ones
   */
  customMessages?: {
    // Basic validation
    missing?: ReactNode;
    invalid?: ReactNode;
    empty?: ReactNode;

    // Length validation
    min?: ReactNode;
    max?: ReactNode;

    // Format validation
    format?: ReactNode;
    duplicate?: ReactNode;

    // Numeric validation
    negative?: ReactNode;
    fractions?: ReactNode;
    belowMin?: ReactNode;
    aboveMax?: ReactNode;
    outOfRange?: ReactNode;

    // Server/async validation
    invalidFromServer?: ReactNode;
    notFound?: ReactNode;
    blocked?: ReactNode;
  };
}

/**
 * Built-in error types that FieldErrors can handle automatically
 */
export const FieldErrorTypes = {
  // Basic validation
  MISSING: "missing",
  INVALID: "invalid",
  EMPTY: "empty",

  // Length validation
  MIN_LENGTH: "min",
  MAX_LENGTH: "max",

  // Format validation
  FORMAT: "format",
  DUPLICATE: "duplicate",

  // Numeric validation
  NEGATIVE: "negative",
  FRACTIONS: "fractions",
  BELOW_MIN: "belowMin",
  ABOVE_MAX: "aboveMax",
  OUT_OF_RANGE: "outOfRange",

  // Server/async validation
  INVALID_FROM_SERVER: "invalidFromServer",
  NOT_FOUND: "notFound",
  BLOCKED: "blocked",
} as const;

export type TFieldErrorTypes =
  (typeof FieldErrorTypes)[keyof typeof FieldErrorTypes];

/**
 * Props for FieldErrors root slot
 */
export interface FieldErrorsRootProps {
  id?: string;
  role?: string;
  children?: ReactNode;
}
