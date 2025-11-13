import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import { BrowserRouter } from "react-router";

// Enable granular HMR for MDX files instead of full page reloads
if (import.meta.hot) {
  import("virtual:mdx-hmr-client");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
