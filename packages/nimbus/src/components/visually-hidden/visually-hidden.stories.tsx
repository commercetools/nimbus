import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, VisuallyHidden } from "@commercetools/nimbus";
import { expect, userEvent, within } from "storybook/test";

// CSS property combination, that makes content invisible to the viewer
const invisibleCssProps = {
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0px",
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
};

/**
 * hides content from the viewers eye but keeps it visible to screen readers.
 * Makes it visible if focused.
 */
const meta: Meta<typeof VisuallyHidden> = {
  title: "Utils/VisuallyHidden",
  component: VisuallyHidden,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof VisuallyHidden>;

/**
 * You should not see anything here, that's the whole purpose of this component.
 */
export const Base: Story = {
  render: () => {
    return (
      <VisuallyHidden data-testid="container">
        <div data-testid="content">I should not be visible.</div>
        <Button data-testid="button" onClick={() => alert("meh")}>
          I should not be focusable.
        </Button>
      </VisuallyHidden>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("container");
    const content = canvas.getByTestId("content");
    const button = canvas.getByTestId("button");

    await step("container is in the document, but invisible", async () => {
      await expect(container).toBeInTheDocument();
      await expect(container).toHaveStyle(invisibleCssProps);
    });

    await step("content is inside container", async () => {
      await expect(content.parentElement).toBe(container);
    });

    await step("button is focusable", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });
  },
};

/**
 * Use a `as="span"` if you want to hide inline-content visually.
 */
export const SpanAsContainer: Story = {
  render: () => {
    return (
      <VisuallyHidden as="span" data-testid="container">
        <span data-testid="content">I am a span inside a span</span>
      </VisuallyHidden>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("container");
    const content = canvas.getByTestId("content");

    await step("container uses a span element", async () => {
      await expect(content.parentElement).toBe(container);
      await expect(container.tagName).toBe("SPAN");
    });
  },
};

/**
 * `<VisuallyHidden/>` contains content that can be focused, but only if `isFocusable`
 * is set to true, it will become visible when focused
 */
export const VisibleWhenFocused: Story = {
  render: () => {
    return (
      <VisuallyHidden data-testid="container" isFocusable>
        <Button data-testid="button">Skip Navigation</Button>
      </VisuallyHidden>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const container = canvas.getByTestId("container");
    const button = canvas.getByTestId("button");

    await step("when button is focused, container is visible", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();

      // Check for a subset of properties to make sure they are not applied
      const { height, width, clip, position } = invisibleCssProps;
      await expect(container).not.toHaveStyle({ clip });
      await expect(container).not.toHaveStyle({ position });
      await expect(container).not.toHaveStyle({ height });
      await expect(container).not.toHaveStyle({ width });
    });
  },
};
