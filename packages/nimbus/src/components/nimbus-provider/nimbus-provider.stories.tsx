import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NimbusProvider,
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
  render: () => {
    const LocaleDisplay = ({ label }: { label: string }) => {
      const { locale } = useLocale();
      return (
        <Box
          p="400"
          border="solid-25"
          borderColor="neutral.3"
          borderRadius="400"
        >
          <Text data-testid={`${label}-locale`}>
            {label}: {locale}
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

            <NimbusI18nProvider locale="de">
              <LocaleDisplay label="German" />
            </NimbusI18nProvider>

            <NimbusI18nProvider locale="es">
              <LocaleDisplay label="Spanish" />
            </NimbusI18nProvider>

            <NimbusI18nProvider locale="ja">
              <LocaleDisplay label="Japanese" />
            </NimbusI18nProvider>

            <NimbusI18nProvider locale="it">
              <LocaleDisplay label="Italian" />
            </NimbusI18nProvider>
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

    await step("German section uses its own NimbusI18nProvider", async () => {
      const locale = canvas.getByTestId("German-locale");
      await expect(locale).toHaveTextContent("German: de");
    });

    await step("Spanish section uses its own NimbusI18nProvider", async () => {
      const locale = canvas.getByTestId("Spanish-locale");
      await expect(locale).toHaveTextContent("Spanish: es");
    });

    await step("Japanese section uses its own NimbusI18nProvider", async () => {
      const locale = canvas.getByTestId("Japanese-locale");
      await expect(locale).toHaveTextContent("Japanese: ja");
    });

    await step("Italian section uses its own NimbusI18nProvider", async () => {
      const locale = canvas.getByTestId("Italian-locale");
      await expect(locale).toHaveTextContent("Italian: it");
    });
  },
};

/**
 * NestedProviders story - Tests nested NimbusProvider behavior
 * Validates that locale and router contexts can be nested successfully
 */
export const NestedProviders: Story = {
  render: () => {
    const testDate = new CalendarDate(2024, 3, 15);
    const [outerNavCalled, setOuterNavCalled] = useState<string | null>(null);
    const [innerNavCalled, setInnerNavCalled] = useState<string | null>(null);

    const mockOuterRouter: NimbusRouterConfig = {
      navigate: (href: string) => setOuterNavCalled(href),
    };

    const mockInnerRouter: NimbusRouterConfig = {
      navigate: (href: string) => setInnerNavCalled(href),
    };

    const LocaleDisplay = () => {
      const intl = useIntl();
      return <>{intl.locale}</>;
    };

    return (
      <NimbusProvider locale="en" router={mockOuterRouter}>
        <Stack gap="600" p="600">
          <Box
            p="600"
            border="solid-25"
            borderColor="neutral.3"
            borderRadius="400"
            data-testid="outer-provider"
          >
            <Stack gap="400">
              <Text fontSize="xl" fontWeight="bold">
                Outer Provider (English)
              </Text>

              <Box data-testid="outer-locale">
                Locale: <LocaleDisplay />
              </Box>

              <DateInput
                aria-label="Outer Date"
                value={testDate}
                data-testid="outer-date"
              />

              <Link href="/outer" data-testid="outer-link">
                Navigate to /outer
              </Link>

              {outerNavCalled && (
                <Text data-testid="outer-nav-result">
                  Outer navigated to: {outerNavCalled}
                </Text>
              )}

              {/* Nested Provider */}
              <Box
                p="600"
                border="solid-100"
                borderColor="blue.6"
                borderRadius="400"
                bg="blue.1"
                data-testid="inner-provider"
              >
                <NimbusProvider locale="de-DE" router={mockInnerRouter}>
                  <Stack gap="400">
                    <Text fontSize="lg" fontWeight="bold">
                      Inner Provider (German)
                    </Text>

                    <Box data-testid="inner-locale">
                      Locale: <LocaleDisplay />
                    </Box>

                    <DateInput
                      aria-label="Inner Date"
                      value={testDate}
                      data-testid="inner-date"
                    />

                    <Link href="/inner" data-testid="inner-link">
                      Navigate to /inner
                    </Link>

                    {innerNavCalled && (
                      <Text data-testid="inner-nav-result">
                        Inner navigated to: {innerNavCalled}
                      </Text>
                    )}
                  </Stack>
                </NimbusProvider>
              </Box>

              <Text>After nested provider (back to English context)</Text>

              <DateInput
                aria-label="Outer Date After"
                value={testDate}
                data-testid="outer-date-after"
              />
            </Stack>
          </Box>
        </Stack>
      </NimbusProvider>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify outer provider renders", async () => {
      await expect(canvas.getByTestId("outer-provider")).toBeInTheDocument();
      await expect(canvas.getByTestId("outer-locale")).toBeInTheDocument();
      await expect(canvas.getByTestId("outer-date")).toBeInTheDocument();
      await expect(canvas.getByTestId("outer-link")).toBeInTheDocument();
    });

    await step("Verify nested provider renders", async () => {
      await expect(canvas.getByTestId("inner-provider")).toBeInTheDocument();
      await expect(canvas.getByTestId("inner-locale")).toBeInTheDocument();
      await expect(canvas.getByTestId("inner-date")).toBeInTheDocument();
      await expect(canvas.getByTestId("inner-link")).toBeInTheDocument();
    });

    await step("Verify outer locale is English", async () => {
      const outerLocale = canvas.getByTestId("outer-locale");
      await expect(outerLocale).toHaveTextContent(/Locale:\s*en/i);
    });

    await step("Verify inner locale is German", async () => {
      const innerLocale = canvas.getByTestId("inner-locale");
      await expect(innerLocale).toHaveTextContent(/Locale:\s*de-DE/i);
    });

    await step("Verify outer router navigation", async () => {
      const outerLink = canvas.getByTestId("outer-link");
      await userEvent.click(outerLink);

      // Wait for navigation result to appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      const navResult = canvas.getByTestId("outer-nav-result");
      await expect(navResult).toHaveTextContent("/outer");
    });

    await step("Verify inner router navigation", async () => {
      const innerLink = canvas.getByTestId("inner-link");
      await userEvent.click(innerLink);

      // Wait for navigation result to appear
      await new Promise((resolve) => setTimeout(resolve, 100));
      const navResult = canvas.getByTestId("inner-nav-result");
      await expect(navResult).toHaveTextContent("/inner");
    });

    await step("Verify date formatting in outer context", async () => {
      const outerDate = canvas.getByTestId("outer-date");
      const text = outerDate.textContent;
      // English format: M/D/YYYY (3/15/2024)
      await expect(text).toMatch(/3\/15\/2024/);
    });

    await step("Verify date formatting in inner context", async () => {
      const innerDate = canvas.getByTestId("inner-date");
      const text = innerDate.textContent;
      // German format: D.M.YYYY (15.3.2024 or 15.03.2024)
      await expect(text).toMatch(/15\.0?3\.2024/);
    });

    await step(
      "Verify outer context restored after nested provider",
      async () => {
        const outerDateAfter = canvas.getByTestId("outer-date-after");
        const text = outerDateAfter.textContent;
        // Should still be English format
        await expect(text).toMatch(/3\/15\/2024/);
      }
    );
  },
};
