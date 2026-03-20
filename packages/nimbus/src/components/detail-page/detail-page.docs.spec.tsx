import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Box,
  DetailPage,
  TabNav,
  Button,
  Text,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section info-detail-page
 * @docs-title Info Detail Page
 * @docs-description A read-only detail page without a footer
 * @docs-order 1
 */
describe("DetailPage - Info page (no footer)", () => {
  it("renders an info detail page", () => {
    render(
      <NimbusProvider>
        <DetailPage.Root>
          <DetailPage.Header>
            <DetailPage.BackLink href="/products">
              Back to products
            </DetailPage.BackLink>
            <DetailPage.Title>Product Details</DetailPage.Title>
            <DetailPage.Subtitle>SKU-12345</DetailPage.Subtitle>
          </DetailPage.Header>
          <DetailPage.Content>Product information goes here</DetailPage.Content>
        </DetailPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Back to products")).toBeInTheDocument();
    expect(screen.getByText("Product Details")).toBeInTheDocument();
    expect(screen.getByText("SKU-12345")).toBeInTheDocument();
    expect(
      screen.getByText("Product information goes here")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section form-detail-page
 * @docs-title Form Detail Page
 * @docs-description A detail page with a footer for form actions
 * @docs-order 2
 */
describe("DetailPage - Form page (with footer)", () => {
  it("renders a form detail page with action buttons", () => {
    render(
      <NimbusProvider>
        <DetailPage.Root>
          <DetailPage.Header>
            <DetailPage.BackLink href="/orders">
              Back to orders
            </DetailPage.BackLink>
            <DetailPage.Title>Edit Order</DetailPage.Title>
          </DetailPage.Header>
          <DetailPage.Content>Order form fields here</DetailPage.Content>
          <DetailPage.Footer>
            <button type="submit">Save</button>
            <button type="button">Cancel</button>
          </DetailPage.Footer>
        </DetailPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Edit Order")).toBeInTheDocument();
    expect(screen.getByText("Order form fields here")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });
});

/**
 * @docs-section header-actions
 * @docs-title Detail Page with Header Actions
 * @docs-description A detail page with action buttons alongside the title
 * @docs-order 3
 */
describe("DetailPage - With header actions", () => {
  it("renders title and actions in a horizontal row", () => {
    render(
      <NimbusProvider>
        <DetailPage.Root>
          <DetailPage.Header>
            <DetailPage.BackLink href="/discounts">
              Back to discounts
            </DetailPage.BackLink>
            <DetailPage.Title>Cart Discount Details</DetailPage.Title>
            <DetailPage.HeaderActions>
              <Button size="sm" variant="ghost">
                Duplicate
              </Button>
              <Button size="sm">Save</Button>
            </DetailPage.HeaderActions>
            <DetailPage.Subtitle>10% off all items</DetailPage.Subtitle>
          </DetailPage.Header>
          <DetailPage.Content>Discount form content</DetailPage.Content>
        </DetailPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Cart Discount Details")).toBeInTheDocument();
    expect(screen.getByText("Duplicate")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("10% off all items")).toBeInTheDocument();
  });
});

/**
 * @docs-section tabular-detail-page
 * @docs-title Detail Page with Tab Navigation
 * @docs-description A detail page with route-based tab navigation
 * @docs-order 4
 */
describe("DetailPage - With tab navigation", () => {
  it("renders a detail page with tab navigation", () => {
    render(
      <NimbusProvider>
        <DetailPage.Root>
          <DetailPage.Header>
            <DetailPage.BackLink href="/customers">
              Back to customers
            </DetailPage.BackLink>
            <DetailPage.Title>Customer Details</DetailPage.Title>
            <DetailPage.Subtitle>customer@example.com</DetailPage.Subtitle>
            <DetailPage.TabNav>
              <TabNav.Root aria-label="Customer sections">
                <TabNav.Item href="/customers/123/general" isCurrent>
                  General
                </TabNav.Item>
                <TabNav.Item href="/customers/123/addresses">
                  Addresses
                </TabNav.Item>
                <TabNav.Item href="/customers/123/orders">Orders</TabNav.Item>
              </TabNav.Root>
            </DetailPage.TabNav>
          </DetailPage.Header>
          <DetailPage.Content>
            <Box py="400">
              <Text>General information content</Text>
            </Box>
          </DetailPage.Content>
        </DetailPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Customer Details")).toBeInTheDocument();
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "General" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Addresses" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByText("General information content")).toBeInTheDocument();
  });
});
