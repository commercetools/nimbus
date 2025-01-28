import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import '@testing-library/jest-dom';

describe("Button Component", () => {
  it('renders Button Component', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });
});
