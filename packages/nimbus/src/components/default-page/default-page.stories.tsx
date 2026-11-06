import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, userEvent, waitFor, spyOn } from "storybook/test";
import type { MockInstance } from "storybook/test";
import { useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  DataTable,
  DefaultPage,
  FormActionBar,
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
  // VRT: default header + content padding, no footer.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
// 4. FOCUSED BACK LINK — The only slot DefaultPage renders focusable
// ============================================================

/**
 * BackLink is the only slot rendered as a focusable element, and carries the recipe's
 * only `focusRing`. Buttons and tabs passed into Actions / TabNav ring per their own
 * recipes and are covered by those components' audits.
 */
export const FocusedBackLink: Story = {
  // VRT: the backLink's focus ring - the recipe's only one.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
      </DefaultPage.Header>
      <DefaultPage.Content>
        <Text>Product detail content goes here.</Text>
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Back link is the first tab stop and takes focus", async () => {
      await userEvent.tab();
      await expect(
        canvas.getByRole("link", { name: /back to products/i })
      ).toHaveFocus();
    });
  },
};

// ============================================================
// MAIN PAGE PATTERNS
// ============================================================

// ============================================================
// 5. INFO MAIN PAGE — Listing page with Actions and DataTable
// ============================================================

/**
 * A common page pattern: a listing page with a title, header action buttons,
 * and a DataTable in the content area.
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
// 6. FORM MAIN PAGE — Form page with footer
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
            <FormActionBar
              saveLabel="Save product"
              onSave={() => {}}
              onCancel={() => {}}
            />
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
// 7. TABULAR MAIN PAGE — Main page with TabNav and footer
// ============================================================

/**
 * A main page with tab navigation in the header and a footer with form actions.
 * This covers the MC settings pattern (e.g., Project Settings) where tabbed
 * content sections have save/cancel actions.
 */
export const TabularMainPage: Story = {
  // VRT: `:has(tabNav)` padding collapse, Actions on row 1, and the constrained footer pin.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
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
// 8. INFO DETAIL PAGE — Read-only detail view
// ============================================================

/**
 * A read-only detail page with a BackLink for back navigation, title,
 * and subtitle. No footer needed for info-only views.
 */
export const InfoDetailPage: Story = {
  // VRT: the backLink slot + `:has(backLink)` shifting Actions to row 2.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
// 9. FORM DETAIL PAGE — Editable detail view with footer
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
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
// 10. TABULAR DETAIL PAGE — Detail with tabs and footer
// ============================================================

/**
 * A detail page combining BackLink navigation, header tab navigation, and a
 * footer with form actions. This covers the most feature-rich MC pattern:
 * editing within a tabbed detail view (e.g., Order detail, Customer detail).
 */
export const TabularDetailPage: Story = {
  // VRT: both `:has()` rules at once; flexible + short content, so the footer flows under it.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
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
// 11. FLEXIBLE LAYOUT — Whole-page scroll, no sticky
// ============================================================

/**
 * Flexible layout (`layout="flexible"`) allows the whole page to scroll rather
 * than constraining the scroll to the content area. Wrap it in a fixed-height
 * container in Storybook to make the scroll behaviour visible.
 */
export const FlexibleLayout: Story = {
  // VRT: flexible - the outer box scrolls, not the content slot.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
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
// 12. FLEXIBLE STICKY HEADER — Header pinned while page scrolls
// ============================================================

/**
 * Flexible layout with `stickyHeader` pins the header at the top while the
 * whole page scrolls. The footer scrolls with the content. Useful for long
 * listing or info pages where the header context should remain visible.
 */
export const FlexibleStickyHeader: Story = {
  // VRT: header pinned over scrolled content; at rest it looks static, so the play scrolls.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box
      data-testid="scroll-container"
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

    await step("Header stays pinned once the page is scrolled", async () => {
      const scrollContainer = canvas.getByTestId("scroll-container");
      const header = canvasElement.querySelector("header")!;
      // Derived, so a padding-token change cannot stop it scrolling past.
      const scrollTarget = header.offsetHeight + 50;
      scrollContainer.scrollTop = scrollTarget;
      await waitFor(() => expect(scrollContainer.scrollTop).toBe(scrollTarget));

      const offsetFromTop =
        header.getBoundingClientRect().top -
        scrollContainer.getBoundingClientRect().top;
      // Tolerance for the container border.
      await expect(offsetFromTop).toBeGreaterThanOrEqual(0);
      await expect(offsetFromTop).toBeLessThanOrEqual(2);
    });
  },
};

// ============================================================
// 13. FLEXIBLE STICKY FOOTER — Footer pinned, header scrolls
// ============================================================

/**
 * Flexible layout with only `stickyFooter` pins the footer at the bottom while
 * the header scrolls away with the content. Useful for long form pages where
 * save actions must always be reachable but header context is less critical.
 */
export const FlexibleStickyFooter: Story = {
  // VRT: footer pinned while the header scrolls out of view - the inverse frame.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box
      data-testid="scroll-container"
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
        </DefaultPage.Footer>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

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

    await step(
      "Footer stays pinned while the header scrolls out of view",
      async () => {
        const scrollContainer = canvas.getByTestId("scroll-container");
        const header = canvasElement.querySelector("header")!;
        // Derived, so a padding-token change cannot stop it scrolling past.
        const scrollTarget = header.offsetHeight + 50;
        scrollContainer.scrollTop = scrollTarget;
        await waitFor(() =>
          expect(scrollContainer.scrollTop).toBe(scrollTarget)
        );

        const containerRect = scrollContainer.getBoundingClientRect();
        await expect(header.getBoundingClientRect().bottom).toBeLessThan(
          containerRect.top
        );

        const footer = canvasElement.querySelector("footer")!;
        const offsetFromBottom =
          containerRect.bottom - footer.getBoundingClientRect().bottom;
        // Tolerance for the container border.
        await expect(offsetFromBottom).toBeGreaterThanOrEqual(0);
        await expect(offsetFromBottom).toBeLessThanOrEqual(2);
      }
    );
  },
};

// ============================================================
// 14. FLEXIBLE STICKY HEADER AND FOOTER — Both pinned
// ============================================================

/**
 * Both header and footer are sticky while the flexible-layout page scrolls.
 * Use `layout="flexible"` with `stickyHeader` and `stickyFooter` together.
 * Useful for long form pages where save actions should always be accessible.
 */
export const FlexibleStickyHeaderAndFooter: Story = {
  // VRT: both edges pinned - a third frame, not the sum of the two single-flag stories.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box
      data-testid="scroll-container"
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
          <FormActionBar
            saveLabel="Save changes"
            onSave={() => {}}
            onCancel={() => {}}
          />
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

    await step("Both edges stay pinned once the page is scrolled", async () => {
      const scrollContainer = canvas.getByTestId("scroll-container");
      const header = canvasElement.querySelector("header")!;
      const scrollTarget = header.offsetHeight + 50;
      scrollContainer.scrollTop = scrollTarget;
      await waitFor(() => expect(scrollContainer.scrollTop).toBe(scrollTarget));

      const containerRect = scrollContainer.getBoundingClientRect();
      // Tolerance for the container border.
      const headerOffset =
        header.getBoundingClientRect().top - containerRect.top;
      await expect(headerOffset).toBeGreaterThanOrEqual(0);
      await expect(headerOffset).toBeLessThanOrEqual(2);

      const footer = canvasElement.querySelector("footer")!;
      const footerOffset =
        containerRect.bottom - footer.getBoundingClientRect().bottom;
      await expect(footerOffset).toBeGreaterThanOrEqual(0);
      await expect(footerOffset).toBeLessThanOrEqual(2);
    });
  },
};

// ============================================================
// 15. WITH STEPS — Multi-step wizard inside a page
// ============================================================

/**
 * A detail page with a Steps wizard in the content area. This pattern is
 * common in flows such as resource creation or multi-step configuration
 * where a wizard lives inside a page layout.
 */
export const WithSteps: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Ark UI's Steps architecture places Steps.Item (div) between
            // Steps.List (tablist) and Steps.Trigger (tab). ARIA requires
            // tablist to have direct tab children. Ark uses aria-owns as
            // a workaround, but axe still flags the intermediate divs.
            // This is an upstream architectural limitation in Ark UI.
            id: "aria-required-children",
            enabled: false,
          },
          {
            // Chakra/Ark Steps sets aria-controls on triggers pointing to
            // content panel IDs even when no Steps.Content is rendered for
            // that index. This causes axe to report invalid aria-controls.
            id: "aria-valid-attr-value",
            enabled: false,
          },
        ],
      },
    },
  },
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

// ============================================================
// COLLAPSE HEADER ON SCROLL
// ============================================================

/** Waits for the next animation frame. */
const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Waits for a number of milliseconds. */
const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** The header of the page inside the story canvas. */
const getHeader = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(".nimbus-default-page__header")!;

/** The root of the page inside the story canvas. */
const getRoot = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(".nimbus-default-page__root")!;

/** The value of `--default-page-header-height` on Root. */
const getHeightVariable = (root: HTMLElement) =>
  root.style.getPropertyValue("--default-page-header-height");

/** Whether the header or a part inside it is still animating. */
const isHeaderAnimating = (header: HTMLElement) =>
  header.getAnimations({ subtree: true }).length > 0;

/**
 * Waits until the header shows the given form and its change animation (if
 * any) has finished.
 */
const waitForForm = async (header: HTMLElement, collapsed: boolean) => {
  await waitFor(
    () =>
      collapsed
        ? expect(header).toHaveAttribute("data-collapsed", "true")
        : expect(header).not.toHaveAttribute("data-collapsed"),
    { timeout: 2000 }
  );
  await waitFor(() => expect(isHeaderAnimating(header)).toBe(false), {
    timeout: 2000,
  });
};

/**
 * Waits until the header shows the given form and has finished animating,
 * and checks on every frame until then that `reference` does not move.
 */
const expectStillUntilForm = async (
  reference: HTMLElement,
  header: HTMLElement,
  collapsed: boolean
) => {
  const top = reference.getBoundingClientRect().top;
  const deadline = performance.now() + 2000;
  while (
    header.hasAttribute("data-collapsed") !== collapsed ||
    isHeaderAnimating(header)
  ) {
    if (performance.now() > deadline) break;
    await nextFrame();
    await expect(
      Math.abs(reference.getBoundingClientRect().top - top)
    ).toBeLessThanOrEqual(1);
  }
  await expect(header.hasAttribute("data-collapsed")).toBe(collapsed);
};

/** Waits well past the pause and checks that the header kept its form. */
const expectFormKept = async (header: HTMLElement, collapsed: boolean) => {
  await wait(400);
  if (collapsed) {
    await expect(header).toHaveAttribute("data-collapsed", "true");
  } else {
    await expect(header).not.toHaveAttribute("data-collapsed");
  }
};

/**
 * `beforeEach` of the one-step fallback stories: hides the scroll timelines
 * that the scroll-driven collapse needs, as in a browser without them, and
 * restores them after the story.
 */
const withOneStepChange = () => {
  const win = window as Window & {
    ViewTimeline?: unknown;
    ScrollTimeline?: unknown;
  };
  const saved = {
    ViewTimeline: win.ViewTimeline,
    ScrollTimeline: win.ScrollTimeline,
  };
  win.ViewTimeline = undefined;
  win.ScrollTimeline = undefined;
  return () => {
    win.ViewTimeline = saved.ViewTimeline;
    win.ScrollTimeline = saved.ScrollTimeline;
  };
};

/** Scroll-driven collapse: waits until the header is pinned, or no longer. */
const waitForPinned = (header: HTMLElement, pinned: boolean) =>
  waitFor(
    () =>
      pinned
        ? expect(header).toHaveAttribute("data-scroll-collapsed", "true")
        : expect(header).not.toHaveAttribute("data-scroll-collapsed"),
    { timeout: 2000 }
  );

/**
 * Scroll-driven collapse: waits until the header parts are at rest (no part
 * animation runs; the header's own animation in the constrained layout always
 * runs). At the top, this takes a short pause. Stories call it at the end, so
 * the accessibility check and the visual snapshot see a stable header and not
 * a frame in between two states.
 */
const waitForRest = (header: HTMLElement) =>
  waitFor(
    () =>
      expect(
        header
          .getAnimations({ subtree: true })
          .filter(
            (animation) =>
              (animation.effect as KeyframeEffect | null)?.target !== header
          )
      ).toHaveLength(0),
    { timeout: 2000 }
  );

/**
 * Scrolls an element to `target` in steps of `stepPx` CSS pixels, one step per
 * frame, and checks after every frame that the header has not changed form.
 */
const scrollInFrames = async (
  scroller: Element,
  target: number,
  header: HTMLElement,
  stepPx = 10
) => {
  const formAtStart = header.getAttribute("data-collapsed");
  const direction = Math.sign(target - scroller.scrollTop);
  while (Math.abs(target - scroller.scrollTop) > 0.5) {
    const next =
      direction > 0
        ? Math.min(target, scroller.scrollTop + stepPx)
        : Math.max(target, scroller.scrollTop - stepPx);
    scroller.scrollTop = next;
    await nextFrame();
    await expect(header.getAttribute("data-collapsed")).toBe(formAtStart);
    if (Math.abs(scroller.scrollTop - next) > 1) break; // reached the end
  }
};

/** Form fields used as scrollable content. */
const LongFormContent = ({ fields = 12 }: { fields?: number }) => (
  <Stack gap="600" maxWidth="600px">
    {Array.from({ length: fields }, (_, i) => (
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
);

/**
 * Flexible layout with `stickyHeader` and `collapseHeaderOnScroll`, in a
 * scroll container that starts 200px below the top of the window (under an
 * app bar). The header follows the scroll position of the container.
 */
export const CollapseHeaderScrollContainerOffset: Story = {
  render: () => (
    <Box>
      <Box
        height="200px"
        bg="neutral.3"
        display="flex"
        alignItems="center"
        paddingX="900"
      >
        <Text>App bar</Text>
      </Box>
      <Box
        data-testid="scroll-container"
        height="400px"
        overflow="auto"
        borderTop="solid-25"
        borderColor="neutral.6"
      >
        <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/products">
              Back to products
            </DefaultPage.BackLink>
            <DefaultPage.Title>Edit product</DefaultPage.Title>
            <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
            <DefaultPage.Actions>
              <Button variant="solid" colorPalette="primary">
                Save changes
              </Button>
            </DefaultPage.Actions>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <LongFormContent />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = getHeader(canvasElement);
    // From the inner top edge of the container (it has a top border).
    const top = () =>
      header.getBoundingClientRect().top -
      (scroller.getBoundingClientRect().top + scroller.clientTop);
    let distance = 0;

    await step("Starts in the full form", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      distance = -parseFloat(header.style.top);
      await expect(top()).toBe(0);
    });

    await step("Follows the scroll position, 10px per frame", async () => {
      for (let y = 10; y < distance; y += 10) {
        scroller.scrollTop = y;
        await nextFrame();
        await expect(top()).toBeCloseTo(-y, 0);
      }
    });

    await step("Is pinned after the collapse distance", async () => {
      scroller.scrollTop = distance + 150;
      await waitForPinned(header, true);
      await expect(top()).toBeCloseTo(-distance, 0);
    });

    await step("Returns to the full form at the top", async () => {
      scroller.scrollTop = 0;
      await waitForPinned(header, false);
      await waitFor(() => expect(top()).toBe(0));
      await waitForRest(header);
    });
  },
};

type CollapseCheckOptions = {
  step: (label: string, play: () => Promise<void>) => Promise<void> | void;
  root: HTMLElement;
  header: HTMLElement;
  /** The element that scrolls the page. */
  scroller: HTMLElement;
  /** An element in the content whose screen position must stay still. */
  reference: HTMLElement;
  /**
   * The header keeps its full height in the page (flexible layout). The
   * threshold is then 8px instead of the space given back plus 8px, nothing
   * after the header moves, and the scroll position is never corrected.
   */
  keepsSpace?: boolean;
};

/**
 * The checks every scrolling story runs. They measure the real full and
 * collapsed heights, derive the threshold T (the space given back S, or 0
 * when the header keeps its space), and check: the full form at 0; T + 7
 * keeps the full form and T + 9 collapses after the pause; no change while
 * scrolling; the content stays still on every frame while the header changes
 * form; the collapsed form is kept while scrolling up; the full form at the
 * top; and the header height variable in both forms. It ends at scroll
 * position 0.
 */
const runCollapseChecks = async ({
  step,
  root,
  header,
  scroller,
  reference,
  keepsSpace = false,
}: CollapseCheckOptions) => {
  // Scroll position at which the header starts to cover the content: 0 when
  // Root is at the top of the scroller.
  let offset = 0;
  let fullHeight = 0;
  let collapsedHeight = 0;
  const toScrollTop = (distance: number) => offset + distance;

  await step("Shows the full form at the top", async () => {
    // The header height changes when the web font arrives: measure after it.
    await header.ownerDocument.fonts.ready;
    await waitFor(() =>
      expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight + 300)
    );
    await expect(header).not.toHaveAttribute("data-collapsed");
    const scrollerTop =
      scroller === header.ownerDocument.scrollingElement
        ? 0
        : scroller.getBoundingClientRect().top;
    offset =
      scroller.contains(root) && root !== scroller
        ? Math.max(0, root.getBoundingClientRect().top - scrollerTop)
        : 0;
    fullHeight = header.getBoundingClientRect().height;
    await waitFor(() =>
      expect(getHeightVariable(root)).toBe(`${fullHeight}px`)
    );
  });

  await step("Measures the collapsed form", async () => {
    scroller.scrollTop = toScrollTop(400);
    await waitForForm(header, true);
    collapsedHeight = header.getBoundingClientRect().height;
    await expect(collapsedHeight).toBeLessThan(fullHeight);
    await waitFor(() =>
      expect(getHeightVariable(root)).toBe(`${collapsedHeight}px`)
    );
    scroller.scrollTop = 0;
    await waitForForm(header, false);
  });

  const threshold = () => (keepsSpace ? 0 : fullHeight - collapsedHeight);

  /** The space the header takes in the page: where the content starts. */
  const content = root.querySelector<HTMLElement>("main")!;
  const headerSpace = () =>
    content.getBoundingClientRect().top - root.getBoundingClientRect().top;

  await step("Keeps the full form at T + 7", async () => {
    await scrollInFrames(
      scroller,
      toScrollTop(Math.floor(threshold() + 7)),
      header
    );
    await expectFormKept(header, false);
  });

  await step(
    "Collapses after the pause at T + 9, and the content stays still",
    async () => {
      await scrollInFrames(
        scroller,
        toScrollTop(Math.ceil(threshold() + 9)),
        header
      );
      const scrollTop = scroller.scrollTop;
      await expectStillUntilForm(reference, header, true);
      if (keepsSpace) {
        // No scroll correction, and the header still takes its full space.
        await expect(scroller.scrollTop).toBe(scrollTop);
        await expect(Math.abs(headerSpace() - fullHeight)).toBeLessThanOrEqual(
          1
        );
      }
    }
  );

  await step(
    "Keeps the collapsed form while scrolling down and back up",
    async () => {
      await scrollInFrames(
        scroller,
        toScrollTop(threshold() + 150),
        header,
        20
      );
      await scrollInFrames(scroller, toScrollTop(2), header, 20);
      await expectFormKept(header, true);
    }
  );

  await step("Returns to the full form at the top", async () => {
    await scrollInFrames(scroller, 0, header);
    if (keepsSpace) {
      // Nothing after the header moves while it expands.
      await expectStillUntilForm(reference, header, false);
      await expect(Math.abs(headerSpace() - fullHeight)).toBeLessThanOrEqual(1);
    } else {
      await waitForForm(header, false);
    }
    await waitFor(() =>
      expect(getHeightVariable(root)).toBe(`${fullHeight}px`)
    );
    scroller.scrollTop = 0;
  });
};

/** A header with every DefaultPage part. */
const CollapsingHeader = ({
  withTabs = true,
  title = "Classic T-Shirt, organic cotton, crew neck",
  truncateTitle = false,
}: {
  withTabs?: boolean;
  title?: string;
  /** Truncates the title with the `truncate` style prop. */
  truncateTitle?: boolean;
}) => (
  <DefaultPage.Header>
    <DefaultPage.BackLink href="/products">
      Back to products
    </DefaultPage.BackLink>
    <DefaultPage.Title truncate={truncateTitle}>{title}</DefaultPage.Title>
    <DefaultPage.Subtitle>SKU-12345 · Last modified today</DefaultPage.Subtitle>
    <DefaultPage.Actions>
      <Button variant="ghost">Duplicate</Button>
      <Button variant="solid" colorPalette="primary">
        Save changes
      </Button>
    </DefaultPage.Actions>
    {withTabs && (
      <DefaultPage.TabNav>
        <TabNav.Root aria-label="Product sections">
          <TabNav.Item href="#general" isCurrent>
            General
          </TabNav.Item>
          <TabNav.Item href="#variants">Variants</TabNav.Item>
        </TabNav.Root>
      </DefaultPage.TabNav>
    )}
  </DefaultPage.Header>
);

/**
 * The collapsed header, for visual regression: constrained layout with every
 * header part, scrolled until the header is pinned and its parts rest. This
 * story ends scrolled, because a collapsed header exists only away from the
 * top. The scroll position belongs to the story's own content element, so it
 * does not leak into other stories.
 */
export const CollapsedHeader: Story = {
  // VRT: the collapsed form - title row with back icon, title and actions, tabs below.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const title = canvas.getByRole("heading", { level: 1 });

    await step("Scrolls until the header is pinned", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForPinned(header, true);
      await waitForRest(header);
      await expect(title.getAnimations()).toHaveLength(0);
    });
  },
};

/**
 * Flexible layout with `stickyHeader` and `collapseHeaderOnScroll`, with the
 * scroll container at the top of the window. The header follows the scroll
 * position: over the collapse distance (as much as the header gets shorter),
 * it slides up and its parts move to their collapsed places; scrolling back
 * plays it backwards. The browser drives the animations from the scroll
 * position (scroll-driven animations); no script runs while scrolling. At
 * rest, the parts have no animations, so their text is sharp. Compare with
 * `CollapseHeaderFallbackFlexibleSticky`.
 */
export const CollapseHeaderFlexibleSticky: Story = {
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const content = canvas.getByRole("main");
    const title = canvas.getByRole("heading", { level: 1 });
    const subtitle = canvas.getByText("SKU-12345 · Last modified today");
    const backLink = canvas.getByRole("link", { name: "Back to products" });
    const backIcon = backLink.querySelector("svg")!;
    const actions = header.querySelector<HTMLElement>(
      ".nimbus-default-page__actions"
    )!;
    const getTooltip = () =>
      canvasElement.ownerDocument.querySelector<HTMLElement>(
        "[role='tooltip']"
      );

    /** Screen position relative to the top of the scroll container. */
    const top = (element: Element) =>
      element.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top;
    const centerY = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    /** Where the content starts, relative to Root: never changes. */
    const headerSpace = () =>
      content.getBoundingClientRect().top - root.getBoundingClientRect().top;
    const scrollTo = async (position: number) => {
      scroller.scrollTop = position;
      await nextFrame();
      await nextFrame();
    };

    let fullHeight = 0;
    let distance = 0;
    let titleTopHalfway = 0;

    await step("Uses scroll-driven animations", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      distance = -parseFloat(header.style.top);
      fullHeight = header.getBoundingClientRect().height;
      // No form change through the attribute: the parts move instead.
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    await step(
      "At rest at the top, the parts have no animations (sharp text)",
      async () => {
        await scrollTo(0);
        await expect(top(header)).toBe(0);
        await expect(getComputedStyle(subtitle).opacity).toBe("1");
        await expect(headerSpace()).toBeCloseTo(fullHeight, 0);
        await waitFor(() => expect(title.getAnimations()).toHaveLength(0));
        await expect(title.style.transform).toBe("");
      }
    );

    await step(
      "Input that comes before scrolling gets the animations ready",
      async () => {
        await userEvent.keyboard("{PageDown}");
        await scrollTo(0);
        const ViewTimelineClass = (
          window as Window & { ViewTimeline?: new () => AnimationTimeline }
        ).ViewTimeline!;
        await waitFor(() => expect(title.getAnimations()).toHaveLength(1));
        await expect(title.getAnimations()[0].timeline).toBeInstanceOf(
          ViewTimelineClass
        );
      }
    );

    await step("Halfway, the header follows the scroll position", async () => {
      await scrollTo(distance / 2);
      // The header has moved up by the scroll distance, nothing else.
      await expect(top(header)).toBeCloseTo(-distance / 2, 0);
      await expect(headerSpace()).toBeCloseTo(fullHeight, 0);
      // The hidden parts have faded out in the first half.
      await expect(Number(getComputedStyle(subtitle).opacity)).toBeLessThan(
        0.05
      );
      titleTopHalfway = top(title);
    });

    await step(
      "After the full distance, it shows the collapsed form",
      async () => {
        await scrollTo(distance + 100);
        await expect(header.getBoundingClientRect().bottom).toBeCloseTo(
          scroller.getBoundingClientRect().top + fullHeight - distance,
          0
        );
        await expect(headerSpace()).toBeCloseTo(fullHeight, 0);
        // Back icon, title and actions share one row.
        await expect(
          Math.abs(centerY(backIcon) - centerY(title))
        ).toBeLessThanOrEqual(1.5);
        await expect(
          Math.abs(centerY(actions) - centerY(title))
        ).toBeLessThanOrEqual(1.5);
        await expect(backIcon.getBoundingClientRect().right).toBeLessThan(
          title.getBoundingClientRect().left
        );
      }
    );

    await step(
      "Hidden parts stay accessible and let clicks through",
      async () => {
        await expect(subtitle).toBeInTheDocument();
        await expect(backLink).toHaveAccessibleName("Back to products");
        const tab = canvas.getByRole("link", { name: "Variants" });
        const tabRect = tab.getBoundingClientRect();
        const hit = canvasElement.ownerDocument.elementFromPoint(
          tabRect.left + tabRect.width / 2,
          tabRect.top + tabRect.height / 2
        );
        await expect(tab.contains(hit)).toBe(true);
        const iconRect = backIcon.getBoundingClientRect();
        const iconHit = canvasElement.ownerDocument.elementFromPoint(
          iconRect.left + iconRect.width / 2,
          iconRect.top + iconRect.height / 2
        );
        await expect(backLink.contains(iconHit)).toBe(true);
      }
    );

    await step(
      "Once pinned, the back link is a 24px icon with a tooltip",
      async () => {
        await waitFor(() =>
          expect(header).toHaveAttribute("data-scroll-collapsed", "true")
        );
        const linkRect = backLink.getBoundingClientRect();
        await expect(linkRect.width).toBeCloseTo(24, 0);
        await expect(linkRect.height).toBeCloseTo(24, 0);
        await expect(linkRect.right).toBeLessThanOrEqual(
          title.getBoundingClientRect().left
        );
        // The compact link keeps its outer size: the header does not change.
        await expect(header.getBoundingClientRect().height).toBeCloseTo(
          fullHeight,
          0
        );
        await expect(backLink).toHaveAccessibleName("Back to products");

        // At rest, the parts have no animations but their end look as fixed
        // styles, so the scaled title is drawn at its real size.
        await expect(title.getAnimations()).toHaveLength(0);
        await expect(title.style.transform).toMatch(/scale\(/);
        await expect(
          Math.abs(centerY(title) - centerY(backIcon))
        ).toBeLessThanOrEqual(1.5);

        // React Aria opens a tooltip on hover only after a mouse move: move
        // over the content first, as a real mouse would.
        await userEvent.hover(content);
        await userEvent.hover(backLink);
        await waitFor(() => expect(getTooltip()).not.toBeNull());
        await expect(getTooltip()!.textContent?.trim()).toBe(
          "Back to products"
        );
        await userEvent.unhover(backLink);
        await userEvent.hover(content);
        await waitFor(() => expect(getTooltip()).toBeNull());
      }
    );

    await step("Scrolling back plays it backwards", async () => {
      await scrollTo(distance / 2);
      await waitFor(() =>
        expect(header).not.toHaveAttribute("data-scroll-collapsed")
      );
      // The animations are back, and the fixed styles are gone.
      await waitFor(() => expect(title.style.transform).toBe(""));
      await expect(title.getAnimations()).toHaveLength(1);
      await expect(top(title)).toBeCloseTo(titleTopHalfway, 0);
      await expect(backLink.getBoundingClientRect().width).toBeGreaterThan(24);
      await scrollTo(0);
      await expect(top(header)).toBe(0);
      await expect(getComputedStyle(subtitle).opacity).toBe("1");
      await waitForRest(header);
    });
  },
};

/**
 * Constrained layout (default) with `collapseHeaderOnScroll`. Only the
 * content area scrolls. With its scroll position, the header's top margin
 * goes down (the header moves up, Root clips it) and the content area's top
 * padding grows by the same amount: the content moves exactly with the
 * scroll, and the content area, with its scrollbar, always starts at the
 * bottom of the header. No transform moves the header. The parts move as in
 * the flexible layout. The page sets its own top padding on the content
 * area; it stays. Compare with `CollapseHeaderFallbackConstrained`.
 */
export const CollapseHeaderConstrained: Story = {
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content paddingTop="400">
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const title = canvas.getByRole("heading", { level: 1 });
    const backLink = canvas.getByRole("link", { name: "Back to products" });
    const backIcon = backLink.querySelector("svg")!;
    const firstField = canvas.getByLabelText("Field 1");

    /** Position relative to the top of Root. */
    const top = (element: Element) =>
      element.getBoundingClientRect().top - root.getBoundingClientRect().top;
    const centerY = (element: Element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    const scrollTo = async (position: number) => {
      content.scrollTop = position;
      await nextFrame();
      await nextFrame();
    };
    /** The content area, and so its scrollbar, starts at the header bottom. */
    const expectContentBelowHeader = async () => {
      await expect(top(content)).toBeCloseTo(
        header.getBoundingClientRect().bottom -
          root.getBoundingClientRect().top,
        0
      );
    };

    let distance = 0;
    let fullHeight = 0;
    let ownPadding = 0;
    let firstFieldTop = 0;

    await step(
      "Runs the scroll-driven header in the constrained layout",
      async () => {
        await waitFor(() =>
          expect(root).toHaveAttribute("data-scroll-driven", "constrained")
        );
        distance = parseFloat(
          root.style.getPropertyValue("--default-page-collapse-distance")
        );
        await expect(distance).toBeGreaterThan(0);
        fullHeight = header.getBoundingClientRect().height;
        // `paddingTop="400"` on the content area (16px).
        ownPadding = parseFloat(getComputedStyle(content).paddingTop);
        await expect(ownPadding).toBe(16);
      }
    );

    await step(
      "At the top, the content starts below the full header",
      async () => {
        await scrollTo(0);
        await expect(top(header)).toBe(0);
        await expectContentBelowHeader();
        firstFieldTop = top(firstField);
        await expect(firstFieldTop).toBeGreaterThan(fullHeight);
        // No transform moves the header.
        await expect(getComputedStyle(header).transform).toBe("none");
      }
    );

    await step(
      "Halfway, the header moves up; the content moves exactly with the scroll",
      async () => {
        await scrollTo(distance / 2);
        await expect(top(header)).toBeCloseTo(-distance / 2, 0);
        await expectContentBelowHeader();
        await expect(top(firstField)).toBeCloseTo(
          firstFieldTop - distance / 2,
          0
        );
        await expect(getComputedStyle(header).transform).toBe("none");
      }
    );

    await step(
      "After the full distance, it is pinned in the collapsed form",
      async () => {
        await scrollTo(distance + 100);
        await waitFor(() =>
          expect(header).toHaveAttribute("data-scroll-collapsed", "true")
        );
        await expect(header.getBoundingClientRect().bottom).toBeCloseTo(
          root.getBoundingClientRect().top + fullHeight - distance,
          0
        );
        await expectContentBelowHeader();
        await expect(top(firstField)).toBeCloseTo(
          firstFieldTop - distance - 100,
          0
        );
        // The page's own padding stays; the collapse distance is added.
        await expect(parseFloat(getComputedStyle(content).paddingTop)).toBe(
          ownPadding + distance
        );
        await expect(
          Math.abs(centerY(backIcon) - centerY(title))
        ).toBeLessThanOrEqual(1.5);
        await expect(backLink.getBoundingClientRect().width).toBeCloseTo(24, 0);
        // At rest, the parts have no animations but fixed end styles.
        await expect(title.getAnimations()).toHaveLength(0);
        await expect(title.style.transform).toMatch(/scale\(/);
      }
    );

    await step("Back at the top, the header is full again", async () => {
      await scrollTo(0);
      await waitFor(() =>
        expect(header).not.toHaveAttribute("data-scroll-collapsed")
      );
      await waitFor(() => expect(top(header)).toBe(0));
      await expectContentBelowHeader();
      await expect(top(firstField)).toBeCloseTo(firstFieldTop, 0);
      await expect(parseFloat(getComputedStyle(content).paddingTop)).toBe(
        ownPadding
      );
      await waitForRest(header);
    });
  },
};

/**
 * Scroll-driven collapse: the width of the page changes while the header is
 * pinned. The header is measured again after every size change, and the parts
 * that the collapsed form hides (subtitle, back link label) must stay hidden in
 * every frame in between. The width goes down until the title wraps, which
 * changes the height of the header, and back up.
 */
export const CollapseHeaderResizeWhilePinned: Story = {
  render: () => (
    <Box data-testid="frame" width="900px">
      <Box data-testid="scroll-container" height="500px" overflow="auto">
        <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
          <CollapsingHeader />
          <DefaultPage.Content>
            <LongFormContent fields={16} />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const frame = canvas.getByTestId("frame");
    const scroller = canvas.getByTestId("scroll-container");
    const subtitle = canvas.getByText("SKU-12345 · Last modified today");
    const backLink = canvas.getByRole("link", { name: "Back to products" });
    const backLinkLabel = backLink.querySelector<HTMLElement>(
      ".nimbus-default-page__backLinkLabel"
    )!;

    await step("Scrolls until the header is pinned", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      scroller.scrollTop = -parseFloat(header.style.top) + 100;
      await waitForPinned(header, true);
      await waitForRest(header);
      await expect(Number(getComputedStyle(subtitle).opacity)).toBe(0);
      await expect(Number(getComputedStyle(backLinkLabel).opacity)).toBe(0);
    });

    await step(
      "The hidden parts stay hidden in every frame while the width changes",
      async () => {
        const widths: number[] = [];
        for (let width = 900; width >= 420; width -= 20) widths.push(width);
        for (let width = 420; width <= 900; width += 20) widths.push(width);

        const headerHeights = new Set<number>();
        let mostVisible = 0;
        for (const width of widths) {
          frame.style.width = `${width}px`;
          // Two frames per size: the first one after the change, and the next.
          for (let frames = 0; frames < 2; frames += 1) {
            await nextFrame();
            mostVisible = Math.max(
              mostVisible,
              Number(getComputedStyle(subtitle).opacity),
              Number(getComputedStyle(backLinkLabel).opacity)
            );
          }
          headerHeights.add(Math.round(header.getBoundingClientRect().height));
        }

        // The test only means something if the header was measured again.
        await expect(headerHeights.size).toBeGreaterThan(1);
        await expect(mostVisible).toBeLessThan(0.05);
      }
    );

    await step("Ends at rest with the original width", async () => {
      frame.style.width = "900px";
      await waitForPinned(header, true);
      await waitForRest(header);
    });
  },
};

/**
 * Constrained layout: while the header is pinned and the content is scrolled
 * to its bottom, a size change measures the header again. Measuring does not
 * lower the scroll position, only the real maximum of the scroller can.
 */
export const CollapseHeaderResizeWhilePinnedConstrained: Story = {
  render: () => (
    <Box data-testid="frame" width="900px">
      <Box height="500px">
        <DefaultPage.Root collapseHeaderOnScroll>
          <CollapsingHeader />
          <DefaultPage.Content>
            <Box height="1200px" />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const frame = canvas.getByTestId("frame");
    const content = canvas.getByRole("main");

    await step("Scrolls to the bottom until the header is pinned", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = content.scrollHeight;
      await waitForPinned(header, true);
      await waitForRest(header);
      // The padding that grows while collapsing raised the maximum: go again.
      content.scrollTop = content.scrollHeight;
      await nextFrame();
      await expect(
        content.scrollHeight - content.clientHeight - content.scrollTop
      ).toBeLessThanOrEqual(1);
    });

    await step(
      "The pinned position and padding are kept in every frame while the width changes",
      async () => {
        const widths: number[] = [];
        for (let width = 900; width >= 420; width -= 20) widths.push(width);
        for (let width = 420; width <= 900; width += 20) widths.push(width);

        const pinnedLook = () => ({
          headerTop: header.getBoundingClientRect().top,
          padding: parseFloat(getComputedStyle(content).paddingTop),
        });
        const headerHeights = new Set<number>();
        let before = pinnedLook();
        headerHeights.add(Math.round(header.getBoundingClientRect().height));
        for (const width of widths) {
          const saved = content.scrollTop;
          frame.style.width = `${width}px`;
          const sampled: { headerTop: number; padding: number }[] = [];
          for (let frames = 0; frames < 2; frames += 1) {
            await nextFrame();
            sampled.push(pinnedLook());
            const maxScrollTop = content.scrollHeight - content.clientHeight;
            await expect(content.scrollTop).toBeGreaterThanOrEqual(
              Math.min(saved, maxScrollTop) - 1
            );
          }
          await waitForPinned(header, true);
          await waitForRest(header);
          const after = pinnedLook();
          headerHeights.add(Math.round(header.getBoundingClientRect().height));
          // The collapse distance can change with the width, so the pinned
          // look changes too. A frame stays between the look before and after
          // the change, and never shows the look without the drivers.
          const within = (value: number, a: number, b: number) =>
            value >= Math.min(a, b) - 1 && value <= Math.max(a, b) + 1;
          for (const frameLook of sampled) {
            await expect(
              within(frameLook.headerTop, before.headerTop, after.headerTop),
              `header top ${frameLook.headerTop} at ${width}px (pinned ${before.headerTop} / ${after.headerTop})`
            ).toBe(true);
            await expect(
              within(frameLook.padding, before.padding, after.padding),
              `padding-top ${frameLook.padding} at ${width}px (pinned ${before.padding} / ${after.padding})`
            ).toBe(true);
          }
          before = after;
        }

        // The test only means something if the header was measured again.
        await expect(headerHeights.size).toBeGreaterThan(1);
      }
    );

    await step("Ends pinned and at rest", async () => {
      frame.style.width = "900px";
      await waitForPinned(header, true);
      await waitForRest(header);
    });
  },
};

/**
 * Scroll-driven collapse: a page removes a tall note (renders nothing) when
 * `isCollapsed` is true. Each form is measured with the content that the form
 * renders, so the collapse distance and the pinned height measured while the
 * header is pinned (note absent) equal the ones measured at the top (note
 * present).
 */
export const CollapseHeaderNoteRemovedWhenCollapsed: Story = {
  render: () => (
    <Box data-testid="frame" width="900px">
      <Box data-testid="scroll-container" height="500px" overflow="auto">
        <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
          <DefaultPage.Header>
            {({ isCollapsed }) => (
              <>
                <DefaultPage.BackLink href="/products">
                  Back to products
                </DefaultPage.BackLink>
                <DefaultPage.Title>Spring campaign</DefaultPage.Title>
                <DefaultPage.Subtitle>
                  Runs from March to May
                </DefaultPage.Subtitle>
                <DefaultPage.Actions>
                  <Button variant="solid" colorPalette="primary">
                    Publish
                  </Button>
                </DefaultPage.Actions>
                {!isCollapsed && (
                  <Box
                    data-testid="removable-note"
                    gridColumn="1 / -1"
                    height="48px"
                  >
                    Draft, not visible to customers
                  </Box>
                )}
              </>
            )}
          </DefaultPage.Header>
          <DefaultPage.Content>
            <LongFormContent fields={16} />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const root = getRoot(canvasElement);
    const frame = canvas.getByTestId("frame");
    const scroller = canvas.getByTestId("scroll-container");
    const distanceOf = () => -parseFloat(header.style.top);
    const pinnedHeightOf = () => parseFloat(getHeightVariable(root));
    let distance = 0;
    let pinnedHeight = 0;

    await step("Measures at the top, with the note present", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      await expect(canvas.getByTestId("removable-note")).toBeInTheDocument();
      distance = distanceOf();
      pinnedHeight = pinnedHeightOf();
      await expect(distance).toBeGreaterThan(0);
    });

    await step("Pins the header: the note is gone", async () => {
      scroller.scrollTop = distance + 100;
      await waitForPinned(header, true);
      await waitForRest(header);
      await expect(canvas.queryByTestId("removable-note")).toBeNull();
    });

    await step(
      "A resize while pinned measures the same distance and pinned height",
      async () => {
        for (const width of [860, 900]) {
          frame.style.width = `${width}px`;
          await nextFrame();
          await nextFrame();
          await waitForPinned(header, true);
          await waitForRest(header);
        }
        await expect(
          Math.abs(distanceOf() - distance),
          `distance ${distanceOf()} (at the top ${distance})`
        ).toBeLessThanOrEqual(1);
        await expect(
          Math.abs(pinnedHeightOf() - pinnedHeight),
          `pinned height ${pinnedHeightOf()} (at the top ${pinnedHeight})`
        ).toBeLessThanOrEqual(1);
      }
    );

    await step(
      "Back at the top the note is shown again and the header is stable",
      async () => {
        scroller.scrollTop = 0;
        await waitForPinned(header, false);
        await waitFor(() =>
          expect(canvas.getByTestId("removable-note")).toBeInTheDocument()
        );
        await waitForRest(header);
        const heights = new Set<number>();
        for (let frames = 0; frames < 10; frames += 1) {
          await nextFrame();
          heights.add(header.getBoundingClientRect().height);
        }
        await expect(heights.size).toBe(1);
        await expect(Math.abs(distanceOf() - distance)).toBeLessThanOrEqual(1);
      }
    );
  },
};

/**
 * A header cut off at its bottom edge by the scroll container (the page starts
 * low in a short container) shows the full form at the scroll start: only
 * scrolling collapses it. The fixture is sized from the measured header
 * height and collapse distance, so the visible part of the header at the
 * start is smaller than the pinned height. A second fixture cuts the header
 * at both edges: the container is shorter than the pinned height.
 */
export const CollapseHeaderClippedAtBottom: Story = {
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <Box data-testid="spacer" />
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={20} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const spacer = canvas.getByTestId("spacer");
    const subtitle = header.querySelector<HTMLElement>(
      ".nimbus-default-page__subtitle"
    )!;
    let distance = 0;
    let pinnedHeight = 0;

    /** Sets the spacer above Root and the container height. */
    const fit = async (spacerHeight: number, containerHeight: number) => {
      scroller.scrollTop = 0;
      spacer.style.height = `${spacerHeight}px`;
      scroller.style.height = `${containerHeight}px`;
      // Long enough for the observer to report and the parts to come to rest.
      await wait(700);
    };

    const checkFullAtStart = async () => {
      await waitForRest(header);
      await expect(header).not.toHaveAttribute("data-scroll-collapsed");
      await expect(getComputedStyle(subtitle).opacity).toBe("1");
      await waitFor(() =>
        expect(header.getAnimations({ subtree: true })).toHaveLength(0)
      );
    };

    await step("Measures the header", async () => {
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      distance = -parseFloat(header.style.top);
      pinnedHeight = header.getBoundingClientRect().height - distance;
      await expect(distance).toBeGreaterThan(40);
      await expect(pinnedHeight).toBeGreaterThan(40);
    });

    await step(
      "Clipped at the bottom: the full form, until scrolling",
      async () => {
        // Half of the pinned height is visible at the start.
        await fit(400, 400 + pinnedHeight / 2);
        await checkFullAtStart();

        scroller.scrollTop = 400 + distance / 2;
        await wait(100);
        await expect(header).not.toHaveAttribute("data-scroll-collapsed");

        scroller.scrollTop = 400 + distance + 50;
        await waitForPinned(header, true);

        scroller.scrollTop = 0;
        await waitForPinned(header, false);
        await checkFullAtStart();
      }
    );

    await step(
      "Clipped at both edges: pinned only after the collapse distance has scrolled away",
      async () => {
        await fit(20, pinnedHeight * 0.6);
        await checkFullAtStart();

        scroller.scrollTop = 20 + distance / 2;
        await wait(100);
        await expect(header).not.toHaveAttribute("data-scroll-collapsed");

        scroller.scrollTop = 20 + distance + 50;
        await waitForPinned(header, true);

        scroller.scrollTop = 0;
        await waitForPinned(header, false);
        await checkFullAtStart();
      }
    );
  },
};

/**
 * A title that wraps in the full form (a 640px wide page). The title keeps
 * its lines in the collapsed form, at the smaller size, and the title row
 * grows to fit them. For one line, truncate the title
 * (`<DefaultPage.Title truncate>`).
 */
export const CollapseHeaderLongTitle: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      width="640px"
      height="500px"
      overflow="auto"
      borderInlineEnd="solid-25"
      borderColor="neutral.6"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader title="Classic T-Shirt, organic cotton, crew neck, relaxed fit, heather grey with contrast stitching" />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const title = canvas.getByRole("heading", { level: 1 });
    const scroller = canvas.getByTestId("scroll-container");
    const backIcon = canvas
      .getByRole("link", { name: "Back to products" })
      .querySelector("svg")!;
    const actions = header.querySelector<HTMLElement>(
      ".nimbus-default-page__actions"
    )!;
    const tabNav = header.querySelector<HTMLElement>(
      ".nimbus-default-page__tabNav"
    )!;
    const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
    const centerY = (rect: DOMRect) => rect.top + rect.height / 2;

    await step("The title wraps in the full form", async () => {
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      await expect(title.getBoundingClientRect().height).toBeGreaterThan(
        lineHeight * 1.5
      );
    });

    await step(
      "Once collapsed, the title keeps its lines and fits in the header",
      async () => {
        const distance = -parseFloat(header.style.top);
        scroller.scrollTop = distance + 60;
        await nextFrame();
        await nextFrame();
        const titleRect = title.getBoundingClientRect();
        // The title is scaled, not cut: its lines are all there.
        const scale = titleRect.height / title.offsetHeight;
        await expect(scale).toBeLessThan(1);
        await expect(titleRect.height).toBeGreaterThan(
          lineHeight * scale * 1.5
        );
        // Space above the title, and between the title and the tabs.
        await expect(titleRect.top).toBeGreaterThanOrEqual(
          scroller.getBoundingClientRect().top + 8
        );
        await expect(titleRect.bottom).toBeLessThanOrEqual(
          tabNav.getBoundingClientRect().top - 8
        );
        // The back icon sits on the first line; the actions are centered.
        await expect(
          Math.abs(
            centerY(backIcon.getBoundingClientRect()) -
              (titleRect.top + (lineHeight * scale) / 2)
          )
        ).toBeLessThanOrEqual(1.5);
        await expect(
          Math.abs(
            centerY(actions.getBoundingClientRect()) - centerY(titleRect)
          )
        ).toBeLessThanOrEqual(1.5);
        await expect(titleRect.right).toBeLessThanOrEqual(
          actions.getBoundingClientRect().left
        );
        scroller.scrollTop = 0;
        await waitForPinned(header, false);
        await waitForRest(header);
      }
    );
  },
};

/**
 * A page that wants the title on one line truncates it with a style prop
 * (`<DefaultPage.Title truncate>`). The title is then on one line in both
 * forms.
 */
export const CollapseHeaderTruncatedTitle: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      width="640px"
      height="500px"
      overflow="auto"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader
          truncateTitle
          title="Classic T-Shirt, organic cotton, crew neck, relaxed fit, heather grey with contrast stitching"
        />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const title = canvas.getByRole("heading", { level: 1 });
    const scroller = canvas.getByTestId("scroll-container");
    const lineHeight = parseFloat(getComputedStyle(title).lineHeight);

    await step("The title is on one line in the full form", async () => {
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      await expect(title.getBoundingClientRect().height).toBeLessThan(
        lineHeight * 1.5
      );
      await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    });

    await step("Pinned, the title stays on one line", async () => {
      const distance = -parseFloat(header.style.top);
      scroller.scrollTop = distance + 60;
      await waitForPinned(header, true);
      await waitForRest(header);
      const titleRect = title.getBoundingClientRect();
      // The title is scaled: compare with its scaled line height.
      const scale = titleRect.height / title.offsetHeight;
      await expect(scale).toBeLessThan(1);
      await expect(titleRect.height).toBeLessThan(lineHeight * scale * 1.5);
    });

    await step("Returns to the full form at the top", async () => {
      scroller.scrollTop = 0;
      await waitForPinned(header, false);
      await waitForRest(header);
    });
  },
};

/**
 * A tab click that scrolls the page back to the top, as many apps do when
 * they show another tab. The header follows the scroll position, so it
 * returns to its full form at once and the tabs move down under the mouse
 * pointer. (The one-step fallback keeps the collapsed form while the pointer
 * is over the header; compare with `CollapseHeaderFallbackTabClick`.)
 */
export const CollapseHeaderTabClick: Story = {
  render: function Render() {
    const [current, setCurrent] = useState("general");
    const scrollerRef = useRef<HTMLDivElement>(null);
    const select = (id: string) => (event: React.MouseEvent) => {
      event.preventDefault();
      setCurrent(id);
      scrollerRef.current?.scrollTo({ top: 0 });
    };
    return (
      <Box
        ref={scrollerRef}
        data-testid="scroll-container"
        height="500px"
        overflow="auto"
      >
        <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/products">
              Back to products
            </DefaultPage.BackLink>
            <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
            <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
            <DefaultPage.TabNav>
              <TabNav.Root aria-label="Product sections">
                <TabNav.Item
                  href="#general"
                  isCurrent={current === "general"}
                  onClick={select("general")}
                >
                  General
                </TabNav.Item>
                <TabNav.Item
                  href="#variants"
                  isCurrent={current === "variants"}
                  onClick={select("variants")}
                >
                  Variants
                </TabNav.Item>
              </TabNav.Root>
            </DefaultPage.TabNav>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Text textStyle="lg" marginBottom="600">
              {current === "general" ? "General" : "Variants"}
            </Text>
            <LongFormContent fields={16} />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");

    await step("Collapses after scrolling", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      scroller.scrollTop = 400;
      await waitFor(() =>
        expect(header).toHaveAttribute("data-scroll-collapsed", "true")
      );
    });

    await step(
      "After the tab click, the tabs move down under the pointer",
      async () => {
        const tab = canvas.getByRole("link", { name: "Variants" });
        const before = tab.getBoundingClientRect();
        const pointer = {
          x: before.left + before.width / 2,
          y: before.top + before.height / 2,
        };
        await userEvent.click(tab);
        await waitFor(() => expect(scroller.scrollTop).toBe(0));
        await nextFrame();
        await nextFrame();

        // The header is back in its full form at once.
        await expect(header).not.toHaveAttribute("data-scroll-collapsed");
        const distance = -parseFloat(header.style.top);
        await expect(tab.getBoundingClientRect().top - before.top).toBeCloseTo(
          distance,
          0
        );
        // The pointer is no longer over the tab it clicked.
        const under = canvasElement.ownerDocument.elementFromPoint(
          pointer.x,
          pointer.y
        );
        await expect(tab.contains(under)).toBe(false);
        await expect(
          canvas.getByText("Variants", { selector: "p" })
        ).toBeVisible();
        await waitForRest(header);
      }
    );
  },
};

/**
 * A function as `DefaultPage.Header` children receives `{ isCollapsed }`. It
 * turns `true` with the first scrolled pixels, before the header is pinned,
 * and `false` again at the top. Here an
 * "Unsaved changes" badge in the actions fades out meanwhile; it keeps its
 * place, so the header does not change size.
 */
export const CollapseHeaderState: Story = {
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <DefaultPage.Header>
          {({ isCollapsed }) => (
            <>
              <DefaultPage.BackLink href="/products">
                Back to products
              </DefaultPage.BackLink>
              <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
              <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
              <DefaultPage.Actions>
                <Badge
                  data-testid="unsaved-badge"
                  colorPalette="warning"
                  size="xs"
                  opacity={isCollapsed ? 0 : 1}
                  transition="opacity 150ms"
                >
                  Unsaved changes
                </Badge>
                <Button variant="solid" colorPalette="primary">
                  Save changes
                </Button>
              </DefaultPage.Actions>
            </>
          )}
        </DefaultPage.Header>
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const badge = canvas.getByTestId("unsaved-badge");

    await step("At the top, isCollapsed is false", async () => {
      await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
      await expect(badge).toBeVisible();
    });

    await step(
      "A few scrolled pixels set isCollapsed, before the header is pinned",
      async () => {
        scroller.scrollTop = 4;
        await waitFor(() => expect(badge).not.toBeVisible());
        await expect(header).not.toHaveAttribute("data-scroll-collapsed");
      }
    );

    await step("Back at the top, isCollapsed is false again", async () => {
      scroller.scrollTop = 0;
      await waitFor(() => expect(badge).toBeVisible());
      await waitForRest(header);
    });
  },
};

/**
 * Flexible layout with `stickyHeader` and `collapseHeaderOnScroll`, where the
 * document scrolls.
 */
export const CollapseHeaderDocumentScroll: Story = {
  render: () => (
    <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
      <CollapsingHeader />
      <DefaultPage.Content>
        <LongFormContent fields={30} />
      </DefaultPage.Content>
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvasElement.ownerDocument
      .scrollingElement as HTMLElement;
    try {
      await step("Follows the scroll position of the document", async () => {
        await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
        const distance = -parseFloat(header.style.top);
        // Where Root starts in the document.
        const rootStart = root.getBoundingClientRect().top + scroller.scrollTop;
        scroller.scrollTop = rootStart + distance / 2;
        await nextFrame();
        await nextFrame();
        await expect(header.getBoundingClientRect().top).toBeCloseTo(
          -distance / 2,
          0
        );
        scroller.scrollTop = rootStart + distance + 200;
        await waitForPinned(header, true);
        await expect(header.getBoundingClientRect().top).toBeCloseTo(
          -distance,
          0
        );
      });

      await step("Returns to the full form at the top", async () => {
        scroller.scrollTop = 0;
        await waitForPinned(header, false);
        await waitForRest(header);
      });
    } finally {
      scroller.scrollTop = 0;
    }
  },
};

/**
 * Constrained layout in a narrow container with every header part. When
 * pinned, the title keeps all its lines and the actions stay on the title
 * row, next to the title.
 */
export const CollapseHeaderNarrow: Story = {
  render: () => (
    <Box width="400px" height="600px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");

    await step(
      "Pinned: the title keeps its lines; the actions stay beside it",
      async () => {
        await waitFor(() =>
          expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
        );
        content.scrollTop = 400;
        await waitForPinned(header, true);
        const heading = canvas.getByRole("heading", { level: 1 });
        const titleRect = heading.getBoundingClientRect();
        const scale = titleRect.height / heading.offsetHeight;
        const lineHeight = parseFloat(getComputedStyle(heading).lineHeight);
        await expect(titleRect.height).toBeGreaterThan(
          lineHeight * scale * 1.5
        );

        const save = canvas.getByRole("button", { name: "Save changes" });
        const saveRect = save.getBoundingClientRect();
        await expect(saveRect.left).toBeGreaterThanOrEqual(titleRect.right);
        await expect(saveRect.right).toBeLessThanOrEqual(
          header.getBoundingClientRect().right
        );
        await expect(
          Math.abs(
            saveRect.top +
              saveRect.height / 2 -
              (titleRect.top + titleRect.height / 2)
          )
        ).toBeLessThanOrEqual(2);

        content.scrollTop = 0;
        await waitForPinned(header, false);
        await waitForRest(header);
      }
    );
  },
};

/**
 * Page-owned content in the header. A page adapts it with a function as
 * `DefaultPage.Header` children, which receives `{ isCollapsed }`: here the
 * "Draft" note fades out once the header starts to collapse. It keeps its
 * place, so the header does not change size. Content below the title rows
 * stays in its grid column and remains visible when the header is pinned.
 */
export const CollapseHeaderCustomContent: Story = {
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <DefaultPage.Header>
          {({ isCollapsed }) => (
            <>
              <DefaultPage.Title>Spring campaign</DefaultPage.Title>
              <DefaultPage.Subtitle>
                Runs from March to May
              </DefaultPage.Subtitle>
              <DefaultPage.Actions>
                <Button variant="solid" colorPalette="primary">
                  Publish
                </Button>
              </DefaultPage.Actions>
              <Badge
                data-testid="column-1-badge"
                gridColumn="1"
                justifySelf="flex-start"
                colorPalette="blue"
                size="xs"
              >
                Column 1
              </Badge>
              <Badge
                data-testid="column-2-badge"
                gridColumn="2"
                justifySelf="flex-end"
                colorPalette="mint"
                size="xs"
              >
                Column 2
              </Badge>
              <Text
                data-testid="full-form-note"
                gridColumn="1"
                textStyle="xs"
                opacity={isCollapsed ? 0 : 1}
              >
                Draft, not visible to customers
              </Text>
            </>
          )}
        </DefaultPage.Header>
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const note = canvas.getByTestId("full-form-note");
    const column1 = canvas.getByTestId("column-1-badge");
    const column2 = canvas.getByTestId("column-2-badge");
    let fullLeft = 0;
    let fullRight = 0;

    await step("At the top, the note is visible", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      await waitFor(() =>
        expect(
          header.style.getPropertyValue("--default-page-back-icon-inset")
        ).not.toBe("")
      );
      await expect(note).toBeVisible();
      fullLeft = column1.getBoundingClientRect().left;
      fullRight = column2.getBoundingClientRect().right;
    });

    await step(
      "The note fades out once the header starts to collapse",
      async () => {
        content.scrollTop = 4;
        await waitFor(() => expect(note).not.toBeVisible());
      }
    );

    await step("Pinned: page-owned content keeps its grid column", async () => {
      content.scrollTop = 400;
      await waitForPinned(header, true);
      await expect(column1).toBeVisible();
      await expect(column2).toBeVisible();
      await expect(
        Math.abs(column1.getBoundingClientRect().left - fullLeft)
      ).toBeLessThanOrEqual(1);
      await expect(
        Math.abs(column2.getBoundingClientRect().right - fullRight)
      ).toBeLessThanOrEqual(1);
      // Visible inside the pinned header.
      await expect(column1.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        header.getBoundingClientRect().top
      );
    });

    await step("Back at the top, the note is visible again", async () => {
      content.scrollTop = 0;
      await waitForPinned(header, false);
      await waitFor(() => expect(note).toBeVisible());
      await waitForRest(header);
    });
  },
};

/**
 * Content that only just overflows, less than the collapse distance. At the
 * bottom the header stays in between, without flipping back and forth, and
 * measuring the header again there does not move the content.
 */
export const CollapseHeaderShortContent: Story = {
  render: () => (
    <Box height="420px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader withTabs={false} />
        <DefaultPage.Content>
          <Box data-testid="short-content" height="320px">
            <Text>Content that only just overflows.</Text>
          </Box>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const marker = canvas.getByText("Content that only just overflows.");

    await step("At the bottom, the header stays in between", async () => {
      const root = getRoot(canvasElement);
      await waitFor(() =>
        expect(root).toHaveAttribute("data-scroll-driven", "constrained")
      );
      const distance = parseFloat(
        root.style.getPropertyValue("--default-page-collapse-distance")
      );
      // Overflow by 20px less than the collapse distance, so the header
      // cannot reach its pinned form.
      const spacer = canvas.getByTestId("short-content");
      spacer.style.height = `${320 - (content.scrollHeight - content.clientHeight) + distance - 20}px`;
      await nextFrame();
      await expect(content.scrollHeight).toBeGreaterThan(content.clientHeight);
      content.scrollTop = content.scrollHeight;
      await wait(300);
      const scrollTop = content.scrollTop;
      const headerTop = header.getBoundingClientRect().top;
      await wait(300);
      await expect(content.scrollTop).toBe(scrollTop);
      await expect(header.getBoundingClientRect().top).toBe(headerTop);
      await expect(header).not.toHaveAttribute("data-scroll-collapsed");
    });

    await step(
      "Measuring again at the bottom does not move the content",
      async () => {
        const scrollTop = content.scrollTop;
        const markerTop = marker.getBoundingClientRect().top;
        // A width change of the header runs the measurement again.
        header.style.marginInlineEnd = "40px";
        await nextFrame();
        await nextFrame();
        await expect(content.scrollTop).toBe(scrollTop);
        await expect(
          Math.abs(marker.getBoundingClientRect().top - markerTop)
        ).toBeLessThanOrEqual(1);
        header.style.marginInlineEnd = "";
        content.scrollTop = 0;
        canvas.getByTestId("short-content").style.height = "";
        await waitForPinned(header, false);
        await waitForRest(header);
      }
    );
  },
};

/**
 * `collapseHeaderOnScroll` switched off at runtime while the header is
 * pinned: the header returns to its full form, and every style the component
 * set on the page is removed.
 */
export const CollapseHeaderSwitchedOff: Story = {
  render: function Render() {
    const [isEnabled, setIsEnabled] = useState(true);
    return (
      <Stack gap="0">
        <Box paddingX="900" paddingY="200">
          <Button variant="outline" onPress={() => setIsEnabled((v) => !v)}>
            {isEnabled ? "Turn off collapsing" : "Turn on collapsing"}
          </Button>
        </Box>
        <Box height="460px">
          <DefaultPage.Root collapseHeaderOnScroll={isEnabled}>
            <CollapsingHeader />
            <DefaultPage.Content>
              <LongFormContent fields={16} />
            </DefaultPage.Content>
          </DefaultPage.Root>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    let contentPaddingTop = "";

    await step("Pinned after scrolling", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      await waitFor(() =>
        expect(root).toHaveAttribute("data-scroll-driven", "constrained")
      );
      contentPaddingTop = getComputedStyle(content).paddingTop;
      content.scrollTop = 400;
      await waitForPinned(header, true);
      await expect(getHeightVariable(root)).not.toBe("");
    });

    await step("Switched off: full form, no styles left", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Turn off collapsing" })
      );
      await waitForPinned(header, false);
      await expect(root).not.toHaveAttribute("data-scroll-driven");
      await expect(getHeightVariable(root)).toBe("");
      await expect(header.getAnimations({ subtree: true })).toHaveLength(0);
      await expect(content.getAnimations()).toHaveLength(0);
      await expect(getComputedStyle(header).marginTop).toBe("0px");
      await expect(getComputedStyle(content).paddingTop).toBe(
        contentPaddingTop
      );
      content.scrollTop = 300;
      await nextFrame();
      await expect(header).not.toHaveAttribute("data-scroll-collapsed");
    });

    await step("Switched on while scrolled: pinned again", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Turn on collapsing" })
      );
      await waitForPinned(header, true);
      content.scrollTop = 0;
      await waitForPinned(header, false);
      await waitForRest(header);
    });
  },
};

let unpinnedWarnSpy: MockInstance<typeof console.warn> | undefined;

/**
 * Test, not a usage example: this story checks that nothing happens.
 *
 * With `layout="flexible"` and no `stickyHeader`, the header is not pinned. It
 * scrolls out of view with the page, so a collapsed form would never be seen.
 * `collapseHeaderOnScroll` therefore has no effect here: the header keeps its
 * full form, Root sets no header height variable, and development builds log
 * a warning. To collapse the header in the flexible layout, add
 * `stickyHeader`.
 */
export const CollapseHeaderIgnoredWhenNotPinned: Story = {
  beforeEach: () => {
    unpinnedWarnSpy = spyOn(console, "warn").mockImplementation(() => {});
    return () => unpinnedWarnSpy?.mockRestore();
  },
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <DefaultPage.Root layout="flexible" collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");

    await step("Logs a development warning", async () => {
      await waitFor(() =>
        expect(unpinnedWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining("collapseHeaderOnScroll")
        )
      );
    });

    await step("Keeps the full form after scrolling", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await scrollInFrames(scroller, 400, header);
      await expectFormKept(header, false);
      await expect(getHeightVariable(root)).toBe("");
      scroller.scrollTop = 0;
    });
  },
};

/**
 * Without `collapseHeaderOnScroll` the header looks and behaves as before:
 * no `data-collapsed` and no header height variable.
 */
export const CollapseHeaderOff: Story = {
  render: () => (
    <Box height="500px">
      <DefaultPage.Root>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");

    await step("Keeps the full form after scrolling", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      await scrollInFrames(content, 400, header);
      await expectFormKept(header, false);
      await expect(getHeightVariable(root)).toBe("");
      content.scrollTop = 0;
    });

    await step("Renders no tooltip on the back link", async () => {
      await userEvent.hover(
        canvas.getByRole("link", { name: "Back to products" })
      );
      await wait(600);
      await expect(
        canvasElement.ownerDocument.querySelector("[role='tooltip']")
      ).toBeNull();
      await userEvent.unhover(
        canvas.getByRole("link", { name: "Back to products" })
      );
    });
  },
};

/**
 * In the collapsed form the back link shows only its icon. A tooltip shows
 * its label on hover and keyboard focus. The tooltip text equals the label,
 * which stays the link's accessible name; the tooltip adds no description.
 * In the full form there is no tooltip.
 */
export const CollapseHeaderBackLinkTooltip: Story = {
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const doc = canvasElement.ownerDocument;
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const getTooltip = () => doc.querySelector<HTMLElement>("[role='tooltip']");
    const getBackLink = () =>
      canvas.getByRole("link", { name: "Back to products" });

    await step("No tooltip in the full form", async () => {
      await userEvent.hover(getBackLink());
      await wait(600);
      await expect(getTooltip()).toBeNull();
      await userEvent.unhover(getBackLink());
      await userEvent.hover(content);
    });

    await step("Collapses after scrolling", async () => {
      content.scrollTop = 400;
      await waitForPinned(header, true);
    });

    await step("Shows the label in a tooltip on hover", async () => {
      await userEvent.hover(getBackLink());
      await waitFor(() => expect(getTooltip()).not.toBeNull());
      const tooltip = getTooltip()!;
      await expect(tooltip).toHaveTextContent("Back to products");
      await expect(tooltip.textContent?.trim()).toBe("Back to products");
      await expect(tooltip).toHaveAttribute("aria-hidden", "true");
      await expect(getBackLink()).not.toHaveAttribute("aria-describedby");
      await expect(getBackLink()).toHaveAccessibleName("Back to products");
      await expect(getBackLink()).toHaveAccessibleDescription("");
      await userEvent.unhover(getBackLink());
      await userEvent.hover(content);
      await waitFor(() => expect(getTooltip()).toBeNull());
    });

    await step("Shows the label in a tooltip on keyboard focus", async () => {
      await userEvent.tab();
      await expect(getBackLink()).toHaveFocus();
      await waitFor(() => expect(getTooltip()).not.toBeNull());
      await expect(getTooltip()).toHaveTextContent("Back to products");
      await expect(getBackLink()).not.toHaveAttribute("aria-describedby");
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(getTooltip()).toBeNull());
    });

    await step("No tooltip on focus in the full form", async () => {
      getBackLink().blur();
      content.scrollTop = 0;
      await waitForPinned(header, false);
      await userEvent.tab();
      await expect(getBackLink()).toHaveFocus();
      await wait(400);
      await expect(getTooltip()).toBeNull();
      getBackLink().blur();
      await waitForRest(header);
    });
  },
};

/**
 * Smooth scrolls and jumps reach their target. The target uses the header
 * height variable (the pinned height) as `scroll-margin-top`, so it ends
 * directly below the pinned header.
 */
export const CollapseHeaderScrollIntoView: Story = {
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <Stack gap="600" maxWidth="600px">
            <LongFormContent fields={12} />
            <Text
              data-testid="target"
              scrollMarginTop="var(--default-page-header-height, 0px)"
            >
              Target section
            </Text>
            <LongFormContent fields={12} />
          </Stack>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const target = canvas.getByTestId("target");
    const gapBelowHeader = () =>
      target.getBoundingClientRect().top -
      header.getBoundingClientRect().bottom;

    await step(
      "A smooth scroll reaches its target, below the pinned header",
      async () => {
        await waitFor(() =>
          expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
        );
        await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        await waitForPinned(header, true);
        await waitFor(
          () => expect(Math.abs(gapBelowHeader())).toBeLessThanOrEqual(1),
          { timeout: 3000 }
        );
      }
    );

    await step("A jump ends directly below the pinned header", async () => {
      scroller.scrollTop = 0;
      await waitForPinned(header, false);
      target.scrollIntoView({ block: "start" });
      await nextFrame();
      await expect(Math.abs(gapBelowHeader())).toBeLessThanOrEqual(1);
      scroller.scrollTop = 0;
      await waitForPinned(header, false);
      await waitForRest(header);
    });
  },
};

/**
 * Content above Root in the same scrolling element. The header starts to
 * collapse only when the top of Root reaches the top of the scrolling area,
 * and the component never moves the content above Root.
 */
export const CollapseHeaderContentAbove: Story = {
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <Box
        data-testid="app-bar"
        height="120px"
        bg="neutral.3"
        display="flex"
        alignItems="center"
        paddingX="900"
      >
        <Text>Content above the page</Text>
      </Box>
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const appBar = canvas.getByTestId("app-bar");
    const content = canvas.getByRole("main");
    const top = (element: Element) =>
      element.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top;
    let distance = 0;
    let fullHeight = 0;

    await step(
      "Before Root reaches the top, the header keeps its full form",
      async () => {
        await waitFor(() =>
          expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
        );
        await waitFor(() => expect(header.style.top).toMatch(/^-\d/));
        distance = -parseFloat(header.style.top);
        fullHeight = header.getBoundingClientRect().height;
        scroller.scrollTop = 60;
        await nextFrame();
        await nextFrame();
        await expect(top(header)).toBeCloseTo(top(root), 0);
        await expect(top(appBar)).toBeCloseTo(-60, 0);
      }
    );

    await step("Then it follows the scroll position", async () => {
      const appBarHeight = appBar.getBoundingClientRect().height;
      scroller.scrollTop = appBarHeight + distance / 2;
      await nextFrame();
      await nextFrame();
      await expect(top(header)).toBeCloseTo(-distance / 2, 0);
      scroller.scrollTop = appBarHeight + distance + 200;
      await waitForPinned(header, true);
    });

    await step(
      "Back above Root: full form; nothing above Root moved",
      async () => {
        await scrollInFrames(scroller, 60, header, 40);
        await waitForPinned(header, false);
        await expect(scroller.scrollTop).toBe(60);
        await expect(top(appBar)).toBeCloseTo(-60, 0);
        // The header keeps its space: the content starts below it.
        await expect(
          content.getBoundingClientRect().top -
            header.getBoundingClientRect().top
        ).toBeCloseTo(fullHeight, 0);
        scroller.scrollTop = 0;
        await waitForRest(header);
      }
    );
  },
};

// ============================================================
// ONE-STEP FALLBACK
// Browsers without scroll-driven animations, and reduced motion. These
// stories hide the scroll timelines to get this path.
// ============================================================

/**
 * One-step fallback, constrained layout. The content scrolls inside
 * `DefaultPage.Content`, and once scrolling pauses, the header collapses in
 * one step when the content has scrolled a little more than the space the
 * header gives back; the scroll position is corrected so the content stays
 * still. It returns to its full form at the top.
 */
export const CollapseHeaderFallbackConstrained: Story = {
  beforeEach: withOneStepChange,
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");

    await runCollapseChecks({
      step,
      root,
      header,
      scroller: content,
      reference: canvas.getByLabelText("Field 8"),
    });

    await step("Collapsed form: parts and accessibility", async () => {
      const heading = canvas.getByRole("heading", { level: 1 });
      const fullFontSize = parseFloat(getComputedStyle(heading).fontSize);
      const fullPaddingTop = parseFloat(getComputedStyle(header).paddingTop);
      const fullHeight = header.getBoundingClientRect().height;

      content.scrollTop = 400;
      await waitForForm(header, true);

      // Same heading element, smaller; it keeps its lines (no forced
      // ellipsis).
      await expect(canvas.getByRole("heading", { level: 1 })).toBe(heading);
      await expect(header.tagName).toBe("HEADER");
      const titleStyle = getComputedStyle(heading);
      await expect(parseFloat(titleStyle.fontSize)).toBeLessThan(fullFontSize);
      await expect(titleStyle.whiteSpace).not.toBe("nowrap");
      await expect(titleStyle.textOverflow).not.toBe("ellipsis");

      // Shorter header with less vertical padding.
      await expect(header.getBoundingClientRect().height).toBeLessThan(
        fullHeight
      );
      await expect(
        parseFloat(getComputedStyle(header).paddingTop)
      ).toBeLessThan(fullPaddingTop);

      // Back link: same accessible name, icon on the title row, 24×24 target.
      const backLink = canvas.getByRole("link", { name: "Back to products" });
      const linkRect = backLink.getBoundingClientRect();
      const titleRect = heading.getBoundingClientRect();
      await expect(linkRect.width).toBeGreaterThanOrEqual(24);
      await expect(linkRect.height).toBeGreaterThanOrEqual(24);
      await expect(linkRect.right).toBeLessThanOrEqual(titleRect.left);
      await expect(
        Math.abs(
          linkRect.top +
            linkRect.height / 2 -
            (titleRect.top + titleRect.height / 2)
        )
      ).toBeLessThanOrEqual(2);

      // Subtitle hidden visually, still in the accessibility tree.
      const subtitle = canvas.getByText("SKU-12345 · Last modified today");
      const subtitleStyle = getComputedStyle(subtitle);
      await expect(subtitle.getBoundingClientRect().width).toBeLessThanOrEqual(
        1
      );
      await expect(subtitleStyle.display).not.toBe("none");
      await expect(subtitleStyle.visibility).not.toBe("hidden");
      await expect(subtitle.closest("[aria-hidden='true']")).toBeNull();

      // Actions and tabs stay visible and operable; Actions on the title row.
      const actions = canvas
        .getByRole("button", { name: "Save changes" })
        .closest<HTMLElement>(".nimbus-default-page__actions")!;
      const actionsRect = actions.getBoundingClientRect();
      await expect(actions).toBeVisible();
      await expect(
        Math.abs(
          actionsRect.top +
            actionsRect.height / 2 -
            (titleRect.top + titleRect.height / 2)
        )
      ).toBeLessThanOrEqual(2);
      const tabs = canvas.getByRole("navigation", { name: "Product sections" });
      await expect(tabs).toBeVisible();
      await expect(tabs.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        actionsRect.bottom
      );
    });

    await step(
      "Focus stays on a header element when the form changes",
      async () => {
        const save = canvas.getByRole("button", { name: "Save changes" });
        save.focus();
        await expect(save).toHaveFocus();

        content.scrollTop = 0;
        await waitForForm(header, false);
        await expect(save).toHaveFocus();

        content.scrollTop = 400;
        await waitForForm(header, true);
        await expect(save).toHaveFocus();

        save.blur();
        content.scrollTop = 0;
        await waitForForm(header, false);
      }
    );

    await step(
      "Parts that appear fade in; parts that disappear hide at once",
      async () => {
        const subtitle = canvas.getByText("SKU-12345 · Last modified today");
        const label = canvas.getByText("Back to products");
        for (const element of [subtitle, label]) {
          const style = getComputedStyle(element);
          await expect(style.transitionProperty).toBe("opacity");
          await expect(parseFloat(style.transitionDuration)).toBeGreaterThan(0);
        }

        content.scrollTop = 400;
        await waitForForm(header, true);
        for (const element of [subtitle, label]) {
          const style = getComputedStyle(element);
          await expect(style.opacity).toBe("0");
          await expect(parseFloat(style.transitionDuration)).toBe(0);
        }

        content.scrollTop = 0;
        await waitForForm(header, false);
      }
    );
  },
};

/**
 * One-step fallback, flexible layout with `stickyHeader`. Once scrolling
 * pauses, the header changes form in one step. The collapsed header keeps its
 * full height in the page (a bottom margin fills the rest), so nothing after
 * the header moves.
 */
export const CollapseHeaderFallbackFlexibleSticky: Story = {
  beforeEach: withOneStepChange,
  render: () => (
    <Box data-testid="scroll-container" height="500px" overflow="auto">
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await runCollapseChecks({
      step,
      root: getRoot(canvasElement),
      header: getHeader(canvasElement),
      scroller: canvas.getByTestId("scroll-container"),
      reference: canvas.getByLabelText("Field 8"),
      keepsSpace: true,
    });
  },
};

/**
 * One-step fallback: a tab click that resets the scroll position while the
 * mouse pointer is over the header. The header keeps its collapsed form until
 * the pointer leaves, so the tabs do not move under the pointer. (The
 * scroll-driven collapse cannot hold the header; see
 * `CollapseHeaderTabClick`.)
 */
export const CollapseHeaderFallbackTabClick: Story = {
  beforeEach: withOneStepChange,
  render: function Render() {
    const [current, setCurrent] = useState("general");
    const contentRef = useRef<HTMLElement>(null);
    const select = (id: string) => (event: React.MouseEvent) => {
      event.preventDefault();
      setCurrent(id);
      contentRef.current?.scrollTo({ top: 0 });
    };
    return (
      <Box height="500px">
        <DefaultPage.Root collapseHeaderOnScroll>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/products">
              Back to products
            </DefaultPage.BackLink>
            <DefaultPage.Title>Classic T-Shirt</DefaultPage.Title>
            <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
            <DefaultPage.TabNav>
              <TabNav.Root aria-label="Product sections">
                <TabNav.Item
                  href="#general"
                  isCurrent={current === "general"}
                  onClick={select("general")}
                >
                  General
                </TabNav.Item>
                <TabNav.Item
                  href="#variants"
                  isCurrent={current === "variants"}
                  onClick={select("variants")}
                >
                  Variants
                </TabNav.Item>
              </TabNav.Root>
            </DefaultPage.TabNav>
          </DefaultPage.Header>
          <DefaultPage.Content ref={contentRef}>
            <LongFormContent fields={16} />
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");

    await step("Collapses after scrolling", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForForm(header, true);
    });

    await step(
      "Keeps the collapsed form while the pointer is over the header",
      async () => {
        const tab = canvas.getByRole("link", { name: "Variants" });
        const tabTop = tab.getBoundingClientRect().top;
        await userEvent.click(tab);
        await waitFor(() => expect(content.scrollTop).toBe(0));
        await expectFormKept(header, true);
        await expect(tab.getBoundingClientRect().top).toBe(tabTop);
      }
    );

    await step("Returns to the full form when the pointer leaves", async () => {
      await userEvent.unhover(canvas.getByRole("link", { name: "Variants" }));
      await userEvent.hover(content);
      await waitForForm(header, false);
    });
  },
};

/**
 * One-step fallback with a title that wraps (a 640px wide page). The
 * collapsed title keeps its lines, at the smaller size; the back link icon
 * stays centered with the title.
 */
export const CollapseHeaderFallbackLongTitle: Story = {
  beforeEach: withOneStepChange,
  render: () => (
    <Box width="640px" height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader title="Classic T-Shirt, organic cotton, crew neck, relaxed fit, heather grey with contrast stitching" />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");
    const title = canvas.getByRole("heading", { level: 1 });

    await step("The collapsed title keeps all its lines", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForForm(header, true);
      const style = getComputedStyle(title);
      await expect(style.whiteSpace).not.toBe("nowrap");
      await expect(style.textOverflow).not.toBe("ellipsis");
      await expect(title.getBoundingClientRect().height).toBeGreaterThan(
        parseFloat(style.lineHeight) * 1.5
      );
      await expect(title.scrollWidth).toBeLessThanOrEqual(title.clientWidth);
    });

    await step("The back link icon is centered on the title row", async () => {
      const backLink = canvas.getByRole("link", { name: "Back to products" });
      const linkRect = backLink.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      await expect(
        Math.abs(
          linkRect.top +
            linkRect.height / 2 -
            (titleRect.top + titleRect.height / 2)
        )
      ).toBeLessThanOrEqual(2);
    });

    await step("Returns to the full form at the top", async () => {
      content.scrollTop = 0;
      await waitForForm(header, false);
    });
  },
};

/**
 * Reduced motion uses the one-step fallback. A play function cannot fake
 * `prefers-reduced-motion`, so this story hides the scroll timelines to get
 * the same path, checks that the compiled stylesheet ships the
 * reduced-motion rule that removes the fade, and that the header still
 * changes form. Verify the visual behavior by turning on "Reduce motion" in
 * the OS.
 */
export const CollapseHeaderFallbackReducedMotion: Story = {
  beforeEach: withOneStepChange,
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <CollapsingHeader />
        <DefaultPage.Content>
          <LongFormContent fields={16} />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = getHeader(canvasElement);
    const content = canvas.getByRole("main");

    await step(
      "Ships a prefers-reduced-motion rule that removes the fade",
      async () => {
        // The recipe compiles to a hashed class (e.g. "css-abc123") next to the
        // semantic "nimbus-default-page__header" class; the `_motionReduce`
        // block targets the hashed one. Anchor the check to this header's class
        // so removing `_motionReduce` fails the test.
        const hashedClasses = Array.from(header.classList).filter((name) =>
          name.startsWith("css-")
        );
        await expect(hashedClasses.length).toBeGreaterThan(0);

        const hasReducedMotionRule = Array.from(
          canvasElement.ownerDocument.styleSheets
        ).some((sheet) => {
          let rules: CSSRule[];
          try {
            rules = Array.from(sheet.cssRules);
          } catch {
            return false; // cross-origin sheet - skip
          }
          // A rule's cssText includes its nested @media blocks, so this
          // matches whether the block is emitted flat or nested.
          return rules.some(
            (rule) =>
              rule.cssText.includes("prefers-reduced-motion") &&
              hashedClasses.some((name) => rule.cssText.includes(`.${name}`)) &&
              rule.cssText.includes("nimbus-default-page__subtitle") &&
              rule.cssText.includes("transition")
          );
        });
        await expect(hasReducedMotionRule).toBe(true);
      }
    );

    await step("The header still changes form", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForForm(header, true);
      await expect(
        canvas.getByRole("link", { name: "Back to products" })
      ).toBeInTheDocument();
      content.scrollTop = 0;
      await waitForForm(header, false);
    });
  },
};
