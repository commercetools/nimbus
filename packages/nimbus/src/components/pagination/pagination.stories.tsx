import type { Meta, StoryObj } from "@storybook/react-vite";
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
    isDisabled: {
      control: { type: "boolean" },
      description: "Disables all pagination controls",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
      description: "Size variant for pagination controls",
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
    size: "md",
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
};

/**
 * Pagination on the last page.
 * Demonstrates disabled next button behavior.
 */
export const LastPage: Story = {
  args: {
    totalItems: 2560,
    currentPage: 128, // Last page with pageSize of 20
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
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
};

/**
 * Disabled pagination.
 * All controls are disabled for loading states.
 */
export const Disabled: Story = {
  args: {
    totalItems: 2560,
    currentPage: 5,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    isDisabled: true,
  },
};

/**
 * Small size pagination.
 * More compact version for dense layouts.
 */
export const SmallSize: Story = {
  args: {
    totalItems: 2560,
    currentPage: 10,
    pageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    size: "sm",
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
};
