import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useCallback, useMemo, type FormEvent } from "react";
import { type Key, type Selection } from "react-aria-components";
import { useAsyncList } from "react-stately";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  fn,
  waitFor,
} from "storybook/test";
import {
  FormField,
  Stack,
  Text,
  Box,
  Flex,
  RadioInput,
  Button,
  Icon,
} from "@/components";
import { ComboBox } from "./combobox";
import type { ComboBoxRootProps } from "./combobox.types";
import { AddReaction, Search } from "@commercetools/nimbus-icons";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ComboBox.Root> = {
  title: "components/ComboBox",
  component: ComboBox.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof ComboBox.Root>;

const options = [
  { id: 1, name: "Koala" },
  { id: 2, name: "Kangaroo" },
  { id: 3, name: "Platypus" },
  { id: 4, name: "Bald Eagle with a very long name hooray" },
  { id: 5, name: "Bison" },
  { id: 6, name: "Skunk" },
];

const sectionedItems = [
  {
    name: "Fruits",
    id: "fruit",
    children: [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
      { id: 6, name: "Orange" },
    ],
  },
  {
    name: "Vegetables",
    id: "veg",
    children: [
      { id: 3, name: "Carrot" },
      { id: 4, name: "Broccoli" },
      { id: 5, name: "Avocado" },
      { id: 7, name: "Cucumber" },
    ],
  },
];

// Type definitions for complex options
interface PlanOption {
  uuid: number;
  type: string;
  description: string;
  price: string;
  features: string[];
}

interface PlanGroup {
  name: string;
  id: string;
  children: PlanOption[];
}

const complexOptionsWithGroups: PlanGroup[] = [
  {
    name: "Individual Plans",
    id: "indplans",
    children: [
      {
        uuid: 3,
        type: "Starter Plan",
        description: "Great for individuals and small projects",
        price: "$9/month",
        features: ["Up to 3 projects", "Community support", "Basic features"],
      },
      {
        uuid: 1,
        type: "Premium Plan",
        description: "Full access to all features with priority support",
        price: "$29/month",
        features: ["Unlimited projects", "24/7 support", "Advanced analytics"],
      },
    ],
  },
  {
    name: "Business Plans",
    id: "busplans",
    children: [
      {
        uuid: 2,
        type: "Small Team Plan",
        description: "Perfect for growing teams and businesses",
        price: "$19/month",
        features: ["Up to 10 projects", "Email support", "Basic analytics"],
      },
      {
        uuid: 4,
        type: "Enterprise Plan",
        description: "Customized solution for large organizations",
        price: "Custom pricing",
        features: [
          "Unlimited everything",
          "Dedicated support",
          "Custom integrations",
        ],
      },
    ],
  },
];

// Helper functions to reduce test verbosity
const getTagList = async (multiSelect: HTMLElement) =>
  await within(multiSelect).findByLabelText(/selected values/i);

const getFilterInput = () =>
  document.querySelector(
    '[aria-label="filter combobox options"]'
  ) as HTMLInputElement;

const getListboxOptions = () => document.querySelectorAll('[role="option"]');

const findOptionByText = (text: string) =>
  Array.from(getListboxOptions()).find((option) =>
    option.textContent?.includes(text)
  );

const isOptionSelected = (option: Element | undefined) =>
  option?.getAttribute("aria-selected") === "true" ||
  option?.getAttribute("data-selected") === "true";

const selectOptionsByName = async (optionNames: string[]) => {
  for (const optionName of optionNames) {
    const option = findOptionByText(optionName);
    if (option) {
      // Select the option with a mouse click
      await userEvent.click(option);
    }
  }
};

const verifyTagsExist = async (
  multiSelect: HTMLElement,
  expectedTags: string[]
) => {
  const tagList = await getTagList(multiSelect);
  const tags = tagList.childNodes;
  await expect(tags.length).toBe(expectedTags.length);

  for (let i = 0; i < expectedTags.length; i++) {
    await expect(tags[i]).toHaveTextContent(expectedTags[i]);
  }
};

const verifyOptionsSelected = async (
  optionNames: string[],
  shouldBeSelected: boolean
) => {
  for (const name of optionNames) {
    const option = findOptionByText(name);
    await expect(isOptionSelected(option)).toBe(shouldBeSelected);
  }
};

const closePopover = async () => {
  await userEvent.keyboard("{escape}");
  // Wait for preventNextFocusOpen ref to be set to false via timeout
  await new Promise((resolve) => setTimeout(resolve, 51));
};

const mockFn = fn();

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  render: () => {
    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={options}
              placeholder="Select an animal..."
            >
              {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={options}
              selectionMode="multiple"
              placeholder="Select multiple animals..."
            >
              {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select combobox/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select combobox/i,
    });

    await step(
      "single select input is focusable and opens popover on focus",
      async () => {
        await userEvent.tab();
        await expect(singleSelect).toHaveFocus();
        // popover is activated when component is focused
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
      }
    );
    await step(
      "single select input when user enters text options in popover are filtered",
      async () => {
        // Enter 'k'
        await userEvent.keyboard("{k}");
        let options = getListboxOptions();
        // 'k' should show Koala and Kangaroo (and Skunk contains 'k')
        await expect(options.length).toBe(3);
        await userEvent.keyboard("{o}");
        options = getListboxOptions();
        await expect(options.length).toBe(1);
      }
    );
    await step(
      "single select input updates value to selected option and closes listbox when option is selected",
      async () => {
        const listbox = document.querySelector('[role="listbox"]');
        const option = document.querySelector('[role="option"]');
        await userEvent.click(option!);
        // Click should close listbox and populate input with selected value
        await expect(listbox).not.toBeInTheDocument();
        await expect(singleSelect.value).toBe("Koala");
        // Make sure koala option has selected state
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Koala"], true);
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "single select places cursor at beginning of input on focus when there is a previously selected value displayed",
      async () => {
        // Verify that cursor is at end of input while focused
        await expect(singleSelect).toHaveFocus();
        await expect(singleSelect.selectionStart).toBe(5);
        await expect(singleSelect.selectionEnd).toBe(5);
        // Click the document body to blur single select
        await userEvent.click(document.body);
        await expect(singleSelect).not.toHaveFocus();
        // Focus single select
        singleSelect.focus();
        // Wait for render frame to complete
        await waitFor(async () => {
          // Check that cursor is at position 0 (start of input)
          await expect(singleSelect.selectionStart).toBe(0);
          await expect(singleSelect.selectionEnd).toBe(0);
        });
        // Check that input's value is still "Koala"
        await expect(singleSelect.value).toBe("Koala");
      }
    );
    await step(
      "single select after focus replaces previous input value with user input, and filters options based input",
      async () => {
        // Check that input's value is still "Koala"
        await expect(singleSelect.value).toBe("Koala");
        // Type 'u'
        await userEvent.keyboard("u");
        // Input value is 'u'
        await expect(singleSelect.value).toBe("u");
        // There should be 2 options shown, 'playtypus' and 'skunk'
        await expect(getListboxOptions().length).toBe(2);
        await expect(findOptionByText("Platypus")).toBeInTheDocument();
        await expect(findOptionByText("Skunk")).toBeInTheDocument();
      }
    );
    await step(
      "single select replaces input value with previously selected value if user blurs input without selecting new value",
      async () => {
        // Check that input's value is still "u"
        await expect(singleSelect.value).toBe("u");
        // Blur the input
        await userEvent.tab();
        // Input value should be selectedKey value: 'Koala'
        await expect(singleSelect.value).toBe("Koala");
      }
    );
    await step(
      "single select replaces previously selected value if user selects new value after focus and typing",
      async () => {
        singleSelect.focus();
        // Wait for render frame to complete
        await waitFor(async () => {
          // Check that cursor is at position 0 (start of input)
          await expect(singleSelect.selectionStart).toBe(0);
          await expect(singleSelect.selectionEnd).toBe(0);
        });
        // Check that input's value is still "Koala"
        await expect(singleSelect.value).toBe("Koala");
        // Type 'u'
        await userEvent.keyboard("u");
        // Input value is 'u'
        await expect(singleSelect.value).toBe("u");
        // Select Platypus
        await selectOptionsByName(["Platypus"]);
        // Blur input
        await userEvent.tab();
        // Input value should be selectedKey value: 'Platypus'
        await expect(singleSelect.value).toBe("Platypus");
      }
    );
    await step(
      "single select clear button clears the combobox value",
      async () => {
        // Input value should be selectedKey value: 'Platypus'
        await expect(singleSelect.value).toBe("Platypus");
        const clearButton = await canvas.findByRole("button", {
          name: /clear selection/i,
        });
        // Click clear button
        await userEvent.click(clearButton);
        // Input value should be cleared
        await expect(singleSelect.value).toBe("");
        // Clear button should not be in the DOM
        await expect(clearButton).not.toBeInTheDocument();
      }
    );
    await step(
      "single select opens popover and focuses first option when user hits down arrow while input is focused",
      async () => {
        singleSelect.focus();
        await userEvent.keyboard("{ArrowDown}");
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        const options = getListboxOptions();
        // first option should be aria-activedescendant
        await expect(
          singleSelect.getAttribute("aria-activedescendant")
        ).toEqual(options[0].getAttribute("id"));
      }
    );
    await step(
      "single select closes popover and focuses input when esc key is hit",
      async () => {
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        await closePopover();
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(singleSelect).toHaveFocus();
      }
    );
    await step(
      "single select opens popover and focuses last option when user hits up arrow while input is focused",
      async () => {
        await userEvent.keyboard("{ArrowUp}");
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        const options = getListboxOptions();
        // last option should be aria-activedescendant
        await expect(
          singleSelect.getAttribute("aria-activedescendant")
        ).toEqual(options[options.length - 1].getAttribute("id"));
        // Close popover for next test
        await closePopover();
      }
    );
    await step("multi select opens popover on first focus", async () => {
      // Tab from single to multi select
      await userEvent.tab();
      // popover will open on focus if the combobox is not touched and there are no selected values
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
      const options = getListboxOptions();
      await expect(options.length).toBe(6);
      // input in popover should have focus
      const multiselectinput = getFilterInput();
      await expect(multiselectinput).toHaveFocus();
    });
    await step(
      "multi select closes popover and focuses combobox when esc key is hit",
      async () => {
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        await closePopover();
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(multiSelect).toHaveFocus();
      }
    );
    await step(
      "multi select opens listbox when focused a second time",
      async () => {
        singleSelect.focus();
        await userEvent.tab();
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        // close popover for next test
        await closePopover();
      }
    );
    await step("multi select toggles popover on click", async () => {
      // Click the root component
      await userEvent.click(multiSelect);
      // Toggle popover to open state
      await expect(
        document.querySelector('[role="listbox"]') as HTMLElement
      ).toBeInTheDocument();
      await expect(multiSelect.getAttribute("data-open")).toBe("true");
      // Click root component again
      // fireEvent used here due to this bug: https://github.com/testing-library/user-event/issues/1075#issuecomment-1948093169
      await fireEvent.click(multiSelect);
      // Toggle popover to closed state
      await expect(document.querySelector('[role="listbox"]')).toBeNull();
      await expect(multiSelect.getAttribute("data-open")).toBe("false");
    });
    await step(
      "multi select opens popover when focused and popover is closed and user presses enter",
      async () => {
        // Focus the multiselect combobox
        multiSelect.focus();
        // Close the popover
        await closePopover();
        // Ensure no popover is open initially
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        // Ensure multiselect has focus
        await expect(multiSelect).toHaveFocus();
        // Press Enter key
        await userEvent.keyboard("{enter}");
        // Verify popover opens
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
        // Verify options are visible
        const options = getListboxOptions();
        await expect(options.length).toBe(6);
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "multi select opens popover when focused and popover is closed and user presses down arrow",
      async () => {
        // Focus the multiselect combobox
        multiSelect.focus();
        // Close the popover
        await closePopover();
        // Ensure no popover is open initially
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        // Ensure multiselect has focus
        await expect(multiSelect).toHaveFocus();
        // Press ArrowDown key
        await userEvent.keyboard("{ArrowDown}");
        // Verify popover opens
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
        // Verify options are visible
        const options = getListboxOptions();
        await expect(options.length).toBe(6);
      }
    );
    await step("multi select filters options as user types", async () => {
      // Ensure popover is open from previous test
      await expect(
        document.querySelector('[role="listbox"]')
      ).toBeInTheDocument();
      // Initially all 6 options should be visible
      let options = getListboxOptions();
      await expect(options.length).toBe(6);
      // Type 'k' to filter options - should show Koala and Kangaroo (and Skunk contains 'k')
      const filterInput = getFilterInput();
      await expect(filterInput).toBeInTheDocument();
      // Clear any existing input and type 'k'
      await userEvent.clear(filterInput);
      await userEvent.type(filterInput, "k");
      // Verify filtered options - should show options containing 'k
      options = getListboxOptions();
      await expect(options.length).toBe(3); // Koala, Kangaroo, Skunk
      // Type 'o' to further filter - should show only Koala
      await userEvent.type(filterInput, "o");
      options = getListboxOptions();
      await expect(options.length).toBe(1); // Only Koala
      // Verify the remaining option is Koala
      const remainingOption = options[0];
      await expect(remainingOption).toHaveTextContent("Koala");
    });
    await step(
      "multi select allows selecting option with enter key and shows selection in taglist",
      async () => {
        // Ensure popover is open and filtered to show only Koala
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        let options = getListboxOptions();
        await expect(options.length).toBe(1);
        // Ensure filter input has focus
        const filterInput = getFilterInput();
        await expect(filterInput).toHaveFocus();
        // Press Enter to select the focused option (Koala)
        await userEvent.keyboard("{enter}");
        // Verify the option is selected by checking for a tag in the taglist
        let tagList = await getTagList(multiSelect);
        await expect(tagList).toBeInTheDocument();
        let tags = tagList.childNodes;
        // Verify the tag contains "Koala"
        const koalaTag = tags[0];
        await expect(koalaTag).toHaveTextContent("Koala");
        // Clear the filter to show all options again
        await userEvent.clear(filterInput);
        // Verify all options are visible again
        options = getListboxOptions();
        await expect(options.length).toBe(6);
        // Select another option using Enter key (navigate to Kangaroo and select it)
        await userEvent.keyboard("{ArrowDown}{ArrowDown}"); // Navigate to Kangaroo (second option)
        /**
         * Apparently this is what is causing the `act` warning in the storybook test
         * storybook has 3-4 issues about this, which they keep closing, but never seem to fix
         * most recent issue: https://github.com/storybookjs/storybook/issues/25304
         */
        await userEvent.keyboard("{enter}");
        // Verify we now have 2 tags
        tagList = await getTagList(multiSelect);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);
        // Verify the second tag contains "Kangaroo"
        const kangarooTag = tags[1];
        await expect(kangarooTag).toHaveTextContent("Kangaroo");
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "multi select clear all button clears all tags and selected options",
      async () => {
        // Verify we start with tags from the previous test (should have Koala and Kangaroo selected)
        let tagList = await getTagList(multiSelect);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(2);
        // Find and click the clear all button
        const clearAllButton = await within(multiSelect).findByRole("button", {
          name: /clear selection/i,
        });
        await expect(clearAllButton).toBeInTheDocument();
        // Click the clear all button
        await userEvent.click(clearAllButton);
        // Verify all tags are cleared
        // After clearing, the taglist will contain a placeholder
        tagList = await getTagList(multiSelect);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        // insure that the tagsList child is the placeholder
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);
        // Verify popover opens with all options visible (none filtered)
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
        const options = getListboxOptions();
        await expect(options.length).toBe(6);
        // Verify no options show as selected (check for aria-selected="true" or selected styling)
        for (const option of Array.from(options)) {
          // Check that no options are marked as selected
          const isSelected =
            option.getAttribute("aria-selected") === "true" ||
            option.getAttribute("data-selected") === "true";
          await expect(isSelected).toBe(false);
        }
        // Close popover
        await closePopover();
      }
    );
    await step(
      "multi select allows removing individual selections by clicking tag remove buttons",
      async () => {
        // Setup: Select 3 options
        multiSelect.focus();
        await userEvent.keyboard("{enter}");
        await selectOptionsByName(["Koala", "Kangaroo", "Platypus"]);
        await closePopover();
        // Verify initial state
        await verifyTagsExist(multiSelect, ["Koala", "Kangaroo", "Platypus"]);
        // Remove middle tag (Kangaroo)
        const tagList = await getTagList(multiSelect);
        const kangarooTag = tagList.childNodes[1] as HTMLElement;
        const removeButton = within(kangarooTag).getByRole("button", {
          name: /remove kangaroo/i,
        });
        await userEvent.click(removeButton);
        // Verify Kangaroo removed
        await verifyTagsExist(multiSelect, ["Koala", "Platypus"]);
        // Verify listbox state
        await userEvent.keyboard("{enter}");
        await verifyOptionsSelected(["Koala", "Platypus"], true);
        await verifyOptionsSelected(["Kangaroo"], false);
        await closePopover();
        // Remove first tag (Koala)
        const updatedTagList = await getTagList(multiSelect);
        const koalaTag = updatedTagList.childNodes[0] as HTMLElement;
        const koalaRemoveButton = within(koalaTag).getByRole("button", {
          name: /remove koala/i,
        });
        await userEvent.click(koalaRemoveButton);
        // Verify only Platypus remains
        await verifyTagsExist(multiSelect, ["Platypus"]);
      }
    );
    await step(
      "multi select allows removing selected options by clicking on them in the listbox",
      async () => {
        // Setup: Start with Platypus from previous test, add Koala and Kangaroo
        multiSelect.focus();
        await userEvent.keyboard("{enter}");
        await selectOptionsByName(["Koala", "Kangaroo"]);
        // Verify 3 tags total
        await verifyTagsExist(multiSelect, ["Platypus", "Koala", "Kangaroo"]);
        // Verify all options show as selected
        await verifyOptionsSelected(["Platypus", "Koala", "Kangaroo"], true);
        // Click Kangaroo option to deselect
        const kangarooOption = findOptionByText("Kangaroo");
        await userEvent.click(kangarooOption!);
        // Verify Kangaroo deselected
        await expect(isOptionSelected(kangarooOption)).toBe(false);
        await verifyTagsExist(multiSelect, ["Platypus", "Koala"]);
        // Click Koala option to deselect
        const koalaOption = findOptionByText("Koala");
        await userEvent.click(koalaOption!);
        await verifyTagsExist(multiSelect, ["Platypus"]);
        // Click Platypus option to deselect last item
        const platypusOption = findOptionByText("Platypus");
        await userEvent.click(platypusOption!);
        // Verify all cleared - placeholder shown
        const tagList = await getTagList(multiSelect);
        const tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);
        // Close popover
        await closePopover();
      }
    );
    await step(
      "multi select allows removing last selected item by hitting backspace when filter input is empty",
      async () => {
        // Setup: Select 3 options
        multiSelect.focus();
        await userEvent.keyboard("{enter}");
        await selectOptionsByName(["Koala", "Kangaroo", "Platypus"]);
        await verifyTagsExist(multiSelect, ["Koala", "Kangaroo", "Platypus"]);
        // Ensure filter input is empty and focused
        const filterInput = getFilterInput();
        await userEvent.clear(filterInput);
        filterInput.focus();
        // Test backspace removes items in LIFO order
        await userEvent.keyboard("{Backspace}");
        await verifyTagsExist(multiSelect, ["Koala", "Kangaroo"]);
        await userEvent.keyboard("{Backspace}");
        await verifyTagsExist(multiSelect, ["Koala"]);
        await userEvent.keyboard("{Backspace}");
        // Verify placeholder shown when all cleared
        const tagList = await getTagList(multiSelect);
        const tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);
        // Verify all options deselected
        await verifyOptionsSelected(["Koala", "Kangaroo", "Platypus"], false);
        // Test backspace does nothing when no selections
        await userEvent.keyboard("{Backspace}");
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);
        // Close popover
        await closePopover();
      }
    );
    await step(
      "multi select does not remove items with backspace when filter input has text",
      async () => {
        // Setup: Select 2 options
        multiSelect.focus();
        await userEvent.keyboard("{enter}");
        await selectOptionsByName(["Koala", "Kangaroo"]);
        await verifyTagsExist(multiSelect, ["Koala", "Kangaroo"]);
        // Type text in filter input
        const filterInput = getFilterInput();
        await userEvent.type(filterInput, "test");
        await expect(filterInput.value).toBe("test");
        // Backspace should remove text, not selections
        await userEvent.keyboard("{Backspace}");
        await expect(filterInput.value).toBe("tes");
        await verifyTagsExist(multiSelect, ["Koala", "Kangaroo"]);
        // Clear input completely, then backspace should remove selection
        await userEvent.clear(filterInput);
        await userEvent.keyboard("{Backspace}");
        await verifyTagsExist(multiSelect, ["Koala"]);
        // Close popover
        await closePopover();
      }
    );
    await step(
      "multi select - when items are selected clicking root component toggles popover",
      async () => {
        // Verify popover is closed
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(multiSelect.getAttribute("data-open")).toBe("false");
        // Click the root component
        await userEvent.click(multiSelect);
        // Verify popover is open
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        await expect(multiSelect.getAttribute("data-open")).toBe("true");
        // Click the root component
        await fireEvent.click(multiSelect);
        // Verify popover is closed
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(multiSelect.getAttribute("data-open")).toBe("false");
      }
    );
    await step(
      "multi select - when items are selected clicking remove item button expands popover",
      async () => {
        // Open popover
        multiSelect.focus();
        // Select multiple options
        await selectOptionsByName(["Koala"]);
        // Verify options selected
        await verifyTagsExist(multiSelect, ["Koala"]);
        // Close popover
        await closePopover();
        // Click the remove button
        const removeButton = await within(multiSelect).findByRole("button", {
          name: /remove koala/i,
        });
        await userEvent.click(removeButton);
        // Check popover is closed
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        await expect(multiSelect.getAttribute("data-open")).toBe("true");
        // Close popover
        await closePopover();
      }
    );
    await step(
      "multi select tab order goes from combobox to tag to clear button then outside combobox",
      async () => {
        // Focus combobox
        multiSelect.focus();
        // Select an option so tag exists for next test
        await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");
        // Close the popover after selection
        await userEvent.keyboard("{Escape}");
        // Focus combobox wrapper again
        multiSelect.focus();
        // Tab to tags
        await userEvent.tab();
        const tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        await expect(tagList.childNodes[0]).toHaveFocus();
        // Tab to remove tag button
        await userEvent.tab();
        const removeButton = within(
          tagList.childNodes[0] as HTMLElement
        ).getByRole("button", {
          name: /remove koala/i,
        });
        await expect(removeButton).toHaveFocus();
        // Tab to clear button
        await userEvent.tab();
        const clearButton =
          await within(multiSelect).findByLabelText(/clear selection/i);
        await expect(clearButton).toHaveFocus();
        // Tab to toggle button
        await userEvent.tab();
        await expect(multiSelect).not.toHaveFocus();
      }
    );
  },
};

/**
 * Controlled State
 * Demonstrates controlled usage patterns for single and multi-select
 */
export const ControlledState: Story = {
  args: {
    selectedKey: 2,
  },
  render: (args) => {
    const [controlledValue, setControlledValue] = useState<Key | null>(
      // @ts-expect-error - no good way to discriminate union prop from args while following rules of hooks
      args.selectedKey
    );
    const [controlledMultiValue, setControlledMultiValue] = useState<Selection>(
      new Set([1, 3])
    );
    const [singleInputValue, setSingleInputValue] = useState(
      // @ts-expect-error - no good way to discriminate union prop from args while following rules of hooks
      args.selectedKey
        ? // @ts-expect-error - no good way to discriminate union prop from args while following rules of hooks
          (options.find((o) => o.id === args.selectedKey)?.name ?? "")
        : ""
    );
    const [multiInputValue, setMultiInputValue] = useState("");

    // Wrapper functions that call both the state setter and mock function
    const handleSingleSelectionChange = (key: Key | null) => {
      // If the input is controlled, it is necessary to set the input value to the text value of the selected option
      const inputValue = options.find((o) => o.id === key)?.name ?? "";
      setSingleInputValue(inputValue);
      setControlledValue(key);
      mockFn(key, inputValue);
    };

    const handleMultiSelectionChange = (keys: Selection) => {
      setControlledMultiValue(keys);
      mockFn(keys);
    };

    // Input value change handlers
    const handleSingleInputChange = (value: string) => {
      setSingleInputValue(value);
      mockFn(value);
    };

    const handleMultiInputChange = (value: string) => {
      setMultiInputValue(value);
      mockFn(value);
    };

    // Helper function to get the display text for single selection
    const getSingleSelectionDisplay = (selectedKey: Key | null) => {
      if (!selectedKey) return "None";
      const selectedOption = options.find(
        (option) => option.id === selectedKey
      );
      return selectedOption
        ? `${selectedKey} (${selectedOption.name})`
        : selectedKey.toString();
    };

    // Helper function to get the display text for multiple selection
    const getMultiSelectionDisplay = (selectedKeys: Selection) => {
      if (selectedKeys === "all") return "All items";
      const selectedArray = Array.from(selectedKeys);
      if (selectedArray.length === 0) return "None";

      return selectedArray
        .map((key) => {
          const selectedOption = options.find((option) => option.id === key);
          return selectedOption
            ? `${key} (${selectedOption.name})`
            : key.toString();
        })
        .join(", ");
    };

    return (
      <Stack direction="column" gap="400">
        <Stack direction="row" gap="400">
          <FormField.Root alignSelf={"flex-start"}>
            <FormField.Label>Controlled Single-Select</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="controlled animals"
                defaultItems={options}
                selectedKey={controlledValue}
                onSelectionChange={handleSingleSelectionChange}
                inputValue={singleInputValue}
                onInputChange={handleSingleInputChange}
                placeholder="Select an animal..."
                leadingElement={<Icon as={AddReaction} />}
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Description data-testid="single-select-state">
              Selected: {getSingleSelectionDisplay(controlledValue)}
            </FormField.Description>
          </FormField.Root>
          <FormField.Root alignSelf={"flex-start"}>
            <FormField.Label>Controlled Multi-Select</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="controlled multi animals"
                defaultItems={options}
                selectionMode="multiple"
                selectedKeys={controlledMultiValue}
                onSelectionChange={handleMultiSelectionChange}
                inputValue={multiInputValue}
                onInputChange={handleMultiInputChange}
                placeholder="Select multiple animals..."
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Description data-testid="multi-select-state">
              Selected: {getMultiSelectionDisplay(controlledMultiValue)}
            </FormField.Description>
          </FormField.Root>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /controlled single-select/i,
    });
    const singleSelectStateValue = await canvas.findByTestId(
      "single-select-state"
    );
    const multiSelect = await canvas.findByRole("combobox", {
      name: /controlled multi-select/i,
    });
    const multiSelectStateValue =
      await canvas.findByTestId("multi-select-state");

    await step(
      "Single select shows text value of selected item in input and items option is selected in popover",
      async () => {
        // Focus
        singleSelect.focus();
        // Check that input value is text value of selected item from external state (2 - kangaroo)
        await expect(singleSelect.value).toBe("Kangaroo");
        // Check that external state in description is correct
        await expect(singleSelectStateValue.textContent).toBe(
          "Selected: 2 (Kangaroo)"
        );
        // Check that option for selected item from external state is selected in popover
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Kangaroo"], true);
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Single select updates external state when user selects a different option",
      async () => {
        // Focus
        singleSelect.focus();
        // Remove text from input, which opens popover
        await userEvent.clear(singleSelect);
        // Select koala option
        await selectOptionsByName(["Koala"]);
        // Verify that external state handler was called with correct value
        await expect(mockFn).toHaveBeenCalledWith(1, "Koala");
        // Verfiy that expected input value is correct
        await expect(singleSelect.value).toBe("Koala");
        // Check that external state in description is correct
        await expect(singleSelectStateValue.textContent).toBe(
          "Selected: 1 (Koala)"
        );
        // Open popover and verify that Koala option is selected and Kangaroo is not
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Koala"], true);
        await verifyOptionsSelected(["Kangaroo"], false);
      }
    );
    await step(
      "Multi select shows text value of selected items from props in tags and options are selected in popover",
      async () => {
        // Focus
        multiSelect.focus();
        // Check that input value is text value of selected item from external state (2 - kangaroo)
        await verifyTagsExist(multiSelect, ["Koala", "Platypus"]);
        // Check that external state in description is correct
        await expect(multiSelectStateValue.textContent).toBe(
          "Selected: 1 (Koala), 3 (Platypus)"
        );
        // Check that options for selected items from external state are selected in popover
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Koala", "Platypus"], true);
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Multi select updates external state when user selects a different option",
      async () => {
        // Focus
        multiSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Select skunk option
        await selectOptionsByName(["Skunk"]);
        // Verify that external state handler was called with correct value
        await expect(mockFn).toHaveBeenCalled();
        // Verfiy that expected input value is correct
        await expect(singleSelect.value).toBe("Koala");
        // Check that external state in description is correct
        await expect(multiSelectStateValue.textContent).toBe(
          "Selected: 1 (Koala), 3 (Platypus), 6 (Skunk)"
        );
        // Check that options for selected items from external state are selected in popover
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Koala", "Platypus", "Skunk"], true);
        // Check that options for unselected items are not selected in popover
        await verifyOptionsSelected(
          ["Kangaroo", "Bald Eagle with a very long name hooray", "Bison"],
          false
        );
      }
    );
  },
};

/**
 * All Variants and Sizes
 * Comprehensive display of all available variants and sizes for both single and multi-select
 */
export const AllVariantsAndSizes: Story = {
  render: () => {
    const sizes = ["sm", "md"] as const;
    const variants = ["solid", "ghost"] as const;

    return (
      <Stack direction="column" gap="600">
        {variants.map((variant) => (
          <Stack key={variant} direction="column" gap="400">
            <Text fontSize="500" fontWeight="600" textTransform="capitalize">
              {variant} Variant
            </Text>
            {sizes.map((size) => (
              <Stack key={`${variant}-${size}`} direction="column" gap="300">
                <h4>Size: {size.toUpperCase()}</h4>
                <Stack direction="row" gap="400">
                  <FormField.Root alignSelf={"flex-start"}>
                    <FormField.Label>{`Single Select ${variant} ${size}`}</FormField.Label>
                    <FormField.Input>
                      <ComboBox.Root
                        defaultItems={options}
                        size={size}
                        variant={variant}
                        placeholder={`type to search...`}
                      >
                        {(item) => (
                          <ComboBox.Option>{item.name}</ComboBox.Option>
                        )}
                      </ComboBox.Root>
                    </FormField.Input>
                  </FormField.Root>
                  <FormField.Root alignSelf={"flex-start"}>
                    <FormField.Label>{`Multi-Select ${variant} ${size}`}</FormField.Label>
                    <FormField.Input>
                      <ComboBox.Root
                        defaultItems={options}
                        selectionMode="multiple"
                        size={size}
                        variant={variant}
                        placeholder={`focus to search...`}
                      >
                        {(item) => (
                          <ComboBox.Option>{item.name}</ComboBox.Option>
                        )}
                      </ComboBox.Root>
                    </FormField.Input>
                  </FormField.Root>
                </Stack>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

/**
 * Leading and Trailing Elements
 * Display of ComboBox with leading and trailing elements in various configurations
 */
export const LeadingElements: Story = {
  render: () => {
    const examples: Array<{
      label: string;
      props?: Partial<ComboBoxRootProps<{ id: number; name: string }>>;
      getProps?: (
        size: "sm" | "md"
      ) => Partial<ComboBoxRootProps<{ id: number; name: string }>>;
    }> = [
      {
        label: "Without Leading Element",
        props: {
          placeholder: "Select items...",
          "aria-label": "basic-combobox",
        },
      },
      {
        label: "With Leading Icon",
        props: {
          placeholder: "Search items...",
          leadingElement: <Search />,
          "aria-label": "search-combobox",
        },
      },
    ];

    const inputSize = ["sm", "md"] as const;
    const inputVariants = ["solid", "ghost"] as const;

    return (
      <Stack direction="column" gap="600">
        {inputSize.map((size) => (
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
                    {inputVariants.map((variant) => (
                      <Stack
                        key={variant as string}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <ComboBox.Root
                          defaultItems={options}
                          {...(example.getProps
                            ? example.getProps(size)
                            : example.props)}
                          size={size}
                          variant={variant}
                        >
                          {(item) => (
                            <ComboBox.Option>{item.name}</ComboBox.Option>
                          )}
                        </ComboBox.Root>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}

        <Stack direction="column" gap="400">
          <Text fontWeight="semibold">Multi-Select Variants</Text>
          {inputSize.map((size) => (
            <Stack key={`multi-${size as string}`} direction="column" gap="300">
              <Text fontSize="sm" color="neutral.11">
                Size: {size as string}
              </Text>
              <Stack direction="column" gap="300">
                <Stack direction="column" gap="200">
                  <Text fontSize="sm" color="neutral.11">
                    With Leading Icon
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {inputVariants.map((variant) => (
                      <Stack
                        key={`multi-with-icon-${variant as string}`}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <ComboBox.Root
                          defaultItems={options}
                          selectionMode="multiple"
                          size={size}
                          variant={variant}
                          placeholder="Search multiple items..."
                          leadingElement={<Search />}
                          aria-label={`multi-with-icon-${variant as string}-${size as string}`}
                        >
                          {(item) => (
                            <ComboBox.Option>{item.name}</ComboBox.Option>
                          )}
                        </ComboBox.Root>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                <Stack direction="column" gap="200">
                  <Text fontSize="sm" color="neutral.11">
                    Without Leading Element
                  </Text>
                  <Stack direction="row" gap="400" alignItems="center">
                    {inputVariants.map((variant) => (
                      <Stack
                        key={`multi-without-icon-${variant as string}`}
                        direction="column"
                        gap="100"
                      >
                        <Text fontSize="xs" color="neutral.10">
                          {variant as string}
                        </Text>
                        <ComboBox.Root
                          defaultItems={options}
                          selectionMode="multiple"
                          size={size}
                          variant={variant}
                          placeholder="Select multiple items..."
                          aria-label={`multi-without-icon-${variant as string}-${size as string}`}
                        >
                          {(item) => (
                            <ComboBox.Option>{item.name}</ComboBox.Option>
                          )}
                        </ComboBox.Root>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  },
};

export const OptionGroups: Story = {
  render: () => {
    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select with Option Groups</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={sectionedItems}
              placeholder="Select a food item..."
            >
              {(section) => (
                <ComboBox.OptionGroup
                  label={section.name}
                  items={section.children}
                >
                  {(item) => (
                    <ComboBox.Option textValue={item.name}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select with Option Groups</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={sectionedItems}
              selectionMode="multiple"
              placeholder="Select multiple food items..."
            >
              {(section) => (
                <ComboBox.OptionGroup
                  label={section.name}
                  items={section.children}
                >
                  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select with option groups/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select with option groups/i,
    });

    await step(
      "Single Select option groups are rendered with proper roles",
      async () => {
        // Focus combobox
        singleSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Find sections
        const groups = document.querySelectorAll(
          '[role="listbox"] [role="group"]'
        );
        await expect(groups.length).toBe(2);
        // Check section labels
        const groupLabels = document.querySelectorAll('[role="presentation"]');
        await expect(groupLabels[0]).toHaveTextContent("Fruits");
        await expect(groupLabels[1]).toHaveTextContent("Vegetables");
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Single Select options are filtered correctly when user enters text",
      async () => {
        // Focus combobox
        singleSelect.focus();
        // Hit 'a' key
        await userEvent.keyboard("{a}");
        let options = getListboxOptions();
        // There are 5 options with 'a' in them
        await expect(options.length).toBe(5);
        // There are options with 'a' in both sections
        let groups = document.querySelectorAll(
          '[role="listbox"] [role="group"]'
        );
        await expect(groups.length).toBe(2);
        // Hit 'p' key
        await userEvent.keyboard("{p}");
        options = getListboxOptions();
        // There is only one option with 'ap'
        await expect(options.length).toBe(1);
        await expect(findOptionByText("Apple")).toBeInTheDocument();
        // there is only one section displayed
        groups = document.querySelectorAll('[role="listbox"] [role="group"]');
        await expect(groups.length).toBe(1);
        const groupLabels = document.querySelectorAll('[role="presentation"]');
        await expect(groupLabels[0]).toHaveTextContent("Fruits");
        // Close popover for next test
        await closePopover();
      }
    );
    await step("Single Select options can be selected", async () => {
      // Focus combobox
      singleSelect.focus();
      // Open popover
      await userEvent.keyboard("{ArrowDown}");
      // Select apple option
      await selectOptionsByName(["Apple"]);
      // Input value should be 'apple'
      await expect(singleSelect).toHaveValue("Apple");
      // Open listbox check that apple option has selected state
      await userEvent.keyboard("{ArrowDown}");
      await verifyOptionsSelected(["Apple"], true);
      // Close popover for next test
      await closePopover();
    });
    await step(
      "Multi Select option groups are rendered with proper roles",
      async () => {
        // Focus combobox
        multiSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Find sections
        const groups = document.querySelectorAll(
          '[role="listbox"] [role="group"]'
        );
        await expect(groups.length).toBe(2);
        // Check section labels
        const groupLabels = document.querySelectorAll('[role="presentation"]');
        await expect(groupLabels[0]).toHaveTextContent("Fruits");
        await expect(groupLabels[1]).toHaveTextContent("Vegetables");
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Multi Select options are filtered correctly when user enters text",
      async () => {
        // Focus combobox
        multiSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Hit 'a' key
        await userEvent.keyboard("{a}");
        let options = getListboxOptions();
        // There are 5 options with 'a' in them
        await expect(options.length).toBe(5);
        // There are options with 'a' in both sections
        let groups = document.querySelectorAll(
          '[role="listbox"] [role="group"]'
        );
        await expect(groups.length).toBe(2);
        // Hit 'p' key
        await userEvent.keyboard("{p}");
        options = getListboxOptions();
        // There is only one option with 'ap'
        await expect(options.length).toBe(1);
        await expect(findOptionByText("Apple")).toBeInTheDocument();
        // there is only one section displayed
        groups = document.querySelectorAll('[role="listbox"] [role="group"]');
        await expect(groups.length).toBe(1);
        const groupLabels = document.querySelectorAll('[role="presentation"]');
        await expect(groupLabels[0]).toHaveTextContent("Fruits");
        // Clear input and close popover for next test
        const filterInput = getFilterInput();
        await userEvent.clear(filterInput);
        await closePopover();
      }
    );
    await step(
      "Multi Select options can be selected from multiple sections",
      async () => {
        // Focus combobox
        multiSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Select apple option in fruits section
        await selectOptionsByName(["Apple"]);
        // TagList should have apple tag
        await verifyTagsExist(multiSelect, ["Apple"]);
        // Apple option should be selected
        await verifyOptionsSelected(["Apple"], true);
        // Select carrot option in vegetables section
        const carrotOption = findOptionByText("Carrot");
        await userEvent.click(carrotOption!);
        // TagList should have apple and carrot tag
        await verifyTagsExist(multiSelect, ["Apple", "Carrot"]);
        // Apple and carrot options should be selected
        await verifyOptionsSelected(["Apple", "Carrot"], true);
        // All other options should not be selected
        await verifyOptionsSelected(
          ["Banana", "Orange", "Broccoli", "Avocado", "Cucumber"],
          false
        );
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Multi select selected option can be removed by pressing its' tag's remove button",
      async () => {
        // Focus combobox
        multiSelect.focus();
        // Remove carrot tag
        const tagList = await getTagList(multiSelect);
        const carrotTag = tagList.childNodes[1] as HTMLElement;
        const removeButton = within(carrotTag).getByRole("button", {
          name: /remove carrot/i,
        });
        await userEvent.click(removeButton);
        // Verify carrot tag is removed
        await expect(carrotTag).not.toBeInTheDocument();
        // Verify apple tag exists
        await verifyTagsExist(multiSelect, ["Apple"]);
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Verify Apple is selected
        await verifyOptionsSelected(["Apple"], true);
        // Verify all other options not selected
        await verifyOptionsSelected(
          ["Banana", "Orange", "Carrot", "Broccoli", "Avocado", "Cucumber"],
          false
        );
        // Close popover for next test
        await closePopover();
      }
    );
    await step(
      "Multi select selected option can be removed by selecting its option",
      async () => {
        // Focus combobox
        multiSelect.focus();
        const tagList = await getTagList(multiSelect);
        const appleTag = tagList.childNodes[0] as HTMLElement;
        // Verify appleTag exists
        await expect(appleTag).toBeInTheDocument();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Select Apple option
        await selectOptionsByName(["Apple"]);
        // Verify apple tag is removed
        await expect(appleTag).not.toBeInTheDocument();
        // Verify all options not selected
        await verifyOptionsSelected(
          [
            "Apple",
            "Banana",
            "Orange",
            "Carrot",
            "Broccoli",
            "Avocado",
            "Cucumber",
          ],
          false
        );
        // Close popover for next test
        await closePopover();
      }
    );
  },
};

/**
 * Complex Options with Descriptions Example
 * Demonstrates handling item objects that do not have an `id` key.  An `id` key is necessary to allow the selection of items in the dropdown.
 * When there is no `id` key:
 * - `<ComboBox.Option>` the `id` prop must be set on to the name of the item key that can be used instead
 * - `<ComboBox.Root>` multiselect: the `itemId` prop must be set to match the `id` prop passed to `<ComboBox.Option>`
 *
 * Demonstrates handling item objects that do not have a `name` key.  A `name` key is necessary to allow filtering in the dropdown and displaying selected values in the multi-select.
 * When there is no `name` key:
 * - `<ComboBox.Option>` the `textValue` prop must be set on to the name of the item key that can be used to display the option
 * - `<ComboBox.Root>` multiselect: the `itemValue` prop must be set to match the `textValue` prop passed to `<ComboBox.Option>`
 *
 * Demonstrates options with rich content including descriptions for both single and multi-select
 */
export const ComplexOptions: Story = {
  render: () => {
    const PlanOptionComponent = ({ item }: { item: PlanOption }) => (
      <Flex direction="column" gap="100">
        <Flex justify="space-between" align="center" fontWeight="bold">
          <Text slot="label">{item.type}</Text>
          <Text color="positive.11">{item.price}</Text>
        </Flex>
        <Text slot="description" color="neutral.12">
          {item.description}
        </Text>
        <Text textStyle="xs" lineHeight="400" color="neutral.11">
          {item.features.join(" • ")}
        </Text>
      </Flex>
    );

    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select Plan</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={complexOptionsWithGroups}
              placeholder="Choose a plan..."
            >
              {(group) => (
                <ComboBox.OptionGroup label={group.name} items={group.children}>
                  {(item) => (
                    <ComboBox.Option id={item.uuid} textValue={item.type}>
                      <PlanOptionComponent item={item} />
                    </ComboBox.Option>
                  )}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
          <FormField.Description>
            <Text as="pre">
              Combobox.Root: itemId and itemValue not necessary in single-select
            </Text>
            <Text as="pre">
              Combobox.Option: id=item.uuid, textValue=item.type
            </Text>
          </FormField.Description>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select Plans</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={complexOptionsWithGroups}
              selectionMode="multiple"
              placeholder="Compare multiple plans..."
              itemId="uuid"
              itemValue="type"
            >
              {(group) => (
                <ComboBox.OptionGroup label={group.name} items={group.children}>
                  {(item) => (
                    <ComboBox.Option id={item.uuid} textValue={item.type}>
                      <PlanOptionComponent item={item} />
                    </ComboBox.Option>
                  )}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
          <FormField.Description>
            <Text as="pre">Combobox.Root: itemId=uuid itemValue=type</Text>
            <Text as="pre">
              Combobox.Option: id=item.uuid, textValue=item.type
            </Text>
          </FormField.Description>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select plan/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select plans/i,
    });
    await step("Options display labels and descriptions", async () => {
      singleSelect.focus();
      await userEvent.keyboard("{ArrowDown}");
      const starterPlanOption = findOptionByText("Starter Plan");
      await expect(
        starterPlanOption?.querySelector('[slot="label"]')
      ).toHaveTextContent("Starter Plan");
      await expect(
        starterPlanOption?.querySelector('[slot="description"]')
      ).toHaveTextContent("Great for individuals and small projects");
      // Close popover for next test
      await closePopover();
    });
    await step("single select displays options in popover", async () => {
      // Focus the input
      singleSelect.focus();
      // Open the popover
      await userEvent.keyboard("{ArrowDown}");
      // Check that there are the expected number of options
      await expect(getListboxOptions().length).toBe(4);
      // Close popover for next test
      await closePopover();
    });
    await step(
      "single select filters options and allows for selection when user enters text in input",
      async () => {
        singleSelect.focus();
        // Type 's'
        await userEvent.keyboard("{s}");
        // 'Premium Plan' option should be filtered out
        await expect(getListboxOptions().length).toBe(3);
        // Type 't'
        await userEvent.keyboard("{t}");
        // 'Small Team' and 'Enterprise' plans should be filtered out
        await expect(getListboxOptions().length).toBe(1);
        // Select 'Stater Plan' option
        await selectOptionsByName(["Starter Plan"]);
        // Popover should be closed
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(singleSelect.getAttribute("aria-expanded")).toBe("false");
        // Input value should be 'Starter Plan'
        await expect(singleSelect.value).toBe("Starter Plan");
        // 'Starter Plan' option should be selected
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Starter Plan"], true);
        // Other options should not be selected
        await verifyOptionsSelected(
          ["Enterprise Plan", "Small Team Plan", "Premium Plan"],
          false
        );
        // Close popover for next test
        await closePopover();
      }
    );
    await step("multi select displays options in popover", async () => {
      // Focus the component
      multiSelect.focus();
      // Open the popover
      await userEvent.keyboard("{ArrowDown}");
      // Check that there are the expected number of options
      await expect(getListboxOptions().length).toBe(4);
      // Close popover for next test
      await closePopover();
    });
    await step(
      "multi select filters options and allows for selection when user enters text in input",
      async () => {
        multiSelect.focus();
        // Open popover
        await userEvent.keyboard("{ArrowDown}");
        // Type 's'
        await userEvent.keyboard("{s}");
        // 'Premium Plan' option should be filtered out
        await expect(getListboxOptions().length).toBe(3);
        // Select  'Starter Plan' option in 'individual plans' section and 'Enterprise Plan' and 'Small Team Plan' in business plans section
        await selectOptionsByName([
          "Starter Plan",
          "Enterprise Plan",
          "Small Team Plan",
        ]);
        // TagsList should include tags for all 3 selected plans
        await verifyTagsExist(multiSelect, [
          "Starter Plan",
          "Enterprise Plan",
          "Small Team Plan",
        ]);
        // Clear filter input
        await userEvent.clear(getFilterInput());
        // 3 options should be selected
        await verifyOptionsSelected(
          ["Starter Plan", "Enterprise Plan", "Small Team Plan"],
          true
        );
        // Premium plan option should not be selected
        await verifyOptionsSelected(["Premium Plan"], false);
        // Close popover for next test
        await closePopover();
      }
    );
    await step("multi select tags can be removed", async () => {
      const tagList = await getTagList(multiSelect);
      const enterpriseTag = tagList.childNodes[1] as HTMLElement;
      const removeButton = within(enterpriseTag).getByRole("button", {
        name: /remove enterprise plan/i,
      });
      await userEvent.click(removeButton);
      // TagsList should include tags for Starter Plan and Small Team Plan
      await verifyTagsExist(multiSelect, ["Starter Plan", "Small Team Plan"]);
      // Open popover
      await userEvent.keyboard("{ArrowDown}");
      // 2 options should be selected
      await verifyOptionsSelected(["Starter Plan", "Small Team Plan"], true);
      // Premium plan and Enterprise plan should not be selected
      await verifyOptionsSelected(["Premium Plan", "Enterprise Plan"], false);
      // Close popover for next test
      await closePopover();
    });
  },
};

/**
 * Async Loading Example
 * Demonstrates fetching data from an API with search functionality
 * - for single-select to display options on initial search, the `allowsEmptyCollection` prop must be `true`
   - when `allowsEmptyCollection` is true, it is advisable to also provide a component to display via the `renderEmptyState` prop
 `
 */
export const AsyncLoading: Story = {
  render: () => {
    const singleSelectState = useAsyncList<{ id: number; name: string }>({
      async load() {
        // Add 500ms delay before returning results, so that we can test loading state reliably
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { items: options };
      },
    });
    const multiSelectState = useAsyncList<{ id: number; name: string }>({
      async load() {
        // Add 500ms delay before returning results, so that we can test loading state reliably
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { items: options };
      },
    });
    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select Async</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={singleSelectState.items}
              // Workaround for known combobox bug (single select), allowsEmptyCollection should be set for async loaded items to trigger opening the dropdown on initial load
              // https://github.com/adobe/react-spectrum/issues/5234
              allowsEmptyCollection={true}
              renderEmptyState={() => (
                <Text color="neutral.11" fontStyle="italic">
                  {singleSelectState.loadingState === "loading"
                    ? "loading..."
                    : "no results"}
                </Text>
              )}
              isLoading={singleSelectState.loadingState === "loading"}
              placeholder="select a character..."
            >
              {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select Async</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={multiSelectState.items}
              isLoading={multiSelectState.loadingState === "loading"}
              selectionMode="multiple"
              placeholder="select characters..."
            >
              {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select async/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select async/i,
    });
    await step(
      "loading spinner is displayed when options are loaded",
      async () => {
        await within(singleSelect.parentElement!).findByTestId(
          "nimbus-combobox-loading"
        );
        await within(multiSelect).findByTestId("nimbus-combobox-loading");
      }
    );
    await step(
      "single select options are displayed when loaded, and are selectable",
      async () => {
        singleSelect.focus();
        await userEvent.keyboard("{k}");
        // Popover is displayed
        const listbox = document.querySelector(
          '[role="listbox"]'
        ) as HTMLElement;
        await expect(listbox).toBeInTheDocument();
        // Options are displayed
        await within(listbox).findByRole("option", { name: /koala/i });
        // Options are filtered based on input
        await expect(getListboxOptions().length).toBe(3);
        // Select Koala option
        await selectOptionsByName(["Koala"]);
        // Input value should be koala
        await expect(singleSelect.value).toBe("Koala");
        // Koala option is selected
        await userEvent.keyboard("{ArrowDown}");
        await verifyOptionsSelected(["Koala"], true);
        // Close popover for next test
        await closePopover();
      }
    );

    await step(
      "multi select options are displayed when loaded, and are selectable",
      async () => {
        multiSelect.focus();
        await userEvent.keyboard("{k}");
        // Popover is displayed
        const listbox = document.querySelector(
          '[role="listbox"]'
        ) as HTMLElement;
        await expect(listbox).toBeInTheDocument();
        // Options are displayed
        await within(listbox).findByRole("option", { name: /koala/i });
        // Options are filtered based on input
        await expect(getListboxOptions().length).toBe(3);
        // Select Koala option
        await selectOptionsByName(["Koala"]);
        // Koala tag is visible
        await verifyTagsExist(multiSelect, ["Koala"]);
        // Koala option is selected
        await verifyOptionsSelected(["Koala"], true);
        // Close popover for next test
        await closePopover();
      }
    );
  },
};
/**
 * Create Custom Value Example
 * Demonstrates custom value creation and validation for both single and multi-select
 */
export const CreateCustomValue: Story = {
  render: () => {
    // Single select state
    const [singleSelectedItem, setSingleSelectedItem] = useState<Key | null>(
      null
    );
    const [singleCustomItems, setSingleCustomItems] = useState<
      Array<{ id: string; name: string }>
    >([]);
    const [singleInputValue, setSingleInputValue] = useState("");
    // Multi-select state
    const [multiSelectedItems, setMultiSelectedItems] = useState<Selection>(
      new Set()
    );
    const [multiCustomItems, setMultiCustomItems] = useState<
      Array<{ id: string; name: string }>
    >([]);
    const [multiInputValue, setMultiInputValue] = useState("");

    const singleAllItems = useMemo(
      () => [...options, ...singleCustomItems],
      [singleCustomItems]
    );
    const multiAllItems = useMemo(
      () => [...options, ...multiCustomItems],
      [multiCustomItems]
    );
    const handleSingleSelectionChange = (key: Key | null) => {
      const nextInputValue =
        singleAllItems.find((o) => o.id === key)?.name ?? "";
      setSingleSelectedItem(key);
      setSingleInputValue(nextInputValue);
    };
    const handleSingleCustomValue = (value: string) => {
      mockFn();
      // Add custom item
      const newItem = { id: `single-custom-${Date.now()}`, name: value };
      setSingleCustomItems((prev) => [...prev, newItem]);
      setSingleSelectedItem(newItem.id);
    };
    const handleMultiCustomValue = (value: string) => {
      mockFn();
      // Add custom item
      const newItem = { id: `multi-custom-${Date.now()}`, name: value };
      setMultiCustomItems((prev) => [...prev, newItem]);
      setMultiSelectedItems((prev) => {
        const newSelection = new Set(prev);
        newSelection.add(newItem.id);
        return newSelection;
      });
    };
    // Input change handlers
    const handleSingleInputChange = (value: string) => {
      setSingleInputValue(value);
    };
    const handleMultiInputChange = (value: string) => {
      setMultiInputValue(value);
    };

    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select with Custom Values</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              allowsCustomValue
              onSubmitCustomValue={handleSingleCustomValue}
              defaultItems={singleAllItems}
              selectedKey={singleSelectedItem}
              onSelectionChange={handleSingleSelectionChange}
              inputValue={singleInputValue}
              onInputChange={handleSingleInputChange}
              placeholder="Select or create an item..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  textValue={item.name}
                >
                  {item.name}
                  {singleCustomItems.some((custom) => custom.id === item.id) &&
                    " (Custom)"}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select with Custom Values</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              allowsCustomValue
              onSubmitCustomValue={handleMultiCustomValue}
              defaultItems={multiAllItems}
              selectionMode="multiple"
              selectedKeys={multiSelectedItems}
              onSelectionChange={setMultiSelectedItems}
              inputValue={multiInputValue}
              onInputChange={handleMultiInputChange}
              placeholder="Select or create items..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  textValue={item.name}
                >
                  {item.name}
                  {multiCustomItems.some((custom) => custom.id === item.id) &&
                    " (Custom)"}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select with custom values/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select with custom values/i,
    });

    await step(
      "single select allows setting a custom value when the submitted value does not match an existing option",
      async () => {
        singleSelect.focus();
        // Type in string that does not match any options
        await userEvent.keyboard("koa");
        // Create custom 'koa' option by hitting 'enter'
        await userEvent.keyboard("{Enter}");
        // Check that onCreateCustomValue has been called
        await expect(mockFn).toHaveBeenCalled();
      }
    );
    await step(
      "single select does not allow setting a custom value when the submitted value matches an existing option",
      async () => {
        mockFn.mockClear();
        singleSelect.focus();
        // Clear input
        await userEvent.clear(singleSelect);
        // Type in string that does matches an option
        await userEvent.keyboard("koala");
        // Select 'koala' option by hitting 'enter'
        await userEvent.keyboard("{Enter}");
        // Check that onCreateCustomValue has not been called
        await expect(mockFn).not.toHaveBeenCalled();
      }
    );
    await step(
      "multi select allows setting a custom value when the submitted value does not match an existing option",
      async () => {
        mockFn.mockClear();
        multiSelect.focus();
        // Type in string that does not match any options
        await userEvent.keyboard("koa");
        // Create custom 'koa' option by hitting 'enter'
        await userEvent.keyboard("{Enter}");
        // Check that onCreateCustomValue has been called
        await expect(mockFn).toHaveBeenCalled();
      }
    );
    await step(
      "single select does not allow setting a custom value when the submitted value matches an existing option",
      async () => {
        mockFn.mockClear();
        // Clear input
        await userEvent.clear(getFilterInput());
        // Type in string that does matches an option
        await userEvent.keyboard("koala");
        // Select 'koala' option by hitting 'enter'
        await userEvent.keyboard("{Enter}");
        // Check that onCreateCustomValue has not been called
        await expect(mockFn).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * Disabled and Read-Only Comboboxes Example
 * Demonstrates disabled and read-only comboboxes side by side for both single and multi-select modes
 * - Disabled comboboxes do not allow any interaction and have disabled styling
 * - Read-only comboboxes can be focused but do not allow any updates
 */
export const DisabledAndReadOnlyComboboxes: Story = {
  render: () => {
    const [variant, setVariant] = useState<"solid" | "ghost">("solid");
    return (
      <Stack direction="column" gap="600">
        <Stack direction="column" gap="300">
          <h3>Single Select ComboBoxes</h3>
          <Stack direction="row" gap="400">
            <FormField.Root alignSelf={"flex-start"} isDisabled>
              <FormField.Label>Disabled Single Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  isDisabled
                  defaultSelectedKey={2}
                  variant={variant}
                  placeholder="This combobox is disabled..."
                >
                  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Disabled - cannot interact at all
              </FormField.Description>
            </FormField.Root>
            <FormField.Root alignSelf={"flex-start"} isReadOnly>
              <FormField.Label>Read-Only Single Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  isReadOnly
                  variant={variant}
                  defaultSelectedKey={2}
                  placeholder="This combobox is read-only..."
                >
                  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Read-only - can focus but not change value
              </FormField.Description>
            </FormField.Root>
          </Stack>
        </Stack>
        <Stack direction="column" gap="300">
          <h3>Multi-Select ComboBoxes</h3>
          <Stack direction="row" gap="400">
            <FormField.Root alignSelf={"flex-start"} isDisabled>
              <FormField.Label>Disabled Multi-Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  selectionMode="multiple"
                  isDisabled
                  variant={variant}
                  defaultSelectedKeys={new Set([1, 3, 5])}
                  placeholder="This combobox is disabled..."
                >
                  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Disabled - cannot interact at all
              </FormField.Description>
            </FormField.Root>
            <FormField.Root alignSelf={"flex-start"} isReadOnly>
              <FormField.Label>Read-Only Multi-Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  selectionMode="multiple"
                  isReadOnly
                  variant={variant}
                  defaultSelectedKeys={new Set([1, 3, 5])}
                  placeholder="This combobox is read-only..."
                >
                  {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Read-only - can focus but not change values
              </FormField.Description>
            </FormField.Root>
          </Stack>
        </Stack>
        <RadioInput.Root
          onChange={setVariant as (value: string) => void}
          value={variant}
          orientation="horizontal"
          aria-label="choose variant"
        >
          <RadioInput.Option value="solid">Solid</RadioInput.Option>
          <RadioInput.Option value="ghost">Ghost</RadioInput.Option>
        </RadioInput.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelectDisabled: HTMLInputElement = await canvas.findByRole(
      "combobox",
      {
        name: /disabled single select/i,
      }
    );
    const multiSelectDisabled = await canvas.findByRole("combobox", {
      name: /disabled multi-select/i,
    });
    const singleSelectReadOnly: HTMLInputElement = await canvas.findByRole(
      "combobox",
      {
        name: /read-only single select/i,
      }
    );
    const multiSelectReadOnly = await canvas.findByRole("combobox", {
      name: /read-only multi-select/i,
    });
    await step(
      "Disabled comboboxes are not focusable, read-only comboboxes are focusable",
      async () => {
        await userEvent.tab();
        // First tab should skip disabled single select
        await expect(singleSelectDisabled).not.toHaveFocus();
        // First tab focuses read only single select
        await expect(singleSelectReadOnly).toHaveFocus();
        // Focusing single select does not open listbox
        await expect(
          document.querySelector('[role="listbox"]')
        ).not.toBeInTheDocument();
        await userEvent.tab();
        // Second tab skips multi disabled
        await expect(multiSelectDisabled).not.toHaveFocus();
        // focusing multi-select does not open listbox
        await expect(
          document.querySelector('[role="listbox"]')
        ).not.toBeInTheDocument();
      }
    );
    await step("Disabled single select has disabled attributes", async () => {
      await expect(singleSelectDisabled).toHaveAttribute("disabled");
      await expect(singleSelectDisabled).toHaveStyle({
        pointerEvents: "none",
      });
      // the input has the 'combobox' role in the single select, we need to target the wrapper container to check for the not-allowed cursor
      await expect(singleSelectDisabled.parentElement).toHaveStyle({
        cursor: "not-allowed",
      });
    });
    await step("Disabled single select cannot be clicked to open", async () => {
      await userEvent.click(singleSelectDisabled, { pointerEventsCheck: 0 });
      await expect(getListboxOptions().length).toBe(0);
      await expect(singleSelectDisabled).toHaveStyle({ pointerEvents: "none" });
    });
    await step("Disabled single select buttons are disabled", async () => {
      const buttons = await within(
        singleSelectDisabled.parentElement!
      ).findAllByRole("button");
      for (let i = 0; i < buttons.length; i++) {
        await expect(buttons[i]).toHaveStyle({ pointerEvents: "none" });
        await expect(buttons[i]).toHaveAttribute("disabled");
      }
    });
    await step("Disabled multi select has disabled attributes", async () => {
      await expect(multiSelectDisabled.getAttribute("aria-disabled")).toBe(
        "true"
      );
      await expect(multiSelectDisabled).toHaveStyle({
        cursor: "not-allowed",
      });
    });
    await step("Disabled multi select cannot be clicked to open", async () => {
      await userEvent.click(multiSelectDisabled);
      await expect(getListboxOptions().length).toBe(0);
    });
    await step("Disabled multi select tag group is disabled", async () => {
      const tagGroup = multiSelectDisabled.childNodes[1] as HTMLElement;
      await expect(tagGroup.getAttribute("data-disabled")).toBe("true");
      await expect(tagGroup).toHaveStyle({
        pointerEvents: "none",
      });
    });
    await step("Disabled multi select buttons are disabled", async () => {
      const buttons = await within(multiSelectDisabled).findAllByRole("button");
      for (let i = 0; i < buttons.length; i++) {
        await expect(buttons[i]).toHaveStyle({ pointerEvents: "none" });
        await expect(buttons[i]).toHaveAttribute("disabled");
      }
    });
    await step("Read Only single select has read-only attributes", async () => {
      await expect(singleSelectReadOnly).toHaveAttribute("readonly");
      await expect(singleSelectReadOnly).not.toHaveAttribute("disabled");
      await expect(singleSelectReadOnly).not.toHaveStyle({
        pointerEvents: "none",
      });
      // the input has the 'combobox' role in the single select, we need to target the wrapper container to check for the not-allowed cursor
      await expect(singleSelectReadOnly.parentElement).not.toHaveStyle({
        cursor: "not-allowed",
      });
    });
    await step(
      "Read Only single select cannot be clicked to open",
      async () => {
        await userEvent.click(singleSelectReadOnly);
        await expect(getListboxOptions().length).toBe(0);
        await expect(singleSelectReadOnly).not.toHaveStyle({
          pointerEvents: "none",
        });
      }
    );
    await step("Read Only single select buttons are disabled", async () => {
      const buttons = await within(
        singleSelectReadOnly.parentElement!
      ).findAllByRole("button");
      for (let i = 0; i < buttons.length; i++) {
        await expect(buttons[i]).toHaveStyle({ userSelect: "none" });
        await expect(buttons[i]).toHaveAttribute("disabled");
      }
    });
    await step("Read Only multi select has readonly attributes", async () => {
      await expect(multiSelectReadOnly.getAttribute("aria-readonly")).toBe(
        "true"
      );
      await expect(multiSelectReadOnly).not.toHaveAttribute("aria-disabled");
      await expect(multiSelectReadOnly).not.toHaveStyle({
        cursor: "not-allowed",
      });
    });
    await step("Read Only multi select cannot be clicked to open", async () => {
      await userEvent.click(multiSelectReadOnly);
      await expect(getListboxOptions().length).toBe(0);
    });
    await step("Read Only multi select tag group is not disabled", async () => {
      const tagGroup = multiSelectReadOnly.childNodes[1] as HTMLElement;
      await expect(tagGroup).not.toHaveAttribute("data-disabled");
      await expect(tagGroup).not.toHaveStyle({
        pointerEvents: "none",
      });
    });
    await step("Read Only multi select buttons are disabled", async () => {
      const buttons = await within(multiSelectReadOnly).findAllByRole("button");
      for (let i = 0; i < buttons.length; i++) {
        await expect(buttons[i]).toHaveStyle({ userSelect: "none" });
        await expect(buttons[i]).toHaveAttribute("disabled");
      }
    });
  },
};

/**
 * Disabled Options Example
 * Demonstrates disabled options in both single and multi-select comboboxes
 */
export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { id: 1, name: "Koala", isDisabled: false },
      { id: 2, name: "Kangaroo", isDisabled: true },
      { id: 3, name: "Platypus", isDisabled: false },
      { id: 4, name: "Bald Eagle", isDisabled: true },
      { id: 5, name: "Bison", isDisabled: false },
      { id: 6, name: "Skunk", isDisabled: true },
    ];

    return (
      <Stack direction="row" gap="400">
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Single Select with Disabled Options</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={optionsWithDisabled}
              placeholder="Select an animal..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  isDisabled={item.isDisabled}
                >
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
          <FormField.Description>
            Kangaroo, Bald Eagle, and Skunk are disabled
          </FormField.Description>
        </FormField.Root>
        <FormField.Root alignSelf={"flex-start"}>
          <FormField.Label>Multi-Select with Disabled Options</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={optionsWithDisabled}
              selectionMode="multiple"
              placeholder="Select multiple animals..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  isDisabled={item.isDisabled}
                >
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
          <FormField.Description>
            Kangaroo, Bald Eagle, and Skunk are disabled
          </FormField.Description>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select with disabled options/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select with disabled options/i,
    });
    const disabledOptions = ["Kangaroo", "Bald Eagle", "Skunk"];
    await step("Single select can be opened", async () => {
      singleSelect.focus();
      await userEvent.keyboard("{ArrowDown}");
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });
    await step("Disabled options have aria-disabled attribute", async () => {
      for (let i = 0; i < disabledOptions.length; i++) {
        const option = findOptionByText(disabledOptions[i]);
        await expect(option).toHaveAttribute("aria-disabled", "true");
      }
    });
    await step("Enabled options can be selected", async () => {
      await selectOptionsByName(["Koala"]);
      await expect(singleSelect.value).toBe("Koala");
      await userEvent.keyboard("{ArrowDown}");
      await verifyOptionsSelected(["Koala"], true);
    });
    await step("Disabled options cannot be selected", async () => {
      await selectOptionsByName(disabledOptions);
      await expect(singleSelect.value).toBe("Koala");
      // Close for next test
      await closePopover();
    });
    await step("Disabled options cannot be selected via keyboard", async () => {
      singleSelect.focus();
      // Open popover
      await userEvent.keyboard("{ArrowDown}");
      // Koala is active option
      await expect(findOptionByText("Koala")?.getAttribute("id")).toBe(
        singleSelect.getAttribute("aria-activedescendant")
      );
      // Go to next item
      await userEvent.keyboard("{ArrowDown}");
      // Kangaroo is skipped
      await expect(findOptionByText("Kangaroo")?.getAttribute("id")).not.toBe(
        singleSelect.getAttribute("aria-activedescendant")
      );
      // Platypus is active option
      await expect(findOptionByText("Platypus")?.getAttribute("id")).toBe(
        singleSelect.getAttribute("aria-activedescendant")
      );
      // Close for next test
      await closePopover();
    });
    await step("Multi select can be opened", async () => {
      multiSelect.focus();
      await userEvent.keyboard("{ArrowDown}");
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();
    });
    await step("Disabled options have aria-disabled attribute", async () => {
      for (let i = 0; i < disabledOptions.length; i++) {
        const option = findOptionByText(disabledOptions[i]);
        await expect(option).toHaveAttribute("aria-disabled", "true");
      }
    });
    await step("Enabled options can be selected", async () => {
      await selectOptionsByName(["Koala", "Platypus", "Bison"]);
      await verifyTagsExist(multiSelect, ["Koala", "Platypus", "Bison"]);
      await verifyOptionsSelected(["Koala", "Platypus", "Bison"], true);
    });
    await step("Disabled options cannot be selected", async () => {
      await selectOptionsByName(disabledOptions);
      await verifyOptionsSelected(disabledOptions, false);
      // Close for next test
      await closePopover();
    });
    await step("Disabled options cannot be selected via keyboard", async () => {
      multiSelect.focus();
      // Open popover
      await userEvent.keyboard("{ArrowDown}");
      // Select first option
      await userEvent.keyboard("{ArrowDown}");
      // Koala is active option
      await expect(findOptionByText("Koala")?.getAttribute("id")).toBe(
        getFilterInput().getAttribute("aria-activedescendant")
      );
      // Go to next item
      await userEvent.keyboard("{ArrowDown}");
      // Kangaroo is skipped
      await expect(findOptionByText("Kangaroo")?.getAttribute("id")).not.toBe(
        getFilterInput().getAttribute("aria-activedescendant")
      );
      // Platypus is active option
      await expect(findOptionByText("Platypus")?.getAttribute("id")).toBe(
        getFilterInput().getAttribute("aria-activedescendant")
      );
    });
  },
};

/**
 * Form Validation Example
 * Shows advanced validation states and error messaging
 */
export const FormValidation: Story = {
  render: () => {
    // Variant state
    const [variant, setVariant] = useState<"solid" | "ghost">("solid");
    // Single select state
    const [selectedValue, setSelectedValue] = useState<Key | null>(null);
    const [isInvalid, setIsInvalid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("Please select an option");

    // Multi-select state
    const [multiSelectedValues, setMultiSelectedValues] = useState<Selection>(
      new Set()
    );
    const [multiIsInvalid, setMultiIsInvalid] = useState(true);
    const [multiErrorMessage, setMultiErrorMessage] = useState(
      "Please select at least one option"
    );

    const handleSelectionChange = (key: Key | null) => {
      setSelectedValue(key);

      // Custom validation logic
      if (key === null || key === "") {
        setIsInvalid(true);
        setErrorMessage("Please select an option");
      } else if (key === 6) {
        setIsInvalid(true);
        setErrorMessage("Skunk is not allowed for safety reasons");
      } else {
        setIsInvalid(false);
        setErrorMessage("");
      }
    };

    const handleMultiSelectionChange = (keys: Selection) => {
      setMultiSelectedValues(keys);

      // Multi-select validation logic
      if (keys instanceof Set && keys.size === 0) {
        setMultiIsInvalid(true);
        setMultiErrorMessage("Please select at least one option");
      } else if (keys instanceof Set && keys.has(6)) {
        setMultiIsInvalid(true);
        setMultiErrorMessage("Skunk is not allowed for safety reasons");
      } else if (keys instanceof Set && keys.size > 3) {
        setMultiIsInvalid(true);
        setMultiErrorMessage("Maximum 3 selections allowed");
      } else {
        setMultiIsInvalid(false);
        setMultiErrorMessage("");
      }
    };

    return (
      <Stack direction="column" gap="600">
        <Stack direction="row" gap="400">
          <FormField.Root
            alignSelf={"flex-start"}
            isInvalid={isInvalid}
            isRequired
          >
            <FormField.Label>Single Select with Validation</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                defaultItems={options}
                selectedKey={selectedValue}
                onSelectionChange={handleSelectionChange}
                variant={variant}
                placeholder="Select an animal..."
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Description>
              Select 'Skunk' option to trigger invalid selected state
            </FormField.Description>
            {errorMessage && <FormField.Error>{errorMessage}</FormField.Error>}
          </FormField.Root>
          <FormField.Root
            alignSelf={"flex-start"}
            isInvalid={multiIsInvalid}
            isRequired
          >
            <FormField.Label>Multi-Select with Validation</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                defaultItems={options}
                selectionMode="multiple"
                selectedKeys={multiSelectedValues}
                onSelectionChange={handleMultiSelectionChange}
                variant={variant}
                placeholder="Select multiple animals..."
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Description>
              Select 'Skunk' option to trigger invalid selected state
            </FormField.Description>
            {multiErrorMessage && (
              <FormField.Error>{multiErrorMessage}</FormField.Error>
            )}
          </FormField.Root>
        </Stack>
        <RadioInput.Root
          onChange={setVariant as (value: string) => void}
          value={variant}
          orientation="horizontal"
          aria-label="choose variant"
        >
          <RadioInput.Option value="solid">Solid</RadioInput.Option>
          <RadioInput.Option value="ghost">Ghost</RadioInput.Option>
        </RadioInput.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const singleSelect: HTMLInputElement = await canvas.findByRole("combobox", {
      name: /single select with validation/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select with validation/i,
    });

    await step("Invalid single select has invalid attributes", async () => {
      await expect(singleSelect).toHaveAttribute("aria-invalid", "true");
      await expect(singleSelect).toHaveAttribute("data-invalid", "true");
    });
    await step("Invalid single select can be opened and used", async () => {
      singleSelect.focus();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      await expect(singleSelect.value).toBe("Koala");
      // Close for next test
      await closePopover();
    });
    await step(
      "Invalid single select updates state when isInvalid is updated",
      async () => {
        await expect(singleSelect).not.toHaveAttribute("aria-invalid");
        await expect(singleSelect).not.toHaveAttribute("data-invalid");
      }
    );
    await step("Invalid multi select has invalid attributes", async () => {
      await expect(multiSelect).toHaveAttribute("aria-invalid", "true");
      await expect(multiSelect).toHaveAttribute("data-invalid", "true");
    });
    await step("Invalid multi select can be opened and used", async () => {
      multiSelect.focus();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      await verifyTagsExist(multiSelect, ["Koala"]);
      // Close for next test
      await closePopover();
    });
    await step(
      "Invalid multi select updates state when isInvalid is updated",
      async () => {
        await expect(multiSelect).toHaveAttribute("aria-invalid", "false");
        await expect(multiSelect).toHaveAttribute("data-invalid", "false");
      }
    );
  },
};

/**
 * Formik Integration
 * Demonstrates integration with Formik form library and explores multiple
 * approaches to overcome TypeScript union type issues with Selection's 'all' literal.
 */
export const FormikIntegration: Story = {
  render: () => {
    // Simulating Formik pattern - in real implementation you'd import from 'formik'
    const [formData, setFormData] = useState<{
      animal: Key | null;
      animals: Selection;
    }>({
      animal: null,
      animals: new Set(),
    });
    const [errors, setErrors] = useState<{
      animal?: string;
      animals?: string;
    }>({});
    const [touched, setTouched] = useState<{
      animal?: boolean;
      animals?: boolean;
    }>({});
    const [inputValue, setInputValue] = useState<string>("");
    // Simulate Formik's validation function
    const validate = (values: typeof formData) => {
      const newErrors: typeof errors = {};
      if (!values.animal) {
        newErrors.animal = "Please select an animal";
      }
      if (values.animals instanceof Set && values.animals.size === 0) {
        newErrors.animals = "Please select at least one animal";
      }
      return newErrors;
    };
    // Simulate Formik's handleSubmit
    const handleSubmit = (e: FormEvent) => {
      console.log("handling submission");
      e.preventDefault();
      // Always clear previous errors before validation
      setErrors({});
      const validationErrors = validate(formData);
      console.log("Validation errors:", validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        // Success - reset form and show success message
        alert(
          `Form submitted successfully!\n${JSON.stringify(
            {
              animal: formData.animal,
              animals:
                formData.animals === "all"
                  ? "all"
                  : Array.from(formData.animals),
            },
            null,
            2
          )}`
        );
        // Reset form state after successful submission
        setFormData({ animal: null, animals: new Set() });
        setInputValue("");
        setTouched({});
      } else {
        // Validation failed - show errors and mark fields as touched
        setErrors(validationErrors);
        setTouched({ animal: true, animals: true });
      }
    };
    // Reset form function
    const resetForm = () => {
      setFormData({ animal: null, animals: new Set() });
      setInputValue("");
      setErrors({});
      setTouched({});
    };
    // Curried handlers - return functions that can be used directly in props
    const handleSingleValueSelectionChange = useCallback(
      (fieldName: string) => (selectedId: Key | null) => {
        const selectedOption = options.find(
          (option) => option.id === selectedId
        );
        setInputValue(selectedOption ? selectedOption.name : "");
        setFormData((prev) => ({ ...prev, [fieldName]: selectedId }));
        setTouched((prev) => ({ ...prev, [fieldName]: true }));

        // Clear field-specific error when user makes a change
        if (errors[fieldName as keyof typeof errors]) {
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
      },
      [errors]
    );
    const handleMultiValueSelectionChange = useCallback(
      (fieldName: string) => (value: Selection) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        setTouched((prev) => ({ ...prev, [fieldName]: true }));

        // Clear field-specific error when user makes a change
        if (errors[fieldName as keyof typeof errors]) {
          setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
        }
      },
      [errors]
    );
    return (
      <Stack direction="column" gap="md" asChild>
        <form onSubmit={handleSubmit}>
          <h3>Formik Integration Pattern</h3>
          <p>
            This demonstrates how to integrate ComboBox with Formik&apos;s form
            handling patterns.
          </p>

          <FormField.Root isInvalid={!!(errors.animal && touched.animal)}>
            <FormField.Label>Single Select Animal:</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                id="animal"
                name="animal"
                defaultItems={options}
                selectedKey={formData.animal}
                onInputChange={setInputValue}
                inputValue={inputValue}
                onSelectionChange={handleSingleValueSelectionChange("animal")}
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Error>{errors.animal}</FormField.Error>
          </FormField.Root>
          <FormField.Root isInvalid={!!(errors.animals && touched.animals)}>
            <FormField.Label>Multi-Select Animals:</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                id="animals"
                name="animals"
                defaultItems={options}
                selectionMode="multiple"
                selectedKeys={formData.animals}
                onSelectionChange={handleMultiValueSelectionChange("animals")}
              >
                {(item) => <ComboBox.Option>{item.name}</ComboBox.Option>}
              </ComboBox.Root>
            </FormField.Input>
            <FormField.Error>{errors.animals}</FormField.Error>
          </FormField.Root>
          <Stack direction="row" gap="200" mt="200">
            <Button tone="primary" type="submit">
              Submit Form
            </Button>
            <Button variant="ghost" onPress={resetForm}>
              Reset Form
            </Button>
          </Stack>
          <Box mt="400">
            <Text fontWeight="600" fontSize="400">
              Form State (Formik-style):
            </Text>
            <Box fontSize="350" fontFamily="mono">
              <Text fontWeight="600">Values:</Text>
              <Box my="200" p="200" bg="neutral.3" borderRadius="200" as="pre">
                {JSON.stringify(
                  {
                    animal: formData.animal,
                    animals:
                      formData.animals === "all"
                        ? "all"
                        : Array.from(formData.animals),
                  },
                  null,
                  2
                )}
              </Box>
              <Text fontWeight="600">Errors:</Text>
              <Box my="200" p="200" bg="neutral.3" borderRadius="200" as="pre">
                {JSON.stringify(errors, null, 2)}
              </Box>
              <Text fontWeight="600">Touched:</Text>
              <Box my="200" p="200" bg="neutral.3" borderRadius="200" as="pre">
                {JSON.stringify(touched, null, 2)}
              </Box>
            </Box>
          </Box>
        </form>
      </Stack>
    );
  },
};
