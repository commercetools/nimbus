import { useState, useMemo } from "react";
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
  Payments,
} from "@commercetools/nimbus-icons";
import { Box, Button, IconButton } from "@/components";
import { Popover } from "../../popover";
import {
  LocalizedFieldRootSlot,
  LocalizedFieldLabelSlot,
  LocalizedFieldInfoDialogSlot,
  LocalizedFieldFieldsContainerSlot,
  LocalizedFieldDescriptionSlot,
  LocalizedFieldErrorSlot,
  LocalizedFieldToggleButtonContainerSlot,
} from "../localized-field.slots";
import type {
  LocalizedFieldProps,
  MergedLocaleFieldData,
} from "../localized-field.types";

import {
  getHasInvalidLocalizedFields,
  getLocaleFieldAttribute,
  sortCurrencies,
  sortLocalesByDefaultLocaleLanguage,
} from "../utils/localized-field.utils";
import { LocalizedFieldLocaleField } from "./localized-field.locale-field";

export const LocalizedField = ({
  type = "text",
  id,
  name,
  defaultLocaleOrCurrency,
  valuesByLocaleOrCurrency,
  placeholdersByLocaleOrCurrency,
  descriptionsByLocaleOrCurrency,
  warningsByLocaleOrCurrency,
  errorsByLocaleOrCurrency,
  label,
  hint,
  description,
  warning,
  error,
  touched,
  isRequired,
  isDisabled,
  isReadOnly,
  onChange,
  onBlur,
  onFocus,
  defaultExpanded = false,
  displayAllLocalesOrCurrencies = false,
  size,
  autoFocus,
  ["data-track-component"]: dataTrackComponent,
  ["data-testid"]: dataTestId,
  ["data-test"]: dataTest,
  // DOM & Style props for wrapper container
  ...rest
}: LocalizedFieldProps) => {
  const [expanded, setExpanded] = useState(
    displayAllLocalesOrCurrencies ?? defaultExpanded
  );
  /** used to associate container with toggle button for `aria-controls` */
  const localeFieldsContainerId = useId();

  const isInvalid: boolean = Boolean(error && touched);

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({
      id,
      label,
      description,
      errorMessage: error,
      isInvalid,
    });
  const localizationKeys = Object.keys(valuesByLocaleOrCurrency);
  const allDataForFields = useMemo(() => {
    const sortedFieldData =
      type === "money"
        ? sortCurrencies(defaultLocaleOrCurrency, localizationKeys)
        : sortLocalesByDefaultLocaleLanguage(
            defaultLocaleOrCurrency,
            localizationKeys
          );

    return sortedFieldData.reduce(
      (allFieldData: MergedLocaleFieldData[], localizationKey) => {
        const allDataForLocale = {
          localeOrCurrency: localizationKey,
          inputValue: valuesByLocaleOrCurrency[localizationKey] as string,
          placeholder: placeholdersByLocaleOrCurrency?.[localizationKey],
          description: descriptionsByLocaleOrCurrency?.[localizationKey],
          warning: warningsByLocaleOrCurrency?.[localizationKey],
          error: errorsByLocaleOrCurrency?.[localizationKey],
          // autoFocus default/first locale field
          ...(localizationKey === defaultLocaleOrCurrency && autoFocus
            ? { autoFocus }
            : {}),
        };
        if (
          expanded ||
          (!expanded && localizationKey === defaultLocaleOrCurrency)
        ) {
          return [...allFieldData, allDataForLocale];
        }
        return allFieldData;
      },
      []
    );
  }, [
    valuesByLocaleOrCurrency,
    placeholdersByLocaleOrCurrency,
    descriptionsByLocaleOrCurrency,
    warningsByLocaleOrCurrency,
    errorsByLocaleOrCurrency,
    defaultLocaleOrCurrency,
    expanded,
  ]);

  const groupHasInvalidLocalizedFields = getHasInvalidLocalizedFields(
    errorsByLocaleOrCurrency,
    defaultLocaleOrCurrency
  );

  // If there are fields that are invalid, ensure that field group
  // shows all fields so that invalid field is visible
  if (groupHasInvalidLocalizedFields && !expanded) {
    setExpanded(true);
  }

  return (
    <LocalizedFieldRootSlot
      {...rest}
      {...fieldProps}
      type={type}
      size={size}
      name={name}
    >
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
        <RaCollection items={allDataForFields}>
          {(item) => {
            return (
              <LocalizedFieldLocaleField
                {...item}
                id={getLocaleFieldAttribute(
                  fieldProps.id,
                  item.localeOrCurrency
                )}
                name={getLocaleFieldAttribute(name, item.localeOrCurrency)}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
                isInvalid={isInvalid}
                size={size}
                type={type}
                data-test={getLocaleFieldAttribute(
                  dataTest,
                  item.localeOrCurrency
                )}
                data-testid={getLocaleFieldAttribute(
                  dataTestId,
                  item.localeOrCurrency
                )}
                data-track-component={getLocaleFieldAttribute(
                  dataTrackComponent,
                  item.localeOrCurrency
                )}
              />
            );
          }}
        </RaCollection>
      </LocalizedFieldFieldsContainerSlot>
      {description && (
        <LocalizedFieldDescriptionSlot
          role={warning && touched ? "status" : undefined}
          {...descriptionProps}
        >
          {warning && touched ? warning : description}
        </LocalizedFieldDescriptionSlot>
      )}
      {error && touched && (
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
      {!displayAllLocalesOrCurrencies && localizationKeys.length > 1 && (
        <LocalizedFieldToggleButtonContainerSlot>
          <Button
            aria-labelledby={labelProps.id}
            aria-controls={localeFieldsContainerId}
            aria-expanded={expanded}
            onPress={() => setExpanded(!expanded)}
            isDisabled={
              isDisabled || (expanded && groupHasInvalidLocalizedFields)
            }
            variant="ghost"
            size="2xs"
            colorPalette="primary"
          >
            <Box
              as={type === "money" ? Payments : Language}
              display="inline-flex"
              boxSize="400"
              verticalAlign="text-bottom"
              mr="100"
            />
            {expanded ? "Hide all" : "Show all"}{" "}
            {type === "money" ? "currencies" : "languages"}
          </Button>
        </LocalizedFieldToggleButtonContainerSlot>
      )}
    </LocalizedFieldRootSlot>
  );
};
