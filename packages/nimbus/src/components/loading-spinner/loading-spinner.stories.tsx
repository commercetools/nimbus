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
 * The svg fills the outer element, so the spinner is as large as its outer
 * element: for every `size`, for a size set through style props, and inside a
 * button, where the `size` prop still decides.
 */
export const SvgFillsOuterElement: Story = {
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
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const sizeOf = (testId: string) => {
      const outer = canvas.getByTestId(testId);
      const svg = outer.querySelector("svg") as SVGSVGElement;
      const style = getComputedStyle(svg);
      return {
        outer: [
          Math.round(outer.getBoundingClientRect().width),
          Math.round(outer.getBoundingClientRect().height),
        ],
        svg: [
          Math.round(parseFloat(style.width)),
          Math.round(parseFloat(style.height)),
        ],
      };
    };

    await step(
      "Every size: the svg is as large as the outer element",
      async () => {
        const expected: Record<string, number> = {
          lg: 40,
          md: 32,
          sm: 24,
          xs: 20,
          "2xs": 14,
        };
        for (const [size, px] of Object.entries(expected)) {
          const { outer, svg } = sizeOf(`spinner-${size}`);
          expect(outer).toEqual([px, px]);
          expect(svg).toEqual([px, px]);
        }
      }
    );

    await step("A size set through style props is adopted", async () => {
      const { outer, svg } = sizeOf("spinner-manual");
      expect(outer).toEqual([100, 100]);
      expect(svg).toEqual([100, 100]);
    });

    await step("Inside a button, the size prop decides", async () => {
      const { outer, svg } = sizeOf("spinner-in-button");
      expect(outer).toEqual([14, 14]);
      expect(svg).toEqual([14, 14]);
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
