import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagGroup, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected tags
 * @docs-order 1
 */
describe("TagGroup - Basic rendering", () => {
  it("renders tags with content", () => {
    render(
      <NimbusProvider>
        <TagGroup.Root aria-label="Categories">
          <TagGroup.TagList>
            <TagGroup.Tag>Electronics</TagGroup.Tag>
            <TagGroup.Tag>Clothing</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });

  it("renders with dynamic items", () => {
    const items = [
      { id: "electronics", name: "Electronics" },
      { id: "clothing", name: "Clothing" },
    ];

    render(
      <NimbusProvider>
        <TagGroup.Root aria-label="Categories">
          <TagGroup.TagList items={items}>
            {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });
});

/**
 * @docs-section selection
 * @docs-title Selection Tests
 * @docs-description Test single and multiple selection modes
 * @docs-order 2
 */
describe("TagGroup - Selection", () => {
  it("handles single selection", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <TagGroup.Root
          aria-label="Priority"
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
        >
          <TagGroup.TagList>
            <TagGroup.Tag id="low">Low</TagGroup.Tag>
            <TagGroup.Tag id="high">High</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    const lowTag = screen.getByText("Low");
    await user.click(lowTag);

    await waitFor(() => {
      expect(handleSelectionChange).toHaveBeenCalled();
      const selection = handleSelectionChange.mock.calls[0][0];
      expect(selection.has("low")).toBe(true);
    });
  });

  it("handles multiple selection", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <TagGroup.Root
          aria-label="Filters"
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        >
          <TagGroup.TagList>
            <TagGroup.Tag id="tag1">Tag 1</TagGroup.Tag>
            <TagGroup.Tag id="tag2">Tag 2</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByText("Tag 1"));
    await user.click(screen.getByText("Tag 2"));

    await waitFor(() => {
      expect(handleSelectionChange).toHaveBeenCalledTimes(2);
    });
  });
});

/**
 * @docs-section removal
 * @docs-title Removal Tests
 * @docs-description Test tag removal functionality
 * @docs-order 3
 */
describe("TagGroup - Removal", () => {
  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <NimbusProvider>
        <TagGroup.Root aria-label="Tags" onRemove={handleRemove}>
          <TagGroup.TagList>
            <TagGroup.Tag id="tag1">Tag 1</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    const removeButton = screen.getByLabelText("Remove tag");
    await user.click(removeButton);

    await waitFor(() => {
      expect(handleRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          has: expect.any(Function),
        })
      );
    });
  });

  it("removes tag with keyboard", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();

    render(
      <NimbusProvider>
        <TagGroup.Root aria-label="Tags" onRemove={handleRemove}>
          <TagGroup.TagList>
            <TagGroup.Tag id="tag1">Tag 1</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    const tag = screen.getByText("Tag 1");
    await user.click(tag);
    await user.keyboard("{Backspace}");

    await waitFor(() => {
      expect(handleRemove).toHaveBeenCalled();
    });
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions
 * @docs-order 4
 */
describe("TagGroup - Keyboard navigation", () => {
  it("navigates between tags with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <TagGroup.Root aria-label="Tags">
          <TagGroup.TagList>
            <TagGroup.Tag>First</TagGroup.Tag>
            <TagGroup.Tag>Second</TagGroup.Tag>
            <TagGroup.Tag>Third</TagGroup.Tag>
          </TagGroup.TagList>
        </TagGroup.Root>
      </NimbusProvider>
    );

    // Tab to enter the tag group
    await user.tab();
    expect(document.activeElement?.textContent).toContain("First");

    // Arrow right to next tag
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.textContent).toContain("Second");

    // Arrow left to previous tag
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement?.textContent).toContain("First");
  });
});
