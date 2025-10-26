/**
 * AppWithRouter Component
 *
 * Simplified wrapper component that provides React Router navigation to NimbusProvider.
 * This component runs inside BrowserRouter, so it has access to useNavigate and useHref.
 */

import { Outlet } from "react-router-dom";
import { Box } from "@commercetools/nimbus";

export function AppWithRouter() {
  return (
    <Box id="root-font-size-setting" fontSize="350">
      <Outlet />
    </Box>
  );
}
