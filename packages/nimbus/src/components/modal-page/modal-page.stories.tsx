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
  title: "Components/Layout/ModalPage",
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
 * Basic info page — tests open/close lifecycle via trigger and back button.
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
 * Form page — header actions and footer with save/cancel buttons.
 */
export const FormPage: Story = {
  render: () => (
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
        <FormField.Root>
          <FormField.Label>Product Name</FormField.Label>
          <FormField.Input>
            <TextInput placeholder="Enter product name" />
          </FormField.Input>
        </FormField.Root>
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
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Header actions and footer buttons are rendered", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(
        canvas.getByRole("button", { name: "Preview" })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
  },
};

/**
 * Tabular page — TabNav in the header with tab content below.
 */
export const TabularPage: Story = {
  render: () => (
    <ModalPage.Root isOpen onClose={() => {}}>
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
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Tab navigation is rendered in header", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      const nav = canvas.getByRole("navigation", { name: "Order sections" });
      expect(nav).toBeInTheDocument();
      expect(canvas.getByRole("link", { name: "General" })).toBeInTheDocument();
      expect(canvas.getByRole("link", { name: "Items" })).toBeInTheDocument();
      expect(
        canvas.getByRole("link", { name: "Shipping" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Scrollable content — the content area scrolls while TopBar, Header,
 * and Footer remain pinned.
 */
export const ScrollableContent: Story = {
  render: () => (
    <ModalPage.Root isOpen onClose={() => {}}>
      <ModalPage.TopBar
        previousPathLabel="Products"
        currentPathLabel="Add Product"
      />
      <ModalPage.Header>
        <ModalPage.Title>Add Product</ModalPage.Title>
        <ModalPage.Subtitle>Fill in the product details</ModalPage.Subtitle>
      </ModalPage.Header>
      <ModalPage.Content>
        <Stack gap="600" maxWidth="600px">
          {Array.from({ length: 12 }, (_, i) => (
            <FormField.Root key={i}>
              <FormField.Label>Field {i + 1}</FormField.Label>
              <FormField.Input>
                <TextInput
                  placeholder={`Value for field ${i + 1}`}
                  aria-label={`Field ${i + 1}`}
                />
              </FormField.Input>
            </FormField.Root>
          ))}
        </Stack>
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
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("All fields and footer are rendered", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(canvas.getByLabelText("Field 1")).toBeInTheDocument();
      expect(canvas.getByLabelText("Field 12")).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });
  },
};

/**
 * Multi-column layout — PageContent.Root inside ModalPage.Content
 * for side-by-side column layouts.
 */
export const MultiColumnContent: Story = {
  render: () => (
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
            <Stack gap="600">
              <Text fontWeight="semibold">Main form area</Text>
              <FormField.Root>
                <FormField.Label>Product Name</FormField.Label>
                <FormField.Input>
                  <TextInput placeholder="Enter product name" />
                </FormField.Input>
              </FormField.Root>
              <FormField.Root>
                <FormField.Label>Description</FormField.Label>
                <FormField.Input>
                  <TextInput placeholder="Enter description" />
                </FormField.Input>
              </FormField.Root>
            </Stack>
          </PageContent.Column>
          <PageContent.Column sticky>
            <Stack gap="400">
              <Text fontWeight="semibold">Summary sidebar</Text>
              <Text>This sidebar stays visible while scrolling.</Text>
            </Stack>
          </PageContent.Column>
        </PageContent.Root>
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
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Two-column layout is rendered", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(canvas.getByText("Main form area")).toBeInTheDocument();
      expect(canvas.getByText("Summary sidebar")).toBeInTheDocument();
    });
  },
};

/**
 * Keyboard navigation — tests Escape key dismissal, focus trap, and
 * focus return to trigger.
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
            <Button colorPalette="primary" variant="solid">
              Save
            </Button>
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

      // Back button has focus from auto-focus. Tab to Cancel, then Save.
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      const saveButton = canvas.getByRole("button", { name: "Save" });

      await userEvent.tab();
      await waitFor(() => expect(cancelButton).toHaveFocus());

      await userEvent.tab();
      await waitFor(() => expect(saveButton).toHaveFocus());

      // Close to restore state
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Helper component for composable stacked modal pages.
 * Each NestedModalPage manages its own open state and renders
 * a trigger button, a ModalPage, and optional children (the next level).
 */
const NestedModalPage = ({
  parentLabel,
  currentLabel,
  children,
}: {
  parentLabel: string;
  currentLabel: string;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open {currentLabel}</Button>
      <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalPage.TopBar
          previousPathLabel={parentLabel}
          currentPathLabel={currentLabel}
        />
        <ModalPage.Header>
          <ModalPage.Title>{currentLabel}</ModalPage.Title>
        </ModalPage.Header>
        <ModalPage.Content>
          <Stack>
            <Text>{currentLabel} content goes here.</Text>
            {children}
          </Stack>
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
    </>
  );
};

/**
 * Stacked modal pages — demonstrates 4 levels of nesting, each visually
 * indented to show depth. Uses the NestedModalPage helper for composition.
 */
export const StackedModalPages: Story = {
  render: () => (
    <Stack>
      <NestedModalPage parentLabel="Products" currentLabel="Edit Product">
        <NestedModalPage parentLabel="Edit Product" currentLabel="Add Variant">
          <NestedModalPage
            parentLabel="Add Variant"
            currentLabel="Select Attribute"
          >
            <NestedModalPage
              parentLabel="Select Attribute"
              currentLabel="Create Attribute"
            />
          </NestedModalPage>
        </NestedModalPage>
      </NestedModalPage>
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open all four levels", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open Edit Product" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(1);
      });

      await userEvent.click(
        canvas.getByRole("button", { name: "Open Add Variant" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(2);
      });

      await userEvent.click(
        canvas.getByRole("button", { name: "Open Select Attribute" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(3);
      });

      await userEvent.click(
        canvas.getByRole("button", { name: "Open Create Attribute" })
      );
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(4);
      });
    });

    await step("Escape closes only the topmost level", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(3);
      });
      expect(
        canvas.getByRole("heading", { name: "Select Attribute" })
      ).toBeInTheDocument();
    });

    await step("Back button closes the current level", async () => {
      const backButton = canvas.getByRole("button", {
        name: /go back to add variant/i,
      });
      await userEvent.click(backButton);
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(2);
      });
    });

    await step("Close remaining levels via Escape", async () => {
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.getAllByRole("dialog")).toHaveLength(1);
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Focus returns to page-level trigger", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Edit Product",
      });
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
        <Button colorPalette="primary" variant="solid">
          Save
        </Button>
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
