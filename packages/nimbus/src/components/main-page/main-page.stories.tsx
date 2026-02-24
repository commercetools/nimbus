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
};

export default meta;

type Story = StoryObj<typeof MainPage.Root>;

/**
 * Minimal page with Root, Header, Title, and Content.
 * Tests semantic HTML structure and that Footer collapses when omitted.
 */
export const Base: Story = {
  render: () => (
    <MainPage.Root
      data-testid="main-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Products" />
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Text>Page content goes here.</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("main-page");

    await step("Root renders as a <div>", async () => {
      await expect(root.tagName).toBe("DIV");
    });

    await step("Header renders as semantic <header>", async () => {
      await expect(root.querySelector("header")).not.toBeNull();
    });

    await step("Title renders as <h1> with correct text", async () => {
      const h1 = root.querySelector("h1");
      await expect(h1).not.toBeNull();
      await expect(h1).toHaveTextContent("Products");
    });

    await step("Content renders as semantic <main>", async () => {
      await expect(root.querySelector("main")).not.toBeNull();
    });

    await step("Content children are rendered", async () => {
      await expect(
        canvas.getByText("Page content goes here.")
      ).toBeInTheDocument();
    });

    await step("Footer is absent when not composed", async () => {
      await expect(root.querySelector("footer")).toBeNull();
    });
  },
};

/**
 * Title with subtitle prop renders heading and secondary text.
 */
export const TitleWithSubtitle: Story = {
  render: () => (
    <MainPage.Root
      data-testid="subtitle-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title
          title="Products"
          subtitle="Manage your product catalog"
        />
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("subtitle-page");

    await step("Title renders as <h1>", async () => {
      const h1 = root.querySelector("h1");
      await expect(h1).not.toBeNull();
      await expect(h1).toHaveTextContent("Products");
    });

    await step("Subtitle text is rendered", async () => {
      await expect(
        canvas.getByText("Manage your product catalog")
      ).toBeInTheDocument();
    });

    await step("Subtitle is not a heading element", async () => {
      const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
      await expect(headings.length).toBe(1);
    });
  },
};

/**
 * Title without subtitle renders only the heading.
 */
export const TitleWithoutSubtitle: Story = {
  render: () => (
    <MainPage.Root
      data-testid="no-subtitle-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Settings" />
      </MainPage.Header>
      <MainPage.Content variant="narrow">
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const root = within(canvasElement).getByTestId("no-subtitle-page");

    await step("Title renders as <h1>", async () => {
      await expect(root.querySelector("h1")).toHaveTextContent("Settings");
    });

    await step("No subtitle element is rendered", async () => {
      const h1 = root.querySelector("h1")!;
      await expect(h1.parentElement!.children.length).toBe(1);
    });
  },
};

/**
 * Actions renders buttons inside the header, positioned after the title.
 */
export const HeaderActions: Story = {
  render: () => (
    <MainPage.Root
      data-testid="actions-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Products" />
        <MainPage.Actions>
          <Button variant="ghost">Export</Button>
          <Button>Add Product</Button>
        </MainPage.Actions>
      </MainPage.Header>
      <MainPage.Content variant="wide">
        <Text>Content area</Text>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("actions-page");

    await step("Action buttons are rendered", async () => {
      await expect(canvas.getByText("Export")).toBeInTheDocument();
      await expect(canvas.getByText("Add Product")).toBeInTheDocument();
    });

    await step("Actions are inside the <header>", async () => {
      const header = root.querySelector("header")!;
      await expect(within(header).getByText("Export")).toBeInTheDocument();
      await expect(within(header).getByText("Add Product")).toBeInTheDocument();
    });
  },
};

/**
 * Footer renders as semantic <footer> with children inside it.
 */
export const WithFooter: Story = {
  render: () => (
    <MainPage.Root
      data-testid="footer-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Project Settings" />
      </MainPage.Header>
      <MainPage.Content variant="narrow">
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
    const root = canvas.getByTestId("footer-page");

    await step("Footer renders as semantic <footer>", async () => {
      await expect(root.querySelector("footer")).not.toBeNull();
    });

    await step("Footer children are rendered inside <footer>", async () => {
      const footer = root.querySelector("footer")!;
      await expect(within(footer).getByText("Cancel")).toBeInTheDocument();
      await expect(within(footer).getByText("Save")).toBeInTheDocument();
    });

    await step("Footer buttons are not in the header", async () => {
      const header = root.querySelector("header")!;
      expect(within(header).queryByText("Save")).toBeNull();
    });
  },
};

/**
 * Content with columns prop renders MainPage.Column children in a grid.
 */
export const MultiColumnContent: Story = {
  render: () => (
    <MainPage.Root
      data-testid="multi-column-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Product Editor" />
      </MainPage.Header>
      <MainPage.Content variant="wide" columns="2/1">
        <MainPage.Column>
          <Box bg="blue.3" padding="600" borderRadius="200">
            <Text fontWeight="bold" color="blue.12">
              Main form content (2fr)
            </Text>
          </Box>
        </MainPage.Column>
        <MainPage.Column>
          <Box bg="purple.3" padding="600" borderRadius="200">
            <Text fontWeight="bold" color="purple.12">
              Sidebar metadata (1fr)
            </Text>
          </Box>
        </MainPage.Column>
      </MainPage.Content>
    </MainPage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Both column children are rendered", async () => {
      await expect(
        canvas.getByText("Main form content (2fr)")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Sidebar metadata (1fr)")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Info page pattern - Header with Actions, Content, no Footer.
 */
export const InfoPage: Story = {
  render: () => (
    <MainPage.Root
      data-testid="info-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Products" />
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
    const root = canvas.getByTestId("info-page");

    await step("Title is rendered", async () => {
      await expect(root.querySelector("h1")).toHaveTextContent("Products");
    });

    await step("Actions are rendered in header", async () => {
      const header = root.querySelector("header")!;
      await expect(within(header).getByText("Export")).toBeInTheDocument();
      await expect(within(header).getByText("Add Product")).toBeInTheDocument();
    });

    await step("Content is rendered", async () => {
      await expect(
        canvas.getByText("Product list table would go here")
      ).toBeInTheDocument();
    });

    await step("No footer is rendered", async () => {
      await expect(root.querySelector("footer")).toBeNull();
    });
  },
};

/**
 * Form page pattern - Header, Content, Footer with action buttons.
 */
export const FormPage: Story = {
  render: () => (
    <MainPage.Root
      data-testid="form-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
      <MainPage.Header>
        <MainPage.Title title="Project Settings" />
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
    const root = canvas.getByTestId("form-page");

    await step("Title is rendered", async () => {
      await expect(root.querySelector("h1")).toHaveTextContent(
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

    await step("Footer renders as <footer> with buttons", async () => {
      const footer = root.querySelector("footer")!;
      await expect(footer).not.toBeNull();
      await expect(within(footer).getByText("Cancel")).toBeInTheDocument();
      await expect(within(footer).getByText("Save")).toBeInTheDocument();
    });
  },
};

/**
 * Tabular page pattern - Header with Actions, Content wrapping Tabs.
 */
export const TabularPage: Story = {
  render: () => (
    <MainPage.Root
      data-testid="tabular-page"
      border="solid-25"
      borderColor="neutral.6"
      borderRadius="200"
    >
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
    const root = canvas.getByTestId("tabular-page");

    await step("Title is rendered", async () => {
      await expect(root.querySelector("h1")).toHaveTextContent(
        "Product Details"
      );
    });

    await step("Actions are rendered in header", async () => {
      const header = root.querySelector("header")!;
      await expect(within(header).getByText("Publish")).toBeInTheDocument();
    });

    await step("Content renders Tabs children", async () => {
      await expect(canvas.getByText("General")).toBeInTheDocument();
      await expect(canvas.getByText("Variants")).toBeInTheDocument();
      await expect(canvas.getByText("Images")).toBeInTheDocument();
    });

    await step("Active tab panel content is visible", async () => {
      await expect(
        canvas.getByText("General information content")
      ).toBeInTheDocument();
    });
  },
};
