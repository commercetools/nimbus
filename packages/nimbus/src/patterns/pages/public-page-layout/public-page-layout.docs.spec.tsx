import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PublicPageLayout, NimbusProvider, Text } from "@commercetools/nimbus";

/**
 * @docs-section basic-layout
 * @docs-title Render a basic login page layout
 * @docs-description Use PublicPageLayout to wrap a login form with a welcome heading and accessible landmark.
 * @docs-order 1
 */
describe("PublicPageLayout - Basic layout", () => {
  it("renders the welcome heading and content inside a main landmark", () => {
    render(
      <NimbusProvider>
        <PublicPageLayout
          welcomeMessage="Welcome to the Merchant Center"
          aria-label="Login page"
        >
          <Text>Login form</Text>
        </PublicPageLayout>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("main", { name: "Login page" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Welcome to the Merchant Center" })
    ).toBeInTheDocument();
    expect(screen.getByText("Login form")).toBeInTheDocument();
  });
});

/**
 * @docs-section with-legal-message
 * @docs-title Include a legal footer with copyright and links
 * @docs-description Pass a legalMessage to render legal content below the main content area.
 * @docs-order 2
 */
describe("PublicPageLayout - With legal message", () => {
  it("renders the legal footer alongside the main content", () => {
    render(
      <NimbusProvider>
        <PublicPageLayout
          welcomeMessage="Sign in"
          legalMessage={
            <Text fontSize="xs">
              © 2026 commercetools · Privacy Policy · Terms of Service
            </Text>
          }
        >
          <Text>Login form</Text>
        </PublicPageLayout>
      </NimbusProvider>
    );

    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
  });
});

/**
 * @docs-section wide-content
 * @docs-title Use wide content for multi-column registration forms
 * @docs-description Set contentWidth="wide" to give the content area more horizontal space for two-column layouts.
 * @docs-order 3
 */
describe("PublicPageLayout - Wide content", () => {
  it("renders a wider content area for two-column layouts", () => {
    render(
      <NimbusProvider>
        <PublicPageLayout
          welcomeMessage="Create your account"
          contentWidth="wide"
        >
          <div data-testid="two-columns" style={{ display: "flex", gap: 16 }}>
            <div>Column one</div>
            <div>Column two</div>
          </div>
        </PublicPageLayout>
      </NimbusProvider>
    );

    expect(screen.getByTestId("two-columns")).toBeInTheDocument();
    expect(screen.getByText("Column one")).toBeInTheDocument();
    expect(screen.getByText("Column two")).toBeInTheDocument();
  });
});
