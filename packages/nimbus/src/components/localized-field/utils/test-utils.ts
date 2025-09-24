import type { BoundFunctions, Queries } from "@testing-library/react";
import { expect, userEvent, within, waitFor } from "storybook/test";

export const getFieldContainerForType = async (
  canvas: BoundFunctions<Queries>,
  type: string
) =>
  (await canvas.findByRole("group", {
    name: new RegExp(`- ${type}`, "i"),
  })) as HTMLElement;

export const getExpandButtonForField = async (
  field: HTMLElement,
  type: string
) => {
  const matchString = type === "money" ? " all currencies" : "all languages";
  const toggleButton = await within(field).findByRole("button", {
    name: new RegExp(matchString, "i"),
  });
  return toggleButton as HTMLElement;
};

export const toggleExpandField = async (field: HTMLElement, type: string) => {
  const toggleButton = await getExpandButtonForField(field, type);
  await userEvent.click(toggleButton);
};

export const getInputForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) =>
  await within(field).findByRole("textbox", {
    name: new RegExp(localeOrCurrency, "i"),
  });

export const getRichTextContainerForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) =>
  await within(field).findByRole("group", {
    name: new RegExp(localeOrCurrency, "i"),
  });

export const getRichTextInputForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) => {
  const richTextContainer = await getRichTextContainerForLocaleField(
    field,
    localeOrCurrency
  );
  return await within(richTextContainer).findByRole("textbox", {
    name: /rich text editor/i,
  });
};

export const checkFieldIsCollapsed = async (
  field: HTMLElement,
  type: string,
  defaultLocaleOrCurrency: string
) => {
  // Check that the field is collapsed and only one input is being displayed
  const toggleButton = await getExpandButtonForField(field, type);
  // Check that button's label and attributes reflect that it is collapsed
  const matchString = `show ${type === "money" ? "all currencies" : "all languages"}`;
  expect(toggleButton).toHaveAccessibleName(new RegExp(matchString, "i"));
  expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  expect(toggleButton).toHaveAccessibleDescription(
    new RegExp(`- ${type}`, "i")
  );
  // Check that there is a single input visible within the field
  const allInputs = await within(field).findAllByRole("textbox");
  expect(allInputs.length).toBe(1);
  // Check that visible input is for the default locale/currency
  if (type === "richText") {
    await getRichTextInputForLocaleField(field, defaultLocaleOrCurrency);
  } else {
    await getInputForLocaleField(field, defaultLocaleOrCurrency);
  }
};

export const checkFieldIsExpanded = async (
  field: HTMLElement,
  type: string,
  supportedLocales: string[],
  defaultLocaleOrCurrency: string
) => {
  // Check that the field is collapsed and only one input is being displayed
  const toggleButton = await getExpandButtonForField(field, type);
  // Check that button's label and attributes reflect that it is expanded
  const matchString = `hide ${type === "money" ? "all currencies" : "all languages"}`;
  expect(toggleButton).toHaveAccessibleName(new RegExp(matchString, "i"));
  expect(toggleButton).toHaveAccessibleDescription(
    new RegExp(`- ${type}`, "i")
  );
  expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  // Check that the expected number of inputs are visible within the field
  const allInputs = await within(field).findAllByRole("textbox");
  expect(allInputs.length).toBe(supportedLocales.length);
  // Check that first visible input is for the default locale/currency
  let defaultInput;
  if (type === "richText") {
    defaultInput = await getRichTextInputForLocaleField(
      field,
      defaultLocaleOrCurrency
    );
  } else {
    defaultInput = await getInputForLocaleField(field, defaultLocaleOrCurrency);
  }
  expect(allInputs[0]).toBe(defaultInput);
  // Check that inputs are sorted correctly with default locale/currency first
  const expectedSortedOrder = [
    defaultLocaleOrCurrency,
    ...supportedLocales
      .filter((locale) => locale !== defaultLocaleOrCurrency)
      .sort(),
  ];
  for (let i = 0; i < expectedSortedOrder.length; i++) {
    const expectedLocaleOrCurrency = expectedSortedOrder[i];
    let inputForLocale;
    if (type === "richText") {
      inputForLocale = await getRichTextInputForLocaleField(
        field,
        expectedLocaleOrCurrency
      );
    } else {
      inputForLocale = await getInputForLocaleField(
        field,
        expectedLocaleOrCurrency
      );
    }

    expect(allInputs[i]).toBe(inputForLocale);
  }
};

export const getUpdateValue = (localeOrCurrency: string) => {
  let updateValue;
  switch (localeOrCurrency) {
    case "en":
      updateValue = "Hello World";
      break;
    case "zh-Hans":
      updateValue = "你好世界";
      break;
    case "de":
      updateValue = "Hallo Welt";
      break;
    case "USD":
      updateValue = "25.99";
      break;
    case "CNY":
      updateValue = "199.50";
      break;
    case "EUR":
      updateValue = "15.75";
      break;
  }
  return updateValue;
};

export const checkAndUpdateLocaleFieldValue = async (
  field: HTMLElement,
  localeOrCurrency: string,
  currentValue: string,
  placeholderValue?: string,
  type?: string
) => {
  // Check input exists
  const fieldInput =
    type === "richText"
      ? await getRichTextInputForLocaleField(field, localeOrCurrency)
      : await getInputForLocaleField(field, localeOrCurrency);
  // Check input value is correct
  expect(fieldInput).toHaveValue(currentValue);

  // Check that input value can be updated
  const updateValue = getUpdateValue(localeOrCurrency);
  await userEvent.clear(fieldInput!);
  expect(fieldInput).toHaveValue("");
  // Check placeholder
  if (placeholderValue) {
    expect(fieldInput).toHaveAttribute("placeholder", placeholderValue);
  }
  await userEvent.type(fieldInput!, updateValue!);
  expect(fieldInput).toHaveValue(updateValue!);
};

export const checkAndUpdateRichTextLocaleFieldValue = async (
  field: HTMLElement,
  localeOrCurrency: string,
  currentValue: string
) => {
  // Check input exists
  const fieldInput = await getRichTextInputForLocaleField(
    field,
    localeOrCurrency
  );

  // Check input value is correct
  expect(fieldInput).toHaveTextContent(currentValue);
  // Check that input value can be updated
  const updateValue = getUpdateValue(localeOrCurrency);
  // The rich text field -really- hates being updated programatically
  await new Promise((resolve) => setTimeout(resolve, 100));
  fieldInput.focus();
  // Clearing the slate editor and getting the focus element is really annoying, and the richtext stories cover it, so no placeholder tests here
  await userEvent.type(fieldInput!, updateValue!);
  await waitFor(() => expect(fieldInput).toHaveTextContent(updateValue!));
};

export const toggleFieldContolCheckbox = async (
  canvas: BoundFunctions<Queries>,
  type: string,
  control: string
) => {
  const fieldGroup = (await canvas.findByRole("group", {
    name: new RegExp(`${type} group`),
  })) as HTMLElement;
  const accordionButton = await within(fieldGroup).findByRole("button", {
    name: new RegExp(`${type} field controls`),
  });
  // Open the controls
  if (accordionButton.ariaExpanded === "false") {
    await userEvent.click(accordionButton);
  }

  const checkbox = fieldGroup
    .querySelector(`[aria-label="${control}"]`)
    ?.closest("label");
  expect(checkbox).toBeInTheDocument();
  userEvent.click(checkbox!);
};

export const checkFieldDetailsDialog = async (
  field: HTMLElement,
  documentBody: HTMLElement,
  infoBoxValue: string
) => {
  const infoBoxButton = await within(field).getByRole("button", {
    name: "more info",
  });
  await userEvent.click(infoBoxButton);
  await within(documentBody).getByText(infoBoxValue);
  await userEvent.click(documentBody);
};

export const checkFieldDescription = async (
  field: HTMLElement,
  descriptionValue: string
) => {
  const descriptionElement = await within(field).findByText(descriptionValue);
  expect(
    Array.from(field.ariaDescribedByElements!).some(
      (el) => el === descriptionElement
    )
  ).toBe(true);
};

export const checkFieldError = async (
  field: HTMLElement,
  errorValue: string
) => {
  const errorElement = await within(field).findByText(errorValue);
  expect(
    Array.from(field.ariaDescribedByElements!).some((el) => el === errorElement)
  ).toBe(true);
};

export const checkLocaleFieldDescription = async (
  field: HTMLElement,
  localeOrCurrency: string,
  descriptionValue: string
) => {
  const descriptionElement = await within(field).findByText(descriptionValue);
  const localeFieldInput = await getInputForLocaleField(
    field,
    localeOrCurrency
  );
  expect(
    Array.from(localeFieldInput.ariaDescribedByElements!).some(
      (el) => el === descriptionElement
    )
  );
};

export const checkLocaleFieldError = async (
  field: HTMLElement,
  localeOrCurrency: string,
  errorValue: string
) => {
  const errorElement = await within(field).findByText(errorValue);
  const localeFieldInput = await getInputForLocaleField(
    field,
    localeOrCurrency
  );
  expect(localeFieldInput.ariaInvalid).toBe("true");
  expect(
    Array.from(localeFieldInput.ariaDescribedByElements!).some(
      (el) => el === errorElement
    )
  ).toBe(true);
};
