import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Button,
  MainPage,
  NimbusProvider,
  Stack,
  Tabs,
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
            <MainPage.Title title="Products" />
            <MainPage.Actions>
              <Button variant="ghost">Export</Button>
              <Button>Add Product</Button>
            </MainPage.Actions>
          </MainPage.Header>
          <MainPage.Content variant="wide">
            <Text>Product list content</Text>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Product list content")).toBeInTheDocument();
  });

  it("renders a form page with footer", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title title="Settings" />
          </MainPage.Header>
          <MainPage.Content variant="narrow">
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

  it("renders a multi-column layout with MainPage.Column", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title title="Product Editor" />
          </MainPage.Header>
          <MainPage.Content variant="wide" columns="2/1">
            <MainPage.Column>
              <Text>Main content</Text>
            </MainPage.Column>
            <MainPage.Column>
              <Text>Sidebar</Text>
            </MainPage.Column>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Product Editor")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders a tabular page with tabs", () => {
    render(
      <NimbusProvider>
        <MainPage.Root>
          <MainPage.Header>
            <MainPage.Title title="Product Details" />
            <MainPage.Actions>
              <Button>Publish</Button>
            </MainPage.Actions>
          </MainPage.Header>
          <MainPage.Content variant="wide">
            <Tabs.Root defaultSelectedKey="general">
              <Tabs.List>
                <Tabs.Tab id="general">General</Tabs.Tab>
                <Tabs.Tab id="variants">Variants</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panels>
                <Tabs.Panel id="general">
                  <Text>General tab content</Text>
                </Tabs.Panel>
                <Tabs.Panel id="variants">
                  <Text>Variants tab content</Text>
                </Tabs.Panel>
              </Tabs.Panels>
            </Tabs.Root>
          </MainPage.Content>
        </MainPage.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Product Details")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Variants")).toBeInTheDocument();
  });
});
