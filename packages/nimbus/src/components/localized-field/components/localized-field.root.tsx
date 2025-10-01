import { useState, useMemo } from "react";
import { useIntl } from "react-intl";
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
  WarningAmber,
} from "@commercetools/nimbus-icons";
import {
  Box,
  Button,
  FieldErrors,
  Icon,
  IconButton,
  Stack,
  type TCurrencyCode,
} from "@/components";
import { Popover } from "../../popover";
import messages from "../localized-field.i18n";
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
  LocalizedCurrency,
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
  warnings,
  renderWarning,
  error,
  errors,
  renderError,
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
    displayAllLocalesOrCurrencies || defaultExpanded
  );

  const { formatMessage } = useIntl();

  // Used to associate more info dialog with fieldset via `aria-controls`
  const localeFieldsContainerId = useId();
  // Used to associate more info dialog with fieldset via `aria-details`
  const moreDetailsButtonId = useId();

  // Either `error` exists, or there are `true` fields in the UI Kit compat `errors` object
  const hasError: boolean = Boolean(
    error || (errors && Object.values(errors).some((error) => error === true))
  );

  // Either `warning` exists, or there are `true` fields in the UI Kit compat `warnings` object
  const hasWarning: boolean = Boolean(
    warning || (warnings && Object.values(warnings).some(Boolean))
  );

  // FieldGroup is invalid if a non-field-specific error is passed and the group has been touched
  // When FieldGroup is invalid, all fields will display error styling without displaying a field-specific error message
  const isInvalid: boolean = !!(hasError && touched);

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({
      id,
      label,
      description,
      errorMessage: error,
      isInvalid,
    });

  // Array of locales/currencies to display as input fields
  const localizationKeys: string[] | TCurrencyCode[] = Object.keys(
    valuesByLocaleOrCurrency
  );

  // Merge all -ByLocaleOrCurrencies data for each field
  const allDataForFields = useMemo(() => {
    const sortedFieldData =
      type === "money"
        ? sortCurrencies(
            defaultLocaleOrCurrency as TCurrencyCode,
            localizationKeys as TCurrencyCode[]
          )
        : sortLocalesByDefaultLocaleLanguage(
            defaultLocaleOrCurrency,
            localizationKeys
          );

    return sortedFieldData.reduce(
      (allFieldData: MergedLocaleFieldData[], localizationKey) => {
        const allDataForLocale = {
          localeOrCurrency: localizationKey,
          inputValue:
            type === "money"
              ? (valuesByLocaleOrCurrency as LocalizedCurrency)[localizationKey]
              : (valuesByLocaleOrCurrency[localizationKey] as string),
          placeholder: placeholdersByLocaleOrCurrency?.[localizationKey],
          description: descriptionsByLocaleOrCurrency?.[localizationKey],
          warning: warningsByLocaleOrCurrency?.[localizationKey],
          error: errorsByLocaleOrCurrency?.[localizationKey],
          // autoFocus default/first locale field
          ...(localizationKey === defaultLocaleOrCurrency && autoFocus
            ? { autoFocus }
            : {}),
          isInvalid,
          isRequired,
          isDisabled,
          isReadOnly,
        };
        if (
          expanded ||
          // Only display defaultLocaleOrInput field if fieldGroup is not expanded
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
    isInvalid,
    isRequired,
    isDisabled,
    isReadOnly,
  ]);

  const groupHasInvalidLocalizedFields = getHasInvalidLocalizedFields(
    errorsByLocaleOrCurrency,
    defaultLocaleOrCurrency
  );

  const shouldExpandInvalidFields =
    (groupHasInvalidLocalizedFields || hasError) && touched;
  // If there are fields that are invalid, ensure that field group
  // shows all fields so that invalid field is visible
  if (shouldExpandInvalidFields && !expanded) {
    setExpanded(true);
  }

  return (
    <LocalizedFieldRootSlot
      {...rest}
      {...fieldProps}
      aria-details={hint ? moreDetailsButtonId : undefined}
      type={type}
      size={size}
      name={name}
    >
      {label && (
        <Stack direction="row" gap="0">
          <LocalizedFieldLabelSlot {...labelProps}>
            {label}
            {isRequired && <sup aria-hidden="true">*</sup>}
          </LocalizedFieldLabelSlot>
          {hint && (
            <RaDialogTrigger>
              <IconButton
                id={moreDetailsButtonId}
                aria-label={formatMessage(messages.infoBoxTriggerAriaLabel)}
                size="2xs"
                tone="info"
                variant="link"
              >
                <HelpOutline />
              </IconButton>

              <Popover padding={0}>
                <LocalizedFieldInfoDialogSlot asChild>
                  <RaDialog>
                    <Box p="300">{hint}</Box>
                  </RaDialog>
                </LocalizedFieldInfoDialogSlot>
              </Popover>
            </RaDialogTrigger>
          )}
        </Stack>
      )}
      <LocalizedFieldFieldsContainerSlot
        id={localeFieldsContainerId}
        data-expanded={expanded}
      >
        <RaCollection items={allDataForFields}>
          {(item) => {
            return (
              <LocalizedFieldLocaleField
                {...item}
                size={size}
                type={type}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                touched={touched}
                // Format field attributes to match uikit pattern
                id={getLocaleFieldAttribute(
                  fieldProps.id,
                  item.localeOrCurrency
                )}
                name={getLocaleFieldAttribute(name, item.localeOrCurrency)}
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

      {!displayAllLocalesOrCurrencies && localizationKeys.length > 1 && (
        <LocalizedFieldToggleButtonContainerSlot>
          <Button
            aria-controls={localeFieldsContainerId}
            aria-describedby={labelProps.id}
            aria-expanded={expanded}
            onPress={() => setExpanded(!expanded)}
            isDisabled={isDisabled || (shouldExpandInvalidFields && expanded)}
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
            {type === "money"
              ? expanded
                ? formatMessage(messages.hideCurrencies)
                : formatMessage(messages.showCurrencies)
              : expanded
                ? formatMessage(messages.hideLanguages)
                : formatMessage(messages.showLanguages)}
          </Button>
        </LocalizedFieldToggleButtonContainerSlot>
      )}
      {(description || (hasWarning && touched)) && (
        <LocalizedFieldDescriptionSlot
          role={hasWarning && touched ? "status" : undefined}
          color={hasWarning && touched ? "warning.11" : undefined}
          // In order to associate the warnings from both the warning and legacy warnings props with the fieldset,
          // we must associate, them to this element with aria-labelledby
          aria-labelledby={`${descriptionProps.id}-warning`}
          {...descriptionProps}
        >
          {/** Warnings are for compat with UI Kit localized fields */}
          {hasWarning && touched ? (
            <>
              <Icon colorPalette="warning">
                <WarningAmber />
              </Icon>
              <Stack gap="0" id={`${descriptionProps.id}-warning`}>
                {warning}
                {warnings && hasWarning && (
                  <FieldErrors
                    errors={warnings}
                    renderError={renderWarning}
                    colorPalette="warning"
                    role={undefined}
                  />
                )}
              </Stack>
            </>
          ) : (
            description
          )}
        </LocalizedFieldDescriptionSlot>
      )}
      {isInvalid && (
        <LocalizedFieldErrorSlot
          // In order to associate the errors from both the error and legacy errors props with the fieldset,
          // we must associate them to this element with aria-labelledby.
          aria-labelledby={`${errorMessageProps.id}-error`}
          role="alert"
          {...errorMessageProps}
        >
          <Icon>
            <ErrorOutline />
          </Icon>
          <Stack gap="0" id={`${errorMessageProps.id}-error`}>
            {error}
            {errors && hasError && (
              <FieldErrors
                errors={errors}
                renderError={renderError}
                role={undefined}
              />
            )}
          </Stack>
        </LocalizedFieldErrorSlot>
      )}
    </LocalizedFieldRootSlot>
  );
};
