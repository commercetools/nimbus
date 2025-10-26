/**
 * Main App Component
 *
 * Uses React Router v7 with component-based declarative routing.
 * All routes are dynamically resolved from MDX file menu properties.
 */

import { lazy } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AppWithRouter } from "./components/app-with-router";
import { DynamicLayout } from "./layouts/dynamic-layout";
import { ManifestProvider } from "./contexts/manifest-context";
import { ErrorBoundary } from "./components/error-boundary";
import { NimbusProvider } from "@commercetools/nimbus";

// Single dynamic route that handles all paths based on manifest
const DynamicRoute = lazy(() => import("./routes/dynamic-route"));

function App() {
  const navigate = useNavigate();

  return (
    <NimbusProvider locale="en" router={{ navigate }}>
      <ManifestProvider>
        <Routes>
          <Route
            path="/"
            element={<AppWithRouter />}
            errorElement={<ErrorBoundary />}
          >
            <Route element={<DynamicLayout />} errorElement={<ErrorBoundary />}>
              {/* Catch-all route - dynamically resolves content from manifest */}
              <Route
                path="*"
                element={<DynamicRoute />}
                errorElement={<ErrorBoundary />}
              />
            </Route>
          </Route>
        </Routes>
      </ManifestProvider>
    </NimbusProvider>
  );
}

export default App;
