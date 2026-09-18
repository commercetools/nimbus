import type { FieldErrorsData } from "@/components";

type TouchedLocalizedString = { [locale: string]: boolean };

type CustomFormikErrors<Values> = {
  [K in keyof Values]?: FieldErrorsData;
};

export const getHasInvalidLocalizedFields = <TErrors extends object>(
  errors?: TErrors,
  defaultLocaleOrCurrency?: string
): boolean => {
  if (errors && Object.keys(errors).length > 0 && defaultLocaleOrCurrency) {
    return Object.keys(errors).some(
      (localeOrCurrency) => localeOrCurrency !== defaultLocaleOrCurrency
    );
  }
  return false;
};

export const isTouched = (touched?: TouchedLocalizedString): boolean => {
  if (touched) {
    return Object.values(touched).some(Boolean);
  }
  return false;
};

/**
 * Use this function to convert the Formik `errors` object type to
 * our custom field errors type.
 * This is primarly useful when using TypeScript.
 */
export function toFieldErrors<FormValues>(
  errors: unknown
): CustomFormikErrors<FormValues> {
  return errors as CustomFormikErrors<FormValues>;
}
