import "@testing-library/jest-dom";
const { render, screen } = require("../../../test/test-utils");
const { Button } = require("./button");

describe("Button Component", () => {
  it("renders Button Component", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });
});
