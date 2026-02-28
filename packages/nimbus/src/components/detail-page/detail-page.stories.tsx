import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailPage, Button, Tabs, Stack, Text } from "@commercetools/nimbus";
import { within, expect, userEvent } from "storybook/test";

const meta: Meta<typeof DetailPage.Root> = {
  title: "Components/DetailPage",
  component: DetailPage.Root,
};

export default meta;

type Story = StoryObj<typeof DetailPage.Root>;

/**
 * Info detail page (read-only, no footer)
 * Demonstrates a simple detail page without a footer section
 */
export const InfoDetailPage: Story = {
  render: () => (
    <DetailPage.Root data-testid="detail-page">
      <DetailPage.Header>
        <DetailPage.BackLink href="/products">
          Back to products
        </DetailPage.BackLink>
        <DetailPage.Title>Product Details</DetailPage.Title>
        <DetailPage.Subtitle>SKU-12345</DetailPage.Subtitle>
      </DetailPage.Header>
      <DetailPage.Content>
        <Stack gap="400">
          <Text>This is a read-only info page with no footer.</Text>
          <Text>
            Use this pattern for pages that display information without form
            actions.
          </Text>
        </Stack>
      </DetailPage.Content>
    </DetailPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to products/i });
      await expect(backLink).toBeInTheDocument();
      await expect(backLink).toHaveAttribute("href", "/products");
    });

    await step("Renders the title", async () => {
      await expect(
        canvas.getByRole("heading", { name: "Product Details" })
      ).toBeInTheDocument();
    });

    await step("Renders the subtitle", async () => {
      await expect(canvas.getByText("SKU-12345")).toBeInTheDocument();
    });

    await step("Renders content", async () => {
      await expect(
        canvas.getByText("This is a read-only info page with no footer.")
      ).toBeInTheDocument();
    });

    await step("Footer is absent", async () => {
      await expect(canvas.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  },
};

/**
 * Form detail page (with footer for form actions)
 * Demonstrates a detail page with a footer containing save/cancel buttons
 */
export const FormDetailPage: Story = {
  render: () => (
    <DetailPage.Root data-testid="detail-page-form">
      <DetailPage.Header>
        <DetailPage.BackLink href="/orders">Back to orders</DetailPage.BackLink>
        <DetailPage.Title>Edit Order</DetailPage.Title>
        <DetailPage.Subtitle>Order #ORD-2024-001</DetailPage.Subtitle>
      </DetailPage.Header>
      <DetailPage.Content>
        <Stack gap="400">
          <Text>Form fields would go here.</Text>
        </Stack>
      </DetailPage.Content>
      <DetailPage.Footer>
        <Stack direction="row" gap="200">
          <Button>Save</Button>
          <Button variant="ghost">Cancel</Button>
        </Stack>
      </DetailPage.Footer>
    </DetailPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to orders/i });
      await expect(backLink).toBeInTheDocument();
      await expect(backLink).toHaveAttribute("href", "/orders");
    });

    await step("Renders title and subtitle", async () => {
      await expect(
        canvas.getByRole("heading", { name: "Edit Order" })
      ).toBeInTheDocument();
      await expect(canvas.getByText("Order #ORD-2024-001")).toBeInTheDocument();
    });

    await step("Renders content area", async () => {
      await expect(
        canvas.getByText("Form fields would go here.")
      ).toBeInTheDocument();
    });

    await step("Renders footer with action buttons", async () => {
      await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
      await expect(canvas.getByText("Save")).toBeInTheDocument();
      await expect(canvas.getByText("Cancel")).toBeInTheDocument();
    });
  },
};

/**
 * Tabular detail page (with Tabs between header and footer)
 * Demonstrates integration with the Tabs component for tabbed content
 */
export const TabularDetailPage: Story = {
  render: () => (
    <DetailPage.Root data-testid="detail-page-tabular">
      <DetailPage.Header>
        <DetailPage.BackLink href="/customers">
          Back to customers
        </DetailPage.BackLink>
        <DetailPage.Title>Customer Details</DetailPage.Title>
        <DetailPage.Subtitle>customer@example.com</DetailPage.Subtitle>
      </DetailPage.Header>
      <Tabs.Root defaultSelectedKey="general">
        <Tabs.List>
          <Tabs.Tab id="general">General</Tabs.Tab>
          <Tabs.Tab id="addresses">Addresses</Tabs.Tab>
          <Tabs.Tab id="orders">Orders</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id="general">
            <DetailPage.Content>
              <Text>General information content</Text>
            </DetailPage.Content>
          </Tabs.Panel>
          <Tabs.Panel id="addresses">
            <DetailPage.Content>
              <Text>Addresses content</Text>
            </DetailPage.Content>
          </Tabs.Panel>
          <Tabs.Panel id="orders">
            <DetailPage.Content>
              <Text>Orders content</Text>
            </DetailPage.Content>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>
    </DetailPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to customers/i });
      await expect(backLink).toBeInTheDocument();
      await expect(backLink).toHaveAttribute("href", "/customers");
    });

    await step("Renders title and subtitle", async () => {
      await expect(
        canvas.getByRole("heading", { name: "Customer Details" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("customer@example.com")
      ).toBeInTheDocument();
    });

    await step("Renders tab controls", async () => {
      await expect(
        canvas.getByRole("tab", { name: "General" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("tab", { name: "Addresses" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("tab", { name: "Orders" })
      ).toBeInTheDocument();
    });

    await step("Renders default tab content", async () => {
      await expect(
        canvas.getByText("General information content")
      ).toBeInTheDocument();
    });

    await step("Clicking Addresses tab shows addresses content", async () => {
      await userEvent.click(canvas.getByRole("tab", { name: "Addresses" }));
      await expect(canvas.getByText("Addresses content")).toBeInTheDocument();
    });
  },
};
