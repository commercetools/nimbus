import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { TourProvider } from "./components/Tour";
import { JourneyProvider } from "./components/JourneyContext";
import { Homepage } from "./views/Homepage";
import { ProductList } from "./views/ProductList";
import { ProductDetail } from "./views/ProductDetail";
import { DiscountList } from "./views/DiscountList";
import { DiscountDetail } from "./views/DiscountDetail";
import { ConfigPlayground } from "./views/ConfigPlayground";

export const App = () => {
  return (
    <JourneyProvider>
      <TourProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Homepage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/discounts" element={<DiscountList />} />
            <Route path="/discounts/:discountId" element={<DiscountDetail />} />
            <Route path="/playground" element={<ConfigPlayground />} />
          </Route>
        </Routes>
      </TourProvider>
    </JourneyProvider>
  );
};
