import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RangeSlider, FormField, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the range slider renders two handles with the expected labels and values
 * @docs-order 1
 */
describe("RangeSlider - Basic rendering", () => {
  it("renders two handles with localized default labels when thumbLabels is omitted", () => {
    render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          defaultValue={[20, 60]}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveValue("20");
    expect(thumbs[1]).toHaveValue("60");
    expect(thumbs[0]).toHaveAttribute("aria-label", "Minimum");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Maximum");
  });

  it("uses custom thumbLabels when provided", () => {
    render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          thumbLabels={["Minimum price", "Maximum price"]}
          defaultValue={[20, 60]}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-label", "Minimum price");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Maximum price");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test keyboard interactions, the [number, number] onChange payload, and the non-crossing constraint
 * @docs-order 2
 */
describe("RangeSlider - Interactions", () => {
  it("calls onChange with a [number, number] tuple", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          defaultValue={[20, 60]}
          minValue={0}
          maxValue={100}
          onChange={handleChange}
        />
      </NimbusProvider>
    );

    const thumbs = screen.getAllByRole("slider");
    thumbs[0].focus();
    await user.keyboard("{ArrowRight}");

    expect(handleChange).toHaveBeenCalledWith([21, 60]);
  });

  it("keeps the lower handle from crossing the upper handle", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          defaultValue={[20, 60]}
          minValue={0}
          maxValue={100}
        />
      </NimbusProvider>
    );

    const thumbs = screen.getAllByRole("slider");
    thumbs[0].focus();
    await user.keyboard("{End}");

    const lower = Number((thumbs[0] as HTMLInputElement).value);
    const upper = Number((thumbs[1] as HTMLInputElement).value);
    expect(lower).toBeLessThanOrEqual(upper);
  });
});

/**
 * @docs-section states
 * @docs-title Testing States
 * @docs-description Verify disabled and invalid states render correctly
 * @docs-order 3
 */
describe("RangeSlider - States", () => {
  it("handles disabled state on both handles", () => {
    render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          defaultValue={[20, 60]}
          minValue={0}
          maxValue={100}
          isDisabled
        />
      </NimbusProvider>
    );

    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    thumbs.forEach((thumb) => expect(thumb).toBeDisabled());
  });

  it("surfaces the invalid state on the root element", () => {
    const { container } = render(
      <NimbusProvider>
        <RangeSlider
          aria-label="Price range"
          defaultValue={[20, 60]}
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
 * @docs-description Verify the range slider composes correctly inside FormField
 * @docs-order 4
 */
describe("RangeSlider - FormField integration", () => {
  it("surfaces the invalid state from FormField.Root", () => {
    const { container } = render(
      <NimbusProvider>
        <FormField.Root isInvalid>
          <FormField.Label>Price range</FormField.Label>
          <FormField.Input>
            <RangeSlider
              thumbLabels={["Minimum price", "Maximum price"]}
              defaultValue={[20, 60]}
              minValue={0}
              maxValue={100}
            />
          </FormField.Input>
          <FormField.Error>Range is out of bounds</FormField.Error>
        </FormField.Root>
      </NimbusProvider>
    );

    const root = container.querySelector('[data-slot="root"]');
    expect(root).toHaveAttribute("data-invalid", "true");
  });
});
