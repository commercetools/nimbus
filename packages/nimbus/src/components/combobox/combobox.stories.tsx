import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useCallback } from "react";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { FormField, Stack } from "@commercetools/nimbus";
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
