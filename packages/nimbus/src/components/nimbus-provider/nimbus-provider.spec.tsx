import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NimbusProvider } from "./nimbus-provider";

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
