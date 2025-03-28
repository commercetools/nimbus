import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./card";
import { Stack } from "./../stack";
import type { CardProps } from "./card.types";
import { within, expect } from "@storybook/test";

const elevations: CardProps["elevation"][] = ["none", "elevated"];
const borderStyles: CardProps["borderStyle"][] = ["none", "outlined"];
const backgroundStyles: CardProps["backgroundStyle"][] = ["default", "muted"];

const meta: Meta<typeof Card> = {
  title: "components/Card",
  component: Card,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Card>;

/**
 * Base story
 * Demonstrates the most basic implementation
 */
export const Base: Story = {
  args: {
    children: "Demo Card",
    "data-testid": "test-card",
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
                    <Card
                      key={`${border as string}-${shadow as string}-${background as string}`}
                      {...args}
                      borderStyle={border}
                      elevation={shadow}
                      backgroundStyle={background}
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
                  <Card
                    key={`${border as string}-${shadow as string}`}
                    {...args}
                    borderStyle={border}
                    elevation={shadow}
                    backgroundStyle="muted"
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
