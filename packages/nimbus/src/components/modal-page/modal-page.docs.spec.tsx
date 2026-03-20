import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button, ModalPage, NimbusProvider, Text } from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic Usage
 * @docs-description
 *   Controlled ModalPage with isOpen and onClose. Wire up your own useState
 *   to manage the open state and pass a handler to onClose.
 * @docs-order 1
 */
describe("ModalPage - Basic usage", () => {
  it("opens and closes via controlled state", () => {
    const onClose = vi.fn();

    const Example = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <NimbusProvider>
          <Button onPress={() => setIsOpen(true)}>Open</Button>
          <ModalPage.Root
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setIsOpen(false);
            }}
          >
            <ModalPage.TopBar
              previousPathLabel="Products"
              currentPathLabel="Edit Product"
            />
            <ModalPage.Header>
              <ModalPage.Title
                title="Edit Product"
                subtitle="Update the product details"
              />
            </ModalPage.Header>
            <ModalPage.Content>
              <Text>Form content</Text>
            </ModalPage.Content>
            <ModalPage.Footer>
              <Button slot="close" variant="outline">
                Cancel
              </Button>
              <Button variant="solid">Save</Button>
            </ModalPage.Footer>
          </ModalPage.Root>
        </NimbusProvider>
      );
    };

    render(<Example />);

    // Dialog is not in DOM before opening
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Edit Product" })
    ).toBeInTheDocument();

    // Close via slot="close" button
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

/**
 * @docs-section form-page
 * @docs-title Form Page with Footer Actions
 * @docs-description
 *   For create/edit workflows, always include a ModalPage.Footer with Save and
 *   Cancel actions. The Cancel button uses slot="close" to hook into the dialog
 *   close path automatically.
 * @docs-order 2
 */
describe("ModalPage - Form page", () => {
  it("renders header actions and footer buttons", () => {
    render(
      <NimbusProvider>
        <ModalPage.Root isOpen onClose={() => {}}>
          <ModalPage.TopBar
            previousPathLabel="Products"
            currentPathLabel="Add Product"
          />
          <ModalPage.Header>
            <ModalPage.Title
              title="Add Product"
              subtitle="Fill in the product details"
            />
            <ModalPage.Actions>
              <Button size="sm" variant="outline">
                Preview
              </Button>
            </ModalPage.Actions>
          </ModalPage.Header>
          <ModalPage.Content>
            <Text>Form fields go here</Text>
          </ModalPage.Content>
          <ModalPage.Footer>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </ModalPage.Footer>
        </ModalPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: "Preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

/**
 * @docs-section multi-column
 * @docs-title Multi-Column Layout
 * @docs-description
 *   Use ModalPage.Content with columns="2/1" and ModalPage.Column for
 *   side-by-side layouts. ModalPage.Column is a re-export of PageContent.Column
 *   and supports the sticky prop for sticky sidebars.
 * @docs-order 3
 */
describe("ModalPage - Multi-column layout", () => {
  it("renders a 2/1 column layout", () => {
    render(
      <NimbusProvider>
        <ModalPage.Root isOpen onClose={() => {}}>
          <ModalPage.TopBar
            previousPathLabel="Products"
            currentPathLabel="Edit Product"
          />
          <ModalPage.Header>
            <ModalPage.Title title="Edit Product" />
          </ModalPage.Header>
          <ModalPage.Content variant="wide" columns="2/1">
            <ModalPage.Column>
              <Text>Main form area</Text>
            </ModalPage.Column>
            <ModalPage.Column sticky>
              <Text>Summary sidebar</Text>
            </ModalPage.Column>
          </ModalPage.Content>
        </ModalPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Main form area")).toBeInTheDocument();
    expect(screen.getByText("Summary sidebar")).toBeInTheDocument();
  });
});
