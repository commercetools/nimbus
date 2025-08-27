import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect } from "storybook/test";
import { Pagination } from "./pagination";
import { useState } from "react";
import { Stack, Box, Text, Heading } from "@/components";

const meta: Meta<typeof Pagination> = {
  title: "components/Pagination",
  component: Pagination,

  argTypes: {
    totalItems: {
      control: { type: "number", min: 0, max: 10000, step: 1 },
      description: "Total number of items to paginate through",
    },
    currentPage: {
      control: { type: "number", min: 1, step: 1 },
      description: "Current active page (1-based)",
    },
    pageSize: {
      control: { type: "number", min: 1, max: 500, step: 1 },
      description: "Number of items per page",
    },
    pageSizeOptions: {
      control: { type: "object" },
      description: "Available page size options in dropdown",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * Basic pagination with default settings.
 * Shows 2,560 total items with 20 items per page.
 */
export const Default: Story = {
  args: {
    totalItems: 2560,
    currentPage: 1,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test next page navigation", async () => {
      const nextButton = canvas.getByLabelText("Go to next page");
      await expect(nextButton).toBeEnabled();
      await userEvent.click(nextButton);

      // Check page input shows page 2 (as string)
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("2");
    });

    await step("Test previous page navigation", async () => {
      const prevButton = canvas.getByLabelText("Go to previous page");
      await expect(prevButton).toBeEnabled();
      await userEvent.click(prevButton);

      // Check page input shows page 1 (as string)
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("1");
    });

    await step("Test direct page input", async () => {
      const pageInput = canvas.getByLabelText("Current page");
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "5");

      // Check that page input updated (as string)
      await expect(pageInput).toHaveValue("5");
    });
  },
};

/**
 * Interactive pagination with state management.
 * Demonstrates controlled pagination behavior.
 */
export const Controlled: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const totalItems = 2560;

    return (
      <Stack gap="600">
        <Stack gap="200">
          <Heading size="lg">Controlled Pagination</Heading>
          <Text color="neutral.11">
            This pagination is controlled by React state. Current page:{" "}
            {currentPage}, Page size: {pageSize}
          </Text>
        </Stack>

        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50, 100]}
        />

        <Box p="300" bg="neutral.3" borderRadius="md">
          <Text fontSize="sm">
            <strong>State:</strong> Page {currentPage} of{" "}
            {Math.ceil(totalItems / pageSize)}, showing {pageSize} items per
            page
          </Text>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify initial state display", async () => {
      // Check initial state text shows correct values (accounting for line breaks)
      await expect(
        canvas.getByText(/Current page:\s*1.*Page size:\s*20/s)
      ).toBeInTheDocument();

      // Check the state display text contains the expected parts
      await expect(canvas.getByText(/State:/)).toBeInTheDocument();
      await expect(
        canvas.getByText(/showing\s*20\s*items per page/)
      ).toBeInTheDocument();
    });

    await step("Test navigation updates state display", async () => {
      const nextButton = canvas.getByLabelText("Go to next page");
      await userEvent.click(nextButton);

      // Verify state display updates (checking key parts individually)
      await expect(
        canvas.getByText(/Current page:\s*2.*Page size:\s*20/s)
      ).toBeInTheDocument();

      // Verify the total page display in the pagination component updated (scoped to navigation)
      const navigation = canvas.getByRole("navigation");
      await expect(navigation).toHaveTextContent(/of\s+128/);
    });
  },
};

/**
 * Pagination with few items.
 * Shows behavior when total items is less than page size.
 */
export const FewItems: Story = {
  args: {
    totalItems: 15,
    currentPage: 1,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation");

    await step("Verify single page behavior with few items", async () => {
      // Should show only 1 page when items < pageSize (15 items, 20 per page)
      await expect(navigation).toHaveTextContent(/of\s+1/);

      // Should be on page 1
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("1");
    });

    await step("Test navigation buttons disabled on single page", async () => {
      const prevButton = canvas.getByLabelText("Go to previous page");
      const nextButton = canvas.getByLabelText("Go to next page");

      // Both buttons should be disabled on single page
      await expect(prevButton).toBeDisabled();
      await expect(nextButton).toBeDisabled();
    });

    await step("Test page size change creates multiple pages", async () => {
      const pageSizeSelect = canvas.getByLabelText("Items per page");
      
      // Focus the select element and use keyboard to navigate
      await userEvent.click(pageSizeSelect);
      await userEvent.keyboard("{ArrowUp}"); // Move to "10" from default "20"
      await userEvent.keyboard("{Enter}");   // Select the option
      
      // Wait a bit for the state to propagate
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should now show 2 total pages (15 items / 10 per page = 2 pages)
      await expect(navigation).toHaveTextContent(/of\s+2/);

      // Next button should now be enabled
      const nextButton = canvas.getByLabelText("Go to next page");
      await expect(nextButton).toBeEnabled();
    });
  },
};

/**
 * Pagination on the last page.
 * Demonstrates disabled next button behavior.
 */
export const LastPage: Story = {
  args: {
    totalItems: 2560,
    currentPage: 128,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 128);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation");

    await step("Verify last page state", async () => {
      // Check we're on page 128
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("128");

      // Check total pages display
      await expect(navigation).toHaveTextContent(/of\s+128/);
    });

    await step("Test disabled next button on last page", async () => {
      const nextButton = canvas.getByLabelText("Go to next page");
      await expect(nextButton).toBeDisabled();
    });

    await step("Test enabled previous button on last page", async () => {
      const prevButton = canvas.getByLabelText("Go to previous page");
      await expect(prevButton).toBeEnabled();

      // Test navigation back works
      await userEvent.click(prevButton);
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("127");
    });
  },
};

/**
 * Empty state pagination.
 * Shows behavior when there are no items.
 */
export const Empty: Story = {
  args: {
    totalItems: 0,
    currentPage: 1,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation");

    await step("Verify empty state behavior", async () => {
      // Should show 1 total page even with 0 items
      await expect(navigation).toHaveTextContent(/of\s+1/);

      // Should be on page 1
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("1");
    });

    await step("Test disabled navigation buttons in empty state", async () => {
      const prevButton = canvas.getByLabelText("Go to previous page");
      const nextButton = canvas.getByLabelText("Go to next page");

      // Both buttons should be disabled when no items
      await expect(prevButton).toBeDisabled();
      await expect(nextButton).toBeDisabled();
    });

    await step("Test page input constraints in empty state", async () => {
      const pageInput = canvas.getByLabelText("Current page");

      // Verify the input exists and has correct value
      await expect(pageInput).toBeInTheDocument();
      await expect(pageInput).toHaveValue("1");

      // Test that typing invalid values doesn't break the component
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "5");
      // Should still be valid since the component will handle bounds internally
      await expect(pageInput).toHaveValue("5");
    });
  },
};

/**
 * Custom page size options.
 * Different set of available page sizes.
 */
export const CustomPageSizes: Story = {
  args: {
    totalItems: 10000,
    currentPage: 1,
    pageSize: 25,
    pageSizeOptions: [5, 25, 50, 100, 250],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 25);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation");

    await step("Verify initial page size and total pages", async () => {
      // Initial state: 25 items per page, 10000/25 = 400 pages
      await expect(navigation).toHaveTextContent(/of\s+400/);
    });

    await step("Test page size selector change to 50", async () => {
      const pageSizeSelect = canvas.getByLabelText("Items per page");
      
      // Focus the select element and use keyboard to navigate
      await userEvent.click(pageSizeSelect);
      await userEvent.keyboard("{ArrowDown}"); // Move to "50" from default "25"
      await userEvent.keyboard("{Enter}");     // Select the option
      
      // Wait a bit for the state to propagate
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify total pages updated: 10000/50 = 200 pages
      await expect(navigation).toHaveTextContent(/of\s+200/);
    });

    await step("Test page size selector change to 100", async () => {
      const pageSizeSelect = canvas.getByLabelText("Items per page");
      
      // Focus the select element and use keyboard to navigate
      await userEvent.click(pageSizeSelect);
      await userEvent.keyboard("{ArrowDown}"); // Move to "100" from current "50"
      await userEvent.keyboard("{Enter}");     // Select the option
      
      // Wait a bit for the state to propagate
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify total pages updated: 10000/100 = 100 pages
      await expect(navigation).toHaveTextContent(/of\s+100/);
    });
  },
};

/**
 * Large dataset pagination.
 * Demonstrates formatting with large numbers.
 */
export const LargeDataset: Story = {
  args: {
    totalItems: 1250000,
    currentPage: 2500,
    pageSize: 500,
    pageSizeOptions: [100, 250, 500, 1000],
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 2500);
    const [pageSize, setPageSize] = useState(args.pageSize || 500);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation");

    await step("Verify initial state with large numbers", async () => {
      // Check we start at page 2500 (may have comma formatting)
      const pageInput = canvas.getByLabelText("Current page");
      await expect(pageInput).toHaveValue("2,500");

      // Check total pages formatting (1,250,000 / 500 = 2,500 pages)
      await expect(navigation).toHaveTextContent(/of\s+2,500/);
    });

    await step("Test direct page input with large numbers", async () => {
      const pageInput = canvas.getByLabelText("Current page");

      // Clear and type a new page number
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "1000");

      // Verify input updated
      await expect(pageInput).toHaveValue("1000");
    });

    await step("Test input validation with out-of-bounds values", async () => {
      const pageInput = canvas.getByLabelText("Current page");

      // Try to enter a value beyond max pages (2500)
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "5000");

      // Trigger blur to force validation/clamping
      await pageInput.blur();

      // Component should clamp to max valid page (may have comma formatting)
      await expect(pageInput).toHaveValue("2,500");
    });

    await step("Test input validation with minimum bounds", async () => {
      const pageInput = canvas.getByLabelText("Current page");

      // Try to enter a value below 1
      await userEvent.clear(pageInput);
      await userEvent.type(pageInput, "0");

      // Trigger blur to force validation/clamping
      await pageInput.blur();

      // Component should clamp to minimum page (1)
      await expect(pageInput).toHaveValue("1");
    });
  },
};

/**
 * Pagination without page input.
 * Shows page number as text instead of an editable input field.
 * Useful for simplified navigation or mobile interfaces.
 */
export const WithoutPageInput: Story = {
  args: {
    totalItems: 2560,
    currentPage: 5,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    enablePageInput: false,
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 5);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};

/**
 * Pagination without page size selector.
 * Displays only the page navigation controls without the page size dropdown.
 * Useful when page size should be fixed or controlled elsewhere.
 */
export const WithoutPageSizeSelector: Story = {
  args: {
    totalItems: 2560,
    currentPage: 1,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    enablePageSizeSelector: false,
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
};
