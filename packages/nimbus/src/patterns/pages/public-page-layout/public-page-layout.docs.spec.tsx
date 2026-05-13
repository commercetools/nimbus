import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Button,
  Link,
  NimbusProvider,
  PublicPageLayout,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";

/**
 * @docs-section login-form-integration
 * @docs-title Integrate a login form with PublicPageLayout
 * @docs-description Wrap a login form built with Nimbus components and verify it is accessible inside the main landmark.
 * @docs-order 1
 */
describe("PublicPageLayout - Login form integration", () => {
  it("renders a login form inside the layout with accessible landmark", () => {
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <NimbusProvider>
        <PublicPageLayout
          welcomeMessage="Sign in to your account"
          aria-label="Login page"
        >
          <Stack
            as="form"
            aria-label="Login form"
            onSubmit={handleSubmit}
            gap="400"
          >
            <TextInput label="Email" type="email" />
            <TextInput label="Password" type="password" />
            <Button type="submit">Sign in</Button>
          </Stack>
        </PublicPageLayout>
      </NimbusProvider>
    );

    const main = screen.getByRole("main", { name: "Login page" });
    expect(main).toBeInTheDocument();

    const form = screen.getByRole("form", { name: "Login form" });
    expect(main.contains(form)).toBe(true);
  });
});

/**
 * @docs-section stateful-auth-flow
 * @docs-title Handle authentication state with PublicPageLayout
 * @docs-description Show how PublicPageLayout works with state-driven auth flows that toggle between login and success views.
 * @docs-order 2
 */
describe("PublicPageLayout - Stateful auth flow", () => {
  function AuthPage() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
      <PublicPageLayout
        welcomeMessage={loggedIn ? "Welcome back!" : "Sign in"}
        aria-label="Authentication page"
      >
        {loggedIn ? (
          <Text>You are signed in.</Text>
        ) : (
          <Button onPress={() => setLoggedIn(true)}>Log in</Button>
        )}
      </PublicPageLayout>
    );
  }

  it("updates the welcome message after login", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <AuthPage />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Sign in" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByRole("heading", { name: "Welcome back!" })
    ).toBeInTheDocument();
    expect(screen.getByText("You are signed in.")).toBeInTheDocument();
  });
});

/**
 * @docs-section legal-footer-with-links
 * @docs-title Add legal links below the content area
 * @docs-description Use legalMessage with Nimbus Link components to render accessible legal links below the content area.
 * @docs-order 3
 */
describe("PublicPageLayout - Legal footer with links", () => {
  it("renders legal links that are accessible alongside the form", () => {
    render(
      <NimbusProvider>
        <PublicPageLayout
          welcomeMessage="Create your account"
          legalMessage={
            <Text fontSize="xs" color="neutral.11">
              © 2026 commercetools · <Link href="/privacy">Privacy Policy</Link>
              {" · "}
              <Link href="/terms">Terms of Service</Link>
            </Text>
          }
        >
          <Text>Registration form</Text>
        </PublicPageLayout>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("link", { name: "Privacy Policy" })
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getByRole("link", { name: "Terms of Service" })
    ).toHaveAttribute("href", "/terms");
  });
});
