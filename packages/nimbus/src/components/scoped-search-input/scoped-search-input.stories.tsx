import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { useState } from "react";
import {
  Box,
  FormField,
  ScopedSearchInput,
  type ScopedSearchInputValue,
  Stack,
} from "@commercetools/nimbus";

const meta: Meta<typeof ScopedSearchInput> = {
  title: "Components/ScopedSearchInput",
  component: ScopedSearchInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { label: "All Fields", value: "all" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
];

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

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <ScopedSearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={(val) => console.log("Submit:", val)}
        options={defaultOptions}
        selectPlaceholder="Select field"
        searchPlaceholder="Enter search term..."
      />
    );
  },
};

export const SizeVariants: Story = {
  render: () => {
    const [valueSm, setValueSm] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });
    const [valueMd, setValueMd] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        <ScopedSearchInput
          size="sm"
          value={valueSm}
          onValueChange={setValueSm}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Small size..."
        />
        <ScopedSearchInput
          size="md"
          value={valueMd}
          onValueChange={setValueMd}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Medium size..."
        />
      </Stack>
    );
  },
};

export const GroupedOptions: Story = {
  render: () => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "email",
    });

    return (
      <ScopedSearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={console.log}
        options={groupedOptions}
        searchPlaceholder="Search..."
      />
    );
  },
};

export const States: Story = {
  render: () => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        <ScopedSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Normal state..."
        />
        <ScopedSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Disabled..."
          isDisabled
        />
        <ScopedSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Read-only..."
          isReadOnly
        />
        <ScopedSearchInput
          value={{ text: "error", option: "all" }}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Invalid state..."
          isInvalid
        />
      </Stack>
    );
  },
};

export const InteractiveTest: Story = {
  render: () => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <ScopedSearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={fn()}
        options={defaultOptions}
        selectPlaceholder="Select field"
        searchPlaceholder="Enter search term..."
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Select an option from dropdown", async () => {
      // Find and click the select trigger
      const selectTrigger = canvas.getByRole("button", {
        name: /all fields/i,
      });
      await userEvent.click(selectTrigger);

      // Wait for dropdown to appear
      await waitFor(() => {
        const menu = within(document.body).getByRole("listbox");
        expect(menu).toBeInTheDocument();
      });

      // Select "Name" option
      const nameOption = within(document.body).getByRole("option", {
        name: "Name",
      });
      await userEvent.click(nameOption);

      // Verify selection
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: /name/i })
        ).toBeInTheDocument();
      });
    });

    await step("Type text in search input", async () => {
      const searchInput = canvas.getByRole("searchbox");
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "test query");

      expect(searchInput).toHaveValue("test query");
    });

    await step("Clear search text", async () => {
      const clearButton = canvas.getByRole("button", {
        name: /clear search input/i,
      });
      await userEvent.click(clearButton);

      const searchInput = canvas.getByRole("searchbox");
      expect(searchInput).toHaveValue("");
    });
  },
};

export const AutoFocusBehavior: Story = {
  render: () => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <ScopedSearchInput
        value={value}
        onValueChange={setValue}
        onSubmit={console.log}
        options={defaultOptions}
        selectPlaceholder="Select field"
        searchPlaceholder="Type here after selecting..."
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state - no focus", async () => {
      const searchInput = canvas.getByRole("searchbox");
      expect(searchInput).not.toHaveFocus();
    });

    await step("Select an option and verify auto-focus", async () => {
      // Open select dropdown
      const selectTrigger = canvas.getByRole("button", {
        name: /all fields/i,
      });
      await userEvent.click(selectTrigger);

      // Wait for dropdown
      await waitFor(() => {
        const menu = within(document.body).getByRole("listbox");
        expect(menu).toBeInTheDocument();
      });

      // Select "Email" option
      const emailOption = within(document.body).getByRole("option", {
        name: "Email",
      });
      await userEvent.click(emailOption);

      // Verify selection changed
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: /email/i })
        ).toBeInTheDocument();
      });

      // Critical assertion: search input should now have focus
      const searchInput = canvas.getByRole("searchbox");
      await waitFor(() => {
        expect(searchInput).toHaveFocus();
      });
    });

    await step("User can immediately type after selection", async () => {
      const searchInput = canvas.getByRole("searchbox");

      // User can type immediately without clicking
      await userEvent.keyboard("john@example.com");

      expect(searchInput).toHaveValue("john@example.com");
    });

    await step("Auto-focus works for subsequent selections", async () => {
      // Clear the input first
      const clearButton = canvas.getByRole("button", {
        name: /clear search input/i,
      });
      await userEvent.click(clearButton);

      // Click away from search input to remove focus
      const selectTrigger = canvas.getByRole("button", { name: /email/i });
      await userEvent.click(selectTrigger);

      // Wait for dropdown
      await waitFor(() => {
        const menu = within(document.body).getByRole("listbox");
        expect(menu).toBeInTheDocument();
      });

      // Select different option
      const phoneOption = within(document.body).getByRole("option", {
        name: "Phone",
      });
      await userEvent.click(phoneOption);

      // Wait for selection to complete
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: /phone/i })
        ).toBeInTheDocument();
      });

      // Verify focus again
      const searchInput = canvas.getByRole("searchbox");
      await waitFor(() => {
        expect(searchInput).toHaveFocus();
      });
    });
  },
};

export const WithFormField: Story = {
  args: { isInvalid: true },
  render: (args) => {
    const [value, setValue] = useState<ScopedSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <Box width="600px">
        <FormField.Root isInvalid={args.isInvalid} data-testid="form-field">
          <FormField.Label>Search Products</FormField.Label>
          <FormField.Input>
            <ScopedSearchInput
              value={value}
              onValueChange={setValue}
              onSubmit={(val) => console.log("Search:", val)}
              options={defaultOptions}
              selectPlaceholder="Field"
              searchPlaceholder="Enter search term..."
              data-testid="scoped-search"
            />
          </FormField.Input>
          <FormField.Description>
            Select a field to search in and enter your search term.
          </FormField.Description>
          <FormField.Error>
            Please enter a valid search term (minimum 3 characters).
          </FormField.Error>
          <FormField.InfoBox>
            The search will look for matches in the selected field. Use "All
            Fields" to search across all product data.
          </FormField.InfoBox>
        </FormField.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All elements are rendered correctly", async () => {
      const scopedSearch = canvas.getByTestId("scoped-search");
      const label = canvas.getByText(/Search Products/);
      const description = canvas.getByText(/Select a field to search in/);
      const error = canvas.getByText(/Please enter a valid search term/);

      await expect(scopedSearch).toBeInTheDocument();
      await expect(label).toBeInTheDocument();
      await expect(description).toBeInTheDocument();
      await expect(error).toBeInTheDocument();
    });

    await step(
      "ARIA relationships: Both Select and SearchInput are properly labeled and described",
      async () => {
        const label = canvas.getByText(/Search Products/);
        const description = canvas.getByText(/Select a field to search in/);
        const error = canvas.getByText(/Please enter a valid search term/);

        // Get the Select trigger button (first interactive element)
        const selectTrigger = canvas.getByRole("button", {
          name: /all fields/i,
        });

        // Get the SearchInput (searchbox role)
        const searchInput = canvas.getByRole("searchbox");

        // Verify Select trigger has proper ARIA connections
        await expect(selectTrigger.getAttribute("aria-labelledby")).toContain(
          label.id
        );
        await expect(selectTrigger.getAttribute("aria-describedby")).toContain(
          description.id
        );
        await expect(selectTrigger.getAttribute("aria-describedby")).toContain(
          error.id
        );

        // Verify SearchInput has proper ARIA connections
        await expect(searchInput.getAttribute("aria-labelledby")).toContain(
          label.id
        );
        await expect(searchInput.getAttribute("aria-describedby")).toContain(
          description.id
        );
        await expect(searchInput.getAttribute("aria-describedby")).toContain(
          error.id
        );
      }
    );

    await step("Component interaction: Select option then search", async () => {
      // Open select dropdown
      const selectTrigger = canvas.getByRole("button", {
        name: /all fields/i,
      });
      await userEvent.click(selectTrigger);

      // Wait for dropdown to appear
      await waitFor(() => {
        const menu = within(document.body).getByRole("listbox");
        expect(menu).toBeInTheDocument();
      });

      // Select "Email" option
      const emailOption = within(document.body).getByRole("option", {
        name: "Email",
      });
      await userEvent.click(emailOption);

      // Verify selection changed
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: /email/i })
        ).toBeInTheDocument();
      });

      // Type in search input
      const searchInput = canvas.getByRole("searchbox");
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "test@example.com");

      expect(searchInput).toHaveValue("test@example.com");
    });
  },
};
