import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import { Button } from "./button";

describe("Button", () => {
  it("renders", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
