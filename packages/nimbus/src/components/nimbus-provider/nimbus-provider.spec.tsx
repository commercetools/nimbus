import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NimbusProvider } from "./nimbus-provider";
import { Region, useRegion } from "@/components/region";

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

describe("NimbusProvider - theme script", () => {
  // The theme-initialization script that next-themes renders. React 19.3
  // logs "Encountered a script tag" for it when it is not a data block.
  const getThemeScript = (container: HTMLElement) =>
    container.querySelector("script");

  it("renders the theme script as a data block on the client", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { container } = render(
      <NimbusProvider loadFonts={false}>
        <div>Test content</div>
      </NimbusProvider>
    );

    const script = getThemeScript(container);
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute("type", "text/plain");

    // Fails on React >= 19.3 when the script is not a data block
    const scriptWarnings = consoleError.mock.calls.filter((args) =>
      String(args[0]).includes("Encountered a script tag")
    );
    expect(scriptWarnings).toHaveLength(0);

    consoleError.mockRestore();
  });

  it("merges consumer scriptProps and lets a consumer type win", () => {
    const { container } = render(
      <NimbusProvider
        loadFonts={false}
        scriptProps={{ type: "application/json", "data-custom": "yes" }}
      >
        <div>Test content</div>
      </NimbusProvider>
    );

    const script = getThemeScript(container);
    expect(script).toHaveAttribute("type", "application/json");
    expect(script).toHaveAttribute("data-custom", "yes");
  });

  it("keeps the data-block type when consumer scriptProps omit type", () => {
    const { container } = render(
      <NimbusProvider loadFonts={false} scriptProps={{ "data-custom": "yes" }}>
        <div>Test content</div>
      </NimbusProvider>
    );

    const script = getThemeScript(container);
    expect(script).toHaveAttribute("type", "text/plain");
    expect(script).toHaveAttribute("data-custom", "yes");
  });
});
