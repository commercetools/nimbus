import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, PageContent, Stack, Text } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const variants = ["wide", "narrow", "full"] as const;
const columnOptions = ["1", "1/1", "2/1"] as const;

const meta: Meta<typeof PageContent.Root> = {
  title: "Components/PageContent",
  component: PageContent.Root,
};

export default meta;

type Story = StoryObj<typeof PageContent.Root>;

type ColorPalette = "neutral" | "blue" | "purple" | "teal" | "orange";

const PlaceholderBox = ({
  children,
  height = "100px",
  color = "neutral",
}: {
  children: React.ReactNode;
  height?: string;
  color?: ColorPalette;
}) => (
  <Box bg={`${color}.3`} padding="400" borderRadius="200" height={height}>
    <Text fontWeight="bold" color={`${color}.12`}>
      {children}
    </Text>
  </Box>
);

/**
 * Base story - single column wide layout
 */
export const Base: Story = {
  args: {
    variant: "wide",
    "data-testid": "test-page-content",
    children: <PlaceholderBox>Single column content</PlaceholderBox>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("test-page-content");

    await step("Renders a <div> by default", async () => {
      await expect(root.tagName).toBe("DIV");
    });

    await step("Displays correct content", async () => {
      await expect(root).toHaveTextContent("Single column content");
    });
  },
};

/**
 * Width variants - wide, narrow, full
 */
const variantColors: Record<string, ColorPalette> = {
  wide: "blue",
  narrow: "purple",
  full: "teal",
};

export const WidthVariants: Story = {
  render: () => (
    <Stack gap="800">
      {variants.map((variant) => (
        <PageContent.Root
          key={variant}
          variant={variant}
          data-testid={`variant-${variant}`}
        >
          <PlaceholderBox color={variantColors[variant]}>
            variant=&quot;{variant}&quot;
          </PlaceholderBox>
        </PageContent.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All width variants render", async () => {
      for (const variant of variants) {
        const el = canvas.getByTestId(`variant-${variant}`);
        await expect(el).toBeInTheDocument();
      }
    });
  },
};

/**
 * Column layouts - 1, 1/1, 2/1
 */
const columnColors: Record<string, ColorPalette> = {
  "1": "blue",
  "1/1": "purple",
  "2/1": "teal",
};

export const ColumnLayouts: Story = {
  render: () => (
    <Stack gap="800">
      {columnOptions.map((columns) => {
        const c = columnColors[columns];
        return (
          <PageContent.Root
            key={columns}
            variant="wide"
            columns={columns}
            data-testid={`columns-${columns}`}
          >
            {columns === "1" ? (
              <PlaceholderBox color={c}>
                columns=&quot;{columns}&quot; - Single column
              </PlaceholderBox>
            ) : (
              <>
                <PageContent.Column>
                  <PlaceholderBox color={c}>
                    columns=&quot;{columns}&quot; - Left column
                  </PlaceholderBox>
                </PageContent.Column>
                <PageContent.Column>
                  <PlaceholderBox color={c}>Right column</PlaceholderBox>
                </PageContent.Column>
              </>
            )}
          </PageContent.Root>
        );
      })}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All column layouts render", async () => {
      for (const columns of columnOptions) {
        const el = canvas.getByTestId(`columns-${columns}`);
        await expect(el).toBeInTheDocument();
      }
    });
  },
};

/**
 * Sticky sidebar in a 2/1 layout with a scroll container
 */
export const StickySidebar: Story = {
  render: () => (
    <PageContent.Root
      variant="wide"
      columns="2/1"
      maxHeight="300px"
      overflowY="auto"
      tabIndex={0}
      data-testid="sticky-layout"
    >
      <PageContent.Column>
        <PlaceholderBox height="800px" color="blue">
          Main content top label
        </PlaceholderBox>
      </PageContent.Column>
      <PageContent.Column sticky data-testid="sticky-column">
        <PlaceholderBox color="purple">Sticky sidebar</PlaceholderBox>
      </PageContent.Column>
    </PageContent.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Sticky column has data-sticky attribute", async () => {
      const stickyCol = canvas.getByTestId("sticky-column");
      await expect(stickyCol).toHaveAttribute("data-sticky", "true");
    });

    await step(
      "Sticky column stays visible after scrolling past main content label",
      async () => {
        const scrollContainer = canvas.getByTestId("sticky-layout");
        const stickyCol = canvas.getByTestId("sticky-column");

        // Scroll down far enough that the main content label is out of view
        scrollContainer.scrollTop = 400;

        // Wait a frame for scroll to settle
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const containerRect = scrollContainer.getBoundingClientRect();
        const stickyRect = stickyCol.getBoundingClientRect();

        // The sticky column should still be within the visible area of the scroll container
        await expect(stickyRect.top).toBeGreaterThanOrEqual(containerRect.top);
        await expect(stickyRect.top).toBeLessThan(containerRect.bottom);

        // The main content label should have scrolled out of view
        const mainLabel = canvas.getByText("Main content top label");
        const labelRect = mainLabel.getBoundingClientRect();
        await expect(labelRect.bottom).toBeLessThan(containerRect.top);
      }
    );
  },
};

/**
 * Custom gap override via style prop
 */
export const CustomGap: Story = {
  render: () => (
    <Stack gap="800">
      <PageContent.Root variant="wide" columns="1/1">
        <PageContent.Column>
          <PlaceholderBox color="blue">Default gap (800 = 32px)</PlaceholderBox>
        </PageContent.Column>
        <PageContent.Column>
          <PlaceholderBox color="blue">Column 2</PlaceholderBox>
        </PageContent.Column>
      </PageContent.Root>

      <PageContent.Root variant="wide" columns="1/1" gap="1600">
        <PageContent.Column>
          <PlaceholderBox color="purple">
            Large gap (1600 = 64px)
          </PlaceholderBox>
        </PageContent.Column>
        <PageContent.Column>
          <PlaceholderBox color="purple">Column 2</PlaceholderBox>
        </PageContent.Column>
      </PageContent.Root>
    </Stack>
  ),
};

/**
 * Without compound - single column with direct children
 */
export const WithoutCompound: Story = {
  render: () => (
    <PageContent.Root variant="narrow" data-testid="no-compound">
      <PlaceholderBox>
        Direct children without PageContent.Column wrappers
      </PlaceholderBox>
    </PageContent.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders direct children without Column wrappers", async () => {
      const root = canvas.getByTestId("no-compound");
      await expect(root).toHaveTextContent(
        "Direct children without PageContent.Column wrappers"
      );
    });
  },
};
