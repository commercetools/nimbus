import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./icon";
import { Stack } from "./../stack";
import { Bathtub } from "@commercetools/nimbus-icons";
import type { IconProps } from "./icon.types";

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
  },
};

/**
 * As shorthand, the icon can be passed as a prop via the `as` property.
 */
export const ViaAsProperty: Story = {
  args: {
    as: Bathtub,
  },
};

/**
 * predefined sizes from the recipe, configurable via the `size` property
 */
export const Sizes: Story = {
  args: {
    as: Bathtub,
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
    boxSize: "3200",
  },
};

/**
 * A custom color can be set via the style-property `color` and a color-token.
 */
export const CustomColor: Story = {
  args: {
    as: Bathtub,
    size: "xl",
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
        ].map((colorToken) => (
          <Icon key={colorToken} color={colorToken} {...args} />
        ))}
      </Stack>
    );
  },
};
