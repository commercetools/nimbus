import { SearchInput } from "@/components/search-input/search-input";
import type { SearchInputFieldProps } from "./search-input-field.types";
import { FormField, FieldErrors } from "@/components";

/**
 * # SearchInputField
 *
 * A pre-composed form field component that combines SearchInput with FormField features
 * like labels, descriptions, error handling, and validation feedback.
 *
 * This component provides a simple, flat API for search input use cases with built-in
 * search icon, clear functionality, and proper validation.
 *
 * @supportsStyleProps
 *
 * @example
 * ```tsx
 * <SearchInputField
 *   label="Search products"
 *   description="Enter keywords to search"
 *   value={searchValue}
 *   onChange={setSearchValue}
 *   placeholder="Search..."
 *   errors={{ missing: true }}
 *   touched={touched}
 *   isRequired
 * />
 * ```
 */

export const SearchInputField = ({
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
  size = "md",
  ...searchInputProps
}: SearchInputFieldProps) => {
  // Determine if we should show errors
  const hasErrors = touched && errors && Object.values(errors).some(Boolean);

  return (
    <FormField.Root
      id={id}
      size={size}
      isInvalid={hasErrors || isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <SearchInput size={size} {...searchInputProps} />
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

SearchInputField.displayName = "SearchInputField";
