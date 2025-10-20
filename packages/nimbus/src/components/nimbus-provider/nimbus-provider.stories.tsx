import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NimbusProvider,
  IntlProvider,
  Button,
  Text,
  Stack,
  Box,
  Link,
  DateInput,
  useColorMode,
  useColorModeValue,
} from "@commercetools/nimbus";
import { useState } from "react";
import { userEvent, within, expect, fn } from "storybook/test";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "react-aria";
import type { NimbusRouterConfig } from "./nimbus-provider.types";
import { useIntl } from "react-intl";

const meta: Meta<typeof NimbusProvider> = {
  title: "Components/NimbusProvider",
  component: NimbusProvider,
};

export default meta;

type Story = StoryObj<typeof NimbusProvider>;

// Mock router navigate function for testing
const mockNavigate = fn();

const useHref = (href: string) => "some-domain.com" + `/app${href}`;

const mockRouter: NimbusRouterConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: (href: string, options?: any) => {
    mockNavigate(href, options);
    console.log(`Navigating to: ${useHref(href)}`, options);
  },
  useHref,
};

/**
 * Base story - Basic NimbusProvider usage
 * Tests the fundamental provider functionality (theme and color mode)
 */
export const Base: Story = {
  render: () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const textColor = useColorModeValue("black", "white");
    return (
      <NimbusProvider>
        <Box p="600" borderRadius="400" data-testid="provider-content">
          <Stack gap="400">
            <Text color={textColor} data-testid="color-mode-text">
              Current color mode: {colorMode}
            </Text>
            <Button
              onPress={toggleColorMode}
              data-testid="color-mode-toggle"
              variant="outline"
            >
              Toggle Color Mode
            </Button>
            <Text color={textColor}>This text color is: {textColor}</Text>
          </Stack>
        </Box>
      </NimbusProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByTestId("provider-content");
    const colorModeText = canvas.getByTestId("color-mode-text");
    const toggleButton = canvas.getByTestId("color-mode-toggle");

    await step("Provider renders children correctly", async () => {
      await expect(content).toBeInTheDocument();
    });

    await step("Color mode is initially set", async () => {
      await expect(colorModeText).toBeInTheDocument();
      const text = colorModeText.textContent;
      await expect(text).toMatch(/Current color mode: (light|dark)/);
    });

    await step("Color mode can be toggled", async () => {
      const initialText = colorModeText.textContent;
      await userEvent.click(toggleButton);

      // Wait a bit for the color mode to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      const newText = colorModeText.textContent;
      await expect(newText).not.toBe(initialText);
    });
  },
};

/**
 * WithRouter story - Tests router integration
 */
export const WithRouter: Story = {
  args: {
    router: mockRouter,
  },
  render: (args) => (
    <NimbusProvider {...args}>
      <Box p="600" data-testid="router-content">
        <Stack gap="400">
          <Text>Router functionality test</Text>
          <Link href="/home" data-testid="router-link">
            Navigate to Home
          </Link>
          <Link href="/about" data-testid="router-link-2">
            Navigate to About
          </Link>
        </Stack>
      </Box>
    </NimbusProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByTestId("router-content");
    const firstLink = canvas.getByTestId("router-link");
    const secondLink = canvas.getByTestId("router-link-2");

    await step("Router content renders correctly", async () => {
      await expect(content).toBeInTheDocument();
      await expect(firstLink).toBeInTheDocument();
      await expect(secondLink).toBeInTheDocument();
    });

    await step("Router navigation works for first link", async () => {
      await userEvent.click(firstLink);
      await expect(mockNavigate).toHaveBeenCalledWith("/home", undefined);
    });

    await step("Router navigation works for second link", async () => {
      await userEvent.click(secondLink);
      await expect(mockNavigate).toHaveBeenCalledWith("/about", undefined);
    });
  },
};

/**
 * WithLocale story - Tests internationalization
 */
export const WithLocale: Story = {
  args: {
    locale: "de-DE",
  },
  render: (args) => {
    const [date, setDate] = useState<DateValue | null>(
      new CalendarDate(2025, 7, 1)
    );

    return (
      <NimbusProvider {...args}>
        <Box p="600" data-testid="locale-content">
          <DateInput
            aria-label="Select Date"
            value={date}
            onChange={setDate}
            data-testid="formatted-date"
          />
        </Box>
      </NimbusProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const content = canvas.getByTestId("locale-content");
    const dateText = canvas.getByTestId("formatted-date");

    await step("Locale content renders correctly", async () => {
      await expect(content).toBeInTheDocument();
      await expect(dateText).toBeInTheDocument();
    });

    await step("Date is formatted according to locale", async () => {
      const text = dateText.textContent;
      await expect(text).toMatch("1.7.2025");
    });
  },
};

/**
 * WithMultipleLocales story - Demonstrates multiple locales on a single page
 */
export const WithMultipleLocales: Story = {
  //TODO: expand on this when we have translations up and running.
  render: () => {
    const LocaleDisplay = ({ label }: { label: string }) => {
      const intl = useIntl();
      return (
        <Box
          p="400"
          border="solid-25"
          borderColor="neutral.3"
          borderRadius="400"
        >
          <Text data-testid={`${label}-locale`}>
            {label}: {intl.locale}
          </Text>
        </Box>
      );
    };

    return (
      <NimbusProvider locale="en">
        <Box p="600" data-testid="multiple-locales-content">
          <Stack gap="400">
            <Text>Multiple locales on one page</Text>

            <LocaleDisplay label="English" />

            <IntlProvider locale="de">
              <LocaleDisplay label="German" />
            </IntlProvider>

            <IntlProvider locale="es">
              <LocaleDisplay label="Spanish" />
            </IntlProvider>

            <IntlProvider locale="ja">
              <LocaleDisplay label="Japanese" />
            </IntlProvider>

            <IntlProvider locale="it">
              <LocaleDisplay label="Italian" />
            </IntlProvider>
          </Stack>
        </Box>
      </NimbusProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Content renders without errors", async () => {
      const content = canvas.getByTestId("multiple-locales-content");
      await expect(content).toBeInTheDocument();
    });

    await step("English section uses NimbusProvider's locale", async () => {
      const locale = canvas.getByTestId("English-locale");
      await expect(locale).toHaveTextContent("English: en");
    });

    await step("German section uses its own IntlProvider", async () => {
      const locale = canvas.getByTestId("German-locale");
      await expect(locale).toHaveTextContent("German: de");
    });

    await step("Spanish section uses its own IntlProvider", async () => {
      const locale = canvas.getByTestId("Spanish-locale");
      await expect(locale).toHaveTextContent("Spanish: es");
    });

    await step("Japanese section uses its own IntlProvider", async () => {
      const locale = canvas.getByTestId("Japanese-locale");
      await expect(locale).toHaveTextContent("Japanese: ja");
    });

    await step("Italian section uses its own IntlProvider", async () => {
      const locale = canvas.getByTestId("Italian-locale");
      await expect(locale).toHaveTextContent("Italian: it");
    });
  },
};
