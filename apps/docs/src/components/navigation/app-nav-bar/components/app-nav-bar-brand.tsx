import { activeRouteAtom } from "@/atoms/route.ts";
import { Box, Text } from "@nimbus/react";
import { useAtom, useAtomValue } from "jotai";
import { MouseEvent } from "react";
import { brandNameAtom } from "@/atoms/brand.ts";

/**
 * Component for the brand section of the app navigation bar.
 * Displays the "Nimbus" brand name and allows navigation to home.
 */
export const AppNavBarBrand = () => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const brandName = useAtomValue(brandNameAtom);

  /**
   * Handles click events on the brand name span to navigate home.
   * @param e - The mouse event.
   */
  const handleHomeRequest = (e: MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setActiveRoute("home");
  };

  return (
    <Box pt="200" pb="200" cursor="pointer" onClick={handleHomeRequest}>
      <Text textStyle="2xl" asChild fontWeight="700">
        <a href="/home">{brandName}</a>
      </Text>
    </Box>
  );
};
