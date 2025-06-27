import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./card";
import { Stack } from "./../stack";
import type { CardProps } from "./card.types";
import { within, expect, userEvent } from "storybook/test";

const cardPaddings: CardProps["cardPadding"][] = ["sm", "md", "lg"];
const elevations: CardProps["elevation"][] = ["none", "elevated"];
const borderStyles: CardProps["borderStyle"][] = ["none", "outlined"];
const backgroundStyles: CardProps["backgroundStyle"][] = ["default", "muted"];

const meta: Meta<typeof Card.Root> = {
  title: "components/Card",
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
    cardPadding: "md",
    backgroundStyle: "default",
    borderStyle: "none",
    elevation: "none",
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

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(card).toHaveFocus();
    });
  },
};

/**
 * Card padding
 */
export const CardPaddings: Story = {
  render: (args) => {
    return (
      <Stack>
        {cardPaddings.map((cardPadding) => {
          return (
            <Stack direction="row" key={`stack-${cardPadding as string}`}>
              <Card.Root
                key={`${cardPadding as string}`}
                {...args}
                cardPadding={cardPadding}
                borderStyle="outlined"
                backgroundStyle="default"
                elevation="none"
              >
                <Card.Header>
                  <b>Padding size: {cardPadding as string}</b>
                </Card.Header>
                <Card.Content>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Card.Content>
              </Card.Root>
            </Stack>
          );
        })}
      </Stack>
    );
  },

  args: {},
};

/**
 * Showcase Configurations
 */
export const Configurations: Story = {
  render: (args) => {
    return (
      <Stack>
        {borderStyles.map((border) => {
          return (
            <Stack direction="row" key={`stack-${border as string}`}>
              {elevations.map((shadow) => {
                return backgroundStyles.map((background) => {
                  return (
                    <Card.Root
                      key={`${border as string}-${shadow as string}-${background as string}`}
                      {...args}
                      borderStyle={border}
                      elevation={shadow}
                      backgroundStyle={background}
                      cardPadding="md"
                    />
                  );
                });
              })}
            </Stack>
          );
        })}
      </Stack>
    );
  },

  args: {
    children: (
      <>
        <Card.Header>
          <b>Card title</b>
        </Card.Header>
        <Card.Content>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Card.Content>
      </>
    ),
  },
};

/**
 * Without compound components used by the consumer
 */
export const WithoutCompound: Story = {
  render: (args) => {
    return (
      <Stack>
        {borderStyles.map((border) => {
          return (
            <Stack direction="row" key={`stack-${border as string}`}>
              {elevations.map((shadow) => {
                return (
                  <Card.Root
                    key={`${border as string}-${shadow as string}`}
                    {...args}
                    borderStyle={border}
                    elevation={shadow}
                    backgroundStyle="muted"
                    cardPadding="md"
                  />
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    );
  },

  args: {
    children: (
      <div>
        I'm some other flexible content, outside of the compound component
      </div>
    ),
  },
};
