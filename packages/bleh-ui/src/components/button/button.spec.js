import { render, screen } from "../../../../../test/test-utils";
import "@testing-library/jest-dom";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders Button Component", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});
