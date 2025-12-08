import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useCallback } from "react";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { Box, FormField, Stack } from "@commercetools/nimbus";
import { Search } from "@commercetools/nimbus-icons";
import { ComboBox } from "./combobox";
import { type SimpleOption, simpleOptions } from "./utils/test-data";
import {
  ComposedComboBox,
  type Pokemon,
  PokemonOption,
} from "./utils/test-utils";

// Helper functions to reduce test verbosity - should be here since storybook has problems with importing RTL methods from other files

/** Gets all tags */
const getTagList = async (comboBox: HTMLElement) =>
  await within(comboBox).findByLabelText(/selected values/i);

/**  Gets the listbox - uses document.querySelector since the portal is not in the canvas */
const getListBox = (document: Document) =>
  document.querySelector('[role="listbox"]');

/** Gets all options - uses document.querySelectorAll since the portal is not in the canvas */
const getListboxOptions = () => document.querySelectorAll('[role="option"]');

/** Finds a specific option by its textValue  */
const findOptionByText = (text: string) =>
  Array.from(getListboxOptions()).find((option) =>
    option.textContent?.includes(text)
  );

/** Returns whether an option is selected */
const isOptionSelected = (option: Element | undefined) =>
  option?.getAttribute("aria-selected") === "true" ||
  option?.getAttribute("data-selected") === "true";

/** Selects options specified in optionNames array */
const selectOptionsByName = async (optionNames: string[]) => {
  for (const optionName of optionNames) {
    const option = findOptionByText(optionName);
    if (option) {
      // Select the option with a mouse click
      await userEvent.click(option);
    }
  }
};

/** Verifies that tags in expectedTags array exist - expectedTags should always contain ALL expected tags */
const verifyTagsExist = async (
  comboBox: HTMLElement,
  expectedTags: string[]
) => {
  const tagList = await getTagList(comboBox);
  const tags = tagList.childNodes;
  await expect(tags.length).toBe(expectedTags.length);

  for (let i = 0; i < expectedTags.length; i++) {
    await expect(tags[i]).toHaveTextContent(expectedTags[i]);
  }
};

/** Verifies whether options in the optionNames array are selected or not based on shouldBeSelected boolean */
const verifyOptionsSelected = async (
  optionNames: string[],
  shouldBeSelected: boolean
) => {
  for (const name of optionNames) {
    const option = findOptionByText(name);
    await expect(isOptionSelected(option)).toBe(shouldBeSelected);
  }
};

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ComboBox.Root> = {
  title: "Components/ComboBox",
  component: ComboBox.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof ComboBox.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  render: () => {
    return (
      <ComposedComboBox<SimpleOption>
        aria-label="test"
        items={simpleOptions}
        allowsEmptyMenu={true}
        renderEmptyState={() => "hi"}
        selectionMode="multiple"
        selectedKeys={[1, 3]}
        disabledKeys={[2, 4]}
        leadingElement={<Search />}
      />
    );
  },
};

// ============================================================
// CUSTOM "CREATABLE" OPTIONS
// ============================================================

/**
 * Multi-Select Custom Options Story
 * Tests custom option creation with static data (non-async mode)
 * Verifies:
 * - Custom options can be created by typing and pressing Enter
 * - Custom options persist in the list
 * - onCreateOption callback is called with the new item
 * - Custom options can be selected/deselected
 * - Custom options work alongside static options
 */
export const MultiSelectCustomOptions: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([1]);
    const [createdOptions, setCreatedOptions] = useState<string[]>([]);

    const handleCreateOption = useCallback((newItem: SimpleOption) => {
      setCreatedOptions((prev) => [...prev, newItem.name]);
    }, []);

    return (
      <Stack direction="column" gap="400">
        <FormField.Root>
          <FormField.Label>Select or create animals</FormField.Label>
          <FormField.Description>
            Type a custom animal name and press Enter to create!
            {createdOptions.length > 0 &&
              ` | Created: ${createdOptions.join(", ")}`}
          </FormField.Description>
          <FormField.Input>
            <ComposedComboBox<SimpleOption>
              aria-label="Select or create animals"
              items={simpleOptions}
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              selectionMode="multiple"
              placeholder="Type to search or create..."
              allowsCustomOptions
              getNewOptionData={(inputValue) => ({
                id: Date.now(),
                name: inputValue,
              })}
              onCreateOption={handleCreateOption}
            />
          </FormField.Input>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state - one item selected", async () => {
      // Verify initial selected tag (id: 1 = Koala)
      expect(canvas.getByText("Koala")).toBeInTheDocument();
    });

    await step("Open combobox", async () => {
      const toggleButton = await within(
        await canvas.findByRole("group")
      ).findByRole("button", { name: /toggle options/i });
      await userEvent.click(toggleButton);

      // Wait for menu to open
      await waitFor(() => {
        const listbox = getListBox(document);
        expect(listbox).toBeInTheDocument();
      });

      // Verify Koala is selected in options
      await verifyOptionsSelected(["Koala"], true);
    });

    await step("Create first custom option", async () => {
      const combobox = canvas.getByRole("combobox");

      // Type a custom animal name
      await userEvent.clear(combobox);
      await userEvent.type(combobox, "Lion");

      // Press Enter to create
      await userEvent.keyboard("{Enter}");

      // Wait for custom option to be created and selected
      await verifyOptionsSelected(["Lion"], true);
      await waitFor(() => {
        // Check tag was added
        expect(findOptionByText("Lion")).toBeInTheDocument();
        // Check description updated
        expect(canvas.getByText(/Created: Lion/)).toBeInTheDocument();
      });

      // Verify input was cleared after creation (multi-select behavior)
      expect(combobox).toHaveValue("");
    });

    await step("Create second custom option", async () => {
      const combobox = canvas.getByRole("combobox");

      // Type another custom animal
      await userEvent.type(combobox, "Tiger");
      await userEvent.keyboard("{Enter}");

      // Wait for second custom option
      await verifyOptionsSelected(["Tiger"], true);
      await waitFor(() => {
        expect(canvas.getByText(/Created: Lion, Tiger/)).toBeInTheDocument();
      });
    });

    await step("Select an existing static option", async () => {
      const combobox = canvas.getByRole("combobox");

      // Clear input and type to filter
      await userEvent.clear(combobox);
      await userEvent.type(combobox, "Kang");

      // Wait for filtered results
      await waitFor(() => {
        expect(findOptionByText("Kangaroo")).toBeInTheDocument();
      });

      // Select Kangaroo option
      await selectOptionsByName(["Kangaroo"]);

      // Verify Kangaroo tag appears in tag list
      await verifyTagsExist(canvas.getByRole("group"), [
        "Koala",
        "Lion",
        "Tiger",
        "Kangaroo",
      ]);
    });

    await step("Remove a custom option tag", async () => {
      // Find and click remove button for Lion
      const lionTag = await within(await getTagList(canvas.getByRole("group")))
        .getByText("Lion")
        .closest('[role="row"]');
      expect(lionTag).toBeInTheDocument();

      const removeButton = within(lionTag as HTMLElement).getByRole("button", {
        name: /remove tag lion/i,
      });
      await userEvent.click(removeButton);

      // Verify Lion tag is removed

      await expect(
        await within(await getTagList(canvas.getByRole("group"))).queryByText(
          "Lion"
        )
      ).not.toBeInTheDocument();

      // Other tags should still exist
      await verifyTagsExist(canvas.getByRole("group"), [
        "Koala",
        "Tiger",
        "Kangaroo",
      ]);
    });

    await step(
      "Verify custom option still in list after deselection",
      async () => {
        // Open the menu again
        const combobox = canvas.getByRole("combobox");
        await userEvent.click(combobox);

        // Clear any text to show all options
        await userEvent.clear(combobox);

        // Wait for menu to populate
        await waitFor(() => {
          expect(getListBox(document)).toBeInTheDocument();
        });

        // Lion should still be in the list (just not selected)
        await verifyOptionsSelected(["Lion"], false);

        // Tiger should be in the list and selected
        await verifyOptionsSelected(["Tiger"], true);
      }
    );

    await step("Attempt to create duplicate option", async () => {
      const combobox = canvas.getByRole("combobox");

      // Try to create "Tiger" again (already exists)
      await userEvent.clear(combobox);
      await userEvent.type(combobox, "Koala");
      await userEvent.keyboard("{Enter}");

      // Should not create duplicate - Created list should not change
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(canvas.getByText(/Created: Lion, Tiger$/)).toBeInTheDocument();

      // Tiger should remain selected (was already selected)
      expect(canvas.getByText("Tiger")).toBeInTheDocument();
    });
  },
};

// ============================================================
// ASYNC LOADING
// ============================================================

/**
 * Demonstrates async loading with the built-in async API.
 * Shows rich Pokemon results with sprites, types, and stats.
 *
 * The ComboBox automatically handles:
 * - Loading state management
 * - Request debouncing (300ms default)
 * - Request cancellation on input changes
 * - Filter bypass (since API handles filtering)
 * - Empty menu display
 * - Error handling
 */
export const AsyncLoading: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const getPokemonValue = useCallback((pokemon: Pokemon) => pokemon.name, []);

    return (
      <ComboBox.Root<Pokemon>
        aria-label="Asyncachu"
        placeholder="Type to search for Pokemon..."
        getKey={getPokemonValue}
        getTextValue={getPokemonValue}
        isInvalid={!!error}
        selectionMode="multiple"
        async={{
          load: async (filterText, signal) => {
            // Pokemon API returns all pokemon, we filter client-side
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon?limit=1000`,
              { signal }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Filter results client-side to match search
            const filtered = data.results.filter((p: Pokemon) =>
              p.name.toLowerCase().includes(filterText.toLowerCase())
            );
            return filtered.slice(0, 100); // Limit to 100 results for performance
          },
          debounce: 300,
          onError: (err) => {
            setError(err.message);
          },
        }}
      >
        <ComboBox.Trigger />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            {(pokemon: Pokemon) => (
              <ComboBox.Option>
                <PokemonOption pokemon={pokemon} />
              </ComboBox.Option>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type search query", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "pika");

      // Verify input has value
      expect(input).toHaveValue("pika");
    });

    await step("Wait for menu to open and results to load", async () => {
      // Wait for listbox to appear in document.body (portaled)
      await waitFor(
        () => {
          expect(getListBox(document)).not.toBeNull();
        },
        { timeout: 5000 }
      );

      // Wait for Pikachu option to appear
      await waitFor(
        () => {
          expect(findOptionByText("pikachu")).toBeTruthy();
        },
        { timeout: 5000 }
      );
    });
  },
};

/**
 * Demonstrates error handling when async loading fails.
 * Simulates a failing API to show error states with the built-in async API.
 */
export const AsyncLoadingWithError: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const getPokemonValue = useCallback((pokemon: Pokemon) => pokemon.name, []);

    return (
      <Stack direction="column" gap="400" width="500px">
        <FormField.Root isInvalid={!!error}>
          <FormField.Label>Search Pokemon (Error Demo)</FormField.Label>
          <FormField.Input>
            <ComboBox.Root<Pokemon>
              placeholder="Type to trigger error..."
              getKey={getPokemonValue}
              getTextValue={getPokemonValue}
              isInvalid={!!error}
              async={{
                load: async (_filterText, signal) => {
                  // Simulate API failure after delay
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  if (signal.aborted) {
                    throw new Error("AbortError");
                  }
                  // Always throw an error to demonstrate error handling
                  throw new Error(
                    "Failed to load Pokemon. Please try again later."
                  );
                },
                debounce: 300,
                onError: (err) => {
                  setError(err.message);
                },
              }}
            >
              <ComboBox.Trigger />
              <ComboBox.Popover>
                <ComboBox.ListBox>
                  {(pokemon: Pokemon) => (
                    <ComboBox.Option>
                      <PokemonOption pokemon={pokemon} />
                    </ComboBox.Option>
                  )}
                </ComboBox.ListBox>
              </ComboBox.Popover>
            </ComboBox.Root>
          </FormField.Input>
          {error && <FormField.Error>{error}</FormField.Error>}
          <FormField.Description>
            This demo always fails to demonstrate error handling in async
            loading
          </FormField.Description>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Type search query to trigger error", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "test");

      // Verify input has value
      expect(input).toHaveValue("test");
    });

    await step("Wait for error to appear", async () => {
      await waitFor(
        () => {
          const errorMessage = canvas.queryByText(/Failed to load Pokemon/i);
          expect(errorMessage).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  },
};

/**
 * Demonstrates that selected items persist across searches in async multi-select mode.
 * Tests that:
 * 1. Selected items remain visible as tags even when not in current search results
 * 2. Selected items can be removed from tags
 * 3. Re-searching for selected items shows them as selected
 */
export const AsyncMultiSelectPersistence: Story = {
  render: () => {
    const getPokemonValue = useCallback((pokemon: Pokemon) => pokemon.name, []);

    return (
      <ComboBox.Root<Pokemon>
        aria-label="multisyncachu"
        placeholder="Type to search..."
        getKey={getPokemonValue}
        getTextValue={getPokemonValue}
        selectionMode="multiple"
        async={{
          load: async (filterText, signal) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon?limit=1000`,
              { signal }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const filtered = data.results.filter((p: Pokemon) =>
              p.name.toLowerCase().includes(filterText.toLowerCase())
            );
            return filtered.slice(0, 50);
          },
          debounce: 300,
        }}
      >
        <ComboBox.Trigger />
        <ComboBox.Popover>
          <ComboBox.ListBox>
            {(pokemon: Pokemon) => (
              <ComboBox.Option>
                <PokemonOption pokemon={pokemon} />
              </ComboBox.Option>
            )}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Search for 'pika' and select pikachu", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "pika");

      // Wait for results
      await waitFor(
        () => {
          expect(findOptionByText("pikachu")).toBeTruthy();
        },
        { timeout: 5000 }
      );

      // Select pikachu
      await selectOptionsByName(["pikachu"]);
    });

    await step("Verify pikachu tag exists", async () => {
      await verifyTagsExist(canvas.getByRole("group"), ["pikachu"]);
    });

    await step("Search for 'char' (which doesn't match pikachu)", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "char");

      // Wait for new results
      await waitFor(
        () => {
          // charmander should be in results
          expect(findOptionByText("charmander")).toBeTruthy();
          // pikachu should not
          expect(findOptionByText("pikachu")).toBeUndefined();
        },
        { timeout: 5000 }
      );
    });

    await step("Verify pikachu tag still exists (persisted)", async () => {
      // The key test: pikachu tag should still be visible
      // even though it's not in the current search results
      await verifyTagsExist(canvas.getByRole("group"), ["pikachu"]);
    });

    await step("Select charmander", async () => {
      await selectOptionsByName(["charmander"]);
    });

    await step("Verify both tags exist", async () => {
      await verifyTagsExist(canvas.getByRole("group"), [
        "pikachu",
        "charmander",
      ]);
    });

    await step("Search for 'pika' again", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "pika");

      // Wait for results
      await waitFor(
        () => {
          expect(findOptionByText("pikachu")).toBeTruthy();
        },
        { timeout: 5000 }
      );
    });

    await step(
      "Verify both tags still exist and selection is maintained",
      async () => {
        // Both tags should still be there
        await verifyTagsExist(canvas.getByRole("group"), [
          "pikachu",
          "charmander",
        ]);

        // Pikachu option should show as selected
        await verifyOptionsSelected(["pikachu"], true);
      }
    );

    await step(
      "Verify both options are visible and selection is maintained when there is no input value",
      async () => {
        const input = canvas.getByRole("combobox");
        await userEvent.clear(input);

        await verifyOptionsSelected(["pikachu", "charmander"], true);
      }
    );
  },
};

/**
 * Demonstrates custom option creation in async multi-select mode.
 * Tests that:
 * 1. Users can create custom options by pressing Enter on non-matching text
 * 2. Created options are added to the selection
 * 3. Created options persist across searches
 * 4. onCreateOption callback is triggered
 */
export const AsyncMultiSelectCustomOptions: Story = {
  render: () => {
    const [createdOptions, setCreatedOptions] = useState<string[]>([]);
    const getPokemonValue = useCallback((pokemon: Pokemon) => pokemon.name, []);

    return (
      <Stack direction="column" gap="400" width="500px">
        <FormField.Root>
          <FormField.Label>
            Create custom Pokemon (async + custom options)
          </FormField.Label>
          <FormField.Input>
            <ComboBox.Root<Pokemon>
              placeholder="Type to search or create..."
              getKey={getPokemonValue}
              getTextValue={getPokemonValue}
              selectionMode="multiple"
              allowsCustomOptions={true}
              getNewOptionData={(inputValue) => ({
                name: inputValue,
                url: `custom-${inputValue}`,
              })}
              onCreateOption={(newOption) => {
                setCreatedOptions((prev) => [...prev, newOption.name]);
              }}
              async={{
                load: async (filterText, signal) => {
                  const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=1000`,
                    { signal }
                  );

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
                  const filtered = data.results.filter((p: Pokemon) =>
                    p.name.toLowerCase().includes(filterText.toLowerCase())
                  );
                  return filtered.slice(0, 50);
                },
                debounce: 300,
              }}
            >
              <ComboBox.Trigger />
              <ComboBox.Popover>
                <ComboBox.ListBox>
                  {(pokemon: Pokemon) => (
                    <ComboBox.Option>
                      <PokemonOption pokemon={pokemon} />
                    </ComboBox.Option>
                  )}
                </ComboBox.ListBox>
              </ComboBox.Popover>
            </ComboBox.Root>
          </FormField.Input>
          <FormField.Description>
            Search for existing Pokemon or type a custom name and press Enter to
            create!
            {createdOptions.length > 0 &&
              ` | Created: ${createdOptions.join(", ")}`}
          </FormField.Description>
        </FormField.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Search for 'pika' and select pikachu", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "pika");

      // Wait for results
      await waitFor(
        () => {
          expect(findOptionByText("pikachu")).toBeTruthy();
        },
        { timeout: 5000 }
      );

      // Select pikachu
      await selectOptionsByName(["pikachu"]);
    });

    await step("Type custom option 'MyCustomMon' and press Enter", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "MyCustomMon");

      // Wait for async search to complete (no results expected)
      await waitFor(
        () => {
          // Input should have the typed value
          expect(input).toHaveValue("MyCustomMon");
        },
        { timeout: 2000 }
      );

      // Press Enter to create the custom option
      await userEvent.keyboard("{Enter}");
    });

    await step("Verify custom option was created and selected", async () => {
      // Custom option should appear as a tag
      await waitFor(() => {
        const customTag = canvas.queryByText("MyCustomMon");
        expect(customTag).toBeInTheDocument();
      });

      // Original pikachu tag should still exist
      expect(canvas.queryByText("pikachu")).toBeInTheDocument();

      // Description should show the created option
      await waitFor(() => {
        const description = canvas.queryByText(/Created:/i);
        expect(description).toBeInTheDocument();
        expect(description?.textContent).toContain("MyCustomMon");
      });
    });

    await step(
      "Search for 'char' to verify custom option persists",
      async () => {
        const input = canvas.getByRole("combobox");
        await userEvent.clear(input);
        await userEvent.type(input, "char");

        // Wait for charmander results
        await waitFor(
          () => {
            const charmanderOption = findOptionByText("charmander");
            expect(charmanderOption).toBeTruthy();
          },
          { timeout: 5000 }
        );

        // Custom tag should still be visible
        expect(canvas.queryByText("MyCustomMon")).toBeInTheDocument();
        expect(canvas.queryByText("pikachu")).toBeInTheDocument();
      }
    );

    await step("Create another custom option 'AnotherCustom'", async () => {
      const input = canvas.getByRole("combobox");
      await userEvent.clear(input);
      await userEvent.type(input, "AnotherCustom{Enter}");

      // Verify both custom tags exist
      await waitFor(() => {
        expect(canvas.queryByText("MyCustomMon")).toBeInTheDocument();
        expect(canvas.queryByText("AnotherCustom")).toBeInTheDocument();
        expect(canvas.queryByText("pikachu")).toBeInTheDocument();
      });

      // Description should show both created options
      await waitFor(() => {
        const description = canvas.queryByText(/Created:/i);
        expect(description?.textContent).toContain("MyCustomMon");
        expect(description?.textContent).toContain("AnotherCustom");
      });
    });

    await step("Verify all tags can be removed", async () => {
      // Remove AnotherCustom tag
      const anotherCustomTag = canvas.queryByText("AnotherCustom");
      if (anotherCustomTag) {
        const removeButton = anotherCustomTag.parentElement?.querySelector(
          '[aria-label*="Remove"]'
        );
        if (removeButton) {
          await userEvent.click(removeButton);
        }
      }

      // Verify it's removed
      await waitFor(() => {
        expect(canvas.queryByText("AnotherCustom")).not.toBeInTheDocument();
      });

      // Other tags should still exist
      expect(canvas.queryByText("MyCustomMon")).toBeInTheDocument();
      expect(canvas.queryByText("pikachu")).toBeInTheDocument();
    });
  },
};

// ============================================================
// LAYOUT STRUCTURE TESTS
// ============================================================

/**
 * Layout: Leading Element
 * Tests that leading element (icon) displays correctly when provided
 */
export const LayoutLeadingElement: Story = {
  render: () => {
    return (
      <ComposedComboBox
        aria-label="Combobox with leading icon"
        items={simpleOptions}
        leadingElement={<Search aria-hidden="true" />}
      />
    );
  },

  play: async ({ canvasElement }) => {
    // Verify SVG icon is present (from the Search icon in leadingElement), grabs the first svg
    const svgIcon = canvasElement.querySelector("svg");
    expect(svgIcon?.parentElement).toHaveClass(
      "nimbus-combobox__leadingElement"
    );
  },
};

/**
 * Layout: Input Field Visibility
 * Tests that input field is visible and functional
 */
export const LayoutInputField: Story = {
  render: () => {
    return (
      <ComposedComboBox aria-label="Test combobox" items={simpleOptions} />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find the input
    const input = canvas.getByRole("combobox");

    // Input should be visible
    expect(input).toBeVisible();

    // Input should be enabled (not disabled)
    expect(input).not.toBeDisabled();

    // Input should accept focus
    await userEvent.click(input);
    expect(input).toHaveFocus();
  },
};

/**
 * Layout: Toggle Button
 * Tests that toggle button displays and is clickable
 */
export const LayoutToggleButton: Story = {
  render: () => {
    return (
      <ComposedComboBox aria-label="Test combobox" items={simpleOptions} />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get toggle button
    const toggleButton = canvas.getByLabelText(/toggle options/i);

    // Toggle button should be visible and enabled
    expect(toggleButton).toBeVisible();
    expect(toggleButton).toBeEnabled();

    // Click to open menu
    await userEvent.click(toggleButton);

    // Menu should appear
    await waitFor(() => {
      const listbox = getListBox(document);
      expect(listbox).toBeInTheDocument();
    });

    // Click again to close
    await userEvent.click(toggleButton);

    // Menu should disappear
    await waitFor(() => {
      const closedListbox = getListBox(document);
      expect(closedListbox).not.toBeInTheDocument();
    });
  },
};

/**
 * Layout: Clear Button Visibility
 * Tests that clear button displays when selection exists and hides when cleared
 */
export const LayoutClearButton: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([1]);

    return (
      <ComposedComboBox
        aria-label="Test combobox"
        items={simpleOptions}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Clear button should be visible when selection exists
    const clearButton = canvas.getByLabelText(/clear selection/i);
    expect(clearButton).toBeVisible();
    expect(clearButton).toBeEnabled();

    // Click clear button
    await userEvent.click(clearButton);

    // Clear button should be hidden after clearing (display: none)
    await waitFor(() => {
      const computedStyle = window.getComputedStyle(clearButton);
      expect(computedStyle.display).toBe("none");
    });
  },
};

/**
 * Layout: Clear Button Hidden Without Selection
 * Tests that clear button is hidden when no selection exists
 */
export const LayoutClearButtonHidden: Story = {
  render: () => {
    return (
      <ComposedComboBox aria-label="Test combobox" items={simpleOptions} />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Clear button should exist but be hidden (display:none)
    const clearButton = canvas.getByLabelText(/clear selection/i);

    // Verify it has display:none
    const computedStyle = window.getComputedStyle(clearButton);
    expect(computedStyle.display).toBe("none");
  },
};

/**
 * Layout: Full Width Container
 * Tests that component takes full width of its container
 *
 * // TODO: this may require finagling, rather than passing in "width="full"
 */
export const LayoutFullWidth: Story = {
  render: () => {
    return (
      <Box width="600px">
        <ComposedComboBox
          width="full"
          aria-label="Test combobox in container"
          items={simpleOptions}
        />
      </Box>
    );
  },

  play: async ({ canvasElement }) => {
    // Find the combobox input
    const root = canvasElement.querySelector(
      ".nimbus-combobox__root"
    ) as HTMLElement;

    // Verify input exists and is visible
    expect(root).toBeVisible();

    // Get the computed width of the input element
    const rootWidth = (root as HTMLElement).offsetWidth;

    expect(rootWidth).toBe(600);
  },
};

/**
 * Layout: Responsive Behavior (Smoke Test)
 * Tests that layout structure remains intact across different container sizes
 */
export const LayoutResponsive: Story = {
  render: () => {
    return (
      <Stack direction="column" gap="400">
        <Box width="200px">
          <ComposedComboBox
            aria-label="Narrow combobox"
            items={simpleOptions}
          />
        </Box>
        <Box width="400px">
          <ComposedComboBox
            aria-label="Medium combobox"
            items={simpleOptions}
          />
        </Box>
        <Box width="100%">
          <ComposedComboBox
            width="full"
            aria-label="Wide combobox"
            items={simpleOptions}
          />
        </Box>
      </Stack>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // This is a smoke test - full responsive testing requires viewport resizing
    // which is complex in Storybook. This verifies basic structure is intact.

    const inputs = canvas.getAllByRole("combobox");

    // All inputs should be visible and functional regardless of container size
    for (const input of inputs) {
      expect(input).toBeVisible();
      expect(input).not.toBeDisabled();
    }

    // All toggle buttons should remain accessible
    const toggleButtons = canvas.getAllByLabelText(/toggle options/i);
    expect(toggleButtons.length).toBe(3); // One per combobox

    for (const button of toggleButtons) {
      expect(button).toBeVisible();
      expect(button).toBeEnabled();
    }
  },
};

// ============================================================
// MULTI-SELECT TAG DISPLAY TESTS
// ============================================================

/**
 * Multi-Select: Tags Display
 * Tests that selected items display as removable tags in multi-select mode
 */
export const MultiSelectTagsDisplay: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([
      1, 2, 3,
    ]);

    return (
      <ComposedComboBox
        aria-label="Multi-select combobox"
        items={simpleOptions}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify all three selected items display as tags
    expect(canvas.getByText("Koala")).toBeInTheDocument();
    expect(canvas.getByText("Kangaroo")).toBeInTheDocument();
    expect(canvas.getByText("Platypus")).toBeInTheDocument();
  },
};

/**
 * Multi-Select: Tags Inline With Input
 * Tests that tags appear inline with the input field
 */
export const MultiSelectTagsInline: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([1]);

    return (
      <ComposedComboBox
        aria-label="Multi-select combobox"
        items={simpleOptions}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify tag is displayed
    const tag = canvas.getByText("Koala");
    expect(tag).toBeVisible();

    // Get the input
    const input = canvas.getByRole("combobox");
    expect(input).toBeVisible();

    // Input should be focusable even with tags present
    await userEvent.click(input);
    expect(input).toHaveFocus();
  },
};

/**
 * Multi-Select: Tags Wrapping
 * Tests that tags wrap to new lines when space is limited by measuring container height
 */
export const MultiSelectTagsWrapping: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([1]);

    return (
      <Stack direction="column" gap="400">
        <Box width="300px">
          <ComposedComboBox
            aria-label="Single tag combobox"
            items={simpleOptions}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          />
        </Box>

        <Box width="300px">
          <ComposedComboBox
            aria-label="All tags combobox"
            items={simpleOptions}
            selectionMode="multiple"
            selectedKeys={[1, 2, 3, 4, 5, 6]}
            onSelectionChange={() => {}}
          />
        </Box>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    await step("Single tag - baseline height", async () => {
      // Find the first combobox (single tag)
      const singleTagRoot = canvasElement.querySelectorAll(
        ".nimbus-combobox__root"
      )[0] as HTMLElement;

      expect(singleTagRoot).toBeVisible();

      // Get height with only one tag
      const singleTagHeight = singleTagRoot.offsetHeight;

      // Store for comparison (should be single line height)
      expect(singleTagHeight).toBe(40);
    });

    await step("All tags - increased height from wrapping", async () => {
      // Find the second combobox (all 6 tags)
      const allTagsRoot = canvasElement.querySelectorAll(
        ".nimbus-combobox__root"
      )[1] as HTMLElement;

      expect(allTagsRoot).toBeVisible();

      // Get height with all 6 tags
      const allTagsHeight = allTagsRoot.offsetHeight;

      // With 6 tags in a 300px container, height should be 164px
      expect(allTagsHeight).toBe(164);
    });
  },
};

/**
 * Multi-Select: Tag Remove Button
 * Tests that each tag shows a remove button and can be removed
 */
export const MultiSelectTagRemoval: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([
      1, 2, 3,
    ]);

    return (
      <ComposedComboBox
        aria-label="Multi-select combobox"
        items={simpleOptions}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial tags", async () => {
      expect(canvas.getByText("Koala")).toBeInTheDocument();
      expect(canvas.getByText("Kangaroo")).toBeInTheDocument();
      expect(canvas.getByText("Platypus")).toBeInTheDocument();
    });

    await step("Each tag has a remove button", async () => {
      // All three tags should have remove buttons
      const koalaRemove = canvas.getByRole("button", {
        name: /remove tag koala/i,
      });
      const kangarooRemove = canvas.getByRole("button", {
        name: /remove tag kangaroo/i,
      });
      const platypusRemove = canvas.getByRole("button", {
        name: /remove tag platypus/i,
      });

      expect(koalaRemove).toBeVisible();
      expect(kangarooRemove).toBeVisible();
      expect(platypusRemove).toBeVisible();
    });

    await step("Remove middle tag (Kangaroo)", async () => {
      // Find the remove button for Kangaroo tag
      const removeButton = canvas.getByRole("button", {
        name: /remove tag kangaroo/i,
      });

      // Click to remove
      await userEvent.click(removeButton);

      // Verify Kangaroo is removed
      await waitFor(() => {
        expect(canvas.queryByText("Kangaroo")).not.toBeInTheDocument();
      });

      // Other tags should still exist
      expect(canvas.getByText("Koala")).toBeInTheDocument();
      expect(canvas.getByText("Platypus")).toBeInTheDocument();
    });
  },
};

/**
 * Multi-Select: Input Accessible After Tags
 * Tests that input remains accessible and functional after adding multiple tags
 */
export const MultiSelectInputAccessible: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([
      1, 2, 3,
    ]);

    return (
      <ComposedComboBox
        aria-label="Multi-select combobox"
        items={simpleOptions}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify tags are present", async () => {
      expect(canvas.getByText("Koala")).toBeInTheDocument();
      expect(canvas.getByText("Kangaroo")).toBeInTheDocument();
      expect(canvas.getByText("Platypus")).toBeInTheDocument();
    });

    await step("Input remains focusable", async () => {
      const input = canvas.getByRole("combobox");

      // Click input
      await userEvent.click(input);
      expect(input).toHaveFocus();
    });

    await step("Can type in input with tags present", async () => {
      const input = canvas.getByRole("combobox");

      // Type to filter
      await userEvent.type(input, "Bis");

      // Menu should open with filtered results
      await waitFor(() => {
        const listbox = getListBox(document);
        expect(listbox).toBeInTheDocument();
        expect(findOptionByText("Bison")).toBeInTheDocument();
      });
    });

    await step("Can select additional item", async () => {
      // Select Bison
      await selectOptionsByName(["Bison"]);

      // Verify Bison tag appears (all 4 tags should now be present)
      expect(canvas.getByText("Koala")).toBeInTheDocument();
      expect(canvas.getByText("Kangaroo")).toBeInTheDocument();
      expect(canvas.getByText("Platypus")).toBeInTheDocument();
      expect(canvas.getByText("Bison")).toBeInTheDocument();
    });
  },
};
