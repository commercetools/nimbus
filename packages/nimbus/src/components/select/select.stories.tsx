import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Icon,
  Select,
  type SelectRootProps,
  Stack,
  Text,
} from "@commercetools/nimbus";
import type { Key } from "react-aria";
import { useState } from "react";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { AddReaction, Search, Visibility } from "@commercetools/nimbus-icons";

import { useAsyncList } from "react-stately";

/**
 * Storybook metadata configuration
 */
const meta: Meta<typeof Select.Root> = {
  title: "Components/Select",
  component: Select.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Select.Root>;

/**
 * Test data
 */

const selectSizes: SelectRootProps["size"][] = ["sm", "md"];
const selectVariants: SelectRootProps["variant"][] = ["outline", "ghost"];

const optionGroupOptions = [
  {
    id: "a",
    name: "Fruit",
    children: [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
      { id: 3, name: "Orange" },
      { id: 4, name: "Honeydew" },
      { id: 5, name: "Grapes" },
      { id: 6, name: "Watermelon" },
      { id: 7, name: "Cantaloupe" },
      { id: 8, name: "Pear" },
    ],
  },
  {
    id: "b",
    name: "Vegetable",
    children: [
      { id: 9, name: "Cabbage" },
      { id: 10, name: "Broccoli" },
      { id: 11, name: "Carrots" },
      { id: 12, name: "Lettuce" },
      { id: 13, name: "Spinach" },
      { id: 14, name: "Bok Choy" },
      { id: 15, name: "Cauliflower" },
      { id: 16, name: "Potatoes" },
    ],
  },
];

/**
 * Base story
 * Demonstrates the most basic implementation, an uncontrolled
 * select with a few options.
 */
export const Base: Story = {
  render: () => {
    return (
      <Select.Root aria-label="Select a fruit" data-testid="select">
        <Select.Options>
          <Select.Option>Apples</Select.Option>
          <Select.Option>Bananas</Select.Option>
          <Select.Option>Oranges</Select.Option>
          <Select.Option>Cherries</Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Select is rendered with button", async () => {
      await expect(button).toBeInTheDocument();
    });

    await step("Select button can be focused with keyboard", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Select opens on click", async () => {
      await userEvent.click(button!);
      // the popover is rendered via a react portal outside of the select root
      // and can only be found by querying the document directly
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });

    await step("Options are displayed when open", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await expect(options.length).toBe(4);
      await expect(options[0]).toHaveTextContent("Apples");
    });

    await step("Can select an option with click", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[1]);
      await expect(button).toHaveTextContent("Bananas");
    });

    await step("Value can be cleared with keyboard", async () => {
      const clearButton = select.querySelectorAll("button")[1];
      await userEvent.click(clearButton);
      await expect(button).toHaveTextContent("Select an item");
    });
  },
};

/**
 * Controlled State
 * The state of the select is controlled from the oustide.
 * @see https://react-spectrum.adobe.com/react-aria/Select.html#selection
 */
const mockFn = fn();
export const ControlledState: Story = {
  render: () => {
    const options = [
      { id: 1, name: "Koala" },
      { id: 2, name: "Kangaroo" },
      { id: 3, name: "Platypus" },
      { id: 4, name: "Bald Eagle" },
      { id: 5, name: "Bison" },
      { id: 6, name: "Skunk" },
    ];
    const [animal, setAnimal] = useState<Key>("Bison");

    const onChangeRequest = (key: Key) => {
      setAnimal(key);
      mockFn();
    };

    return (
      <Box>
        <Box bg="blueAlpha.2" p="400" my="400" data-testid="value-display">
          I'm a Box and not related to Select, but I know it's current value,
          it's <mark>{animal ?? "not set"}</mark>.
        </Box>
        <Select.Root
          defaultSelectedKey={animal}
          selectedKey={animal}
          onSelectionChange={
            onChangeRequest as SelectRootProps["onSelectionChange"]
          }
          aria-label="Select your new pet"
          data-testid="select"
        >
          <Select.Options items={options}>
            {(item: { name: string }) => (
              <Select.Option id={item.name}>{item.name}</Select.Option>
            )}
          </Select.Options>
        </Select.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const valueDisplay = canvas.getByTestId("value-display");
    const button = select.querySelector("button");

    await step("Select displays the default value", async () => {
      await expect(button).toHaveTextContent("Bison");
      await expect(valueDisplay).toHaveTextContent("Bison");
    });

    await step(
      "Selecting a different option updates external state",
      async () => {
        await userEvent.click(button!);
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        const options = document.querySelectorAll('[role="option"]');
        await userEvent.click(options[0]); // Select Koala

        await expect(button).toHaveTextContent("Koala");
        await expect(valueDisplay).toHaveTextContent("Koala");

        await expect(mockFn).toHaveBeenCalled();
      }
    );
  },
};

/**
 * Async Loading
 * @see https://react-spectrum.adobe.com/react-aria/Select.html#asynchronous-loading
 */
export const AsyncLoading: Story = {
  render: () => {
    const list = useAsyncList<{ id: number; name: string }>({
      load: async () => {
        // Simulate a network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
          items: [
            { id: 1, name: "Koala" },
            { id: 2, name: "Kangaroo" },
            { id: 3, name: "Platypus" },
            { id: 4, name: "Bald Eagle" },
            { id: 5, name: "Bison" },
            { id: 6, name: "Skunk" },
          ],
        };
      },
    });

    const [animal, setAnimal] = useState<Key>();

    const isLoading = list.loadingState === "loading";

    return (
      <Box>
        <Box bg="blueAlpha.2" p="400" my="400">
          Here, an async list is being loaded. And while it is loading, Select
          should go into an <mark>isLoading</mark> state (disabled and with a
          spinner).
        </Box>
        <Select.Root
          isLoading={isLoading}
          selectedKey={animal}
          onSelectionChange={setAnimal as SelectRootProps["onSelectionChange"]}
          leadingElement={<Icon as={AddReaction} />}
          aria-label="Select your new pet"
          data-testid="select"
        >
          <Select.Options items={list.items}>
            {(item) => (
              <Select.Option key={item.id} id={item.name}>
                {item.name}
              </Select.Option>
            )}
          </Select.Options>
        </Select.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Select is rendered with button", async () => {
      await expect(button).toBeInTheDocument();
    });

    await step("Select button can not be focused while loading", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });

    await step("Select can be focused when data is loaded", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Select opens on click", async () => {
      await userEvent.click(button!);
      // the popover is rendered via a react portal outside of the select root
      // and can only be found by querying the document directly
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });

    await step("Options are displayed when open", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await expect(options.length).toBe(6);
      await expect(options[0]).toHaveTextContent("Koala");
    });
  },
};

/**
 * Clearable
 * Demonstrates the isClearable prop which shows a clear button when a value is selected
 */
export const Clearable: Story = {
  render: () => {
    return (
      <Stack gap="600">
        <Box>
          <Text fontWeight="bold" mb="200">
            Clearable Select (isClearable=true)
          </Text>
          <Select.Root
            isClearable={true}
            defaultSelectedKey="apple"
            aria-label="Select a fruit"
            data-testid="clearable-select"
          >
            <Select.Options>
              <Select.Option id="apple">Apple</Select.Option>
              <Select.Option id="banana">Banana</Select.Option>
              <Select.Option id="orange">Orange</Select.Option>
            </Select.Options>
          </Select.Root>
        </Box>

        <Box>
          <Text fontWeight="bold" mb="200">
            Non-clearable Select (isClearable=false)
          </Text>
          <Select.Root
            isClearable={false}
            defaultSelectedKey="banana"
            aria-label="Select a fruit"
            data-testid="non-clearable-select"
          >
            <Select.Options>
              <Select.Option id="apple">Apple</Select.Option>
              <Select.Option id="banana">Banana</Select.Option>
              <Select.Option id="orange">Orange</Select.Option>
            </Select.Options>
          </Select.Root>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Clear button is rendered when isClearable=true and value is selected",
      async () => {
        const clearableSelect = canvas.getByTestId("clearable-select");
        const clearButton = clearableSelect.querySelector(
          '[aria-label="Clear selection"]'
        );
        await expect(clearButton).toBeInTheDocument();
      }
    );

    await step(
      "Clear button is NOT rendered when isClearable=false and value is selected",
      async () => {
        const nonClearableSelect = canvas.getByTestId("non-clearable-select");
        const clearButton = nonClearableSelect.querySelector(
          '[aria-label="Clear selection"]'
        );
        await expect(clearButton).not.toBeInTheDocument();
      }
    );

    await step(
      "Keyboard navigation to clear button clears the selection",
      async () => {
        const clearableSelect = canvas.getByTestId("clearable-select");
        const selectButton = clearableSelect.querySelector("button");

        // Verify initial selection
        await expect(selectButton).toHaveTextContent("Apple");

        // Find and activate the clear button with keyboard
        const clearButton = clearableSelect.querySelector(
          '[aria-label="Clear selection"]'
        ) as HTMLElement;

        // Use type to properly simulate keyboard interaction (handles focus + keypress)
        await userEvent.type(clearButton, "{Enter}");

        // Wait for the selection to be cleared
        await waitFor(
          () => {
            expect(selectButton).toHaveTextContent("Select an item");
          },
          { timeout: 1000 }
        );

        // Verify clear button disappears after clearing (it only renders when there's a selection)
        await waitFor(
          () => {
            const clearButtonAfter = clearableSelect.querySelector(
              '[aria-label="Clear selection"]'
            );
            expect(clearButtonAfter).not.toBeInTheDocument();
          },
          { timeout: 1000 }
        );
      }
    );
  },
};

// /**
//  * Disabled
//  * @see https://react-spectrum.adobe.com/react-aria/Select.html#disabled
//  */
export const Disabled: Story = {
  render: () => {
    return (
      <Select.Root
        isDisabled
        aria-label="Select some fruit(s)"
        data-testid="select"
      >
        <Select.Options>
          <Select.Option>Apples</Select.Option>
          <Select.Option>Bananas</Select.Option>
          <Select.Option>Oranges</Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Disabled select has disabled attribute", async () => {
      await expect(button).toHaveAttribute("disabled");
    });

    await step("Disabled select cannot be focused with keyboard", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });

    await step("Disabled select cannot be clicked to open", async () => {
      await expect(button).toHaveStyle({ pointerEvents: "none" });
    });
  },
};

export const DisabledOptions: Story = {
  render: () => {
    return (
      <Select.Root
        disabledKeys={["2"]}
        aria-label="Select some fruit(s)"
        data-testid="select"
      >
        <Select.Options>
          <Select.Option id="1">Apples</Select.Option>
          <Select.Option id="2">Bananas</Select.Option>
          <Select.Option id="3">Oranges</Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Select can be opened", async () => {
      await userEvent.click(button!);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });

    await step("Disabled option has aria-disabled attribute", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await expect(options[1]).toHaveAttribute("aria-disabled", "true");
    });

    await step("Enabled options can be selected", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[0]); // Select Apples
      await expect(button).toHaveTextContent("Apples");
    });

    await step("Disabled option cannot be selected", async () => {
      await userEvent.click(button!); // Open select again
      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[1]); // Try to select Bananas (disabled)
      // Select should remain on previously selected option
      await expect(button).toHaveTextContent("Apples");
    });
  },
};

/**
 * Invalid State
 * @see https://react-spectrum.adobe.com/react-aria/Select.html#validation
 */
export const Invalid: Story = {
  render: () => {
    return (
      <Select.Root
        isInvalid
        aria-label="Select some fruit(s)"
        data-testid="select"
      >
        <Select.Options>
          <Select.Option id="1">Apples</Select.Option>
          <Select.Option id="2">Bananas</Select.Option>
          <Select.Option id="3">Oranges</Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Invalid select has data-invalid attribute", async () => {
      await expect(select).toHaveAttribute("data-invalid", "true");
    });

    await step("Invalid select can still be opened and used", async () => {
      await userEvent.click(button!);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();

      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[0]);
      await expect(button).toHaveTextContent("Apples");
    });
  },
};

/**
 * Option Groups (Simple)
 */
export const OptionGroups: Story = {
  render: () => {
    return (
      <Box>
        <Select.Root aria-label="Select some fruit(s)" data-testid="select">
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
          </Select.Options>
        </Select.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Select can be opened", async () => {
      await userEvent.click(button!);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });

    await step("Option groups are rendered with proper roles", async () => {
      const groups = document.querySelectorAll('[role="group"]');
      await expect(groups.length).toBe(2);

      const groupLabels = document.querySelectorAll('[role="presentation"]');
      await expect(groupLabels[0]).toHaveTextContent("Fruits");
      await expect(groupLabels[1]).toHaveTextContent("Vegetables");
    });

    await step("Options within groups can be selected", async () => {
      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[1]); // Select Oranges from first group
      await expect(button).toHaveTextContent("Oranges");
    });
  },
};

/**
 * Option Groups (Dynamic)
 */
export const OptionGroupsDynamic: Story = {
  render: () => {
    return (
      <Box>
        <Select.Root aria-label="Select something to eat">
          <Select.Options items={optionGroupOptions}>
            {(groupItem) => (
              <Select.OptionGroup
                key={groupItem.id}
                label={groupItem.name}
                items={groupItem.children}
              >
                {(optionItem) => (
                  <Select.Option key={optionItem.id}>
                    {optionItem.name}
                  </Select.Option>
                )}
              </Select.OptionGroup>
            )}
          </Select.Options>
        </Select.Root>
      </Box>
    );
  },
};

/**
 * Label + additional descriptions
 * demonstrates the use of additional option descriptions
 * @see https://react-spectrum.adobe.com/react-aria/Select.html#text-slotss
 *
 * - test for textValue existance, otherwise typeahead won't work
 */
export const WithDescriptions: Story = {
  render: () => {
    return (
      <Select.Root aria-label="Select some fruit(s)" data-testid="select">
        <Select.Options>
          {/** Variant A - plain html-tags with slot property */}
          <Select.Option textValue="Apple">
            <p slot="label">Apple</p>
            <p slot="description">A classic and versatile fruit.</p>
          </Select.Option>
          {/** Variant B - text component with slot property */}
          <Select.Option textValue="Banana">
            <Text slot="label">Banana</Text>
            <Text slot="description">A good source of potassium.</Text>
          </Select.Option>
          <Select.Option textValue="Oranges">
            <Text slot="label">Oranges</Text>
            <Text slot="description">Rich in vitamin C.</Text>
          </Select.Option>
          <Select.Option textValue="Strawberries">
            <Text slot="label">Strawberries</Text>
            <Text slot="description">Sweet and full of antioxidants.</Text>
          </Select.Option>
          <Select.Option textValue="Grapes">
            <Text slot="label">Grapes</Text>
            <Text slot="description">
              Available in various colors and flavors.
            </Text>
          </Select.Option>
        </Select.Options>
      </Select.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByTestId("select");
    const button = select.querySelector("button");

    await step("Select opens on click", async () => {
      await userEvent.click(button!);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });

    await step("Options display labels and descriptions", async () => {
      const options = document.querySelectorAll('[role="option"]');

      // Check first option has label and description
      await expect(
        options[0].querySelector('[slot="label"]')
      ).toHaveTextContent("Apple");
      await expect(
        options[0].querySelector('[slot="description"]')
      ).toHaveTextContent("A classic and versatile fruit.");
    });

    await step("Typeahead works with textValue", async () => {
      // Type "b" to navigate to Banana
      await userEvent.keyboard("ba");
      const options = document.querySelectorAll('[role="option"]');

      // Check that Banana option is focused (has aria-selected)
      await expect(options[1]).toHaveAttribute("data-focused", "true");
    });
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
      <Select.Root width="196px" aria-label="Select something to eat">
        <Select.Options width="512px">
          <Select.Option>
            Extraordinary long Menu Label that noone can read Extraordinary long
            Menu Label that noone can read
          </Select.Option>
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
        <Select.Root aria-label="Select something">
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

/**
 * Variants and Sizes combined
 */
export const VariantsAndSizes: Story = {
  render: () => {
    const [isInvalid, setInvalid] = useState(false);
    return (
      <Stack>
        {[{}, { isDisabled: true }, { isInvalid: true }].map((props) => (
          <Stack
            key={JSON.stringify({ props })}
            bg="neutral.2"
            onClick={() => setInvalid(!isInvalid)}
          >
            {selectVariants.map((variant) => (
              <Stack alignItems="start" key={JSON.stringify({ variant })}>
                <Text my="400" fontWeight="600">
                  {JSON.stringify({ variant, ...props })}
                </Text>
                {selectSizes.map((size) => (
                  <Select.Root
                    size={size}
                    variant={variant}
                    key={JSON.stringify({ size })}
                    {...props}
                    aria-label="Select something"
                  >
                    <Select.Options>
                      <Select.Option>
                        Extraordinary long Menu Label that noone can read
                        Extraordinary long Menu Label that noone can read
                      </Select.Option>
                      <Select.Option>Groupless Option No 1.</Select.Option>
                      <Select.Option>Groupless Option No 2.</Select.Option>
                      <Select.Option>
                        <Text slot="label">Groupless Option No 3.</Text>
                        <Text slot="description">
                          At least this one has a description.
                        </Text>
                      </Select.Option>
                      <Select.Option>
                        <Text slot="label">Super freaking long</Text>
                        <Text slot="description">
                          At least this one has a description.
                        </Text>
                      </Select.Option>
                      <Select.OptionGroup label="Fruits">
                        <Select.Option>
                          <Text slot="label">Apples</Text>
                          <Text slot="description">
                            A crisp and juicy classic fruit.
                          </Text>
                        </Select.Option>
                        <Select.Option>
                          <Text slot="label">Oranges</Text>
                          <Text slot="description">
                            A sweet and tangy citrus fruit.
                          </Text>
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
                ))}
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Leading Element Examples
 * Demonstrates different leadingElement configurations with Select component
 */
export const LeadingElement: Story = {
  render: () => {
    const examples: Array<{
      label: string;
      props: Partial<React.ComponentProps<typeof Select.Root>>;
    }> = [
      {
        label: "Leading Icon - Search",
        props: {
          leadingElement: <Search />,
          "aria-label": "search-select",
        },
      },
      {
        label: "Leading Icon - Custom Icon",
        props: {
          leadingElement: <Icon as={AddReaction} />,
          "aria-label": "reaction-select",
        },
      },
      {
        label: "Leading Icon - Visibility",
        props: {
          leadingElement: <Icon as={Visibility} />,
          "aria-label": "visibility-select",
        },
      },
    ];

    return (
      <Stack direction="column" gap="600">
        {selectSizes.map((size) => (
          <Stack key={size as string} direction="column" gap="400">
            <Text fontWeight="semibold">Size: {size as string}</Text>
            <Stack direction="column" gap="300">
              {examples.map((example) => (
                <Stack
                  key={`${size as string}-${example.label}`}
                  direction="column"
                  gap="200"
                >
                  <Text fontSize="sm" color="neutral.11">
                    {example.label}
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {selectVariants.map((variant) => (
                      <Stack
                        key={variant as string}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <Select.Root
                          {...example.props}
                          size={size}
                          variant={variant}
                        >
                          <Select.Options>
                            <Select.Option id="option1">Option 1</Select.Option>
                            <Select.Option id="option2">Option 2</Select.Option>
                            <Select.Option id="option3">Option 3</Select.Option>
                            <Select.Option id="option4">Option 4</Select.Option>
                          </Select.Options>
                        </Select.Root>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
};
