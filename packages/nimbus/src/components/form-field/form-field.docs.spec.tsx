import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FormField, TextInput, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify FormField renders with all parts correctly structured
 * @docs-order 1
 */
describe("FormField - Basic rendering", () => {
  it("renders with label and input", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Username</FormField.Label>
          <FormField.Input>
            <TextInput placeholder="Enter username" />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Password</FormField.Label>
          <FormField.Input>
            <TextInput type="password" />
          </FormField.Input>
          <FormField.Description>
            Must be at least 8 characters
          </FormField.Description>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByText("Must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("renders with all parts", () => {
    render(
      <NimbusProvider>
        <FormField.Root isInvalid>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
          <FormField.Description>Your contact email</FormField.Description>
          <FormField.Error>Invalid email format</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Your contact email")).toBeInTheDocument();
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify ARIA attributes and label associations
 * @docs-order 2
 */
describe("FormField - Accessibility", () => {
  it("associates label with input via aria-labelledby", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Username</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Username");

    expect(input).toHaveAttribute("aria-labelledby", label.id);
  });

  it("associates description with input via aria-describedby", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Username</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
          <FormField.Description>
            Must be at least 8 characters
          </FormField.Description>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    const description = screen.getByText("Must be at least 8 characters");

    expect(input.getAttribute("aria-describedby")).toContain(description.id);
  });

  it("marks input as required when isRequired is true", () => {
    render(
      <NimbusProvider>
        <FormField.Root isRequired>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("marks input as invalid when isInvalid is true", () => {
    render(
      <NimbusProvider>
        <FormField.Root isInvalid>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
          <FormField.Error>Invalid email</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});

/**
 * @docs-section sizes
 * @docs-title Size Variants
 * @docs-description Test different size variants
 * @docs-order 3
 */
describe("FormField - Size variants", () => {
  it("renders small size", () => {
    render(
      <NimbusProvider>
        <FormField.Root size="sm">
          <FormField.Label>Small Field</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Small Field")).toBeInTheDocument();
  });

  it("renders medium size (default)", () => {
    render(
      <NimbusProvider>
        <FormField.Root size="md">
          <FormField.Label>Medium Field</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Medium Field")).toBeInTheDocument();
  });
});

/**
 * @docs-section layout-direction
 * @docs-title Layout Direction
 * @docs-description Test column and row layout directions
 * @docs-order 4
 */
describe("FormField - Layout direction", () => {
  it("renders with column direction (default)", () => {
    render(
      <NimbusProvider>
        <FormField.Root direction="column">
          <FormField.Label>Column Layout</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Column Layout")).toBeInTheDocument();
  });

  it("renders with row direction", () => {
    render(
      <NimbusProvider>
        <FormField.Root direction="row">
          <FormField.Label>Row Layout</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Row Layout")).toBeInTheDocument();
  });
});

/**
 * @docs-section states
 * @docs-title Component States
 * @docs-description Test required, invalid, disabled, and read-only states
 * @docs-order 5
 */
describe("FormField - States", () => {
  it("displays required indicator", () => {
    render(
      <NimbusProvider>
        <FormField.Root isRequired>
          <FormField.Label>Required Field</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("displays error when invalid", () => {
    render(
      <NimbusProvider>
        <FormField.Root isInvalid>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
          <FormField.Error>Please enter a valid email</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("disables input when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <FormField.Root isDisabled>
          <FormField.Label>Disabled Field</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("makes input read-only when isReadOnly is true", () => {
    render(
      <NimbusProvider>
        <FormField.Root isReadOnly>
          <FormField.Label>Read-only Field</FormField.Label>
          <FormField.Input>
            <TextInput value="Cannot edit" />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });
});

/**
 * @docs-section error-visibility
 * @docs-title Error Visibility
 * @docs-description Test that errors only show when isInvalid is true
 * @docs-order 6
 */
describe("FormField - Error visibility", () => {
  it("hides error when isInvalid is false", () => {
    render(
      <NimbusProvider>
        <FormField.Root isInvalid={false}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
          <FormField.Error>This should be hidden</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.queryByText("This should be hidden")).not.toBeInTheDocument();
  });

  it("shows error when isInvalid is true", () => {
    render(
      <NimbusProvider>
        <FormField.Root isInvalid={true}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput type="email" />
          </FormField.Input>
          <FormField.Error>This should be visible</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("This should be visible")).toBeInTheDocument();
  });
});

/**
 * @docs-section user-interactions
 * @docs-title User Interactions
 * @docs-description Test user input and validation flows
 * @docs-order 7
 */
describe("FormField - User interactions", () => {
  it("handles user input", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Username</FormField.Label>
          <FormField.Input>
            <TextInput placeholder="Enter username" />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "testuser");

    expect(input).toHaveValue("testuser");
  });

  it("supports validation on blur", async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [invalid, setInvalid] = React.useState(false);
      const [value, setValue] = React.useState("");

      const handleChange = (newValue: string) => {
        setValue(newValue);
      };

      const handleBlur = () => {
        setInvalid(value.length < 3);
      };

      return (
        <NimbusProvider>
          <FormField.Root isInvalid={invalid}>
            <FormField.Label>Username</FormField.Label>
            <FormField.Input>
              <TextInput
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormField.Input>
            <FormField.Error>Must be at least 3 characters</FormField.Error>
          </FormField.Root>
        </NimbusProvider>
      );
    };

    render(<TestComponent />);

    const input = screen.getByRole("textbox");
    await user.type(input, "ab");
    await user.tab(); // Blur the input

    expect(
      screen.getByText("Must be at least 3 characters")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section info-box
 * @docs-title InfoBox Functionality
 * @docs-description Test InfoBox popover interactions
 * @docs-order 8
 */
describe("FormField - InfoBox", () => {
  it("renders InfoBox trigger when InfoBox is provided", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>API Key</FormField.Label>
          <FormField.InfoBox>
            Additional information about this field
          </FormField.InfoBox>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    // InfoBox trigger button should be present (help icon)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("shows InfoBox content when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>API Key</FormField.Label>
          <FormField.InfoBox>
            Your API key is sensitive information
          </FormField.InfoBox>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
        </FormField.Root>
      </NimbusProvider>
    );

    // Click the help icon button
    const helpButton = screen.getAllByRole("button")[0];
    await user.click(helpButton);

    // Wait for popover content
    await screen.findByText("Your API key is sensitive information");
    expect(
      screen.getByText("Your API key is sensitive information")
    ).toBeInTheDocument();
  });
});
