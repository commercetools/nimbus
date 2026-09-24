import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { App } from "./app";
import { NimbusProvider } from "@commercetools/nimbus";

// NimbusProvider must sit inside BrowserRouter to read react-router's
// useNavigate hook. Wiring it into the `router` prop lets every Nimbus
// component that accepts `href` (Link, DefaultPage.BackLink, etc.) perform
// client-side navigation instead of a full page reload.
const Providers = () => {
  const navigate = useNavigate();

  return (
    <NimbusProvider router={{ navigate }}>
      <App />
    </NimbusProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Providers />
    </BrowserRouter>
  </StrictMode>
);
