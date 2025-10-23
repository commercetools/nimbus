import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  LoadingSpinner,
  type LoadingSpinnerProps,
  Stack,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const sizes: LoadingSpinnerProps["size"][] = ["lg", "md", "sm", "xs", "2xs"];

const tones: LoadingSpinnerProps["tone"][] = ["primary", "white"];

const meta: Meta<typeof LoadingSpinner> = {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof LoadingSpinner>;

export const Base: Story = {
  args: {
    "data-testid": "spinner-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByTestId("spinner-test");

    await step("Uses a <div> wrapper by default", async () => {
      await expect(spinner.tagName).toBe("DIV");
    });

    await step("Has ARIA role='progressbar'", async () => {
      await expect(spinner).toHaveAttribute("role", "progressbar");
    });

    await step("Has an accessible label", async () => {
      await expect(spinner).toHaveAttribute("aria-label", "Loading data");
    });

    await step("Has default aria-label", async () => {
      await expect(spinner.ariaLabel).toBe("Loading data");
    });
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <LoadingSpinner key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * One tone for a light background and one for a dark background
 */
export const Tones: Story = {
  render: (args) => {
    return (
      <Box backgroundColor="blackAlpha.5">
        <Stack direction="row" gap="400" alignItems="center">
          {tones.map((tone) => (
            <LoadingSpinner
              aria-label="Loading even more data"
              key={tone as string}
              {...args}
              tone={tone}
            />
          ))}
        </Stack>
      </Box>
    );
  },

  args: {
    "data-testid": "spinner-test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getAllByTestId("spinner-test");

    await step("Forwards aria-label", async () => {
      await expect(spinner[0].ariaLabel).toBe("Loading even more data");
    });
  },
};
