import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Stack } from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";

// As of react-aria 3.49 the press/pointer handling on the (visually hidden)
// checkbox <input> requires *trusted* pointer events. storybook/test's
// userEvent dispatches simulated events, which no longer drive the press, so a
// click on the <label> no longer toggles the checkbox in tests — even though it
// works correctly for real users. The vitest browser provider's userEvent
// issues real Playwright/CDP events, which are trusted and therefore behave
// exactly like a real user click.
//
// `vitest/browser` is a virtual module that can ONLY be imported inside Vitest
// Browser Mode — importing it eagerly throws "imported outside of Vitest" when
// the story loads in the Storybook UI. So we import it lazily and only when the
// Vitest browser runner is present (`globalThis.__vitest_browser__`); in the
// Storybook UI the trusted-click step is skipped (a human can still click).
//
// There is no unified path today: storybook/test's userEvent is a subset of
// @testing-library/user-event (simulated events), and Storybook maintainers
// have stated they don't plan to expose Vitest's CDP-backed events to play
// functions any time soon — real/trusted events can't exist in a published
// Storybook UI for security reasons. See storybook discussions #32796 / #30815
// and the react-aria visually-hidden checkbox input (adobe/react-spectrum#8755).
const isVitestBrowser = (): boolean =>
  Boolean((globalThis as { __vitest_browser__?: boolean }).__vitest_browser__);

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof Checkbox>;

/**
 * Base Story showcasing the default Checkbox state
 */
export const Base: Story = {
  args: {
    children: "Checkbox Label",
    onChange: fn(),
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "test-label",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    // The "checkbox" role lives on react-aria's visually-hidden <input>; query
    // it by role + accessible name (the aria-label) rather than DOM internals.
    const inputElement = canvas.getByRole("checkbox", { name: "test-label" });
    // The root is the <label> that wraps the input. A <label> has no ARIA role,
    // so derive it relationally from the input; the visible text is queried by
    // its content.
    const rootLabel = inputElement.closest("label") as HTMLLabelElement;
    const displayLabel = canvas.getByText("Checkbox Label");
    const onChange = args.onChange;

    await step(
      "Forwards data- & aria-attributes to the checkbox element",
      async () => {
        await expect(rootLabel.tagName).toBe("LABEL");
        await expect(rootLabel).toHaveAttribute("data-testid", "test-checkbox");
        await expect(inputElement).toHaveAttribute("aria-label", "test-label");
      }
    );

    await step("Can be focused with the keyboard", async () => {
      await userEvent.keyboard("{tab}");
      await expect(inputElement).toHaveFocus();
    });

    await step("Can be triggered with space-bar", async () => {
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(1);
      await userEvent.keyboard(" ");
      await expect(onChange).toHaveBeenCalledTimes(2);
    });

    // Note: Enter intentionally does NOT toggle a checkbox — per the HTML spec,
    // Space toggles and Enter submits the surrounding form. We therefore verify
    // toggling via Space (above) and via clicking (below), not via Enter.

    // Trusted pointer events are only available under the Vitest browser
    // runner; in the Storybook UI we skip this step (see note above the
    // isVitestBrowser helper) rather than crash on importing vitest/browser.
    if (isVitestBrowser()) {
      const { userEvent: realUserEvent } = await import("vitest/browser");
      await step("Can be triggered by clicking on root & label", async () => {
        // realUserEvent issues trusted pointer events; a synthetic .click() no
        // longer drives react-aria's press as of 3.49.
        await realUserEvent.click(rootLabel);
        await expect(onChange).toHaveBeenCalledTimes(3);
        await realUserEvent.click(displayLabel);
        await expect(onChange).toHaveBeenCalledTimes(4);
      });
    }
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Checkbox",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    isDisabled: true,
    isSelected: false,
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByTestId("test-checkbox");
    const inputElement = checkboxElement.querySelector(
      "input"
    ) as HTMLInputElement;

    // A disabled Checkbox renders a disabled underlying <input>. The browser
    // won't forward label clicks to a disabled control or let it take focus, so
    // asserting the input is disabled (plus the root's data-disabled state) is
    // sufficient — simulating clicks that physically can't toggle it adds no
    // coverage.
    await step("Is disabled", async () => {
      await expect(inputElement).toBeDisabled();
      await expect(checkboxElement).toHaveAttribute("data-disabled", "true");
    });
  },
};

export const Invalid: Story = {
  args: {
    children: "Invalid Checkbox",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    isInvalid: true,
    onChange: fn(),
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByTestId("test-checkbox");
    await step("checkbox element has invalid state", async () => {
      await expect(checkboxElement).toHaveAttribute("data-invalid", "true");
    });
  },
};

export const InvisibleLabel: Story = {
  args: {
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "Checkbox without label",
  },

  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const checkboxElement = canvas.getByTestId("test-checkbox");
    const inputElement = checkboxElement.querySelector(
      "input"
    ) as HTMLInputElement;
    await step("Has alternative label", async () => {
      await expect(inputElement).toHaveAttribute(
        "aria-label",
        args["aria-label"]
      );
    });
  },
};

export const StyleProps: Story = {
  args: {
    children: "I have an inline margin of 40px",
    // @ts-expect-error: data-testid is not a valid prop
    "data-testid": "test-checkbox",
    "aria-label": "Checkbox without label",
    mx: "40px",
  },

  play: async ({ canvasElement, step }) => {
    const htmlLabel = canvasElement.querySelector(
      '[data-slot="root"]'
    ) as HTMLLabelElement;
    await step("Passes style props as expected", async () => {
      await expect(
        getComputedStyle(htmlLabel).getPropertyValue("margin-inline")
      ).toBe("40px");
    });
  },
};

/**
 * Smoke Test
 * This story attempts to capture all visual permutations
 */
export const SmokeTest: Story = {
  render: () => {
    return (
      <Stack gap="1000">
        {[false, true].map((isInvalid, j) => (
          <Stack direction="row" key={j}>
            {[false, true].map((isDisabled, i) => (
              <Stack
                width="1/2"
                key={i}
                direction="column"
                alignItems="flex-start"
              >
                <Checkbox
                  isSelected={false}
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                >
                  Unchecked, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>

                <Checkbox
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isSelected
                >
                  Checked, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>

                <Checkbox
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isIndeterminate
                >
                  Indeterminate, {isDisabled ? "disabled" : "not disabled"},{" "}
                  {isInvalid ? "invalid" : ""}
                </Checkbox>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};
