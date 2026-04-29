import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  type CardProps,
  Stack,
  Text,
  Heading,
  Button,
  Separator,
} from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const sizes: CardProps["size"][] = ["sm", "md", "lg"];

// Variants enumerate every combination of the three independent visual
// axes (outlined × elevated × muted background). Listed in the same
// row-major order as the Figma matrix: outlined×elevated cycles within
// each background group.
const variants: CardProps["variant"][] = [
  "plain",
  "outlined",
  "elevated",
  "outlined-elevated",
  "muted",
  "outlined-muted",
  "elevated-muted",
  "outlined-elevated-muted",
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
 *
 * Renders all eight visual permutations as a 4×2 matrix mirroring the
 * Figma component-property layout: rows cycle outlined×elevated, columns
 * split by background (default vs. muted).
 */
export const Variants: Story = {
  render: () => {
    const rows: {
      label: string;
      outlined: boolean;
      elevated: boolean;
    }[] = [
      {
        label: "outlined: NO,  elevated: NO",
        outlined: false,
        elevated: false,
      },
      { label: "outlined: YES, elevated: NO", outlined: true, elevated: false },
      {
        label: "outlined: NO,  elevated: YES",
        outlined: false,
        elevated: true,
      },
      { label: "outlined: YES, elevated: YES", outlined: true, elevated: true },
    ];
    const backgrounds: {
      label: string;
      muted: boolean;
    }[] = [
      { label: "background: default", muted: false },
      { label: "background: muted", muted: true },
    ];

    const variantFor = (
      outlined: boolean,
      elevated: boolean,
      muted: boolean
    ): CardProps["variant"] => {
      const parts = [
        outlined && "outlined",
        elevated && "elevated",
        muted && "muted",
      ].filter(Boolean);
      return (
        parts.length === 0 ? "plain" : parts.join("-")
      ) as CardProps["variant"];
    };

    return (
      <Stack gap="600">
        <Stack direction="row" gap="600">
          {backgrounds.map((bg) => (
            <Stack key={bg.label} gap="400" flex="1">
              <Text fontWeight="bold" color="neutral.11">
                {bg.label}
              </Text>
              {rows.map((row) => {
                const variant = variantFor(
                  row.outlined,
                  row.elevated,
                  bg.muted
                );
                return (
                  <Card.Root
                    key={variant as string}
                    variant={variant}
                    size="md"
                    data-testid={`card-variant-${variant as string}`}
                  >
                    <Card.Header>
                      <Text fontWeight="bold">{variant as string}</Text>
                    </Card.Header>
                    <Card.Body>
                      <Text>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </Text>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All eight variants render", async () => {
      for (const variant of variants) {
        const card = canvas.getByTestId(`card-variant-${variant as string}`);
        await expect(card).toBeInTheDocument();
      }
    });
  },
};

/**
 * Part combinations
 * Side-by-side comparison of realistic part combinations across all sizes,
 * without and with dividers: Body only, Header + Body, Header + Body + Footer
 */
export const PartCombinations: Story = {
  render: () => {
    const combinations = [
      { label: "Body only", hasHeader: false, hasFooter: false },
      { label: "Header + Body", hasHeader: true, hasFooter: false },
      { label: "Header + Body + Footer", hasHeader: true, hasFooter: true },
    ];

    return (
      <Stack gap="800">
        {combinations.map(({ label, hasHeader, hasFooter }) => (
          <Stack key={label} gap="400">
            <Text fontWeight="bold">{label}</Text>
            <Stack direction="row" gap="800">
              <Stack gap="400">
                <Text color="neutral.11">Without dividers</Text>
                {sizes.map((size) => (
                  <Card.Root
                    key={size as string}
                    variant="outlined"
                    size={size}
                    data-testid={`card-${label}-${size as string}`}
                  >
                    {hasHeader && (
                      <Card.Header>
                        <Text fontWeight="bold">Header ({size as string})</Text>
                      </Card.Header>
                    )}
                    <Card.Body>
                      <Text>Body content for the {size as string} size.</Text>
                    </Card.Body>
                    {hasFooter && (
                      <Card.Footer>
                        <Stack direction="row" gap="200">
                          <Button
                            variant="solid"
                            colorPalette="primary"
                            size="sm"
                          >
                            Confirm
                          </Button>
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                        </Stack>
                      </Card.Footer>
                    )}
                  </Card.Root>
                ))}
              </Stack>
              <Stack gap="400">
                <Text color="neutral.11">With dividers</Text>
                {sizes.map((size) => (
                  <Card.Root
                    key={size as string}
                    variant="outlined"
                    size={size}
                    data-testid={`card-${label}-divided-${size as string}`}
                  >
                    {hasHeader && (
                      <>
                        <Card.Header>
                          <Text fontWeight="bold">
                            Header ({size as string})
                          </Text>
                        </Card.Header>
                        <Separator />
                      </>
                    )}
                    <Card.Body>
                      <Text>Body content for the {size as string} size.</Text>
                    </Card.Body>
                    {hasFooter && (
                      <>
                        <Separator />
                        <Card.Footer>
                          <Stack direction="row" gap="200">
                            <Button
                              variant="solid"
                              colorPalette="primary"
                              size="sm"
                            >
                              Confirm
                            </Button>
                            <Button variant="ghost" size="sm">
                              Cancel
                            </Button>
                          </Stack>
                        </Card.Footer>
                      </>
                    )}
                  </Card.Root>
                ))}
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All combinations render across sizes", async () => {
      for (const size of sizes) {
        await expect(
          canvas.getByTestId(`card-Body only-${size as string}`)
        ).toBeInTheDocument();
        await expect(
          canvas.getByTestId(`card-Header + Body-${size as string}`)
        ).toBeInTheDocument();
        await expect(
          canvas.getByTestId(`card-Header + Body + Footer-${size as string}`)
        ).toBeInTheDocument();
      }
    });

    await step("Divided variants render", async () => {
      for (const size of sizes) {
        await expect(
          canvas.getByTestId(`card-Body only-divided-${size as string}`)
        ).toBeInTheDocument();
        await expect(
          canvas.getByTestId(`card-Header + Body-divided-${size as string}`)
        ).toBeInTheDocument();
        await expect(
          canvas.getByTestId(
            `card-Header + Body + Footer-divided-${size as string}`
          )
        ).toBeInTheDocument();
      }
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
      <Card.Root variant="muted" size="md" data-testid="card-freeform">
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

/**
 * Slot-based accessibility
 * Demonstrates automatic ARIA wiring when Heading slot="title" and
 * Text slot="description" are used inside the card. The card stays a plain
 * div — no implicit role is set.
 */
export const SlotBasedAccessibility: Story = {
  render: () => (
    <Card.Root variant="outlined" size="md" data-testid="card-a11y">
      <Card.Header>
        <Heading slot="title" as="h3">
          Project Overview
        </Heading>
      </Card.Header>
      <Card.Body>
        <Text slot="description">
          This project tracks the quarterly goals for the design system team.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="solid" colorPalette="primary" size="sm">
          View Details
        </Button>
      </Card.Footer>
    </Card.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("card-a11y");

    await step("Card has no implicit role", async () => {
      await expect(card).not.toHaveAttribute("role");
    });

    await step("Card has aria-labelledby pointing to Heading", async () => {
      const heading = canvas.getByText("Project Overview");
      await expect(card.getAttribute("aria-labelledby")).toBe(heading.id);
    });

    await step("Card has aria-describedby pointing to Text", async () => {
      const description = canvas.getByText(/quarterly goals/);
      await expect(card.getAttribute("aria-describedby")).toBe(description.id);
    });
  },
};

/**
 * Without slots
 * Verifies that cards without slot props remain plain divs with no ARIA role
 */
export const WithoutSlots: Story = {
  render: () => (
    <Card.Root variant="outlined" size="md" data-testid="card-no-slots">
      <Card.Header>
        <Text fontWeight="bold">Regular Title</Text>
      </Card.Header>
      <Card.Body>
        <Text>Content without slot props.</Text>
      </Card.Body>
    </Card.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("card-no-slots");

    await step("Card has no role when slots are not used", async () => {
      await expect(card).not.toHaveAttribute("role");
    });

    await step("Card has no aria-labelledby", async () => {
      await expect(card).not.toHaveAttribute("aria-labelledby");
    });

    await step("Card has no aria-describedby", async () => {
      await expect(card).not.toHaveAttribute("aria-describedby");
    });
  },
};

/**
 * Title slot only
 * Demonstrates using only the title slot without a description slot
 */
export const TitleSlotOnly: Story = {
  render: () => (
    <Card.Root variant="outlined" size="md" data-testid="card-title-only">
      <Card.Header>
        <Heading slot="title" as="h3">
          Title Only Card
        </Heading>
      </Card.Header>
      <Card.Body>
        <Text>Body content without slot prop.</Text>
      </Card.Body>
    </Card.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByTestId("card-title-only");

    await step("Card has aria-labelledby but no aria-describedby", async () => {
      await expect(card).toHaveAttribute("aria-labelledby");
      await expect(card).not.toHaveAttribute("aria-describedby");
    });

    await step("Card has no implicit role", async () => {
      await expect(card).not.toHaveAttribute("role");
    });
  },
};
