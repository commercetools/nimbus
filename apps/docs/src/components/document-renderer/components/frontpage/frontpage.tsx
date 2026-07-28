import { Stack } from "@commercetools/nimbus";
import { Hero } from "./hero";
import { StatsBand } from "./stats-band";
import { DestinationCards } from "./destination-cards";
import { ComponentShowcase } from "./component-showcase";

/**
 * The docs home page: a full-width editorial stack. The home route opts out of
 * the standard 80ch reading column (see `AppFrameMainContent`), so these
 * sections span the wider content area on large screens.
 */
export const Frontpage = () => {
  return (
    <Stack gap="800">
      <Hero />
      <StatsBand />
      <DestinationCards />
      <ComponentShowcase />
    </Stack>
  );
};
