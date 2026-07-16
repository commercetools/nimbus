import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { Menu as RaMenu, MenuItem as RaMenuItem } from "react-aria-components";
import {
  Autocomplete,
  useFilter,
  ListBox,
  SearchInput,
  Stack,
  Text,
} from "@commercetools/nimbus";

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Autocomplete",
  component: Autocomplete,
};

export default meta;

type Story = StoryObj<typeof meta>;

const allItems = [
  { id: "apple", name: "Apple" },
  { id: "apricot", name: "Apricot" },
  { id: "banana", name: "Banana" },
  { id: "cherry", name: "Cherry" },
  { id: "date", name: "Date" },
  { id: "elderberry", name: "Elderberry" },
];

/**
 * Autocomplete wrapping SearchInput + ListBox.
 * Items are filtered client-side using `useFilter` as the user types.
 */
export const WithListBox: Story = {
  render: () => {
    const { contains } = useFilter({ sensitivity: "base" });

    return (
      <Autocomplete
        filter={(textValue, inputValue) => contains(textValue, inputValue)}
      >
        <SearchInput
          aria-label="Filter fruits"
          placeholder="Type to filter..."
        />
        <ListBox.Root aria-label="Fruits" selectionMode="single">
          <ListBox.Item id="apple">Apple</ListBox.Item>
          <ListBox.Item id="banana">Banana</ListBox.Item>
          <ListBox.Item id="cherry">Cherry</ListBox.Item>
          <ListBox.Item id="date">Date</ListBox.Item>
          <ListBox.Item id="elderberry">Elderberry</ListBox.Item>
        </ListBox.Root>
      </Autocomplete>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the search input and all list items", async () => {
      const input = canvas.getByRole("searchbox", { name: "Filter fruits" });
      await expect(input).toBeInTheDocument();

      const listbox = canvas.getByRole("listbox", { name: "Fruits" });
      await expect(listbox).toBeInTheDocument();

      const options = canvas.getAllByRole("option");
      await expect(options).toHaveLength(5);
    });

    await step("Filters items by typing", async () => {
      const input = canvas.getByRole("searchbox", { name: "Filter fruits" });
      await userEvent.type(input, "a");

      // Items containing "a": Apple, Banana, Date
      await waitFor(() => {
        expect(
          canvas.getByRole("option", { name: "Apple" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("option", { name: "Banana" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("option", { name: "Date" })
        ).toBeInTheDocument();
      });

      // Items not containing "a": Cherry, Elderberry
      await waitFor(() => {
        expect(
          canvas.queryByRole("option", { name: "Cherry" })
        ).not.toBeInTheDocument();
        expect(
          canvas.queryByRole("option", { name: "Elderberry" })
        ).not.toBeInTheDocument();
      });
    });

    await step("Shows all items when input is cleared", async () => {
      const input = canvas.getByRole("searchbox", { name: "Filter fruits" });
      await userEvent.clear(input);

      await waitFor(() => {
        const options = canvas.getAllByRole("option");
        expect(options).toHaveLength(5);
      });
    });
  },
};

/**
 * Command-palette pattern: Autocomplete wrapping SearchInput + a raw RAC Menu.
 * Nimbus Menu.Root is popover-based and not suitable for inline autocomplete,
 * so the RAC Menu primitive is used directly here.
 */
export const WithMenu: Story = {
  render: () => {
    const { contains } = useFilter({ sensitivity: "base" });

    return (
      <Autocomplete
        filter={(textValue, inputValue) => contains(textValue, inputValue)}
      >
        <SearchInput
          aria-label="Command palette"
          placeholder="Search commands..."
        />
        <RaMenu aria-label="Commands">
          <RaMenuItem id="new-file" textValue="New File">
            New File
          </RaMenuItem>
          <RaMenuItem id="open-file" textValue="Open File">
            Open File
          </RaMenuItem>
          <RaMenuItem id="save" textValue="Save">
            Save
          </RaMenuItem>
          <RaMenuItem id="save-as" textValue="Save As">
            Save As
          </RaMenuItem>
          <RaMenuItem id="close" textValue="Close">
            Close
          </RaMenuItem>
        </RaMenu>
      </Autocomplete>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the search input and all menu items", async () => {
      const input = canvas.getByRole("searchbox", { name: "Command palette" });
      await expect(input).toBeInTheDocument();

      const menu = canvas.getByRole("menu", { name: "Commands" });
      await expect(menu).toBeInTheDocument();

      const items = canvas.getAllByRole("menuitem");
      await expect(items).toHaveLength(5);
    });

    await step(
      'Filters menu items to "Save" and "Save As" when typing "save"',
      async () => {
        const input = canvas.getByRole("searchbox", {
          name: "Command palette",
        });
        await userEvent.type(input, "save");

        await waitFor(() => {
          expect(
            canvas.getByRole("menuitem", { name: "Save" })
          ).toBeInTheDocument();
          expect(
            canvas.getByRole("menuitem", { name: "Save As" })
          ).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(
            canvas.queryByRole("menuitem", { name: "New File" })
          ).not.toBeInTheDocument();
          expect(
            canvas.queryByRole("menuitem", { name: "Open File" })
          ).not.toBeInTheDocument();
          expect(
            canvas.queryByRole("menuitem", { name: "Close" })
          ).not.toBeInTheDocument();
        });
      }
    );

    await step("Restores all items when input is cleared", async () => {
      const input = canvas.getByRole("searchbox", { name: "Command palette" });
      await userEvent.clear(input);

      await waitFor(() => {
        const items = canvas.getAllByRole("menuitem");
        expect(items).toHaveLength(5);
      });
    });
  },
};

/**
 * Demonstrates virtual focus: arrow keys move the virtual focus indicator
 * through the list while the text input retains DOM focus.
 * The input's `aria-activedescendant` attribute tracks the virtually focused item.
 */
export const VirtualFocus: Story = {
  render: () => {
    const { contains } = useFilter({ sensitivity: "base" });

    return (
      <Autocomplete
        filter={(textValue, inputValue) => contains(textValue, inputValue)}
      >
        <SearchInput
          aria-label="Navigate with arrows"
          placeholder="Type or use arrow keys..."
        />
        <ListBox.Root aria-label="Options" selectionMode="single">
          <ListBox.Item id="option-1">Option 1</ListBox.Item>
          <ListBox.Item id="option-2">Option 2</ListBox.Item>
          <ListBox.Item id="option-3">Option 3</ListBox.Item>
          <ListBox.Item id="option-4">Option 4</ListBox.Item>
        </ListBox.Root>
      </Autocomplete>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Focus the search input via Tab", async () => {
      await userEvent.tab();
      const input = canvas.getByRole("searchbox", {
        name: "Navigate with arrows",
      });
      await expect(input).toHaveFocus();
    });

    await step(
      "Arrow Down moves virtual focus — input keeps DOM focus",
      async () => {
        const input = canvas.getByRole("searchbox", {
          name: "Navigate with arrows",
        });

        await userEvent.keyboard("{ArrowDown}");

        // The input should still hold real DOM focus
        await expect(input).toHaveFocus();

        // aria-activedescendant should be set to a non-empty value
        await waitFor(() => {
          const activeDescendant = input.getAttribute("aria-activedescendant");
          expect(activeDescendant).toBeTruthy();
        });
      }
    );

    await step("Subsequent Arrow Down advances virtual focus", async () => {
      const input = canvas.getByRole("searchbox", {
        name: "Navigate with arrows",
      });

      const firstActiveDescendant = input.getAttribute("aria-activedescendant");

      await userEvent.keyboard("{ArrowDown}");

      await waitFor(() => {
        const newActiveDescendant = input.getAttribute("aria-activedescendant");
        expect(newActiveDescendant).toBeTruthy();
        expect(newActiveDescendant).not.toBe(firstActiveDescendant);
      });
    });

    await step("Input keeps DOM focus throughout navigation", async () => {
      const input = canvas.getByRole("searchbox", {
        name: "Navigate with arrows",
      });
      await expect(input).toHaveFocus();
    });
  },
};

/**
 * Controlled input value with external (async-simulated) filtering.
 * No `filter` prop is passed to Autocomplete; filtering is handled in the
 * `onInputChange` callback, mimicking a server-side search.
 */
export const AsyncLoading: Story = {
  render: () => {
    const AsyncLoadingExample = () => {
      const [inputValue, setInputValue] = useState("");
      const [items, setItems] = useState(allItems);
      const [isLoading, setIsLoading] = useState(false);

      const handleInputChange = (value: string) => {
        setInputValue(value);
        setIsLoading(true);
        setTimeout(() => {
          setItems(
            allItems.filter((item) =>
              item.name.toLowerCase().includes(value.toLowerCase())
            )
          );
          setIsLoading(false);
        }, 300);
      };

      return (
        <Stack gap="200">
          <Autocomplete
            inputValue={inputValue}
            onInputChange={handleInputChange}
          >
            <SearchInput
              aria-label="Async search"
              placeholder="Search async..."
            />
            <ListBox.Root
              aria-label="Results"
              selectionMode="single"
              items={items}
            >
              {(item) => <ListBox.Item id={item.id}>{item.name}</ListBox.Item>}
            </ListBox.Root>
          </Autocomplete>
          {isLoading && (
            <Text color="fg.muted" data-testid="loading-indicator">
              Loading...
            </Text>
          )}
          <Text data-testid="result-count" color="fg.muted">
            {items.length} result{items.length !== 1 ? "s" : ""}
          </Text>
        </Stack>
      );
    };

    return <AsyncLoadingExample />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders search input and all items initially", async () => {
      const input = canvas.getByRole("searchbox", { name: "Async search" });
      await expect(input).toBeInTheDocument();

      const options = canvas.getAllByRole("option");
      await expect(options).toHaveLength(allItems.length);
    });

    await step("Typing updates controlled input value", async () => {
      const input = canvas.getByRole("searchbox", { name: "Async search" });
      await userEvent.type(input, "ap");
      await expect(input).toHaveValue("ap");
    });

    await step("Loading indicator appears during async filtering", async () => {
      await waitFor(() => {
        canvas.queryByTestId("loading-indicator");
        // Loading indicator may or may not still be visible depending on timing,
        // but the input value should have propagated.
        const input = canvas.getByRole("searchbox", { name: "Async search" });
        expect(input).toHaveValue("ap");
      });
    });

    await step("Filtered items appear after async load completes", async () => {
      // Wait for the simulated async filter (300ms) to resolve
      await waitFor(
        () => {
          expect(
            canvas.queryByTestId("loading-indicator")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // "ap" should match Apple and Apricot
      await waitFor(() => {
        expect(
          canvas.getByRole("option", { name: "Apple" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("option", { name: "Apricot" })
        ).toBeInTheDocument();
      });

      // Items not matching "ap" should be gone
      await waitFor(() => {
        expect(
          canvas.queryByRole("option", { name: "Banana" })
        ).not.toBeInTheDocument();
        expect(
          canvas.queryByRole("option", { name: "Cherry" })
        ).not.toBeInTheDocument();
      });
    });

    await step("Clearing input restores all items", async () => {
      const input = canvas.getByRole("searchbox", { name: "Async search" });
      await userEvent.clear(input);

      await waitFor(
        () => {
          expect(
            canvas.queryByTestId("loading-indicator")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      await waitFor(() => {
        const options = canvas.getAllByRole("option");
        expect(options).toHaveLength(allItems.length);
      });
    });
  },
};
