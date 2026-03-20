import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  DataTable,
  FormField,
  MainPage,
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
import { within, expect } from "storybook/test";
import { useState } from "react";

const meta: Meta<typeof MainPage.Root> = {
  title: "Patterns/pages/MainPage",
  component: MainPage.Root,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MainPage.Root>;

/**
 * Minimal page with Root, Header, Title, and Content.
 * Tests semantic HTML structure and that Footer collapses when omitted.
 */
export const Base: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content>
        <Text>Page content goes here.</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Header renders as semantic <header>", async () => {
      await expect(canvas.getByRole("banner")).toBeInTheDocument();
    });

    await step("Title renders as <h1> with correct text", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Products"
      );
    });

    await step("Content renders as semantic <main>", async () => {
      await expect(canvas.getByRole("main")).toBeInTheDocument();
    });

    await step("Content children are rendered", async () => {
      await expect(
        canvas.getByText("Page content goes here.")
      ).toBeInTheDocument();
    });

    await step("Footer is absent when not composed", async () => {
      await expect(canvas.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  },
};

/**
 * Title with Subtitle renders heading and secondary text.
 */
export const TitleWithSubtitle: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
        <MainPage.Subtitle>Manage your product catalog</MainPage.Subtitle>
      </MainPage.Header>
      <MainPage.Content>
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title renders as <h1>", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Products"
      );
    });

    await step("Subtitle text is rendered", async () => {
      await expect(
        canvas.getByText("Manage your product catalog")
      ).toBeInTheDocument();
    });

    await step("Subtitle renders as a <p> element", async () => {
      const subtitle = canvas.getByText("Manage your product catalog");
      await expect(subtitle.tagName).toBe("P");
    });
  },
};

/**
 * Title without subtitle renders only the heading.
 */
export const TitleWithoutSubtitle: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Settings</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content>
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title renders as <h1>", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Settings"
      );
    });

    await step("No <p> subtitle element is rendered in header", async () => {
      const header = canvas.getByRole("banner");
      await expect(header.querySelector("p")).toBeNull();
    });
  },
};

/**
 * Actions renders buttons inside the header, positioned after the title.
 */
export const HeaderActions: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
        <MainPage.Actions>
          <Button variant="ghost">Export</Button>
          <Button>Add Product</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content>
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Action buttons are rendered", async () => {
      await expect(
        canvas.getByRole("button", { name: "Export" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Add Product" })
      ).toBeInTheDocument();
    });

    await step("Actions are inside the <header>", async () => {
      const header = canvas.getByRole("banner");
      await expect(
        within(header).getByRole("button", { name: "Export" })
      ).toBeInTheDocument();
      await expect(
        within(header).getByRole("button", { name: "Add Product" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Footer renders as semantic <footer> with children inside it.
 */
export const WithFooter: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Project Settings</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content>
        <Stack gap="400">
          <FormField.Root>
            <FormField.Label>Project name</FormField.Label>
            <FormField.Input>
              <TextInput placeholder="e.g. My Store" />
            </FormField.Input>
          </FormField.Root>
          <FormField.Root>
            <FormField.Label>Description</FormField.Label>
            <FormField.Input>
              <TextInput placeholder="Describe the project" />
            </FormField.Input>
          </FormField.Root>
        </Stack>
      </MainPage.Content>
      <MainPage.Footer>
        <Stack direction="row" gap="200" justify="flex-end" width="100%">
          <Button variant="ghost">Cancel</Button>
          <Button>Save</Button>
        </Stack>
      </MainPage.Footer>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Footer renders as semantic <footer>", async () => {
      await expect(canvas.getByRole("contentinfo")).toBeInTheDocument();
    });

    await step("Footer children are rendered inside <footer>", async () => {
      const footer = canvas.getByRole("contentinfo");
      await expect(
        within(footer).getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      await expect(
        within(footer).getByRole("button", { name: "Save" })
      ).toBeInTheDocument();
    });

    await step("Footer buttons are not in the header", async () => {
      const header = canvas.getByRole("banner");
      await expect(
        within(header).queryByRole("button", { name: "Save" })
      ).not.toBeInTheDocument();
    });
  },
};

type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  status: string;
};

const productColumns: DataTableColumnItem<Product>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "sku", header: "SKU", accessor: (row) => row.sku },
  { id: "price", header: "Price", accessor: (row) => row.price },
  { id: "status", header: "Status", accessor: (row) => row.status },
];

const productRows: Product[] = [
  {
    id: "1",
    name: "Classic T-Shirt",
    sku: "TSH-001",
    price: "€29.99",
    status: "Published",
  },
  {
    id: "2",
    name: "Denim Jacket",
    sku: "JKT-042",
    price: "€89.00",
    status: "Published",
  },
  {
    id: "3",
    name: "Running Shoes",
    sku: "SHO-118",
    price: "€119.50",
    status: "Draft",
  },
  {
    id: "4",
    name: "Canvas Backpack",
    sku: "BAG-007",
    price: "€45.00",
    status: "Published",
  },
  {
    id: "5",
    name: "Wool Beanie",
    sku: "HAT-023",
    price: "€18.99",
    status: "Draft",
  },
];

/**
 * Info page pattern - Header with Actions, Content with DataTable, no Footer.
 */
export const InfoPage: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
        <MainPage.Actions>
          <Button variant="ghost">Export</Button>
          <Button>Add Product</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content>
        <DataTable columns={productColumns} rows={productRows} />
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title is rendered", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Products"
      );
    });

    await step("Actions are rendered in header", async () => {
      const header = canvas.getByRole("banner");
      await expect(
        within(header).getByRole("button", { name: "Export" })
      ).toBeInTheDocument();
      await expect(
        within(header).getByRole("button", { name: "Add Product" })
      ).toBeInTheDocument();
    });

    await step("DataTable renders product rows", async () => {
      await expect(canvas.getByText("Classic T-Shirt")).toBeInTheDocument();
      await expect(canvas.getByText("Denim Jacket")).toBeInTheDocument();
      await expect(canvas.getByText("Running Shoes")).toBeInTheDocument();
    });

    await step("No footer is rendered", async () => {
      await expect(canvas.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  },
};

/**
 * Form page pattern - Header, Content with form fields, Footer with action buttons.
 */
export const FormPage: Story = {
  render: () => {
    const [money, setMoney] = useState<MoneyInputValue>({
      amount: "",
      currencyCode: "EUR",
    });

    return (
      <MainPage.Root
        border="solid-25"
        borderColor="neutral.6"
        borderRadius="200"
      >
        <MainPage.Header>
          <MainPage.Title>Project Settings</MainPage.Title>
        </MainPage.Header>
        <MainPage.Content>
          <Stack gap="400">
            <FormField.Root>
              <FormField.Label>Project name</FormField.Label>
              <FormField.Input>
                <TextInput placeholder="e.g. My Store" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Description</FormField.Label>
              <FormField.Input>
                <TextInput placeholder="Describe the project" />
              </FormField.Input>
            </FormField.Root>
            <FormField.Root>
              <FormField.Label>Project currency</FormField.Label>
              <FormField.Input>
                <MoneyInput
                  value={money}
                  onValueChange={setMoney}
                  currencies={["EUR", "USD", "GBP"]}
                />
              </FormField.Input>
            </FormField.Root>
          </Stack>
        </MainPage.Content>
        <MainPage.Footer>
          <Stack direction="row" gap="200" justify="flex-end" width="100%">
            <Button variant="ghost">Cancel</Button>
            <Button>Save</Button>
          </Stack>
        </MainPage.Footer>
      </MainPage.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title is rendered", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Project Settings"
      );
    });

    await step("Form fields are rendered", async () => {
      await expect(canvas.getByText("Project name")).toBeInTheDocument();
      await expect(canvas.getByText("Description")).toBeInTheDocument();
      await expect(canvas.getByText("Project currency")).toBeInTheDocument();
    });

    await step("Text inputs are rendered", async () => {
      await expect(
        canvas.getByPlaceholderText("e.g. My Store")
      ).toBeInTheDocument();
      await expect(
        canvas.getByPlaceholderText("Describe the project")
      ).toBeInTheDocument();
    });

    await step("Footer renders with buttons", async () => {
      const footer = canvas.getByRole("contentinfo");
      await expect(
        within(footer).getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
      await expect(
        within(footer).getByRole("button", { name: "Save" })
      ).toBeInTheDocument();
    });
  },
};

const manyProductRows: Product[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  sku: `SKU-${String(i + 1).padStart(3, "0")}`,
  price: `€${((i + 1) * 9.99).toFixed(2)}`,
  status: i % 3 === 0 ? "Draft" : "Published",
}));

/**
 * Main page with a scrollable DataTable — used to verify that the DataTable's
 * sticky header remains functional when content overflows. Scroll down inside
 * the page to confirm the table header sticks at the top of the content area.
 */
export const StickyTableHeader: Story = {
  render: () => (
    <Box height="500px" border="solid-25" borderColor="neutral.6">
      <MainPage.Root>
        <MainPage.Header>
          <MainPage.Title>Products</MainPage.Title>
          <MainPage.Actions>
            <Button variant="ghost">Export</Button>
            <Button>Add Product</Button>
          </MainPage.Actions>
        </MainPage.Header>
        <MainPage.Content>
          <DataTable
            columns={productColumns}
            rows={manyProductRows}
            maxHeight="100%"
          />
        </MainPage.Content>
      </MainPage.Root>
    </Box>
  ),
};

/**
 * Tabular page pattern - TabNav in Header for route-based navigation,
 * static content in Content area (router renders content in a real app).
 */
export const WithTabNavigation: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header paddingBottom="0">
        <MainPage.Title>Product Details</MainPage.Title>
        <MainPage.Subtitle>Navigation</MainPage.Subtitle>
        <MainPage.Actions>
          <Button>Undo</Button>
          <Button>Publish</Button>
        </MainPage.Actions>
        <MainPage.TabNav>
          <TabNav.Root aria-label="Product sections">
            <TabNav.Item href="/products/123/general" isCurrent>
              General
            </TabNav.Item>
            <TabNav.Item href="/products/123/variants">Variants</TabNav.Item>
            <TabNav.Item href="/products/123/images">Images</TabNav.Item>
          </TabNav.Root>
        </MainPage.TabNav>
      </MainPage.Header>
      <MainPage.Content>
        <Box padding="400">
          <Text>General information content</Text>
        </Box>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Title is rendered", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Product Details"
      );
    });

    await step("Actions are rendered in header", async () => {
      const header = canvas.getByRole("banner");
      await expect(
        within(header).getByRole("button", { name: "Publish" })
      ).toBeInTheDocument();
    });

    await step("Renders navigation links", async () => {
      const nav = canvas.getByRole("navigation");
      await expect(nav).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "General" })
      ).toHaveAttribute("aria-current", "page");
      await expect(
        canvas.getByRole("link", { name: "Variants" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "Images" })
      ).toBeInTheDocument();
    });

    await step("Shows content for current route", async () => {
      await expect(
        canvas.getByText("General information content")
      ).toBeInTheDocument();
    });
  },
};
