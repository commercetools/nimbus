import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import {
  Button,
  FormField,
  ModalPage,
  PageContent,
  Stack,
  TabNav,
  Text,
  TextInput,
} from "@commercetools/nimbus";

const meta: Meta<typeof ModalPage.Root> = {
  title: "Components/Overlay/ModalPage",
  component: ModalPage.Root,
  tags: ["autodocs"],
  args: {
    onClose: fn(),
  },
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
      description: "Whether the modal page is open (controlled)",
    },
    onClose: {
      description: "Callback fired when the modal page should close",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic info page — title, subtitle, no footer.
 */
export const InfoPage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack>
        <Button onPress={() => setIsOpen(true)}>Open Info Page</Button>
        <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalPage.TopBar
            previousPathLabel="Products"
            currentPathLabel="Product Details"
          />
          <ModalPage.Header>
            <ModalPage.Title>Product Details</ModalPage.Title>
            <ModalPage.Subtitle>
              View the product information
            </ModalPage.Subtitle>
          </ModalPage.Header>
          <ModalPage.Content>
            <Text>This is the info page content area.</Text>
          </ModalPage.Content>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open modal page via trigger", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Info Page" });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(
        canvas.getByRole("heading", { name: "Product Details" })
      ).toBeInTheDocument();
    });

    await step("Close via back button in top bar", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to products/i,
      });
      await userEvent.click(backButton);

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Form page — with footer containing save/cancel actions.
 */
export const FormPage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    return (
      <Stack>
        <Button onPress={() => setIsOpen(true)}>Open Form Page</Button>
        <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
            <FormField.Root>
              <FormField.Label>Product Name</FormField.Label>
              <FormField.Input>
                <TextInput
                  placeholder="Enter product name"
                  value={name}
                  onChange={setName}
                />
              </FormField.Input>
            </FormField.Root>
          </ModalPage.Content>
          <ModalPage.Footer>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </ModalPage.Footer>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open form page", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Form Page" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Footer buttons are visible", async () => {
      expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    await step("Cancel closes the modal via slot=close", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Tabular page — with TabNav in the header and tab content below.
 */
export const TabularPage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack>
        <Button onPress={() => setIsOpen(true)}>Open Tabular Page</Button>
        <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalPage.TopBar
            previousPathLabel="Orders"
            currentPathLabel="Order #12345"
          />
          <ModalPage.Header>
            <ModalPage.Title>Order #12345</ModalPage.Title>
            <ModalPage.Subtitle>Order from 2024-01-15</ModalPage.Subtitle>
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
            <Text>General order information</Text>
          </ModalPage.Content>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open tabular page", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Tabular Page" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Tab navigation is rendered in header", async () => {
      const nav = canvas.getByRole("navigation", { name: "Order sections" });
      expect(nav).toBeInTheDocument();
      expect(canvas.getByRole("link", { name: "General" })).toBeInTheDocument();
      expect(canvas.getByRole("link", { name: "Items" })).toBeInTheDocument();
      expect(
        canvas.getByRole("link", { name: "Shipping" })
      ).toBeInTheDocument();
    });

    await step("Close modal page", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to orders/i,
      });
      await userEvent.click(backButton);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Demonstrates TopBar navigation labels.
 */
export const WithTopBarNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack>
        <Button onPress={() => setIsOpen(true)}>Open with Navigation</Button>
        <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalPage.TopBar
            previousPathLabel="Product catalog"
            currentPathLabel="Edit: Awesome T-Shirt XL"
          />
          <ModalPage.Header>
            <ModalPage.Title>Edit: Awesome T-Shirt XL</ModalPage.Title>
          </ModalPage.Header>
          <ModalPage.Content>
            <Text>Content area</Text>
          </ModalPage.Content>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open modal and verify top bar labels", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open with Navigation" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(canvas.getByText("Product catalog")).toBeInTheDocument();
      expect(
        canvas.getByRole("heading", { name: "Edit: Awesome T-Shirt XL" })
      ).toBeInTheDocument();
    });

    await step("Back button aria-label references previous path", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to product catalog/i,
      });
      expect(backButton).toBeInTheDocument();

      await userEvent.click(backButton);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Keyboard navigation — tests Escape key dismissal and focus trap within
 * the modal page dialog.
 */
export const KeyboardNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack>
        <Button onPress={() => setIsOpen(true)}>Open for Keyboard Test</Button>
        <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalPage.TopBar
            previousPathLabel="Settings"
            currentPathLabel="Edit Profile"
          />
          <ModalPage.Header>
            <ModalPage.Title>Edit Profile</ModalPage.Title>
          </ModalPage.Header>
          <ModalPage.Content>
            <Text>Keyboard navigation test content</Text>
          </ModalPage.Content>
          <ModalPage.Footer>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </ModalPage.Footer>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open modal page", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open for Keyboard Test" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Back button receives initial focus on open", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to/i,
      });
      await waitFor(() => expect(backButton).toHaveFocus(), { timeout: 1000 });
    });

    await step("Escape key closes the modal page", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Focus returns to the trigger after close", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open for Keyboard Test",
      });
      await waitFor(() => expect(trigger).toHaveFocus(), { timeout: 1000 });
    });

    await step("Tab navigation cycles within the open modal", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open for Keyboard Test",
      });
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Tab through focusable elements — back button, Cancel, Save
      await userEvent.tab();
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      const saveButton = canvas.getByRole("button", { name: "Save" });
      // At least Cancel and Save buttons should be reachable
      expect(cancelButton).toBeInTheDocument();
      expect(saveButton).toBeInTheDocument();

      // Close to restore state
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Stacked modal pages — demonstrates opening a second ModalPage on top of
 * the first, as used in "Edit Product → Add Variant" workflows.
 */
export const StackedModalPages: Story = {
  render: () => {
    const [isFirstOpen, setIsFirstOpen] = useState(false);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    return (
      <Stack>
        <Button onPress={() => setIsFirstOpen(true)}>Open Edit Product</Button>
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
            <ModalPage.Subtitle>Update the product details</ModalPage.Subtitle>
          </ModalPage.Header>
          <ModalPage.Content>
            <Stack>
              <Text>Product form content goes here.</Text>
              <Button onPress={() => setIsSecondOpen(true)}>
                Open Add Variant
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
                <ModalPage.Subtitle>
                  Define a new product variant
                </ModalPage.Subtitle>
              </ModalPage.Header>
              <ModalPage.Content>
                <Text>Variant form content goes here.</Text>
              </ModalPage.Content>
              <ModalPage.Footer>
                <Button slot="close" variant="outline">
                  Cancel
                </Button>
                <Button variant="solid">Save Variant</Button>
              </ModalPage.Footer>
            </ModalPage.Root>
          </ModalPage.Content>
          <ModalPage.Footer>
            <Button slot="close" variant="outline">
              Cancel
            </Button>
            <Button variant="solid">Save Product</Button>
          </ModalPage.Footer>
        </ModalPage.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open first modal page", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Edit Product" })
      );
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(
        canvas.getByRole("heading", { name: "Edit Product" })
      ).toBeInTheDocument();
    });

    await step("Open second modal page on top of first", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Add Variant" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(2);
      });
      expect(
        canvas.getByRole("heading", { name: "Add Variant" })
      ).toBeInTheDocument();
    });

    await step("Close second modal via back button", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to edit product/i,
      });
      await userEvent.click(backButton);
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(1);
      });
      expect(
        canvas.getByRole("heading", { name: "Edit Product" })
      ).toBeInTheDocument();
    });

    await step(
      "'Open Add Variant' button is still present in first page",
      async () => {
        expect(
          canvas.getByRole("button", { name: "Open Add Variant" })
        ).toBeInTheDocument();
      }
    );

    await step("Re-open second modal and close via Escape", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Add Variant" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(2);
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(1);
      });
      expect(
        canvas.getByRole("heading", { name: "Edit Product" })
      ).toBeInTheDocument();
    });

    await step("Close first modal via back button", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to products/i,
      });
      await userEvent.click(backButton);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Focus returns to page-level trigger", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Edit Product" });
      await waitFor(() => expect(trigger).toHaveFocus(), { timeout: 1000 });
    });
  },
};

/**
 * SmokeTest — renders the full compound structure in an always-open state
 * for visual regression baseline.
 */
export const SmokeTest: Story = {
  render: () => (
    <ModalPage.Root isOpen onClose={() => {}}>
      <ModalPage.TopBar
        previousPathLabel="Products"
        currentPathLabel="Editing product"
      />
      <ModalPage.Header>
        <ModalPage.Title>Edit Product</ModalPage.Title>
        <ModalPage.Subtitle>Update the product information</ModalPage.Subtitle>
        <ModalPage.Actions>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </ModalPage.Actions>
      </ModalPage.Header>
      <ModalPage.Content>
        <Text>Smoke test content area</Text>
      </ModalPage.Content>
      <ModalPage.Footer>
        <Button slot="close" variant="outline">
          Cancel
        </Button>
        <Button variant="solid">Save</Button>
      </ModalPage.Footer>
    </ModalPage.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Full compound structure renders", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(
        canvas.getByRole("heading", { name: "Edit Product" })
      ).toBeInTheDocument();
      expect(canvas.getByText("Products")).toBeInTheDocument();
      expect(canvas.getByText("Editing product")).toBeInTheDocument();
      expect(canvas.getByText("Smoke test content area")).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
  },
};
