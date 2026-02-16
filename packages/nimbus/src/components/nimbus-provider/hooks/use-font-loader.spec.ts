import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFontLoader } from "./use-font-loader";

describe("useFontLoader", () => {
  let appendSpy: ReturnType<typeof vi.spyOn>;
  let querySelectorSpy: ReturnType<typeof vi.spyOn>;
  let createdElements: HTMLLinkElement[] = [];

  beforeEach(() => {
    // Track created elements for assertions
    createdElements = [];
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === "link") {
        createdElements.push(element as HTMLLinkElement);
      }
      return element;
    });

    // Mock document.head methods
    appendSpy = vi
      .spyOn(document.head, "append")
      .mockImplementation(() => undefined);
    querySelectorSpy = vi
      .spyOn(document, "querySelector")
      .mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    createdElements = [];
  });

  it("should inject font links when enabled is true", () => {
    renderHook(() => useFontLoader(true));

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(appendSpy).toHaveBeenCalledWith(
      expect.any(HTMLLinkElement),
      expect.any(HTMLLinkElement),
      expect.any(HTMLLinkElement)
    );
    expect(createdElements).toHaveLength(3);
  });

  it("should not inject font links when enabled is false", () => {
    renderHook(() => useFontLoader(false));

    expect(appendSpy).not.toHaveBeenCalled();
    expect(createdElements).toHaveLength(0);
  });

  it("should create preconnect link for fonts.googleapis.com", () => {
    renderHook(() => useFontLoader(true));

    const preconnect1 = createdElements.find(
      (el) =>
        el.rel === "preconnect" && el.href === "https://fonts.googleapis.com/"
    );

    expect(preconnect1).toBeDefined();
    // First preconnect does not have crossorigin attribute
    expect(preconnect1?.hasAttribute("crossorigin")).toBe(false);
  });

  it("should create preconnect link for fonts.gstatic.com with crossorigin", () => {
    renderHook(() => useFontLoader(true));

    const preconnect2 = createdElements.find(
      (el) =>
        el.rel === "preconnect" && el.href === "https://fonts.gstatic.com/"
    );

    expect(preconnect2).toBeDefined();
    expect(preconnect2?.crossOrigin).toBe("");
  });

  it("should create stylesheet link with correct URL and attributes", () => {
    renderHook(() => useFontLoader(true));

    const stylesheet = createdElements.find((el) => el.rel === "stylesheet");

    expect(stylesheet).toBeDefined();
    expect(stylesheet?.href).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    );
    expect(stylesheet?.getAttribute("data-nimbus-fonts")).toBe("");
  });

  it("should not inject duplicate links when fonts already exist", () => {
    // Mock existing font link
    querySelectorSpy.mockReturnValue(document.createElement("link"));

    renderHook(() => useFontLoader(true));

    expect(appendSpy).not.toHaveBeenCalled();
    expect(querySelectorSpy).toHaveBeenCalledWith("[data-nimbus-fonts]");
  });

  it("should remove injected links on unmount", () => {
    const { unmount } = renderHook(() => useFontLoader(true));

    expect(appendSpy).toHaveBeenCalledTimes(1);

    // Mock remove method on created elements
    const removeMocks = createdElements.map((el) =>
      vi.spyOn(el, "remove").mockImplementation(() => undefined)
    );

    unmount();

    removeMocks.forEach((mock) => {
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  it("should re-inject fonts when enabled changes from false to true", () => {
    const { rerender } = renderHook(({ enabled }) => useFontLoader(enabled), {
      initialProps: { enabled: false },
    });

    expect(appendSpy).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(createdElements).toHaveLength(3);
  });

  it("should clean up fonts when enabled changes from true to false", () => {
    const { rerender } = renderHook(({ enabled }) => useFontLoader(enabled), {
      initialProps: { enabled: true },
    });

    expect(appendSpy).toHaveBeenCalledTimes(1);

    // Mock remove method on created elements
    const removeMocks = createdElements.map((el) =>
      vi.spyOn(el, "remove").mockImplementation(() => undefined)
    );

    rerender({ enabled: false });

    removeMocks.forEach((mock) => {
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });
});
