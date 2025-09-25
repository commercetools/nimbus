import { FormattedMessage } from "react-intl";
import { FieldErrorsRoot, FieldErrorsMessage } from "./field-errors.slots";
import { messages } from "./field-errors.i18n";
import type { FieldErrorsProps } from "./field-errors.types";
import { FieldErrorTypes } from "./field-errors.types";

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
 */
const getBuiltInMessage = (key: string): React.ReactNode => {
  switch (key) {
    // Basic validation
    case FieldErrorTypes.MISSING:
      return <FormattedMessage {...messages.missingRequiredField} />;
    case FieldErrorTypes.INVALID:
      return <FormattedMessage {...messages.invalidValue} />;
    case FieldErrorTypes.EMPTY:
      return <FormattedMessage {...messages.emptyValue} />;

    // Length validation
    case FieldErrorTypes.MIN_LENGTH:
      return <FormattedMessage {...messages.valueTooShort} />;
    case FieldErrorTypes.MAX_LENGTH:
      return <FormattedMessage {...messages.valueTooLong} />;

    // Format validation
    case FieldErrorTypes.FORMAT:
      return <FormattedMessage {...messages.invalidFormat} />;
    case FieldErrorTypes.DUPLICATE:
      return <FormattedMessage {...messages.duplicateValue} />;

    // Numeric validation
    case FieldErrorTypes.NEGATIVE:
      return <FormattedMessage {...messages.invalidNegativeNumber} />;
    case FieldErrorTypes.FRACTIONS:
      return <FormattedMessage {...messages.invalidFractionalNumber} />;
    case FieldErrorTypes.BELOW_MIN:
      return <FormattedMessage {...messages.valueBelowMinimum} />;
    case FieldErrorTypes.ABOVE_MAX:
      return <FormattedMessage {...messages.valueAboveMaximum} />;
    case FieldErrorTypes.OUT_OF_RANGE:
      return <FormattedMessage {...messages.valueOutOfRange} />;

    // Server/async validation
    case FieldErrorTypes.INVALID_FROM_SERVER:
      return <FormattedMessage {...messages.invalidFromServer} />;
    case FieldErrorTypes.NOT_FOUND:
      return <FormattedMessage {...messages.resourceNotFound} />;
    case FieldErrorTypes.BLOCKED:
      return <FormattedMessage {...messages.valueBlocked} />;

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
        const builtInMessage = getBuiltInMessage(key);
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
