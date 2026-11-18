import { Stack } from "@commercetools/nimbus";
import { Hero } from "./hero";
import { SectionCards } from "./section-cards";

/**
 * The docs start page: a hero and one illustrated card per main section. The
 * page uses `layout: wide`, so it spans the wide content column without a page
 * header or table of contents.
 */
export const Frontpage = () => {
  return (
    <Stack gap="800">
      <Hero />
      <SectionCards />
    </Stack>
  );
};
