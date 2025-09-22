// TODO: remove this once out of dev
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocalizedField, type LocalizedFieldChangeEvent } from "./index";
import { baseStoryProps } from "./utils/test-data";
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
};

// export const MultiLine: Story = {
//   render: () => {
//     const [localeValues, setLocaleValues] = useState(baseLocaleData.values);
//     const [touched, setTouched] = useState(false);
//     const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
//       setTouched(true);
//       setLocaleValues({
//         ...localeValues,
//         [String(e.target.locale)]: e.target.value,
//       });
//     };
//     return (
//       <LocalizedField
//         type="multiLine"
//         name="localize greetings"
//         id="greetingsfield"
//         defaultLocaleOrCurrency="en"
//         touched={touched}
//         onChange={handleSetLocalizedValue}
//         onFocus={() => setTouched(true)}
//         valuesByLocaleOrCurrency={localeValues}
//         placeholdersByLocaleOrCurrency={baseLocaleData.placeholders}
//         // descriptionsByLocaleOrCurrency={baseLocaleData.descriptions}
//         errorsByLocaleOrCurrency={baseLocaleData.errors}
//         // warningsByLocaleOrCurrency={baseLocaleData.warnings}
//         // warningsByLocaleOrCurrency={baseWarnings}
//         label="greetings"
//         hint="its a greeting"
//         description="a polite word or sign of welcome or recognition."
//         // warning="youve been warned"
//         // error="youre wrong"
//       />
//     );
//   },
// };

// export const RichText: Story = {
//   render: () => {
//     const [localeValues, setLocaleValues] = useState(baseLocaleData.values);
//     const [touched, setTouched] = useState(false);
//     const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
//       setTouched(true);
//       setLocaleValues({
//         ...localeValues,
//         [String(e.target.locale)]: e.target.value,
//       });
//     };
//     return (
//       <LocalizedField
//         type="richText"
//         name="localize greetings"
//         id="greetingsfield"
//         defaultLocaleOrCurrency="en"
//         touched={touched}
//         onChange={handleSetLocalizedValue}
//         onFocus={() => setTouched(true)}
//         valuesByLocaleOrCurrency={localeValues}
//         placeholdersByLocaleOrCurrency={baseLocaleData.placeholders}
//         // descriptionsByLocaleOrCurrency={baseLocaleData.descriptions}
//         errorsByLocaleOrCurrency={baseLocaleData.errors}
//         // warningsByLocaleOrCurrency={baseLocaleData.warnings}
//         // warningsByLocaleOrCurrency={baseWarnings}
//         label="greetings"
//         hint="its a greeting"
//         description="a polite word or sign of welcome or recognition."
//         // warning="youve been warned"
//         // error="youre wrong"
//       />
//     );
//   },
// };

// export const Money: Story = {
//   render: () => {
//     const [currencyValues, setCurrencyValues] = useState(
//       baseCurrencyData.values
//     );
//     const [touched, setTouched] = useState(false);
//     const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
//       console.log(e);
//       setTouched(true);
//       setCurrencyValues({
//         ...currencyValues,
//         [String(e.target.currency)]: {
//           currencyCode: e.target.currency,
//           amount: e.target.value,
//         },
//       });
//     };
//     return (
//       <LocalizedField
//         type="money"
//         name="localize product price"
//         id="productPriceField"
//         defaultLocaleOrCurrency="EUR"
//         touched={touched}
//         onChange={handleSetLocalizedValue}
//         onFocus={() => setTouched(true)}
//         valuesByLocaleOrCurrency={currencyValues}
//         placeholdersByLocaleOrCurrency={baseCurrencyData.placeholders}
//         descriptionsByLocaleOrCurrency={baseCurrencyData.descriptions}
//         // errorsByLocaleOrCurrency={baseCurrencyData.errors}
//         // warningsByLocaleOrCurrency={baseCurrencyData.warnings}
//         label="Price"
//         hint="whatever price you want this product to have, enter it here"
//         description="Price of the product"
//         // warning="youve been warned"
//         // error="that value is wrong"
//       />
//     );
//   },
// };
