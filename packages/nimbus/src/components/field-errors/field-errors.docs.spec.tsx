import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FieldErrors,
  FormField,
  TextInput,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected error messages
 * @docs-order 1
 */
describe("FieldErrors - Basic rendering", () => {
  it("renders built-in error message", () => {
    render(
      <NimbusProvider>
        <FieldErrors errors={{ missing: true }} isVisible={true} />
      </NimbusProvider>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("This field is required. Provide a value.")
    ).toBeInTheDocument();
  });

  it("does not render when isVisible is false", () => {
    render(
      <NimbusProvider>
        <FieldErrors errors={{ missing: true }} isVisible={false} />
      </NimbusProvider>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not render when all errors are false", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: false, invalid: false }}
          isVisible={true}
        />
      </NimbusProvider>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section custom-error-rendering
 * @docs-title Custom Error Rendering Tests
 * @docs-description Test custom error message rendering
 * @docs-order 2
 */
describe("FieldErrors - Custom rendering", () => {
  it("renders custom error messages via renderError", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ duplicate: true }}
          isVisible={true}
          renderError={(key) => {
            if (key === "duplicate") {
              return "This email is already registered.";
            }
            return null;
          }}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByText("This email is already registered.")
    ).toBeInTheDocument();
  });

  it("renders custom messages via customMessages prop", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: true, min: true }}
          isVisible={true}
          customMessages={{
            missing: "Please fill out this field!",
            min: "Must be at least 8 characters long.",
          }}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("Please fill out this field!")).toBeInTheDocument();
    expect(
      screen.getByText("Must be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  it("falls back to built-in messages when renderError returns null", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: true, duplicate: true }}
          isVisible={true}
          renderError={(key) => {
            if (key === "duplicate") {
              return "Custom duplicate message";
            }
            return null; // Falls back to built-in for 'missing'
          }}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("Custom duplicate message")).toBeInTheDocument();
    expect(
      screen.getByText("This field is required. Provide a value.")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section formfield-integration
 * @docs-title FormField Integration Tests
 * @docs-description Test FieldErrors within FormField contexts
 * @docs-order 3
 */
describe("FieldErrors - FormField integration", () => {
  it("shows errors only after field is touched", async () => {
    const user = userEvent.setup();
    const errors = { missing: true };
    let touched = false;

    const { rerender } = render(
      <NimbusProvider>
        <FormField.Root isInvalid={touched}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput
              onBlur={() => {
                touched = true;
              }}
              data-testid="email-input"
            />
          </FormField.Input>
          <FormField.Error>
            <FieldErrors
              errors={errors}
              isVisible={touched}
              data-testid="field-errors"
            />
          </FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    // Initially no errors shown
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // Blur the input
    const input = screen.getByTestId("email-input");
    await user.click(input);
    await user.tab();

    // Rerender with touched state
    rerender(
      <NimbusProvider>
        <FormField.Root isInvalid={true}>
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput data-testid="email-input" />
          </FormField.Input>
          <FormField.Error>
            <FieldErrors errors={errors} isVisible={true} />
          </FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    // Now errors should be visible
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText("This field is required. Provide a value.")
      ).toBeInTheDocument();
    });
  });

  it("applies invalid state to FormField when errors exist", () => {
    const errors = { invalid: true };

    render(
      <NimbusProvider>
        <FormField.Root isInvalid={true} data-testid="form-field">
          <FormField.Label>Email</FormField.Label>
          <FormField.Input>
            <TextInput />
          </FormField.Input>
          <FormField.Error>
            <FieldErrors errors={errors} isVisible={true} />
          </FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    const formField = screen.getByTestId("form-field");
    expect(formField).toHaveAttribute("data-invalid", "true");
  });
});

/**
 * @docs-section error-priority
 * @docs-title Testing Error Priority
 * @docs-description Test the error resolution cascade
 * @docs-order 4
 */
describe("FieldErrors - Error priority", () => {
  it("prioritizes renderError over renderDefaultError", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: true }}
          isVisible={true}
          renderError={() => "Priority error"}
          renderDefaultError={() => "Fallback error"}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("Priority error")).toBeInTheDocument();
    expect(screen.queryByText("Fallback error")).not.toBeInTheDocument();
  });

  it("prioritizes customMessages over built-in messages", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: true }}
          isVisible={true}
          customMessages={{
            missing: "Custom missing message",
          }}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("Custom missing message")).toBeInTheDocument();
    expect(
      screen.queryByText("This field is required. Provide a value.")
    ).not.toBeInTheDocument();
  });

  it("uses built-in messages as final fallback", () => {
    render(
      <NimbusProvider>
        <FieldErrors
          errors={{ missing: true }}
          isVisible={true}
          renderError={() => null}
          renderDefaultError={() => null}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByText("This field is required. Provide a value.")
    ).toBeInTheDocument();
  });
});
