/**
 * Main App Component
 *
 * Uses React Router v7 with component-based declarative routing.
 * All routes are dynamically resolved from MDX file menu properties.
 */

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AppWithRouter } from "./components/app-with-router";
import { DynamicLayout } from "./layouts/dynamic-layout";
import { ManifestProvider } from "./contexts/manifest-context";
import { ErrorBoundary } from "./components/error-boundary";
import { NimbusProvider } from "@commercetools/nimbus";
import DynamicRoute from "./routes/dynamic-route";

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
              {/* Redirect root to /home */}
              <Route index element={<Navigate to="/home" replace />} />
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
