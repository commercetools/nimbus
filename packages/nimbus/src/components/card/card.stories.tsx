import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  type CardProps,
  Stack,
  Text,
  Button,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const sizes: CardProps["size"][] = ["sm", "md", "lg"];
const variants: CardProps["variant"][] = [
  "outlined",
  "elevated",
  "filled",
  "plain",
];

const meta: Meta<typeof Card.Root> = {
  title: "Components/Card",
  component: Card.Root,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Card.Root>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    children: "Demo Card",
    "data-testid": "test-card",
    variant: "outlined",
    size: "md",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("test-card");

    await step("Renders a <div> by default", async () => {
      await expect(card.tagName).toBe("DIV");
    });

    await step("Displays correct content", async () => {
      await expect(card).toHaveTextContent(args.children as string);
    });
  },
};

/**
 * Sizes
 * Demonstrates sm, md, lg padding and gap scaling
 */
export const Sizes: Story = {
  render: () => {
    return (
      <Stack gap="400">
        {sizes.map((size) => (
          <Card.Root
            key={size as string}
            size={size}
            variant="outlined"
            data-testid={`card-size-${size as string}`}
          >
            <Card.Header>
              <Text fontWeight="bold">Size: {size as string}</Text>
            </Card.Header>
            <Card.Body>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="solid" colorPalette="primary" size="sm">
                Action
              </Button>
            </Card.Footer>
          </Card.Root>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All sizes render", async () => {
      for (const size of sizes) {
        const card = canvas.getByTestId(`card-size-${size as string}`);
        await expect(card).toBeInTheDocument();
      }
    });
  },
};

/**
 * Variants
 * Demonstrates outlined, elevated, filled, plain visual treatments
 */
export const Variants: Story = {
  render: () => {
    return (
      <Stack gap="400">
        {variants.map((variant) => (
          <Card.Root
            key={variant as string}
            variant={variant}
            size="md"
            data-testid={`card-variant-${variant as string}`}
          >
            <Card.Header>
              <Text fontWeight="bold">Variant: {variant as string}</Text>
            </Card.Header>
            <Card.Body>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All variants render", async () => {
      for (const variant of variants) {
        const card = canvas.getByTestId(`card-variant-${variant as string}`);
        await expect(card).toBeInTheDocument();
      }
    });
  },
};

/**
 * Header + Body + Footer
 * Demonstrates all three compound parts together
 */
export const HeaderBodyFooter: Story = {
  render: () => {
    return (
      <Card.Root variant="outlined" size="md" data-testid="card-full">
        <Card.Header>
          <Text fontWeight="bold">Card Title</Text>
        </Card.Header>
        <Card.Body>
          <Text>This is the main card content with all three sections.</Text>
        </Card.Body>
        <Card.Footer>
          <Stack direction="row" gap="200">
            <Button variant="solid" colorPalette="primary" size="sm">
              Confirm
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </Stack>
        </Card.Footer>
      </Card.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders header, body, and footer content", async () => {
      await expect(canvas.getByText("Card Title")).toBeInTheDocument();
      await expect(
        canvas.getByText(
          "This is the main card content with all three sections."
        )
      ).toBeInTheDocument();
      await expect(canvas.getByText("Confirm")).toBeInTheDocument();
      await expect(canvas.getByText("Cancel")).toBeInTheDocument();
    });
  },
};

/**
 * Body only
 * Demonstrates a card with only the Body part — CSS handles padding correctly
 */
export const BodyOnly: Story = {
  render: () => {
    return (
      <Card.Root variant="outlined" size="md" data-testid="card-body-only">
        <Card.Body>
          <Text>This card only has a body section.</Text>
        </Card.Body>
      </Card.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders body content", async () => {
      await expect(
        canvas.getByText("This card only has a body section.")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Header + Body (no Footer)
 * Demonstrates the two-part pattern without footer
 */
export const HeaderAndBody: Story = {
  render: () => {
    return (
      <Card.Root variant="outlined" size="md" data-testid="card-header-body">
        <Card.Header>
          <Text fontWeight="bold">Card Title</Text>
        </Card.Header>
        <Card.Body>
          <Text>Content without a footer.</Text>
        </Card.Body>
      </Card.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders header and body", async () => {
      await expect(canvas.getByText("Card Title")).toBeInTheDocument();
      await expect(
        canvas.getByText("Content without a footer.")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Without compound components
 * Demonstrates free-form content inside Card.Root
 */
export const WithoutCompound: Story = {
  render: () => {
    return (
      <Card.Root variant="filled" size="md" data-testid="card-freeform">
        <div>
          I'm some other flexible content, outside of the compound component
        </div>
      </Card.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders free-form content", async () => {
      await expect(canvas.getByTestId("card-freeform")).toHaveTextContent(
        "I'm some other flexible content"
      );
    });
  },
};
