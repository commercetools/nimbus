import type { BoundFunctions, Queries } from "@testing-library/react";
import { expect, userEvent, within } from "storybook/test";

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

export const getRichTextInputForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) => {
  const richTextContainer = await within(field).findByRole("group", {
    name: new RegExp(localeOrCurrency, "i"),
  });
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
  // Check that there is a single visible within the field
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
  // Clearing the slate editor and getting the focus element is really annoying, and the richtext stories cover it, so no placeholder tests here
  await userEvent.type(fieldInput!, updateValue!);
  expect(fieldInput).toHaveTextContent(updateValue!);
};
