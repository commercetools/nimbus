import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
// Import everything from the package so NimbusProvider and Region/useRegion
// share a single module instance (one Region context). In the JSDOM unit
// config `@commercetools/nimbus` resolves to the built dist; importing
// NimbusProvider relatively (source) here would give it a *different* Region
// context than the dist `useRegion`, so the ambient scope would silently fail
// to connect and the projected content would never render.
import { NimbusProvider, Region, useRegion } from "@commercetools/nimbus";

describe("NimbusProvider - Font Loading", () => {
  it("should render children with default loadFonts=true", () => {
    const { getByText } = render(
      <NimbusProvider>
        <div>Test content</div>
      </NimbusProvider>
    );

    expect(getByText("Test content")).toBeInTheDocument();
  });

  it("should render children when loadFonts is false", () => {
    const { getByText } = render(
      <NimbusProvider loadFonts={false}>
        <div>Test content</div>
      </NimbusProvider>
    );

    expect(getByText("Test content")).toBeInTheDocument();
  });

  it("should render children regardless of loadFonts value", () => {
    const { getByText: getByTextEnabled } = render(
      <NimbusProvider loadFonts={true}>
        <div>With fonts</div>
      </NimbusProvider>
    );

    const { getByText: getByTextDisabled } = render(
      <NimbusProvider loadFonts={false}>
        <div>Without fonts</div>
      </NimbusProvider>
    );

    expect(getByTextEnabled("With fonts")).toBeInTheDocument();
    expect(getByTextDisabled("Without fonts")).toBeInTheDocument();
  });
});

describe("NimbusProvider - Ambient Region scope", () => {
  it("lets useRegion / <Region> work without an explicit Region.Provider", () => {
    const Filler = () => {
      const { Region: Slot } = useRegion("ambient-test");
      return (
        <Slot>
          <span>projected content</span>
        </Slot>
      );
    };

    const { getByText } = render(
      <NimbusProvider>
        <Filler />
        <Region name="ambient-test" data-testid="ambient-target" />
      </NimbusProvider>
    );

    // The projected content resolves into the ambient region's target, proving
    // NimbusProvider supplies the Region scope.
    expect(getByText("projected content")).toBeInTheDocument();
  });
});
