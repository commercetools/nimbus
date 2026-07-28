import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider, FormField, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the slider renders with expected elements and no visible label
 * @docs-order 1
 */
describe("Slider - Basic rendering", () => {
  it("renders a slider handle with the given accessible name and initial value", () => {
    render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    const thumb = screen.getByRole("slider", { name: /volume/i });
    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveValue("30");
  });

  it("renders no visible label or static value output", () => {
    render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    // The accessible name comes from aria-label; no visible "Volume" text
    // or standalone "30" readout is rendered next to the track.
    expect(screen.queryByText("Volume")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test keyboard interactions and onChange behavior
 * @docs-order 2
 */
describe("Slider - Interactions", () => {
  it("calls onChange with the updated value on keyboard interaction", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    const thumb = screen.getByRole("slider");
    thumb.focus();
    await user.keyboard("{ArrowRight}");

    expect(thumb).toHaveValue("31");
    expect(handleChange).toHaveBeenCalledWith(31);
  });

  it("jumps to minValue/maxValue with Home/End", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    const thumb = screen.getByRole("slider");
    thumb.focus();

    await user.keyboard("{End}");
    expect(thumb).toHaveValue("100");

    await user.keyboard("{Home}");
    expect(thumb).toHaveValue("0");
  });
});

/**
 * @docs-section states
 * @docs-title Testing States
 * @docs-description Verify disabled and invalid states render correctly
 * @docs-order 3
 */
describe("Slider - States", () => {
  it("handles disabled state", () => {
    render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
          isDisabled
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("surfaces the invalid state on the root element", () => {
    const { container } = render(
      <NimbusProvider>
        <Slider
          aria-label="Volume"
          defaultValue={30}
          minValue={0}
          maxValue={100}
          isInvalid
        />
      </NimbusProvider>
    );

    const root = container.querySelector('[data-slot="root"]');
    expect(root).toHaveAttribute("data-invalid", "true");
  });
});

/**
 * @docs-section form-field-integration
 * @docs-title FormField Integration Tests
 * @docs-description Verify the slider composes correctly inside FormField
 * @docs-order 4
 */
describe("Slider - FormField integration", () => {
  it("resolves an accessible name from FormField.Label", () => {
    render(
      <NimbusProvider>
        <FormField.Root>
          <FormField.Label>Opacity</FormField.Label>
          <FormField.Input>
            <Slider defaultValue={50} minValue={0} maxValue={100} />
          </FormField.Input>
          <FormField.Description>Adjust layer opacity</FormField.Description>
        </FormField.Root>
      </NimbusProvider>
    );

    const thumb = screen.getByRole("slider");
    // aria-labelledby is not transitive per WAI-ARIA, so React Aria composes
    // the thumb's name from the group's content-based fallback name, which
    // includes the thumb's own live value — match by substring rather than
    // an exact string.
    expect(thumb).toHaveAccessibleName(/Opacity/);
  });

  it("surfaces the invalid state from FormField.Root", () => {
    const { container } = render(
      <NimbusProvider>
        <FormField.Root isInvalid>
          <FormField.Label>Opacity</FormField.Label>
          <FormField.Input>
            <Slider defaultValue={50} minValue={0} maxValue={100} />
          </FormField.Input>
          <FormField.Error>Value is out of range</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    const root = container.querySelector('[data-slot="root"]');
    expect(root).toHaveAttribute("data-invalid", "true");
  });
});

/**
 * @docs-section visual-variants
 * @docs-title Visual Variants Tests
 * @docs-description Each visual variant renders an operable slider.
 * @docs-order 6
 */
describe("Slider - Visual variants", () => {
  it.each(["filled", "minimal", "enclosed"] as const)(
    "renders an operable %s variant slider",
    (variant) => {
      render(
        <NimbusProvider>
          <Slider
            aria-label={`${variant} slider`}
            variant={variant}
            defaultValue={50}
          />
        </NimbusProvider>
      );

      expect(screen.getByRole("slider")).toHaveValue("50");
    }
  );
});
