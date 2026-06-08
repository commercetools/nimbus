import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tree, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Render a tree with nested items and verify the treegrid structure
 * @docs-order 1
 */
describe("Tree - Basic rendering", () => {
  it("renders a treegrid with rows", () => {
    render(
      <NimbusProvider>
        <Tree.Root aria-label="Files" defaultExpandedKeys={["documents"]}>
          <Tree.Item id="documents" textValue="Documents">
            <Tree.ItemContent>
              <Tree.Indicator />
              Documents
            </Tree.ItemContent>
            <Tree.Item id="report" textValue="Weekly Report">
              <Tree.ItemContent>
                <Tree.Indicator />
                Weekly Report
              </Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
        </Tree.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("treegrid", { name: "Files" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Documents/ })).toBeInTheDocument();
    expect(
      screen.getByRole("row", { name: /Weekly Report/ })
    ).toBeInTheDocument();
  });

  it("exposes aria-level reflecting depth", () => {
    render(
      <NimbusProvider>
        <Tree.Root aria-label="Files" defaultExpandedKeys={["documents"]}>
          <Tree.Item id="documents" textValue="Documents">
            <Tree.ItemContent>
              <Tree.Indicator />
              Documents
            </Tree.ItemContent>
            <Tree.Item id="report" textValue="Weekly Report">
              <Tree.ItemContent>
                <Tree.Indicator />
                Weekly Report
              </Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
        </Tree.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("row", { name: /Documents/ })).toHaveAttribute(
      "aria-level",
      "1"
    );
    expect(screen.getByRole("row", { name: /Weekly Report/ })).toHaveAttribute(
      "aria-level",
      "2"
    );
  });
});

/**
 * @docs-section selection
 * @docs-title Selection
 * @docs-description Single and multiple selection behavior
 * @docs-order 2
 */
describe("Tree - Selection", () => {
  it("selects a row in single-selection mode", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Tree.Root aria-label="Files" selectionMode="single">
          <Tree.Item id="documents" textValue="Documents">
            <Tree.ItemContent>
              <Tree.Indicator />
              Documents
            </Tree.ItemContent>
          </Tree.Item>
        </Tree.Root>
      </NimbusProvider>
    );

    const row = screen.getByRole("row", { name: /Documents/ });
    await user.click(row);
    expect(row).toHaveAttribute("aria-selected", "true");
  });

  it("renders selection checkboxes in multiple-selection mode", () => {
    render(
      <NimbusProvider>
        <Tree.Root aria-label="Files" selectionMode="multiple">
          <Tree.Item id="documents" textValue="Documents">
            <Tree.ItemContent>
              <Tree.Indicator />
              Documents
            </Tree.ItemContent>
          </Tree.Item>
        </Tree.Root>
      </NimbusProvider>
    );

    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});
