import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Check } from "@commercetools/nimbus-icons";
import { Steps, NimbusProvider } from "@commercetools/nimbus";

const renderSteps = (
  props?: Partial<React.ComponentProps<typeof Steps.Root>>
) =>
  render(
    <NimbusProvider>
      <Steps.Root step={1} count={3} {...props}>
        <Steps.List>
          <Steps.Item index={0}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check data-testid="complete-icon" />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Account</Steps.Title>
              <Steps.Description>Set up account</Steps.Description>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={1}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Profile</Steps.Title>
              <Steps.Description>Complete profile</Steps.Description>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>

          <Steps.Item index={2}>
            <Steps.Trigger>
              <Steps.Indicator>
                <Steps.Status
                  complete={<Check />}
                  incomplete={<Steps.Number />}
                />
              </Steps.Indicator>
              <Steps.Title>Review</Steps.Title>
              <Steps.Description>Confirm details</Steps.Description>
            </Steps.Trigger>
          </Steps.Item>
        </Steps.List>

        <Steps.Content index={0}>Account content</Steps.Content>
        <Steps.Content index={1}>Profile content</Steps.Content>
        <Steps.Content index={2}>Review content</Steps.Content>
        <Steps.CompletedContent>All done!</Steps.CompletedContent>
      </Steps.Root>
    </NimbusProvider>
  );

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with correct structure
 * @docs-order 1
 */
describe("Steps - Basic rendering", () => {
  it("renders a tablist with tab items", () => {
    renderSteps();

    // Chakra/Ark Steps uses tablist pattern
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("renders step titles", () => {
    renderSteps();

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    renderSteps();

    expect(screen.getByText("Set up account")).toBeInTheDocument();
    expect(screen.getByText("Complete profile")).toBeInTheDocument();
    expect(screen.getByText("Confirm details")).toBeInTheDocument();
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
    const { container } = renderSteps();

    // Query triggers which have the data-state attribute
    // In Ark Steps: "open" = current step, "closed" = non-current steps
    // Completed steps are identified by data-complete attribute
    const triggers = container.querySelectorAll('[data-part="trigger"]');
    expect(triggers[0]).toHaveAttribute("data-state", "closed"); // past (completed) step
    expect(triggers[0]).toHaveAttribute("data-complete", ""); // marked as complete
    expect(triggers[1]).toHaveAttribute("data-state", "open"); // current step
    expect(triggers[2]).toHaveAttribute("data-state", "closed"); // future (incomplete) step
    expect(triggers[2]).not.toHaveAttribute("data-complete"); // not complete
  });

  it("shows current step content via tabpanel", () => {
    renderSteps();

    // Step 1 (index 1) is current, so its content should be visible
    expect(screen.getByText("Profile content")).toBeInTheDocument();
    // Other content should not be visible (Ark handles this)
  });
});

/**
 * @docs-section indicator-content
 * @docs-title Indicator Content Tests
 * @docs-description Validate indicator content based on step state
 * @docs-order 3
 */
describe("Steps - Indicator content", () => {
  it("renders step numbers for incomplete steps", () => {
    renderSteps();

    // Step 2 (index 1 - current) should show "2"
    expect(screen.getByText("2")).toBeInTheDocument();
    // Step 3 (index 2 - incomplete) should show "3"
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders complete icon for completed steps", () => {
    renderSteps();

    // Step 1 (index 0) is complete, should show check icon
    expect(screen.getByTestId("complete-icon")).toBeInTheDocument();
  });

  it("renders custom icons when provided", () => {
    render(
      <NimbusProvider>
        <Steps.Root step={0} count={2}>
          <Steps.List>
            <Steps.Item index={0}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <span data-testid="custom-icon">*</span>
                </Steps.Indicator>
                <Steps.Title>Account</Steps.Title>
              </Steps.Trigger>
              <Steps.Separator />
            </Steps.Item>

            <Steps.Item index={1}>
              <Steps.Trigger>
                <Steps.Indicator>
                  <Steps.Number />
                </Steps.Indicator>
                <Steps.Title>Review</Steps.Title>
              </Steps.Trigger>
            </Steps.Item>
          </Steps.List>
        </Steps.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});

/**
 * @docs-section orientation
 * @docs-title Orientation Tests
 * @docs-description Verify orientation attribute propagates correctly
 * @docs-order 4
 */
describe("Steps - Orientation", () => {
  it("passes orientation to component elements", () => {
    const { container } = renderSteps({ orientation: "vertical" });

    // Check that the tablist has vertical orientation
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    // Separators should also have vertical orientation
    const separators = container.querySelectorAll('[data-slot="separator"]');
    expect(separators.length).toBe(2);
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });
  });

  it("defaults to horizontal orientation", () => {
    renderSteps();

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");
  });
});
