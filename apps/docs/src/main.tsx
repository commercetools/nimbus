import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { BrowserRouter } from "react-router-dom";

// Enable granular HMR for MDX files instead of full page reloads
if (import.meta.hot) {
  import("virtual:mdx-hmr-client");
}

// Agentation toolbar: annotate page elements and copy the context for an AI
// agent. Loaded only by the dev server; production builds drop the import.
const Agentation = import.meta.env.DEV
  ? lazy(() =>
      import("agentation").then((module) => ({ default: module.Agentation }))
    )
  : null;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {Agentation && (
      <Suspense fallback={null}>
        <Agentation appName="Nimbus docs" endpoint="http://localhost:4747" />
      </Suspense>
    )}
  </StrictMode>
);
