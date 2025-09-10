// TODO: remove this once out of dev
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocalizedField, type LocalizedFieldChangeEvent } from "./index";
import {
  baseValues,
  baseDescriptions,
  baseErrors,
  basePlaceholders,
  baseWarnings,
} from "./test-data";

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
    const [localeValues, setLocaleValues] = useState(baseValues);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      const newValue = e.target.locale
        ? { [String(e.target.locale)]: e.target.value }
        : e.target.currency
          ? {
              [String(e.target.currency)]: {
                currencyCode: e.target.currency,
                amount: e.target.value,
              },
            }
          : undefined;
      setLocaleValues({
        ...localeValues,
        ...newValue,
      });
    };
    return (
      <LocalizedField
        autoFocus={true}
        name="localize greetings"
        id="greetingsfield"
        defaultLocaleOrCurrency="en"
        touched={touched}
        onChange={handleSetLocalizedValue}
        onFocus={() => setTouched(true)}
        valuesByLocaleOrCurrency={localeValues}
        placeholdersByLocaleOrCurrency={basePlaceholders}
        // descriptionsByLocaleOrCurrency={baseDescriptions}
        errorsByLocaleOrCurrency={baseErrors}
        // warningsByLocaleOrCurrency={baseWarnings}
        label="greetings"
        hint="its a greeting"
        description="a polite word or sign of welcome or recognition."
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};

export const MultiLine: Story = {
  render: () => {
    const [localeValues, setLocaleValues] = useState(baseValues);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      const newValue = e.target.locale
        ? { [String(e.target.locale)]: e.target.value }
        : e.target.currency
          ? {
              [String(e.target.currency)]: {
                currencyCode: e.target.currency,
                amount: e.target.value,
              },
            }
          : undefined;
      setLocaleValues({
        ...localeValues,
        ...newValue,
      });
    };
    return (
      <LocalizedField
        type="multiLine"
        name="localize greetings"
        id="greetingsfield"
        defaultLocaleOrCurrency="en"
        touched={touched}
        onChange={handleSetLocalizedValue}
        onFocus={() => setTouched(true)}
        valuesByLocaleOrCurrency={localeValues}
        placeholdersByLocaleOrCurrency={basePlaceholders}
        // descriptionsByLocaleOrCurrency={baseDescriptions}
        errorsByLocaleOrCurrency={baseErrors}
        // warningsByLocaleOrCurrency={baseWarnings}
        label="greetings"
        hint="its a greeting"
        description="a polite word or sign of welcome or recognition."
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};

export const Money: Story = {
  render: () => {
    const [localeValues, setLocaleValues] = useState(baseValues);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      const newValue = e.target.locale
        ? { [String(e.target.locale)]: e.target.value }
        : e.target.currency
          ? {
              [String(e.target.currency)]: {
                currencyCode: e.target.currency,
                amount: e.target.value,
              },
            }
          : undefined;
      setLocaleValues({
        ...localeValues,
        ...newValue,
      });
    };
    return (
      <LocalizedField
        type="money"
        name="localize greetings"
        id="greetingsfield"
        defaultLocaleOrCurrency="en"
        touched={touched}
        onChange={handleSetLocalizedValue}
        onFocus={() => setTouched(true)}
        valuesByLocaleOrCurrency={localeValues}
        placeholdersByLocaleOrCurrency={basePlaceholders}
        // descriptionsByLocaleOrCurrency={baseDescriptions}
        errorsByLocaleOrCurrency={baseErrors}
        // warningsByLocaleOrCurrency={baseWarnings}
        label="greetings"
        hint="its a greeting"
        description="a polite word or sign of welcome or recognition."
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};

export const RichText: Story = {
  render: () => {
    const [localeValues, setLocaleValues] = useState(baseValues);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      const newValue = e.target.locale
        ? { [String(e.target.locale)]: e.target.value }
        : e.target.currency
          ? {
              [String(e.target.currency)]: {
                currencyCode: e.target.currency,
                amount: e.target.value,
              },
            }
          : undefined;
      setLocaleValues({
        ...localeValues,
        ...newValue,
      });
    };
    return (
      <LocalizedField
        type="richText"
        name="localize greetings"
        id="greetingsfield"
        defaultLocaleOrCurrency="en"
        touched={touched}
        onChange={handleSetLocalizedValue}
        onFocus={() => setTouched(true)}
        valuesByLocaleOrCurrency={localeValues}
        placeholdersByLocaleOrCurrency={basePlaceholders}
        // descriptionsByLocaleOrCurrency={baseDescriptions}
        errorsByLocaleOrCurrency={baseErrors}
        // warningsByLocaleOrCurrency={baseWarnings}
        label="greetings"
        hint="its a greeting"
        description="a polite word or sign of welcome or recognition."
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};
