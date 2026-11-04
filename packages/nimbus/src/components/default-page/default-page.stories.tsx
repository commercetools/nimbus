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

/** Waits until the header shows the given form. */
const waitForForm = (header: HTMLElement, collapsed: boolean) =>
  waitFor(
    () =>
      collapsed
        ? expect(header).toHaveAttribute("data-collapsed", "true")
        : expect(header).not.toHaveAttribute("data-collapsed"),
    { timeout: 2000 }
  );

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
 * app bar). The page scrolls 10px per frame and stops. The header keeps its
 * form while the page scrolls, and collapses after the pause.
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

    await step("Starts in the full form", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    await step("Keeps its form while scrolling 10px per frame", async () => {
      await scrollInFrames(scroller, header.offsetHeight + 150, header);
    });

    await step("Collapses after the pause", async () => {
      await waitFor(() =>
        expect(header).toHaveAttribute("data-collapsed", "true")
      );
    });

    await step("Returns to the full form at the top", async () => {
      scroller.scrollTop = 0;
      await waitFor(() => expect(header).not.toHaveAttribute("data-collapsed"));
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
};

/**
 * The checks every scrolling story runs. They measure the real full and
 * collapsed heights, derive the space given back S, and check:
 * the full form at 0; S + 7 keeps the full form and S + 9 collapses after the
 * pause; no change while scrolling; the content stays still when collapsing;
 * the collapsed form is kept while scrolling up; the full form at the top;
 * and the header height variable in both forms. It ends at scroll position 0.
 */
const runCollapseChecks = async ({
  step,
  root,
  header,
  scroller,
  reference,
}: CollapseCheckOptions) => {
  // Scroll position at which the header starts to cover the content: 0 when
  // Root is at the top of the scroller.
  let offset = 0;
  let fullHeight = 0;
  let collapsedHeight = 0;
  const toScrollTop = (distance: number) => offset + distance;

  await step("Shows the full form at the top", async () => {
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

  const spaceGivenBack = () => fullHeight - collapsedHeight;

  await step("Keeps the full form at S + 7", async () => {
    await scrollInFrames(
      scroller,
      toScrollTop(Math.floor(spaceGivenBack() + 7)),
      header
    );
    await expectFormKept(header, false);
  });

  await step(
    "Collapses after the pause at S + 9, and the content stays still",
    async () => {
      await scrollInFrames(
        scroller,
        toScrollTop(Math.ceil(spaceGivenBack() + 9)),
        header
      );
      const before = reference.getBoundingClientRect().top;
      await waitForForm(header, true);
      await nextFrame();
      const after = reference.getBoundingClientRect().top;
      await expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
    }
  );

  await step(
    "Keeps the collapsed form while scrolling down and back up",
    async () => {
      await scrollInFrames(
        scroller,
        toScrollTop(spaceGivenBack() + 150),
        header,
        20
      );
      await scrollInFrames(scroller, toScrollTop(2), header, 20);
      await expectFormKept(header, true);
    }
  );

  await step("Returns to the full form at the top", async () => {
    await scrollInFrames(scroller, 0, header);
    await waitForForm(header, false);
    await waitFor(() =>
      expect(getHeightVariable(root)).toBe(`${fullHeight}px`)
    );
    scroller.scrollTop = 0;
  });
};

/** A header with every DefaultPage part. */
const CollapsingHeader = ({ withTabs = true }: { withTabs?: boolean }) => (
  <DefaultPage.Header>
    <DefaultPage.BackLink href="/products">
      Back to products
    </DefaultPage.BackLink>
    <DefaultPage.Title>
      Classic T-Shirt, organic cotton, crew neck
    </DefaultPage.Title>
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
 * Constrained layout (default) with `collapseHeaderOnScroll`. The content
 * scrolls inside `DefaultPage.Content`, and the header collapses once the
 * content has scrolled a little more than the space the header gives back.
 * It returns to its full form at the top.
 */
export const CollapseHeaderConstrained: Story = {
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

      // Same heading element, smaller, on one line.
      await expect(canvas.getByRole("heading", { level: 1 })).toBe(heading);
      await expect(header.tagName).toBe("HEADER");
      const titleStyle = getComputedStyle(heading);
      await expect(parseFloat(titleStyle.fontSize)).toBeLessThan(fullFontSize);
      await expect(titleStyle.whiteSpace).toBe("nowrap");
      await expect(titleStyle.textOverflow).toBe("ellipsis");

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
 * The collapsed header, for visual regression: constrained layout with every
 * header part, scrolled until the header collapses. This story ends scrolled,
 * because a collapsed header exists only away from the top. The scroll
 * position belongs to the story's own content element, so it does not leak
 * into other stories.
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

    await step("Scrolls until the header collapses", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForForm(header, true);
    });
  },
};

/**
 * Flexible layout with `stickyHeader` and `collapseHeaderOnScroll`, with the
 * scroll container at the top of the window.
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
    await runCollapseChecks({
      step,
      root: getRoot(canvasElement),
      header: getHeader(canvasElement),
      scroller: canvas.getByTestId("scroll-container"),
      reference: canvas.getByLabelText("Field 8"),
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
    const canvas = within(canvasElement);
    const scroller = canvasElement.ownerDocument
      .scrollingElement as HTMLElement;
    try {
      await runCollapseChecks({
        step,
        root: getRoot(canvasElement),
        header: getHeader(canvasElement),
        scroller,
        reference: canvas.getByLabelText("Field 8"),
      });
    } finally {
      scroller.scrollTop = 0;
    }
  },
};

/**
 * Constrained layout in a narrow container with every header part. In the
 * collapsed form the title ends with an ellipsis, and the actions stay on the
 * title row.
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

    await runCollapseChecks({
      step,
      root: getRoot(canvasElement),
      header,
      scroller: content,
      reference: canvas.getByLabelText("Field 8"),
    });

    await step(
      "Title ends with an ellipsis; actions stay on the title row",
      async () => {
        content.scrollTop = 400;
        await waitForForm(header, true);
        const heading = canvas.getByRole("heading", { level: 1 });
        await expect(heading.scrollWidth).toBeGreaterThan(heading.clientWidth);
        await expect(getComputedStyle(heading).textOverflow).toBe("ellipsis");

        const titleRect = heading.getBoundingClientRect();
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
        await waitForForm(header, false);
      }
    );
  },
};

/**
 * Page-owned content in the header keeps its grid column in both forms. A
 * page can adapt its own header content with the scoped selector
 * `.nimbus-default-page__header[data-collapsed] &`: here the "Draft" note is
 * hidden in the collapsed form.
 */
export const CollapseHeaderCustomContent: Story = {
  render: () => (
    <Box height="500px">
      <DefaultPage.Root collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.Title>Spring campaign</DefaultPage.Title>
          <DefaultPage.Subtitle>Runs from March to May</DefaultPage.Subtitle>
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
            css={{
              ".nimbus-default-page__header[data-collapsed] &": {
                display: "none",
              },
            }}
          >
            Draft, not visible to customers
          </Text>
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

    await runCollapseChecks({
      step,
      root: getRoot(canvasElement),
      header,
      scroller: content,
      reference: canvas.getByLabelText("Field 8"),
    });

    await step("Page-owned content keeps its grid column", async () => {
      const column1 = canvas.getByTestId("column-1-badge");
      const column2 = canvas.getByTestId("column-2-badge");
      const fullLeft = column1.getBoundingClientRect().left;
      const fullRight = column2.getBoundingClientRect().right;

      content.scrollTop = 400;
      await waitForForm(header, true);

      await expect(column1).toBeVisible();
      await expect(column2).toBeVisible();
      await expect(
        Math.abs(column1.getBoundingClientRect().left - fullLeft)
      ).toBeLessThanOrEqual(1);
      await expect(
        Math.abs(column2.getBoundingClientRect().right - fullRight)
      ).toBeLessThanOrEqual(1);
      await expect(canvas.getByTestId("full-form-note")).not.toBeVisible();

      content.scrollTop = 0;
      await waitForForm(header, false);
      await expect(canvas.getByTestId("full-form-note")).toBeVisible();
    });
  },
};

/**
 * Content that only just overflows. The header does not flip back and forth
 * at the bottom of the content, and measuring the collapsed height on a page
 * scrolled to the bottom does not move the content.
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

    await step(
      "Measuring at the bottom does not move the content",
      async () => {
        await waitFor(() =>
          expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
        );
        // Keep the scroll range below the collapse point, so the header stays
        // in its full form at the bottom.
        const spacer = canvas.getByTestId("short-content");
        spacer.style.height = `${320 - (content.scrollHeight - content.clientHeight) + 20}px`;
        await nextFrame();
        content.scrollTop = content.scrollHeight;
        await expectFormKept(header, false);
        const scrollTop = content.scrollTop;
        const markerTop = marker.getBoundingClientRect().top;

        // A width change of the header runs the measurement again.
        header.style.marginInlineEnd = "40px";
        await nextFrame();
        await nextFrame();
        await expect(content.scrollTop).toBe(scrollTop);
        await expect(marker.getBoundingClientRect().top).toBe(markerTop);
        header.style.marginInlineEnd = "";
        content.scrollTop = 0;
        spacer.style.height = "";
        await nextFrame();
      }
    );

    await step("Collapses at the bottom without flipping back", async () => {
      const spacer = canvas.getByTestId("short-content");
      const fullHeight = header.getBoundingClientRect().height;
      // Overflow by 60px more than the full header height, so the header can
      // collapse but the content only just overflows.
      spacer.style.height = `${320 - (content.scrollHeight - content.clientHeight) + fullHeight + 60}px`;
      await nextFrame();
      content.scrollTop = content.scrollHeight;
      await waitForForm(header, true);
      await expectFormKept(header, true);
      await expect(content.scrollTop).toBeGreaterThanOrEqual(1);

      content.scrollTop = 0;
      await waitForForm(header, false);
      spacer.style.height = "";
    });
  },
};

/**
 * A tab click that resets the scroll position while the mouse pointer is over
 * the header. The header keeps its collapsed form until the pointer leaves,
 * so the tabs do not move under the pointer.
 */
export const CollapseHeaderTabClick: Story = {
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
 * `collapseHeaderOnScroll` switched off at runtime while the header is
 * collapsed: the header returns to its full form, without `data-collapsed`
 * and without the header height variable.
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

    await step("Collapses after scrolling", async () => {
      await waitFor(() =>
        expect(content.scrollHeight).toBeGreaterThan(content.clientHeight)
      );
      content.scrollTop = 400;
      await waitForForm(header, true);
      await expect(getHeightVariable(root)).not.toBe("");
    });

    await step("Returns to the full form when switched off", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Turn off collapsing" })
      );
      await waitForForm(header, false);
      await expect(getHeightVariable(root)).toBe("");
      content.scrollTop = 300;
      await expectFormKept(header, false);
    });

    await step("Collapses again when switched on while scrolled", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Turn on collapsing" })
      );
      await waitForForm(header, true);
      content.scrollTop = 0;
      await waitForForm(header, false);
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
      await waitForForm(header, true);
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
      await waitForForm(header, false);
      await userEvent.tab();
      await expect(getBackLink()).toHaveFocus();
      await wait(400);
      await expect(getTooltip()).toBeNull();
      getBackLink().blur();
    });
  },
};

/**
 * Smooth scrolls reach their target, and a jump collapses the header without
 * a correction. The target field uses the header height variable as
 * `scroll-margin-top`, so it stops below the sticky header.
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

    await step("A smooth scroll reaches its target", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      // Where the scroll must end: the target below the full header (its
      // `scroll-margin-top`).
      const fullHeight = header.getBoundingClientRect().height;
      const targetScrollTop =
        scroller.scrollTop +
        target.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top -
        fullHeight;

      // Record the scroll position of every scroll event before the collapse.
      const positions: number[] = [];
      const record = () => {
        if (!header.hasAttribute("data-collapsed")) {
          positions.push(scroller.scrollTop);
        }
      };
      scroller.addEventListener("scroll", record);
      try {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        await waitForForm(header, true);
      } finally {
        scroller.removeEventListener("scroll", record);
      }

      // The scroll was not stopped early: its last position before the
      // collapse is the target.
      await expect(positions.length).toBeGreaterThan(1);
      await expect(
        Math.abs(positions[positions.length - 1] - targetScrollTop)
      ).toBeLessThanOrEqual(1);
    });

    await step(
      "After a jump, the target ends directly below the collapsed header",
      async () => {
        scroller.scrollTop = 0;
        await waitForForm(header, false);
        target.scrollIntoView({ block: "start" });
        await waitForForm(header, true);
        await nextFrame();
        await expect(
          Math.abs(
            target.getBoundingClientRect().top -
              header.getBoundingClientRect().bottom
          )
        ).toBeLessThanOrEqual(1);
        scroller.scrollTop = 0;
        await waitForForm(header, false);
      }
    );
  },
};

/**
 * Content above Root in the same scrolling element. When the header returns
 * to its full form at the top, the content starts directly below the full
 * header, and the content above Root does not move.
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
    const header = getHeader(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const appBar = canvas.getByTestId("app-bar");
    const content = canvas.getByRole("main");

    await step("Collapses once the header is pinned", async () => {
      await waitFor(() =>
        expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight)
      );
      scroller.scrollTop = 700;
      await waitForForm(header, true);
    });

    await step(
      "At the top of the page, the header returns to its full form",
      async () => {
        await scrollInFrames(scroller, 60, header, 40);
        const appBarTop = appBar.getBoundingClientRect().top;
        await waitForForm(header, false);
        await nextFrame();
        await expect(scroller.scrollTop).toBe(60);
        await expect(appBar.getBoundingClientRect().top).toBe(appBarTop);
        await expect(
          Math.abs(
            content.getBoundingClientRect().top -
              header.getBoundingClientRect().bottom
          )
        ).toBeLessThanOrEqual(1);
        scroller.scrollTop = 0;
      }
    );
  },
};

/**
 * Reduced motion. A play function cannot fake `prefers-reduced-motion`, so
 * this story checks that the compiled stylesheet ships the reduced-motion
 * rule that removes the fade, and that the header still changes form.
 * Verify the visual behavior by turning on "Reduce motion" in the OS.
 */
export const CollapseHeaderReducedMotion: Story = {
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
