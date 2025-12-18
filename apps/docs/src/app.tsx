/**
 * Main App Component
 *
 * Uses React Router v7 with component-based declarative routing.
 * All routes are dynamically resolved from MDX file menu properties.
 */

import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { DynamicLayout } from "./layouts/dynamic-layout";
import { ManifestProvider } from "./contexts/manifest-context";
import { BreadcrumbProvider } from "./contexts/breadcrumb-context";
import { ErrorBoundary } from "./components/error-boundary";
import { NimbusProvider, Box } from "@commercetools/nimbus";
import DynamicRoute from "./routes/dynamic-route";

function App() {
  const navigate = useNavigate();
  const locale = navigator.language || "en";

  // NimbusProvider automatically loads translation messages from
  // @commercetools/nimbus-i18n for the given locale. No additional setup needed.
  return (
    <NimbusProvider locale={locale} router={{ navigate }}>
      <ManifestProvider>
        <BreadcrumbProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Box fontSize="350">
                  <Outlet />
                </Box>
              }
              errorElement={<ErrorBoundary />}
            >
              <Route
                element={<DynamicLayout />}
                errorElement={<ErrorBoundary />}
              >
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
        </BreadcrumbProvider>
      </ManifestProvider>
    </NimbusProvider>
  );
}

export default App;
