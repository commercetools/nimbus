import { DateRangePicker } from "@/components/date-range-picker/date-range-picker";
import { FormField, FieldErrors } from "@/components";
import type { DateRangePickerFieldProps } from "./date-range-picker-field.types";

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
export const DateRangePickerField = ({
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
  isInvalid = false,
  direction = "column",
  size = "md",
  ...dateRangePickerProps
}: DateRangePickerFieldProps) => {
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      id={id}
      direction={direction as "row" | "column"}
      size={size}
      isInvalid={hasErrors || isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <DateRangePicker
          size={size}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          {...dateRangePickerProps}
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
};

DateRangePickerField.displayName = "DateRangePickerField";
