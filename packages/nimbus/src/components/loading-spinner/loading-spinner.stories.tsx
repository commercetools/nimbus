import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  LoadingSpinner,
  type LoadingSpinnerProps,
  Stack,
} from "@commercetools/nimbus";
import { Circle as DemoIcon } from "@commercetools/nimbus-icons";
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

    await step("Is drawn on the 24x24 icon grid", async () => {
      await expect(spinner).toHaveAttribute("viewBox", "0 0 24 24");
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
 * a button, where the button decides the size, as it does for icons.
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
      <LoadingSpinner data-testid="spinner-default" />
      <LoadingSpinner
        width="100px"
        height="100px"
        data-testid="spinner-manual"
      />
      <Button size="md">
        Save
        <LoadingSpinner data-testid="spinner-in-button" />
      </Button>
      <Button size="2xs">
        Save
        <LoadingSpinner data-testid="spinner-in-small-button" />
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

    await step("Without a size, the spinner is 24px", async () => {
      expect(sizeOf("spinner-default")).toEqual([24, 24]);
    });

    await step("A size set through style props is adopted", async () => {
      expect(sizeOf("spinner-manual")).toEqual([100, 100]);
    });

    await step("Inside a button, the button decides the size", async () => {
      // Button sizes "md" and "2xs" give their icons 24px and 16px
      expect(sizeOf("spinner-in-button")).toEqual([24, 24]);
      expect(sizeOf("spinner-in-small-button")).toEqual([16, 16]);
    });
  },
};

const buttonSizes = ["2xs", "xs", "sm", "md"] as const;

/**
 * A spinner next to an icon in buttons of every size, to compare their sizes.
 * The button sizes its icons, and it sizes the spinner the same way: a spinner
 * in a button needs no `size`.
 */
export const NextToIconsInButtons: Story = {
  render: () => (
    <Stack gap="400" alignItems="flex-start">
      {buttonSizes.map((buttonSize) => (
        <Stack key={buttonSize} direction="row" gap="200" alignItems="center">
          <Button size={buttonSize}>
            {buttonSize}
            <DemoIcon data-testid={`icon-${buttonSize}`} />
          </Button>
          <Button size={buttonSize}>
            {buttonSize}
            <LoadingSpinner data-testid={`spinner-${buttonSize}`} />
          </Button>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sizeOf = (testId: string) => {
      const rect = canvas.getByTestId(testId).getBoundingClientRect();
      return [Math.round(rect.width), Math.round(rect.height)];
    };

    await step("In every button, the spinner is as large as the icon", () => {
      for (const buttonSize of buttonSizes) {
        expect(sizeOf(`spinner-${buttonSize}`)).toEqual(
          sizeOf(`icon-${buttonSize}`)
        );
      }
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
