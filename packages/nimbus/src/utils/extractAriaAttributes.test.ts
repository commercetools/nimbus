import { describe, it, expect } from "vitest";
import { extractAriaAttributes } from "./extractAriaAttributes";

describe("extractAriaAttributes", () => {
  it("should extract aria attributes from props", () => {
    const props = {
      "aria-label": "Test label",
      "aria-describedby": "description-id",
      "aria-expanded": true,
      className: "test-class",
      id: "test-id",
      onClick: jest.fn(),
    };

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual({
      "aria-label": "Test label",
      "aria-describedby": "description-id",
      "aria-expanded": true,
    });

    expect(otherProps).toEqual({
      className: "test-class",
      id: "test-id",
      onClick: expect.any(Function),
    });
  });

  it("should handle objects with no aria attributes", () => {
    const props = {
      className: "test-class",
      id: "test-id",
      disabled: false,
    };

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual({});
    expect(otherProps).toEqual(props);
  });

  it("should handle objects with only aria attributes", () => {
    const props = {
      "aria-label": "Only aria",
      "aria-hidden": true,
      "aria-live": "polite",
    };

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual(props);
    expect(otherProps).toEqual({});
  });

  it("should handle empty objects", () => {
    const props = {};

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual({});
    expect(otherProps).toEqual({});
  });

  it("should not extract properties that contain 'aria' but don't start with 'aria-'", () => {
    const props = {
      "aria-label": "Valid aria attribute",
      ariaLabel: "Not a valid aria attribute",
      someAriaProperty: "Should not be extracted",
      "data-aria-test": "Should not be extracted",
    };

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual({
      "aria-label": "Valid aria attribute",
    });

    expect(otherProps).toEqual({
      ariaLabel: "Not a valid aria attribute",
      someAriaProperty: "Should not be extracted",
      "data-aria-test": "Should not be extracted",
    });
  });

  it("should preserve original props object immutability", () => {
    const originalProps = {
      "aria-label": "Test",
      className: "test",
    };
    const propsCopy = { ...originalProps };

    extractAriaAttributes(originalProps);

    // Original props should remain unchanged
    expect(originalProps).toEqual(propsCopy);
  });

  it("should handle various aria attribute types", () => {
    const props = {
      "aria-label": "string value",
      "aria-expanded": true,
      "aria-level": 2,
      "aria-selected": false,
      "aria-controls": null,
      "aria-describedby": undefined,
    };

    const [ariaAttributes, otherProps] = extractAriaAttributes(props);

    expect(ariaAttributes).toEqual({
      "aria-label": "string value",
      "aria-expanded": true,
      "aria-level": 2,
      "aria-selected": false,
      "aria-controls": null,
      "aria-describedby": undefined,
    });

    expect(otherProps).toEqual({});
  });
});
