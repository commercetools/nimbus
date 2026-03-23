import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect } from "storybook/test";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  DataTable,
  DefaultPage,
  FormField,
  MoneyInput,
  Stack,
  Steps,
  TabNav,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import type {
  DataTableColumnItem,
  MoneyInputValue,
} from "@commercetools/nimbus";
import { Check } from "@commercetools/nimbus-icons";

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
type Story = StoryObj<typeof DefaultPage.Root>;

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
// BUILDING BLOCKS
// ============================================================

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
// 3. CUSTOM TITLE CONTENT — Title with status badge
// ============================================================

/**
 * Demonstrates placing custom content alongside the title, such as a status
 * badge. This is a common MC pattern where product or order names are
 * accompanied by a status indicator.
 */
export const CustomTitleContent: Story = {
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
        <DefaultPage.Title>
          <Stack direction="row" gap="300" alignItems="center">
            Classic T-Shirt
            <Badge colorPalette="positive" size="xs">
              Published
            </Badge>
          </Stack>
        </DefaultPage.Title>
        <DefaultPage.Actions>
          <Button colorPalette="critical" variant="ghost">
            Unpublish
          </Button>
        </DefaultPage.Actions>
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Product detail content goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders title with badge", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1 })
      ).toBeInTheDocument();
      await expect(canvas.getByText("Published")).toBeInTheDocument();
    });

    await step("Badge is inside the heading element", async () => {
      const heading = canvas.getByRole("heading", { level: 1 });
      const badge = canvas.getByText("Published");
      await expect(heading.contains(badge)).toBe(true);
    });
  },
};

// ============================================================
// MAIN PAGE PATTERNS
// ============================================================

// ============================================================
// 4. INFO MAIN PAGE — Listing page with Actions and DataTable
// ============================================================

/**
 * The most common Merchant Center page pattern: a listing page with a title,
 * header action buttons, and a DataTable in the content area.
 */
export const InfoMainPage: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.Title>Products</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button variant="ghost">Export</Button>
            <Button colorPalette="primary" variant="solid">
              Add product
            </Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <DataTable
            maxHeight="100%"
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

    await step("Renders header action buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Export" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Add product" })
      ).toBeInTheDocument();
    });

    await step("Renders the data table", async () => {
      await expect(canvas.getByText("Classic T-Shirt")).toBeInTheDocument();
      await expect(canvas.getByText("TS-001")).toBeInTheDocument();
    });
  },
};

// ============================================================
// 5. FORM MAIN PAGE — Form page with footer
// ============================================================

/**
 * A form page pattern with input fields in the content area and Save / Cancel
 * actions in the Footer slot.
 */
export const FormMainPage: Story = {
  render: () => {
    const [name, setName] = useState("");

    return (
      <Box
        height="500px"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <DefaultPage.Root>
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
              {Array.from({ length: 4 }, (_, i) => (
                <FormField.Root key={i}>
                  <FormField.Label>Field {i + 3}</FormField.Label>
                  <FormField.Input>
                    <TextInput
                      placeholder={`Value for field ${i + 3}`}
                      aria-label={`Field ${i + 3}`}
                    />
                  </FormField.Input>
                </FormField.Root>
              ))}
            </Stack>
          </DefaultPage.Content>
          <DefaultPage.Footer>
            <Stack direction="row" gap="200">
              <Button colorPalette="primary" variant="solid">
                Save product
              </Button>
              <Button variant="ghost">Cancel</Button>
            </Stack>
          </DefaultPage.Footer>
        </DefaultPage.Root>
      </Box>
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
// 6. TABULAR MAIN PAGE — Main page with TabNav and footer
// ============================================================

/**
 * A main page with tab navigation in the header and a footer with form actions.
 * This covers the MC settings pattern (e.g., Project Settings) where tabbed
 * content sections have save/cancel actions.
 */
export const TabularMainPage: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.Title>Project settings</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button colorPalette="primary" variant="solid">
              Add channel
            </Button>
          </DefaultPage.Actions>
          <DefaultPage.TabNav>
            <TabNav.Root aria-label="Settings sections">
              <TabNav.Item href="#general" isCurrent>
                General
              </TabNav.Item>
              <TabNav.Item href="#international">International</TabNav.Item>
              <TabNav.Item href="#taxes">Taxes</TabNav.Item>
              <TabNav.Item href="#shipping">Shipping</TabNav.Item>
            </TabNav.Root>
          </DefaultPage.TabNav>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            {Array.from({ length: 6 }, (_, i) => (
              <FormField.Root key={i}>
                <FormField.Label>Setting {i + 1}</FormField.Label>
                <FormField.Input>
                  <TextInput
                    placeholder={`Value for setting ${i + 1}`}
                    aria-label={`Setting ${i + 1}`}
                  />
                </FormField.Input>
              </FormField.Root>
            ))}
          </Stack>
        </DefaultPage.Content>
        <DefaultPage.Footer>
          <Stack direction="row" gap="200">
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders tab navigation", async () => {
      const tabNav = canvas.getByRole("navigation", {
        name: "Settings sections",
      });
      await expect(tabNav).toBeInTheDocument();
    });

    await step("Renders all tab links", async () => {
      await expect(
        canvas.getByRole("link", { name: "General" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "International" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Taxes" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Shipping" })
      ).toBeInTheDocument();
    });

    await step("Current tab has aria-current attribute", async () => {
      const currentTab = canvas.getByRole("link", { name: "General" });
      await expect(currentTab).toHaveAttribute("aria-current", "page");
    });

    await step("Renders footer action buttons", async () => {
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
// DETAIL PAGE PATTERNS
// ============================================================

// ============================================================
// 7. INFO DETAIL PAGE — Read-only detail view
// ============================================================

/**
 * A read-only detail page with a BackLink for back navigation, title,
 * and subtitle. No footer needed for info-only views.
 */
export const InfoDetailPage: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/products">
            Back to products
          </DefaultPage.BackLink>
          <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
          <DefaultPage.Subtitle>
            SKU-001 · Last updated 3 days ago
          </DefaultPage.Subtitle>
          <DefaultPage.Actions>
            <Button colorPalette="primary" variant="solid">
              Edit
            </Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="400">
            <Text fontWeight="600">Product details</Text>
            <Text color="neutral.11">
              A timeless classic T-Shirt available in multiple colors and sizes.
              Perfect for everyday wear with a comfortable fit and durable
              fabric.
            </Text>
            <Text fontWeight="600" mt="400">
              Variants
            </Text>
            <Text color="neutral.11">
              Available in S, M, L, XL across 5 colors.
            </Text>
            <Text fontWeight="600" mt="400">
              Pricing
            </Text>
            <Text color="neutral.11">
              Base price: $19.99 · Tax category: Standard Rate
            </Text>
            <Text fontWeight="600" mt="400">
              Inventory
            </Text>
            <Text color="neutral.11">
              142 units in stock across 3 warehouses.
            </Text>
            <Text fontWeight="600" mt="400">
              Categories
            </Text>
            <Text color="neutral.11">Apparel → Tops → T-Shirts</Text>
          </Stack>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
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
// 8. FORM DETAIL PAGE — Editable detail view with footer
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
            <Button colorPalette="critical" variant="ghost">
              Delete
            </Button>
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
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
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
// 9. TABULAR DETAIL PAGE — Detail with tabs and footer
// ============================================================

/**
 * A detail page combining BackLink navigation, header tab navigation, and a
 * footer with form actions. This covers the most feature-rich MC pattern:
 * editing within a tabbed detail view (e.g., Order detail, Customer detail).
 */
export const TabularDetailPage: Story = {
  render: () => (
    <Box
      height="500px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader stickyFooter>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/customers">
            Back to customers
          </DefaultPage.BackLink>
          <DefaultPage.Title>Jane Smith</DefaultPage.Title>
          <DefaultPage.Subtitle>customer@example.com</DefaultPage.Subtitle>
          <DefaultPage.Actions>
            <Button colorPalette="critical" variant="ghost">
              Delete
            </Button>
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
          <Stack gap="600" maxWidth="600px">
            <FormField.Root isRequired>
              <FormField.Label>First name</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="Jane" aria-label="First name" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root isRequired>
              <FormField.Label>Last name</FormField.Label>
              <FormField.Input>
                <TextInput defaultValue="Smith" aria-label="Last name" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Email</FormField.Label>
              <FormField.Input>
                <TextInput
                  defaultValue="customer@example.com"
                  aria-label="Email"
                />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </DefaultPage.Content>
        <DefaultPage.Footer>
          <Stack direction="row" gap="200">
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to customers/i });
      await expect(backLink).toHaveAttribute("href", "/customers");
    });

    await step("Renders tab navigation", async () => {
      const tabNav = canvas.getByRole("navigation", {
        name: "Customer sections",
      });
      await expect(tabNav).toBeInTheDocument();
    });

    await step("Renders footer action buttons", async () => {
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
// ADVANCED FEATURES
// ============================================================

// ============================================================
// 10. FLEXIBLE LAYOUT — Whole-page scroll, no sticky
// ============================================================

/**
 * Flexible layout (`layout="flexible"`) allows the whole page to scroll rather
 * than constraining the scroll to the content area. Wrap it in a fixed-height
 * container in Storybook to make the scroll behaviour visible.
 */
export const FlexibleLayout: Story = {
  render: () => (
    <Box
      height="500px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible">
        <DefaultPage.Header>
          <DefaultPage.Title>Edit product</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button variant="ghost">Preview</Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            {Array.from({ length: 10 }, (_, i) => (
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
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders page title", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Edit product" })
      ).toBeInTheDocument();
    });

    await step("Header does not have sticky positioning", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
      const style = window.getComputedStyle(header!);
      await expect(style.position).not.toBe("sticky");
    });

    await step("Footer does not have sticky positioning", async () => {
      const footer = canvasElement.querySelector("footer");
      await expect(footer).toBeInTheDocument();
      const style = window.getComputedStyle(footer!);
      await expect(style.position).not.toBe("sticky");
    });

    await step("Renders all form fields", async () => {
      for (let i = 1; i <= 10; i++) {
        await expect(canvas.getByLabelText(`Field ${i}`)).toBeInTheDocument();
      }
    });
  },
};

// ============================================================
// 11. FLEXIBLE STICKY HEADER — Header pinned while page scrolls
// ============================================================

/**
 * Flexible layout with `stickyHeader` pins the header at the top while the
 * whole page scrolls. The footer scrolls with the content. Useful for long
 * listing or info pages where the header context should remain visible.
 */
export const FlexibleStickyHeader: Story = {
  render: () => (
    <Box
      height="500px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader>
        <DefaultPage.Header>
          <DefaultPage.Title>Edit customer</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
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
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders page title", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Edit customer" })
      ).toBeInTheDocument();
    });

    await step("Header has sticky positioning", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
      const style = window.getComputedStyle(header!);
      await expect(style.position).toBe("sticky");
    });

    await step("Renders form fields in content area", async () => {
      await expect(canvas.getByLabelText("Field 1")).toBeInTheDocument();
      await expect(canvas.getByLabelText("Field 8")).toBeInTheDocument();
    });
  },
};

// ============================================================
// 12. FLEXIBLE STICKY FOOTER — Footer pinned, header scrolls
// ============================================================

/**
 * Flexible layout with only `stickyFooter` pins the footer at the bottom while
 * the header scrolls away with the content. Useful for long form pages where
 * save actions must always be reachable but header context is less critical.
 */
export const FlexibleStickyFooter: Story = {
  render: () => (
    <Box
      height="500px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyFooter>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/products">
            Back to products
          </DefaultPage.BackLink>
          <DefaultPage.Title>Edit: Classic T-Shirt</DefaultPage.Title>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            {Array.from({ length: 10 }, (_, i) => (
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
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
            <Button variant="ghost">Cancel</Button>
          </Stack>
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Header does not have sticky positioning", async () => {
      const header = canvasElement.querySelector("header");
      await expect(header).toBeInTheDocument();
      const style = window.getComputedStyle(header!);
      await expect(style.position).not.toBe("sticky");
    });

    await step("Footer has sticky positioning", async () => {
      const footer = canvasElement.querySelector("footer");
      await expect(footer).toBeInTheDocument();
      const style = window.getComputedStyle(footer!);
      await expect(style.position).toBe("sticky");
    });
  },
};

// ============================================================
// 13. FLEXIBLE STICKY HEADER AND FOOTER — Both pinned
// ============================================================

/**
 * Both header and footer are sticky while the flexible-layout page scrolls.
 * Use `layout="flexible"` with `stickyHeader` and `stickyFooter` together.
 * Useful for long form pages where save actions should always be accessible.
 */
export const FlexibleStickyHeaderAndFooter: Story = {
  render: () => (
    <Box
      height="500px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader stickyFooter>
        <DefaultPage.Header>
          <DefaultPage.Title>Edit product</DefaultPage.Title>
          <DefaultPage.Actions>
            <Button variant="ghost">Preview</Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            {Array.from({ length: 10 }, (_, i) => (
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
            <Button colorPalette="primary" variant="solid">
              Save changes
            </Button>
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

// ============================================================
// 14. WITH STEPS — Multi-step wizard inside a page
// ============================================================

/**
 * A detail page with a Steps wizard in the content area. This pattern is
 * common in Merchant Center flows such as product creation or checkout
 * configuration where a multi-step process lives inside a page layout.
 */
export const WithSteps: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const stepCount = 3;

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
          <DefaultPage.Title>Create Product</DefaultPage.Title>
          <DefaultPage.Subtitle>
            Follow the steps to add a new product to your catalog.
          </DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Steps.Root
            step={currentStep}
            onStepChange={(details) => setCurrentStep(details.step)}
            count={stepCount}
          >
            <Steps.List>
              <Steps.Item index={0}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  <Steps.Title>General Info</Steps.Title>
                </Steps.Trigger>
                <Steps.Separator />
              </Steps.Item>
              <Steps.Item index={1}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  <Steps.Title>Pricing</Steps.Title>
                </Steps.Trigger>
                <Steps.Separator />
              </Steps.Item>
              <Steps.Item index={2}>
                <Steps.Trigger>
                  <Steps.Indicator>
                    <Steps.Status
                      complete={<Check />}
                      incomplete={<Steps.Number />}
                    />
                  </Steps.Indicator>
                  <Steps.Title>Review</Steps.Title>
                </Steps.Trigger>
              </Steps.Item>
            </Steps.List>

            <Steps.Content index={0}>
              <Stack gap="600" maxWidth="600px" py="600">
                <FormField.Root isRequired>
                  <FormField.Label>Product name</FormField.Label>
                  <FormField.Input>
                    <TextInput
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
            </Steps.Content>

            <Steps.Content index={1}>
              <Stack gap="600" maxWidth="600px" py="600">
                <FormField.Root isRequired>
                  <FormField.Label>Base price</FormField.Label>
                  <FormField.Input>
                    <TextInput placeholder="0.00" aria-label="Base price" />
                  </FormField.Input>
                </FormField.Root>
                <FormField.Root>
                  <FormField.Label>Tax category</FormField.Label>
                  <FormField.Input>
                    <TextInput
                      placeholder="e.g. Standard Rate"
                      aria-label="Tax category"
                    />
                  </FormField.Input>
                </FormField.Root>
              </Stack>
            </Steps.Content>

            <Steps.Content index={2}>
              <Box py="600">
                <Text>
                  Review your product details before publishing. All information
                  can be edited later.
                </Text>
              </Box>
            </Steps.Content>

            <Steps.CompletedContent>
              <Box py="600">
                <Text fontWeight="600" color="success.11">
                  Product created successfully!
                </Text>
              </Box>
            </Steps.CompletedContent>

            <Stack direction="row" gap="200" pt="400">
              <Steps.PrevTrigger asChild>
                <Button variant="ghost" disabled={currentStep === 0}>
                  Back
                </Button>
              </Steps.PrevTrigger>
              <Steps.NextTrigger asChild>
                <Button colorPalette="primary" variant="solid">
                  {currentStep === stepCount - 1 ? "Finish" : "Next"}
                </Button>
              </Steps.NextTrigger>
            </Stack>
          </Steps.Root>
        </DefaultPage.Content>
      </DefaultPage.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders back link", async () => {
      const backLink = canvas.getByRole("link", { name: /back to products/i });
      await expect(backLink).toBeInTheDocument();
    });

    await step("Renders page title", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Create Product" })
      ).toBeInTheDocument();
    });

    await step("Renders all step titles", async () => {
      await expect(canvas.getByText("General Info")).toBeInTheDocument();
      await expect(canvas.getByText("Pricing")).toBeInTheDocument();
      await expect(canvas.getByText("Review")).toBeInTheDocument();
    });

    await step("Renders step navigation buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Back" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Next" })
      ).toBeInTheDocument();
    });

    await step("First step content is visible", async () => {
      await expect(canvas.getByText("Product name")).toBeInTheDocument();
    });
  },
};
