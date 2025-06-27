import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "./icon";
import { Stack } from "./../stack";
import { Bathtub } from "@commercetools/nimbus-icons";
import type { IconProps } from "./icon.types";
import { within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Icon> = {
  title: "components/Icon",
  component: Icon,
};

export default meta;

const sizes: IconProps["size"][] = ["2xs", "xs", "sm", "md", "lg", "xl"];

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Icon>;

/**
 * Icon is the wrapper component, the actual icon is passed as a child. Default size is the currently inherited font-size, same applies to the color.
 */
export const Base: Story = {
  args: {
    children: <Bathtub />,
    // @ts-expect-error - data-testid is not a standard prop on IconProps but is used for testing
    "data-testid": "icon-base",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByTestId("icon-base");

    await step("Icon is rendered", async () => {
      await expect(icon).toBeInTheDocument();
    });

    await step("Icon is an svg element", async () => {
      await expect(icon.tagName).toBe("svg");
    });
  },
};

/**
 * As shorthand, the icon can be passed as a prop via the `as` property.
 */
export const ViaAsProperty: Story = {
  args: {
    as: Bathtub,
    // @ts-expect-error - data-testid is not a standard prop on IconProps but is used for testing
    "data-testid": "icon-as-prop",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByTestId("icon-as-prop");

    await step("Icon is rendered when using as prop", async () => {
      await expect(icon).toBeInTheDocument();
    });

    await step("Icon is an svg element", async () => {
      await expect(icon.tagName).toBe("svg");
    });
  },
};

/**
 * predefined sizes from the recipe, configurable via the `size` property
 */
export const Sizes: Story = {
  args: {
    as: Bathtub,
    // @ts-expect-error - data-testid is not a standard prop on IconProps but is used for testing
    "data-testid": "icon-sizes",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Icon key={JSON.stringify(size)} {...args} size={size} />
        ))}
      </Stack>
    );
  },
};

/**
 * A custom size can be set via the style-property `boxSize` and a size-token.
 */
export const CustomSize: Story = {
  args: {
    as: Bathtub,
    boxSize: "240px",
    // @ts-expect-error - data-testid is not a standard prop on IconProps but is used for testing
    "data-testid": "icon-custom-size",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByTestId("icon-custom-size");

    await step("Icon with custom size is rendered", async () => {
      await expect(icon).toBeInTheDocument();
    });

    await step("Icon has the correct custom size", async () => {
      await expect(icon).toHaveStyle({ width: "240px", height: "240px" });
    });
  },
};

/**
 * A custom color can be set via the style-property `color` and a color-token.
 */
export const CustomColor: Story = {
  args: {
    as: Bathtub,
    size: "xl",
    // @ts-expect-error - data-testid is not a standard prop on IconProps but is used for testing
    "data-testid": "icon-custom-color",
  },
  render: (args) => {
    return (
      <Stack direction="row">
        {[
          "primary.11",
          "info.11",
          "positive.11",
          "warning.11",
          "critical.11",
          "deeppink",
        ].map((colorToken) => (
          <Icon
            key={colorToken}
            color={colorToken}
            {...args}
            data-testid={`icon-custom-color-${colorToken}`}
          />
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const colorTokens = [
      "primary.11",
      "info.11",
      "positive.11",
      "warning.11",
      "critical.11",
      "deeppink",
    ];

    for (const colorToken of colorTokens) {
      await step(`Icon with color ${colorToken} is rendered`, async () => {
        const icon = canvas.getByTestId(`icon-custom-color-${colorToken}`);
        await expect(icon).toBeInTheDocument();
        if (colorToken === "deeppink") {
          await expect(icon).toHaveStyle({ color: "rgb(255, 20, 147)" });
        }
      });
    }
  },
};
