import { useState, useMemo, type ReactNode } from "react";
import {
  Collection as RaCollection,
  Dialog as RaDialog,
  DialogTrigger as RaDialogTrigger,
} from "react-aria-components";
import { useField, useId } from "react-aria";
import {
  ErrorOutline,
  HelpOutline,
  Language,
} from "@commercetools/nimbus-icons";
import { Box, Button, IconButton } from "@/components";
import { Popover } from "../../popover";
import {
  LocalizedFieldRootSlot,
  LocalizedFieldLabelSlot,
  LocalizedFieldInfoDialogSlot,
  LocalizedFieldFieldsContainerSlot,
  LocalizedFieldToggleButtonContainerSlot,
  LocalizedFieldDescriptionSlot,
  LocalizedFieldErrorSlot,
} from "../localized-field.slots";
import type { LocalizedFieldProps } from "../localized-field.types";
import {
  sortLocalesByDefaultLocaleLanguage,
  getHasInvalidLocaleFields,
} from "../utils/localized-field.utils";
import { LocalizedFieldLocaleField } from "./localized-field.locale-field";

/** internal type for object containing all data for a single locale */
export type MergedLocaleFieldData = {
  locale: string;
  inputValue: string;
  placeholder?: string;
  description?: ReactNode;
  warning?: ReactNode;
  error?: ReactNode;
};

export const LocalizedField = ({
  type = "text",
  defaultLocale,
  valuesByLocale,
  placeholdersByLocale,
  descriptionsByLocale,
  warningsByLocale,
  errorsByLocale,
  label,
  hint,
  description,
  error,
  warning,
  isRequired,
  isInvalid,
  isDisabled,
  isReadOnly,
  onChange,
  onBlur,
  onFocus,
  defaultExpanded = false,
  displayAllLocales = false,
  size,
  // DOM & Style props for wrapper container
  ...rest
}: LocalizedFieldProps) => {
  const [expanded, setExpanded] = useState(
    displayAllLocales ?? defaultExpanded
  );
  /** used to associate container with toggle button for `aria-controls` */
  const localeFieldsContainerId = useId();

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({
      label,
      description: warning ?? description,
      errorMessage: error,
      isInvalid,
    });
  const locales = Object.keys(valuesByLocale);
  const allDataForLocales = useMemo(() => {
    const sortedLocales = sortLocalesByDefaultLocaleLanguage(
      defaultLocale,
      locales
    );

    return sortedLocales.reduce(
      (allLocaleData: MergedLocaleFieldData[], locale) => {
        const allDataForLocale = {
          locale: locale,
          inputValue: valuesByLocale[locale] as string,
          placeholder: placeholdersByLocale?.[locale],
          description: descriptionsByLocale?.[locale],
          warning: warningsByLocale?.[locale],
          error: errorsByLocale?.[locale],
        };
        if (expanded || (!expanded && locale === defaultLocale)) {
          return [...allLocaleData, allDataForLocale];
        }
        return allLocaleData;
      },
      []
    );
  }, [
    valuesByLocale,
    placeholdersByLocale,
    descriptionsByLocale,
    warningsByLocale,
    errorsByLocale,
    defaultLocale,
    expanded,
  ]);

  const groupHasInvalidLocaleFields = getHasInvalidLocaleFields(
    errorsByLocale,
    defaultLocale
  );

  // If there are fields that are invalid, ensure that field group
  // shows all fields so that invalid field is visible
  if (groupHasInvalidLocaleFields && !expanded) {
    setExpanded(true);
  }

  return (
    <LocalizedFieldRootSlot {...rest} {...fieldProps} type={type} size={size}>
      {label && (
        <LocalizedFieldLabelSlot {...labelProps}>
          <Box as="span">{label}</Box>
          {isRequired && <sup aria-hidden="true">*</sup>}
          {
            /**TODO: should this component be reusable between the FormField and here? */
            hint && (
              <RaDialogTrigger>
                <Box
                  as="span"
                  display="inline-block"
                  position="relative"
                  width="1ch"
                  height="1ch"
                  ml="200"
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    position="absolute"
                    top="50%"
                    right="50%"
                    transform="translate(50%, -50%)"
                  >
                    <IconButton
                      aria-label="__MORE INFO"
                      size="2xs"
                      tone="info"
                      variant="link"
                    >
                      <HelpOutline />
                    </IconButton>
                  </Box>
                </Box>
                <Popover padding={0}>
                  <LocalizedFieldInfoDialogSlot asChild>
                    <RaDialog>
                      <Box p="300">{hint}</Box>
                    </RaDialog>
                  </LocalizedFieldInfoDialogSlot>
                </Popover>
              </RaDialogTrigger>
            )
          }
        </LocalizedFieldLabelSlot>
      )}
      <LocalizedFieldFieldsContainerSlot id={localeFieldsContainerId}>
        <RaCollection items={allDataForLocales}>
          {(item) => {
            return (
              <LocalizedFieldLocaleField
                {...item}
                id={item.locale}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
                isInvalid={isInvalid}
                size={size}
                type={type}
              />
            );
          }}
        </RaCollection>
      </LocalizedFieldFieldsContainerSlot>
      {description && !warning && (
        <LocalizedFieldDescriptionSlot {...descriptionProps}>
          {description}
        </LocalizedFieldDescriptionSlot>
      )}
      {warning && (
        <LocalizedFieldDescriptionSlot role="status" {...descriptionProps}>
          {warning}
        </LocalizedFieldDescriptionSlot>
      )}
      {error && (
        <LocalizedFieldErrorSlot {...errorMessageProps}>
          <Box
            as={ErrorOutline}
            display="inline-flex"
            boxSize="400"
            verticalAlign="text-bottom"
            mr="100"
          />
          {error}
        </LocalizedFieldErrorSlot>
      )}
      {!displayAllLocales && locales.length > 1 && (
        <LocalizedFieldToggleButtonContainerSlot>
          <Button
            aria-labelledby={labelProps.id}
            aria-controls={localeFieldsContainerId}
            aria-expanded={expanded}
            onPress={() => setExpanded(!expanded)}
            isDisabled={isDisabled || (expanded && groupHasInvalidLocaleFields)}
            variant="ghost"
            size="2xs"
            colorPalette="primary"
          >
            <Box
              as={Language}
              display="inline-flex"
              boxSize="400"
              verticalAlign="text-bottom"
              mr="100"
            />
            {expanded ? "Hide all" : "Show all"} languages
          </Button>
        </LocalizedFieldToggleButtonContainerSlot>
      )}
    </LocalizedFieldRootSlot>
  );
};
