import { within, userEvent, spyOn } from "storybook/test";

// Toggle a checkbox given its root (the data-testid'd <label>). As of
// react-aria 3.49 the press needs trusted pointer events, so the synthetic
// userEvent no longer toggles via the <label> — but clicking the <input>
// still works. Assertions use the root (data-selected lives there); the click
// targets the input within it.
export const toggleCheckbox = (checkbox: HTMLElement) =>
  userEvent.click(within(checkbox).getByRole("checkbox"));

export const rowNamed = (canvasElement: HTMLElement, name: RegExp) =>
  within(canvasElement).getByRole("row", { name });

/**
 * Records `console.warn` calls for a story and restores the original afterwards.
 * `beforeEach` returns the cleanup, so the console is restored even when an
 * assertion in `play` fails part-way.
 */
export const recordWarnings = (warnings: string[]) => () => {
  const spy = spyOn(console, "warn").mockImplementation((...args) => {
    warnings.push(args.map(String).join(" "));
  });
  return () => {
    spy.mockRestore();
    warnings.length = 0;
  };
};
