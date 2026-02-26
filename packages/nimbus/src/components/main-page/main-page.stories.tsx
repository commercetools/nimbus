import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Box,
  Button,
  MainPage,
  Stack,
  Tabs,
  Text,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const meta: Meta<typeof MainPage.Root> = {
  title: "Components/MainPage",
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
          <Box bg="neutral.3" padding="400" borderRadius="200">
            <Text>Project name field</Text>
          </Box>
          <Box bg="neutral.3" padding="400" borderRadius="200">
            <Text>Project description field</Text>
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

/**
 * Info page pattern - Header with Actions, Content, no Footer.
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
        <Box bg="neutral.3" padding="600" borderRadius="200">
          <Text fontWeight="bold">Product list table would go here</Text>
        </Box>
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

    await step("Content is rendered", async () => {
      await expect(
        canvas.getByText("Product list table would go here")
      ).toBeInTheDocument();
    });

    await step("No footer is rendered", async () => {
      await expect(canvas.queryByRole("contentinfo")).not.toBeInTheDocument();
    });
  },
};

/**
 * Form page pattern - Header, Content, Footer with action buttons.
 */
export const FormPage: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Project Settings</MainPage.Title>
      </MainPage.Header>
      <MainPage.Content>
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

    await step("Title is rendered", async () => {
      await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Project Settings"
      );
    });

    await step("Content children are rendered", async () => {
      await expect(canvas.getByText("Project name field")).toBeInTheDocument();
      await expect(
        canvas.getByText("Project description field")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Project currency field")
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

/**
 * Tabular page pattern - Header with Actions, Content wrapping Tabs.
 */
export const TabularPage: Story = {
  render: () => (
    <MainPage.Root border="solid-25" borderColor="neutral.6" borderRadius="200">
      <MainPage.Header>
        <MainPage.Title>Product Details</MainPage.Title>
        <MainPage.Actions>
          <Button>Publish</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content>
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

    await step("Content renders Tabs children", async () => {
      await expect(
        canvas.getByRole("tab", { name: "General" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("tab", { name: "Variants" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("tab", { name: "Images" })
      ).toBeInTheDocument();
    });

    await step("Active tab panel content is visible", async () => {
      await expect(
        canvas.getByText("General information content")
      ).toBeInTheDocument();
    });
  },
};
