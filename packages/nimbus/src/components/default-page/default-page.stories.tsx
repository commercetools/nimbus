import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { useState } from "react";
import {
  Box,
  Button,
  DataTable,
  DefaultPage,
  FormField,
  MoneyInput,
  Stack,
  TabNav,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import type {
  DataTableColumnItem,
  MoneyInputValue,
} from "@commercetools/nimbus";

// ============================================================
// META
// ============================================================

const meta: Meta<typeof DefaultPage.Root> = {
  title: "Components/Layout/DefaultPage",
  component: DefaultPage.Root,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================
// SHARED DATA — DataTable stories
// ============================================================

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
};

const productRows: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    sku: "TS-001",
    price: "$19.99",
    stock: 142,
  },
  { id: "2", name: "Denim Jacket", sku: "DJ-002", price: "$89.99", stock: 34 },
  {
    id: "3",
    name: "Running Shoes",
    sku: "RS-003",
    price: "$129.99",
    stock: 78,
  },
  {
    id: "4",
    name: "Canvas Backpack",
    sku: "CB-004",
    price: "$49.99",
    stock: 210,
  },
  { id: "5", name: "Wool Sweater", sku: "WS-005", price: "$59.99", stock: 56 },
  { id: "6", name: "Cargo Pants", sku: "CP-006", price: "$74.99", stock: 91 },
  { id: "7", name: "Baseball Cap", sku: "BC-007", price: "$24.99", stock: 305 },
  { id: "8", name: "Leather Belt", sku: "LB-008", price: "$34.99", stock: 67 },
];

const productColumns: DataTableColumnItem<Product>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "sku", header: "SKU", accessor: (row) => row.sku },
  { id: "price", header: "Price", accessor: (row) => row.price },
  { id: "stock", header: "In stock", accessor: (row) => row.stock },
];

// ============================================================
// 1. BASE — Minimal main-page layout
// ============================================================

/**
 * The minimal main-page configuration: Root, Header with Title, and Content.
 * No BackLink, no Footer. Verifies correct semantic HTML (`header`, `h1`, `main`).
 */
export const Base: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.Title>Products</DefaultPage.Title>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Product list content goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders page title as h1", async () => {
      const heading = canvas.getByRole("heading", {
        level: 1,
        name: "Products",
      });
      await expect(heading).toBeInTheDocument();
    });

    await step("Renders semantic header landmark", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
    });

    await step("Renders semantic main landmark", async () => {
      const main = canvas.getByRole("main");
      await expect(main).toBeInTheDocument();
    });
  },
};

// ============================================================
// 2. TITLE WITH SUBTITLE
// ============================================================

/**
 * Title accompanied by a subtitle for additional context beneath the heading.
 */
export const TitleWithSubtitle: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.Title>Customers</DefaultPage.Title>
        <DefaultPage.Subtitle>
          Manage your customer accounts and segments.
        </DefaultPage.Subtitle>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Customer list content goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders title and subtitle", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Customers" })
      ).toBeInTheDocument();

      await expect(
        canvas.getByText("Manage your customer accounts and segments.")
      ).toBeInTheDocument();
    });
  },
};

// ============================================================
// 3. HEADER ACTIONS
// ============================================================

/**
 * Header containing a title and Actions slot with primary and secondary buttons.
 */
export const HeaderActions: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.Title>Orders</DefaultPage.Title>
        <DefaultPage.Actions>
          <Button variant="ghost">Export</Button>
          <Button variant="solid">Create order</Button>
        </DefaultPage.Actions>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Order list content goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders header action buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Export" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Create order" })
      ).toBeInTheDocument();
    });
  },
};

// ============================================================
// 4. WITH FOOTER — Form page
// ============================================================

/**
 * A form page pattern with input fields in the content area and Save / Cancel
 * actions in the Footer slot.
 */
export const WithFooter: Story = {
  render: () => {
    const [name, setName] = useState("");

    return (
      <DefaultPage.Root
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <DefaultPage.Header>
          <DefaultPage.Title>New product</DefaultPage.Title>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            <FormField.Root isRequired>
              <FormField.Label>Product name</FormField.Label>
              <FormField.Input>
                <TextInput
                  value={name}
                  onChange={(v) => setName(v)}
                  placeholder="e.g. Classic T-Shirt"
                  aria-label="Product name"
                />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Description</FormField.Label>
              <FormField.Input>
                <TextInput
                  placeholder="Short product description"
                  aria-label="Description"
                />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </DefaultPage.Content>
        <DefaultPage.Footer>
          <Stack direction="row" gap="200">
            <Button variant="solid">Save product</Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders semantic footer landmark", async () => {
      const footer = canvasElement.querySelector("footer");
      await expect(footer).toBeInTheDocument();
    });

    await step("Renders footer action buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Save product" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  },
};

// ============================================================
// 5. INFO DETAIL PAGE — Read-only detail view
// ============================================================

/**
 * A read-only detail page with a BackLink for back navigation, title,
 * and subtitle. No footer needed for info-only views.
 */
export const InfoDetailPage: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.BackLink href="/products">
          Back to products
        </DefaultPage.BackLink>
        <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
        <DefaultPage.Subtitle>
          SKU-001 · Last updated 3 days ago
        </DefaultPage.Subtitle>
        <DefaultPage.Actions>
          <Button variant="ghost">Edit</Button>
        </DefaultPage.Actions>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Stack gap="400">
          <Text fontWeight="600">Product details</Text>
          <Text color="neutral.11">
            A timeless classic T-Shirt available in multiple colors and sizes.
          </Text>
        </Stack>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to products/i });
      await expect(backLink).toBeInTheDocument();
      await expect(backLink).toHaveAttribute("href", "/products");
    });

    await step("Renders title and subtitle", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Classic T-Shirt" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("SKU-001 · Last updated 3 days ago")
      ).toBeInTheDocument();
    });
  },
};

// ============================================================
// 6. FORM DETAIL PAGE — Editable detail view with footer
// ============================================================

/**
 * An editable detail page: BackLink for navigation, title, form fields in
 * content, and Save / Cancel in the footer.
 */
export const FormDetailPage: Story = {
  render: () => {
    const [price, setPrice] = useState<MoneyInputValue>({
      amount: "19.99",
      currencyCode: "EUR",
    });

    return (
      <DefaultPage.Root
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/products">
            Back to products
          </DefaultPage.BackLink>
          <DefaultPage.Title>Edit: Classic T-Shirt</DefaultPage.Title>
          <DefaultPage.Subtitle>SKU-001</DefaultPage.Subtitle>
          <DefaultPage.Actions>
            <Button variant="ghost">Delete</Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            <FormField.Root isRequired>
              <FormField.Label>Product name</FormField.Label>
              <FormField.Input>
                <TextInput
                  defaultValue="Classic T-Shirt"
                  aria-label="Product name"
                />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root isRequired>
              <FormField.Label>Price</FormField.Label>
              <FormField.Input>
                <MoneyInput
                  value={price}
                  currencies={["EUR", "USD", "GBP"]}
                  onValueChange={setPrice}
                  name="price"
                  aria-label="Price"
                />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </DefaultPage.Content>
        <DefaultPage.Footer>
          <Stack direction="row" gap="200">
            <Button variant="solid">Save changes</Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders back link with correct href", async () => {
      const backLink = canvas.getByRole("link", { name: /back to products/i });
      await expect(backLink).toHaveAttribute("href", "/products");
    });

    await step("Renders footer save and cancel buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Save changes" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  },
};

// ============================================================
// 7. WITH TAB NAVIGATION — Main page with TabNav in header
// ============================================================

/**
 * A main page with tab navigation placed inside the header. The header
 * automatically removes its bottom padding when a TabNav is present.
 */
export const WithTabNavigation: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.Title>Customer details</DefaultPage.Title>
        <DefaultPage.Actions>
          <Button variant="solid">Add customer</Button>
        </DefaultPage.Actions>
        <DefaultPage.TabNav>
          <TabNav.Root aria-label="Customer sections">
            <TabNav.Item href="#general" isCurrent>
              General
            </TabNav.Item>
            <TabNav.Item href="#addresses">Addresses</TabNav.Item>
            <TabNav.Item href="#orders">Orders</TabNav.Item>
            <TabNav.Item href="#payments">Payments</TabNav.Item>
          </TabNav.Root>
        </DefaultPage.TabNav>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>General customer information goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders tab navigation", async () => {
      const tabNav = canvas.getByRole("navigation", {
        name: "Customer sections",
      });
      await expect(tabNav).toBeInTheDocument();
    });

    await step("Renders all tab links", async () => {
      await expect(
        canvas.getByRole("link", { name: "General" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Addresses" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Orders" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Payments" })
      ).toBeInTheDocument();
    });

    await step("Current tab has aria-current attribute", async () => {
      const currentTab = canvas.getByRole("link", { name: "General" });
      await expect(currentTab).toHaveAttribute("aria-current", "page");
    });
  },
};

// ============================================================
// 8. DETAIL WITH TAB NAVIGATION
// ============================================================

/**
 * A detail page combining BackLink navigation with header tab navigation.
 */
export const DetailWithTabNavigation: Story = {
  render: () => (
    <DefaultPage.Root
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Header>
        <DefaultPage.BackLink href="/customers">
          Back to customers
        </DefaultPage.BackLink>
        <DefaultPage.Title>Jane Smith</DefaultPage.Title>
        <DefaultPage.Subtitle>customer@example.com</DefaultPage.Subtitle>
        <DefaultPage.Actions>
          <Button variant="ghost">Edit</Button>
        </DefaultPage.Actions>
        <DefaultPage.TabNav>
          <TabNav.Root aria-label="Customer sections">
            <TabNav.Item href="#general" isCurrent>
              General
            </TabNav.Item>
            <TabNav.Item href="#addresses">Addresses</TabNav.Item>
            <TabNav.Item href="#orders">Orders</TabNav.Item>
          </TabNav.Root>
        </DefaultPage.TabNav>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Customer general information goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to customers/i });
      await expect(backLink).toHaveAttribute("href", "/customers");
    });

    await step("Renders tab navigation alongside back link", async () => {
      const tabNav = canvas.getByRole("navigation", {
        name: "Customer sections",
      });
      await expect(tabNav).toBeInTheDocument();
    });
  },
};

// ============================================================
// 9. STICKY TABLE HEADER — Constrained height with DataTable
// ============================================================

/**
 * The page content area scrolls independently while the page header remains
 * visible. A DataTable demonstrates realistic scrollable table content.
 */
export const StickyTableHeader: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root stickyHeader>
        <DefaultPage.Header>
          <DefaultPage.Title>Products</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button variant="solid">Add product</Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <DataTable
            columns={productColumns}
            rows={productRows}
            aria-label="Products"
          />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the data table", async () => {
      const table = canvas.getByRole("grid", { name: "Products" });
      await expect(table).toBeInTheDocument();
    });

    await step("Header has sticky positioning applied", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
      const style = window.getComputedStyle(header!);
      await expect(style.position).toBe("sticky");
    });
  },
};

// ============================================================
// 10. STICKY HEADER AND FOOTER
// ============================================================

/**
 * Both header and footer are sticky while the content area scrolls.
 * Useful for long form pages where save actions should always be accessible.
 */
export const StickyHeaderAndFooter: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root stickyHeader stickyFooter>
        <DefaultPage.Header>
          <DefaultPage.Title>Edit product</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button variant="ghost">Preview</Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            {Array.from({ length: 8 }, (_, i) => (
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
        </DefaultPage.Content>
        <DefaultPage.Footer>
          <Stack direction="row" gap="200">
            <Button variant="solid">Save changes</Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Header has sticky positioning", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
      const style = window.getComputedStyle(header!);
      await expect(style.position).toBe("sticky");
    });

    await step("Footer has sticky positioning", async () => {
      const footer = canvasElement.querySelector("footer");
      await expect(footer).toBeInTheDocument();
      const style = window.getComputedStyle(footer!);
      await expect(style.position).toBe("sticky");
    });

    await step("Footer action buttons are visible", async () => {
      await expect(
        canvas.getByRole("button", { name: "Save changes" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });
  },
};
