// TODO: remove this once out of dev
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocalizedField } from "./index";
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
};

export default meta;

type Story = StoryObj<typeof LocalizedField>;

export const Base: Story = {
  render: () => {
    const [localeValues, setLocaleValues] = useState(baseValues);
    const handleSetLocaleValue = (value: string | number, locale: string) => {
      setLocaleValues({ ...localeValues, [locale]: value });
    };
    return (
      <LocalizedField
        name="localize greetings"
        defaultLocale="en"
        onChange={handleSetLocaleValue}
        valuesByLocale={localeValues}
        // descriptionsByLocale={baseDescriptions}
        placeholdersByLocale={basePlaceholders}
        errorsByLocale={baseErrors}
        // warningsByLocale={baseWarnings}
        label="greetings"
        hint="its a greeting"
        description="a polite word or sign of welcome or recognition."
        // size="sm"
        type="richText"
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};
