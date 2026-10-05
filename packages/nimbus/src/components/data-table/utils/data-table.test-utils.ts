import { within, userEvent } from "storybook/test";

// Toggle a checkbox given its root (the data-testid'd <label>). As of
// react-aria 3.49 the press needs trusted pointer events, so the synthetic
// userEvent no longer toggles via the <label> — but clicking the <input>
// still works. Assertions use the root (data-selected lives there); the click
// targets the input within it.
export const toggleCheckbox = (checkbox: HTMLElement) =>
  userEvent.click(within(checkbox).getByRole("checkbox"));

export const rowNamed = (canvasElement: HTMLElement, name: RegExp) =>
  within(canvasElement).getByRole("row", { name });
