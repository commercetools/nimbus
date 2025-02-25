import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";
import { Text, Stack, Box } from "@/components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Select.Root> = {
  title: "components/Select",
  component: Select.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Select.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  render: () => {
    return (
      <Select.Root>
        <Select.Options>
          <Select.Option>Apples</Select.Option>
          <Select.Option>Bananas</Select.Option>
          <Select.Option>Oranges</Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
};

/**
 * Label + additional descriptions
 * demonstrates the use of additional option descriptions
 */
export const WithDescriptions: Story = {
  render: () => {
    return (
      <Select.Root>
        <Select.Options>
          {/** Variant A - plain html-tags with slot property */}
          <Select.Option>
            <p slot="label">Apple</p>
            <p slot="description">A classic and versatile fruit.</p>
          </Select.Option>
          {/** Variant B - text component with slot property */}
          <Select.Option>
            <Text slot="label">Banana</Text>
            <Text slot="description">A good source of potassium.</Text>
          </Select.Option>
          <Select.Option>
            <Text slot="label">Oranges</Text>
            <Text slot="description">Rich in vitamin C.</Text>
          </Select.Option>
          <Select.Option>
            <Text slot="label">Strawberries</Text>
            <Text slot="description">Sweet and full of antioxidants.</Text>
          </Select.Option>
          <Select.Option>
            <Text slot="label">Grapes</Text>
            <Text slot="description">
              Available in various colors and flavors.
            </Text>
          </Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
};

/**
 * OptionGroups
 * Demonstrates grouping of options
 */
export const OptionGroups: Story = {
  render: () => {
    return (
      <Select.Root>
        <Select.Options>
          <Select.OptionGroup label="Fruits">
            <Select.Option>Apples</Select.Option>
            <Select.Option>Oranges</Select.Option>
            <Select.Option>Bananas</Select.Option>
          </Select.OptionGroup>
          <Select.OptionGroup label="Vegetables">
            <Select.Option>Carrots</Select.Option>
            <Select.Option>Broccoli</Select.Option>
            <Select.Option>Spinach</Select.Option>
          </Select.OptionGroup>
          <Select.OptionGroup label="Grains">
            <Select.Option>Rice</Select.Option>
            <Select.Option>Wheat</Select.Option>
            <Select.Option>Oats</Select.Option>
          </Select.OptionGroup>
          <Select.OptionGroup label="Proteins">
            <Select.Option>Chicken</Select.Option>
            <Select.Option>Beef</Select.Option>
            <Select.Option>Pork</Select.Option>
          </Select.OptionGroup>
        </Select.Options>
      </Select.Root>
    );
  },
};

/**
 * Custom Widths
 * custom widths for select-trigger button and popover
 */
export const CustomWidths: Story = {
  render: () => {
    return (
      // width for the trigger can be specified on <Select.Root/>,
      // width for popover can be specified on <Select.Options/>
      <Select.Root width="256px">
        <Select.Options width="512px">
          <Select.OptionGroup label="Fruits">
            <Select.Option>Apples</Select.Option>
            <Select.Option>Oranges</Select.Option>
            <Select.Option>Bananas</Select.Option>
          </Select.OptionGroup>
          <Select.OptionGroup label="Vegetables">
            <Select.Option>Carrots</Select.Option>
            <Select.Option>Broccoli</Select.Option>
            <Select.Option>Spinach</Select.Option>
          </Select.OptionGroup>
        </Select.Options>
      </Select.Root>
    );
  },
};

/**
 * Super long and complex example
 * Demonstrates a complex, long list of options in the middle
 * of the screen. Where will the flyout go? We don't know.
 */
export const SuperLongAndComplex: Story = {
  render: () => {
    return (
      <Box
        display="flex"
        w="100vw"
        h="100vh"
        alignItems="center"
        justifyContent="center"
        overflow="auto"
      >
        <Select.Root>
          <Select.Options>
            <Select.OptionGroup label="Fruits">
              <Select.Option>
                <Text slot="label">Apples</Text>
                <Text slot="description">A crisp and juicy classic fruit.</Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Oranges</Text>
                <Text slot="description">A sweet and tangy citrus fruit.</Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Bananas</Text>
                <Text slot="description">
                  A soft and creamy tropical fruit.
                </Text>
              </Select.Option>
            </Select.OptionGroup>
            <Select.OptionGroup label="Vegetables">
              <Select.Option>
                <Text slot="label">Carrots</Text>
                <Text slot="description">
                  A crunchy and nutritious root vegetable.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Broccoli</Text>
                <Text slot="description">
                  A green vegetable rich in vitamins.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Spinach</Text>
                <Text slot="description">
                  A leafy vegetable packed with iron.
                </Text>
              </Select.Option>
            </Select.OptionGroup>
            <Select.OptionGroup label="Grains">
              <Select.Option>
                <Text slot="label">Rice</Text>
                <Text slot="description">
                  A staple grain consumed worldwide.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Wheat</Text>
                <Text slot="description">
                  A common grain used in bread and pasta.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Oats</Text>
                <Text slot="description">
                  A healthy grain often eaten for breakfast.
                </Text>
              </Select.Option>
            </Select.OptionGroup>
            <Select.OptionGroup label="Proteins">
              <Select.Option>
                <Text slot="label">Chicken</Text>
                <Text slot="description">
                  A versatile and lean poultry protein.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Beef</Text>
                <Text slot="description">
                  A rich and flavorful red meat protein.
                </Text>
              </Select.Option>
              <Select.Option>
                <Text slot="label">Pork</Text>
                <Text slot="description">
                  Another popular and versatile meat protein.
                </Text>
              </Select.Option>
            </Select.OptionGroup>
          </Select.Options>
        </Select.Root>
      </Box>
    );
  },
};
