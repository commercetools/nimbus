import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageContent, Stack } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const variants = ["wide", "narrow", "full"] as const;
const columnOptions = ["1", "1/1", "2/1"] as const;

const meta: Meta<typeof PageContent.Root> = {
  title: "Components/PageContent",
  component: PageContent.Root,
};

export default meta;

type Story = StoryObj<typeof PageContent.Root>;

const PlaceholderBox = ({
  children,
  height = "100px",
}: {
  children: React.ReactNode;
  height?: string;
}) => (
  <div
    style={{
      background: "#e2e8f0",
      border: "1px dashed #94a3b8",
      padding: "16px",
      borderRadius: "8px",
      height,
    }}
  >
    {children}
  </div>
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
export const WidthVariants: Story = {
  render: () => (
    <Stack gap="800">
      {variants.map((variant) => (
        <PageContent.Root
          key={variant}
          variant={variant}
          data-testid={`variant-${variant}`}
        >
          <PlaceholderBox>
            <b>variant=&quot;{variant}&quot;</b>
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
export const ColumnLayouts: Story = {
  render: () => (
    <Stack gap="800">
      {columnOptions.map((columns) => (
        <PageContent.Root
          key={columns}
          variant="wide"
          columns={columns}
          data-testid={`columns-${columns}`}
        >
          {columns === "1" ? (
            <PlaceholderBox>
              <b>columns=&quot;{columns}&quot;</b> - Single column
            </PlaceholderBox>
          ) : (
            <>
              <PageContent.Column>
                <PlaceholderBox>
                  <b>columns=&quot;{columns}&quot;</b> - Left column
                </PlaceholderBox>
              </PageContent.Column>
              <PageContent.Column>
                <PlaceholderBox>Right column</PlaceholderBox>
              </PageContent.Column>
            </>
          )}
        </PageContent.Root>
      ))}
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
 * Sticky sidebar in a 2/1 layout
 */
export const StickySidebar: Story = {
  render: () => (
    <PageContent.Root variant="wide" columns="2/1" data-testid="sticky-layout">
      <PageContent.Column>
        <PlaceholderBox height="400px">
          Main content (tall to enable scrolling)
        </PlaceholderBox>
      </PageContent.Column>
      <PageContent.Column sticky data-testid="sticky-column">
        <PlaceholderBox>Sticky sidebar</PlaceholderBox>
      </PageContent.Column>
    </PageContent.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Sticky column has data-sticky attribute", async () => {
      const stickyCol = canvas.getByTestId("sticky-column");
      await expect(stickyCol).toHaveAttribute("data-sticky", "true");
    });
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
          <PlaceholderBox>Default gap (800 = 32px)</PlaceholderBox>
        </PageContent.Column>
        <PageContent.Column>
          <PlaceholderBox>Column 2</PlaceholderBox>
        </PageContent.Column>
      </PageContent.Root>

      <PageContent.Root variant="wide" columns="1/1" gap="1600">
        <PageContent.Column>
          <PlaceholderBox>Large gap (1600 = 64px)</PlaceholderBox>
        </PageContent.Column>
        <PageContent.Column>
          <PlaceholderBox>Column 2</PlaceholderBox>
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
