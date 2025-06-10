import type { Meta, StoryObj } from "@storybook/react";
import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type FormEvent,
} from "react";
import type { Key, Selection } from "react-aria-components";
import { userEvent, within, expect } from "@storybook/test";
import { FormField, Stack, Text, Box, Flex, Badge } from "@/components";
import { ComboBox } from "./combobox";

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

interface TeamMember {
  uuid: number;
  full_name: string;
  role: string;
  department: string;
  email: string;
  status: "online" | "away" | "offline";
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
        uuid: 1,
        type: "Premium Plan",
        description: "Full access to all features with priority support",
        price: "$29/month",
        features: ["Unlimited projects", "24/7 support", "Advanced analytics"],
      },

      {
        uuid: 3,
        type: "Starter Plan",
        description: "Great for individuals and small projects",
        price: "$9/month",
        features: ["Up to 3 projects", "Community support", "Basic features"],
      },
    ],
  },
  {
    name: "Business Plans",
    id: "busplans",
    children: [
      {
        uuid: 2,
        type: "Business Plan",
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

const complexOptions: TeamMember[] = [
  {
    uuid: 1,
    full_name: "Sarah Chen",
    role: "Senior Frontend Developer",
    department: "Engineering",
    email: "sarah.chen@company.com",
    status: "online",
  },
  {
    uuid: 2,
    full_name: "Marcus Johnson",
    role: "Product Manager",
    department: "Product",
    email: "marcus.johnson@company.com",
    status: "away",
  },
  {
    uuid: 3,
    full_name: "Elena Rodriguez",
    role: "UX Designer",
    department: "Design",
    email: "elena.rodriguez@company.com",
    status: "online",
  },
  {
    uuid: 4,
    full_name: "David Kim",
    role: "Backend Developer",
    department: "Engineering",
    email: "david.kim@company.com",
    status: "offline",
  },
  {
    uuid: 5,
    full_name: "Priya Patel",
    role: "Data Scientist",
    department: "Analytics",
    email: "priya.patel@company.com",
    status: "online",
  },
];

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  render: () => {
    return (
      <Stack direction="row" gap="400">
        <FormField.Root>
          <FormField.Label>Single Select ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={options}
              placeholder="Select an animal..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>

        <FormField.Root>
          <FormField.Label>Multi-Select ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              items={options}
              selectionMode="multiple"
              placeholder="Select multiple animals..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
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
      name: /single select combobox/i,
    });
    const multiSelect = await canvas.findByRole("combobox", {
      name: /multi-select combobox/i,
    });

    await step("single select input can be focused with keyboard", async () => {
      await userEvent.tab();
      await expect(singleSelect).toHaveFocus();
    });

    await step(
      "single select input opens popover when user enters text",
      async () => {
        await userEvent.keyboard("{k}");

        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
      }
    );
    await step(
      "single select input shows matching options in popover",
      async () => {
        let options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(3);
        await userEvent.keyboard("{o}");
        options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(1);
      }
    );
    await step(
      "single select input updates value to selected option and closes listbox when option is selected",
      async () => {
        const listbox = document.querySelector('[role="listbox"]');
        const option = document.querySelector('[role="option"]');
        await userEvent.click(option!);
        await expect(listbox).not.toBeInTheDocument();
        await expect(singleSelect.value).toBe("Koala");
      }
    );
    await step(
      "single select clear button clears the combobox value",
      async () => {
        const clearButton = await canvas.findByRole("button", {
          name: /clear selection/i,
        });
        await userEvent.click(clearButton);
        await expect(singleSelect.value).toBe("");
      }
    );
    await step(
      "single select does not open popover when user hits enter or space while input is focused",
      async () => {
        singleSelect.focus();
        await userEvent.keyboard("{enter}");
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await userEvent.keyboard("{space}");
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
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
        const options = document.querySelectorAll('[role="option"]');
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
        await userEvent.keyboard("{escape}");
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
        const options = document.querySelectorAll('[role="option"]');
        await expect(
          singleSelect.getAttribute("aria-activedescendant")
        ).toEqual(options[options.length - 1].getAttribute("id"));
      }
    );
    await step(
      "multi select opens popover on first focus when no items have been selected",
      async () => {
        multiSelect.focus();
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();
        const options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(6);
        const multiselectinput = document.querySelector(
          '[aria-label="filter combobox options"]'
        );
        await expect(multiselectinput).toHaveFocus();
      }
    );
    await step(
      "multi select closes popover and focuses combobox when esc key is hit",
      async () => {
        await expect(
          document.querySelector('[role="listbox"]')
        ).toBeInTheDocument();
        await userEvent.keyboard("{escape}");
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
        await expect(multiSelect).toHaveFocus();
      }
    );

    await step(
      "multi select does not open listbox when focused a second time",
      async () => {
        singleSelect.focus();
        multiSelect.focus();
        await expect(document.querySelector('[role="listbox"]')).toBeNull();
      }
    );
    await step(
      "multi select opens popover when focused and user presses enter",
      async () => {
        // Ensure no popover is open initially
        await expect(document.querySelector('[role="listbox"]')).toBeNull();

        // Focus the multiselect combobox
        multiSelect.focus();
        await expect(multiSelect).toHaveFocus();

        // Press Enter key
        await userEvent.keyboard("{enter}");

        // Verify popover opens
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        // Verify options are visible
        const options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(6);

        // Close popover for next test
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select opens popover when focused and user presses down arrow",
      async () => {
        // Ensure no popover is open initially
        await expect(document.querySelector('[role="listbox"]')).toBeNull();

        // Focus the multiselect combobox
        multiSelect.focus();
        await expect(multiSelect).toHaveFocus();

        // Press ArrowDown key
        await userEvent.keyboard("{ArrowDown}");

        // Verify popover opens
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        // Verify options are visible
        const options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(6);
      }
    );
    await step("multi select filters options as user types", async () => {
      // Ensure popover is open from previous test
      await expect(
        document.querySelector('[role="listbox"]')
      ).toBeInTheDocument();
      // Initially all 6 options should be visible
      let options = document.querySelectorAll('[role="option"]');
      await expect(options.length).toBe(6);
      // Type 'k' to filter options - should show Koala and Kangaroo (and Skunk contains 'k')
      const filterInput = document.querySelector(
        '[aria-label="filter combobox options"]'
      ) as HTMLInputElement;
      await expect(filterInput).toBeInTheDocument();
      // Clear any existing input and type 'k'
      await userEvent.clear(filterInput);
      await userEvent.type(filterInput, "k");
      // Verify filtered options - should show options containing 'k'
      options = document.querySelectorAll('[role="option"]');
      await expect(options.length).toBe(3); // Koala, Kangaroo, Skunk
      // Type 'o' to further filter - should show only Koala
      await userEvent.type(filterInput, "o");
      options = document.querySelectorAll('[role="option"]');
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
        let options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(1);

        const filterInput = document.querySelector(
          '[aria-label="filter combobox options"]'
        ) as HTMLInputElement;
        await expect(filterInput).toHaveFocus();

        // Press Enter to select the focused option (Koala)
        await userEvent.keyboard("{enter}");

        // Verify the option is selected by checking for a tag in the taglist
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        await expect(tagList).toBeInTheDocument();
        let tags = tagList.childNodes;
        // Verify the tag contains "Koala"
        const koalaTag = tags[0];
        await expect(koalaTag).toHaveTextContent("Koala");

        // Clear the filter to show all options again
        await userEvent.clear(filterInput);

        // Verify all options are visible again
        options = document.querySelectorAll('[role="option"]');
        await expect(options.length).toBe(6);

        // Select another option using Enter key (navigate to Kangaroo and select it)
        await userEvent.keyboard("{ArrowDown}{ArrowDown}"); // Navigate to Kangaroo (second option)
        await userEvent.keyboard("{enter}");

        // Verify we now have 2 tags
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);

        // Verify the second tag contains "Kangaroo"
        const kangarooTag = tags[1];
        await expect(kangarooTag).toHaveTextContent("Kangaroo");

        // Close popover for next test
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select clear all button clears all tags and selected options",
      async () => {
        // Verify we start with tags from the previous test (should have Koala and Kangaroo selected)
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(2);

        // Find and click the clear all button
        const clearAllButton = await within(multiSelect).findByRole("button", {
          name: /clear selection/i,
        });
        await expect(clearAllButton).toBeInTheDocument();

        // Click the clear all button
        await userEvent.click(clearAllButton);

        // Open the popover to verify no options are selected
        await userEvent.keyboard("{enter}");

        // Verify all tags are cleared
        // After clearing, the taglist will contain a placeholder
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        // insure that the tagsList child is the placeholder
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);

        // Verify popover opens with all options visible (none filtered)
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        const options = document.querySelectorAll('[role="option"]');
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
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select allows removing individual selections by clicking tag remove buttons",
      async () => {
        // First, we need to make some selections since the previous test cleared everything
        // Open the popover
        multiSelect.focus();
        await userEvent.keyboard("{enter}");

        // Verify popover is open
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        // Select Koala (first option)
        await userEvent.keyboard("{ArrowDown}");
        await userEvent.keyboard("{enter}");

        // Select Kangaroo (second option)
        await userEvent.keyboard("{ArrowDown}");
        await userEvent.keyboard("{enter}");

        // Select Platypus (third option)
        await userEvent.keyboard("{ArrowDown}");
        await userEvent.keyboard("{enter}");

        // Close popover
        await userEvent.keyboard("{escape}");

        // Verify we have 3 tags
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(3);

        // Verify the tags contain the expected values
        await expect(tags[0]).toHaveTextContent("Koala");
        await expect(tags[1]).toHaveTextContent("Kangaroo");
        await expect(tags[2]).toHaveTextContent("Platypus");

        // Find and click the remove button on the Kangaroo tag (middle tag)
        const kangarooTag = tags[1] as HTMLElement;
        const kangarooRemoveButton = within(kangarooTag).getByRole("button", {
          name: /remove kangaroo/i,
        });
        await expect(kangarooRemoveButton).toBeInTheDocument();

        // Click the remove button
        await userEvent.click(kangarooRemoveButton);

        // Verify we now have 2 tags (Kangaroo should be removed)
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);

        // Verify remaining tags are Koala and Platypus
        await expect(tags[0]).toHaveTextContent("Koala");
        await expect(tags[1]).toHaveTextContent("Platypus");

        // Verify Kangaroo is no longer in the tags
        const tagTexts = Array.from(tags).map(
          (tag) => (tag as Element).textContent
        );
        await expect(tagTexts).not.toContain("Kangaroo");

        // Open popover to verify Kangaroo is no longer selected
        await userEvent.keyboard("{enter}");

        const options = document.querySelectorAll('[role="option"]');
        const kangarooOption = Array.from(options).find((option) =>
          option.textContent?.includes("Kangaroo")
        );

        // Verify Kangaroo option is no longer selected
        const kangarooSelected =
          kangarooOption?.getAttribute("aria-selected") === "true" ||
          kangarooOption?.getAttribute("data-selected") === "true";
        await expect(kangarooSelected).toBe(false);

        // Verify Koala and Platypus are still selected
        const koalaOption = Array.from(options).find((option) =>
          option.textContent?.includes("Koala")
        );
        const platypusOption = Array.from(options).find((option) =>
          option.textContent?.includes("Platypus")
        );

        const koalaSelected =
          koalaOption?.getAttribute("aria-selected") === "true" ||
          koalaOption?.getAttribute("data-selected") === "true";
        const platypusSelected =
          platypusOption?.getAttribute("aria-selected") === "true" ||
          platypusOption?.getAttribute("data-selected") === "true";

        await expect(koalaSelected).toBe(true);
        await expect(platypusSelected).toBe(true);

        // Close popover
        await userEvent.keyboard("{escape}");

        // Test removing another tag (Koala)
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;

        const koalaTag = tags[0] as HTMLElement;
        const koalaRemoveButton = within(koalaTag).getByRole("button", {
          name: /remove koala/i,
        });

        await userEvent.click(koalaRemoveButton);

        // Verify only Platypus remains
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent("Platypus");
      }
    );
    await step(
      "multi select allows removing selected options by clicking on them in the listbox",
      async () => {
        // First, we need to make some selections since the previous test left us with only Platypus
        // Open the popover
        multiSelect.focus();
        await userEvent.keyboard("{enter}");

        // Verify popover is open
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        // Select Koala (first option) - navigate and select
        await userEvent.keyboard("{ArrowDown}");
        await userEvent.keyboard("{enter}");

        // Select Kangaroo (second option) - navigate and select
        await userEvent.keyboard("{ArrowDown}");
        await userEvent.keyboard("{enter}");

        // Verify we now have 3 tags (Platypus from previous test + Koala + Kangaroo)
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(3);

        // Verify the options are marked as selected in the listbox
        const options = document.querySelectorAll('[role="option"]');
        const platypusOption = Array.from(options).find((option) =>
          option.textContent?.includes("Platypus")
        );
        const koalaOption = Array.from(options).find((option) =>
          option.textContent?.includes("Koala")
        );
        const kangarooOption = Array.from(options).find((option) =>
          option.textContent?.includes("Kangaroo")
        );

        // Verify all three options show as selected
        const platypusSelected =
          platypusOption?.getAttribute("aria-selected") === "true" ||
          platypusOption?.getAttribute("data-selected") === "true";
        const koalaSelected =
          koalaOption?.getAttribute("aria-selected") === "true" ||
          koalaOption?.getAttribute("data-selected") === "true";
        const kangarooSelected =
          kangarooOption?.getAttribute("aria-selected") === "true" ||
          kangarooOption?.getAttribute("data-selected") === "true";

        await expect(platypusSelected).toBe(true);
        await expect(koalaSelected).toBe(true);
        await expect(kangarooSelected).toBe(true);

        // Click on the Kangaroo option in the listbox to deselect it
        await expect(kangarooOption).toBeDefined();
        await userEvent.click(kangarooOption!);

        // Verify Kangaroo is no longer selected in the listbox
        const kangarooSelectedAfterClick =
          kangarooOption?.getAttribute("aria-selected") === "true" ||
          kangarooOption?.getAttribute("data-selected") === "true";
        await expect(kangarooSelectedAfterClick).toBe(false);

        // Verify the Kangaroo tag is removed from the taglist
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);

        // Verify remaining tags are Platypus and Koala
        const tagTexts = Array.from(tags).map(
          (tag) => (tag as Element).textContent
        );
        await expect(tagTexts).toContain("Platypus");
        await expect(tagTexts).toContain("Koala");
        await expect(tagTexts).not.toContain("Kangaroo");

        // Click on the Koala option in the listbox to deselect it
        await userEvent.click(koalaOption!);

        // Verify only Platypus remains selected
        const koalaSelectedAfterClick =
          koalaOption?.getAttribute("aria-selected") === "true" ||
          koalaOption?.getAttribute("data-selected") === "true";
        await expect(koalaSelectedAfterClick).toBe(false);

        // Verify only one tag remains
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent("Platypus");

        // Click on the Platypus option to deselect the last item
        await userEvent.click(platypusOption!);

        // Verify no options are selected
        const platypusSelectedAfterClick =
          platypusOption?.getAttribute("aria-selected") === "true" ||
          platypusOption?.getAttribute("data-selected") === "true";
        await expect(platypusSelectedAfterClick).toBe(false);

        // Verify taglist shows placeholder
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);

        // Close popover
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select allows removing last selected item by hitting backspace when filter input is empty",
      async () => {
        // First, we need to make some selections since the previous test cleared everything
        // Open the popover
        multiSelect.focus();
        await userEvent.keyboard("{enter}");

        // Verify popover is open
        const listbox = document.querySelector('[role="listbox"]');
        await expect(listbox).toBeInTheDocument();

        // Select multiple options using keyboard navigation
        await userEvent.keyboard("{ArrowDown}"); // Navigate to Koala
        await userEvent.keyboard("{enter}"); // Select Koala

        await userEvent.keyboard("{ArrowDown}"); // Navigate to Kangaroo
        await userEvent.keyboard("{enter}"); // Select Kangaroo

        await userEvent.keyboard("{ArrowDown}"); // Navigate to Platypus
        await userEvent.keyboard("{enter}"); // Select Platypus

        // Verify we have 3 tags selected
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(3);

        // Verify the tags contain the expected values (in selection order)
        await expect(tags[0]).toHaveTextContent("Koala");
        await expect(tags[1]).toHaveTextContent("Kangaroo");
        await expect(tags[2]).toHaveTextContent("Platypus");

        // Get the filter input
        const filterInput = document.querySelector(
          '[aria-label="filter combobox options"]'
        ) as HTMLInputElement;
        await expect(filterInput).toBeInTheDocument();

        // Ensure the filter input is empty
        await userEvent.clear(filterInput);
        await expect(filterInput.value).toBe("");

        // Focus the filter input and hit backspace - should remove the last selected item (Platypus)
        filterInput.focus();
        await userEvent.keyboard("{Backspace}");

        // Verify Platypus tag was removed
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);
        await expect(tags[0]).toHaveTextContent("Koala");
        await expect(tags[1]).toHaveTextContent("Kangaroo");

        // Verify Platypus is no longer in the tags
        const tagTexts = Array.from(tags).map(
          (tag) => (tag as Element).textContent
        );
        await expect(tagTexts).not.toContain("Platypus");

        // Hit backspace again - should remove Kangaroo (the new last item)
        await userEvent.keyboard("{Backspace}");

        // Verify Kangaroo tag was removed
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent("Koala");

        // Hit backspace again - should remove Koala (the last remaining item)
        await userEvent.keyboard("{Backspace}");

        // Verify all tags are removed and placeholder is shown
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);

        // Verify no options are selected in the listbox
        const options = document.querySelectorAll('[role="option"]');
        for (const option of Array.from(options)) {
          const isSelected =
            option.getAttribute("aria-selected") === "true" ||
            option.getAttribute("data-selected") === "true";
          await expect(isSelected).toBe(false);
        }

        // Test that backspace does nothing when there are no selected items
        await userEvent.keyboard("{Backspace}");

        // Verify placeholder is still shown (no change)
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent(/Select multiple animals.../i);

        // Close popover
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select does not remove items with backspace when filter input has text",
      async () => {
        // First, make some selections
        multiSelect.focus();
        await userEvent.keyboard("{enter}");

        // Select a couple of options
        await userEvent.keyboard("{ArrowDown}"); // Navigate to Koala
        await userEvent.keyboard("{enter}"); // Select Koala

        await userEvent.keyboard("{ArrowDown}"); // Navigate to Kangaroo
        await userEvent.keyboard("{enter}"); // Select Kangaroo

        // Verify we have 2 tags
        let tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        let tags = tagList.childNodes;
        await expect(tags.length).toBe(2);

        // Get the filter input and type some text
        const filterInput = document.querySelector(
          '[aria-label="filter combobox options"]'
        ) as HTMLInputElement;
        await expect(filterInput).toBeInTheDocument();

        // Type some text in the filter input
        await userEvent.type(filterInput, "test");
        await expect(filterInput.value).toBe("test");

        // Hit backspace - should remove the text, not the selected items
        await userEvent.keyboard("{Backspace}");
        await expect(filterInput.value).toBe("tes");

        // Verify tags are still there (no selection was removed)
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(2);
        await expect(tags[0]).toHaveTextContent("Koala");
        await expect(tags[1]).toHaveTextContent("Kangaroo");

        // Clear the input completely
        await userEvent.clear(filterInput);
        await expect(filterInput.value).toBe("");

        // Now backspace should remove the last selected item
        await userEvent.keyboard("{Backspace}");

        // Verify Kangaroo was removed
        tagList = await within(multiSelect).findByLabelText(/selected values/i);
        tags = tagList.childNodes;
        await expect(tags.length).toBe(1);
        await expect(tags[0]).toHaveTextContent("Koala");

        // Close popover
        await userEvent.keyboard("{escape}");
      }
    );
    await step(
      "multi select tab order goes from combobox to tags to clear button to toggle button",
      async () => {
        // focus combobox
        multiSelect.focus();
        // tab to tags
        await userEvent.tab();
        const tagList =
          await within(multiSelect).findByLabelText(/selected values/i);
        await expect(tagList.childNodes[0]).toHaveFocus();
        // tab to clear button
        await userEvent.tab();
        const clearButton =
          await within(multiSelect).findByLabelText(/clear selection/i);
        await expect(clearButton).toHaveFocus();
        //tab to toggle button
        await userEvent.tab();
        const toggleButton =
          await within(multiSelect).findByLabelText(/toggle combobox/i);
        await expect(toggleButton).toHaveFocus();
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
                  <FormField.Root>
                    <FormField.Label>{`Single Select ${variant} ${size}`}</FormField.Label>
                    <FormField.Input>
                      <ComboBox.Root
                        defaultItems={options}
                        size={size}
                        variant={variant}
                        placeholder={`type to search...`}
                      >
                        {(item) => (
                          <ComboBox.Option key={item.id} id={item.id}>
                            {item.name}
                          </ComboBox.Option>
                        )}
                      </ComboBox.Root>
                    </FormField.Input>
                  </FormField.Root>

                  <FormField.Root>
                    <FormField.Label>{`Multi-Select ${variant} ${size}`}</FormField.Label>
                    <FormField.Input>
                      <ComboBox.Root
                        defaultItems={options}
                        selectionMode="multiple"
                        size={size}
                        variant={variant}
                        placeholder={`open to search...`}
                      >
                        {(item) => (
                          <ComboBox.Option key={item.id} id={item.id}>
                            {item.name}
                          </ComboBox.Option>
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

export const OptionGroups: Story = {
  render: () => {
    return (
      <Stack direction="row" gap="400">
        <FormField.Root>
          <FormField.Label>Single Select with Option Groups</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              items={sectionedItems}
              placeholder="Select a food item..."
            >
              {(section) => (
                <ComboBox.OptionGroup
                  label={section.name}
                  items={section.children}
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>

        <FormField.Root>
          <FormField.Label>Multi-Select with Option Groups</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              items={sectionedItems}
              selectionMode="multiple"
              placeholder="Select multiple food items..."
            >
              {(section) => (
                <ComboBox.OptionGroup
                  label={section.name}
                  items={section.children}
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.OptionGroup>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
};

/**
 * Complex Options with Descriptions Example
 * Demonstrates options with rich content including descriptions for both single and multi-select
 */
export const ComplexOptionsWithDescriptions: Story = {
  render: () => {
    const PlanOptionComponent = ({ item }: { item: PlanOption }) => (
      <Flex direction="column" gap="200">
        <Flex justify="space-between" align="center">
          <Text fontWeight="600">{item.type}</Text>
          <Text fontSize="350" fontWeight="600" color="positive.11">
            {item.price}
          </Text>
        </Flex>
        <Text fontSize="350" color="neutral.11" lineHeight="short">
          {item.description}
        </Text>
        <Text fontSize="300" color="neutral.9">
          {item.features.slice(0, 2).join(" • ")}
          {item.features.length > 2 && " • ..."}
        </Text>
      </Flex>
    );

    const TeamMemberOptionComponent = ({ member }: { member: TeamMember }) => (
      <Flex direction="column" gap="200">
        <Flex justify="space-between" align="center">
          <Text fontWeight="600">{member.full_name}</Text>
          <Badge
            colorPalette={
              member.status === "online"
                ? "positive"
                : member.status === "away"
                  ? "warning"
                  : "critical"
            }
            size="2xs"
          >
            {member.status}
          </Badge>
        </Flex>
        <Text fontSize="350" color="neutral.11">
          {member.role} • {member.department}
        </Text>
        <Text fontSize="300" color="neutral.9">
          {member.email}
        </Text>
      </Flex>
    );

    return (
      <Stack direction="column" gap="600">
        <Stack direction="column" gap="300">
          <h3>Subscription Plans</h3>
          <Stack direction="row" gap="400">
            <FormField.Root>
              <FormField.Label>Single Select Plan</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={complexOptionsWithGroups}
                  placeholder="Choose a subscription plan..."
                >
                  {(group) => (
                    <ComboBox.OptionGroup
                      label={group.name}
                      items={group.children}
                    >
                      {(item) => (
                        <ComboBox.Option
                          id={item.uuid}
                          textValue={`${item.type} ${item.price} ${item.description} ${item.price} ${item.features.join(" ")}`}
                        >
                          <PlanOptionComponent item={item} />{" "}
                        </ComboBox.Option>
                      )}
                    </ComboBox.OptionGroup>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Select a subscription plan that fits your needs
              </FormField.Description>
            </FormField.Root>

            <FormField.Root>
              <FormField.Label>Multi-Select Plans</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={complexOptionsWithGroups}
                  selectionMode="multiple"
                  placeholder="Compare multiple plans..."
                  itemID="uuid"
                  itemValue="name"
                >
                  {(group) => (
                    <ComboBox.OptionGroup
                      label={group.name}
                      items={group.children}
                    >
                      {(item) => (
                        <ComboBox.Option
                          id={item.uuid}
                          textValue={`${item.type} ${item.price} ${item.description} ${item.price} ${item.features.join(" ")}`}
                        >
                          <PlanOptionComponent item={item} />
                        </ComboBox.Option>
                      )}
                    </ComboBox.OptionGroup>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Select multiple plans to compare features
              </FormField.Description>
            </FormField.Root>
          </Stack>
        </Stack>

        <Stack direction="column" gap="300">
          <h3>Team Member Assignment</h3>
          <Stack direction="row" gap="400">
            <FormField.Root>
              <FormField.Label>Single Team Member</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={complexOptions}
                  placeholder="Assign to team member..."
                >
                  {(member) => (
                    <ComboBox.Option
                      id={member.uuid}
                      textValue={`${member.full_name} ${member.status} ${member.role} ${member.department} ${member.email}`}
                    >
                      <TeamMemberOptionComponent member={member} />
                    </ComboBox.Option>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Assign task to a single team member
              </FormField.Description>
            </FormField.Root>

            <FormField.Root>
              <FormField.Label>Multiple Team Members</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={complexOptions}
                  selectionMode="multiple"
                  placeholder="Assign to multiple members..."
                >
                  {(member) => (
                    <ComboBox.Option
                      id={member.uuid}
                      textValue={`${member.full_name} ${member.status} ${member.role} ${member.department} ${member.email}`}
                    >
                      <TeamMemberOptionComponent member={member} />
                    </ComboBox.Option>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Assign task to multiple team members
              </FormField.Description>
            </FormField.Root>
          </Stack>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Async Loading Example
 * Demonstrates fetching data from an API with search functionality
 */
export const AsyncLoading: Story = {
  render: () => {
    const [items, setItems] = useState<Array<{ id: number; name: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    // State for multi-select
    const [multiItems, setMultiItems] = useState<
      Array<{ id: number; name: string }>
    >([]);
    const [multiIsLoading, setMultiIsLoading] = useState(false);
    const [multiInputValue, setMultiInputValue] = useState("");

    // Simulate API call with debouncing for single select
    useEffect(() => {
      if (inputValue.length < 2) {
        setItems([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        // Simulate API response
        const mockResults = [
          { id: 1, name: `${inputValue} - Result 1` },
          { id: 2, name: `${inputValue} - Result 2` },
          { id: 3, name: `${inputValue} - Result 3` },
        ];
        setItems(mockResults);
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timeoutId);
    }, [inputValue]);

    // Simulate API call with debouncing for multi-select
    useEffect(() => {
      if (multiInputValue.length < 2) {
        setMultiItems([]);
        setMultiIsLoading(false);
        return;
      }

      setMultiIsLoading(true);
      const timeoutId = setTimeout(() => {
        // Simulate API response
        const mockResults = [
          { id: 1, name: `${multiInputValue} - Option 1` },
          { id: 2, name: `${multiInputValue} - Option 2` },
          { id: 3, name: `${multiInputValue} - Option 3` },
          { id: 4, name: `${multiInputValue} - Option 4` },
        ];
        setMultiItems(mockResults);
        setMultiIsLoading(false);
      }, 200);

      return () => clearTimeout(timeoutId);
    }, [multiInputValue]);

    return (
      <Stack direction="row" gap="400">
        <FormField.Root>
          <FormField.Label>Single Select Async ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="async search single"
              items={items}
              inputValue={inputValue}
              onInputChange={setInputValue}
              isLoading={isLoading}
              placeholder="Type at least 2 characters to search..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>

        <FormField.Root>
          <FormField.Label>Multi-Select Async ComboBox</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="async search multi"
              items={multiItems}
              selectionMode="multiple"
              inputValue={multiInputValue}
              onInputChange={setMultiInputValue}
              isLoading={multiIsLoading}
              placeholder="Type at least 2 characters to search..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
};

/**
 * Controlled vs Uncontrolled Patterns
 * Demonstrates both controlled and uncontrolled usage patterns for single and multi-select
 */
export const ControlledVsUncontrolled: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = useState<Key | null>(2);
    const [controlledMultiValue, setControlledMultiValue] = useState<Selection>(
      new Set([1, 3])
    );

    return (
      <Stack direction="column" gap="400">
        <Stack direction="row" gap="400">
          <FormField.Root>
            <FormField.Label>Controlled Single-Select ComboBox</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="controlled animals"
                defaultItems={options}
                selectedKey={controlledValue}
                onSelectionChange={setControlledValue}
                placeholder="Select an animal..."
              >
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.Root>
            </FormField.Input>
            <p>Selected: {controlledValue?.toString() || "None"}</p>
            <button onClick={() => setControlledValue(3)}>
              Set to Platypus
            </button>
          </FormField.Root>

          <FormField.Root>
            <FormField.Label>Controlled Multi-Select ComboBox</FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="controlled multi animals"
                defaultItems={options}
                selectionMode="multiple"
                selectedKeys={controlledMultiValue}
                onSelectionChange={setControlledMultiValue}
                placeholder="Select multiple animals..."
              >
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.Root>
            </FormField.Input>
            <p>
              Selected:{" "}
              {controlledMultiValue === "all"
                ? "All items"
                : Array.from(controlledMultiValue).length > 0
                  ? Array.from(controlledMultiValue).join(", ")
                  : "None"}
            </p>
            <button onClick={() => setControlledMultiValue(new Set([2, 4, 6]))}>
              Set to Kangaroo, Bald Eagle, Skunk
            </button>
            <button onClick={() => setControlledMultiValue(new Set())}>
              Clear All
            </button>
          </FormField.Root>
        </Stack>
        <Stack direction="row" gap="400">
          <FormField.Root>
            <FormField.Label>
              Uncontrolled Single-Select ComboBox
            </FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="uncontrolled animals"
                defaultItems={options}
                defaultSelectedKey={1}
                onSelectionChange={(key: Key | null) =>
                  console.log("Uncontrolled single selection:", key)
                }
                placeholder="Select an animal..."
              >
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.Root>
            </FormField.Input>
          </FormField.Root>

          <FormField.Root>
            <FormField.Label>
              Uncontrolled Multi-Select ComboBox
            </FormField.Label>
            <FormField.Input>
              <ComboBox.Root
                aria-label="uncontrolled multi animals"
                defaultItems={options}
                selectionMode="multiple"
                defaultSelectedKeys={new Set([2, 5])}
                onSelectionChange={(keys: Selection) =>
                  console.log(
                    "Uncontrolled multi selection:",
                    keys === "all" ? "all" : Array.from(keys)
                  )
                }
                placeholder="Select multiple animals..."
              >
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.Root>
            </FormField.Input>
          </FormField.Root>
        </Stack>
      </Stack>
    );
  },
};

/**
 * Large Dataset with Performance Optimization
 * Demonstrates handling large datasets efficiently
 */
export const LargeDataset: Story = {
  render: () => {
    // Generate a large dataset
    const largeDataset = useMemo(
      () =>
        Array.from({ length: 1000 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          category:
            i % 3 === 0
              ? "Category A"
              : i % 3 === 1
                ? "Category B"
                : "Category C",
        })),
      []
    );

    return (
      <Stack direction="row" gap="400">
        <FormField.Root>
          <FormField.Label>Single Select Large Dataset</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="large dataset single"
              defaultItems={largeDataset}
              placeholder="Search through 1000 items..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  textValue={`${item.name} ${item.category}`}
                >
                  {item.name} ({item.category})
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>

        <FormField.Root>
          <FormField.Label>Multi-Select Large Dataset</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="large dataset multi"
              defaultItems={largeDataset}
              selectionMode="multiple"
              placeholder="Search and select multiple items..."
            >
              {(item) => (
                <ComboBox.Option
                  key={item.id}
                  id={item.id}
                  textValue={`${item.name} ${item.category}`}
                >
                  {item.name} ({item.category})
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
        </FormField.Root>
      </Stack>
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

    // Multi-select state
    const [multiSelectedItems, setMultiSelectedItems] = useState<Selection>(
      new Set()
    );
    const [multiCustomItems, setMultiCustomItems] = useState<
      Array<{ id: string; name: string }>
    >([]);

    const singleAllItems = useMemo(
      () => [...options, ...singleCustomItems],
      [singleCustomItems]
    );
    const multiAllItems = useMemo(
      () => [...options, ...multiCustomItems],
      [multiCustomItems]
    );

    const handleSingleCustomValue = (value: string) => {
      // Add custom item
      const newItem = { id: `single-custom-${Date.now()}`, name: value };
      setSingleCustomItems((prev) => [...prev, newItem]);
      setSingleSelectedItem(newItem.id);
    };

    const handleMultiCustomValue = (value: string) => {
      // Add custom item
      const newItem = { id: `multi-custom-${Date.now()}`, name: value };
      setMultiCustomItems((prev) => [...prev, newItem]);
      setMultiSelectedItems((prev) => {
        const newSelection = new Set(prev);
        newSelection.add(newItem.id);
        return newSelection;
      });
    };

    return (
      <Stack direction="row" gap="400">
        <FormField.Root>
          <FormField.Label>Single Select with Custom Values</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="single select custom values"
              items={singleAllItems}
              selectedKey={singleSelectedItem}
              onSelectionChange={setSingleSelectedItem}
              allowsCustomValue
              onSubmitCustomValue={handleSingleCustomValue}
              placeholder="Select an item or create a new one..."
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

        <FormField.Root>
          <FormField.Label>Multi-Select with Custom Values</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              aria-label="multi select custom values"
              items={multiAllItems}
              selectionMode="multiple"
              selectedKeys={multiSelectedItems}
              onSelectionChange={setMultiSelectedItems}
              allowsCustomValue
              onSubmitCustomValue={handleMultiCustomValue}
              placeholder="Select multiple items or create new ones..."
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
};

/**
 * Disabled and Read-Only Comboboxes Example
 * Demonstrates disabled and read-only comboboxes side by side for both single and multi-select modes
 */
export const DisabledAndReadOnlyComboboxes: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="600">
        <Stack direction="column" gap="300">
          <h3>Single Select ComboBoxes</h3>
          <Stack direction="row" gap="400">
            <FormField.Root>
              <FormField.Label>Disabled Single Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  isDisabled={true}
                  defaultSelectedKey={2}
                  placeholder="This combobox is disabled..."
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Disabled - cannot interact at all
              </FormField.Description>
            </FormField.Root>

            <FormField.Root>
              <FormField.Label>Read-Only Single Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  isReadOnly
                  defaultSelectedKey={2}
                  placeholder="This combobox is read-only..."
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
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
            <FormField.Root>
              <FormField.Label>Disabled Multi-Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  selectionMode="multiple"
                  isDisabled
                  defaultSelectedKeys={new Set([1, 3, 5])}
                  placeholder="This combobox is disabled..."
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Disabled - cannot interact at all
              </FormField.Description>
            </FormField.Root>

            <FormField.Root>
              <FormField.Label>Read-Only Multi-Select</FormField.Label>
              <FormField.Input>
                <ComboBox.Root
                  defaultItems={options}
                  selectionMode="multiple"
                  isReadOnly
                  defaultSelectedKeys={new Set([1, 3, 5])}
                  placeholder="This combobox is read-only..."
                >
                  {(item) => (
                    <ComboBox.Option key={item.id} id={item.id}>
                      {item.name}
                    </ComboBox.Option>
                  )}
                </ComboBox.Root>
              </FormField.Input>
              <FormField.Description>
                Read-only - can focus but not change values
              </FormField.Description>
            </FormField.Root>
          </Stack>
        </Stack>
      </Stack>
    );
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
        <FormField.Root>
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

        <FormField.Root>
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
};

/**
 * Form Validation Example
 * Shows advanced validation states and error messaging
 */
export const FormValidation: Story = {
  render: () => {
    // Single select state
    const [selectedValue, setSelectedValue] = useState<Key | null>(null);
    const [isInvalid, setIsInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Multi-select state
    const [multiSelectedValues, setMultiSelectedValues] = useState<Selection>(
      new Set()
    );
    const [multiIsInvalid, setMultiIsInvalid] = useState(false);
    const [multiErrorMessage, setMultiErrorMessage] = useState("");

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
      <Stack direction="row" gap="400">
        <FormField.Root isInvalid={isInvalid}>
          <FormField.Label>Single Select with Validation</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={options}
              selectedKey={selectedValue}
              onSelectionChange={handleSelectionChange}
              isRequired
              placeholder="Select an animal..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
          {errorMessage && <FormField.Error>{errorMessage}</FormField.Error>}
        </FormField.Root>

        <FormField.Root isInvalid={multiIsInvalid}>
          <FormField.Label>Multi-Select with Validation</FormField.Label>
          <FormField.Input>
            <ComboBox.Root
              defaultItems={options}
              selectionMode="multiple"
              selectedKeys={multiSelectedValues}
              onSelectionChange={handleMultiSelectionChange}
              isRequired
              placeholder="Select multiple animals..."
            >
              {(item) => (
                <ComboBox.Option key={item.id} id={item.id}>
                  {item.name}
                </ComboBox.Option>
              )}
            </ComboBox.Root>
          </FormField.Input>
          {multiErrorMessage && (
            <FormField.Error>{multiErrorMessage}</FormField.Error>
          )}
        </FormField.Root>
      </Stack>
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
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
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
                {(item) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.Root>
            </FormField.Input>

            <FormField.Error>{errors.animals}</FormField.Error>
          </FormField.Root>

          <Stack direction="row" gap="200">
            <button type="submit">Submit Form</button>
            <button type="button" onClick={resetForm}>
              Reset Form
            </button>
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
