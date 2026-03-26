import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  Button,
  ModalPage,
  NimbusProvider,
  PageContent,
  Stack,
  TabNav,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-usage
 * @docs-title Basic usage
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
              <ModalPage.Title>Edit Product</ModalPage.Title>
              <ModalPage.Subtitle>
                Update the product details
              </ModalPage.Subtitle>
            </ModalPage.Header>
            <ModalPage.Content>
              <Text>Form content</Text>
            </ModalPage.Content>
            <ModalPage.Footer>
              <Button slot="close" variant="outline">
                Cancel
              </Button>
              <Button colorPalette="primary" variant="solid">
                Save
              </Button>
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
 * @docs-title Form page with header actions and footer
 * @docs-description
 *   For create/edit workflows, include a ModalPage.Footer with Save and
 *   Cancel actions. Use ModalPage.Actions for secondary header buttons.
 *   The Cancel button uses slot="close" to hook into the dialog close path.
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
            <ModalPage.Title>Add Product</ModalPage.Title>
            <ModalPage.Subtitle>Fill in the product details</ModalPage.Subtitle>
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
            <Button colorPalette="primary" variant="solid">
              Save
            </Button>
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
 * @docs-title Multi-column layout
 * @docs-description
 *   Use PageContent.Root with columns="2/1" and PageContent.Column inside
 *   ModalPage.Content for side-by-side layouts. PageContent.Column supports the
 *   sticky prop for sticky sidebars.
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
            <ModalPage.Title>Edit Product</ModalPage.Title>
          </ModalPage.Header>
          <ModalPage.Content>
            <PageContent.Root variant="wide" columns="2/1">
              <PageContent.Column>
                <Text>Main form area</Text>
              </PageContent.Column>
              <PageContent.Column sticky>
                <Text>Summary sidebar</Text>
              </PageContent.Column>
            </PageContent.Root>
          </ModalPage.Content>
        </ModalPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Main form area")).toBeInTheDocument();
    expect(screen.getByText("Summary sidebar")).toBeInTheDocument();
  });
});

/**
 * @docs-section tabular-page
 * @docs-title Tabular page with TabNav
 * @docs-description
 *   Use ModalPage.TabNav inside the header for route-based tab navigation.
 *   When TabNav is present, the header bottom padding adjusts automatically.
 * @docs-order 4
 */
describe("ModalPage - Tabular page", () => {
  it("renders tab navigation inside the header", () => {
    render(
      <NimbusProvider>
        <ModalPage.Root isOpen onClose={() => {}}>
          <ModalPage.TopBar
            previousPathLabel="Orders"
            currentPathLabel="Order #12345"
          />
          <ModalPage.Header>
            <ModalPage.Title>Order #12345</ModalPage.Title>
            <ModalPage.Subtitle>Placed on 2024-01-15</ModalPage.Subtitle>
            <ModalPage.TabNav>
              <TabNav.Root aria-label="Order sections">
                <TabNav.Item href="#general" isCurrent>
                  General
                </TabNav.Item>
                <TabNav.Item href="#items">Items</TabNav.Item>
                <TabNav.Item href="#shipping">Shipping</TabNav.Item>
              </TabNav.Root>
            </ModalPage.TabNav>
          </ModalPage.Header>
          <ModalPage.Content>
            <Text>General information</Text>
          </ModalPage.Content>
        </ModalPage.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Order #12345" })
    ).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
  });
});

/**
 * @docs-section stacked-pages
 * @docs-title Stacked modal pages
 * @docs-description
 *   Nest a second ModalPage.Root inside the first ModalPage.Content for
 *   drill-down workflows. Each page manages its own independent state.
 *   Escape closes only the topmost page.
 * @docs-order 5
 */
describe("ModalPage - Stacked pages", () => {
  it("renders nested modal pages independently", () => {
    const Example = () => {
      const [isFirstOpen, setIsFirstOpen] = useState(true);
      const [isSecondOpen, setIsSecondOpen] = useState(false);
      return (
        <NimbusProvider>
          <ModalPage.Root
            isOpen={isFirstOpen}
            onClose={() => setIsFirstOpen(false)}
          >
            <ModalPage.TopBar
              previousPathLabel="Products"
              currentPathLabel="Edit Product"
            />
            <ModalPage.Header>
              <ModalPage.Title>Edit Product</ModalPage.Title>
            </ModalPage.Header>
            <ModalPage.Content>
              <Stack>
                <Text>Product form content</Text>
                <Button onPress={() => setIsSecondOpen(true)}>
                  Add Variant
                </Button>
              </Stack>
              <ModalPage.Root
                isOpen={isSecondOpen}
                onClose={() => setIsSecondOpen(false)}
              >
                <ModalPage.TopBar
                  previousPathLabel="Edit Product"
                  currentPathLabel="Add Variant"
                />
                <ModalPage.Header>
                  <ModalPage.Title>Add Variant</ModalPage.Title>
                </ModalPage.Header>
                <ModalPage.Content>
                  <Text>Variant form content</Text>
                </ModalPage.Content>
              </ModalPage.Root>
            </ModalPage.Content>
          </ModalPage.Root>
        </NimbusProvider>
      );
    };

    render(<Example />);

    expect(screen.getByText("Product form content")).toBeInTheDocument();

    // Open stacked page
    fireEvent.click(screen.getByRole("button", { name: "Add Variant" }));
    expect(screen.getByText("Variant form content")).toBeInTheDocument();
  });
});
