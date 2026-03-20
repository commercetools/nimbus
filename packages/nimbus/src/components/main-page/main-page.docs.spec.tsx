import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Button,
  MainPage,
  NimbusProvider,
  Stack,
  TabNav,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section usage-examples
 * @docs-title Usage Examples
 * @docs-description Consumer implementation patterns for MainPage
 * @docs-order 1
 */
describe("MainPage - Usage examples", () => {
  it("renders an info page with title and actions", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title>Products</MainPage.Title>
            <MainPage.Actions>
              <Button variant="ghost">Export</Button>
              <Button>Add Product</Button>
            </MainPage.Actions>
          </MainPage.Header>
          <MainPage.Content>
            <Text>Product list content</Text>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Product list content")).toBeInTheDocument();
  });

  it("renders a page with title and subtitle", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title>Products</MainPage.Title>
            <MainPage.Subtitle>Manage your product catalog</MainPage.Subtitle>
          </MainPage.Header>
          <MainPage.Content>
            <Text>Product list content</Text>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Manage your product catalog")).toBeInTheDocument();
  });

  it("renders a form page with footer", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title>Settings</MainPage.Title>
          </MainPage.Header>
          <MainPage.Content>
            <Text>Form fields here</Text>
          </MainPage.Content>
          <MainPage.Footer>
            <Stack direction="row" gap="200" justify="flex-end" width="100%">
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </Stack>
          </MainPage.Footer>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders a page with tab navigation", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header paddingBottom="0">
            <MainPage.Title>Product Details</MainPage.Title>
            <MainPage.Actions>
              <Button>Publish</Button>
            </MainPage.Actions>
            <MainPage.TabNav>
              <TabNav.Root aria-label="Product sections">
                <TabNav.Item href="/products/123/general" isCurrent>
                  General
                </TabNav.Item>
                <TabNav.Item href="/products/123/variants">
                  Variants
                </TabNav.Item>
              </TabNav.Root>
            </MainPage.TabNav>
          </MainPage.Header>
          <MainPage.Content>
            <Text>General information content</Text>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Product Details")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "General" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Variants" })).toBeInTheDocument();
  });
});
