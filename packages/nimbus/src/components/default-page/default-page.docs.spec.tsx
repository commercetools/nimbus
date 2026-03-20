import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Box,
  Button,
  DefaultPage,
  NimbusProvider,
  Stack,
  TabNav,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section main-page
 * @docs-order 1
 * @docs-title Main page (no back link)
 */
describe("Main page (no back link)", () => {
  it("renders an info page with title, actions, and content", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.Title>Product Catalog</DefaultPage.Title>
            <DefaultPage.Actions>
              <Button>Add Product</Button>
            </DefaultPage.Actions>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Text>Browse and manage your product catalog.</Text>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(
      screen.getByText("Browse and manage your product catalog.")
    ).toBeInTheDocument();
  });

  it("renders a page with title and subtitle", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.Title>Orders</DefaultPage.Title>
            <DefaultPage.Subtitle>
              View and manage all customer orders
            </DefaultPage.Subtitle>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Text>Order list goes here.</Text>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(
      screen.getByText("View and manage all customer orders")
    ).toBeInTheDocument();
    expect(screen.getByText("Order list goes here.")).toBeInTheDocument();
  });

  it("renders a form page with footer", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.Title>Create Discount</DefaultPage.Title>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Stack gap="400">
              <Text>Discount name</Text>
              <Text>Discount value</Text>
            </Stack>
          </DefaultPage.Content>
          <DefaultPage.Footer>
            <Button>Save Discount</Button>
            <Button variant="ghost">Cancel</Button>
          </DefaultPage.Footer>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Create Discount")).toBeInTheDocument();
    expect(screen.getByText("Save Discount")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

/**
 * @docs-section detail-page
 * @docs-order 2
 * @docs-title Detail page (with back link)
 */
describe("Detail page (with back link)", () => {
  it("renders an info detail page with BackLink, title, subtitle, and content", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/products">
              Back to Products
            </DefaultPage.BackLink>
            <DefaultPage.Title>Running Shoes XL</DefaultPage.Title>
            <DefaultPage.Subtitle>SKU: SHOES-XL-001</DefaultPage.Subtitle>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Text>Product details and attributes.</Text>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Back to Products")).toBeInTheDocument();
    expect(screen.getByText("Running Shoes XL")).toBeInTheDocument();
    expect(screen.getByText("SKU: SHOES-XL-001")).toBeInTheDocument();
    expect(
      screen.getByText("Product details and attributes.")
    ).toBeInTheDocument();
  });

  it("renders a form detail page with BackLink and footer with save/cancel", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/customers">
              Back to Customers
            </DefaultPage.BackLink>
            <DefaultPage.Title>Edit Customer</DefaultPage.Title>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Stack gap="400">
              <Text>First name</Text>
              <Text>Last name</Text>
              <Text>Email address</Text>
            </Stack>
          </DefaultPage.Content>
          <DefaultPage.Footer>
            <Button>Save Changes</Button>
            <Button variant="ghost">Cancel</Button>
          </DefaultPage.Footer>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Back to Customers")).toBeInTheDocument();
    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

/**
 * @docs-section header-actions
 * @docs-order 3
 * @docs-title With header actions
 */
describe("With header actions", () => {
  it("renders a page with BackLink, Title, Actions, and Subtitle", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/orders">
              Back to Orders
            </DefaultPage.BackLink>
            <DefaultPage.Title>Order #12345</DefaultPage.Title>
            <DefaultPage.Actions>
              <Button variant="ghost">Cancel Order</Button>
              <Button>Process Order</Button>
            </DefaultPage.Actions>
            <DefaultPage.Subtitle>
              Placed on March 15, 2026
            </DefaultPage.Subtitle>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Box>
              <Text>Order items and shipment details.</Text>
            </Box>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Back to Orders")).toBeInTheDocument();
    expect(screen.getByText("Order #12345")).toBeInTheDocument();
    expect(screen.getByText("Cancel Order")).toBeInTheDocument();
    expect(screen.getByText("Process Order")).toBeInTheDocument();
    expect(screen.getByText("Placed on March 15, 2026")).toBeInTheDocument();
  });
});

/**
 * @docs-section tab-navigation
 * @docs-order 4
 * @docs-title With tab navigation
 */
describe("With tab navigation", () => {
  it("renders a detail page with TabNav containing TabNav.Root and TabNav.Items", () => {
    render(
      <NimbusProvider>
        <DefaultPage.Root>
          <DefaultPage.Header>
            <DefaultPage.BackLink href="/products">
              Back to Products
            </DefaultPage.BackLink>
            <DefaultPage.Title>Winter Jacket</DefaultPage.Title>
            <DefaultPage.TabNav>
              <TabNav.Root aria-label="Product sections">
                <TabNav.Item href="#general" aria-current="page">
                  General
                </TabNav.Item>
                <TabNav.Item href="#variants">Variants</TabNav.Item>
                <TabNav.Item href="#prices">Prices</TabNav.Item>
                <TabNav.Item href="#images">Images</TabNav.Item>
              </TabNav.Root>
            </DefaultPage.TabNav>
          </DefaultPage.Header>
          <DefaultPage.Content>
            <Text>General product information.</Text>
          </DefaultPage.Content>
        </DefaultPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Back to Products")).toBeInTheDocument();
    expect(screen.getByText("Winter Jacket")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Variants")).toBeInTheDocument();
    expect(screen.getByText("Prices")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
    expect(
      screen.getByText("General product information.")
    ).toBeInTheDocument();
  });
});
