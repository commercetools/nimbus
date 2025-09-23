import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "storybook/test";
import type { TValue } from "@/components";
import { LocalizedField } from "./index";
import { baseStoryProps, baseLocales, baseCurrencies } from "./utils/test-data";
import {
  checkFieldIsCollapsed,
  getFieldContainerForType,
  toggleExpandField,
  checkFieldIsExpanded,
  checkAndUpdateLocaleFieldValue,
  checkAndUpdateRichTextLocaleFieldValue,
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
            // Disable the aria-allowed-attr rule for external toggle button components
            id: "aria-allowed-attr",
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
    const textField = await getFieldContainerForType(canvas, "text");
    await step("Text Field", async () => {
      await step(
        "Field mounts in a collapsed state by default",
        async () => await checkFieldIsCollapsed(textField, "text", "en")
      );
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
    const multiLineField = await getFieldContainerForType(canvas, "multiLine");
    await step("MultiLine Field", async () => {
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
    const richTextField = await getFieldContainerForType(canvas, "richText");
    await step("RichText Field", async () => {
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
    const moneyField = await getFieldContainerForType(canvas, "money");
    await step("Money Field", async () => {
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
