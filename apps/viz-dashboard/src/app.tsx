import { Routes, Route } from "react-router-dom";
import { useColorMode } from "@commercetools/nimbus";
import { ChartThemeProvider, coerceColorMode } from "@commercetools/nimbus-viz";
import { AppShell } from "./shell/app-shell";
import { OverviewPage } from "./pages/overview";
import { SalesPage } from "./pages/sales";
import { ProductsPage } from "./pages/products";
import { CustomersPage } from "./pages/customers";
import { MarketingPage } from "./pages/marketing";
import { OperationsPage } from "./pages/operations";
import { FinancePage } from "./pages/finance";

export const App = () => {
  const { colorMode } = useColorMode();

  return (
    <ChartThemeProvider mode={coerceColorMode(colorMode)}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="operations" element={<OperationsPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </ChartThemeProvider>
  );
};
