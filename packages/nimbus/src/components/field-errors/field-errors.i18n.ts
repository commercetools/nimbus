import { defineMessages } from "react-intl";

export const messages = defineMessages({
  // Basic validation
  missingRequiredField: {
    id: "Nimbus.FieldErrors.missingRequiredField",
    description: "Error message for missing required value",
    defaultMessage: "This field is required. Provide a value.",
  },
  invalidValue: {
    id: "Nimbus.FieldErrors.invalidValue",
    description: "Error message for invalid value or format",
    defaultMessage: "The provided value is invalid.",
  },
  emptyValue: {
    id: "Nimbus.FieldErrors.emptyValue",
    description: "Error message for empty value when content is required",
    defaultMessage: "This field cannot be empty.",
  },

  // Length validation
  valueTooShort: {
    id: "Nimbus.FieldErrors.valueTooShort",
    description: "Error message for minimum length validation",
    defaultMessage: "This value is too short.",
  },
  valueTooLong: {
    id: "Nimbus.FieldErrors.valueTooLong",
    description: "Error message for maximum length validation",
    defaultMessage: "This value is too long.",
  },

  // Format validation
  invalidFormat: {
    id: "Nimbus.FieldErrors.invalidFormat",
    description: "Error message for format validation",
    defaultMessage: "Please enter a valid format.",
  },
  duplicateValue: {
    id: "Nimbus.FieldErrors.duplicateValue",
    description: "Error message for duplicate value validation",
    defaultMessage: "This value is already in use. It must be unique.",
  },

  // Numeric validation
  invalidNegativeNumber: {
    id: "Nimbus.FieldErrors.invalidNegativeNumber",
    description: "Error message when negative number is used",
    defaultMessage: "Negative number is not supported.",
  },
  invalidFractionalNumber: {
    id: "Nimbus.FieldErrors.invalidFractionalNumber",
    description: "Error message when fractional number is used",
    defaultMessage: "A whole number is required.",
  },
  valueBelowMinimum: {
    id: "Nimbus.FieldErrors.valueBelowMinimum",
    description: "Error message for values below minimum threshold",
    defaultMessage: "Value must be greater than or equal to the minimum.",
  },
  valueAboveMaximum: {
    id: "Nimbus.FieldErrors.valueAboveMaximum",
    description: "Error message for values above maximum threshold",
    defaultMessage: "Value must be less than or equal to the maximum.",
  },
  valueOutOfRange: {
    id: "Nimbus.FieldErrors.valueOutOfRange",
    description: "Error message for values outside acceptable range",
    defaultMessage: "Value must be within the acceptable range.",
  },

  // Server/async validation
  invalidFromServer: {
    id: "Nimbus.FieldErrors.invalidFromServer",
    description: "Error message for server-side validation errors",
    defaultMessage: "Server validation failed. Please check your input.",
  },
  resourceNotFound: {
    id: "Nimbus.FieldErrors.resourceNotFound",
    description: "Error message when a resource is not found",
    defaultMessage: "The requested resource was not found.",
  },
  valueBlocked: {
    id: "Nimbus.FieldErrors.valueBlocked",
    description: "Error message for blocked or restricted values",
    defaultMessage: "This value is not allowed.",
  },
});
