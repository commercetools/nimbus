import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProductLaunch } from "./journeys/ProductLaunch";
import { PricingReview } from "./journeys/PricingReview";
import { DiscountCampaign } from "./journeys/DiscountCampaign";
import { OrderInvestigation } from "./journeys/OrderInvestigation";
import { CategoryReorg } from "./journeys/CategoryReorg";
import { SelfDocumenting } from "./journeys/SelfDocumenting";

export const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/products/galaxy-s25-ultra" replace />} />
        <Route path="/products/galaxy-s25-ultra" element={<ProductLaunch />} />
        <Route path="/products/pricing" element={<PricingReview />} />
        <Route path="/discounts/summer-clearance" element={<DiscountCampaign />} />
        <Route path="/orders/mc-2026-847291" element={<OrderInvestigation />} />
        <Route path="/categories/phone-cases" element={<CategoryReorg />} />
        <Route path="/products/pour-over-kettle" element={<SelfDocumenting />} />
      </Route>
    </Routes>
  );
};
