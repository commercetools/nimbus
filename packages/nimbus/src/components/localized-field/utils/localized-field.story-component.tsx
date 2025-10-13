import { useReducer, useCallback } from "react";
import { useId } from "react-aria";
import { LocalizedField, type LocalizedFieldChangeEvent } from "../index";
import { type LocalizedStoryData } from "./test-data";
import type {
  LocalizedFieldProps,
  LocalizedString,
  LocalizedCurrency,
} from "../localized-field.types";
import {
  Accordion,
  Checkbox,
  Group,
  Text,
  Stack,
  Separator,
} from "@/components";

export type LocalizedFieldTypes = "text" | "multiLine" | "richText" | "money";

type FieldDisplayConfig = {
  showDescription?: boolean;
  showWarning?: boolean;
  showError?: boolean;
  showLocaleDescriptions?: boolean;
  showLocaleWarnings?: boolean;
  showLocaleErrors?: boolean;
};

type FieldTypeProps = {
  fieldData: LocalizedStoryData;
  fieldProps?: Partial<LocalizedFieldProps>;
} & FieldDisplayConfig;

// State shape for component
type LocalizedFieldStoryComponentProps = {
  /** Type of localized field to render, each type should have corresponding config object */
  types: LocalizedFieldTypes[];
  id?: string;
  name?: string;
  text?: FieldTypeProps;
  multiLine?: FieldTypeProps;
  richText?: FieldTypeProps;
  money?: FieldTypeProps;
  showControls?: boolean;
  size?: LocalizedFieldProps["size"];
  displayAllLocalesOrCurrencies?: LocalizedFieldProps["displayAllLocalesOrCurrencies"];
  defaultExpanded?: LocalizedFieldProps["defaultExpanded"];
  isRequired?: LocalizedFieldProps["isRequired"];
  isDisabled?: LocalizedFieldProps["isDisabled"];
  isReadOnly?: LocalizedFieldProps["isReadOnly"];
};

// State shape for the reducer
type LocalizedFieldState = {
  text?: FieldDisplayConfig & { value: LocalizedString } & { touched: boolean };
  multiLine?: FieldDisplayConfig & { value: LocalizedString } & {
    touched: boolean;
  };
  richText?: FieldDisplayConfig & { value: LocalizedString } & {
    touched: boolean;
  };
  money?: FieldDisplayConfig & { value: LocalizedCurrency } & {
    touched: boolean;
  };
};

// Action types for the reducer
type LocalizedFieldAction =
  | {
      type: "UPDATE_VALUE";
      payload: {
        fieldType: LocalizedFieldTypes;
        localeOrCurrency: string;
        value: string;
      };
    }
  | {
      type: "SET_TOUCHED";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_DESCRIPTION";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_WARNING";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_ERROR";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_LOCALE_DESCRIPTIONS";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_LOCALE_WARNINGS";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    }
  | {
      type: "SET_SHOW_LOCALE_ERRORS";
      payload: { fieldType: LocalizedFieldTypes; value: boolean };
    };

// Initial state

const getInitialState = (
  args: LocalizedFieldStoryComponentProps
): LocalizedFieldState => {
  return args.types.reduce((acc, type) => {
    if (type && args[type]) {
      const { fieldData, ...rest } = args[type];
      return {
        ...acc,
        [type]: {
          value:
            type === "money"
              ? (fieldData.values as LocalizedCurrency)
              : (fieldData.values as LocalizedString),
          touched: false,
          showDescription: false,
          showWarning: false,
          showError: false,
          showLocaleDescriptions: false,
          showLocaleWarnings: false,
          showLocaleErrors: false,
          ...rest,
        },
      };
    }
    return acc;
  }, {});
};

// Reducer function
function localizedFieldReducer(
  state: LocalizedFieldState,
  action: LocalizedFieldAction
): LocalizedFieldState {
  switch (action.type) {
    case "UPDATE_VALUE":
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          value: {
            ...state[action.payload.fieldType]?.value,
            [action.payload.localeOrCurrency]:
              action.payload.fieldType === "money"
                ? {
                    amount: action.payload.value,
                    currencyCode: action.payload.localeOrCurrency,
                  }
                : action.payload.value,
          },
        },
      };
    case "SET_TOUCHED":
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          touched: action.payload.value,
        },
      };

    case "SET_SHOW_DESCRIPTION": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showDescription: action.payload.value,
        },
      };
    }
    case "SET_SHOW_WARNING": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showWarning: action.payload.value,
        },
      };
    }
    case "SET_SHOW_ERROR": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showError: action.payload.value,
        },
      };
    }
    case "SET_SHOW_LOCALE_DESCRIPTIONS": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showLocaleDescriptions: action.payload.value,
        },
      };
    }
    case "SET_SHOW_LOCALE_WARNINGS": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showLocaleWarnings: action.payload.value,
        },
      };
    }
    case "SET_SHOW_LOCALE_ERRORS": {
      return {
        ...state,
        [action.payload.fieldType]: {
          ...state[action.payload.fieldType],
          showLocaleErrors: action.payload.value,
        },
      };
    }
    default:
      return state;
  }
}

/**
 * Demo component that renders a LocalizedField with useReducer state management.
 * This component is designed to be used in Storybook stories to showcase
 * different types of localized fields with proper state handling.
 */
export function LocalizedFieldStoryComponent(
  props: LocalizedFieldStoryComponentProps
) {
  const { showControls = false } = props;
  const [state, dispatch] = useReducer(
    localizedFieldReducer,
    props,
    getInitialState
  );

  const handleChange = useCallback(
    (e: LocalizedFieldChangeEvent, type: LocalizedFieldTypes) => {
      // Update the appropriate values based on field type
      if (e.target.locale || e.target.currency) {
        // Set field as touched
        dispatch({
          type: "SET_TOUCHED",
          payload: { fieldType: type!, value: true },
        });
        // Set field value
        dispatch({
          type: "UPDATE_VALUE",
          payload: {
            fieldType: type,
            localeOrCurrency: e.target.locale
              ? e.target.locale!
              : e.target.currency!,
            value: e.target.value as string,
          },
        });
      }
    },
    []
  );

  const handleFocus = useCallback((type: LocalizedFieldTypes) => {
    // The richText component updates the value to an html string, so it will call SET_TOUCHED twice,
    // which causes the editor to lose focus due to this open slate issue:
    // https://github.com/ianstormtaylor/slate/issues/3634
    if (type !== "richText") {
      dispatch({
        type: "SET_TOUCHED",
        payload: { fieldType: type!, value: true },
      });
    }
  }, []);

  const handleSetShowField = useCallback(
    (
      type: LocalizedFieldTypes,
      dispatchType:
        | "SET_SHOW_DESCRIPTION"
        | "SET_SHOW_WARNING"
        | "SET_SHOW_ERROR"
        | "SET_SHOW_LOCALE_DESCRIPTIONS"
        | "SET_SHOW_LOCALE_WARNINGS"
        | "SET_SHOW_LOCALE_ERRORS",
      isSelected: boolean
    ) => {
      dispatch({
        type: dispatchType,
        payload: {
          fieldType: type!,
          value: isSelected,
        },
      });
      if (
        ![
          "SET_SHOW_DESCRIPTION",
          "SET_SHOW_LOCALE_DESCRIPTIONS",
          "SET_SHOW_ERROR",
        ].includes(dispatchType)
      ) {
        dispatch({
          type: "SET_TOUCHED",
          payload: { fieldType: type!, value: isSelected },
        });
      }
    },
    []
  );

  const forFieldId = useId();
  const forLocaleId = useId();
  return (
    <Stack>
      <Stack>
        {props.types.map((type) => {
          const { fieldData, fieldProps } = props[type]!;
          const id =
            (fieldProps?.id ?? props?.id) ? `${props.id}.${type}` : undefined;
          const name =
            (fieldProps?.name ?? props?.name)
              ? `${props.name}.${type}`
              : undefined;

          return (
            <Stack key={type} role="group" aria-label={`${type} group`}>
              {showControls && (
                <Accordion.Root size="sm">
                  <Accordion.Item>
                    <Accordion.Header>{`${type} field controls`}</Accordion.Header>
                    <Accordion.Content>
                      <Stack direction="row">
                        <Group aria-labelledby={forFieldId}>
                          <Stack>
                            <Text as="label" id={forFieldId}>
                              For Field (All)
                            </Text>
                            <Checkbox
                              aria-label="Show Description"
                              isSelected={state[type]?.showDescription}
                              onChange={(isSelected) =>
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_DESCRIPTION",
                                  isSelected
                                )
                              }
                            >
                              Show Description
                            </Checkbox>
                            <Checkbox
                              aria-label="Show Warning"
                              isSelected={state[type]?.showWarning}
                              onChange={(isSelected) =>
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_WARNING",
                                  isSelected
                                )
                              }
                            >
                              Show Warning
                            </Checkbox>
                            <Checkbox
                              aria-label="Show Error"
                              isSelected={state[type]?.showError}
                              onChange={(isSelected) =>
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_ERROR",
                                  isSelected
                                )
                              }
                            >
                              Show Error
                            </Checkbox>
                          </Stack>
                        </Group>
                        <Group aria-labelledby={forLocaleId}>
                          <Stack>
                            <Text as="label" id={forLocaleId}>
                              For Each Locale Input
                            </Text>
                            <Checkbox
                              aria-label="Show Descriptions"
                              isSelected={state[type]?.showLocaleDescriptions}
                              onChange={(isSelected) => {
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_LOCALE_DESCRIPTIONS",
                                  isSelected
                                );
                              }}
                            >
                              Show Descriptions
                            </Checkbox>
                            <Checkbox
                              aria-label="Show Warnings"
                              isSelected={state[type]?.showLocaleWarnings}
                              onChange={(isSelected) =>
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_LOCALE_WARNINGS",
                                  isSelected
                                )
                              }
                            >
                              Show Warnings
                            </Checkbox>
                            <Checkbox
                              aria-label="Show Errors"
                              isSelected={state[type]?.showLocaleErrors}
                              onChange={(isSelected) =>
                                handleSetShowField(
                                  type,
                                  "SET_SHOW_LOCALE_ERRORS",
                                  isSelected
                                )
                              }
                            >
                              Show Errors
                            </Checkbox>
                          </Stack>
                        </Group>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              )}
              <LocalizedField
                {...fieldProps}
                id={id}
                name={name}
                type={type} // text is the default type
                label={`${fieldProps?.label} - ${type}`}
                size={props.size}
                isRequired={props.isRequired}
                isDisabled={props.isDisabled}
                isReadOnly={props.isReadOnly}
                defaultLocaleOrCurrency={
                  fieldProps?.defaultLocaleOrCurrency ||
                  (type === "money" ? "USD" : "en")
                }
                displayAllLocalesOrCurrencies={
                  props.displayAllLocalesOrCurrencies
                }
                defaultExpanded={props.defaultExpanded}
                touched={state[type]?.touched}
                onChange={(e) => handleChange(e, type)}
                onFocus={() => handleFocus(type)}
                valuesByLocaleOrCurrency={
                  state[type]?.value || fieldData.values
                }
                placeholdersByLocaleOrCurrency={fieldData.placeholders}
                descriptionsByLocaleOrCurrency={
                  state[type]?.showLocaleDescriptions
                    ? fieldData.descriptions
                    : undefined
                }
                warningsByLocaleOrCurrency={
                  state[type]?.showLocaleWarnings
                    ? fieldData.warnings
                    : undefined
                }
                errorsByLocaleOrCurrency={
                  state[type]?.showLocaleErrors ? fieldData.errors : undefined
                }
                description={
                  state[type]?.showDescription
                    ? fieldProps?.description
                    : undefined
                }
                warning={
                  state[type]?.showWarning ? fieldProps?.warning : undefined
                }
                // State does not control this for testing that errors/warnings display only when `touched` is true
                // i.e. this warning will render if an input gains focus/calls a change event
                warnings={fieldProps?.warnings}
                renderWarning={fieldProps?.renderWarning}
                error={state[type]?.showError ? fieldProps?.error : undefined}
                errors={state[type]?.showError ? fieldProps?.errors : undefined}
                renderError={fieldProps?.renderError}
              />
              <Separator />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
