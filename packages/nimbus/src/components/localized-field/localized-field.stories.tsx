import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { Stack, Text, type TValue } from "@/components";
import { LocalizedField } from "./index";
import {
  baseLocales,
  baseCurrencies,
  baseContextFields,
  baseMoneyContextFields,
  baseStoryProps,
  emptyValuesStoryProps,
  singleValueStoryProps,
  hintStoryProps,
} from "./utils/test-data";
import {
  checkFieldIsCollapsed,
  getFieldContainerForType,
  getInputForLocaleField,
  getRichTextContainerForLocaleField,
  getRichTextInputForLocaleField,
  getExpandButtonForField,
  toggleExpandField,
  checkFieldIsExpanded,
  checkAndUpdateLocaleFieldValue,
  checkAndUpdateRichTextLocaleFieldValue,
  checkFieldDetailsDialog,
  // toggleFieldContolCheckbox,
  // checkFieldDescription,
  // checkFieldError,
  // checkLocaleFieldDescription,
  // checkLocaleFieldError,
} from "./utils/test-utils";
import { LocalizedFieldStoryComponent } from "./utils/localized-field.story-component";

const meta: Meta<typeof LocalizedField> = {
  title: "components/LocalizedField",
  component: LocalizedField,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Disable the aria-allowed-attr rule for external toggle button components in rich text editor
            id: "aria-allowed-attr",
            enabled: false,
          },
          {
            // Disable color-contrast rule for disabled states and external components in rich text editor
            id: "color-contrast",
            enabled: false,
          },
        ],
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof LocalizedField>;

export const Base: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...baseStoryProps} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step(
        "Field mounts in a collapsed state by default",
        async () => await checkFieldIsCollapsed(textField, "text", "en")
      );
      await step("Field displays details dialog", async () => {});

      await step("Field expands to display multiple locales", async () => {
        await toggleExpandField(textField, "text");
        await checkFieldIsExpanded(textField, "text", baseLocales, "en");
      });
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          for await (const locale of baseLocales) {
            const currentValue = baseStoryProps.text.fieldData.values[
              locale
            ] as string;
            const placeholderValue =
              baseStoryProps.text.fieldData.placeholders?.[locale];
            await checkAndUpdateLocaleFieldValue(
              textField,
              locale,
              currentValue,
              placeholderValue
            );
          }
        }
      );
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step(
        "Field mounts in a collapsed state by default",
        async () =>
          await checkFieldIsCollapsed(multiLineField, "multiLine", "en")
      );
      await step("Field expands to display multiple locales", async () => {
        await toggleExpandField(multiLineField, "multiLine");
        await checkFieldIsExpanded(
          multiLineField,
          "multiLine",
          baseLocales,
          "en"
        );
      });
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          for await (const locale of baseLocales) {
            const currentValue = baseStoryProps.multiLine.fieldData.values[
              locale
            ] as string;
            const placeholderValue =
              baseStoryProps.multiLine.fieldData.placeholders?.[locale];
            await checkAndUpdateLocaleFieldValue(
              multiLineField,
              locale,
              currentValue,
              placeholderValue
            );
          }
        }
      );
    });

    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step(
        "Field mounts in a collapsed state by default",
        async () => await checkFieldIsCollapsed(richTextField, "richText", "en")
      );
      await step("Field expands to display multiple locales", async () => {
        await toggleExpandField(richTextField, "richText");
        await checkFieldIsExpanded(
          richTextField,
          "richText",
          baseLocales,
          "en"
        );
      });
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          for await (const locale of baseLocales) {
            const currentValue = baseStoryProps.richText.fieldData.values[
              locale
            ] as string;
            await checkAndUpdateRichTextLocaleFieldValue(
              richTextField,
              locale,
              currentValue
            );
          }
        }
      );
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step(
        "Field mounts in a collapsed state by default",
        async () => await checkFieldIsCollapsed(moneyField, "money", "USD")
      );
      await step("Field expands to display multiple locales", async () => {
        await toggleExpandField(moneyField, "money");
        await checkFieldIsExpanded(moneyField, "money", baseCurrencies, "USD");
      });
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          for await (const currency of baseCurrencies) {
            const currentValue = (
              baseStoryProps.money.fieldData.values[currency] as TValue
            ).amount;
            const placeholderValue =
              baseStoryProps.money.fieldData.placeholders?.[currency];
            await checkAndUpdateLocaleFieldValue(
              moneyField,
              currency,
              currentValue,
              placeholderValue
            );
          }
        }
      );
    });
    await step("Field Expansion and Collapse", async () => {});
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <Stack gap="500">
        <Stack>
          <Text as="h2" fontWeight="500">
            Size Medium (default)
          </Text>
          <LocalizedFieldStoryComponent {...baseStoryProps} />
        </Stack>
        <Stack>
          <Text as="h2" fontWeight="500">
            Size Small
          </Text>
          <LocalizedFieldStoryComponent {...baseStoryProps} size="sm" />
        </Stack>
      </Stack>
    );
  },
};

export const Required: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...baseStoryProps} isRequired />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step("Field label should indicate required field", async () => {
        expect(textField.querySelector("sup")).toBeInTheDocument();
      });
      await step(
        "Locale fields should have aria-required attribute",
        async () => {
          await toggleExpandField(textField, "text");
          for await (const locale of baseLocales) {
            const localeField = await getInputForLocaleField(textField, locale);
            expect(localeField).toHaveAttribute("aria-required");
          }
        }
      );
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step("Field label should indicate required field", async () => {
        expect(multiLineField.querySelector("sup")).toBeInTheDocument();
      });
      await step(
        "Locale fields should have aria-required attribute",
        async () => {
          await toggleExpandField(multiLineField, "multiLine");
          for await (const locale of baseLocales) {
            const localeField = await getInputForLocaleField(
              multiLineField,
              locale
            );
            expect(localeField).toHaveAttribute("aria-required");
          }
        }
      );
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step("Field label should indicate required field", async () => {
        expect(richTextField.querySelector("sup")).toBeInTheDocument();
      });
      await step(
        "Locale fields should have aria-required attribute",
        async () => {
          await toggleExpandField(richTextField, "richText");
          for await (const locale of baseLocales) {
            const richTextContainer = await getRichTextContainerForLocaleField(
              richTextField,
              locale
            );
            expect(richTextContainer).toHaveAttribute("aria-required");
          }
        }
      );
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step("Field label should indicate required field", async () => {
        expect(moneyField.querySelector("sup")).toBeInTheDocument();
      });
      await step(
        "Locale fields should have aria-required attribute",
        async () => {
          await toggleExpandField(moneyField, "money");
          for await (const currency of baseCurrencies) {
            const currencyField = await getInputForLocaleField(
              moneyField,
              currency
            );
            expect(currencyField).toHaveAttribute("aria-required");
          }
        }
      );
    });
  },
};

export const Disabled: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...baseStoryProps} isDisabled />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step("Field toggle button is disabled", async () => {
        const toggleButton = await getExpandButtonForField(textField, "text");
        expect(toggleButton).toHaveAttribute("aria-disabled", "true");
      });
      await step(
        "Field toggle does not expand field when pressed",
        async () => {
          await toggleExpandField(textField, "text");
          await checkFieldIsCollapsed(textField, "text", "en");
        }
      );
      await step("Locale field has aria-disabled element", async () => {
        const localeField = await getInputForLocaleField(textField, "en");
        expect(localeField).toHaveAttribute("disabled");
      });
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step("Field toggle button is disabled", async () => {
        const toggleButton = await getExpandButtonForField(
          multiLineField,
          "multiLine"
        );
        expect(toggleButton).toHaveAttribute("aria-disabled", "true");
      });
      await step(
        "Field toggle does not expand field when pressed",
        async () => {
          await toggleExpandField(multiLineField, "multiLine");
          await checkFieldIsCollapsed(multiLineField, "multiLine", "en");
        }
      );
      await step("Locale field has aria-disabled element", async () => {
        const localeField = await getInputForLocaleField(multiLineField, "en");
        expect(localeField).toHaveAttribute("disabled");
      });
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step("Field toggle button is disabled", async () => {
        const toggleButton = await getExpandButtonForField(
          richTextField,
          "richText"
        );
        expect(toggleButton).toHaveAttribute("aria-disabled", "true");
      });
      await step(
        "Field toggle does not expand field when pressed",
        async () => {
          await toggleExpandField(richTextField, "richText");
          await checkFieldIsCollapsed(richTextField, "richText", "en");
        }
      );
      await step("Locale field has aria-disabled element", async () => {
        const richTextContainer = await getRichTextContainerForLocaleField(
          richTextField,
          "en"
        );
        expect(richTextContainer).toHaveAttribute("data-disabled", "true");
      });
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step("Field toggle button is disabled", async () => {
        const toggleButton = await getExpandButtonForField(moneyField, "money");
        expect(toggleButton).toHaveAttribute("aria-disabled", "true");
      });
      await step(
        "Field toggle does not expand field when pressed",
        async () => {
          await toggleExpandField(moneyField, "money");
          await checkFieldIsCollapsed(moneyField, "money", "USD");
        }
      );
      await step("Locale field has aria-disabled element", async () => {
        const localeField = await getInputForLocaleField(moneyField, "USD");
        expect(localeField).toHaveAttribute("disabled");
      });
    });
  },
};

export const ReadOnly: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...baseStoryProps} isReadOnly />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step("Locale fields should have readonly attribute", async () => {
        await toggleExpandField(textField, "text");
        for await (const locale of baseLocales) {
          const localeField = await getInputForLocaleField(textField, locale);
          expect(localeField).toHaveAttribute("readonly");
        }
      });
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step("Locale fields should have readonly attribute", async () => {
        await toggleExpandField(multiLineField, "multiLine");
        for await (const locale of baseLocales) {
          const localeField = await getInputForLocaleField(
            multiLineField,
            locale
          );
          expect(localeField).toHaveAttribute("readonly");
        }
      });
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");

      await step(
        "Locale fields should have data-readonly attribute",
        async () => {
          await toggleExpandField(richTextField, "richText");
          for await (const locale of baseLocales) {
            const richTextContainer = await getRichTextContainerForLocaleField(
              richTextField,
              locale
            );
            expect(richTextContainer).toHaveAttribute("data-readonly");
          }
        }
      );
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");

      await step("Locale fields should have readonly attribute", async () => {
        await toggleExpandField(moneyField, "money");
        for await (const currency of baseCurrencies) {
          const currencyField = await getInputForLocaleField(
            moneyField,
            currency
          );
          expect(currencyField).toHaveAttribute("readonly");
        }
      });
    });
  },
};

export const EmptyValues: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...emptyValuesStoryProps} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          await toggleExpandField(textField, "text");
          for await (const locale of baseLocales) {
            const placeholderValue =
              baseStoryProps.text.fieldData.placeholders?.[locale];
            await checkAndUpdateLocaleFieldValue(
              textField,
              locale,
              "",
              placeholderValue
            );
          }
        }
      );
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          await toggleExpandField(multiLineField, "multiLine");
          for await (const locale of baseLocales) {
            const placeholderValue =
              baseStoryProps.multiLine.fieldData.placeholders?.[locale];
            await checkAndUpdateLocaleFieldValue(
              multiLineField,
              locale,
              "",
              placeholderValue
            );
          }
        }
      );
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          await toggleExpandField(richTextField, "richText");
          for await (const locale of baseLocales) {
            const currentValue =
              baseStoryProps.richText.fieldData.placeholders?.[locale];
            await checkAndUpdateRichTextLocaleFieldValue(
              richTextField,
              locale,
              currentValue!
            );
          }
        }
      );
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step(
        "Field supports displaying and updating multiple locales",
        async () => {
          await toggleExpandField(moneyField, "money");
          for await (const currency of baseCurrencies) {
            const placeholderValue =
              baseStoryProps.multiLine.fieldData.placeholders?.[currency];
            await checkAndUpdateLocaleFieldValue(
              moneyField,
              currency,
              "",
              placeholderValue
            );
          }
        }
      );
    });
  },
};

export const SingleLocaleOrCurrency: Story = {
  render: () => {
    // @ts-expect-error fuck off ts
    return <LocalizedFieldStoryComponent {...singleValueStoryProps} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step("Field displays expected input", async () => {
        // Check that there is a single input visible within the field
        const allInputs = await within(textField).findAllByRole("textbox");
        expect(allInputs.length).toBe(1);
        // And that the input is the one expected
        await getInputForLocaleField(textField, "en");
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(textField).queryByRole("button", {
          name: /all languages/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step("Field displays expected input", async () => {
        // Check that there is a single input visible within the field
        const allInputs = await within(multiLineField).findAllByRole("textbox");
        expect(allInputs.length).toBe(1);
        // And that the input is the one expected
        await getInputForLocaleField(multiLineField, "en");
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(multiLineField).queryByRole(
          "button",
          {
            name: /all languages/i,
          }
        );
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step("Field displays expected input", async () => {
        // Check that there is a single input visible within the field
        const allInputs = await within(richTextField).findAllByRole("textbox");
        expect(allInputs.length).toBe(1);
        // And that the input is the one expected
        await getRichTextInputForLocaleField(richTextField, "en");
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(richTextField).queryByRole("button", {
          name: /all languages/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step("Field displays expected input", async () => {
        // Check that there is a single input visible within the field
        const allInputs = await within(moneyField).findAllByRole("textbox");
        expect(allInputs.length).toBe(1);
        // And that the input is the one expected
        await getInputForLocaleField(moneyField, "USD");
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(moneyField).queryByRole("button", {
          name: /all currencies/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
  },
};

export const DefaultExpanded: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...baseStoryProps} defaultExpanded />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      step("Field is expanded on mount", async () => {
        await checkFieldIsExpanded(textField, "text", baseLocales, "en");
      });
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      step("Field is expanded on mount", async () => {
        await checkFieldIsExpanded(
          multiLineField,
          "multiLine",
          baseLocales,
          "en"
        );
      });
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      step("Field is expanded on mount", async () => {
        await checkFieldIsExpanded(
          richTextField,
          "richText",
          baseLocales,
          "en"
        );
      });
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      step("Field is expanded on mount", async () => {
        await checkFieldIsExpanded(moneyField, "money", baseCurrencies, "USD");
      });
    });
  },
};

export const DisplayAllLocalesOrCurrencies: Story = {
  render: () => {
    return (
      <LocalizedFieldStoryComponent
        {...baseStoryProps}
        displayAllLocalesOrCurrencies
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step("Field displays expected inputs", async () => {
        // Check that the expected inputs are visible within the field
        for await (const locale of baseLocales) {
          await getInputForLocaleField(textField, locale);
        }
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(textField).queryByRole("button", {
          name: /all languages/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step("Field displays expected input", async () => {
        // Check that the expected inputs are visible within the field
        for await (const locale of baseLocales) {
          await getInputForLocaleField(multiLineField, locale);
        }
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(multiLineField).queryByRole(
          "button",
          {
            name: /all languages/i,
          }
        );
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step("Field displays expected input", async () => {
        // Check that the expected inputs are visible within the field
        for await (const locale of baseLocales) {
          await getRichTextInputForLocaleField(richTextField, locale);
        }
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(richTextField).queryByRole("button", {
          name: /all languages/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step("Field displays expected input", async () => {
        // Check that the expected inputs are visible within the field
        for await (const currency of baseCurrencies) {
          await getInputForLocaleField(moneyField, currency);
        }
      });
      await step("Toggle expand button is not displayed", async () => {
        const toggleButton = await within(moneyField).queryByRole("button", {
          name: /all currencies/i,
        });
        expect(toggleButton).not.toBeInTheDocument();
      });
    });
  },
};

export const HintDialog: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...hintStoryProps} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Text Field", async () => {
      const textField = await getFieldContainerForType(canvas, "text");
      await step(
        "Hint dialog button displays dialog with correct value when pressed",
        async () => {
          await checkFieldDetailsDialog(
            textField,
            document.body,
            baseContextFields.hint
          );
        }
      );
    });
    await step("MultiLine Field", async () => {
      const multiLineField = await getFieldContainerForType(
        canvas,
        "multiLine"
      );
      await step(
        "Hint dialog button displays dialog with correct value when pressed",
        async () => {
          await checkFieldDetailsDialog(
            multiLineField,
            document.body,
            baseContextFields.hint
          );
        }
      );
    });
    await step("RichText Field", async () => {
      const richTextField = await getFieldContainerForType(canvas, "richText");
      await step(
        "Hint dialog button displays dialog with correct value when pressed",
        async () => {
          await checkFieldDetailsDialog(
            richTextField,
            document.body,
            baseContextFields.hint
          );
        }
      );
    });
    await step("Money Field", async () => {
      const moneyField = await getFieldContainerForType(canvas, "money");
      await step(
        "Hint dialog button displays dialog with correct value when pressed",
        async () => {
          await checkFieldDetailsDialog(
            moneyField,
            document.body,
            baseMoneyContextFields.hint
          );
        }
      );
    });
  },
};

export const DescriptionsAndWarnings: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...emptyValuesStoryProps} />;
  },
  // play: async ({ canvasElement, step }) => {
  //   const canvas = within(canvasElement);
  //   await step("Text Field", async () => {
  //     const textField = await getFieldContainerForType(canvas, "text");
  //     // await step("Field displays description", async () => {
  //     //   await toggleFieldContolCheckbox(canvas, "text", "Show Description");
  //     //   await checkFieldDescription(textField, baseContextFields.description);
  //     // });
  //   });
  //   await step("MultiLine Field", async () => {
  //     const multiLineField = await getFieldContainerForType(
  //       canvas,
  //       "multiLine"
  //     );
  //   });
  //   await step("RichText Field", async () => {
  //     const richTextField = await getFieldContainerForType(canvas, "richText");
  //   });
  //   await step("Money Field", async () => {
  //     const moneyField = await getFieldContainerForType(canvas, "money");
  //   });
  // },
};

export const ErrorsAndValidation: Story = {
  render: () => {
    return <LocalizedFieldStoryComponent {...emptyValuesStoryProps} />;
  },
  // play: async ({ canvasElement, step }) => {
  //   const canvas = within(canvasElement);
  //   await step("Text Field", async () => {
  //     const textField = await getFieldContainerForType(canvas, "text");
  //   });
  //   await step("MultiLine Field", async () => {
  //     const multiLineField = await getFieldContainerForType(
  //       canvas,
  //       "multiLine"
  //     );
  //   });
  //   await step("RichText Field", async () => {
  //     const richTextField = await getFieldContainerForType(canvas, "richText");
  //   });
  //   await step("Money Field", async () => {
  //     const moneyField = await getFieldContainerForType(canvas, "money");
  //   });
  // },
};
