import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Steps, NimbusProvider } from "@commercetools/nimbus";

const renderSteps = (
  props?: Partial<React.ComponentProps<typeof Steps.Root>>
) =>
  render(
    <NimbusProvider>
      <Steps.Root step={1} count={3} {...props}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Indicator type="numeric" showCompleteIcon={false} />
            <Steps.Content>
              <Steps.Label>Account</Steps.Label>
              <Steps.Description>Set up account</Steps.Description>
            </Steps.Content>
          </Steps.Item>
          <Steps.Separator />
          <Steps.Item index={1}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Profile</Steps.Label>
              <Steps.Description>Complete profile</Steps.Description>
            </Steps.Content>
          </Steps.Item>
          <Steps.Separator />
          <Steps.Item index={2}>
            <Steps.Indicator type="numeric" />
            <Steps.Content>
              <Steps.Label>Review</Steps.Label>
              <Steps.Description>Confirm details</Steps.Description>
            </Steps.Content>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    </NimbusProvider>
  );

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders list semantics and current step
 * @docs-order 1
 */
describe("Steps - Basic rendering", () => {
  it("renders a list with labeled list items", () => {
    renderSteps();

    expect(
      screen.getByRole("list", { name: "Progress steps" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: "Step 1 of 3: complete" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: "Step 2 of 3: current" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: "Step 3 of 3: incomplete" })
    ).toBeInTheDocument();
  });

  it("marks the current step with aria-current", () => {
    renderSteps();

    const currentStep = screen.getByRole("listitem", {
      name: "Step 2 of 3: current",
    });
    expect(currentStep).toHaveAttribute("aria-current", "step");
  });
});

/**
 * @docs-section step-states
 * @docs-title Step State Tests
 * @docs-description Verify state attributes reflect progress
 * @docs-order 2
 */
describe("Steps - Step states", () => {
  it("assigns data-state based on step index", () => {
    renderSteps();

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-state", "complete");
    expect(items[1]).toHaveAttribute("data-state", "current");
    expect(items[2]).toHaveAttribute("data-state", "incomplete");
  });
});

/**
 * @docs-section indicator-types
 * @docs-title Indicator Type Tests
 * @docs-description Validate numeric and icon indicators
 * @docs-order 3
 */
describe("Steps - Indicator types", () => {
  it("renders numeric indicators for steps", () => {
    renderSteps();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders custom icons when type is icon", () => {
    render(
      <NimbusProvider>
        <Steps.Root step={0} count={2}>
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Indicator type="icon" icon={<span data-testid="icon" />} />
              <Steps.Content>
                <Steps.Label>Account</Steps.Label>
              </Steps.Content>
            </Steps.Item>
            <Steps.Separator />
            <Steps.Item index={1}>
              <Steps.Indicator type="numeric" />
              <Steps.Content>
                <Steps.Label>Review</Steps.Label>
              </Steps.Content>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});

/**
 * @docs-section orientation
 * @docs-title Orientation Tests
 * @docs-description Verify separators reflect orientation
 * @docs-order 4
 */
describe("Steps - Orientation", () => {
  it("passes orientation to separators", () => {
    const { container } = renderSteps({ orientation: "vertical" });

    const separators = container.querySelectorAll('[data-slot="separator"]');
    expect(separators.length).toBe(2);
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });
  });
});
