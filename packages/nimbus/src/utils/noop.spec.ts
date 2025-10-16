import { describe, it, expect, vi } from "vitest";
import { noop } from "./noop";

describe("noop", () => {
  it("should be a function", () => {
    expect(typeof noop).toBe("function");
  });

  it("should return undefined", () => {
    const result = noop();
    expect(result).toBeUndefined();
  });

  it("should not throw when called", () => {
    expect(() => noop()).not.toThrow();
  });

  it("should be usable as a callback", () => {
    const mockFn = vi.fn(noop);
    mockFn();
    expect(mockFn).toHaveBeenCalledOnce();
  });

  it("should work as a default prop value", () => {
    interface TestComponentProps {
      onClick?: () => void;
    }

    const TestComponent = ({ onClick = noop }: TestComponentProps) => {
      onClick();
      return null;
    };

    expect(() => TestComponent({})).not.toThrow();
  });
});
