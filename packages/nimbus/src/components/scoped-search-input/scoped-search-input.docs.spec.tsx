import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ScopedSearchInput,
  NimbusProvider,
  type ScopedSearchInputValue,
} from "@commercetools/nimbus";

const defaultOptions = [
  { label: "All Fields", value: "all" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
];

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements and structure
 * @docs-order 1
 */
describe("ScopedSearchInput - Basic rendering", () => {
  it("renders both select dropdown and search input", () => {
    const value: ScopedSearchInputValue = { text: "", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    // Verify select trigger is present
    expect(
      screen.getByRole("button", { name: /all fields/i })
    ).toBeInTheDocument();

    // Verify search input is present
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("displays selected option in select trigger", () => {
    const value: ScopedSearchInputValue = { text: "john", option: "name" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: /name/i })).toBeInTheDocument();
  });

  it("displays search text in input field", () => {
    const value: ScopedSearchInputValue = { text: "test query", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toHaveValue("test query");
  });
});

/**
 * @docs-section interactions
 * @docs-title User Interaction Tests
 * @docs-description Test user interactions including typing, selecting options, and submitting
 * @docs-order 2
 */
describe("ScopedSearchInput - Interactions", () => {
  it("allows typing in search input", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleValueChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onValueChange={handleValueChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "test");

    // Verify callback was called (typing happens character by character)
    expect(handleValueChange).toHaveBeenCalled();
  });

  it("allows selecting different option from dropdown", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleValueChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onValueChange={handleValueChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    // Open dropdown
    const selectTrigger = screen.getByRole("button", { name: /all fields/i });
    await user.click(selectTrigger);

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    // Select "Name" option
    const nameOption = screen.getByRole("option", { name: "Name" });
    await user.click(nameOption);

    // Verify callback was called with new option
    expect(handleValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ option: "name" })
    );
  });

  it("submits search when Enter is pressed in search input", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = {
      text: "test query",
      option: "name",
    };
    const handleSubmit = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={handleSubmit}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    await user.click(searchInput);
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith(value);
  });

  it("clears search text when clear button is clicked", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "test", option: "all" };
    const handleValueChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onValueChange={handleValueChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    // Find and click clear button
    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    // Verify text was cleared (option remains)
    expect(handleValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ text: "", option: "all" })
    );
  });
});

/**
 * @docs-section callbacks
 * @docs-title Callback Tests
 * @docs-description Test separate callbacks for text, option, and combined value changes
 * @docs-order 3
 */
describe("ScopedSearchInput - Callbacks", () => {
  it("calls onTextChange when search text changes", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleTextChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onTextChange={handleTextChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "test");

    // Verify callback was called for text changes
    expect(handleTextChange).toHaveBeenCalled();
  });

  it("calls onOptionChange when option is selected", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleOptionChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onOptionChange={handleOptionChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    // Open and select from dropdown
    await user.click(screen.getByRole("button", { name: /all fields/i }));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("option", { name: "Email" }));

    expect(handleOptionChange).toHaveBeenCalledWith("email");
  });

  it("calls onValueChange for both text and option changes", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleValueChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onValueChange={handleValueChange}
          onSubmit={vi.fn()}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    // Type text
    const searchInput = screen.getByRole("searchbox");
    await user.type(searchInput, "test");
    expect(handleValueChange).toHaveBeenCalled();

    // Change option
    handleValueChange.mockClear();
    await user.click(screen.getByRole("button", { name: /all fields/i }));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("option", { name: "Name" }));

    expect(handleValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ option: "name" })
    );
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test disabled, readonly, invalid, and required states
 * @docs-order 4
 */
describe("ScopedSearchInput - States", () => {
  it("disables both inputs when isDisabled is true", () => {
    const value: ScopedSearchInputValue = { text: "test", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
          isDisabled
        />
      </NimbusProvider>
    );

    // Check select button has disabled attribute
    const selectButton = screen.getByRole("button", { name: /all fields/i });
    expect(selectButton).toBeDisabled();

    // Check search input is disabled
    expect(screen.getByRole("searchbox")).toBeDisabled();
  });

  it("makes both inputs readonly when isReadOnly is true", () => {
    const value: ScopedSearchInputValue = { text: "test", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
          isReadOnly
        />
      </NimbusProvider>
    );

    // Search input should be readonly
    expect(screen.getByRole("searchbox")).toHaveAttribute("readonly");
  });

  it("applies invalid state styling when isInvalid is true", () => {
    const value: ScopedSearchInputValue = { text: "invalid", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
          isInvalid
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInvalid();
  });

  it("marks inputs as required when isRequired is true", () => {
    const value: ScopedSearchInputValue = { text: "", option: "all" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={defaultOptions}
          isRequired
        />
      </NimbusProvider>
    );

    // Check search input has required attribute
    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeRequired();
  });
});

/**
 * @docs-section validation
 * @docs-title Validation Tests
 * @docs-description Test the isEmpty utility and validation patterns
 * @docs-order 5
 */
describe("ScopedSearchInput - Validation", () => {
  it("isEmpty returns true for empty text", () => {
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    expect(ScopedSearchInput.isEmpty(value)).toBe(true);
  });

  it("isEmpty returns true for whitespace-only text", () => {
    const value: ScopedSearchInputValue = { text: "   ", option: "all" };
    expect(ScopedSearchInput.isEmpty(value)).toBe(true);
  });

  it("isEmpty returns false for non-empty text", () => {
    const value: ScopedSearchInputValue = {
      text: "search term",
      option: "all",
    };
    expect(ScopedSearchInput.isEmpty(value)).toBe(false);
  });

  it("validates on submit using isEmpty utility", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "all" };
    const handleSubmit = vi.fn((val: ScopedSearchInputValue) => {
      if (ScopedSearchInput.isEmpty(val)) {
        // Return validation error instead of throwing
        return { error: "Search term required" };
      }
      return { success: true };
    });

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={handleSubmit}
          options={defaultOptions}
        />
      </NimbusProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    await user.click(searchInput);
    await user.keyboard("{Enter}");

    // Verify submit was called
    expect(handleSubmit).toHaveBeenCalled();
    // Verify it returned an error for empty value
    const result = handleSubmit.mock.results[0].value;
    expect(result).toEqual({ error: "Search term required" });
  });
});

/**
 * @docs-section grouped-options
 * @docs-title Grouped Options Tests
 * @docs-description Test option group functionality
 * @docs-order 6
 */
describe("ScopedSearchInput - Grouped options", () => {
  const groupedOptions = [
    {
      label: "Contact Info",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
      ],
    },
    {
      label: "Personal Info",
      options: [
        { label: "Name", value: "name" },
        { label: "Address", value: "address" },
      ],
    },
  ];

  it("renders option groups correctly", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "email" };

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onSubmit={vi.fn()}
          options={groupedOptions}
        />
      </NimbusProvider>
    );

    // Open dropdown
    await user.click(screen.getByRole("button", { name: /email/i }));

    // Wait for dropdown
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    // Verify groups are present (groups typically render as separate elements)
    expect(screen.getByRole("option", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Phone" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Address" })).toBeInTheDocument();
  });

  it("allows selecting options from different groups", async () => {
    const user = userEvent.setup();
    const value: ScopedSearchInputValue = { text: "", option: "email" };
    const handleOptionChange = vi.fn();

    render(
      <NimbusProvider>
        <ScopedSearchInput
          aria-label="Scoped search"
          value={value}
          onOptionChange={handleOptionChange}
          onSubmit={vi.fn()}
          options={groupedOptions}
        />
      </NimbusProvider>
    );

    // Select option from second group
    await user.click(screen.getByRole("button", { name: /email/i }));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("option", { name: "Name" }));

    expect(handleOptionChange).toHaveBeenCalledWith("name");
  });
});
