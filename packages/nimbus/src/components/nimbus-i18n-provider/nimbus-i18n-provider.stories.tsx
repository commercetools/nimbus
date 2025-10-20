import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NimbusI18nProvider,
  DatePicker,
  NumberInput,
  Stack,
  Text,
} from "@commercetools/nimbus";

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
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: English (US)</Text>
        <DatePicker label="Select Date" />
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
    ),
  },
};

/**
 * German locale example.
 * Date format: DD.MM.YYYY, number format: 1.234,56
 */
export const German: Story = {
  args: {
    locale: "de-DE",
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: Deutsch (DE)</Text>
        <DatePicker label="Datum wählen" />
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
    ),
  },
};

/**
 * Spanish locale example.
 * Date format: DD/MM/YYYY, number format: 1.234,56
 */
export const Spanish: Story = {
  args: {
    locale: "es-ES",
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: Español (ES)</Text>
        <DatePicker label="Seleccionar fecha" />
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
    ),
  },
};

/**
 * French locale example.
 * Date format: DD/MM/YYYY, number format: 1 234,56
 */
export const French: Story = {
  args: {
    locale: "fr-FR",
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: Français (FR)</Text>
        <DatePicker label="Sélectionner la date" />
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
    ),
  },
};

/**
 * Portuguese (Brazil) locale example.
 * Date format: DD/MM/YYYY, number format: 1.234,56
 */
export const PortugueseBrazil: Story = {
  args: {
    locale: "pt-BR",
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: Português (BR)</Text>
        <DatePicker label="Selecionar data" />
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
    ),
  },
};

/**
 * Japanese locale example.
 * Date format: YYYY/MM/DD, number format: 1,234.56
 */
export const Japanese: Story = {
  args: {
    locale: "ja-JP",
    children: (
      <Stack direction="column" gap="400">
        <Text>Locale: 日本語 (JP)</Text>
        <DatePicker label="日付を選択" />
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
    ),
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
              <DatePicker label="Date" />
              <NumberInput
                aria-label="Price"
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
};
