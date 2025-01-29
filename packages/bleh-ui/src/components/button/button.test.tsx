import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { UiKitProvider } from "./../ui-kit-provider";

test("adds 1 + 2 to equal 3", () => {
  const foo = 1 + 2;
  expect(foo).toBe(3);
});

test("renders button", () => {
  render(
    <UiKitProvider>
      <Button>Click me</Button>
    </UiKitProvider>
  );
  const button = screen.getByRole("button", { name: /click me/i });
  expect(button).toBeInTheDocument();
});
