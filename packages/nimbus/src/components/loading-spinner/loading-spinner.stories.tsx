import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  LoadingSpinner,
  type LoadingSpinnerProps,
  Stack,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const sizes: LoadingSpinnerProps["size"][] = ["lg", "md", "sm", "xs", "2xs"];

const colorPalettes: LoadingSpinnerProps["colorPalette"][] = [
  "primary",
  "white",
];

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

    await step("Renders as an <svg> element", async () => {
      await expect(spinner.tagName.toLowerCase()).toBe("svg");
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
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
 * The spinner is a single svg element, so it behaves like an icon: it renders
 * at its `size` for every size, at a size set through style props, and inside
 * a button, where the `size` prop still decides.
 */
export const RendersAtRequestedSize: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      {sizes.map((size) => (
        <LoadingSpinner
          key={size as string}
          size={size}
          data-testid={`spinner-${size}`}
        />
      ))}
      <LoadingSpinner
        width="100px"
        height="100px"
        data-testid="spinner-manual"
      />
      <Button size="md">
        Save
        <LoadingSpinner size="2xs" data-testid="spinner-in-button" />
      </Button>
      <Button size="2xs">
        Save
        <LoadingSpinner size="2xs" data-testid="spinner-in-small-button" />
      </Button>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sizeOf = (testId: string) => {
      const rect = canvas.getByTestId(testId).getBoundingClientRect();
      return [Math.round(rect.width), Math.round(rect.height)];
    };

    await step("Every size renders at its requested size", async () => {
      const expected: Record<string, number> = {
        lg: 40,
        md: 32,
        sm: 24,
        xs: 20,
        "2xs": 14,
      };
      for (const [size, px] of Object.entries(expected)) {
        expect(sizeOf(`spinner-${size}`)).toEqual([px, px]);
      }
    });

    await step("A size set through style props is adopted", async () => {
      expect(sizeOf("spinner-manual")).toEqual([100, 100]);
    });

    await step("Inside a button, the size prop decides", async () => {
      expect(sizeOf("spinner-in-button")).toEqual([14, 14]);
      expect(sizeOf("spinner-in-small-button")).toEqual([14, 14]);
    });
  },
};

/**
 * One color palette for a light background and one for a dark background
 */
export const ColorPalettes: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => {
    return (
      <Box backgroundColor="blackAlpha.5">
        <Stack direction="row" gap="400" alignItems="center">
          {colorPalettes.map((colorPalette) => (
            <LoadingSpinner
              aria-label="Loading even more data"
              key={colorPalette as string}
              {...args}
              colorPalette={colorPalette}
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
