import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { useState } from "react";
import { SelectableSearchInput } from "./selectable-search-input";
import { Stack } from "@/components/stack";
import type { SelectableSearchInputValue } from "./selectable-search-input.types";

const meta: Meta<typeof SelectableSearchInput> = {
  title: "Components/SelectableSearchInput",
  component: SelectableSearchInput,
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
    const [value, setValue] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <SelectableSearchInput
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
    const [valueSm, setValueSm] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });
    const [valueMd, setValueMd] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        <SelectableSearchInput
          size="sm"
          value={valueSm}
          onValueChange={setValueSm}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Small size..."
        />
        <SelectableSearchInput
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
    const [value, setValue] = useState<SelectableSearchInputValue>({
      text: "",
      option: "email",
    });

    return (
      <SelectableSearchInput
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
    const [value, setValue] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <Stack direction="column" gap="400" alignItems="flex-start">
        <SelectableSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Normal state..."
        />
        <SelectableSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Disabled..."
          isDisabled
        />
        <SelectableSearchInput
          value={value}
          onValueChange={setValue}
          onSubmit={console.log}
          options={defaultOptions}
          searchPlaceholder="Read-only..."
          isReadOnly
        />
        <SelectableSearchInput
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
    const [value, setValue] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <SelectableSearchInput
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
    const [value, setValue] = useState<SelectableSearchInputValue>({
      text: "",
      option: "all",
    });

    return (
      <SelectableSearchInput
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
