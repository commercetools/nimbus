import { Box } from "@commercetools/nimbus";
import { FeaturedDiscounts } from "./components/featured-discounts";
import { Hero } from "./components/hero";
import { RecentlyUsedTemplates } from "./components/recently-used-templates";
import { GettingStartedTemplates } from "./components/getting-started-templates";

export const App = () => {
  return (
    <Box
      p="25px"
      // minHeight="100vh"
    >
      <Hero />
      <FeaturedDiscounts />
      <RecentlyUsedTemplates />

      <GettingStartedTemplates />
    </Box>
  );
};
