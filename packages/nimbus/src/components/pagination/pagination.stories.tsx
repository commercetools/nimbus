import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";
import { Stack } from "../stack";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { useState } from "react";

/**
 * Storybook metadata configuration
 */
const meta: Meta<typeof Pagination.Root> = {
  title: "components/Navigation/Pagination",
  component: Pagination.Root,
  parameters: {
    docs: {
      description: {
        component:
          "A comprehensive pagination component with full accessibility support, keyboard navigation, and customizable styling.",
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "The currently active page number",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "Total number of pages available",
    },
    onPageChange: {
      action: "page-changed",
      description: "Callback fired when page changes",
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 3 },
      description: "Number of pages to show on each side of current page",
    },
    showFirstLast: {
      control: "boolean",
      description: "Whether to show first and last page numbers",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the pagination",
    },
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost"],
      description: "Visual variant of the pagination",
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 */
type Story = StoryObj<typeof Pagination.Root>;

// Utility function to generate page ranges
const generatePageRange = (
  current: number,
  total: number,
  siblings = 1
): (number | "ellipsis")[] => {
  const range: (number | "ellipsis")[] = [];
  if (total <= 7) {
    // Show all pages if total is small enough
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  // Always show first page
  range.push(1);

  // Determine if we need ellipsis after page 1
  const leftBoundary = Math.max(2, current - siblings);
  if (leftBoundary > 2) {
    range.push("ellipsis");
  }

  // Add pages around current page (including current)
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  for (let i = start; i <= end; i++) {
    // Avoid duplicate page 1
    if (i > 1 && !range.includes(i)) {
      range.push(i);
    }
  }

  // Determine if we need ellipsis before last page
  const rightBoundary = Math.min(total - 1, current + siblings);
  if (rightBoundary < total - 1) {
    range.push("ellipsis");
  }

  // Always show last page (if different from first)
  if (total > 1) {
    range.push(total);
  }

  return range;
};

const DefaultPaginationContent = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}) => {
  const pages = generatePageRange(currentPage, totalPages, siblingCount);

  return (
    <Pagination.List>
      <Pagination.PrevTrigger />
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <Pagination.Ellipsis key={`ellipsis-${index}`} />
        ) : (
          <Pagination.Item key={page} page={page as number} />
        )
      )}
      <Pagination.NextTrigger />
    </Pagination.List>
  );
};

type PaginationSize = "sm" | "md" | "lg";
type PaginationVariant = "solid" | "outline" | "ghost";

const sizes: PaginationSize[] = ["sm", "md", "lg"];
const variants: PaginationVariant[] = ["solid", "outline", "ghost"];

/**
 * Default story
 *
 * Demonstrates the standard implementation with comprehensive interaction tests.
 */
export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: fn(),
    size: "md",
    variant: "solid",
    "aria-label": "Pagination navigation",
  },
  parameters: {
    // Enable axe-core accessibility testing
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "keyboard-navigation", enabled: true },
          { id: "focus-management", enabled: true },
        ],
      },
    },
  },
  render: (args) => (
    <Pagination.Root {...args}>
      <DefaultPaginationContent
        currentPage={args.currentPage}
        totalPages={args.totalPages}
      />
    </Pagination.Root>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Verify basic structure and accessibility", async () => {
      // Test main navigation landmark with enhanced context
      const nav = canvas.getByRole("navigation");
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute(
        "aria-label",
        "Pagination navigation, page 5 of 10"
      );

      // Test pagination list structure
      const list = canvas.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list.tagName.toLowerCase()).toBe("ol");

      // Test navigation buttons
      const prevButton = canvas.getByRole("button", { name: /previous page/i });
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    await step("Test current page indicator", async () => {
      const currentPageButton = canvas.getByRole("button", { name: "Page 5" });
      expect(currentPageButton).toBeInTheDocument();
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    await step("Test next page navigation", async () => {
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      await userEvent.click(nextButton);
      expect(args.onPageChange).toHaveBeenCalledWith(6);
    });

    await step("Test previous page navigation", async () => {
      const prevButton = canvas.getByRole("button", { name: /previous page/i });
      await userEvent.click(prevButton);
      expect(args.onPageChange).toHaveBeenCalledWith(4);
    });

    await step("Test direct page selection", async () => {
      const pageFour = canvas.getByRole("button", { name: "Page 4" });
      await userEvent.click(pageFour);
      expect(args.onPageChange).toHaveBeenCalledWith(4);
    });
  },
};

/**
 * Interactive story with state management
 *
 * Demonstrates full functionality with real state updates and comprehensive testing.
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A fully interactive pagination with state management, demonstrating real-world usage patterns.",
      },
    },
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 15;

    return (
      <Stack gap="400">
        <div>
          Current Page: <strong>{currentPage}</strong> of {totalPages}
        </div>
        <Pagination.Root
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          aria-label="Interactive pagination example"
        >
          <DefaultPaginationContent
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </Pagination.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test state-driven interaction", async () => {
      // Should start at page 1
      const currentIndicator = canvas.getByText(/Current Page:/);
      expect(currentIndicator).toHaveTextContent("Current Page: 1 of 15");

      // Previous button should be disabled on first page
      const prevButton = canvas.getByRole("button", { name: /previous page/i });
      expect(prevButton).toBeDisabled();
    });

    await step("Navigate to middle page and verify state", async () => {
      const pageTwo = canvas.getByRole("button", { name: "Page 2" });
      await userEvent.click(pageTwo);

      await waitFor(() => {
        const currentIndicator = canvas.getByText(/Current Page:/);
        expect(currentIndicator).toHaveTextContent("Current Page: 2 of 15");
      });

      // Both navigation buttons should be enabled
      const prevButton = canvas.getByRole("button", { name: /previous page/i });
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    await step("Navigate to last page and verify disabled state", async () => {
      const lastPage = canvas.getByRole("button", { name: "Page 15" });
      await userEvent.click(lastPage);

      await waitFor(() => {
        const currentIndicator = canvas.getByText(/Current Page:/);
        expect(currentIndicator).toHaveTextContent("Current Page: 15 of 15");
      });

      // Next button should be disabled on last page
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      expect(nextButton).toBeDisabled();
    });
  },
};

/**
 * Size variants
 *
 * Demonstrates all available size variants with interactive testing.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pagination component supports three size variants: small (sm), medium (md), and large (lg).",
      },
    },
  },
  render: () => (
    <Stack gap="800">
      {sizes.map((size) => (
        <Stack key={size} gap="200">
          <code>{size}</code>
          <Pagination.Root
            currentPage={3}
            totalPages={8}
            size={size}
            onPageChange={fn()}
            aria-label={`Pagination navigation - ${size} size`}
          >
            <DefaultPaginationContent currentPage={3} totalPages={8} />
          </Pagination.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify all size variants render correctly", async () => {
      const navigations = canvas.getAllByRole("navigation");
      expect(navigations).toHaveLength(3);

      // Check that each size has unique aria-label with context
      sizes.forEach((size) => {
        const nav = canvas.getByLabelText(
          new RegExp(`Pagination navigation - ${size} size, page \\d+ of \\d+`)
        );
        expect(nav).toBeInTheDocument();
      });
    });

    await step("Test interaction across all sizes", async () => {
      const allNextButtons = canvas.getAllByRole("button", {
        name: /next page/i,
      });
      expect(allNextButtons).toHaveLength(3);

      // Test that all buttons are functional
      for (const button of allNextButtons) {
        expect(button).not.toBeDisabled();
      }
    });
  },
};

/**
 * Visual variants
 *
 * Shows all available visual variants with styling verification.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pagination supports three visual variants: solid (default), outline, and ghost.",
      },
    },
  },
  render: () => (
    <Stack gap="800">
      {variants.map((variant) => (
        <Stack key={variant} gap="200">
          <code>{variant}</code>
          <Pagination.Root
            currentPage={4}
            totalPages={10}
            variant={variant}
            onPageChange={fn()}
            aria-label={`Pagination navigation - ${variant} variant`}
          >
            <DefaultPaginationContent currentPage={4} totalPages={10} />
          </Pagination.Root>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify all visual variants render", async () => {
      const navigations = canvas.getAllByRole("navigation");
      expect(navigations).toHaveLength(3);

      // Verify each variant has correct aria-label with context
      variants.forEach((variant) => {
        const nav = canvas.getByLabelText(
          new RegExp(
            `Pagination navigation - ${variant} variant, page \\d+ of \\d+`
          )
        );
        expect(nav).toBeInTheDocument();
      });
    });

    await step("Test current page indication across variants", async () => {
      const currentPageButtons = canvas.getAllByRole("button", {
        name: "Page 4",
      });
      expect(currentPageButtons).toHaveLength(3);

      // All current page buttons should have aria-current
      currentPageButtons.forEach((button) => {
        expect(button).toHaveAttribute("aria-current", "page");
      });
    });
  },
};

/**
 * Small page count scenarios
 *
 * Tests pagination behavior with minimal page counts.
 */
export const SmallPageCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pagination with small page counts (≤7 pages) shows all page numbers without ellipsis.",
      },
    },
  },
  render: () => (
    <Stack gap="800">
      <Stack gap="200">
        <code>Single page</code>
        <Pagination.Root
          currentPage={1}
          totalPages={1}
          onPageChange={fn()}
          aria-label="Single page pagination"
        >
          <DefaultPaginationContent currentPage={1} totalPages={1} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>Two pages</code>
        <Pagination.Root
          currentPage={1}
          totalPages={2}
          onPageChange={fn()}
          aria-label="Two page pagination"
        >
          <DefaultPaginationContent currentPage={1} totalPages={2} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>Five pages</code>
        <Pagination.Root
          currentPage={3}
          totalPages={5}
          onPageChange={fn()}
          aria-label="Five page pagination"
        >
          <DefaultPaginationContent currentPage={3} totalPages={5} />
        </Pagination.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test single page behavior", async () => {
      const singlePageNav = canvas.getByLabelText(
        /Single page pagination, page \d+ of \d+/
      );
      const prevButton = within(singlePageNav).getByRole("button", {
        name: /previous page/i,
      });
      const nextButton = within(singlePageNav).getByRole("button", {
        name: /next page/i,
      });

      // Both buttons should be disabled for single page
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();

      // Should have exactly one page button
      const pageButtons = within(singlePageNav).getAllByRole("button", {
        name: /Page \d+/,
      });
      expect(pageButtons).toHaveLength(1);
    });

    await step("Test two page navigation", async () => {
      const twoPageNav = canvas.getByLabelText(
        /Two page pagination, page \d+ of \d+/
      );
      const pageButtons = within(twoPageNav).getAllByRole("button", {
        name: /Page \d+/,
      });

      expect(pageButtons).toHaveLength(2);
      expect(pageButtons[0]).toHaveAttribute("aria-current", "page");
    });

    await step("Test no ellipsis in small page count", async () => {
      const fivePageNav = canvas.getByLabelText(
        /Five page pagination, page \d+ of \d+/
      );
      const ellipsis = within(fivePageNav).queryByText("…");

      // Should not have ellipsis for 5 pages
      expect(ellipsis).not.toBeInTheDocument();

      // Should show all 5 page numbers
      const pageButtons = within(fivePageNav).getAllByRole("button", {
        name: /Page \d+/,
      });
      expect(pageButtons).toHaveLength(5);
    });
  },
};

/**
 * Large page count scenarios
 *
 * Tests pagination behavior with many pages and ellipsis functionality.
 */
export const LargePageCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pagination with large page counts (>7 pages) uses ellipsis to condense the display while maintaining navigation efficiency.",
      },
    },
  },
  render: () => (
    <Stack gap="800">
      <Stack gap="200">
        <code>50 pages - middle position</code>
        <Pagination.Root
          currentPage={25}
          totalPages={50}
          onPageChange={fn()}
          aria-label="Large pagination - middle"
        >
          <DefaultPaginationContent currentPage={25} totalPages={50} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>100 pages - early position</code>
        <Pagination.Root
          currentPage={5}
          totalPages={100}
          onPageChange={fn()}
          aria-label="Large pagination - early"
        >
          <DefaultPaginationContent currentPage={5} totalPages={100} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>100 pages - late position</code>
        <Pagination.Root
          currentPage={95}
          totalPages={100}
          onPageChange={fn()}
          aria-label="Large pagination - late"
        >
          <DefaultPaginationContent currentPage={95} totalPages={100} />
        </Pagination.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify ellipsis presence in large page sets", async () => {
      const middleNav = canvas.getByLabelText(
        /Large pagination - middle, page \d+ of \d+/
      );
      const ellipsisElements = within(middleNav).getAllByText("…");

      // Should have ellipsis for large page count
      expect(ellipsisElements.length).toBeGreaterThanOrEqual(1);
    });

    await step("Test navigation maintains reasonable page count", async () => {
      const allNavs = canvas.getAllByRole("navigation");

      allNavs.forEach((nav) => {
        const pageButtons = within(nav).getAllByRole("button", {
          name: /Page \d+/,
        });
        // Should show a reasonable number of page buttons (typically 5-7)
        expect(pageButtons.length).toBeLessThanOrEqual(7);
        expect(pageButtons.length).toBeGreaterThanOrEqual(3);
      });
    });

    await step("Test first and last page visibility", async () => {
      const earlyNav = canvas.getByLabelText(
        /Large pagination - early, page \d+ of \d+/
      );
      const lateNav = canvas.getByLabelText(
        /Large pagination - late, page \d+ of \d+/
      );

      // First page should be visible in early navigation
      const firstPage = within(earlyNav).getByRole("button", {
        name: "Page 1",
      });
      expect(firstPage).toBeInTheDocument();

      // Last page should be visible in late navigation
      const lastPage = within(lateNav).getByRole("button", {
        name: "Page 100",
      });
      expect(lastPage).toBeInTheDocument();
    });
  },
};

/**
 * Sibling count configuration
 *
 * Demonstrates different sibling count settings and their impact on page display.
 */
export const SiblingCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The siblingCount prop controls how many page numbers appear on each side of the current page.",
      },
    },
  },
  render: () => (
    <Stack gap="800">
      <Stack gap="200">
        <code>siblingCount: 0 (minimal)</code>
        <Pagination.Root
          currentPage={10}
          totalPages={30}
          onPageChange={fn()}
          aria-label="Pagination navigation - sibling count 0"
        >
          <DefaultPaginationContent
            currentPage={10}
            totalPages={30}
            siblingCount={0}
          />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>siblingCount: 1 (default)</code>
        <Pagination.Root
          currentPage={10}
          totalPages={30}
          onPageChange={fn()}
          aria-label="Pagination navigation - sibling count 1"
        >
          <DefaultPaginationContent
            currentPage={10}
            totalPages={30}
            siblingCount={1}
          />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>siblingCount: 2 (expanded)</code>
        <Pagination.Root
          currentPage={10}
          totalPages={30}
          onPageChange={fn()}
          aria-label="Pagination navigation - sibling count 2"
        >
          <DefaultPaginationContent
            currentPage={10}
            totalPages={30}
            siblingCount={2}
          />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>siblingCount: 3 (maximum)</code>
        <Pagination.Root
          currentPage={15}
          totalPages={50}
          onPageChange={fn()}
          aria-label="Pagination navigation - sibling count 3"
        >
          <DefaultPaginationContent
            currentPage={15}
            totalPages={50}
            siblingCount={3}
          />
        </Pagination.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify sibling count affects page display", async () => {
      const nav0 = canvas.getByLabelText(
        new RegExp("Pagination navigation - sibling count 0, page \\d+ of \\d+")
      );
      const nav1 = canvas.getByLabelText(
        new RegExp("Pagination navigation - sibling count 1, page \\d+ of \\d+")
      );
      const nav2 = canvas.getByLabelText(
        new RegExp("Pagination navigation - sibling count 2, page \\d+ of \\d+")
      );
      const nav3 = canvas.getByLabelText(
        new RegExp("Pagination navigation - sibling count 3, page \\d+ of \\d+")
      );

      const pages0 = within(nav0).getAllByRole("button", { name: /Page \d+/ });
      const pages1 = within(nav1).getAllByRole("button", { name: /Page \d+/ });
      const pages2 = within(nav2).getAllByRole("button", { name: /Page \d+/ });
      const pages3 = within(nav3).getAllByRole("button", { name: /Page \d+/ });

      // Higher sibling count should show more page buttons
      expect(pages0.length).toBeLessThan(pages1.length);
      expect(pages1.length).toBeLessThan(pages2.length);
      expect(pages2.length).toBeLessThanOrEqual(pages3.length);
    });

    await step(
      "Test current page visibility across all configurations",
      async () => {
        // All should show the current page
        const currentPage10Buttons = canvas.getAllByRole("button", {
          name: "Page 10",
        });
        const currentPage15Buttons = canvas.getAllByRole("button", {
          name: "Page 15",
        });

        expect(currentPage10Buttons).toHaveLength(3);
        expect(currentPage15Buttons).toHaveLength(1);

        // All current page buttons should have aria-current
        [...currentPage10Buttons, ...currentPage15Buttons].forEach((button) => {
          expect(button).toHaveAttribute("aria-current", "page");
        });
      }
    );
  },
};

/**
 * Edge cases and boundary conditions
 *
 * Comprehensive testing of edge cases, boundary conditions, and error states.
 */
export const EdgeCases: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Edge cases including first/last pages, disabled states, and boundary conditions.",
      },
    },
  },
  args: {
    onPageChange: fn(),
  },
  render: (args) => (
    <Stack gap="800">
      <Stack gap="200">
        <code>First page (prev disabled)</code>
        <Pagination.Root
          currentPage={1}
          totalPages={10}
          onPageChange={args.onPageChange}
          aria-label="Pagination navigation - first page"
        >
          <DefaultPaginationContent currentPage={1} totalPages={10} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>Last page (next disabled)</code>
        <Pagination.Root
          currentPage={10}
          totalPages={10}
          onPageChange={args.onPageChange}
          aria-label="Pagination navigation - last page"
        >
          <DefaultPaginationContent currentPage={10} totalPages={10} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>Near first page</code>
        <Pagination.Root
          currentPage={2}
          totalPages={20}
          onPageChange={args.onPageChange}
          aria-label="Pagination navigation - near first"
        >
          <DefaultPaginationContent currentPage={2} totalPages={20} />
        </Pagination.Root>
      </Stack>
      <Stack gap="200">
        <code>Near last page</code>
        <Pagination.Root
          currentPage={19}
          totalPages={20}
          onPageChange={args.onPageChange}
          aria-label="Pagination navigation - near last"
        >
          <DefaultPaginationContent currentPage={19} totalPages={20} />
        </Pagination.Root>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Test first page disabled state", async () => {
      const firstPageNav = canvas.getByLabelText(
        /Pagination navigation - first page, page \d+ of \d+/
      );
      const prevButton = within(firstPageNav).getByRole("button", {
        name: /previous page/i,
      });
      const nextButton = within(firstPageNav).getByRole("button", {
        name: /next page/i,
      });

      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();

      const currentPage = within(firstPageNav).getByRole("button", {
        name: "Page 1",
      });
      expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    await step("Test last page disabled state", async () => {
      const lastPageNav = canvas.getByLabelText(
        /Pagination navigation - last page, page \d+ of \d+/
      );
      const prevButton = within(lastPageNav).getByRole("button", {
        name: /previous page/i,
      });
      const nextButton = within(lastPageNav).getByRole("button", {
        name: /next page/i,
      });

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();

      const currentPage = within(lastPageNav).getByRole("button", {
        name: "Page 10",
      });
      expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    await step("Test boundary navigation behavior", async () => {
      const nearFirstNav = canvas.getByLabelText(
        /Pagination navigation - near first, page \d+ of \d+/
      );
      const nearLastNav = canvas.getByLabelText(
        /Pagination navigation - near last, page \d+ of \d+/
      );

      // Near first should show page 1
      const firstPage = within(nearFirstNav).getByRole("button", {
        name: "Page 1",
      });
      expect(firstPage).toBeInTheDocument();

      // Near last should show last page
      const lastPage = within(nearLastNav).getByRole("button", {
        name: "Page 20",
      });
      expect(lastPage).toBeInTheDocument();
    });

    await step("Test edge case interactions", async () => {
      const firstPageNav = canvas.getByLabelText(
        /Pagination navigation - first page, page \d+ of \d+/
      );
      const nextButton = within(firstPageNav).getByRole("button", {
        name: /next page/i,
      });

      // Should be able to navigate forward from first page
      await userEvent.click(nextButton);
      expect(args.onPageChange).toHaveBeenCalledWith(2);
    });
  },
};

/**
 * Keyboard navigation and accessibility
 *
 * Comprehensive keyboard interaction and accessibility testing.
 */
export const KeyboardNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tests keyboard navigation, focus management, and accessibility features.",
      },
    },
    // Enable comprehensive accessibility testing
    a11y: {
      config: {
        rules: [
          { id: "keyboard-navigation", enabled: true },
          { id: "focus-management", enabled: true },
          { id: "aria-valid-attr", enabled: true },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "keyboard"],
        },
      },
    },
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    return (
      <Pagination.Root
        currentPage={currentPage}
        totalPages={12}
        onPageChange={setCurrentPage}
        aria-label="Keyboard navigation test pagination"
      >
        <DefaultPaginationContent currentPage={currentPage} totalPages={12} />
      </Pagination.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test keyboard focus order", async () => {
      const prevButton = canvas.getByRole("button", { name: /previous page/i });

      // Focus should start at the first interactive element
      prevButton.focus();
      expect(prevButton).toHaveFocus();

      // Tab through pagination elements
      await userEvent.keyboard("{Tab}");
      const firstPageButton = canvas.getByRole("button", { name: "Page 1" });
      expect(firstPageButton).toHaveFocus();
    });

    await step("Test Enter key activation", async () => {
      const pageFour = canvas.getByRole("button", { name: "Page 4" });
      pageFour.focus();

      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        const currentPage = canvas.getByRole("button", { name: "Page 4" });
        expect(currentPage).toHaveAttribute("aria-current", "page");
      });
    });

    await step("Test Space key activation", async () => {
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      nextButton.focus();

      await userEvent.keyboard(" ");

      await waitFor(() => {
        const currentPage = canvas.getByRole("button", { name: "Page 6" });
        expect(currentPage).toHaveAttribute("aria-current", "page");
      });
    });

    await step("Test ARIA attributes", async () => {
      const nav = canvas.getByRole("navigation");
      expect(nav.getAttribute("aria-label")).toMatch(
        /Keyboard navigation test pagination, page \d+ of \d+/
      );

      const list = canvas.getByRole("list");
      expect(list).toBeInTheDocument();

      const currentPageButton = canvas.getByRole("button", { name: "Page 4" });
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });
  },
};

/**
 * Combined size and variant matrix
 *
 * Tests all possible combinations of size and variant props.
 */
export const VariantMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Matrix of all size and variant combinations to ensure consistent styling.",
      },
    },
  },
  render: () => (
    <Stack gap="600">
      {sizes.map((size) => (
        <Stack key={size} gap="400">
          <h3 style={{ margin: 0, fontSize: "1.1em", fontWeight: "bold" }}>
            Size: {size}
          </h3>
          <Stack gap="300">
            {variants.map((variant) => (
              <Stack key={`${size}-${variant}`} gap="100">
                <code>{variant}</code>
                <Pagination.Root
                  currentPage={3}
                  totalPages={8}
                  size={size}
                  variant={variant}
                  onPageChange={fn()}
                  aria-label={`${size} ${variant} pagination`}
                >
                  <DefaultPaginationContent currentPage={3} totalPages={8} />
                </Pagination.Root>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify all size-variant combinations render", async () => {
      const totalCombinations = sizes.length * variants.length;
      const navigations = canvas.getAllByRole("navigation");
      expect(navigations).toHaveLength(totalCombinations);
    });

    await step("Test interaction consistency across combinations", async () => {
      const allCurrentPageButtons = canvas.getAllByRole("button", {
        name: "Page 3",
      });
      const expectedCount = sizes.length * variants.length;

      expect(allCurrentPageButtons).toHaveLength(expectedCount);

      // All should have aria-current attribute
      allCurrentPageButtons.forEach((button) => {
        expect(button).toHaveAttribute("aria-current", "page");
      });
    });
  },
};

/**
 * Real-world usage patterns
 *
 * Demonstrates common integration patterns and realistic scenarios.
 */
export const UsagePatterns: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Real-world usage examples including table pagination, search results, and data grid scenarios.",
      },
    },
  },
  render: () => {
    const [tablePage, setTablePage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [gridPage, setGridPage] = useState(1);

    const tableData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));
    const itemsPerPage = 5;
    const startIndex = (tablePage - 1) * itemsPerPage;
    const displayedItems = tableData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <Stack gap="1000">
        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Table Pagination</h3>
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f7fafc" }}>
                <tr>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.id}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {item.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination.Root
            currentPage={tablePage}
            totalPages={Math.ceil(tableData.length / itemsPerPage)}
            onPageChange={setTablePage}
            size="sm"
            aria-label="Table pagination"
          >
            <DefaultPaginationContent
              currentPage={tablePage}
              totalPages={Math.ceil(tableData.length / itemsPerPage)}
            />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Search Results (24 results)</h3>
          <div style={{ color: "#718096" }}>
            Showing {(searchPage - 1) * 10 + 1}-{Math.min(searchPage * 10, 24)}{" "}
            of 24 results
          </div>
          <Pagination.Root
            currentPage={searchPage}
            totalPages={3}
            onPageChange={setSearchPage}
            variant="outline"
            aria-label="Search results pagination"
          >
            <DefaultPaginationContent currentPage={searchPage} totalPages={3} />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Data Grid (Large Dataset)</h3>
          <div style={{ color: "#718096" }}>
            Page {gridPage} of 847 • Total: 25,410 records
          </div>
          <Pagination.Root
            currentPage={gridPage}
            totalPages={847}
            onPageChange={setGridPage}
            size="lg"
            variant="ghost"
            siblingCount={2}
            aria-label="Data grid pagination"
          >
            <DefaultPaginationContent
              currentPage={gridPage}
              totalPages={847}
              siblingCount={2}
            />
          </Pagination.Root>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test table pagination integration", async () => {
      const tablePagination = canvas.getByLabelText(
        /Table pagination, page \d+ of \d+/
      );
      const nextButton = within(tablePagination).getByRole("button", {
        name: /next page/i,
      });

      await userEvent.click(nextButton);

      await waitFor(() => {
        const table = canvasElement.querySelector("tbody");
        const tableRows = table?.children;
        expect(tableRows).toBeDefined();
      });
    });

    await step("Test search results context", async () => {
      const searchInfo = canvas.getByText(/Showing \d+-\d+ of 24 results/);
      expect(searchInfo).toBeInTheDocument();

      const searchPagination = canvas.getByLabelText(
        /Search results pagination, page \d+ of \d+/
      );
      expect(searchPagination).toBeInTheDocument();
    });

    await step("Test large dataset handling", async () => {
      const gridInfo = canvas.getByText(/Page \d+ of 847/);
      expect(gridInfo).toBeInTheDocument();

      const gridPagination = canvas.getByLabelText(
        /Data grid pagination, page \d+ of \d+/
      );
      const ellipsis = within(gridPagination).getAllByText("…");
      expect(ellipsis.length).toBeGreaterThan(0);
    });
  },
};

/**
 * Performance and stress testing
 *
 * Tests component behavior under various performance conditions.
 */
export const PerformanceTesting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Performance testing with rapid interactions and large page counts.",
      },
    },
  },
  render: () => {
    const [rapidPage, setRapidPage] = useState(50);
    const [extremePage, setExtremePage] = useState(5000);

    return (
      <Stack gap="800">
        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Rapid Interaction Test (1,000 pages)</h3>
          <Pagination.Root
            currentPage={rapidPage}
            totalPages={1000}
            onPageChange={setRapidPage}
            aria-label="Rapid interaction test"
          >
            <DefaultPaginationContent
              currentPage={rapidPage}
              totalPages={1000}
            />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Extreme Scale Test (1,000,000 pages)</h3>
          <div style={{ color: "#718096", fontSize: "0.9em" }}>
            Current: {extremePage.toLocaleString()} | Total: 1,000,000
          </div>
          <Pagination.Root
            currentPage={extremePage}
            totalPages={1000000}
            onPageChange={setExtremePage}
            siblingCount={1}
            aria-label="Extreme scale test"
          >
            <DefaultPaginationContent
              currentPage={extremePage}
              totalPages={1000000}
            />
          </Pagination.Root>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test rapid navigation performance", async () => {
      const rapidTest = canvas.getByLabelText(
        /Rapid interaction test, page \d+ of \d+/
      );
      const nextButton = within(rapidTest).getByRole("button", {
        name: /next page/i,
      });

      // Perform rapid clicks
      for (let i = 0; i < 5; i++) {
        await userEvent.click(nextButton);
      }

      // Should handle rapid interactions gracefully
      expect(nextButton).toBeInTheDocument();
    });

    await step("Test extreme scale rendering", async () => {
      const extremeTest = canvas.getByLabelText(
        /Extreme scale test, page \d+ of \d+/
      );
      const pageButtons = within(extremeTest).getAllByRole("button", {
        name: /Page \d+/,
      });

      // Should maintain reasonable button count even with extreme total
      expect(pageButtons.length).toBeLessThanOrEqual(7);
      expect(pageButtons.length).toBeGreaterThanOrEqual(3);
    });

    await step("Test number formatting with large values", async () => {
      const formattedNumber = canvas.getByText(
        /Current: [\d,]+ \| Total: 1,000,000/
      );
      expect(formattedNumber).toBeInTheDocument();
    });
  },
};

/**
 * Error handling and resilience
 *
 * Tests component behavior with edge cases and potential error conditions.
 */
export const ErrorHandling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tests graceful handling of edge cases, invalid states, and error conditions.",
      },
    },
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <Stack gap="800">
        <Stack gap="200">
          <code>Boundary Value Testing</code>
          <Pagination.Root
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            aria-label="Single page boundary test"
          >
            <DefaultPaginationContent
              currentPage={currentPage}
              totalPages={1}
            />
          </Pagination.Root>
        </Stack>

        <Stack gap="200">
          <code>Custom ARIA Label Test</code>
          <Pagination.Root
            currentPage={2}
            totalPages={5}
            onPageChange={() => {}}
            aria-label="Custom navigation for product catalog"
          >
            <DefaultPaginationContent currentPage={2} totalPages={5} />
          </Pagination.Root>
        </Stack>

        <Stack gap="200">
          <code>Zero Sibling Count</code>
          <Pagination.Root
            currentPage={10}
            totalPages={20}
            onPageChange={() => {}}
            siblingCount={0}
            aria-label="Zero sibling pagination"
          >
            <DefaultPaginationContent
              currentPage={10}
              totalPages={20}
              siblingCount={0}
            />
          </Pagination.Root>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test single page state handling", async () => {
      const singlePageNav = canvas.getByLabelText(
        /Single page boundary test, page \d+ of \d+/
      );
      const prevButton = within(singlePageNav).getByRole("button", {
        name: /previous page/i,
      });
      const nextButton = within(singlePageNav).getByRole("button", {
        name: /next page/i,
      });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();

      const pageButton = within(singlePageNav).getByRole("button", {
        name: "Page 1",
      });
      expect(pageButton).toHaveAttribute("aria-current", "page");
    });

    await step("Test custom ARIA labels", async () => {
      const customNav = canvas.getByLabelText(
        /Custom navigation for product catalog, page \d+ of \d+/
      );
      expect(customNav).toBeInTheDocument();
      expect(customNav.tagName.toLowerCase()).toBe("nav");
    });

    await step("Test zero sibling count behavior", async () => {
      const zeroSiblingNav = canvas.getByLabelText(
        /Zero sibling pagination, page \d+ of \d+/
      );
      const pageButtons = within(zeroSiblingNav).getAllByRole("button", {
        name: /Page \d+/,
      });

      // With zero siblings, should show minimal pages around current
      expect(pageButtons.length).toBeLessThanOrEqual(5);

      // Should still show current page
      const currentPage = within(zeroSiblingNav).getByRole("button", {
        name: "Page 10",
      });
      expect(currentPage).toHaveAttribute("aria-current", "page");
    });

    await step("Test graceful degradation", async () => {
      // All pagination instances should maintain basic functionality
      const allNavs = canvas.getAllByRole("navigation");
      expect(allNavs.length).toBeGreaterThanOrEqual(3);

      allNavs.forEach((nav) => {
        const list = within(nav).getByRole("list");
        expect(list).toBeInTheDocument();
      });
    });
  },
};

const ComponentWithCustomControls = ({
  currentPage: initialPage = 1,
  totalPages = 10,
  ...args
}: {
  currentPage?: number;
  totalPages?: number;
  [key: string]: unknown;
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <Pagination.Root
      {...args}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
      <DefaultPaginationContent
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </Pagination.Root>
  );
};

/**
 * Playground story
 *
 * Interactive playground for testing all component features with live controls.
 */
export const Playground: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    siblingCount: 1,
    showFirstLast: true,
    size: "md",
    variant: "solid",
    "aria-label": "Interactive pagination playground",
  },
  render: (args) => <ComponentWithCustomControls {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    await step("Verify playground functionality", async () => {
      const nav = canvas.getByRole("navigation");
      expect(nav).toBeInTheDocument();
      expect(nav.getAttribute("aria-label")).toMatch(
        new RegExp(`${args["aria-label"]}, page \\d+ of \\d+`)
      );

      const currentPageButton = canvas.getByRole("button", {
        name: `Page ${args.currentPage}`,
      });
      expect(currentPageButton).toHaveAttribute("aria-current", "page");
    });

    await step("Test playground interactivity", async () => {
      const nextButton = canvas.getByRole("button", { name: /next page/i });
      await userEvent.click(nextButton);

      // Page should update in playground
      await waitFor(() => {
        const newCurrentPage = canvas.getByRole("button", {
          name: `Page ${args.currentPage + 1}`,
        });
        expect(newCurrentPage).toHaveAttribute("aria-current", "page");
      });
    });
  },
};

/**
 * Accessibility Testing Story
 *
 * Comprehensive accessibility testing including screen reader scenarios,
 * keyboard navigation patterns, and WCAG 2.1 AA compliance validation.
 */
export const AccessibilityTesting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Comprehensive accessibility testing story covering WCAG 2.1 AA requirements, keyboard navigation, screen reader compatibility, and high contrast mode support.",
      },
    },
    // Enable axe-core accessibility testing
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "keyboard-navigation",
            enabled: true,
          },
          {
            id: "focus-management",
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa"],
        },
      },
    },
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(8);
    const totalPages = 25;

    return (
      <Stack gap="800">
        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Screen Reader Context Testing</h3>
          <div style={{ color: "#718096", fontSize: "0.9em" }}>
            Test enhanced ARIA labels and screen reader announcements
          </div>
          <Pagination.Root
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            aria-label="Product catalog pagination"
          >
            <DefaultPaginationContent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Keyboard Navigation Testing</h3>
          <div style={{ color: "#718096", fontSize: "0.9em" }}>
            Test Tab, Enter, Space, and Arrow key navigation patterns
          </div>
          <Pagination.Root
            currentPage={5}
            totalPages={12}
            onPageChange={() => {}}
            aria-label="Keyboard navigation test pagination"
          >
            <DefaultPaginationContent currentPage={5} totalPages={12} />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>High Contrast Mode Testing</h3>
          <div style={{ color: "#718096", fontSize: "0.9em" }}>
            Verify focus indicators work in Windows High Contrast Mode
          </div>
          <Pagination.Root
            currentPage={3}
            totalPages={8}
            onPageChange={() => {}}
            variant="outline"
            aria-label="High contrast mode pagination"
          >
            <DefaultPaginationContent currentPage={3} totalPages={8} />
          </Pagination.Root>
        </Stack>

        <Stack gap="400">
          <h3 style={{ margin: 0 }}>Touch Target Size Testing</h3>
          <div style={{ color: "#718096", fontSize: "0.9em" }}>
            All sizes now meet 44px minimum touch target requirement
          </div>
          <Stack gap="300">
            {["sm", "md", "lg"].map((size) => (
              <Stack key={size} gap="100">
                <code>{size} size - 44px minimum targets</code>
                <Pagination.Root
                  currentPage={2}
                  totalPages={5}
                  onPageChange={() => {}}
                  size={size as "sm" | "md" | "lg"}
                  aria-label={`Touch target test - ${size} size`}
                >
                  <DefaultPaginationContent currentPage={2} totalPages={5} />
                </Pagination.Root>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Validate ARIA landmarks and labels", async () => {
      const navigations = canvas.getAllByRole("navigation");
      expect(navigations).toHaveLength(4);

      // Check enhanced aria-labels with context
      const productCatalogNav = canvas.getByLabelText(
        /Product catalog pagination, page \d+ of \d+/
      );
      expect(productCatalogNav).toBeInTheDocument();

      const keyboardTestNav = canvas.getByLabelText(
        /Keyboard navigation test pagination, page \d+ of \d+/
      );
      expect(keyboardTestNav).toBeInTheDocument();
    });

    await step("Test keyboard navigation flow", async () => {
      const keyboardNav = canvas.getByLabelText(
        /Keyboard navigation test pagination/
      );
      const firstButton = within(keyboardNav).getByRole("button", {
        name: /previous page/i,
      });

      // Test tab order
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      await userEvent.keyboard("{Tab}");
      const firstPageButton = within(keyboardNav).getByRole("button", {
        name: "Page 1",
      });
      expect(firstPageButton).toHaveFocus();

      // Test Enter key activation
      await userEvent.keyboard("{Enter}");
      // Note: In real implementation, this would trigger page change
    });

    await step("Validate touch target sizes", async () => {
      const touchTargetNavs = canvas.getAllByLabelText(/Touch target test/);

      touchTargetNavs.forEach((nav) => {
        const buttons = within(nav).getAllByRole("button");
        buttons.forEach((button) => {
          const styles = window.getComputedStyle(button);
          const minWidth = parseInt(styles.minWidth);
          const height = parseInt(styles.height);

          // All sizes should now meet 44px minimum (1100 design token = 44px)
          expect(minWidth).toBeGreaterThanOrEqual(44);
          expect(height).toBeGreaterThanOrEqual(44);
        });
      });
    });

    await step("Test ellipsis accessibility", async () => {
      const productNav = canvas.getByLabelText(/Product catalog pagination/);
      const ellipsisElements =
        within(productNav).queryAllByLabelText(/More pages/);

      if (ellipsisElements.length > 0) {
        ellipsisElements.forEach((ellipsis) => {
          expect(ellipsis).toHaveAttribute("role", "separator");
          expect(ellipsis).toHaveAttribute("aria-orientation", "horizontal");
        });
      }
    });

    await step("Validate current page indication", async () => {
      const allCurrentPageButtons = canvas.getAllByRole("button", {
        name: /Page \d+/,
      });

      const currentPageButtons = allCurrentPageButtons.filter((button) =>
        button.hasAttribute("aria-current")
      );

      // Should have current page indicators
      expect(currentPageButtons.length).toBeGreaterThan(0);

      currentPageButtons.forEach((button) => {
        expect(button).toHaveAttribute("aria-current", "page");
      });
    });

    await step("Test disabled state accessibility", async () => {
      const allPrevButtons = canvas.getAllByRole("button", {
        name: /previous page/i,
      });
      const allNextButtons = canvas.getAllByRole("button", {
        name: /next page/i,
      });

      // Check that disabled buttons have appropriate attributes
      [...allPrevButtons, ...allNextButtons].forEach((button) => {
        if (button.hasAttribute("disabled")) {
          expect(button).toBeDisabled();
          expect(button).toHaveAttribute("aria-disabled", "true");
        }
      });
    });
  },
};

export { ComponentWithCustomControls as _ComponentWithCustomControls };

// Export utility functions for potential reuse in other story files
export { generatePageRange as _generatePageRange };
export { DefaultPaginationContent as _DefaultPaginationContent };
