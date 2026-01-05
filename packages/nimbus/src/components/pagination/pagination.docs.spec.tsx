import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the pagination component renders with expected controls and labels
 * @docs-order 1
 */
describe("Pagination - Basic rendering", () => {
  it("renders pagination navigation with accessible controls", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={100} />
      </NimbusProvider>
    );

    // Verify navigation element exists
    const nav = screen.getByRole("navigation", { name: /pagination/i });
    expect(nav).toBeInTheDocument();

    // Verify previous/next buttons
    expect(
      screen.getByRole("button", { name: /go to previous page/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to next page/i })
    ).toBeInTheDocument();

    // Verify page input exists
    expect(screen.getByLabelText(/current page/i)).toBeInTheDocument();
  });

  it("renders page size selector when enabled", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={100} enablePageSizeSelector={true} />
      </NimbusProvider>
    );

    // Verify page size selector is present
    expect(screen.getByLabelText(/items per page/i)).toBeInTheDocument();
    expect(screen.getByText(/items per page/i)).toBeInTheDocument();
  });

  it("hides page input when disabled", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={100} enablePageInput={false} />
      </NimbusProvider>
    );

    // Page input should not exist
    expect(screen.queryByLabelText(/current page/i)).not.toBeInTheDocument();

    // But current page number should still be displayed as text
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled pagination state management
 * @docs-order 2
 */
describe("Pagination - Controlled mode", () => {
  it("respects controlled currentPage prop", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Pagination totalItems={100} currentPage={1} pageSize={10} />
      </NimbusProvider>
    );

    // Verify initial page
    const pageInput = screen.getByLabelText(/current page/i);
    expect(pageInput).toHaveValue("1");

    // Update to page 5
    rerender(
      <NimbusProvider>
        <Pagination totalItems={100} currentPage={5} pageSize={10} />
      </NimbusProvider>
    );

    expect(pageInput).toHaveValue("5");
  });

  it("calls onPageChange callback when navigating", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          currentPage={1}
          pageSize={10}
          onPageChange={handlePageChange}
        />
      </NimbusProvider>
    );

    // Click next button
    const nextButton = screen.getByRole("button", {
      name: /go to next page/i,
    });
    await user.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageSizeChange callback when changing page size", async () => {
    const user = userEvent.setup();
    const handlePageSizeChange = vi.fn();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          pageSize={10}
          pageSizeOptions={[10, 20, 50]}
          enablePageSizeSelector={true}
          onPageSizeChange={handlePageSizeChange}
        />
      </NimbusProvider>
    );

    // Open the page size selector
    const selector = screen.getByLabelText(/items per page/i);
    await user.click(selector);

    // Select a different page size
    const option20 = screen.getByRole("option", { name: "20" });
    await user.click(option20);

    expect(handlePageSizeChange).toHaveBeenCalledWith(20);
  });
});

/**
 * @docs-section page-navigation
 * @docs-title Page Navigation Tests
 * @docs-description Test previous/next navigation and direct page input
 * @docs-order 3
 */
describe("Pagination - Page navigation", () => {
  it("disables previous button on first page", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={100} currentPage={1} pageSize={10} />
      </NimbusProvider>
    );

    const prevButton = screen.getByRole("button", {
      name: /go to previous page/i,
    });
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={100} currentPage={10} pageSize={10} />
      </NimbusProvider>
    );

    const nextButton = screen.getByRole("button", {
      name: /go to next page/i,
    });
    expect(nextButton).toBeDisabled();
  });

  it("allows direct page number input", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          currentPage={1}
          pageSize={10}
          onPageChange={handlePageChange}
          enablePageInput={true}
        />
      </NimbusProvider>
    );

    const pageInput = screen.getByLabelText(/current page/i);

    // Clear and type new page number, then blur to commit
    await user.clear(pageInput);
    await user.type(pageInput, "5");
    await user.tab(); // Blur the input to commit the value

    expect(handlePageChange).toHaveBeenCalledWith(5);
  });

  it("validates page input within bounds", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          currentPage={1}
          pageSize={10}
          onPageChange={handlePageChange}
          enablePageInput={true}
        />
      </NimbusProvider>
    );

    const pageInput = screen.getByLabelText(/current page/i);

    // Try to enter page number beyond total pages (max is 10), then blur to commit
    await user.clear(pageInput);
    await user.type(pageInput, "999");
    await user.tab(); // Blur the input to commit the value

    // Should clamp to max page (10)
    expect(handlePageChange).toHaveBeenCalledWith(10);
  });
});

/**
 * @docs-section page-size-selector
 * @docs-title Page Size Selector Tests
 * @docs-description Test page size selection and option configuration
 * @docs-order 4
 */
describe("Pagination - Page size selector", () => {
  it("renders custom page size options", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          pageSize={25}
          pageSizeOptions={[25, 50, 75, 100]}
          enablePageSizeSelector={true}
        />
      </NimbusProvider>
    );

    // Open the selector
    const selector = screen.getByLabelText(/items per page/i);
    await user.click(selector);

    // Verify custom options are present
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "75" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument();
  });

  it("shows correct selected page size", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          pageSize={50}
          pageSizeOptions={[10, 20, 50, 100]}
          enablePageSizeSelector={true}
        />
      </NimbusProvider>
    );

    // Open selector to verify selected option
    const selector = screen.getByLabelText(/items per page/i);
    await user.click(selector);

    const option50 = screen.getByRole("option", { name: "50" });
    expect(option50).toHaveAttribute("aria-selected", "true");
  });
});

/**
 * @docs-section integration
 * @docs-title Integration Tests
 * @docs-description Test pagination with data rendering and realistic scenarios
 * @docs-order 5
 */
describe("Pagination - Integration scenarios", () => {
  it("calculates correct page ranges for data slicing", () => {
    const totalItems = 47;
    const pageSize = 10;
    const currentPage = 3;

    // Calculate start and end indices for data slicing
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    expect(startIndex).toBe(20);
    expect(endIndex).toBe(30);

    // For display: start item is 1-based
    const startItem = startIndex + 1;
    const endItem = Math.min(endIndex, totalItems);

    expect(startItem).toBe(21);
    expect(endItem).toBe(30);
  });

  it("handles page size changes by resetting to valid page", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();
    const handlePageSizeChange = vi.fn();

    const { rerender } = render(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          currentPage={10}
          pageSize={10}
          pageSizeOptions={[10, 50]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          enablePageSizeSelector={true}
        />
      </NimbusProvider>
    );

    // Currently on page 10 of 10 (100 items / 10 per page)
    const nextButton = screen.getByRole("button", { name: /go to next page/i });
    expect(nextButton).toBeDisabled();

    // Change page size to 50
    const selector = screen.getByLabelText(/items per page/i);
    await user.click(selector);

    const option50 = screen.getByRole("option", { name: "50" });
    await user.click(option50);

    expect(handlePageSizeChange).toHaveBeenCalledWith(50);

    // With 100 items and 50 per page, we now have 2 total pages
    // Current page 10 is invalid, should adjust to page 2
    rerender(
      <NimbusProvider>
        <Pagination
          totalItems={100}
          currentPage={2}
          pageSize={50}
          pageSizeOptions={[10, 50]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          enablePageSizeSelector={true}
        />
      </NimbusProvider>
    );

    const pageInput = screen.getByLabelText(/current page/i);
    expect(pageInput).toHaveValue("2");
  });

  it("works with zero items", () => {
    render(
      <NimbusProvider>
        <Pagination totalItems={0} pageSize={10} />
      </NimbusProvider>
    );

    // Should show page 1 of 1
    const pageInput = screen.getByLabelText(/current page/i);
    expect(pageInput).toHaveValue("1");

    // Both navigation buttons should be disabled
    expect(
      screen.getByRole("button", { name: /go to previous page/i })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /go to next page/i })
    ).toBeDisabled();
  });
});
