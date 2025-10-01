import type { BoundFunctions, Queries } from "@testing-library/react";
import { expect, userEvent, within, waitFor } from "storybook/test";

// Minimal wrapper that only intervenes for the specific getElementById error
export const withStableDocument = async <T>(
  element: HTMLElement,
  operation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes("getElementById")
    ) {
      // Minimal delay and retry once
      await new Promise((resolve) => setTimeout(resolve, 1));
      return await operation();
    }
    throw error;
  }
};

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

  return await withStableDocument(field, async () => {
    const toggleButton = await within(field).findByRole("button", {
      name: new RegExp(matchString, "i"),
    });
    return toggleButton as HTMLElement;
  });
};

export const toggleExpandField = async (field: HTMLElement, type: string) => {
  const toggleButton = await getExpandButtonForField(field, type);
  await userEvent.click(toggleButton);
};

export const getInputForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) => {
  return await withStableDocument(field, async () => {
    return await within(field).findByRole("textbox", {
      name: new RegExp(localeOrCurrency, "i"),
    });
  });
};

export const getRichTextContainerForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) => {
  // Use CSS selector to find group with ID containing richText.{locale}
  const container = field.querySelector(
    `[role="group"][id*="richText.${localeOrCurrency}"]`
  );
  expect(container).toBeInTheDocument();

  return container as HTMLElement;
};
export const getRichTextInputForLocaleField = async (
  field: HTMLElement,
  localeOrCurrency: string
) => {
  const richTextContainer = await getRichTextContainerForLocaleField(
    field,
    localeOrCurrency
  );

  return await withStableDocument(richTextContainer, async () => {
    return await within(richTextContainer).findByRole("textbox", {
      name: /rich text editor/i,
    });
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

  let i = 0;
  for await (const localeOrCurrency of expectedSortedOrder) {
    let inputForLocale;
    if (type === "richText") {
      inputForLocale = await getRichTextInputForLocaleField(
        field,
        localeOrCurrency
      );
    } else {
      inputForLocale = await getInputForLocaleField(field, localeOrCurrency);
    }

    expect(allInputs[i]).toBe(inputForLocale);
    i++;
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

  // Only wrap the specific part that triggers accessibility computation
  const accordionButton = await withStableDocument(fieldGroup, async () => {
    return await within(fieldGroup).findByRole("button", {
      name: new RegExp(`${type} field controls`),
    });
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

export const closeFieldControls = async (
  canvas: BoundFunctions<Queries>,
  type: string
) => {
  const fieldGroup = (await canvas.findByRole("group", {
    name: new RegExp(`${type} group`),
  })) as HTMLElement;

  // Only wrap the specific part that triggers accessibility computation
  const accordionButton = await withStableDocument(fieldGroup, async () => {
    return await within(fieldGroup).findByRole("button", {
      name: new RegExp(`${type} field controls`),
    });
  });

  // Open the controls
  if (accordionButton.ariaExpanded === "true") {
    await userEvent.click(accordionButton);
  }
};

export const checkFieldItemNotRendered = async (
  field: HTMLElement,
  textValue: string
) => {
  const fieldItem = within(field).queryByText(textValue);
  expect(fieldItem).toBeNull();
};

export const checkFieldDetailsDialog = async (
  field: HTMLElement,
  documentBody: HTMLElement,
  infoBoxValue: string
) => {
  // This function uses simple role queries without name options, no wrapper needed
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
  // Use RegExp for flexible text matching
  const descriptionElement = await within(field).findByText(
    new RegExp(descriptionValue, "i"),
    {},
    { timeout: 3000 }
  );

  // We use `FieldErrors` to display legacy Formik/UI Kit warnings in the description container
  // The `FieldErrors` component adds wrapper divs, which are associated to the description container with aria-labelledby
  // So in order to find the actual container, we need to check if the element with the text value has a parent with a status role
  const descriptionElementForFieldErrors =
    descriptionElement.closest('[role="status"]');
  expect(
    Array.from(field.ariaDescribedByElements!).some(
      (el) => el === (descriptionElementForFieldErrors ?? descriptionElement)
    )
  ).toBe(true);
};

export const checkFieldError = async (
  field: HTMLElement,
  errorValue: string
) => {
  // Wait for error to appear - in CI the error might not be rendered immediately
  const errorElement = await waitFor(
    async () => {
      // Try to find the error text using RegExp for flexible matching
      return await within(field).findByText(
        new RegExp(errorValue, "i"),
        {},
        { timeout: 200 } // Short timeout per attempt
      );
    },
    { timeout: 2000 } // Overall timeout for CI stability
  );

  // We use `FieldErrors` to display legacy Formik/UI Kit warnings in the description container
  // The `FieldErrors` component adds wrapper divs, which are associated to the description container with aria-labelledby
  // So in order to find the actual container, we need to check if the element with the text value has a parent with a status role
  const errorElementForFieldErrors = errorElement.closest('[role="alert"]');
  expect(
    Array.from(field.ariaDescribedByElements!).some(
      (el) => el === (errorElementForFieldErrors ?? errorElement)
    )
  ).toBe(true);
};

export const checkLocaleFieldDescription = async (
  field: HTMLElement,
  localeOrCurrency: string,
  descriptionValue: string,
  type?: string
) => {
  // Use RegExp for flexible text matching
  const descriptionElement = await within(field).findByText(
    new RegExp(descriptionValue, "i"),
    {},
    { timeout: 3000 }
  );

  let localeFieldInput;

  if (type === "richText") {
    localeFieldInput = await getRichTextContainerForLocaleField(
      field,
      localeOrCurrency
    );
  } else {
    localeFieldInput = await getInputForLocaleField(field, localeOrCurrency);
  }
  if (localeFieldInput.ariaDescribedByElements?.length === 0) {
    // The money input is a group, which is where the aria-describedby attribute is set (not the text input)
    localeFieldInput = localeFieldInput.closest("[role='group']");
    expect(localeFieldInput).toBeInTheDocument();
  }

  expect(
    Array.from(localeFieldInput!.ariaDescribedByElements!).some(
      (el) => el === descriptionElement
    )
  );
};

export const checkLocaleFieldError = async (
  field: HTMLElement,
  localeOrCurrency: string,
  errorValue: string,
  type?: string
) => {
  // Wait for error to appear - in CI the error might not be rendered immediately
  const errorElement = await waitFor(
    async () => {
      return await within(field).findByText(
        new RegExp(errorValue, "i"),
        {},
        { timeout: 200 } // Short timeout per attempt
      );
    },
    { timeout: 2000 } // Overall timeout for CI stability
  );

  let localeFieldInput;
  if (type === "richText") {
    localeFieldInput = await getRichTextContainerForLocaleField(
      field,
      localeOrCurrency
    );
    expect(localeFieldInput).toHaveAttribute("data-invalid", "true");
  } else {
    localeFieldInput = await getInputForLocaleField(field, localeOrCurrency);
    expect(localeFieldInput.ariaInvalid).toBe("true");
  }

  if (localeFieldInput.ariaDescribedByElements?.length === 0) {
    // The money input is a group, which is where the aria-describedby attribute is set (not the text input)
    localeFieldInput = localeFieldInput.closest("[role='group']");
    expect(localeFieldInput).toBeInTheDocument();
  }

  expect(
    Array.from(localeFieldInput!.ariaDescribedByElements!).some(
      (el) => el === errorElement
    )
  ).toBe(true);
};

export const checkAllFieldItemsNotRendered = async (
  field: HTMLElement,
  legacyValue: string,
  baseValue?: string
) => {
  const fieldItemValues = [legacyValue, baseValue];
  for await (const value of fieldItemValues) {
    if (value) {
      expect(typeof value).toEqual("string");
      await checkFieldItemNotRendered(field, value ?? "");
    }
  }
};
