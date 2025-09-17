// TODO: remove this once out of dev

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { LocalizedField, type LocalizedFieldChangeEvent } from "./index";
import { baseLocaleData, baseCurrencyData } from "./test-data";
import { Box, Button } from "@/components";

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
    const [localeValues, setLocaleValues] = useState(baseLocaleData.values);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      setLocaleValues({
        ...localeValues,
        [String(e.target.locale)]: e.target.value,
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
        placeholdersByLocaleOrCurrency={baseLocaleData.placeholders}
        // descriptionsByLocaleOrCurrency={baseLocaleData.descriptions}
        errorMessagesByLocaleOrCurrency={baseLocaleData.errors}
        // warningsByLocaleOrCurrency={baseLocaleData.warnings}
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
    const [localeValues, setLocaleValues] = useState(baseLocaleData.values);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      setLocaleValues({
        ...localeValues,
        [String(e.target.locale)]: e.target.value,
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
        placeholdersByLocaleOrCurrency={baseLocaleData.placeholders}
        // descriptionsByLocaleOrCurrency={baseLocaleData.descriptions}
        errorMessagesByLocaleOrCurrency={baseLocaleData.errors}
        // warningsByLocaleOrCurrency={baseLocaleData.warnings}
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
    const [localeValues, setLocaleValues] = useState(baseLocaleData.values);
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      setTouched(true);
      setLocaleValues({
        ...localeValues,
        [String(e.target.locale)]: e.target.value,
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
        placeholdersByLocaleOrCurrency={baseLocaleData.placeholders}
        // descriptionsByLocaleOrCurrency={baseLocaleData.descriptions}
        errorMessagesByLocaleOrCurrency={baseLocaleData.errors}
        // warningsByLocaleOrCurrency={baseLocaleData.warnings}
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
    const [currencyValues, setCurrencyValues] = useState(
      baseCurrencyData.values
    );
    const [touched, setTouched] = useState(false);
    const handleSetLocalizedValue = (e: LocalizedFieldChangeEvent) => {
      console.log(e);
      setTouched(true);
      setCurrencyValues({
        ...currencyValues,
        [String(e.target.currency)]: {
          currencyCode: e.target.currency,
          amount: e.target.value,
        },
      });
    };
    return (
      <LocalizedField
        type="money"
        name="localize product price"
        id="productPriceField"
        defaultLocaleOrCurrency="EUR"
        touched={touched}
        onChange={handleSetLocalizedValue}
        onFocus={() => setTouched(true)}
        valuesByLocaleOrCurrency={currencyValues}
        placeholdersByLocaleOrCurrency={baseCurrencyData.placeholders}
        // descriptionsByLocaleOrCurrency={baseCurrencyData.descriptions}
        // errorsByLocaleOrCurrency={baseCurrencyData.errors}
        // warningsByLocaleOrCurrency={baseCurrencyData.warnings}
        label="Price"
        hint="whatever price you want this product to have, enter it here"
        description="Price of the product"
        // warning="youve been warned"
        // error="youre wrong"
      />
    );
  },
};

// === NEW: FIELDERRORS INTEGRATION STORIES ===

export const FormikIntegration: Story = {
  render: () => {
    return (
      <Box>
        <h3>Formik Integration (UI-Kit Compatible)</h3>
        <LocalizedField
          label="Product Name"
          name="productName"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{ en: "ABC Inc", de: "", fr: "A" }}
          onChange={() => {}}
          touched={true}
          // Global validation flags (from formik.errors)
          errors={{ invalid: true }}
          // Per-locale validation flags (from formik.errors.fieldName)
          errorsByLocaleOrCurrency={{
            en: { duplicate: true }, // English has duplicate issue
            de: { missing: true }, // German is required
            fr: { min: true }, // French too short
          }}
          customMessages={{
            invalid: "Product name contains invalid characters",
            duplicate: "Product name already exists",
            missing: "Required for this market",
            min: "Must be at least 2 characters",
          }}
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test global error is displayed
    await expect(
      canvas.getByText("Product name contains invalid characters")
    ).toBeInTheDocument();

    // Test per-locale errors are displayed for all locales
    await expect(
      canvas.getByText("Product name already exists")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Required for this market")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Must be at least 2 characters")
    ).toBeInTheDocument();
  },
};

export const HybridApproach: Story = {
  render: () => {
    const errors = { missing: true, invalid: false };

    return (
      <Box>
        <h3>Hybrid Approach - Standard + Business Rule Overrides</h3>
        <LocalizedField
          label="VAT Number"
          name="vatNumber"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{ en: "", de: "", us: "" }}
          onChange={() => {}}
          // Standard validation flags (processed by FieldErrors)
          errors={errors}
          touched={true}
          // Per-locale business rule overrides using direct messages
          errorMessagesByLocaleOrCurrency={{
            de: errors.missing
              ? "VAT-Nummer ist in Deutschland erforderlich"
              : undefined,
            us: errors.missing ? "Tax ID is optional in the US" : undefined,
            // 'en' falls back to FieldErrors processing -> "This field is required"
          }}
          customMessages={{
            missing: "This field is required",
          }}
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test global error shows for default locale (en)
    await expect(
      canvas.getByText("This field is required")
    ).toBeInTheDocument();

    // Test per-locale overrides show
    await expect(
      canvas.getByText("VAT-Nummer ist in Deutschland erforderlich")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Tax ID is optional in the US")
    ).toBeInTheDocument();
  },
};

export const FrameworkAgnostic: Story = {
  render: () => {
    const [serverErrors, setServerErrors] = useState({
      en: "Product name conflicts with existing SKU #12345",
      de: "Produktname steht im Konflikt mit vorhandener SKU #12345",
      fr: "Le nom du produit entre en conflit avec le SKU #12345 existant",
    });

    const simulateServerValidation = () => {
      // Simulate server response with localized error messages
      setServerErrors({
        en: `Server error at ${new Date().toLocaleTimeString()}`,
        de: `Server-Fehler um ${new Date().toLocaleTimeString()}`,
        fr: `Erreur serveur à ${new Date().toLocaleTimeString()}`,
      });
    };

    return (
      <Box>
        <h3>Framework Agnostic - Server Validation</h3>
        <LocalizedField
          label="Product Name"
          name="productName"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{
            en: "Conflicting Product",
            de: "Konfliktprodukt",
            fr: "Produit en conflit",
          }}
          onChange={() => {}}
          // Direct server-provided messages per locale using direct messages
          errorMessagesByLocaleOrCurrency={serverErrors}
          error="Multiple validation errors detected"
        />
        <Button onClick={simulateServerValidation} mt="4">
          Simulate Server Validation
        </Button>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test per-locale server errors are displayed (global error is overridden by per-locale errors)
    await expect(
      canvas.getByText("Product name conflicts with existing SKU #12345")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        "Produktname steht im Konflikt mit vorhandener SKU #12345"
      )
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(
        "Le nom du produit entre en conflit avec le SKU #12345 existant"
      )
    ).toBeInTheDocument();
    // Test global error is shown
    await expect(
      canvas.getByText("Multiple validation errors detected")
    ).toBeInTheDocument();
  },
};

// === NEW: PER-LOCALE VALIDATION FLAGS EXAMPLES ===

export const PerLocaleValidationFlags: Story = {
  render: () => {
    return (
      <Box>
        <h3>Per-Locale Validation Flags (NEW)</h3>
        <LocalizedField
          label="Product Name"
          name="productName"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{
            en: "A",
            de: "",
            fr: "Super long product name that exceeds reasonable limits",
          }}
          onChange={() => {}}
          touched={true}
          // Per-locale validation flags - each processed by FieldErrors
          errorsByLocaleOrCurrency={{
            en: { min: true }, // English: too short
            de: { missing: true }, // German: missing
            fr: { max: true }, // French: too long
          }}
          customMessages={{
            missing: "This field is required",
            min: "Must be at least 2 characters",
            max: "Must be less than 50 characters",
          }}
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test different validation errors per locale are displayed
    await expect(
      canvas.getByText("Must be at least 2 characters")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("This field is required")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Must be less than 50 characters")
    ).toBeInTheDocument();
  },
};

export const ComplexValidationMix: Story = {
  render: () => {
    return (
      <Box>
        <h3>Complex Validation Mix - All Error Types</h3>
        <LocalizedField
          label="Product Description"
          name="productDescription"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{
            en: "Valid description",
            de: "",
            fr: "Description",
            es: "Descripción",
          }}
          onChange={() => {}}
          touched={true}
          // Global validation flag
          errors={{ duplicate: true }}
          // Per-locale validation flags
          errorsByLocaleOrCurrency={{
            de: { missing: true },
            fr: { min: true },
          }}
          // Direct message overrides (highest precedence)
          errorMessagesByLocaleOrCurrency={{
            es: "Server validation: This content violates our policy",
          }}
          customMessages={{
            duplicate: "This content already exists",
            missing: "Required for this market",
            min: "Needs more detail",
          }}
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test all error types are displayed with correct precedence
    await expect(
      canvas.getByText("This content already exists")
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Required for this market")
    ).toBeInTheDocument();
    await expect(canvas.getByText("Needs more detail")).toBeInTheDocument();
    await expect(
      canvas.getByText("Server validation: This content violates our policy")
    ).toBeInTheDocument();
  },
};

export const BackwardsCompatibility: Story = {
  render: () => {
    return (
      <Box>
        <h3>Backwards Compatibility - Legacy API</h3>
        <LocalizedField
          label="Legacy Field"
          name="legacyField"
          defaultLocaleOrCurrency="en"
          valuesByLocaleOrCurrency={{ en: "", de: "", fr: "" }}
          onChange={() => {}}
          touched={true}
          // Legacy API still works unchanged
          error="Legacy global error message"
          errorMessagesByLocaleOrCurrency={{
            en: "Legacy English error",
            de: "Legacy German error",
            fr: "Legacy French error",
          }}
        />
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test global error takes precedence
    await expect(
      canvas.getByText("Legacy global error message")
    ).toBeInTheDocument();

    // Test per-locale errors are also displayed
    await expect(canvas.getByText("Legacy English error")).toBeInTheDocument();
    await expect(canvas.getByText("Legacy German error")).toBeInTheDocument();
    await expect(canvas.getByText("Legacy French error")).toBeInTheDocument();
  },
};
