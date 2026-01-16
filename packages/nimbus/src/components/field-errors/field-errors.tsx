import { FieldErrorsRoot, FieldErrorsMessage } from "./field-errors.slots";
import type { FieldErrorsProps } from "./field-errors.types";
import { FieldErrorTypes } from "./field-errors.types";
import { useLocalizedStringFormatter } from "@/hooks";
import { fieldErrorsMessagesStrings } from "./field-errors.messages";

const isObject = (obj: unknown): boolean => typeof obj === "object";

/**
 * Get custom message for a given error key
 */
const getCustomMessage = (
  key: string,
  customMessages?: FieldErrorsProps["customMessages"]
): React.ReactNode => {
  if (!customMessages) return null;

  // Map error keys to custom messages
  switch (key) {
    case FieldErrorTypes.MISSING:
      return customMessages.missing || null;
    case FieldErrorTypes.INVALID:
      return customMessages.invalid || null;
    case FieldErrorTypes.EMPTY:
      return customMessages.empty || null;
    case FieldErrorTypes.MIN_LENGTH:
      return customMessages.min || null;
    case FieldErrorTypes.MAX_LENGTH:
      return customMessages.max || null;
    case FieldErrorTypes.FORMAT:
      return customMessages.format || null;
    case FieldErrorTypes.DUPLICATE:
      return customMessages.duplicate || null;
    case FieldErrorTypes.NEGATIVE:
      return customMessages.negative || null;
    case FieldErrorTypes.FRACTIONS:
      return customMessages.fractions || null;
    case FieldErrorTypes.BELOW_MIN:
      return customMessages.belowMin || null;
    case FieldErrorTypes.ABOVE_MAX:
      return customMessages.aboveMax || null;
    case FieldErrorTypes.OUT_OF_RANGE:
      return customMessages.outOfRange || null;
    case FieldErrorTypes.INVALID_FROM_SERVER:
      return customMessages.invalidFromServer || null;
    case FieldErrorTypes.NOT_FOUND:
      return customMessages.notFound || null;
    case FieldErrorTypes.BLOCKED:
      return customMessages.blocked || null;
    default:
      return null;
  }
};

/**
 * Get built-in localized message for a given error key
 * @param key - The error key
 * @param format - The format function from useLocalizedStringFormatter
 */
const getBuiltInMessage = (
  key: string,
  format: (key: string) => string
): string | null => {
  switch (key) {
    // Basic validation
    case FieldErrorTypes.MISSING:
      return format("missingRequiredField");
    case FieldErrorTypes.INVALID:
      return format("invalidValue");
    case FieldErrorTypes.EMPTY:
      return format("emptyValue");

    // Length validation
    case FieldErrorTypes.MIN_LENGTH:
      return format("valueTooShort");
    case FieldErrorTypes.MAX_LENGTH:
      return format("valueTooLong");

    // Format validation
    case FieldErrorTypes.FORMAT:
      return format("invalidFormat");
    case FieldErrorTypes.DUPLICATE:
      return format("duplicateValue");

    // Numeric validation
    case FieldErrorTypes.NEGATIVE:
      return format("invalidNegativeNumber");
    case FieldErrorTypes.FRACTIONS:
      return format("invalidFractionalNumber");
    case FieldErrorTypes.BELOW_MIN:
      return format("valueBelowMinimum");
    case FieldErrorTypes.ABOVE_MAX:
      return format("valueAboveMaximum");
    case FieldErrorTypes.OUT_OF_RANGE:
      return format("valueOutOfRange");

    // Server/async validation
    case FieldErrorTypes.INVALID_FROM_SERVER:
      return format("invalidFromServer");
    case FieldErrorTypes.NOT_FOUND:
      return format("resourceNotFound");
    case FieldErrorTypes.BLOCKED:
      return format("valueBlocked");

    default:
      return null;
  }
};

/**
 * # FieldErrors
 *
 * Renders error messages based on error object configuration.
 * Provides backwards compatibility with UI-Kit FieldErrors while integrating
 * with Nimbus design system patterns.
 *
 * Supports custom error renderers and localized built-in error messages
 * for common validation scenarios like missing required fields.
 *
 * @see {@link https://nimbus.commercetools.com/components/field-errors}
 *
 * @supportsStyleProps
 */
export const FieldErrors = ({
  id,
  errors,
  isVisible = true, // Default to true for backwards compatibility, but will be auto-handled in future
  renderError,
  renderDefaultError,
  customMessages,
  ...props
}: FieldErrorsProps) => {
  const msg = useLocalizedStringFormatter(fieldErrorsMessagesStrings);

  // Don't render if not visible or no errors
  if (!isVisible) return null;
  if (!errors || !isObject(errors)) return null;

  // Filter to only show truthy errors
  const activeErrors = Object.entries(errors).filter(([, error]) => error);

  // Don't render if no active errors
  if (activeErrors.length === 0) return null;

  return (
    <FieldErrorsRoot id={id} role="alert" {...props}>
      {activeErrors.map(([key, error]) => {
        // Try custom error renderer first
        const customErrorElement = renderError?.(key, error);
        if (customErrorElement) {
          return (
            <FieldErrorsMessage key={key}>
              {customErrorElement}
            </FieldErrorsMessage>
          );
        }

        // Try default error renderer second
        const defaultErrorElement = renderDefaultError?.(key, error);
        if (defaultErrorElement) {
          return (
            <FieldErrorsMessage key={key}>
              {defaultErrorElement}
            </FieldErrorsMessage>
          );
        }

        // Try custom messages for built-in error types first
        const customMessage = getCustomMessage(key, customMessages);
        if (customMessage) {
          return (
            <FieldErrorsMessage key={key}>{customMessage}</FieldErrorsMessage>
          );
        }

        // Fall back to built-in localized messages
        const builtInMessage = getBuiltInMessage(key, msg.format);
        if (builtInMessage) {
          return (
            <FieldErrorsMessage key={key}>{builtInMessage}</FieldErrorsMessage>
          );
        }

        // If no renderer handles it, render nothing
        return null;
      })}
    </FieldErrorsRoot>
  );
};

// Static properties for backwards compatibility with UI-Kit
FieldErrors.displayName = "FieldErrors";
FieldErrors.errorTypes = FieldErrorTypes;
// Static properties for string conversion, mostly for testing
FieldErrors.getBuiltInMessage = getBuiltInMessage;
FieldErrors.getCustomMessage = getCustomMessage;
