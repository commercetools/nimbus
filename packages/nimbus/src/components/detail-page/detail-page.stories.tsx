import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  DetailPage,
  Button,
  DataTable,
  IconButton,
  Tabs,
  Stack,
  Text,
  Toolbar,
} from "@commercetools/nimbus";
import type { DataTableColumnItem } from "@commercetools/nimbus";
import { Save, Print, Undo, Redo } from "@commercetools/nimbus-icons";
import { within, expect, userEvent } from "storybook/test";

type OrderLine = {
  id: string;
  product: string;
  sku: string;
  qty: number;
  price: string;
};

const orderLineColumns: DataTableColumnItem<OrderLine>[] = [
  { id: "product", header: "Product", accessor: (row) => row.product },
  { id: "sku", header: "SKU", accessor: (row) => row.sku },
  { id: "qty", header: "Qty", accessor: (row) => String(row.qty) },
  { id: "price", header: "Price", accessor: (row) => row.price },
];

const orderLineRows: OrderLine[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  product: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(3, "0")}`,
  qty: (i % 5) + 1,
  price: `€${((i + 1) * 9.99).toFixed(2)}`,
}));

const meta: Meta<typeof DetailPage.Root> = {
  title: "Patterns/pages/DetailPage",
  component: DetailPage.Root,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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
 * Detail page with header actions (title + action buttons in a row)
 * Demonstrates the HeaderActions sub-component positioned alongside the title
 */
export const WithHeaderActions: Story = {
  render: () => (
    <DetailPage.Root data-testid="detail-page-actions">
      <DetailPage.Header>
        <DetailPage.BackLink href="/discounts">
          Back to discounts
        </DetailPage.BackLink>
        <DetailPage.Title>Cart Discount Details</DetailPage.Title>
        <DetailPage.HeaderActions>
          <Button size="sm" variant="ghost">
            Duplicate
          </Button>
          <Button size="sm" variant="solid" colorPalette="primary">
            Save
          </Button>
        </DetailPage.HeaderActions>
        <DetailPage.Subtitle>10% off all items</DetailPage.Subtitle>
      </DetailPage.Header>
      <DetailPage.Content>
        <Stack gap="400">
          <Text>Discount configuration form fields would go here.</Text>
        </Stack>
      </DetailPage.Content>
      <DetailPage.Footer>
        <Stack direction="row" gap="200">
          <Button variant="solid" colorPalette="primary">
            Save
          </Button>
          <Button variant="ghost">Cancel</Button>
        </Stack>
      </DetailPage.Footer>
    </DetailPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders title and actions in a row", async () => {
      await expect(
        canvas.getByRole("heading", { name: "Cart Discount Details" })
      ).toBeInTheDocument();
      await expect(canvas.getByText("Duplicate")).toBeInTheDocument();
    });

    await step("Renders subtitle below the title row", async () => {
      await expect(canvas.getByText("10% off all items")).toBeInTheDocument();
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
      <DetailPage.Content>
        <Tabs.Root defaultSelectedKey="general">
          <Tabs.List>
            <Tabs.Tab id="general">General</Tabs.Tab>
            <Tabs.Tab id="addresses">Addresses</Tabs.Tab>
            <Tabs.Tab id="orders">Orders</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels py="400">
            <Tabs.Panel id="general">
              <Text>General information content</Text>
            </Tabs.Panel>
            <Tabs.Panel id="addresses">
              <Text>Addresses content</Text>
            </Tabs.Panel>
            <Tabs.Panel id="orders">
              <Text>Orders content</Text>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </DetailPage.Content>
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

/**
 * Detail page with a scrollable DataTable — used to verify that the DataTable's
 * sticky header remains functional when content overflows. Scroll down inside
 * the page to confirm the table header sticks at the top of the content area.
 */
export const StickyTableHeader: Story = {
  render: () => (
    <Box height="500px" border="solid-25" borderColor="neutral.6">
      <DetailPage.Root data-testid="detail-page-sticky">
        <DetailPage.Header>
          <DetailPage.BackLink href="/orders">
            Back to orders
          </DetailPage.BackLink>
          <DetailPage.Title>Order Lines</DetailPage.Title>
          <DetailPage.Subtitle>Order #ORD-2024-001</DetailPage.Subtitle>
        </DetailPage.Header>
        <DetailPage.Content>
          <DataTable
            columns={orderLineColumns}
            rows={orderLineRows}
            maxHeight="100%"
          />
        </DetailPage.Content>
      </DetailPage.Root>
    </Box>
  ),
};

/**
 * Detail page with custom header content
 * Demonstrates placing additional content like a Toolbar inside the Header component
 */
export const WithCustomHeaderContent: Story = {
  render: () => (
    <DetailPage.Root data-testid="detail-page-toolbar">
      <DetailPage.Header>
        <DetailPage.BackLink href="/documents">
          Back to documents
        </DetailPage.BackLink>
        <DetailPage.Title>Document Editor</DetailPage.Title>
        <DetailPage.Subtitle>Last edited 2 hours ago</DetailPage.Subtitle>
        <Toolbar variant="outline" gridColumn="1 / -1">
          <IconButton aria-label="Undo" size="sm" variant="ghost">
            <Undo />
          </IconButton>
          <IconButton aria-label="Redo" size="sm" variant="ghost">
            <Redo />
          </IconButton>
          <IconButton aria-label="Save" size="sm" variant="ghost">
            <Save />
          </IconButton>
          <IconButton aria-label="Print" size="sm" variant="ghost">
            <Print />
          </IconButton>
        </Toolbar>
      </DetailPage.Header>
      <DetailPage.Content>
        <Stack gap="400">
          <Text>Document content would go here.</Text>
        </Stack>
      </DetailPage.Content>
    </DetailPage.Root>
  ),
};
