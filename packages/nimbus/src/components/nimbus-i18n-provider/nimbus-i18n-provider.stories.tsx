import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import {
  NimbusI18nProvider,
  DatePicker,
  NumberInput,
  Stack,
  Text,
  Alert,
  Box,
  type NimbusI18nProviderProps,
} from "@commercetools/nimbus";
import { useLocale } from "react-aria-components";
import { LocalizedStringDictionary } from "@internationalized/string";
import { alertMessagesStrings } from "../alert/alert.messages";

// Helper to get messages for testing (normalizes locale like the hook does)
function getAlertMessage(key: string, locale: string): string {
  const dictionary = new LocalizedStringDictionary(alertMessagesStrings);
  const normalizedLocale = normalizeLocaleForTesting(locale);
  const message = dictionary.getStringForLocale(key, normalizedLocale);
  return typeof message === "string" ? message : (message?.({}) ?? "");
}

function normalizeLocaleForTesting(locale: string): string {
  const supportedLocales = new Set(["en", "de", "es", "fr-FR", "pt-BR"]);
  if (supportedLocales.has(locale)) return locale;

  const langMap: Record<string, string> = {
    en: "en",
    de: "de",
    es: "es",
    fr: "fr-FR",
    pt: "pt-BR",
  };

  const lang = locale.split(/[-_]/)[0].toLowerCase();
  return langMap[lang] ?? "en";
}

const meta: Meta<typeof NimbusI18nProvider> = {
  title: "Components/NimbusI18nProvider",
  component: NimbusI18nProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    locale: {
      control: { type: "select" },
      options: ["en-US", "en-GB", "de-DE", "es-ES", "fr-FR", "pt-BR", "ja-JP"],
      description: "BCP47 locale code (e.g., 'en-US', 'de-DE')",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default NimbusI18nProvider with US English locale.
 * React Aria components use US formatting (MM/DD/YYYY, 1,234.56).
 */
export const Default: Story = {
  args: {
    locale: "en-US",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: English (US)</Text>
        <DatePicker aria-label="Select Date" />
        <NumberInput
          aria-label="Amount"
          defaultValue={1234.56}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "USD",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify US number formatting", async () => {
      const numberInput = canvas.getByLabelText("Amount");
      expect(numberInput).toHaveValue("$1,234.56");
    });

    await step("Verify date input is present", async () => {
      const dateInput = canvas.getByLabelText("Select Date");
      expect(dateInput).toBeInTheDocument();
    });
  },
};

/**
 * German locale example.
 * Date format: DD.MM.YYYY, number format: 1.234,56
 */
export const German: Story = {
  args: {
    locale: "de-DE",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: Deutsch (DE)</Text>
        <DatePicker aria-label="Datum wählen" />
        <NumberInput
          aria-label="Betrag"
          defaultValue={1234.56}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "EUR",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify German number formatting (comma decimal separator)",
      async () => {
        const numberInput = canvas.getByLabelText("Betrag");
        // German uses comma as decimal separator, period for thousands, and non-breaking space before €
        expect(numberInput).toHaveValue("1.234,56\u00A0€");
      }
    );

    await step("Verify date input is present", async () => {
      const dateInput = canvas.getByLabelText("Datum wählen");
      expect(dateInput).toBeInTheDocument();
    });
  },
};

/**
 * Spanish locale example.
 * Date format: DD/MM/YYYY, number format: 1.234,56
 */
export const Spanish: Story = {
  args: {
    locale: "es-ES",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: Español (ES)</Text>
        <DatePicker aria-label="Seleccionar fecha" />
        <NumberInput
          aria-label="Cantidad"
          defaultValue={1234.56}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "EUR",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
};

/**
 * French locale example.
 * Date format: DD/MM/YYYY, number format: 1 234,56 (space as thousands separator)
 */
export const French: Story = {
  args: {
    locale: "fr-FR",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: Français (FR)</Text>
        <DatePicker aria-label="Sélectionner la date" />
        <NumberInput
          aria-label="Montant"
          defaultValue={1234.56}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "EUR",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
};

/**
 * Portuguese (Brazil) locale example.
 * Date format: DD/MM/YYYY, number format: 1.234,56
 */
export const PortugueseBrazil: Story = {
  args: {
    locale: "pt-BR",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: Português (BR)</Text>
        <DatePicker aria-label="Selecionar data" />
        <NumberInput
          aria-label="Quantidade"
          defaultValue={1234.56}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "BRL",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
};

/**
 * Japanese locale example.
 * Date format: YYYY/MM/DD, number format: 1,234 (no decimals for JPY)
 */
export const Japanese: Story = {
  args: {
    locale: "ja-JP",
  },
  render: (args: NimbusI18nProviderProps) => (
    <NimbusI18nProvider {...args}>
      <Stack direction="column" gap="400">
        <Text>Locale: 日本語 (JP)</Text>
        <DatePicker aria-label="日付を選択" />
        <NumberInput
          aria-label="金額"
          defaultValue={1234}
          minValue={0}
          formatOptions={{
            style: "currency",
            currency: "JPY",
          }}
        />
      </Stack>
    </NimbusI18nProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify Japanese number formatting (no decimal places for JPY)",
      async () => {
        const numberInput = canvas.getByLabelText("金額");
        // Japanese Yen doesn't use decimal places and uses full-width Yen symbol
        expect(numberInput).toHaveValue("￥1,234");
      }
    );

    await step("Verify date input is present", async () => {
      const dateInput = canvas.getByLabelText("日付を選択");
      expect(dateInput).toBeInTheDocument();
    });
  },
};

/**
 * Comparing multiple locales side by side.
 * Shows how React Aria components adapt to different locale formatting.
 */
export const CompareLocales: Story = {
  render: () => {
    const locales = [
      { code: "en-US" as const, name: "English (US)", currency: "USD" },
      { code: "en-GB" as const, name: "English (UK)", currency: "GBP" },
      { code: "de-DE" as const, name: "Deutsch", currency: "EUR" },
      { code: "ja-JP" as const, name: "日本語", currency: "JPY" },
    ];

    return (
      <Stack direction="column" gap="600">
        {locales.map(({ code, name, currency }) => (
          <NimbusI18nProvider key={code} locale={code}>
            <Stack direction="column" gap="200">
              <Text fontWeight="600">{name}</Text>
              <DatePicker aria-label={`Date ${code}`} />
              <NumberInput
                aria-label={`Price ${code}`}
                defaultValue={currency === "JPY" ? 1234 : 1234.56}
                minValue={0}
                formatOptions={{
                  style: "currency",
                  currency,
                }}
              />
            </Stack>
          </NimbusI18nProvider>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify all locale number formats are different", async () => {
      const usInput = canvas.getByLabelText("Price en-US");
      const gbInput = canvas.getByLabelText("Price en-GB");
      const deInput = canvas.getByLabelText("Price de-DE");
      const jpInput = canvas.getByLabelText("Price ja-JP");

      // US format: $1,234.56
      expect(usInput).toHaveValue("$1,234.56");

      // UK format: £1,234.56
      expect(gbInput).toHaveValue("£1,234.56");

      // German format: 1.234,56 € (period for thousands, comma for decimal, non-breaking space before €)
      expect(deInput).toHaveValue("1.234,56\u00A0€");

      // Japanese format: ￥1,234 (no decimals, full-width Yen symbol)
      expect(jpInput).toHaveValue("￥1,234");
    });

    await step("Verify all date inputs are present", async () => {
      const usDate = canvas.getByLabelText("Date en-US");
      const gbDate = canvas.getByLabelText("Date en-GB");
      const deDate = canvas.getByLabelText("Date de-DE");
      const jpDate = canvas.getByLabelText("Date ja-JP");

      expect(usDate).toBeInTheDocument();
      expect(gbDate).toBeInTheDocument();
      expect(deDate).toBeInTheDocument();
      expect(jpDate).toBeInTheDocument();
    });
  },
};

/**
 * Test component that uses message dictionaries to verify locale support
 * Uses Alert.DismissButton which internally uses alertMessages to test locale support
 */
const MessageTranslationTestComponent = ({
  testId,
}: {
  testId: string;
  requestedLocale: string;
}) => {
  const { locale } = useLocale();
  // Test retrieving a message for the current locale (for verification)
  // Fallback to English is handled automatically by the message dictionary's inline fallback logic
  // "dismiss" is a simple string message (no variables), so we can safely assert string type
  const dismissLabel = getAlertMessage("dismiss", locale);

  return (
    <Box data-testid={testId}>
      <Alert.Root colorPalette="info" variant="outlined">
        <Text data-testid={`${testId}-message`}>
          Inspect the dismiss button to verify it has the expected aria-label
          for this locale.
        </Text>
        <Alert.DismissButton />
      </Alert.Root>
      <Text data-testid={`${testId}-expected-label`} hidden>
        {dismissLabel}
      </Text>
    </Box>
  );
};

/**
 * Verifies that all supported locales work correctly with message dictionaries.
 * Tests that components can retrieve messages for all supported locales:
 * - Simple codes: en, de, es, fr-FR, pt-BR
 * - BCP47 variants: en-US, de-DE, es-ES (normalize to en, de, es)
 *
 * Verifies that BCP47 locale codes are properly normalized to match dictionary keys.
 */
export const MessageTranslationForSupportedLocales: Story = {
  render: () => {
    const supportedLocales = [
      "en",
      "en-US", // BCP47 variant (should normalize to "en")
      "de",
      "de-DE", // BCP47 variant (should normalize to "de")
      "es",
      "es-ES", // BCP47 variant (should normalize to "es")
      "fr-FR", // Already BCP47, matches dictionary key
      "pt-BR", // Already BCP47, matches dictionary key
    ] as const;
    return (
      <Stack direction="column" gap="400">
        <Text fontWeight="600" fontSize="500">
          Message Translations for Supported Locales
        </Text>
        <Stack direction="column" gap="100">
          <Text fontSize="300" color="neutral.12">
            Tests the Alert component's dismiss button aria-label to verify
            message retrieval works correctly for all supported locales and that
            BCP47 locale codes (en-US, de-DE, es-ES) are properly normalized.
          </Text>
        </Stack>
        {supportedLocales.map((locale) => (
          <NimbusI18nProvider key={locale} locale={locale}>
            <Box
              p="400"
              border="solid-25"
              borderColor="neutral.3"
              borderRadius="400"
            >
              <Stack direction="column" gap="200">
                <Text fontWeight="600">
                  Requested locale passed to the NimbusI18nProvider: {locale}
                </Text>
                <MessageTranslationTestComponent
                  testId={`locale-test-${locale}`}
                  requestedLocale={locale}
                />
              </Stack>
            </Box>
          </NimbusI18nProvider>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify all supported locales render without errors",
      async () => {
        const supportedLocales = ["en", "de", "es", "fr-FR", "pt-BR"] as const;

        for (const locale of supportedLocales) {
          const testComponent = canvas.getByTestId(`locale-test-${locale}`);
          await expect(testComponent).toBeInTheDocument();

          // Verify the message was retrieved correctly
          const messageText = within(testComponent).getByTestId(
            `locale-test-${locale}-message`
          );
          await expect(messageText).toBeInTheDocument();
          // The message should exist
          await expect(messageText.textContent).toBeTruthy();
        }
      }
    );

    await step(
      "Verify message dictionaries work for all supported locales",
      async () => {
        const supportedLocales = [
          "en",
          "en-US",
          "de",
          "de-DE",
          "es-ES",
          "fr-FR",
          "pt-BR",
        ] as const;
        for (const locale of supportedLocales) {
          const testComponent = canvas.getByTestId(`locale-test-${locale}`);
          // Verify the dismiss button exists (message was retrieved successfully)
          const dismissButton = within(testComponent).getByRole("button");
          await expect(dismissButton).toBeInTheDocument();
          // Verify it has an aria-label (message was retrieved)
          await expect(dismissButton).toHaveAttribute("aria-label");

          // Get the expected translation from the message dictionary
          const expectedLabel = getAlertMessage("dismiss", locale);
          // Verify the aria-label matches what the message dictionary returns for this locale
          const actualLabel = dismissButton.getAttribute("aria-label");
          await expect(actualLabel).toBe(expectedLabel);
        }
      }
    );
  },
};

/**
 * Verifies that unsupported locales fallback to the default locale (en).
 * Tests that when a locale is not supported, components gracefully fallback
 * to English messages rather than breaking or showing errors.
 */
export const MessageTranslationForUnsupportedLocales: Story = {
  render: () => {
    const unsupportedLocales = ["ja-JP", "sqi", "it-IT"] as const;

    return (
      <Stack direction="column" gap="400">
        <Text fontWeight="600" fontSize="500">
          Fallback Behavior for Unsupported Locales
        </Text>
        <Stack direction="column" gap="100">
          <Text fontSize="300" color="neutral.12">
            Tests the Alert component's dismiss button aria-label to verify that
            unsupported locales gracefully fallback to English messages.
          </Text>
          <Text fontSize="300" color="neutral.12">
            Demonstrates that when a locale is not in the message dictionary,
            components fallback to English (en) rather than breaking.
          </Text>
        </Stack>
        {unsupportedLocales.map((locale) => (
          <NimbusI18nProvider key={locale} locale={locale}>
            <Box
              p="400"
              border="solid-25"
              borderColor="neutral.3"
              borderRadius="400"
            >
              <Stack direction="column" gap="200">
                <Text fontWeight="600">
                  Requested locale passed to the NimbusI18nProvider: {locale}
                </Text>
                <MessageTranslationTestComponent
                  testId={`fallback-test-${locale}`}
                  requestedLocale={locale}
                />
              </Stack>
            </Box>
          </NimbusI18nProvider>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify unsupported locales render without errors", async () => {
      const unsupportedLocales = ["ja-JP", "sqi", "it-IT"] as const;

      for (const locale of unsupportedLocales) {
        const testComponent = canvas.getByTestId(`fallback-test-${locale}`);
        await expect(testComponent).toBeInTheDocument();

        // Verify the message was retrieved correctly
        const messageText = within(testComponent).getByTestId(
          `fallback-test-${locale}-message`
        );
        await expect(messageText).toBeInTheDocument();
        await expect(messageText.textContent).toBeTruthy();
      }
    });

    await step(
      "Verify unsupported locales fallback to English messages",
      async () => {
        const unsupportedLocales = ["ja-JP", "sqi", "it-IT"] as const;

        for (const locale of unsupportedLocales) {
          const testComponent = canvas.getByTestId(`fallback-test-${locale}`);
          const dismissButton = within(testComponent).getByRole("button");
          await expect(dismissButton).toBeInTheDocument();

          // Verify normalization: unsupported locale should normalize to "en"
          // Test that using the unsupported locale directly returns English message
          const normalizedLabel = getAlertMessage("dismiss", locale);
          const expectedEnglishLabel = getAlertMessage("dismiss", "en");
          await expect(normalizedLabel).toBe(expectedEnglishLabel);

          // Verify the actual aria-label matches the English fallback message
          const actualLabel = dismissButton.getAttribute("aria-label");
          await expect(actualLabel).toBe(expectedEnglishLabel);
        }
      }
    );
  },
};
