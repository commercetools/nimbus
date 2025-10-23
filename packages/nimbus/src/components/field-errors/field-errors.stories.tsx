import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  FieldErrors,
  FormField,
  Stack,
  TextInput,
} from "@commercetools/nimbus";
import React from "react";
import { userEvent, within, expect } from "storybook/test";

/**
 * Storybook metadata configuration
 */
const meta: Meta<typeof FieldErrors> = {
  title: "Components/FieldErrors",
  component: FieldErrors,
  parameters: {
    docs: {
      description: {
        component: `
FieldErrors renders error messages based on error object configuration.
Provides backwards compatibility with UI-Kit FieldErrors while integrating with Nimbus design patterns.

Supports custom error renderers and localized built-in error messages for common validation scenarios.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FieldErrors>;

/**
 * Basic example showing built-in error types
 */
export const Base: Story = {
  args: {
    id: "field-errors-base",
    errors: {
      missing: true,
    },
    isVisible: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const errorContainer = canvas.getByRole("alert");
    const errorMessage = canvas.getByText(
      "This field is required. Provide a value."
    );

    await step("Error container is visible with correct role", async () => {
      await expect(errorContainer).toBeInTheDocument();
      await expect(errorContainer).toHaveAttribute("role", "alert");
      await expect(errorContainer).toHaveAttribute("id", "field-errors-base");
    });

    await step("Built-in error message is displayed correctly", async () => {
      await expect(errorMessage).toBeInTheDocument();
      await expect(errorMessage).toBeVisible();
    });
  },
};

export const AsWarning: Story = {
  args: {
    id: "field-errors-base",
    errors: {
      missing: true,
    },
    isVisible: true,
    colorPalette: "warning",
    role: "status",
  },
};

/**
 * All built-in error types
 */
export const AllBuiltInErrors: Story = {
  args: {
    id: "field-errors-all-builtin",
    errors: {
      // Basic validation
      missing: true,
      invalid: true,
      empty: true,

      // Length validation
      min: true,
      max: true,

      // Format validation
      format: true,
      duplicate: true,

      // Numeric validation
      negative: true,
      fractions: true,
      belowMin: true,
      aboveMax: true,
      outOfRange: true,

      // Server/async validation
      invalidFromServer: true,
      notFound: true,
      blocked: true,
    },
    isVisible: true,
  },
};

/**
 * Basic validation errors
 */
export const BasicValidationErrors: Story = {
  args: {
    id: "field-errors-basic",
    errors: {
      missing: true,
      invalid: true,
      empty: true,
    },
    isVisible: true,
  },
};

/**
 * Length validation errors
 */
export const LengthValidationErrors: Story = {
  args: {
    id: "field-errors-length",
    errors: {
      min: true,
      max: true,
    },
    isVisible: true,
  },
};

/**
 * Format validation errors
 */
export const FormatValidationErrors: Story = {
  args: {
    id: "field-errors-format",
    errors: {
      format: true,
      duplicate: true,
    },
    isVisible: true,
  },
};

/**
 * Numeric validation errors
 */
export const NumericValidationErrors: Story = {
  args: {
    id: "field-errors-numeric",
    errors: {
      negative: true,
      fractions: true,
      belowMin: true,
      aboveMax: true,
      outOfRange: true,
    },
    isVisible: true,
  },
};

/**
 * Server/async validation errors
 */
export const ServerValidationErrors: Story = {
  args: {
    id: "field-errors-server",
    errors: {
      invalidFromServer: true,
      notFound: true,
      blocked: true,
    },
    isVisible: true,
  },
};

/**
 * Custom error renderer example
 */
export const WithCustomErrorRenderer: Story = {
  args: {
    id: "field-errors-custom",
    errors: {
      missing: true,
      duplicate: true,
      minLength: true,
      maxLength: true,
    },
    isVisible: true,
    renderError: (key: string) => {
      switch (key) {
        case "duplicate":
          return "This value is already in use. It must be unique. I am rendered by renderError.";
        case "minLength":
          return "This value is too short. Minimum 3 characters required. I am rendered by renderError.";
        case "maxLength":
          return "This value is too long. Maximum 50 characters allowed. I am rendered by renderError.";
        default:
          // Return null to fall back to built-in or default error handling
          return null;
      }
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const errorContainer = canvas.getByRole("alert");

    await step("Custom error messages are displayed", async () => {
      await expect(errorContainer).toBeInTheDocument();

      // Check custom error messages are rendered
      await expect(
        canvas.getByText(
          "This value is already in use. It must be unique. I am rendered by renderError."
        )
      ).toBeInTheDocument();
      await expect(
        canvas.getByText(
          "This value is too short. Minimum 3 characters required. I am rendered by renderError."
        )
      ).toBeInTheDocument();
      await expect(
        canvas.getByText(
          "This value is too long. Maximum 50 characters allowed. I am rendered by renderError."
        )
      ).toBeInTheDocument();

      // Check built-in error message is used for missing (not handled by renderError)
      await expect(
        canvas.getByText("This field is required. Provide a value.")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Default error renderer example
 */
export const WithDefaultErrorRenderer: Story = {
  args: {
    id: "field-errors-default",
    errors: {
      missing: true,
      custom: true,
      invalid: true,
    },
    isVisible: true,
    renderDefaultError: (key: string) => {
      switch (key) {
        case "custom":
          return "This is a custom validation error handled by renderDefaultError.";
        case "invalid":
          return "The provided value is invalid.";
        default:
          return null;
      }
    },
  },
};

/**
 * Combined custom and default error renderers
 */
export const WithBothCustomRenderers: Story = {
  args: {
    id: "field-errors-both",
    errors: {
      missing: true,
      priority: true,
      fallback: true,
      unknown: true,
    },
    isVisible: true,
    renderError: (key: string) => {
      if (key === "priority") {
        return "High priority error handled by renderError!";
      }
      return null; // Fall back to renderDefaultError or built-in
    },
    renderDefaultError: (key: string) => {
      if (key === "fallback") {
        return "Fallback error handled by renderDefaultError.";
      }
      return null; // Fall back to built-in error handling
    },
  },
};

/**
 * Custom messages for built-in error types
 */
export const WithCustomMessages: Story = {
  args: {
    id: "field-errors-custom-messages",
    errors: {
      missing: true,
      min: true,
      format: true,
      duplicate: true,
      negative: true,
      invalidFromServer: true,
    },
    isVisible: true,
    customMessages: {
      missing: "🔥 Hey! You forgot something important!",
      min: "📏 This needs to be longer!",
      format: "🎭 Please use the correct format!",
      duplicate: "🔄 This value is already taken!",
      negative: "📊 Only positive numbers allowed!",
      invalidFromServer: "🚨 Server says no-no!",
    },
  },
};

/**
 * Example of invisible errors (backward compatibility)
 */
export const InvisibleErrors: Story = {
  args: {
    id: "field-errors-invisible",
    errors: {
      missing: true,
      negative: true,
    },
    isVisible: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "No error messages are rendered when isVisible is false",
      async () => {
        await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
        await expect(
          canvas.queryByText("This field is required. Provide a value.")
        ).not.toBeInTheDocument();
        await expect(
          canvas.queryByText("Negative number is not supported.")
        ).not.toBeInTheDocument();
      }
    );
  },
};

/**
 * Only inactive errors (should render nothing)
 */
export const InactiveErrors: Story = {
  args: {
    id: "field-errors-inactive",
    errors: {
      missing: false,
      negative: false,
      duplicate: false,
    },
    isVisible: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "No error elements are rendered when all errors are false",
      async () => {
        // Should not render any alert container when all errors are false
        await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();

        // Should not render any error text
        await expect(
          canvas.queryByText("This field is required. Provide a value.")
        ).not.toBeInTheDocument();
        await expect(
          canvas.queryByText("Negative number is not supported.")
        ).not.toBeInTheDocument();
        await expect(
          canvas.queryByText("This value is already in use. It must be unique.")
        ).not.toBeInTheDocument();

        // Component should render nothing when all errors are false
        // (canvasElement includes Storybook scripts, so we check for specific content)
      }
    );
  },
};

/**
 * Real-world example similar to merchant center usage
 */
export const MerchantCenterLike: Story = {
  args: {
    id: "language-field-errors",
    errors: {
      missing: true,
      duplicate: false,
      format: false,
    },
    isVisible: true,
    renderError: (key: string) => {
      switch (key) {
        case "format":
          return "Language code must be in ISO 639-1 format (e.g., 'en', 'de').";
        case "duplicate":
          return "This language is already configured.";
        default:
          return null;
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Example showing usage similar to merchant center applications.
The component handles a mix of built-in validation errors (missing) and custom validation errors (format, duplicate).
        `,
      },
    },
  },
};

/**
 * Showcase different error scenarios in a form context
 */
export const FormScenarios: Story = {
  render: () => (
    <Stack gap="24px">
      <div>
        <h3>Required Text Field</h3>
        <FieldErrors
          id="required-field"
          errors={{ missing: true }}
          isVisible={true}
        />
      </div>

      <div>
        <h3>Password Field (Length Validation)</h3>
        <FieldErrors
          id="password-field"
          errors={{ min: true }}
          isVisible={true}
          customMessages={{
            min: "Password must be at least 8 characters long.",
          }}
        />
      </div>

      <div>
        <h3>Email Field (Format + Duplicate)</h3>
        <FieldErrors
          id="email-field"
          errors={{ format: true, duplicate: true }}
          isVisible={true}
          customMessages={{
            format: "Please enter a valid email address.",
            duplicate: "This email is already registered.",
          }}
        />
      </div>

      <div>
        <h3>Number Field (Range Validation)</h3>
        <FieldErrors
          id="number-field"
          errors={{ belowMin: true, negative: true }}
          isVisible={true}
          customMessages={{
            belowMin: "Value must be at least 10.",
          }}
        />
      </div>

      <div>
        <h3>Server Validation Errors</h3>
        <FieldErrors
          id="server-field"
          errors={{ invalidFromServer: true, blocked: true }}
          isVisible={true}
        />
      </div>

      <div>
        <h3>Legacy Key Field (Custom renderError)</h3>
        <FieldErrors
          id="legacy-field"
          errors={{ duplicate: true, customValidation: true }}
          isVisible={true}
          renderError={(key) => {
            switch (key) {
              case "customValidation":
                return "This is a custom validation error handled by renderError.";
              default:
                return null; // Falls back to built-in handling for 'duplicate'
            }
          }}
        />
      </div>

      <div>
        <h3>Valid Field (No Errors)</h3>
        <FieldErrors
          id="valid-field"
          errors={{ missing: false, duplicate: false }}
          isVisible={true}
        />
        <em style={{ color: "#666", fontSize: "0.875rem" }}>
          No errors - component renders nothing
        </em>
      </div>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Real-world form scenarios showing different error states and how FieldErrors handles each case.
This demonstrates the practical usage patterns found in merchant center applications.
        `,
      },
    },
  },
};

/**
 * FormField integration test story
 * Demonstrates how FieldErrors integrates with Nimbus FormField component
 * Tests form state integration and visibility handling
 */
export const FormFieldIntegration: Story = {
  render: () => {
    const [formData, setFormData] = React.useState({
      email: "",
      age: "",
    });
    const [errors, setErrors] = React.useState<
      Record<string, Record<string, boolean>>
    >({});
    const [touched, setTouched] = React.useState<Record<string, boolean>>({});

    const validateField = (name: string, value: string) => {
      const fieldErrors: Record<string, boolean> = {};

      if (name === "email") {
        if (!value) {
          fieldErrors.missing = true;
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors.format = true;
        } else if (value === "admin@test.com") {
          fieldErrors.duplicate = true;
        }
      }

      if (name === "age") {
        if (!value) {
          fieldErrors.missing = true;
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          fieldErrors.negative = true;
        } else if (value.includes(".")) {
          fieldErrors.fractions = true;
        } else if (Number(value) < 18) {
          fieldErrors.belowMin = true;
        }
      }

      return fieldErrors;
    };

    const handleChange = (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleBlur = (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const hasEmailErrors =
      errors.email && Object.values(errors.email).some(Boolean);
    const hasAgeErrors = errors.age && Object.values(errors.age).some(Boolean);

    return (
      <Stack direction="column" gap="24px" maxWidth="400px">
        <FormField.Root
          isInvalid={hasEmailErrors && touched.email}
          data-testid="email-form-field"
        >
          <FormField.Label>Email Address *</FormField.Label>
          <FormField.Input>
            <TextInput
              type="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              onBlur={() => handleBlur("email")}
              data-testid="email-input"
            />
          </FormField.Input>
          <FormField.Error>
            <FieldErrors
              id="email-errors"
              errors={errors.email}
              renderError={(key) => {
                if (key === "format") {
                  return "Please enter a valid email address.";
                }
                if (key === "duplicate") {
                  return "This email is already registered. Please use a different email.";
                }
                return null;
              }}
            />
          </FormField.Error>
        </FormField.Root>

        <FormField.Root
          isInvalid={hasAgeErrors && touched.age}
          data-testid="age-form-field"
        >
          <FormField.Label>Age *</FormField.Label>
          <FormField.Input>
            <TextInput
              type="number"
              value={formData.age}
              onChange={(value) => handleChange("age", value)}
              onBlur={() => handleBlur("age")}
              data-testid="age-input"
            />
          </FormField.Input>
          <FormField.Error>
            <FieldErrors
              id="age-errors"
              errors={errors.age}
              customMessages={{
                belowMin: "You must be at least 18 years old.",
              }}
            />
          </FormField.Error>
        </FormField.Root>

        <Button
          variant="outline"
          onPress={() => {
            setErrors({
              email: { missing: true },
              age: { missing: true },
            });
            setTouched({ email: true, age: true });
          }}
          data-testid="trigger-errors-button"
        >
          Trigger All Errors
        </Button>

        <Button
          variant="outline"
          onPress={() => {
            setErrors({});
            setTouched({});
            setFormData({ email: "", age: "" });
          }}
          data-testid="reset-form-button"
        >
          Reset Form
        </Button>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByTestId("email-input");
    const ageInput = canvas.getByTestId("age-input");
    const triggerErrorsButton = canvas.getByTestId("trigger-errors-button");
    const resetFormButton = canvas.getByTestId("reset-form-button");

    await step("Initial state - no errors visible", async () => {
      await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
      await expect(emailInput).not.toHaveAttribute("data-invalid");
      await expect(ageInput).not.toHaveAttribute("data-invalid");
    });

    await step("Test email validation on blur", async () => {
      // Enter invalid email and blur to trigger validation
      await userEvent.type(emailInput, "invalid-email");
      await userEvent.tab();

      // Should show format error
      await expect(
        canvas.getByText("Please enter a valid email address.")
      ).toBeInTheDocument();
      await expect(emailInput).toHaveAttribute("data-invalid", "true");
    });

    await step("Test duplicate email error", async () => {
      // Clear and enter duplicate email
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, "admin@test.com");
      await userEvent.tab();

      // Should show custom duplicate error message
      await expect(
        canvas.getByText(
          "This email is already registered. Please use a different email."
        )
      ).toBeInTheDocument();
    });

    await step("Test age validation", async () => {
      // Enter negative age
      await userEvent.type(ageInput, "-5");
      await userEvent.tab();

      // Should show negative number error
      await expect(
        canvas.getByText("Negative number is not supported.")
      ).toBeInTheDocument();
      await expect(ageInput).toHaveAttribute("data-invalid", "true");

      // Clear and enter age below minimum
      await userEvent.clear(ageInput);
      await userEvent.type(ageInput, "16");
      await userEvent.tab();

      // Should show custom below minimum message
      await expect(
        canvas.getByText("You must be at least 18 years old.")
      ).toBeInTheDocument();
    });

    await step("Test trigger all errors button", async () => {
      await userEvent.click(triggerErrorsButton);

      // Should show missing field errors for both fields
      await expect(
        canvas.getAllByText("This field is required. Provide a value.")
      ).toHaveLength(2);
      await expect(emailInput).toHaveAttribute("data-invalid", "true");
      await expect(ageInput).toHaveAttribute("data-invalid", "true");
    });

    await step("Test reset form button", async () => {
      await userEvent.click(resetFormButton);

      // Should clear all errors and form state
      await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
      await expect(emailInput).not.toHaveAttribute("data-invalid");
      await expect(ageInput).not.toHaveAttribute("data-invalid");

      // Check that inputs have been reset to empty values
      // Note: React Aria inputs may not always have the value attribute set to ""
      // but the state should be reset
      const emailValue = emailInput.getAttribute("value") || "";
      const ageValue = ageInput.getAttribute("value") || "";
      await expect(emailValue).toBe("");
      await expect(ageValue).toBe("");
    });

    await step("Test valid form state", async () => {
      // Enter valid values
      await userEvent.type(emailInput, "user@example.com");
      await userEvent.type(ageInput, "25");
      await userEvent.tab();

      // Should not show any errors
      await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
      await expect(emailInput).not.toHaveAttribute("data-invalid");
      await expect(ageInput).not.toHaveAttribute("data-invalid");
    });
  },
  parameters: {
    docs: {
      description: {
        story: `
          This story demonstrates how FieldErrors integrates seamlessly with Nimbus FormField components.
          It shows:

          1. **Form State Integration**: FieldErrors visibility is controlled by form touch state
          2. **Validation Timing**: Errors appear only after user interaction (blur)
          3. **Custom Error Messages**: Mix of built-in errors and custom renderError functions
          4. **FormField Visual States**: Invalid styling is applied when errors are present
          5. **Accessibility**: Proper ARIA relationships between form fields and error messages
          6. **Real-world Patterns**: Similar to merchant center form validation patterns
        `,
      },
    },
  },
};
