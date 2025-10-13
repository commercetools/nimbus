import { forwardRef } from "react";
import { DateRangePicker } from "@/components/date-range-picker";
import { FormField, FieldErrors } from "@/components";
import type { DateRangePickerFieldProps } from "../date-range-picker.types";

/**
 * # DateRangePickerField
 *
 * A form field component that combines DateRangePicker with Form Field features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component follows the same API pattern as other field components in the UI-Kit,
 * providing a consistent interface for date range selection within forms.
 *
 * @example
 * ```tsx
 * <DateRangePickerField
 *   label="Date Range"
 *   description="Select a start and end date"
 *   value={dateRange}
 *   onChange={handleChange}
 *   errors={errors}
 *   touched={touched}
 *   isRequired
 * />
 * ```
 */
export const DateRangePickerField = forwardRef<
  HTMLDivElement,
  DateRangePickerFieldProps
>(function DateRangePickerField({
  id,
  label,
  description,
  info,
  errors,
  renderError,
  touched = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  direction = "column",
  size = "md",
  ...dateRangePickerProps
}) {
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      id={id}
      direction={direction}
      size={size}
      isInvalid={hasErrors}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      {label && <FormField.Label>{label}</FormField.Label>}
      <FormField.Input>
        <DateRangePicker
          size={size}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          {...dateRangePickerProps}
          data-testid="date-range-picker-field"
        />
      </FormField.Input>

      {description && (
        <FormField.Description>{description}</FormField.Description>
      )}

      {info && <FormField.InfoBox>{info}</FormField.InfoBox>}
      {hasErrors && (
        <FormField.Error>
          <FieldErrors
            id={`${id}-errors`}
            errors={errors}
            renderError={renderError}
          />
        </FormField.Error>
      )}
    </FormField.Root>
  );
});

DateRangePickerField.displayName = "DateRangePickerField";
