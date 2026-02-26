import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailPage, NimbusProvider } from "@commercetools/nimbus";

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
 * @docs-section tabular-detail-page
 * @docs-title Tabular Detail Page
 * @docs-description A detail page with tabbed content navigation
 * @docs-order 3
 */
describe("DetailPage - Tabular page (with tabs)", () => {
  it("renders a tabular detail page with tabs", () => {
    render(
      <NimbusProvider>
        <DetailPage.Root>
          <DetailPage.Header>
            <DetailPage.BackLink href="/customers">
              Back to customers
            </DetailPage.BackLink>
            <DetailPage.Title>Customer Details</DetailPage.Title>
            <DetailPage.Subtitle>customer@example.com</DetailPage.Subtitle>
          </DetailPage.Header>
          <DetailPage.Content>
            Tab content would be rendered here
          </DetailPage.Content>
        </DetailPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Customer Details")).toBeInTheDocument();
    expect(screen.getByText("customer@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("Tab content would be rendered here")
    ).toBeInTheDocument();
  });
});
