import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, expect, userEvent, waitFor } from "storybook/test";
import { useState } from "react";
import {
  COLLAPSE_HEADER_PAUSE_MS,
  useCollapseHeaderOnScroll,
} from "./hooks/use-collapse-header-on-scroll";
import { measureCollapsedHeaderHeight } from "./utils/measure-collapsed-header-height";
import { getScrollDistance } from "./utils/get-scroll-distance";
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
// COLLAPSE HEADER — Hidden-copy measurement (task 2.3)
// ============================================================

const waitForPause = () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, COLLAPSE_HEADER_PAUSE_MS + 30);
  });

const CollapseHeaderMeasurementFixture = () => {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [header, setHeader] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<HTMLElement | null>(null);
  const { form } = useCollapseHeaderOnScroll({
    enabled: true,
    header,
    content,
    root,
  });

  return (
    <Box>
      <style>
        {`
          .nimbus-collapse-header-measurement__header {
            padding: 40px 24px;
            background: Canvas;
          }
          .nimbus-collapse-header-measurement__header[data-collapsed="true"] {
            padding: 8px 24px;
          }
        `}
      </style>
      <Box
        ref={setRoot}
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
        position="relative"
      >
        <Box
          ref={setHeader}
          className="nimbus-collapse-header-measurement__header"
          data-collapsed={form === "collapsed" ? "true" : undefined}
        >
          <Text fontSize="500" fontWeight="600">
            Measurement page
          </Text>
          <Text>Subtitle that disappears in the collapsed form</Text>
        </Box>
        <Box
          ref={setContent}
          data-measurement-content=""
          height="240px"
          overflow="auto"
          p="400"
          tabIndex={0}
        >
          <Box height="800px">
            <Text>Long content used to produce a scroll distance.</Text>
          </Box>
        </Box>
      </Box>
      <Box
        data-short-page=""
        mt="400"
        height="160px"
        overflow="auto"
        border="solid-25"
        borderColor="neutral.6"
        position="relative"
        tabIndex={0}
      >
        <Box data-short-header="" p="800">
          <Text>Short page header</Text>
        </Box>
        <Box data-short-content="" height="80px" overflow="auto" tabIndex={0}>
          <Box height="120px">
            <Text>Short page content</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Measures the collapsed height on a hidden copy and checks the collapse
 * thresholds derived from the space given back.
 */
export const CollapseHeaderMeasurement: Story = {
  render: () => <CollapseHeaderMeasurementFixture />,
  play: async ({ canvasElement, step }) => {
    const root = canvasElement.querySelector(
      ".nimbus-collapse-header-measurement__header"
    )?.parentElement as HTMLElement;
    const header = canvasElement.querySelector(
      ".nimbus-collapse-header-measurement__header"
    ) as HTMLElement;
    const content = root.querySelector(
      "[data-measurement-content]"
    ) as HTMLElement;

    const fullHeight = header.getBoundingClientRect().height;
    const collapsedHeight = measureCollapsedHeaderHeight(header, root);
    const spaceGivenBack = fullHeight - collapsedHeight;

    await step("Hidden copy is shorter than the live header", async () => {
      await expect(spaceGivenBack).toBeGreaterThan(0);
    });

    await step("A distance of S + 7 keeps the full form", async () => {
      content.scrollTop = spaceGivenBack + 7;
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
      await waitFor(() => expect(content.scrollTop).toBe(spaceGivenBack + 7));
      await waitForPause();
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    await step("A distance of S + 9 collapses after the pause", async () => {
      content.scrollTop = spaceGivenBack + 9;
      content.dispatchEvent(new Event("scroll", { bubbles: true }));
      await waitFor(() => expect(content.scrollTop).toBe(spaceGivenBack + 9));
      await expect(header).not.toHaveAttribute("data-collapsed");
      await waitForPause();
      await expect(header).toHaveAttribute("data-collapsed", "true");
    });

    await step(
      "Measuring on a short page scrolled to the bottom does not move the content",
      async () => {
        const shortRoot = canvasElement.querySelector(
          "[data-short-page]"
        ) as HTMLElement;
        const shortHeader = shortRoot.querySelector(
          "[data-short-header]"
        ) as HTMLElement;
        const shortContent = shortRoot.querySelector(
          "[data-short-content]"
        ) as HTMLElement;
        shortContent.scrollTop = shortContent.scrollHeight;
        const scrollTopBefore = shortContent.scrollTop;
        measureCollapsedHeaderHeight(shortHeader, shortRoot);
        await expect(shortContent.scrollTop).toBe(scrollTopBefore);
      }
    );

    content.scrollTop = 0;
  },
};

const scrollByFrames = (scroller: HTMLElement, distance: number, stepPx = 10) =>
  new Promise<void>((resolve) => {
    const tick = () => {
      const remaining = distance - scroller.scrollTop;
      if (remaining <= 0) {
        resolve();
        return;
      }
      scroller.scrollTop += Math.min(stepPx, remaining);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

const LongRows = ({ count = 24 }: { count?: number }) => (
  <Stack gap="600">
    {Array.from({ length: count }, (_, index) => (
      <Text key={index}>Row {index + 1}</Text>
    ))}
  </Stack>
);

const spaceGivenBack = (header: HTMLElement, root: HTMLElement) =>
  header.getBoundingClientRect().height -
  measureCollapsedHeaderHeight(header, root);

const publishedHeaderHeight = (root: HTMLElement) =>
  getComputedStyle(root)
    .getPropertyValue("--default-page-header-height")
    .trim();

const syncDistance = (
  scroller: HTMLElement,
  header: HTMLElement,
  content: HTMLElement,
  target: number
) => {
  scroller.scrollTop = Math.max(0, target);
  if (scroller !== content) {
    const measured = getScrollDistance(header, content);
    scroller.scrollTop = Math.max(0, scroller.scrollTop + (target - measured));
  }
  scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
};

const playCollapseSequence = async ({
  step,
  scroller,
  header,
  content,
  root,
}: {
  step: (name: string, body: () => Promise<void>) => void | Promise<void>;
  scroller: HTMLElement;
  header: HTMLElement;
  content: HTMLElement;
  root: HTMLElement;
}) => {
  const thresholdSpace = spaceGivenBack(header, root);
  await expect(thresholdSpace).toBeGreaterThan(0);
  header.dispatchEvent(new Event("pointerleave"));

  await step("Full form at 0", async () => {
    syncDistance(scroller, header, content, 0);
    await waitForPause();
    await expect(header).not.toHaveAttribute("data-collapsed");
  });

  await step("No change while scrolling toward the threshold", async () => {
    await scrollByFrames(
      scroller,
      Math.max(10, Math.floor(thresholdSpace / 2))
    );
    await expect(header).not.toHaveAttribute("data-collapsed");
  });

  await step("Kept form between the two points", async () => {
    syncDistance(scroller, header, content, thresholdSpace + 7);
    await waitForPause();
    await expect(header).not.toHaveAttribute("data-collapsed");
  });

  await step("Collapsed form after the pause past the threshold", async () => {
    await scrollByFrames(scroller, thresholdSpace + 9);
    await expect(header).not.toHaveAttribute("data-collapsed");
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");
  });

  await step("Kept form while scrolling up within the range", async () => {
    syncDistance(
      scroller,
      header,
      content,
      Math.max(2, Math.floor(thresholdSpace / 2))
    );
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");
  });

  await step("Full form back at the top", async () => {
    syncDistance(scroller, header, content, 0);
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).not.toHaveAttribute("data-collapsed");
  });

  scroller.scrollTop = 0;
};

/**
 * Flexible layout + stickyHeader, with the scroll container 200px below the
 * top of the window. Scrolls 10px per frame and expects the header to
 * collapse only after the pause.
 */
export const CollapseHeaderFlexibleOffset: Story = {
  render: () => (
    <Box>
      <Box height="200px" p="400">
        <Text>App bar above the page</Text>
      </Box>
      <Box
        data-testid="scroll-container"
        height="400px"
        overflow="auto"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
          <DefaultPage.Header>
            <DefaultPage.Title>Offset scroll page</DefaultPage.Title>
            <DefaultPage.Subtitle>
              Header should collapse after scrolling pauses
            </DefaultPage.Subtitle>
            <DefaultPage.Actions>
              <Button colorPalette="primary" variant="solid">
                Save
              </Button>
            </DefaultPage.Actions>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Stack gap="600">
              {Array.from({ length: 20 }, (_, index) => (
                <Text key={index}>Row {index + 1}</Text>
              ))}
            </Stack>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </Box>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header");

    const publishedHeaderHeight = () =>
      getComputedStyle(header!.parentElement as HTMLElement)
        .getPropertyValue("--default-page-header-height")
        .trim();

    await step(
      "Scroll container starts 200px below the window top",
      async () => {
        await expect(header).toBeInTheDocument();
        await expect(Math.round(scroller.getBoundingClientRect().top)).toBe(
          200
        );
      }
    );

    await step("Variable matches the full header height", async () => {
      await expect(publishedHeaderHeight()).toBe(
        `${header!.getBoundingClientRect().height}px`
      );
    });

    await step("Header stays full while scrolling 10px per frame", async () => {
      await scrollByFrames(scroller, 120);
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    await step("Header collapses after the pause", async () => {
      await waitForPause();
      await expect(header).toHaveAttribute("data-collapsed", "true");
    });

    await step(
      "Root publishes the current header height after the first measurement",
      async () => {
        const pageRoot = header!.parentElement as HTMLElement;
        const published = getComputedStyle(pageRoot)
          .getPropertyValue("--default-page-header-height")
          .trim();
        await expect(published).toBe(
          `${header!.getBoundingClientRect().height}px`
        );
      }
    );

    scroller.scrollTop = 0;
  },
};

/**
 * Collapsed back link shows a tooltip with the label. The tooltip is off in
 * the full form, does not describe the link, and keeps the accessible name.
 */
export const CollapseHeaderBackLinkTooltip: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.BackLink href="/products">
            Back to products
          </DefaultPage.BackLink>
          <DefaultPage.Title>Product details</DefaultPage.Title>
          <DefaultPage.Subtitle>SKU-001</DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600">
            {Array.from({ length: 20 }, (_, index) => (
              <Text key={index}>Row {index + 1}</Text>
            ))}
          </Stack>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const overlayRoot =
      (canvasElement.parentNode as HTMLElement) ?? canvasElement;
    const link = canvas.getByRole("link", { name: "Back to products" });
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const tooltipNode = () =>
      overlayRoot.ownerDocument.querySelector("[role='tooltip']");

    await step("Full form has no tooltip", async () => {
      await userEvent.hover(link);
      await expect(tooltipNode()).toBeNull();
      await expect(link).not.toHaveAttribute("aria-describedby");
      await expect(link).toHaveAccessibleName("Back to products");
      await userEvent.unhover(link);
      header.dispatchEvent(new Event("pointerleave"));
    });

    await step("Header collapses after the pause", async () => {
      await scrollByFrames(scroller, 200);
      header.dispatchEvent(new Event("pointerleave"));
      await waitForPause();
      if (header.getAttribute("data-collapsed") !== "true") {
        throw new Error(
          `header-did-not-collapse scrollTop=${scroller.scrollTop}`
        );
      }
    });

    await step("Hover shows the label in the collapsed form", async () => {
      await userEvent.hover(link);
      const tooltip = await waitFor(() => {
        const node = tooltipNode();
        if (!node) {
          throw new Error("collapsed-hover-tooltip-missing");
        }
        return node as HTMLElement;
      });
      await expect(tooltip).toHaveTextContent("Back to products");
      await expect(
        tooltip.querySelector("[aria-hidden='true']")
      ).toHaveTextContent("Back to products");
      await expect(link).not.toHaveAttribute("aria-describedby");
      await expect(link).toHaveAccessibleName("Back to products");
      await userEvent.unhover(link);
    });

    await step("Keyboard focus shows the same tooltip", async () => {
      if (link.ownerDocument.activeElement === link) {
        link.blur();
      }
      await userEvent.tab();
      const tooltip = await waitFor(() => {
        const node = tooltipNode();
        if (!node) {
          throw new Error("collapsed-focus-tooltip-missing");
        }
        return node as HTMLElement;
      });
      await expect(tooltip).toHaveTextContent("Back to products");
      await expect(link).not.toHaveAttribute("aria-describedby");
      await expect(link).toHaveAccessibleName("Back to products");
      link.blur();
    });

    scroller.scrollTop = 0;
  },
};

/**
 * After a scroll pause, collapsing the header must not move the content
 * on screen. A jump larger than the space given back is not corrected.
 */
export const CollapseHeaderScrollCorrection: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.Title>Scroll correction page</DefaultPage.Title>
          <DefaultPage.Subtitle>
            Marker text used to check the screen position
          </DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600">
            {Array.from({ length: 24 }, (_, index) => (
              <Text key={index} data-row={index + 1}>
                Row {index + 1}
              </Text>
            ))}
          </Stack>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const marker = canvas.getByText("Row 8");

    await step(
      "Content stays still, within 1px, when the header collapses",
      async () => {
        await scrollByFrames(scroller, 200);
        const before = marker.getBoundingClientRect().top;
        header.dispatchEvent(new Event("pointerleave"));
        await waitForPause();
        await expect(header).toHaveAttribute("data-collapsed", "true");
        const after = marker.getBoundingClientRect().top;
        await expect(Math.abs(after - before)).toBeLessThanOrEqual(1);
      }
    );

    await step(
      "scrollIntoView with smooth behavior reaches its target",
      async () => {
        const target = canvas.getByText("Row 22");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        await waitFor(() => {
          const rect = target.getBoundingClientRect();
          const port = scroller.getBoundingClientRect();
          expect(rect.bottom).toBeGreaterThan(port.top);
          expect(rect.top).toBeLessThan(port.bottom);
        });
      }
    );

    await step(
      "A jump larger than the space given back is not corrected",
      async () => {
        scroller.scrollTop = 0;
        header.dispatchEvent(new Event("pointerleave"));
        await waitForPause();
        await expect(header).not.toHaveAttribute("data-collapsed");

        const target = canvas.getByText("Row 20");
        scroller.scrollTop = 800;
        scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
        await waitForPause();
        await expect(header).toHaveAttribute("data-collapsed", "true");
        const headerBottom = header.getBoundingClientRect().bottom;
        await expect(target.getBoundingClientRect().top).toBeGreaterThanOrEqual(
          headerBottom - 1
        );
      }
    );

    scroller.scrollTop = 0;
  },
};

/**
 * Returning to the top puts the content directly below the full header,
 * including when content sits above Root in the same scroller.
 */
export const CollapseHeaderRestoreAtTop: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <Box data-testid="above-root" p="400">
        <Text>Content above the page</Text>
      </Box>
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.Title>Restore at top</DefaultPage.Title>
          <DefaultPage.Subtitle>Full header again</DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Stack gap="600">
            {Array.from({ length: 20 }, (_, index) => (
              <Text key={index}>Row {index + 1}</Text>
            ))}
          </Stack>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const above = canvas.getByTestId("above-root");
    const firstRow = canvas.getByText("Row 1");

    await scrollByFrames(scroller, 200);
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");

    scroller.scrollTop = 0;
    scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
    const aboveTopBeforeExpand = above.getBoundingClientRect().top;
    await waitForPause();

    await step("Content starts directly below the full header", async () => {
      await expect(header).not.toHaveAttribute("data-collapsed");
      const gap =
        firstRow.getBoundingClientRect().top -
        header.getBoundingClientRect().bottom;
      await expect(gap).toBeGreaterThanOrEqual(-1);
    });

    await step("Content above Root does not move", async () => {
      await expect(
        Math.abs(above.getBoundingClientRect().top - aboveTopBeforeExpand)
      ).toBeLessThanOrEqual(1);
    });

    scroller.scrollTop = 0;
  },
};

const collapsePageParts = (
  title: string,
  extra?: { backLink?: boolean; tabs?: boolean; actions?: boolean }
) => (
  <>
    <DefaultPage.Header>
      {extra?.backLink ? (
        <DefaultPage.BackLink href="/products">
          Back to products
        </DefaultPage.BackLink>
      ) : null}
      <DefaultPage.Title>{title}</DefaultPage.Title>
      <DefaultPage.Subtitle>Collapse header on scroll</DefaultPage.Subtitle>
      {extra?.actions === false ? null : (
        <DefaultPage.Actions>
          <Button colorPalette="primary" variant="solid">
            Save
          </Button>
        </DefaultPage.Actions>
      )}
      {extra?.tabs ? (
        <DefaultPage.TabNav>
          <TabNav.Root aria-label="Sections">
            <TabNav.Item href="#collapse-tab-top" isCurrent>
              General
            </TabNav.Item>
            <TabNav.Item href="#collapse-tab-more">More</TabNav.Item>
          </TabNav.Root>
        </DefaultPage.TabNav>
      ) : null}
    </DefaultPage.Header>
    <DefaultPage.Content>
      <Box id="collapse-tab-top" />
      <LongRows />
    </DefaultPage.Content>
  </>
);

/**
 * Constrained layout: Content is the scroller.
 */
export const CollapseHeaderConstrained: Story = {
  render: () => (
    <Box
      height="400px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root collapseHeaderOnScroll>
        {collapsePageParts("Constrained page")}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    await playCollapseSequence({
      step,
      scroller: content,
      header,
      content,
      root,
    });
  },
};

/**
 * Flexible + stickyHeader, scroll container at the top of the window.
 */
export const CollapseHeaderFlexibleTop: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("Flexible top page")}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    await expect(Math.round(scroller.getBoundingClientRect().top)).toBeLessThan(
      8
    );
    await playCollapseSequence({
      step,
      scroller,
      header,
      content,
      root,
    });
  },
};

/**
 * The document itself is the scrolling element.
 */
export const CollapseHeaderDocumentScroll: Story = {
  render: () => (
    <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
      {collapsePageParts("Document scroll page")}
    </DefaultPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    const scroller = (canvasElement.ownerDocument.scrollingElement ??
      canvasElement.ownerDocument.documentElement) as HTMLElement;
    await playCollapseSequence({
      step,
      scroller,
      header,
      content,
      root,
    });
    scroller.scrollTop = 0;
  },
};

/**
 * Content that only just overflows still reaches the collapse threshold.
 */
export const CollapseHeaderJustOverflows: Story = {
  render: () => (
    <Box
      height="280px"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.Title>Just overflowing</DefaultPage.Title>
          <DefaultPage.Subtitle>Short extra space</DefaultPage.Subtitle>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <Box height="220px">
            <Text>Only just enough content to scroll past the threshold.</Text>
          </Box>
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    const overflow = content.scrollHeight - content.clientHeight;
    const thresholdSpace = spaceGivenBack(header, root);
    await expect(overflow).toBeGreaterThan(thresholdSpace + 9);
    await playCollapseSequence({
      step,
      scroller: content,
      header,
      content,
      root,
    });
  },
};

/**
 * Narrow page with every header part.
 */
export const CollapseHeaderNarrowAllParts: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      width="280px"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("A very long product title that must ellipsis", {
          backLink: true,
          tabs: true,
        })}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    await playCollapseSequence({
      step,
      scroller,
      header,
      content,
      root,
    });
  },
};

/**
 * Page-owned header content keeps its grid column when the header collapses.
 */
export const CollapseHeaderOwnedContent: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        <DefaultPage.Header>
          <DefaultPage.Title>Owned content page</DefaultPage.Title>
          <DefaultPage.Subtitle>Custom badge stays put</DefaultPage.Subtitle>
          <Badge
            data-testid="owned-header-item"
            gridColumn="1"
            justifySelf="flex-start"
            colorPalette="info"
            size="xs"
          >
            Owned
          </Badge>
          <DefaultPage.Actions>
            <Button colorPalette="primary" variant="solid">
              Save
            </Button>
          </DefaultPage.Actions>
        </DefaultPage.Header>
        <DefaultPage.Content>
          <LongRows />
        </DefaultPage.Content>
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    const owned = canvas.getByTestId("owned-header-item");
    const leftBefore = owned.getBoundingClientRect().left;

    await playCollapseSequence({
      step,
      scroller,
      header,
      content,
      root,
    });

    await step("Owned content keeps its column after a collapse", async () => {
      syncDistance(
        scroller,
        header,
        content,
        spaceGivenBack(header, root) + 20
      );
      header.dispatchEvent(new Event("pointerleave"));
      await waitForPause();
      await expect(header).toHaveAttribute("data-collapsed", "true");
      await expect(
        Math.abs(owned.getBoundingClientRect().left - leftBefore)
      ).toBeLessThanOrEqual(2);
      scroller.scrollTop = 0;
    });
  },
};

/**
 * A tab click that resets scroll while the pointer is over the header
 * does not change form until the pointer leaves.
 */
export const CollapseHeaderTabHold: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("Tab hold page", { tabs: true })}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const tab = canvas.getByRole("link", { name: "General" });

    await scrollByFrames(scroller, spaceGivenBack(header, root) + 20);
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");

    await step("Tab click while over the header holds the form", async () => {
      header.dispatchEvent(new Event("pointerenter"));
      await userEvent.click(tab);
      scroller.scrollTop = 0;
      scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
      await waitForPause();
      await expect(header).toHaveAttribute("data-collapsed", "true");
    });

    await step("Form updates when the pointer leaves", async () => {
      header.dispatchEvent(new Event("pointerleave"));
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    scroller.scrollTop = 0;
  },
};

const CollapseHeaderRuntimeOffFixture = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <Box>
      <Button data-testid="disable-collapse" onPress={() => setEnabled(false)}>
        Disable collapse
      </Button>
      <Box
        data-testid="scroll-container"
        height="400px"
        overflow="auto"
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <DefaultPage.Root
          layout="flexible"
          stickyHeader
          collapseHeaderOnScroll={enabled}
        >
          {collapsePageParts("Runtime off page")}
        </DefaultPage.Root>
      </Box>
    </Box>
  );
};

/**
 * Switching the option off at runtime returns the full form and clears
 * the height variable.
 */
export const CollapseHeaderRuntimeOff: Story = {
  render: () => <CollapseHeaderRuntimeOffFixture />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;

    await scrollByFrames(scroller, spaceGivenBack(header, root) + 20);
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");

    await step("Option off restores the full form", async () => {
      await userEvent.click(canvas.getByTestId("disable-collapse"));
      await waitFor(() => expect(header).not.toHaveAttribute("data-collapsed"));
      await expect(publishedHeaderHeight(root)).toBe("");
    });

    scroller.scrollTop = 0;
  },
};

/**
 * Flexible without stickyHeader stays in the full form and warns in
 * development.
 */
export const CollapseHeaderFlexibleUnpinned: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" collapseHeaderOnScroll>
        {collapsePageParts("Unpinned page")}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;

    await step("Full form when the header is not pinned", async () => {
      await scrollByFrames(scroller, 200);
      await waitForPause();
      await expect(header).not.toHaveAttribute("data-collapsed");
    });

    scroller.scrollTop = 0;
  },
};

/**
 * Option off: no collapsed attribute and no height variable.
 */
export const CollapseHeaderOptionOff: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader>
        {collapsePageParts("Option off page")}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;

    await step("No collapsed state and no variable", async () => {
      await scrollByFrames(scroller, 200);
      await waitForPause();
      await expect(header).not.toHaveAttribute("data-collapsed");
      await expect(publishedHeaderHeight(root)).toBe("");
    });

    scroller.scrollTop = 0;
  },
};

/**
 * Collapsed header surface for Chromatic.
 */
export const CollapseHeaderCollapsedVrt: Story = {
  // VRT: collapsed header padding, title, and hidden subtitle.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("Collapsed snapshot", { backLink: true })}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    await scrollByFrames(scroller, spaceGivenBack(header, root) + 20);
    header.dispatchEvent(new Event("pointerleave"));
    await waitForPause();
    await expect(header).toHaveAttribute("data-collapsed", "true");
  },
};

/**
 * Header structure, names, focus, and target size stay across both forms.
 */
export const CollapseHeaderAccessibility: Story = {
  tags: ["a11y-test"],
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("Accessibility page", {
          backLink: true,
          tabs: true,
        })}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;
    const title = canvas.getByRole("heading", { level: 1 });
    const backLink = canvas.getByRole("link", { name: "Back to products" });
    const save = canvas.getByRole("button", { name: "Save" });
    const collapse = async () => {
      header.dispatchEvent(new Event("pointerleave"));
      syncDistance(
        scroller,
        header,
        content,
        spaceGivenBack(header, root) + 20
      );
      await waitForPause();
    };

    await step("Same h1 and header parts stay after collapse", async () => {
      await collapse();
      await expect(header).toHaveAttribute("data-collapsed", "true");
      await expect(canvas.getByRole("heading", { level: 1 })).toBe(title);
      await expect(header.tagName.toLowerCase()).toBe("header");
      await expect(backLink).toBeInTheDocument();
      await expect(
        canvas.getByText("Collapse header on scroll")
      ).toBeInTheDocument();
      await expect(save).toBeInTheDocument();
      await expect(
        canvas.getByRole("navigation", { name: "Sections" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "General" })
      ).toBeInTheDocument();
    });

    await step(
      "Focus stays on a header control when the form changes",
      async () => {
        syncDistance(scroller, header, content, 0);
        header.dispatchEvent(new Event("pointerleave"));
        await waitForPause();
        save.focus();
        await expect(save).toHaveFocus();
        await collapse();
        await expect(header).toHaveAttribute("data-collapsed", "true");
        await expect(save).toHaveFocus();
      }
    );

    await step(
      "Back link name, target, and subtitle stay available",
      async () => {
        await expect(backLink).toHaveAccessibleName("Back to products");
        const box = backLink.getBoundingClientRect();
        await expect(box.width).toBeGreaterThanOrEqual(24);
        await expect(box.height).toBeGreaterThanOrEqual(24);
        await expect(
          canvas.getByText("Collapse header on scroll")
        ).toBeInTheDocument();
        await expect(
          canvas.getByText("Collapse header on scroll")
        ).not.toHaveAttribute("aria-hidden");
      }
    );

    await step(
      "Accessible name after the fade back to the full form",
      async () => {
        syncDistance(scroller, header, content, 0);
        header.dispatchEvent(new Event("pointerleave"));
        await waitForPause();
        await new Promise((resolve) => {
          window.setTimeout(resolve, COLLAPSE_HEADER_PAUSE_MS);
        });
        await expect(header).not.toHaveAttribute("data-collapsed");
        await expect(backLink).toHaveAccessibleName("Back to products");
      }
    );

    scroller.scrollTop = 0;
  },
};

/**
 * Reduced motion cannot be faked from a play function. Assert the compiled
 * `_motionReduce` fade rule and that the header still changes form.
 */
export const CollapseHeaderReducedMotion: Story = {
  render: () => (
    <Box
      data-testid="scroll-container"
      height="400px"
      overflow="auto"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <DefaultPage.Root layout="flexible" stickyHeader collapseHeaderOnScroll>
        {collapsePageParts("Reduced motion page", { backLink: true })}
      </DefaultPage.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvas.getByTestId("scroll-container");
    const header = canvasElement.querySelector("header")!;
    const root = header.parentElement as HTMLElement;
    const content = root.querySelector("main") as HTMLElement;

    await step("Ships a prefers-reduced-motion rule for the fade", async () => {
      const hashed = Array.from(header.classList).find((className) =>
        className.startsWith("css-")
      );
      await expect(hashed).toBeTruthy();

      const hasReducedMotionRule = Array.from(document.styleSheets).some(
        (sheet) => {
          let rules: CSSRule[];
          try {
            rules = Array.from(sheet.cssRules);
          } catch {
            return false;
          }
          return rules.some(
            (rule) =>
              rule.cssText.includes("prefers-reduced-motion") &&
              rule.cssText.includes(`.${hashed}`)
          );
        }
      );
      await expect(hasReducedMotionRule).toBe(true);
    });

    await step("Header still changes form", async () => {
      header.dispatchEvent(new Event("pointerleave"));
      syncDistance(
        scroller,
        header,
        content,
        spaceGivenBack(header, root) + 20
      );
      await waitForPause();
      await expect(header).toHaveAttribute("data-collapsed", "true");
    });

    scroller.scrollTop = 0;
  },
};
