import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, useCallback } from "react";
import { ComboBox, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("ComboBox - Basic rendering", () => {
  it("renders combobox input", () => {
    render(
      <NimbusProvider>
        <ComboBox.Root aria-label="Select an animal">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
              <ComboBox.Option id="panda">Panda</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with placeholder text", () => {
    render(
      <NimbusProvider>
        <ComboBox.Root
          placeholder="Search animals..."
          aria-label="Select an animal"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByPlaceholderText("Search animals...")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe("ComboBox - Interactions", () => {
  it("opens dropdown when input is clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <ComboBox.Root aria-label="Select an animal" menuTrigger="focus">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
              <ComboBox.Option id="panda">Panda</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // The listbox is rendered in a portal outside the component tree
    // Query document directly and wait for it to appear
    await waitFor(() => {
      expect(document.querySelector('[role="listbox"]')).toBeInTheDocument();
    });
  });

  it("calls onInputChange when typing", async () => {
    const user = userEvent.setup();
    const handleInputChange = vi.fn();

    render(
      <NimbusProvider>
        <ComboBox.Root
          onInputChange={handleInputChange}
          aria-label="Select an animal"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
              <ComboBox.Option id="panda">Panda</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    const combobox = screen.getByRole("combobox");
    await user.type(combobox, "test");

    expect(handleInputChange).toHaveBeenCalled();
  });

  it("selects option when clicked", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();
    render(
      <NimbusProvider>
        <ComboBox.Root
          onSelectionChange={handleSelectionChange}
          menuTrigger="focus"
          aria-label="Select an animal"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
              <ComboBox.Option id="panda">Panda</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Wait for options to appear in the portal
    await waitFor(() => {
      expect(
        document.querySelectorAll('[role="option"]').length
      ).toBeGreaterThan(0);
    });

    // Get options after they've rendered
    const options = document.querySelectorAll('[role="option"]');
    await user.click(options[0]);

    expect(handleSelectionChange).toHaveBeenCalledWith(["koala"]);
  });
});

/**
 * @docs-section single-select
 * @docs-title Single-Select Mode Tests
 * @docs-description Test single-select behavior
 * @docs-order 3
 */
describe("ComboBox - Single-select mode", () => {
  it("supports single selection mode", () => {
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <ComboBox.Root
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
          aria-label="Select a fruit"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="apple">Apple</ComboBox.Option>
              <ComboBox.Option id="banana">Banana</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    // Verify single-select mode renders correctly
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section multi-select
 * @docs-title Multi-Select Mode Tests
 * @docs-description Test multi-select behavior with tags
 * @docs-order 4
 */
describe("ComboBox - Multi-select mode", () => {
  it("supports multiple selection mode", () => {
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <ComboBox.Root
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          aria-label="Select animals"
        >
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
              <ComboBox.Option id="panda">Panda</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    // Verify multi-select mode renders correctly
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(handleSelectionChange).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled State Tests
 * @docs-description Test that the combobox is properly disabled
 * @docs-order 5
 */
describe("ComboBox - Disabled state", () => {
  it("renders disabled combobox", () => {
    render(
      <NimbusProvider>
        <ComboBox.Root isDisabled aria-label="Select an animal">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();
  });
});

/**
 * @docs-section invalid-state
 * @docs-title Invalid State Tests
 * @docs-description Test that the combobox is properly marked as invalid
 * @docs-order 6
 */
describe("ComboBox - Invalid state", () => {
  it("renders invalid combobox", () => {
    render(
      <NimbusProvider>
        <ComboBox.Root isInvalid aria-label="Select an animal">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Option id="koala">Koala</ComboBox.Option>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    // Invalid state is on the root element
    const combobox = screen.getByRole("combobox");
    const comboboxRoot = combobox.closest('[data-invalid="true"]');
    expect(comboboxRoot).toBeInTheDocument();
  });
});

/**
 * @docs-section custom-options
 * @docs-title Custom Options Creation Tests
 * @docs-description Test creating custom options with allowsCustomOptions
 * @docs-order 7
 */
describe("ComboBox - Custom options", () => {
  it("creates new option when Enter is pressed", async () => {
    const user = userEvent.setup();

    type FruitItem = {
      id: number;
      name: string;
    };

    const handleCreateOption = vi.fn();

    const TestComponent = () => {
      const [items, setItems] = useState<FruitItem[]>([
        { id: 1, name: "Apple" },
        { id: 2, name: "Banana" },
      ]);

      const getNewOptionData = useCallback(
        (inputValue: string): FruitItem => ({
          id: Date.now(),
          name: inputValue,
        }),
        []
      );

      const onCreateOption = useCallback((newItem: FruitItem) => {
        setItems((prev) => [...prev, newItem]);
        handleCreateOption(newItem);
      }, []);

      return (
        <NimbusProvider>
          <ComboBox.Root
            items={items}
            selectionMode="multiple"
            allowsCustomOptions
            getNewOptionData={getNewOptionData}
            onCreateOption={onCreateOption}
            aria-label="Select or create fruits"
          >
            <ComboBox.Trigger />
            <ComboBox.Popover>
              <ComboBox.ListBox>
                {(item: FruitItem) => (
                  <ComboBox.Option key={item.id} id={item.id}>
                    {item.name}
                  </ComboBox.Option>
                )}
              </ComboBox.ListBox>
            </ComboBox.Popover>
          </ComboBox.Root>
        </NimbusProvider>
      );
    };

    render(<TestComponent />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);
    await user.type(combobox, "Orange");
    await user.keyboard("{Enter}");

    expect(handleCreateOption).toHaveBeenCalled();
    // TypeScript knows the mock call argument type from the implementation
    const createdItem = handleCreateOption.mock.calls[0][0] as FruitItem;
    expect(createdItem.name).toBe("Orange");
  });
});

/**
 * @docs-section option-groups
 * @docs-title Option Groups Tests
 * @docs-description Test rendering with option groups
 * @docs-order 8
 */
describe("ComboBox - Option groups", () => {
  it("renders grouped options", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <ComboBox.Root menuTrigger="focus" aria-label="Select a food">
          <ComboBox.Trigger />
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Section label="Fruits">
                <ComboBox.Option id="apple">Apple</ComboBox.Option>
                <ComboBox.Option id="banana">Banana</ComboBox.Option>
              </ComboBox.Section>
              <ComboBox.Section label="Vegetables">
                <ComboBox.Option id="carrot">Carrot</ComboBox.Option>
              </ComboBox.Section>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </NimbusProvider>
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Wait for listbox to appear in portal, then check for section labels
    await waitFor(() => {
      expect(document.querySelector('[role="listbox"]')).toBeInTheDocument();
    });

    // Section labels should be visible in the document
    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
    });
  });
});
