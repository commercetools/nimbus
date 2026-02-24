import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  MainPage,
  PageContent,
  Stack,
  Tabs,
  Text,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const meta: Meta<typeof MainPage.Root> = {
  title: "Components/MainPage",
  component: MainPage.Root,
};

export default meta;

type Story = StoryObj<typeof MainPage.Root>;

/**
 * Base story - minimal info page with title and content
 */
export const Base: Story = {
  render: () => (
    <MainPage.Root data-testid="main-page" height="400px">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Text>Page content goes here.</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("main-page");

    await step("Renders a <div> root element", async () => {
      await expect(root.tagName).toBe("DIV");
    });

    await step("Renders semantic <header> element", async () => {
      const header = root.querySelector("header");
      await expect(header).not.toBeNull();
    });

    await step("Renders <h1> for title", async () => {
      const h1 = root.querySelector("h1");
      await expect(h1).not.toBeNull();
      await expect(h1).toHaveTextContent("Products");
    });

    await step("Renders semantic <main> element for content", async () => {
      const main = root.querySelector("main");
      await expect(main).not.toBeNull();
    });

    await step("Does not render <footer> when Footer is omitted", async () => {
      const footer = root.querySelector("footer");
      await expect(footer).toBeNull();
    });

    await step("Displays correct content", async () => {
      await expect(
        canvas.getByText("Page content goes here.")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Info page - title, actions, content, no footer
 */
export const InfoPage: Story = {
  render: () => (
    <MainPage.Root data-testid="info-page" height="400px">
      <MainPage.Header>
        <MainPage.Title>Products</MainPage.Title>
        <MainPage.Actions>
          <Button variant="ghost">Export</Button>
          <Button>Add Product</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Box bg="neutral.3" padding="600" borderRadius="200">
          <Text fontWeight="bold">Product list table would go here</Text>
        </Box>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders page title", async () => {
      const h1 = canvasElement.querySelector("h1");
      await expect(h1).toHaveTextContent("Products");
    });

    await step("Renders action buttons in header", async () => {
      await expect(canvas.getByText("Export")).toBeInTheDocument();
      await expect(canvas.getByText("Add Product")).toBeInTheDocument();
    });

    await step("Renders content area", async () => {
      await expect(
        canvas.getByText("Product list table would go here")
      ).toBeInTheDocument();
    });

    await step("Does not render footer", async () => {
      const root = canvas.getByTestId("info-page");
      const footer = root.querySelector("footer");
      await expect(footer).toBeNull();
    });
  },
};

/**
 * Form page - title, content, footer with save/cancel buttons
 */
export const FormPage: Story = {
  render: () => (
    <MainPage.Root data-testid="form-page" height="400px">
      <MainPage.Header>
        <MainPage.Title>Project Settings</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content variant="narrow">
        <Stack gap="400">
          <Box bg="neutral.3" padding="400" borderRadius="200">
            <Text>Project name field</Text>
          </Box>
          <Box bg="neutral.3" padding="400" borderRadius="200">
            <Text>Project description field</Text>
          </Box>
          <Box bg="neutral.3" padding="400" borderRadius="200">
            <Text>Project currency field</Text>
          </Box>
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

    await step("Renders page title", async () => {
      const h1 = canvasElement.querySelector("h1");
      await expect(h1).toHaveTextContent("Project Settings");
    });

    await step("Renders form content", async () => {
      await expect(canvas.getByText("Project name field")).toBeInTheDocument();
    });

    await step("Renders footer with action buttons", async () => {
      const root = canvas.getByTestId("form-page");
      const footer = root.querySelector("footer");
      await expect(footer).not.toBeNull();
      await expect(canvas.getByText("Cancel")).toBeInTheDocument();
      await expect(canvas.getByText("Save")).toBeInTheDocument();
    });
  },
};

/**
 * Tabular page - title, actions, content with Tabs
 */
export const TabularPage: Story = {
  render: () => (
    <MainPage.Root data-testid="tabular-page" height="400px">
      <MainPage.Header>
        <MainPage.Title>Product Details</MainPage.Title>
        <MainPage.Actions>
          <Button>Publish</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Tabs.Root defaultSelectedKey="general">
          <Tabs.List>
            <Tabs.Tab id="general">General</Tabs.Tab>
            <Tabs.Tab id="variants">Variants</Tabs.Tab>
            <Tabs.Tab id="images">Images</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="general">
              <Box padding="400">
                <Text>General information content</Text>
              </Box>
            </Tabs.Panel>
            <Tabs.Panel id="variants">
              <Box padding="400">
                <Text>Variants content</Text>
              </Box>
            </Tabs.Panel>
            <Tabs.Panel id="images">
              <Box padding="400">
                <Text>Images content</Text>
              </Box>
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders page title", async () => {
      const h1 = canvasElement.querySelector("h1");
      await expect(h1).toHaveTextContent("Product Details");
    });

    await step("Renders action button", async () => {
      await expect(canvas.getByText("Publish")).toBeInTheDocument();
    });

    await step("Renders tab controls", async () => {
      await expect(canvas.getByText("General")).toBeInTheDocument();
      await expect(canvas.getByText("Variants")).toBeInTheDocument();
      await expect(canvas.getByText("Images")).toBeInTheDocument();
    });

    await step("Renders initial tab content", async () => {
      await expect(
        canvas.getByText("General information content")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Multi-column content with PageContent columns
 */
export const MultiColumnContent: Story = {
  render: () => (
    <MainPage.Root data-testid="multi-column-page" height="400px">
      <MainPage.Header>
        <MainPage.Title>Product Editor</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content variant="wide" columns="2/1">
        <PageContent.Column>
          <Box bg="blue.3" padding="600" borderRadius="200">
            <Text fontWeight="bold" color="blue.12">
              Main form content (2fr)
            </Text>
          </Box>
        </PageContent.Column>
        <PageContent.Column>
          <Box bg="purple.3" padding="600" borderRadius="200">
            <Text fontWeight="bold" color="purple.12">
              Sidebar metadata (1fr)
            </Text>
          </Box>
        </PageContent.Column>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders both columns", async () => {
      await expect(
        canvas.getByText("Main form content (2fr)")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Sidebar metadata (1fr)")
      ).toBeInTheDocument();
    });
  },
};
