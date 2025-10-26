/**
 * Integration tests for routing functionality
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { NimbusProvider } from "@commercetools/nimbus";

// Simple test components
function HomePage() {
  return <div>Home Page</div>;
}

function AboutPage() {
  return <div>About Page</div>;
}

function NotFoundPage() {
  return <div>404 Not Found</div>;
}

// Helper to render with router
function renderWithRouter(initialRoute = "/") {
  return render(
    <NimbusProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </NimbusProvider>
  );
}

describe("Routing Integration", () => {
  it("renders home page on root path", () => {
    renderWithRouter("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders about page on /about path", () => {
    renderWithRouter("/about");
    expect(screen.getByText("About Page")).toBeInTheDocument();
  });

  it("renders 404 page for unknown routes", () => {
    renderWithRouter("/unknown-route");
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });

  it("handles multiple routes independently", () => {
    // Test home route
    const { unmount: unmountHome } = renderWithRouter("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    unmountHome();

    // Test about route independently
    const { unmount: unmountAbout } = renderWithRouter("/about");
    expect(screen.getByText("About Page")).toBeInTheDocument();
    unmountAbout();
  });
});
