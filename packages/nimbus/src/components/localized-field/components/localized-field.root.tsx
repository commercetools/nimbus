import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import { Collection } from "react-aria-components";
import { FormField, Button } from "@/components";
import type { FormFieldRootHandle } from "@/components/form-field/components/form-field.root";
import {
  LocalizedFieldRootSlot,
  LocalizedFieldLabelSlot,
  LocalizedFieldFieldsContainerSlot,
  LocalizedFieldToggleButtonContainerSlot,
} from "../localized-field.slots";
import type { LocalizedFieldProps } from "../localized-field.types";
import { LocalizedFieldLocaleField } from "./localized-field.locale-field";

/** internal type for object containing all data for a single locale */
export type AllDataForLocale = {
  locale: string;
  inputValue: string;
  placeholder?: string;
  description?: ReactNode;
  warning?: ReactNode;
  error?: ReactNode;
};

/**
 * Interface for the imperative ref handle exposed by LocalizedField
 */
export interface LocalizedFieldHandle {
  /** The input properties object from the FormField.Root component */
  inputProps: FormFieldRootHandle["inputProps"];
  /** Reference to the underlying FormField.Root DOM element */
  element: HTMLDivElement | null;
}

export const LocalizedField = ({
  defaultLocale,
  valuesByLocale,
  placeholdersByLocale,
  descriptionsByLocale,
  warningsByLocale,
  errorsByLocale,
  label,
  // infoBox,
  // error,
  // warning,
  // isRequired,
  // isInvalid,
  // isDisabled,
  // isReadOnly,
  onChange,
  onBlur,
  onFocus,
  defaultExpanded = false,
  displayAllLocales = false,
  "aria-label": ariaLabel,
  // ...rest
}: LocalizedFieldProps) => {
  // Internal ref to access FormField.Root's imperative handle
  const formFieldRef = useRef<FormFieldRootHandle>(null);
  const [expanded, setExpanded] = useState(
    displayAllLocales ?? defaultExpanded
  );
  const [inputProps, setInputProps] = useState<
    FormFieldRootHandle["inputProps"]
  >({} as FormFieldRootHandle["inputProps"]);

  // Update inputProps when formFieldRef becomes available
  useEffect(() => {
    if (formFieldRef.current?.inputProps) {
      setInputProps(formFieldRef.current.inputProps);
    }
  }, [formFieldRef.current?.inputProps]);

  // Expose the FormField.Root inputProps through the imperative handle
  // Note: This is internal to the component and not exposed via props

  const allDataForLocale = useMemo(
    () =>
      Object.keys(valuesByLocale).reduce(
        (acc: Array<AllDataForLocale>, locale) => {
          const allDataForLocale = {
            locale: locale,
            inputValue: valuesByLocale[locale] as string,
            placeholder: placeholdersByLocale?.[locale],
            description: descriptionsByLocale?.[locale],
            warning: warningsByLocale?.[locale],
            error: errorsByLocale?.[locale],
          };
          if (expanded || (!expanded && locale === defaultLocale)) {
            return [...acc, allDataForLocale];
          }
          return acc;
        },
        []
      ),
    [
      valuesByLocale,
      placeholdersByLocale,
      descriptionsByLocale,
      warningsByLocale,
      errorsByLocale,
      defaultLocale,
      expanded,
    ]
  );

  if (!label && !ariaLabel) {
    console.log(label);
    console.warn(
      "! Nimbus LocalizedField: you must provide either a label or aria-label prop"
    );
  }

  return (
    <LocalizedFieldRootSlot asChild {...inputProps}>
      <FormField.Root ref={formFieldRef} as="fieldset">
        {label && (
          <LocalizedFieldLabelSlot asChild>
            <FormField.Label as="legend">{label}</FormField.Label>
          </LocalizedFieldLabelSlot>
        )}
        <LocalizedFieldFieldsContainerSlot>
          <Collection items={allDataForLocale}>
            {(item) => {
              return (
                <LocalizedFieldLocaleField
                  {...item}
                  id={item.locale}
                  onChange={onChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                />
              );
            }}
          </Collection>
        </LocalizedFieldFieldsContainerSlot>
        <LocalizedFieldToggleButtonContainerSlot>
          <Button onPress={() => setExpanded(!expanded)}>expand</Button>
        </LocalizedFieldToggleButtonContainerSlot>
      </FormField.Root>
    </LocalizedFieldRootSlot>
  );
};
