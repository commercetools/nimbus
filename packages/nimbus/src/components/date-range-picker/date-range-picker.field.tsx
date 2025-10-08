import { forwardRef, useId } from "react";
import { DateRangePicker } from "./date-range-picker";
import { FormField, FieldErrors, Stack } from "@/components";
import type { DateRangePickerFieldProps } from "./date-range-picker.field.types";

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
>(function DateRangePickerField(
  {
    // Field props
    id: providedId,
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

    // DateRangePicker props
    ...dateRangePickerProps
  },
  ref
) {
  const generatedId = useId();
  const id = providedId || generatedId;

  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <Stack direction="column" gap="100" ref={ref}>
      <FormField.Root
        id={id}
        direction={direction}
        size={size}
        isInvalid={hasErrors}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
      >
        <FormField.Label>{label}</FormField.Label>
        <FormField.Input>
          <DateRangePicker
            id={id}
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
      </FormField.Root>

      {hasErrors && (
        <FieldErrors
          id={`${id}-errors`}
          errors={errors}
          renderError={renderError}
        />
      )}
    </Stack>
  );
});

DateRangePickerField.displayName = "DateRangePickerField";
